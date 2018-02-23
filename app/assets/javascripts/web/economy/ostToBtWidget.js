;
(function (window, $) {

  var ost     = ns("ost");

  var oThis = ost.ostToBtWidget = {
    jBtToFiat         : null
    , jOstToBt        : null
    , jBtToOst        : null

    , idBtToFiat      : "bt_to_fiat_input"
    , idOstToBt       : "ost_to_bt_input"
    , idBtToOst       : "bt_to_ost_input"

    , init : function ( config ) {
      var oThis = this;
      config = config || {};

      $.extend( oThis, config );

      oThis.jBtToFiat     = oThis.jBtToFiat     || $( "#" + oThis.idBtToFiat );
      oThis.jOstToBt      = oThis.jOstToBt      || $( "#" + oThis.idOstToBt );
      oThis.jBtToOst      = oThis.jBtToOst      || $( "#" + oThis.idBtToOst );
      
      oThis.bindEvents();

      console.log("oThis.jBtToFiat.val()" , oThis.jBtToFiat.val() );
      //Set initial values
      var ostToBt   = PriceOracle.ostToBt( 1 ).toString( 10 )
        , fiatInBt  = PriceOracle.btToFiat( 1 ).toString( 10 )
        , btToOst   = PriceOracle.btToOst(1).toString( 10 )
      ;

      console.log("fiatInBt" , fiatInBt);

      oThis.jOstToBt.safeSetVal( ostToBt );
      oThis.jBtToFiat.safeSetVal( fiatInBt );
      oThis.jBtToOst.safeSetVal( btToOst );

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
        var didUpdateOstToBt = oThis.jOstToBt.safeSetVal( stringRatio, orgEvent );
        didUpdateOstToBt && console.log("updating jOstToBt to " , stringRatio);

        var btToOst = PriceOracle.btToOst(1).toString( 10 );
        var didUpdateBtToOst = oThis.jBtToOst.safeSetVal( btToOst, orgEvent );
        didUpdateBtToOst && console.log("updating jBtToOst to " , btToOst);        

      });

      $( oThis.jBtToFiat ).on("change", function () {
        console.log("jBtToFiat val", oThis.jBtToFiat.val() )
        console.log("oThis.jBtToFiat changed!");
        console.trace();
      })

    }
  }



})(window, jQuery);