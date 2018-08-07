;
(function (window, $) {
  var metamask  = ns("ost.metamask"),
      ostScan   = ns("ost.ostScan"),

   etherScan = ns("ost.etherScan");
  var oThis = metamask.registerMainnetAddressHelper = { 
    init: function ( config ) {
      $.extend( oThis, config);
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
      $("#register_eth_address").prop("disabled", true);
      oThis.startBalanceValidation();
    }
    , getUserAddress: function () {
      return $("#eth_address_register_only").val();
    }

    , queuedIcon: '<img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/pending-loader-1.svg" width="30" height="30" />'
    , pendingIcon: '<img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/processed-loader-1.gif" width="30" height="30" />'
    , processedIcon: '<img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/select-token-checkmark.svg" width="30" height="30" />'
    , failedIcon: ''
      + '<svg class="icon-banner align-middle">'
        + '<switch> ' 
          + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-error"></use> ' 
        + '</switch> ' 
      + '</svg>'
    , startBalanceValidation : function () {

      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
        , jOst  = $("#register_address_validate_ost_amount")
      ;

      jEth.find(".j_validate_message").html("Validate address for ETH");
      jOst.find(".j_validate_message").html("Validate address for OST");

      jEth.find(".j_validate_icon").html( oThis.queuedIcon );
      jOst.find(".j_validate_icon").html( oThis.queuedIcon );


      oThis.validateEthBalance();
    }
    ,validateEthOstBalance(){
      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
        , jOst  = $("#register_address_validate_ost_amount")
      ;

      jEth.find(".j_validate_icon").html( oThis.pendingIcon );
      jOst.find(".j_validate_icon").html( oThis.pendingIcon );


      //Call OST backend API to ensure user has minimum of 0.05 ETH. and some OSTs
      var newAddress = oThis.getUserAddress();

      ostScan.getUserOstEthBalance( newAddress, function (response) {
        oThis.getUserOstEthBalanceCallBack(response)
      });
    },getUserOstEthBalanceCallBack(){
      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
        , jOst  = $("#register_address_validate_ost_amount")

      ;

      if(response.success ) {
        var currentEthBalance = BigNumber( response.data.balanceInEth || "0" );
        if( currentEthBalance.isGreaterThan( oThis.minRequiredETHBalance ) ) {
          // User has sufficient ETH, lets validate OST.
          jEth.find(".j_validate_icon").html( oThis.processedIcon );
        } else {
          //User does not have ETH. Stop them here.
          jEth.find(".j_validate_icon").html( oThis.failedIcon );
        }


        var currentOstBalance = BigNumber( response.data.ostTokenBalance || "0" );
        if( currentOstBalance.isGreaterThan( oThis.minRequiredOSTBalance ) ) {
          // User has sufficient ETH, lets validate OST.
          jOst.find(".j_validate_icon").html( oThis.processedIcon );
        } else {
          //User does not have ETH. Stop them here.
          jOst.find(".j_validate_icon").html( oThis.failedIcon );
        }





      } else {
        jEth.find(".j_validate_icon").html( oThis.failedIcon );
      }

      // Never mind the ETH balance, just check the OST Balance.
      //oThis.validateOstBalance();

      $("#register_eth_address").prop("disabled", false);


    }


    , minRequiredETHBalance: "0.05"
    , validateEthBalance: function () {
      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
      ;

      jEth.find(".j_validate_icon").html( oThis.pendingIcon );

      //Call etherscan API to ensure user has minimum of 0.05 ETH.
      var newAddress = oThis.getUserAddress();
      
      etherScan.getUserEthBalance( newAddress, function (response) {
        oThis.getUserEthBalanceCallBack(response)
      });
    }
    ,getUserEthBalanceCallBack( response ) {
      var oThis = this
        , jEth  = $("#register_address_validate_eth_amount")
      ;

      if(response.success ) {
        var currentEthBalance = BigNumber( response.data.balanceInEth || "0" );
        if( currentEthBalance.isGreaterThan( oThis.minRequiredETHBalance ) ) {
          // User has sufficient ETH, lets validate OST.
          jEth.find(".j_validate_icon").html( oThis.processedIcon );
        } else {
          //User does not have ETH. Stop them here.
          jEth.find(".j_validate_icon").html( oThis.failedIcon );
        }
      } else {
        jEth.find(".j_validate_icon").html( oThis.failedIcon );
      }

      // Never mind the ETH balance, just check the OST Balance.
      oThis.validateOstBalance();

    }

    , minRequiredOSTBalance: null
    , validateOstBalance: function ( newAddress ) {
      var oThis = this
        , jOst  = $("#register_address_validate_ost_amount")
      ;
      var newAddress = oThis.getUserAddress();
      jOst.find(".j_validate_icon").html( oThis.pendingIcon );
      
      etherScan.getUserOstBalance( newAddress, function (response) {
        oThis.getOstBalanceCallback(response)
      });


    }
    , getOstBalanceCallback: function ( response ) {
      var oThis = this;
      var oThis = this
        , jOst  = $("#register_address_validate_ost_amount")
      ;

      if(response.success ) {
        var currentEthBalance = BigNumber( response.data.balanceInEth || "0" );
        if( currentEthBalance.isGreaterThan( oThis.minRequiredETHBalance ) ) {
          // User has sufficient ETH, lets validate OST.
          jOst.find(".j_validate_icon").html( oThis.processedIcon );
        } else {
          //User does not have ETH. Stop them here.
          jOst.find(".j_validate_icon").html( oThis.failedIcon );
        }
      } else {
        jOst.find(".j_validate_icon").html( oThis.failedIcon );
      }

      $("#register_eth_address").prop("disabled", false);
      

      
    }

  };

})(window, jQuery);