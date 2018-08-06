;
(function (window, $) {
  var metamask  = ns("ost.metamask");
  var oThis = metamask.registerMainnetAddressHelper = { 
    init: function () {

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
      $("#ost__planner__address").text( newAddress );
      $("#eth_address").val( newAddress );

      oThis.validateEthBalance( newAddress );
    }
    , getUserAddress: function () {
      return $("#eth_address").val();
    }

    , validateEthBalance: function ( newAddress ) {
        //Call etherscan API to ensure user has minimum of 0.05 ETH.

        //If balance is not sufficient, show error on UI.

        //If balance is sufficient, call validateOstBalance
        // oThis.validateOstBalance( newAddress );
    }
    , validateOstBalance: function ( newAddress ) {

    }
  };

})(window, jQuery);