;
(function ( scope, $ ) {


  // All Constents.
  var P_OST = 3;
  var P_BT = 3;
  var P_FIAT = 3;

  //For ROUNDING_MODE, See https://mikemcl.github.io/bignumber.js/#rounding-mode 
  var P_OST_ROUND_ROUNDING_MODE   = BigNumber.ROUND_HALF_UP;
  var P_BT_ROUND_ROUNDING_MODE    = BigNumber.ROUND_HALF_UP;
  var P_FIAT_ROUND_ROUNDING_MODE  = BigNumber.ROUND_HALF_UP;


  //All Private Stuff.
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

    , ostToFiat: function ( ost, doNotRound ) {
      var oThis = this;

      ost = BigNumber( ost );
      var ostToFiat = BigNumber( OST_TO_FIAT )
        , result = ostToFiat.times( ost )
      ;
      if ( doNotRound ) {
        return result;
      }
      return oThis.toFiat( result );
    }

    , ostToBt: function ( ost, doNotRound ) {
      var oThis = this;

      ost = BigNumber( ost );
      var ostToBt = BigNumber( OST_TO_BT )
        , result = ostToBt.times( ost )
      ;
      if ( doNotRound ) {
        return result;
      }
      return oThis.toBt( result );
    }

    , btToOst : function ( bt, doNotRound ) {
      var oThis = this;

      bt = BigNumber( bt );
      var ostToBt = BigNumber( OST_TO_BT )
        , result  = bt.div( ostToBt )
      ;
      if ( doNotRound ) {
        return result;
      }
      return oThis.toOst( result );
    }

    , btToFiat: function ( bt, doNotRound ) {
      var oThis = this;

      var ost     = oThis.btToOst( bt, true )
        , result  = oThis.ostToFiat( ost )
      ;
      if ( doNotRound ) {
        return result;
      }
      return oThis.toFiat( result );
    }

    , fiatToOst: function ( fiat, doNotRound ) {
      var oThis = this;

      fiat = BigNumber( fiat );
      var ostToFiat = BigNumber( OST_TO_FIAT )
        , result    = fiat.div( ostToFiat )
      ;
      if ( doNotRound ) {
        return result;
      }
      return oThis.toOst( result );
    }

    , fiatToBt: function ( fiat, doNotRound ) {
      var oThis = this;

      fiat = BigNumber( fiat );
      var ost     = oThis.fiatToOst( fiat, true )
        , result  = oThis.ostToBt( ost )
      ;
      if ( doNotRound ) {
        return result;
      }
      return oThis.toBt( result );
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

    , toOst: function ( ost ) {
      var oThis = this;

      if ( isNaN( ost ) ) {
        return NaN;
      }
      ost = BigNumber( ost );
      return ost.toFixed(P_OST, P_OST_ROUND_ROUNDING_MODE);
    }

    , toFiat: function( fiat ) {
      var oThis = this;

      if ( isNaN( fiat ) ) {
        return NaN;
      }
      fiat = BigNumber( fiat );
      return fiat.toFixed(P_FIAT, P_FIAT_ROUND_ROUNDING_MODE);
    }

    , toBt: function ( bt ) {
      var oThis = this;

      if ( isNaN( bt ) ) {
        return NaN;
      }
      bt = BigNumber( bt );
      return bt.toFixed(P_BT, P_BT_ROUND_ROUNDING_MODE);
    }

    ,toDisplayFiat : function ( fiat ) {
      var oThis = this;

      fiat = oThis.toFiat( fiat );
      if ( isNaN( fiat ) ) {
        return NaN;
      }
      return oThis.fiat_symbol + fiat.toString( 10 );
    } 
  }


})( window, jQuery );