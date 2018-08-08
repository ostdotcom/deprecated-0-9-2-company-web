;
(function (window, $) {
  var metamask  = ns("ost.metamask"),
      ostScan   = ns("ost.ostScan"),

   etherScan = ns("ost.etherScan");
  var oThis = metamask.registerMainnetAddressHelper = { 
    init: function () {
      var oThis = this
        , jValidateBtn = $("#validate_eth_address_btn")
        , jForm = $("#register_eth_address_form")
      ;
      jValidateBtn.click( function () {
        oThis.startBalanceValidation();
      });

      var formHelper = jForm.formHelper();
      formHelper.success = function( response ) {
        if ( response && response.success && oThis.onValidatedCallback ) {
          oThis.onValidatedCallback.apply(oThis, arguments);
        }
      };
    }
    , onValidatedCallback: null
    , validateAddress : function ( callback ) {
      var oThis = this;
      oThis.onValidatedCallback = callback;
      oThis.startObserver();

    }
    , startObserver: function () {
      var oThis = this;

      oThis.bindMetaMaskEvents();
      ost.metamask.startObserver( oThis );
    }

    , stopObserver: function () {
      var oThis = this;

      oThis.unbindMetaMaskEvents();
      ost.metamask.stopObserver( oThis );
    }
    ,bindMetaMaskEvents: function () {
      var oThis = this;


      var metamask = ost.metamask
        , jMetaMask = $( metamask )
      ;
      jMetaMask.on( metamask.events.onObservationComplete, oThis.onObservationComplete);
      jMetaMask.on( metamask.events.onAddressChanged, oThis.onAddressChanged);

    }

    , unbindMetaMaskEvents: function () {
      var oThis = this;


      var metamask = ost.metamask
        , jMetaMask = $( metamask )
      ;
      jMetaMask.off( metamask.events.onObservationComplete, oThis.onObservationComplete);
      jMetaMask.off( metamask.events.onAddressChanged, oThis.onAddressChanged );

    }
    , onObservationComplete: function (event, success, response) { 
      //DO NOT Assign oThis HERE. Required for bindMetaMaskEvents/unbindMetaMaskEvents

      if ( success && !$("#registerAddressForMainnet").hasClass("active-cover") ) {
        ost.coverElements.show("#registerAddressForMainnet");
      }
    }
    , onAddressChanged: function ( event, eventData, newAddress ) { 
      //DO NOT Assign oThis HERE. Required for bindMetaMaskEvents/unbindMetaMaskEvents

      
      //I have received a valid address.
      $("#ost__planner__address__register__only").text( newAddress );
      $("#eth_address_register_only").val( newAddress );

      oThis.startBalanceValidation();
    }
    , getUserAddress: function () {
      return $("#eth_address_register_only").val();
    }

    , queuedIcon: '<img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/pending-loader-1.svg" width="30" height="30" />'
    , pendingIcon: '<img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/processed-loader-1.gif" width="30" height="30" />'
    , processedIcon: '<img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/select-token-checkmark.svg" width="30" height="30" />'
    , failedIcon: ''

      + '<svg class="icon-banner align-middle" style="margin: 5px;">'
        + '<switch> '
          + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-error"></use> ' 
        + '</switch> ' 
      + '</svg>'
    , startBalanceValidation : function () {

      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
        , jOst  = $("#register_address_validate_ost_amount")
        , jValidateBtn = $("#validate_eth_address_btn")
        , jProceedBtn = $("#register_eth_address_btn")
      ;

      jEth.find(".j_validate_message").html("Validate address for ETH");
      jOst.find(".j_validate_message").html("Validate address for OST");

      jEth.find(".j_validate_icon").html( oThis.queuedIcon );
      jOst.find(".j_validate_icon").html( oThis.queuedIcon );


      //1. Hide register_eth_address_btn
      jProceedBtn.prop("disabled", true).hide();

      //2. Show validate_eth_address_btn, but disbale it.
      jValidateBtn.prop("disabled", true).show();

      //3. Change the display text of the validate_eth_address_btn
      jValidateBtn.val( "VALIDATING..." );

      //oThis.validateEthBalance();
      oThis.validateOstEthBalance();
    }
    , minRequiredOSTBalance: 1000
    , validateOstEthBalance: function() {
      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
        , jOst  = $("#register_address_validate_ost_amount")
      ;

      jEth.find(".j_validate_icon").html( oThis.pendingIcon );
      jOst.find(".j_validate_icon").html( oThis.pendingIcon );


      //Call OST backend API to ensure user has minimum of 0.05 ETH. and some OSTs
      var newAddress = oThis.getUserAddress();

      ostScan.getUserOstEthBalance( newAddress, function (response) {
        oThis.getUserOstEthBalanceCallBack(response, newAddress);
      });
    },getUserOstEthBalanceCallBack: function (response, validatedAddress) {
      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
        , jOst  = $("#register_address_validate_ost_amount")
        , isAddressValid = true
      ;

      var currentSelectedAddress = oThis.getUserAddress();

      if ( validatedAddress != currentSelectedAddress ) {
        //Ignore the response, this is an old response.
        console.log("Ignore the response, this is an old response.");
        return;
      }

      if(response && response.success ) {

        var oThis = this
          , balances = response.data.balances
          , currentEthBalance = BigNumber( balances.eth || 0 )
          , currentOstBalance = BigNumber( balances.OST || 0 )
        ;

        console.log("** currentEthBalance **" + currentEthBalance)
        if( currentEthBalance.isGreaterThan( ostScan.config.minRequiredETHBalance ) ) {
          // User has sufficient ETH, lets validate OST.
          jEth.find(".j_validate_icon").html( oThis.processedIcon );
          isAddressValid = isAddressValid && true;
        } else {
          //User does not have ETH. Stop them here.
          jEth.find(".j_validate_icon").html( oThis.failedIcon );
          isAddressValid = isAddressValid && false;
        }

        console.log("** currentOstBalance **" + currentOstBalance)
        if( currentOstBalance.isGreaterThan( ostScan.config.minRequiredOSTBalance ) ) {
          // User has sufficient ETH, lets validate OST.
          jOst.find(".j_validate_icon").html( oThis.processedIcon );
          isAddressValid = isAddressValid && true;
        } else {
          //User does not have ETH. Stop them here.
          jOst.find(".j_validate_icon").html( oThis.failedIcon );
          isAddressValid = isAddressValid && false;
        }
      } else {
        jEth.find(".j_validate_icon").html( oThis.failedIcon );
        jOst.find(".j_validate_icon").html( oThis.failedIcon );
      }

      oThis.validationComplete( isAddressValid );
    }

    , validationComplete: function ( isAddressValid ) {
      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
        , jOst  = $("#register_address_validate_ost_amount")
        , jValidateBtn = $("#validate_eth_address_btn")
        , jProceedBtn = $("#register_eth_address_btn")
      ;

      if ( isAddressValid ) {
        //1. Hide validate_eth_address_btn
        jValidateBtn.prop("disabled", true).hide();

        //2. Show register_eth_address_btn and enable it.
        jProceedBtn.prop("disabled", false).show();

        //3. Change the display text of the validate_eth_address_btn
        jValidateBtn.val( "Validate" );

      } else {
        //1. Hide register_eth_address_btn
        jProceedBtn.prop("disabled", true).hide();

        //2. Show validate_eth_address_btn, but enable it.
        jValidateBtn.prop("disabled", false).show();

        //3. Change the display text of the validate_eth_address_btn
        jValidateBtn.val( "Validate" );
      }
    }
  };

  metamask.registerMainnetAddressHelper.init();

})(window, jQuery);