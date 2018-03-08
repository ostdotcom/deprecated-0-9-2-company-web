;
(function (window, $) {
  var transactions  = ns("ost.transactions");
  var currentData = null;
  var oThis = transactions.editor = {
    /* Properties that should be provided in init method call */
    defaultData         : null          /* Mandetory */
    , fiat_symbol       : "$"
    , fiat_type         : "USD"
    , createUrl         : "/api/economy/transaction/kind/create"
    , editUrl           : "/api/economy/transaction/kind/edit"
    , eventContext      : transactions

    /* Events */
    , events : {
      "updated"   : "updated"
      , "created" : "created"
    }

    , txKindMap: {
      user_to_company: "user_to_company",
      company_to_user: "company_to_user",
      user_to_user: "user_to_user"
    }

    , inputNameKeys: {
      tx_kind               : "kind"
      , has_commission      : "has_commission"
      , commission_percent  : "commission_percent"
      , commission_in_bt    : "commission_in_bt"
      , commission_in_fiat  : "commission_in_fiat"
    }

    , formHelper      : null
    , jEditor         : null
    , jForm           : null
    , jHeading        : null
    , jCreateHeading  : null
    , jEditHeading    : null
    , jSubmit         : null 
    , jId             : null
    , jDeviceId       : null
    , jName           : null
    , jValueInFiat    : null
    , jValueInBt      : null
    , jValueInOst     : null
    , jHasCommission  : null
    , jCommissionRow  : null
    , jCommission     : null
    , jCommissionWrap : null
    , jCInFiat        : null
    , jCInBt          : null

    ,maxTransactionVal: null

    , init: function ( config ) {
      var oThis = this;

      $.extend(oThis, config);

      oThis.jEditor         = oThis.jEditor         || $("#transaction_editor");
      oThis.jForm           = oThis.jForm           || oThis.jEditor.find("#transaction_editor_form");
      oThis.jHeading        = oThis.jHeading        || oThis.jForm.find("#transaction_editor_mode_heading");
      oThis.jCreateHeading  = oThis.jCreateHeading  || oThis.jForm.find("#transaction_heading_create");
      oThis.jEditHeading    = oThis.jEditHeading    || oThis.jForm.find("#transaction_heading_update");
      oThis.jSubmit         = oThis.jSubmit         || oThis.jForm.find("#transaction_editor_submit_btn");
      oThis.jId             = oThis.jId             || oThis.jForm.find("#transaction_id");
      oThis.jDeviceId       = oThis.jDeviceId       || oThis.jForm.find("#transaction_device_id");
      oThis.jName           = oThis.jName           || oThis.jForm.find("#transaction_name");
      oThis.jValueInFiat    = oThis.jValueInFiat    || oThis.jForm.find("#value_in_fiat");
      oThis.jValueInBt      = oThis.jValueInBt      || oThis.jForm.find("#value_in_bt");
      oThis.jValueInOst     = oThis.jValueInOst     || oThis.jForm.find("#value_in_ost");
      oThis.jCommissionRow  = oThis.jCommissionRow  || oThis.jForm.find("#commission-options-row");
      oThis.jCommission     = oThis.jCommission     || oThis.jForm.find("#commission_percent");
      oThis.jCommissionWrap = oThis.jCommissionWrap || oThis.jForm.find("#commission_percent_wrap");
      oThis.jCInFiat        = oThis.jCInFiat        || oThis.jForm.find("#commission_in_fiat");
      oThis.jCInBt          = oThis.jCInBt          || oThis.jForm.find("#commission_in_bt");

      oThis.maxTransactionVal = oThis.maxTransactionVal || 100 ;

      oThis.formHelper = oThis.jForm.formHelper();
      oThis.formHelper.success = function () {
        oThis.onSuccess.apply( oThis, arguments);
      };

      oThis.bindEvents();
    }

    , bindEvents: function () {
      var oThis = this;

      $("#transaction_editor_cancel_btn").on("click", function ( event ) {
        oThis.completeEditSession();
      });

      $( oThis.jForm ).on(oThis.formHelper.getBeforeSubmitEventName(), function ( event, ajaxConfig ) {
        var ajaxData = ajaxConfig.data;
        oThis.correctPostUrl( ajaxConfig );
        oThis.correctCommissionData( ajaxData );
      });

      oThis.jForm.find('[name="currency_type"]').change( function () {
        oThis.toggleCurrencyInput.apply(oThis, arguments);
      });

      oThis.jForm.find('.j-tx-kind').change( function () {
        oThis.toggleCommissionsRow.apply(oThis, arguments);
      });

      oThis.jForm.find('.j-has-commission').change( function () {
        var val = Number( this.value );
        console.log("this.value", this.value);
        if( val ) {
          //Some truthy value
          oThis.jCommissionWrap.slideDown( 300 );
        } else {
          //Some falsey value
          oThis.jCommissionWrap.slideUp( 300 );
        }
      });


      oThis.jCommission.add( oThis.jValueInOst ).on("change", function ( event ) {
        console.log("calling onCommissionChanged event", event.currentTarget );
        oThis.onCommissionChanged.apply( oThis, arguments );
      });

      PriceOracle.bindCurrencyElements( oThis.jValueInBt , oThis.jValueInFiat , oThis.jValueInOst );
    }

    , createNewTransaction: function ( transactionData ) {
      var oThis = this;

      if ( transactionData ) {
        currentData = transactionData;
      } else {
        currentData = $.extend({}, oThis.defaultData);
        currentData.id = Date.now() * -1;
      }

      //Update Heading
      oThis.jHeading.text( oThis.jCreateHeading.val() );

      //Update Submit Button Text
      oThis.jSubmit.text("Add Transaction")
        .data( "submiting", "Adding...")
      ;

      //Update the action url
      oThis.jForm.attr("action", oThis.createUrl );

      //Fill the form
      oThis.fillForm();

      //Show the editor
      oThis.showEditor();
      
    }

    , editTransaction: function ( transactionData ) {
      var oThis = this;

      //DO NOT CREATE A COPY. KEEP THE OBJECT REFRENCE SAME
      currentData = transactionData;

      //Update Heading
      oThis.jHeading.text( oThis.jEditHeading.val() );

      //Update Submit Button Text
      oThis.jSubmit.text("Update Transaction")
        .data( "submiting", "Updating...")
      ;

      //Update the action url
      oThis.jForm.attr("action", oThis.editUrl );

      //Fill the form
      oThis.fillForm();

      //Show the editor
      oThis.showEditor();

      oThis.toggleCurrencyInput();
      oThis.toggleCommissionsRow();
    }
    , fillForm: function () {
      var oThis = this;

      //clear errors
      oThis.formHelper.clearErrors();

      //id & device_id
      oThis.jId.val( currentData.id );
      oThis.jDeviceId.val( currentData.id );

      //kind
      if ( currentData.kind ){
        oThis.jForm.find("#kind_" + currentData.kind ).prop("checked", true);
      } else {
        oThis.jForm.find("[name='kind']").prop("checked", false);
      }

      //name
      oThis.jName.val( currentData.name || "" );


      //use_price_oracle
      var isBtCurrencyType = currentData.currency_type === "BT";
      var currency_type_id;
      var currency_value = currentData.currency_value;

      if ( currentData.currency_type === "BT" ) {
          currency_type_id = "#currency_type_bt";
          oThis.jValueInBt.safeSetVal( PriceOracle.toBt( currency_value ) );
      } else {
          currency_type_id ="#currency_type_fiat";
          console.log("currency_value", currency_value);
          oThis.jValueInFiat.safeSetVal( PriceOracle.toFiat( currency_value ) );
      }

      oThis.jForm.find( currency_type_id )
        .prop("checked", true)
        .trigger("change")
      ;

      //commission_percent
      var commission_percent = Number( currentData.commission_percent );
      commission_percent = isNaN( commission_percent ) ? 0 : commission_percent;
      commission_percent = commission_percent;
      

      var has_commission_id, display_commission_percent;
      display_commission_percent = commission_percent || 1;
      
      if ( commission_percent ) {
        has_commission_id = "#has_commission_yes";
        oThis.jCommissionWrap.show();
      } else {
        has_commission_id = "#has_commission_no";
        oThis.jCommissionWrap.hide();
      }
      oThis.jForm.find( has_commission_id )
        .prop("checked", true)
      ;
      oThis.jCommission.safeSetVal( display_commission_percent );
      //Use currentData.
    }
    , showEditor: function () {
      var oThis = this;

      ost.coverElements.show( oThis.jEditor );
    }
    , cleanUp: function () {
      var oThis = this;
      currentData = null;
    }
    , hideEditor: function () {
      var oThis = this;

      ost.coverElements.hide( oThis.jEditor );
    }

    , correctCommissionData: function ( ajaxData ) {
      var oThis = this;

      var nameKeys        = oThis.inputNameKeys
        , tx_kind         = oThis.getDataFromAjaxData( nameKeys.tx_kind , ajaxData )
        , has_commission  = oThis.getDataFromAjaxData( nameKeys.has_commission , ajaxData )
      ;

      has_commission = Number( has_commission );


      if ( oThis.txKindMap.user_to_user !== tx_kind || !has_commission ) {
        oThis.setDataInAjaxData(nameKeys.has_commission, 0, ajaxData);
        oThis.setDataInAjaxData(nameKeys.commission_percent, 0, ajaxData);
        oThis.setDataInAjaxData(nameKeys.commission_in_bt, 0, ajaxData);
        oThis.setDataInAjaxData(nameKeys.commission_in_fiat, 0, ajaxData);
      }

    }

    , correctPostUrl : function ( ajaxConfig ) {
      var oThis = this;

      var client_transaction_id = oThis.getDataFromAjaxData( "client_transaction_id", ajaxConfig.data );
      client_transaction_id = Number( client_transaction_id );
      if ( isNaN( client_transaction_id ) ) {
        client_transaction_id = 0;
      }

      if ( client_transaction_id < 0 ) {
        ajaxConfig.url = oThis.createUrl;
      } else {
        ajaxConfig.url = oThis.editUrl;
      }
    }

    , getDataFromAjaxData: function ( keyName, ajaxData ) {
      var oThis = this;

      var dataIndex = oThis.findDataIndex(keyName, ajaxData)
      ;
      if ( dataIndex < 0 ) {
        return null;
      }

      var data = ajaxData[ dataIndex ];
      if ( !data ) {
        return null;
      }

      return data.value;


    }

    , setDataInAjaxData: function ( keyName, val, ajaxData, dataIndex ) {
      var oThis = this;

      dataIndex = dataIndex || oThis.findDataIndex(keyName, ajaxData);

      if ( dataIndex < 0 ) {
        return false;
      }

      var data = ajaxData[ dataIndex ];
      if ( !data ) {
        return false;
      }

      data.value = val;

      return true;
    }

    , findDataIndex : function ( keyName, ajaxData ) {
      var oThis = this;

      var dataIndex = -1;
      $.each(ajaxData, function (index, data) {
        if ( data.name == keyName ) {
          dataIndex = index;
          return false;
        }
      });
      return dataIndex;
    }

    , onSuccess : function ( response, textStatus, jqXHR ) {
      var oThis = this;

      console.log("onSuccess",  arguments );
      if ( response.success ) {
        

        var data          = response.data || {}
          , transactions  = data.transactions || []
          , newData       = transactions[ 0 ]
          , device_id
        ;

        if ( !newData ) {
          console.log("transaction data missing :-/");
          return;
        }

        device_id = newData.device_id = newData.device_id || oThis.jDeviceId.val();
        device_id = Number( device_id );
        device_id = isNaN( device_id ) ? 0 : device_id;

        $.extend( currentData, newData);


        if ( device_id < 1 ) {
          //New entry created.
          oThis.fireEvent("created", [currentData, newData, device_id]);
        } else {
          //Existing Entry edited.
          oThis.fireEvent("updated", [currentData, newData, device_id]);
        }

        oThis.completeEditSession();
      }
    }

    , fireEvent: function ( eventKey, data ) {
      var oThis = this;

      var eventContext  = oThis.eventContext
        , eventName     = oThis.events[ eventKey ]
      ;

      if ( !eventContext || !eventName ) {
        console.log("fireEvent. Something is missing", eventContext, eventName, eventKey);
        return;
      }
      console.log("firing ", eventName, data);
      $( eventContext ).trigger(eventName, (data || []) );
    }

    , completeEditSession: function () {
      var oThis = this;

      // oThis.cleanUp();
      oThis.hideEditor();
    }

    , toggleCurrencyInput: function () {
      var oThis = this;
      
      var jEl       = oThis.jForm.find('input[name=currency_type]:checked')
        , val       = jEl.val()
        , jEnable
        , jDisable
        , jShow
        , jHide
      ;

      if ( val === "BT" ) {
        jEnable   = oThis.jValueInBt;
        jDisable  = oThis.jValueInFiat;
        jShow     = $("#currency_type_bt_help_text");
        jHide     = $("#currency_type_fiat_help_text");
      } else {
        jEnable   = oThis.jValueInFiat;
        jDisable  = oThis.jValueInBt;
        jShow     = $("#currency_type_fiat_help_text");
        jHide     = $("#currency_type_bt_help_text");
      }

      jDisable.prop('disabled', true);
      jDisable.removeAttr('max');
      jEnable.prop('disabled', false);
      jEnable.attr('max' , oThis.maxTransactionVal );
      jShow.show();
      jHide.hide();
    }

    , toggleCommissionsRow: function () {
      var oThis = this;

      var jEl       = oThis.jForm.find('.j-tx-kind:checked')
        , val       = jEl.val()
      ;

      if ( oThis.txKindMap.user_to_user === val ) {
        oThis.jCommissionRow.slideDown( 300 );
      } else {
        oThis.jCommissionRow.slideUp( 300 );
      }

    }

    , onCommissionChanged: function () {
      var oThis = this;

      var vCommission = oThis.jCommission.val()
        , vFiat       = oThis.jValueInFiat.val()
        , vBt         = oThis.jValueInBt.val()
        , cInFiat
        , cInBt
      ;

      if ( PriceOracle.isNaN( vCommission ) ) {
        vCommission = 0;
        oThis.jCInFiat.setVal("");
        oThis.jCInBt.setVal("");
        return;
      }

      if ( PriceOracle.isNaN( vFiat ) ) {
        vFiat = 0;
      }

      if ( PriceOracle.isNaN( vBt ) ) {
        vBt = 0;
      }

      vCommission = BigNumber( vCommission );
      vFiat       = BigNumber( vFiat );
      vBt         = BigNumber( vBt );

      cInFiat     = vFiat.times( vCommission ).div( 100 );
      cInBt       = vBt.times( vCommission ).div( 100 );

      oThis.jCInFiat.setVal( PriceOracle.toFiat( cInFiat ) );
      oThis.jCInBt.setVal( PriceOracle.toBt( cInBt ) );

    }

  };
})(window, jQuery);