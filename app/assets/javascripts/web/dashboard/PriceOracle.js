;
(function ( scope, $ ) {

  var logMe = true;
  //For ROUNDING_MODE, See https://mikemcl.github.io/bignumber.js/#rounding-mode 

  // All Constents.
  var P_OST = 5
    , P_OST_ROUND_ROUNDING_MODE   = BigNumber.ROUND_HALF_UP
    , P_D_OST = 5
    , P_OST_DISPLAY_ROUND_ROUNDING_MODE   = BigNumber.ROUND_HALF_UP
  ;

  var P_BT = 5
    , P_BT_ROUND_ROUNDING_MODE    = BigNumber.ROUND_HALF_UP
  ;


  var P_FIAT = 3
    , P_FIAT_ROUND_ROUNDING_MODE  = BigNumber.ROUND_HALF_UP
  ;

  //All Private Stuff.
  var OST_TO_FIAT = 1;
  var OST_TO_BT = 1;
  var eventNSHelpler = new ost.EventNameSpacing( "poEvent" ); 

  var oThis = PriceOracle = scope.PriceOracle = {
    something: null

    , fiat_symbol: "$"
    , fiat_type: "USD"
    , fiat_display_text: "USD"

    , bt_symbol: "FRC"


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

    /* DO NOT USE THIS METHOD IN FRONTEND JS. */
    /* THIS METHOD IS ONLY FOR BACKEND */
    , setOstToBtFromErb: function ( ost_to_bt ) {
      var oThis = this;

      var new_ost_to_bt = String( ost_to_bt );
      new_ost_to_bt = oThis.toPreciseOst( new_ost_to_bt );
      OST_TO_BT = new_ost_to_bt.toString( 10 );
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
      console.log("ostToBt :: ostToBt", ostToBt.toString( 10 ) );
      console.log("ostToBt :: result", result.toString( 10 ) );
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
      console.log("btToOst :: ostToBt ", ostToBt.toString( 10 ));
      console.log("btToOst :: result ", result.toString( 10 ));
      if ( doNotRound ) {
        return result;
      }
      result = oThis.toPreciseOst( result );
      console.log("btToOst :: toPreciseOst ", result.toString( 10 ));
      return result;
    }

    , btToFiat: function ( bt, doNotRound ) {
      var oThis = this;

      var ost     = oThis.btToOst( bt, true )
        , result  = oThis.ostToFiat( ost )
      ;

      logMe && console.log("btToFiat :: bt", bt);
      logMe && console.log("btToFiat :: OST_TO_BT", OST_TO_BT);
      logMe && console.log("btToFiat :: ost", ost.toString());
      logMe && console.log("btToFiat :: result", result.toString());

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
      return oThis.toPreciseOst( result );
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
      var oThis = this
        , bindEvents = eventNSHelpler.nameSpacedEvents("change input blur");
      ;

      $( jBtInput ).off(bindEvents).on(bindEvents, function ( event, val, orgEvent ) {

        var jEl = $( this )
          , bt = jEl.val()
        ;

        if ( orgEvent && jEl.is( orgEvent.currentTarget ) ) {
          logMe && console.log("we have orgEvent", orgEvent);
          return;
        }

        if ( oThis.isNaN( bt ) ) {
          logMe && console.log("bt isNaN", bt);
          return;
        }

        logMe && console.log("bt val", bt);
        bt = oThis.toBt( bt );
      
        var existing = oThis.toPreciseOst( OST_TO_BT );
        logMe && console.log("bt", bt, "existing bt", existing);
        if ( existing.eq( bt ) || bt.isLessThanOrEqualTo( 0 ) ) {
          return;
        }
        jEl.val( bt );
        

        var ostToBt   = oThis.toPreciseOst( bt )
          , bt_to_fiat
        ;
        OST_TO_BT   = ostToBt.toString();
        bt_to_fiat  = oThis.btToFiat( 1 );


        logMe && console.log("observeOstToBt bt" , bt.toString() );
        logMe && console.log("observeOstToBt OST_TO_BT" , OST_TO_BT );
        logMe && console.log("observeOstToBt bt_to_fiat" , bt_to_fiat.toString() );

        
        //Fire Events
        orgEvent = orgEvent || event;
        oThis.fireEvent( "ostToBtUpdated", orgEvent, ostToBt, OST_TO_BT );
        oThis.fireEvent( "btToFiatUpdated", orgEvent, bt_to_fiat, bt_to_fiat.toString(10) );
      });
    }

    , observeBtToFiat: function ( jFiatInput ) {
      var oThis = this
        , bindEvents = eventNSHelpler.nameSpacedEvents("change input");
      ;

      $( jFiatInput ).off(bindEvents).on(bindEvents, function ( event, val, orgEvent ) {

        var jEl = $( this )
          , btTofiat = jEl.val()
        ;

        if ( orgEvent && jEl.is( orgEvent.currentTarget ) ) {
          return;
        }

        //fiat is same as bt_to_fiat 
        if ( oThis.isNaN( btTofiat ) || !btTofiat ) {
          return;
        }
        btTofiat = oThis.toFiat( btTofiat );
        jEl.val( btTofiat.toString( 10 ) );
        
        if ( btTofiat.isLessThanOrEqualTo( 0 ) ) { 
          return;
        }

        var ostToFiat   = oThis.ostToFiat( 1 )
          , ostToBt     = ostToFiat.dividedBy( btTofiat )
        ;

        ostToBt = oThis.toPreciseOst( ostToBt );

        if ( ostToBt.eq( OST_TO_BT ) ) {
          return;
        }

        OST_TO_BT = ostToBt.toString( 10 );

        logMe && console.log("observeBtToFiat btTofiat", btTofiat.toString( 10 ) );
        logMe && console.log("observeBtToFiat ostToFiat", ostToFiat.toString( 10 ) );
        logMe && console.log("observeBtToFiat ostToBt", ostToBt.toString( 10 ) );
        logMe && console.log("observeBtToFiat ostToBt", OST_TO_BT );

        //Fire Events
        orgEvent = orgEvent || event;
        oThis.fireEvent( "ostToBtUpdated", orgEvent, ostToBt, OST_TO_BT );
        oThis.fireEvent( "btToFiatUpdated", orgEvent, btTofiat, btTofiat.toString(10) );
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

    , toPreciseOst: function ( ost ) {
      var oThis = this;

      if ( oThis.isNaN( ost ) ) {
        return NaN;
      }
      ost = BigNumber( ost );
      return BigNumber( ost.toFixed(P_OST, P_OST_ROUND_ROUNDING_MODE) );
    }

    , toOst: function ( ost ) {
      var oThis = this;

      if ( oThis.isNaN( ost ) ) {
        return "";
      }

      ost = oThis.toPreciseOst( ost );
      console.log("ost.toFixed(P_D_OST, P_OST_DISPLAY_ROUND_ROUNDING_MODE)" , ost.toFixed(P_D_OST, P_OST_DISPLAY_ROUND_ROUNDING_MODE));
      return ost.toFixed(P_D_OST, P_OST_DISPLAY_ROUND_ROUNDING_MODE);
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

    , toDisplayFiat : function ( fiat ) {
      var oThis = this;

      fiat = oThis.toFiat( fiat );
      if ( !fiat || oThis.isNaN( fiat ) ) {
        return "";
      }
      return oThis.fiat_symbol + fiat.toString( 10 );
    }
    , toDisplayBt : function ( bt ) {
      var oThis = this;

      bt = oThis.toBt( bt );
      if ( !bt || oThis.isNaN( bt ) ) {
        return "";
      }
      return bt.toString( 10 ) + " " + oThis.bt_symbol;
    }

    , isNaN : function ( val ) {
      return isNaN( val ) || val === "";
    }

    , bindCurrencyElements: function ( jBt, jFiat , jOst ) {
      //Safe Masking
      jBt = $( jBt );
      jFiat = $( jFiat );
      jOst = $( jOst );



      var oThis =  this
        , bindEvents = eventNSHelpler.nameSpacedEvents("change input");
      ;
      var isChangeValid = function ( event, val, orgEvent ) {
        if ( PriceOracle.isNaN( val ) ) { 
          return false;
        }

        if ( event && orgEvent && event.currentTarget === orgEvent.currentTarget ) {
          //Avoid an infinite loop
          logMe && console.log("---------------\n\tIMPORTANT :: This should never happen. Please Check me\n---------------");
          logMe && console.trace();
          return false; 
        }

        //Do Other validations if required.

        return true;
      };

      var onBTChanged = function ( event, val, orgEvent ) {

        var jEl   = $( this )
          , btVal
        ;
        val   = val || jEl.val();

        //Validations
        if ( !isChangeValid( event, val, orgEvent ) ) {
          return;
        }

        //Initialisations
        btVal = PriceOracle.toBt( val );
        orgEvent = orgEvent || event;

        //Executions
        //Note: Update only OST, let ost update fiat. Done to reduce the no. of events being fired.
        if ( jOst.length ) {
          jOst.safeSetVal(PriceOracle.btToOst( btVal ), orgEvent );
        } else {
          jFiat.safeSetVal(PriceOracle.btToFiat( btVal ), orgEvent );
        }

      };

      var onFiatChanged = function ( event, val, orgEvent ) {

        var jEl     = $( this )
          , fiatVal
        ;
        val = val || jEl.val();

        //Validations
        if ( !isChangeValid( event, val, orgEvent ) ) {
          return;
        }

        //Initialisations
        fiatVal = PriceOracle.toFiat( val );
        orgEvent = orgEvent || event;

        //Executions
        //Note: Update only OST, let ost update BT. Done to reduce the no. of events being fired.
        if ( jOst.length ) {
          jOst.safeSetVal(PriceOracle.fiatToOst( fiatVal ), orgEvent );  
        } else {
          jBt.safeSetVal(PriceOracle.fiatToBt( fiatVal ), orgEvent );  
        }
        

      };

      var onOstChanged = function ( event, val, orgEvent ) {

        var jEl     = $( this )
          , ostVal
        ;
        val = val || jEl.val();

        //Validations
        if ( !isChangeValid( event, val, orgEvent ) ) {
          return;
        }

        //Initialisations
        ostVal = PriceOracle.toPreciseOst( val );
        orgEvent = orgEvent || event;

        //Executions
        //Note: Update every one. 
        jFiat.safeSetVal(PriceOracle.ostToFiat( ostVal ), orgEvent );
        jBt.safeSetVal(PriceOracle.ostToBt( ostVal ), orgEvent );
      };

      jBt.off(bindEvents).on(bindEvents, onBTChanged);

      jFiat.off(bindEvents).on(bindEvents, onFiatChanged);

      jOst.off(bindEvents).on(bindEvents, onOstChanged);

    }
  }


})( window, jQuery );