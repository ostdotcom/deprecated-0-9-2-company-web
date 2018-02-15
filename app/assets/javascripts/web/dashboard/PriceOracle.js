;
(function ( scope, $ ) {
  var oThis = PriceOracle = scope.PriceOracle = {
    something: null

    , ost_to_fiat: 1
    , ost_to_bt: 1
    , fiat_symbol: "$"
    , fiat_type: "usd"
    , fiat_display_text: "USD"


    , init: function ( config ) {
      var oThis = this;

      config = config || {};

      if ( config.ost_to_fiat ) {
        config.ost_to_fiat = String( config.ost_to_fiat );
      }
      if ( config.ost_to_bt ) {
        config.ost_to_bt = String( config.ost_to_bt );
      }

      $.extend( PriceOracle, config );
    }

    , ostToFiat: function ( ost ) {
      var oThis = this;

      ost = BigNumber( ost );
      var ost_to_fiat = BigNumber( oThis.ost_to_fiat );
      return ost_to_fiat.times( ost );
    }

    , ostToBt: function ( ost ) {
      var oThis = this;

      ost = BigNumber( ost );
      var ost_to_bt = BigNumber( oThis.ost_to_bt );
      return ost_to_bt.times( ost );

    }

    , btToOst : function ( bt ) {
      var oThis = this;

      bt = BigNumber( bt );
      var ost_to_bt = BigNumber( oThis.ost_to_bt );
      return bt.div( ost_to_bt );
    }

    , btToFiat: function ( bt ) {
      var oThis = this;

      var ost = oThis.btToOst( bt );
      return oThis.ostToFiat( ost );
    }

    , fiatToOst: function ( fiat ) {
      var oThis = this;

      fiat = BigNumber( fiat );
      var ost_to_fiat = BigNumber( oThis.ost_to_fiat );
      return fiat.div( ost_to_fiat );
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

        oThis.ost_to_bt = bt.toString(10);
        var ost_to_bt = bt
          , bt_to_fiat  = oThis.btToFiat( 1 )
        ;
        


        oThis.fireEvent( "ostToBtUpdated", ost_to_bt, ost_to_bt.toString(10) );
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
          , ost_to_bt   = BigNumber( 1 ).div( ost )
          , bt_to_fiat  = fiat
        ;
        oThis.ost_to_bt = ost_to_bt.toString(10);
        
        
        oThis.fireEvent( "ostToBtUpdated", ost_to_bt, ost_to_bt.toString(10) );
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