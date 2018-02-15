;
(function ( scope, $ ) {

  var OST_TO_FIAT = 1;
  var OST_TO_BT = 1;

  var oThis = PriceOracle = scope.PriceOracle = {
    something: null

    , fiat_symbol: "$"
    , fiat_type: "usd"
    , fiat_display_text: "USD"


    , init: function ( config ) {
      var oThis = this;

      config = config || {};

      if ( config.ost_to_fiat ) {
        OST_TO_FIAT = String( config.ost_to_fiat );
      }
      if ( config.ost_to_bt ) {
        OST_TO_BT = String( config.ost_to_bt );
      }

      $.extend( PriceOracle, config );

      oThis.ost_to_bt   && (delete oThis.ost_to_bt);
      oThis.ost_to_fiat && (delete oThis.ost_to_fiat);
    }

    , ostToFiat: function ( ost ) {
      var oThis = this;

      ost = BigNumber( ost );
      var ostToFiat = BigNumber( OST_TO_FIAT );
      return ostToFiat.times( ost );
    }

    , ostToBt: function ( ost ) {
      var oThis = this;

      ost = BigNumber( ost );
      var ostToBt = BigNumber( OST_TO_BT );
      return ostToBt.times( ost );

    }

    , btToOst : function ( bt ) {
      var oThis = this;

      bt = BigNumber( bt );
      var ostToBt = BigNumber( OST_TO_BT );
      return bt.div( ostToBt );
    }

    , btToFiat: function ( bt ) {
      var oThis = this;

      var ost = oThis.btToOst( bt );
      return oThis.ostToFiat( ost );
    }

    , fiatToOst: function ( fiat ) {
      var oThis = this;

      fiat = BigNumber( fiat );
      var ostToFiat = BigNumber( OST_TO_FIAT );
      return fiat.div( ostToFiat );
    }

    , fiatToBt: function ( fiat ) {
      var oThis = this;

      fiat = BigNumber( fiat );
      var ost = oThis.fiatToOst( fiat );
      return oThis.ostToBt( ost );
    }

    , events : {
      "ostToBtUpdated" : "ostToBtUpdated"
      , "btToFiatUpdated": "btToFiatUpdated"
    }

    , observeOstToBt: function ( jBtInput ) {
      var oThis = this;

      $( jBtInput ).on("change", function () {
        var bt = $( this ).val();
        if ( isNaN( bt ) ) {
          return;
        }
        bt = BigNumber( bt );

        OST_TO_BT = bt.toString(10);
        var ostToBt = bt
          , bt_to_fiat  = oThis.btToFiat( 1 )
        ;
        


        oThis.fireEvent( "ostToBtUpdated", ostToBt, ostToBt.toString(10) );
        oThis.fireEvent( "btToFiatUpdated", bt_to_fiat, bt_to_fiat.toString(10) );
      });
    }

    , observeBtToFiat: function ( jFiatInput ) {
      var oThis = this;

      $( jFiatInput ).on("change", function () {
        //fiat is same as bt_to_fiat 
        var fiat = $( this ).val();
        if ( isNaN( fiat ) ) {
          return;
        }
        fiat = BigNumber( fiat );

        var ost         = oThis.fiatToOst( fiat )
          , ostToBt   = BigNumber( 1 ).div( ost )
          , bt_to_fiat  = fiat
        ;
        OST_TO_BT = ostToBt.toString(10);
        
        
        oThis.fireEvent( "ostToBtUpdated", ostToBt, ostToBt.toString(10) );
        oThis.fireEvent( "btToFiatUpdated", bt_to_fiat, bt_to_fiat.toString(10) );
      });

    }
    , fireEvent: function () {
      var oThis = this;

      var args = Array.prototype.slice.call(arguments)
        , eventNameKey = args.shift()
        , eventName = oThis.events[ eventNameKey ];
      ;
      $( PriceOracle ).trigger(eventName, args);
    }
  }


})( window, jQuery );