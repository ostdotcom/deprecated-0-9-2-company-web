;
(function (window, $) {

  var ost     = ns("ost");

  var oThis = ost.ostToBtWidget = {
    jBtToFiat         : null
    , jOstToBt        : null
    , jBtToOstValue   : null

    , idBtToFiat      : "bt_to_fiat_input"
    , idOstToBt       : "bt_to_ost_input"
    , idBtToOstValue  : "bt_to_ost_value_input"

    , init : function ( config ) {
      var oThis = this;
      $.extend( oThis, config );

      oThis.jBtToFiat     = oThis.jBtToFiat     || $( "#" + oThis.idBtToFiat );
      oThis.jOstToBt      = oThis.jOstToBt      || $( "#" + oThis.idOstToBt );
      oThis.jBtToOstValue = oThis.jBtToOstValue || $( "#" + oThis.idBtToOstValue );
      
      oThis.bindEvents();

      //Set initial values
      oThis.jOstToBt.safeSetVal( PriceOracle.ostToBt( 1 ).toString( 10 ) );

    }
    , bindEvents: function () {
      var oThis = this;

      PriceOracle.observeBtToFiat( oThis.jBtToFiat );
      $( PriceOracle ).on( PriceOracle.events.btToFiatUpdated, function (event, orgEvent, bigRatio, stringRatio ) {
        //Make Sure to forward orgEvent;
        var didUpdate = oThis.jBtToFiat.safeSetVal( stringRatio, orgEvent );
        didUpdate && console.log("updating jBtToFiat to", stringRatio);
      });


      PriceOracle.observeOstToBt( oThis.jOstToBt );
      $( PriceOracle ).on( PriceOracle.events.ostToBtUpdated, function (event, orgEvent, bigRatio, stringRatio ) {
        //Make Sure to forward orgEvent;
        var didUpdate = oThis.jOstToBt.safeSetVal( stringRatio, orgEvent );
        didUpdate && console.log("updating jOstToBt to " , stringRatio);
      });

    }
  }



})(window, jQuery);