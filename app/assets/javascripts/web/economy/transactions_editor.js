;
(function (window, $) {
  var transactions  = ns("ost.transactions");
  var currentData = null;
  var oThis = transactions.editor = {
    defaultData         : null          /* Will be provided in init method call */
    , ost_to_bt         : 10            /* Will be provided in init method call */
    , ost_to_fiat       : 1.1           /* Will be provided in init method call */
    , bt_to_fiat        : 11            /* Will be provided in init method call */
    , fiat_symbol       : "$"
    , fiat_type         : "usd"
    , value_in_fiat_key : "value_in_usd"
    , createUrl         : "/api/economy/transaction/kind/create"
    , editUrl           : "/api/economy/transaction/kind/edit"
    , eventContext      : transactions

    , events : {
      "updated"   : "updated"
      , "created" : "created"
    }

    , formHelper      : null
    , jEditor         : null
    , jForm           : null
    , jHeading        : null
    , jSubmit         : null 
    , jId             : null
    , jDeviceId       : null
    , jName           : null
    , jValueInFiat    : null
    , jValueInBt      : null
    , jValueInOst     : null
    , jHasCommision   : null
    , jCommision      : null
    , jCommisionWrap  : null

    , init: function ( config ) {
      var oThis = this;

      $.extend(oThis, config);

      oThis.jEditor         = oThis.jEditor         || $("#transaction_editor");
      oThis.jForm           = oThis.jForm           || oThis.jEditor.find("#transaction_editor_form");
      oThis.jHeading        = oThis.jHeading        || oThis.jForm.find("#transaction_editor_mode_heading");
      oThis.jSubmit         = oThis.jSubmit         || oThis.jForm.find("#transaction_editor_submit_btn");
      oThis.jId             = oThis.jId             || oThis.jForm.find("#transaction_id");
      oThis.jDeviceId       = oThis.jDeviceId       || oThis.jForm.find("#transaction_device_id");
      oThis.jName           = oThis.jName           || oThis.jForm.find("#transaction_name");
      oThis.jValueInFiat    = oThis.jValueInFiat    || oThis.jForm.find("#value_in_fiat");
      oThis.jValueInBt      = oThis.jValueInBt      || oThis.jForm.find("#value_in_bt");
      oThis.jValueInOst     = oThis.jValueInOst     || oThis.jForm.find("#value_in_ost");
      oThis.jCommision      = oThis.jCommision      || oThis.jForm.find("#commission_percent");
      oThis.jCommisionWrap  = oThis.jCommisionWrap  || oThis.jForm.find("#commission_percent_wrap");


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
          oThis.toggleCurrencyInput();
      });

      oThis.jForm.find('[name="has_commission"]').change( function () {
        var val = Number( this.value );
        console.log("this.value", this.value);
        if( val ) {
          //Some truthy value
          oThis.jCommisionWrap.slideDown( 300 );
        } else {
          //Some falsey value
          oThis.jCommisionWrap.slideUp( 300 );
        }
      });

       PriceOracle.bindCurrencyElements( oThis.jValueInBt , oThis.jValueInFiat , oThis.jValueInOst );
    }

    , createNewTransaction: function ( transactionData ) {
      var oThis = this;

      currentData = $.extend({}, oThis.defaultData);
      currentData.id = Date.now() * -1;

      if ( transactionData ) {
        $.extend( currentData, transactionData);
      }

      //Update Heading
      oThis.jHeading.text("Create Transaction");

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
      oThis.jHeading.text("Update Transaction");

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
    }
    , fillForm: function () {
      var oThis = this;

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

      //value_in_ost
      var value_in_ost = ( currentData.value_in_bt || 0 ) / oThis.ost_to_bt;

      //use_price_oracle
      var isBtCurrencyType = currentData.currency_type === "bt";
      var currency_type_id;
      var currency_value = currentData.currency_value;

      if ( currentData.currency_type === "bt" ) {
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
      oThis.jCommision.val( commission_percent );

      var has_commission_id;
      
      if ( commission_percent ) {
        has_commission_id = "#has_commission_yes";
        oThis.jCommisionWrap.show();
      } else {
        has_commission_id = "#has_commission_no";
        oThis.jCommisionWrap.hide();
      }
      oThis.jForm.find( has_commission_id )
        .prop("checked", true)
      ;
      
      //Use currentData.
    }
    , showEditor: function () {
      var oThis = this;

      oThis.jEditor.scrollTop(0);
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

      var has_commission = oThis.getDataFromAjaxData( "has_commission", ajaxData );
      console.log("has_commission", has_commission);
      has_commission = Number( has_commission );


      if ( !has_commission ) {
        oThis.setDataInAjaxData("commission_percent", 0, ajaxData);
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

        device_id = newData.device_id || oThis.jDeviceId.val();
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

      oThis.cleanUp();
      oThis.hideEditor();
    }

    ,toggleCurrencyInput : function () {
      var oThis = this;
      
      var jEl       = oThis.jForm.find('input[name=currency_type]:checked')
        , val       = Number( jEl.val() )
        , jEnable
        , jDisable
      ;

      if ( val ) {
        jEnable   = oThis.jValueInFiat;
        jDisable  = oThis.jValueInBt;
      } else {
        jEnable   = oThis.jValueInBt;
        jDisable  = oThis.jValueInFiat;
      }

      jDisable.prop('disabled', true);
      jEnable.prop('disabled', false);
   }

  };
})(window, jQuery);