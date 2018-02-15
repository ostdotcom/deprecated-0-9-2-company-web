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

      $( jBtInput ).on("change input blur", function ( event, val, orgEvent ) {

        var jEl = $( this )
          , bt = jEl.val()
        ;

        if ( orgEvent && jEl.is( orgEvent.currentTarget ) ) {
          return;
        }

        if ( oThis.isNaN( bt ) ) {
          return;
        }

        bt = oThis.toBt( bt );
        jEl.val( bt );

        var existing = oThis.toOst( OST_TO_BT );
        if ( existing.eq( bt ) || bt.isLessThanOrEqualTo( 0 ) ) {
          return;
        }
        

        var ostToBt = oThis.toOst( bt )
          , bt_to_fiat
        ;
        OST_TO_BT   = ostToBt.toString();
        bt_to_fiat  = oThis.btToFiat( 1 );


        console.log("observeOstToBt bt" , bt.toString() );
        console.log("observeOstToBt OST_TO_BT" , OST_TO_BT );
        console.log("observeOstToBt bt_to_fiat" , bt_to_fiat.toString() );

        
        //Fire Events
        orgEvent = orgEvent || event;
        oThis.fireEvent( "ostToBtUpdated", orgEvent, ostToBt, OST_TO_BT );
        oThis.fireEvent( "btToFiatUpdated", orgEvent, bt_to_fiat, bt_to_fiat.toString(10) );
      });
    }

    , observeBtToFiat: function ( jFiatInput ) {
      var oThis = this;

      $( jFiatInput ).on("change blur", function ( event, val, orgEvent ) {

        var jEl = $( this )
          , fiat = jEl.val()
        ;

        if ( orgEvent && jEl.is( orgEvent.currentTarget ) ) {
          return;
        }

        //fiat is same as bt_to_fiat 
        if ( oThis.isNaN( fiat ) || !fiat ) {
          return;
        }
        fiat = oThis.toFiat( fiat );
        jEl.val( fiat.toString( 10 ) );
        
        if ( fiat.isLessThanOrEqualTo( 0 ) ) { 
          return;
        }

        var ost         = oThis.fiatToOst( fiat )
          , ostToBt     = BigNumber( 1 ).div( ost )
          , bt_to_fiat  = fiat
        ;

        ostToBt = oThis.toOst( ostToBt );

        if ( ostToBt.eq( OST_TO_BT ) ) {
          return;
        }

        OST_TO_BT = ostToBt.toString( 10 );

        console.log("observeBtToFiat fiat", fiat.toString( 10 ) );
        console.log("observeBtToFiat ost", ost.toString( 10 ) );
        console.log("observeBtToFiat ostToBt", OST_TO_BT );

        //Fire Events
        orgEvent = orgEvent || event;
        oThis.fireEvent( "ostToBtUpdated", orgEvent, ostToBt, OST_TO_BT );
        oThis.fireEvent( "btToFiatUpdated", orgEvent, bt_to_fiat, bt_to_fiat.toString(10) );
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

      if ( oThis.isNaN( ost ) ) {
        return NaN;
      }
      ost = BigNumber( ost );
      return BigNumber( ost.toFixed(P_OST, P_OST_ROUND_ROUNDING_MODE) );
    }

    , toFiat: function( fiat ) {
      var oThis = this;

      if ( oThis.isNaN( fiat ) ) {
        return NaN;
      }
      fiat = BigNumber( fiat );
      return BigNumber( fiat.toFixed(P_FIAT, P_FIAT_ROUND_ROUNDING_MODE) );
    }

    , toBt: function ( bt ) {
      var oThis = this;

      if ( oThis.isNaN( bt ) ) {
        return NaN;
      }
      bt = BigNumber( bt );
      return BigNumber( bt.toFixed(P_BT, P_BT_ROUND_ROUNDING_MODE) );
    }

    ,toDisplayFiat : function ( fiat ) {
      var oThis = this;

      fiat = oThis.toFiat( fiat );
      if ( !fiat || oThis.isNaN( fiat ) ) {
        return NaN;
      }
      return oThis.fiat_symbol + fiat.toString( 10 );
    } 
    , isNaN : function ( val ) {
      return isNaN( val ) || val === "";
    }
  }


})( window, jQuery );