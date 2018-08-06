;
(function (window, $) {
  var metamask  = ns("ost.metamask"),

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

      console.log("metamask.events.onAddressChanged");
      //I have received a valid address.
      $("#ost__planner__address__register__only").text( newAddress );
      $("#eth_address_register_only").val( newAddress );
      $("#register_eth_address").prop("disabled", true);
      oThis.validateEthBalance();
    }
    , getUserAddress: function () {
      return $("#eth_address_register_only").val();
    }

    , minRequiredETHBalance: "0.05"
    , validateEthBalance: function () {
      //Call etherscan API to ensure user has minimum of 0.05 ETH.
      var newAddress = oThis.getUserAddress();
      console.log("validateEthBalance newAddress", newAddress);
      etherScan.getUserEthBalance( newAddress, function (response) {
        oThis.getUserEthBalanceCallBack(response)
      });
        //If balance is not sufficient, show error on UI.

        //If balance is sufficient, call validateOstBalance
        //oThis.validateOstBalance( newAddress );
    }
    ,getUserEthBalanceCallBack( response ) {
      var oThis = this;
      if(response.success ) {
        var currentEthBalance = BigNumber( response.data.balanceInEth || "0" );
        if( currentEthBalance.isGreaterThan( oThis.minRequiredETHBalance ) ) {
          console.log("----- Done for the day!");
          //@Shradha: Move this.
          $("#register_eth_address").prop("disabled", false);
          // User has sufficient ETH, lets validate OST.
          // oThis.validateOstBalance(address);
        } else {
          //User does not have ETH. Stop them here.

        }
      } else {
        console.log("******in getuserethbalancecallback :: failure ********")
      }

    }

    , minRequiredOSTBalance: null
    , validateOstBalance: function ( newAddress ) {
      console.log("** in validateOstBalance **")


    }

  };

})(window, jQuery);