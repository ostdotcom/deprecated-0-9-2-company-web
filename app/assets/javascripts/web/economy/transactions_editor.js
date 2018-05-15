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
      tx_kind                : "kind"
      , has_commission       : "has_commission"
      , commission_percent   : "commission_percent"
      , commission_in_bt     : "commission_in_bt"
      , commission_in_fiat   : "commission_in_fiat"
      , arbitrary_commission : "arbitrary_commission"
      , arbitrary_amount     : "arbitrary_amount"
      , value_in_ost         : "value_in_ost"
    }

    , formHelper              : null
    , jEditor                 : null
    , jForm                   : null
    , jHeading                : null
    , jCreateHeading          : null
    , jEditHeading            : null
    , jSubmit                 : null
    , jId                     : null
    , jDeviceId               : null
    , jName                   : null
    , jValueInFiat            : null
    , jValueInBt              : null
    , jValueInOst             : null
    , jHasCommission          : null
    , jCommissionRow          : null
    , jCommission             : null
    , jCommissionWrap         : null
    , jCInFiat                : null
    , jCInBt                  : null
    , jSetHere                : null
    , jBeforeExecution        : null
    , jCurrencyWrap           : null
    , jActionAmountSetHere    : null
    , jUserToUser             : null
    , jUserToCompany          : null
    , jCompanyToUser          : null
    ,maxTransactionVal: null

    , init: function ( config ) {
      var oThis = this;

      $.extend(oThis, config);

      oThis.jEditor                 = oThis.jEditor                 || $("#transaction_editor");
      oThis.jForm                   = oThis.jForm                   || oThis.jEditor.find("#transaction_editor_form");
      oThis.jHeading                = oThis.jHeading                || oThis.jForm.find("#transaction_editor_mode_heading");
      oThis.jCreateHeading          = oThis.jCreateHeading          || oThis.jForm.find("#transaction_heading_create");
      oThis.jEditHeading            = oThis.jEditHeading            || oThis.jForm.find("#transaction_heading_update");
      oThis.jSubmit                 = oThis.jSubmit                 || oThis.jForm.find("#transaction_editor_submit_btn");
      oThis.jId                     = oThis.jId                     || oThis.jForm.find("#transaction_id");
      oThis.jDeviceId               = oThis.jDeviceId               || oThis.jForm.find("#transaction_device_id");
      oThis.jName                   = oThis.jName                   || oThis.jForm.find("#transaction_name");
      oThis.jValueInFiat            = oThis.jValueInFiat            || oThis.jForm.find("#value_in_fiat");
      oThis.jValueInBt              = oThis.jValueInBt              || oThis.jForm.find("#value_in_bt");
      oThis.jValueInOst             = oThis.jValueInOst             || oThis.jForm.find("#value_in_ost");
      oThis.jCommissionRow          = oThis.jCommissionRow          || oThis.jForm.find("#commission-options-row");
      oThis.jCommission             = oThis.jCommission             || oThis.jForm.find("#commission_percent");
      oThis.jCommissionWrap         = oThis.jCommissionWrap         || oThis.jForm.find("#commission_percent_wrap");
      oThis.jCInFiat                = oThis.jCInFiat                || oThis.jForm.find("#commission_in_fiat");
      oThis.jCInBt                  = oThis.jCInBt                  || oThis.jForm.find("#commission_in_bt");
      oThis.jSetHere                = oThis.jSetHere                || oThis.jForm.find("#amount_set_here");
      oThis.jBeforeExecution        = oThis.jBeforeExecution        || oThis.jForm.find("#amount_set_before_execution");
      oThis.jCurrencyWrap           = oThis.jCurrencyWrap           || oThis.jForm.find("#currency_wrap");
      oThis.jUserToUser             = oThis.jUserToUser             || oThis.jForm.find("#kind_user_to_user");
      oThis.jUserToCompany          = oThis.jUserToCompany          || oThis.jForm.find("#kind_user_to_company");
      oThis.jCompanyToUser          = oThis.jCompanyToUser           || oThis.jForm.find("#kind_company_to_user");

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
        console.log("ajaxConfig : ",ajaxConfig);
        oThis.correctPostUrl( ajaxConfig );
        oThis.correctCommissionData( ajaxData );
        oThis.correctCurrencyData (ajaxData);
      });

      oThis.jForm.find('.j-currency').change( function () {
        oThis.toggleActionAmountInput.apply(oThis, arguments);
      });

      oThis.jForm.find('.j-action-amount-setting').change( function () {
        oThis.toggleActionAmountInput.apply(oThis, arguments);
      });

      oThis.jForm.find('.j-tx-kind').change( function () {
        oThis.toggleCommissionsRow.apply(oThis, arguments);
      });

      oThis.jForm.find('.j-has-commission').change( function () {
        oThis.hasCommissionModified();
        oThis.updateDisplayCommission();
      });

      PriceOracle.bindCurrencyElements( oThis.jValueInBt , oThis.jValueInFiat , oThis.jValueInOst );

      oThis.jCommission.add( oThis.jValueInOst ).on("change", function ( event ) {
        console.log("calling onCommissionChanged event", event.currentTarget );
        oThis.onCommissionChanged.apply( oThis, arguments );
      });

    }

    , hasCommissionModified : function () {
      var jCommission   = oThis.jForm.find('.j-has-commission:checked')
        , jCommissionId = jCommission[0].id
        , jCommissionVal = jCommission[0].value
      ;
      if( jCommissionVal === 'true' || jCommissionId === 'charge_fees_no') {
        //Some truthy value
        oThis.jCommissionWrap.slideUp( 300 );

      } else {
        //Some falsey value
        oThis.jCommissionWrap.slideDown( 300 );
      }
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

      // oThis.toggleActionAmountInput();
      oThis.toggleCommissionsRow();
      
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

      oThis.toggleActionAmountInput();
      oThis.toggleCommissionsRow();

      oThis.disableKindOptions();
    }

    , disableKindOptions : function () {
      oThis.jUserToUser.attr('disabled','disabled');
      oThis.jUserToCompany.attr('disabled','disabled');
      oThis.jCompanyToUser.attr('disabled','disabled');
    }
    
    , enableKindOptions : function () {
      oThis.jUserToUser.removeAttr('disabled');
      oThis.jUserToCompany.removeAttr('disabled');
      oThis.jCompanyToUser.removeAttr('disabled');
    }
    
    , fillForm: function () {
      var oThis = this;

      //clear errors
      oThis.formHelper.clearErrors();

      for( var dKey in oThis.defaultData ) {
        if ( !(oThis.defaultData.hasOwnProperty(dKey) ) ){
          continue;
        }
        if ( !currentData.hasOwnProperty( dKey) || currentData[ dKey ] === null ) {
          currentData[ dKey ] = oThis.defaultData[ dKey ];
        }
      }
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
      var arbitrary_amount =  currentData.arbitrary_amount || false
      ;

      var amount_setting_id = "#amount_set_here";
      if (arbitrary_amount === true){
        amount_setting_id = "#amount_set_before_execution";
      }
      oThis.jForm.find( amount_setting_id )
        .prop("checked", true)
      ;
      oThis.updateDisplayActionAmount();

      //use_price_oracle
      var isBtCurrencyType = currentData.currency === "BT";
      var currency_type_id;
      var currency_value = currentData.amount;

      if ( currentData.currency === "BT" ) {
          currency_type_id = "#currency_type_bt";
          oThis.jValueInBt.safeSetVal( PriceOracle.toBt( currency_value ) );
      } else {
          currency_type_id ="#currency_type_fiat";
          console.log("currency_value", currency_value);
          oThis.jValueInFiat.safeSetVal(PriceOracle.toFiat(currency_value));
      }

      oThis.jForm.find( currency_type_id )
        .prop("checked", true)
        .trigger("change")
      ;

      //commission_percent
      var arbitrary_commission = currentData.arbitrary_commission
        , commission_percent = Number(currentData.commission_percent)
      ;

      var has_commission_id, display_commission_percent;
      display_commission_percent = commission_percent || 1;
      
      if ( arbitrary_commission === true) {
        has_commission_id = "#charge_fees_before_execution";
        oThis.jCommissionWrap.hide();
      }else if(commission_percent < 1){
        has_commission_id = "#charge_fees_no";
        oThis.jCommissionWrap.hide();
      }else{
        has_commission_id = "#charge_fees_here";
        oThis.jCommissionWrap.show();
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
      oThis.enableKindOptions();
      ost.coverElements.hide( oThis.jEditor );
    }

    , correctCommissionData: function ( ajaxData ) {
      var oThis = this;

      var nameKeys        = oThis.inputNameKeys
        , tx_kind         = oThis.getDataFromAjaxData( nameKeys.tx_kind , ajaxData )
        , arbitrary_commission  = oThis.getDataFromAjaxData( nameKeys.arbitrary_commission , ajaxData )
      ;

      var jCommission   = oThis.jForm.find('.j-has-commission:checked')
        , jCommissionId = jCommission[0].id
      ;

      oThis.enableKindOptions();
      if ( !tx_kind ) {
        var jKind = oThis.jForm.find('.j-tx-kind:checked');
        tx_kind = jKind.val();
      }

      console.log("Before correctCommissionData : ajaxData :",ajaxData);
      if ( oThis.txKindMap.user_to_user !== tx_kind || jCommissionId === 'charge_fees_no') {
        oThis.setDataInAjaxData(nameKeys.commission_percent, 0, ajaxData);
        oThis.setDataInAjaxData(nameKeys.commission_in_bt, 0, ajaxData);
        oThis.setDataInAjaxData(nameKeys.commission_in_fiat, 0, ajaxData);
      }


      if (oThis.txKindMap.user_to_user !== tx_kind ) {
        oThis.removeDataFromAjaxData( nameKeys.arbitrary_commission, ajaxData );
        arbitrary_commission = "true";
      }

      if ( arbitrary_commission === 'true' ){
        oThis.removeDataFromAjaxData(nameKeys.commission_percent,ajaxData);
        oThis.removeDataFromAjaxData(nameKeys.commission_in_bt,ajaxData);
        oThis.removeDataFromAjaxData(nameKeys.commission_in_fiat,ajaxData);
      }

      console.log("Final correctCommissionData : ajaxData :",ajaxData);

    }

    , correctCurrencyData: function (ajaxData) {
      var oThis = this;

      var nameKeys        = oThis.inputNameKeys
        , arbitrary_amount  = oThis.getDataFromAjaxData( nameKeys.arbitrary_amount , ajaxData )
      ;
      console.log("Before correctCommissionData : ajaxData :",ajaxData);
      if (arbitrary_amount === 'true'){
        oThis.removeDataFromAjaxData(nameKeys.value_in_ost,ajaxData);
      }

      console.log("Final correctCommissionData : ajaxData :",ajaxData);

    }

    , correctPostUrl : function ( ajaxConfig ) {
      var oThis = this;

      var client_transaction_id = oThis.getDataFromAjaxData( "id", ajaxConfig.data );
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

    , removeDataFromAjaxData: function (keyName, ajaxData) {
      var oThis = this;

      if (!ajaxData){
        console.log("AjaxData not available")
        return false;
      }

      var dataIndex = oThis.findDataIndex(keyName, ajaxData);

      if ( dataIndex < 0 ) {
        return false;
      }

      console.log(ajaxData," \ndataIndex : ",dataIndex);
      console.log('before splicing', ajaxData);
      ajaxData.splice(dataIndex,1);
      console.log("final result : ",ajaxData);

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
      console.log("inside onSuccess : ",response.success);

      if ( response.success ) {
        console.log("inside if of onSuccess");


        var data          = response.data || {}
          , transactions  = data.action || []
          , newData       = transactions
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
      console.log("completeEditSession ");
      // oThis.cleanUp();
      oThis.hideEditor();
    }

    , toggleActionAmountInput: function () {
      var oThis = this;
      
      var jAmountSetting  = oThis.jForm.find('.j-action-amount-setting:checked')
        , amountSetting   = jAmountSetting.val()
        , jCurrency       = oThis.jForm.find('.j-currency:checked')
        , currencyVal     = jCurrency.val()
        , jEnable
        , jDisable
        , jShow
        , jHide
      ;

      if ( amountSetting === "true" ) {
        jEnable = $(); // Nothing to enable
        jDisable  = oThis.jValueInFiat.add( oThis.jValueInBt );
      }else {
        if ( currencyVal === "BT" ) {
          jEnable   = oThis.jValueInBt;
          jDisable  = oThis.jValueInFiat;
        } else {
          jEnable   = oThis.jValueInFiat;
          jDisable  = oThis.jValueInBt;
        }

      }

      if ( currencyVal === "BT" ) {
        jShow     = $("#currency_type_bt_help_text");
        jHide     = $("#currency_type_fiat_help_text");
      } else {
        jShow     = $("#currency_type_fiat_help_text");
        jHide     = $("#currency_type_bt_help_text");
      }

      jDisable.prop('disabled', true);
      jDisable.removeAttr('max');
      jEnable.prop('disabled', false);
      jEnable.attr('max' , oThis.maxTransactionVal );
      jShow.show();
      jHide.hide();

      oThis.updateDisplayActionAmount();
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
      oThis.updateDisplayCommission();

      if(val !== oThis.txKindMap.user_to_user){
        var has_commission_id = "#charge_fees_no";
        oThis.jForm.find( has_commission_id )
          .prop("checked", true)
        ;
        oThis.hasCommissionModified();
      }
    }

    , updateDisplayCommission : function () {
      var jCommission   = oThis.jForm.find('.j-has-commission:checked')
        ,  commissionVal = jCommission.val()
        , jCommissionId = jCommission[0].id
      ;

      var jTX   = oThis.jForm.find('.j-tx-kind:checked') ,
          txVal = jTX.val() ;

      var jEl   = $('.commission-content-wrapper') ;

      if((txVal === oThis.txKindMap.user_to_user && (commissionVal === 'true' || jCommissionId=='charge_fees_no')) || txVal!==oThis.txKindMap.user_to_user) {
        jEl.removeClass('has-commission');
      }else{
        jEl.addClass('has-commission');
      }
    }

    , updateDisplayActionAmount : function () {
      var jActionAmount   = oThis.jForm.find('.j-action-amount-setting:checked')
        , jActionAmountVal = jActionAmount.val()
      ;

      var jEl   = $('.action-amount-content-wrapper') ;

      if (jActionAmountVal === 'true'){
        jEl.removeClass('has-action-amount');

      }else{
        jEl.addClass('has-action-amount');

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