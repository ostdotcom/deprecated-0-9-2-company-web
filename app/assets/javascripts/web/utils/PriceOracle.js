;
(function ( window, $ ) {
  
  var P_OST = 5
  ;
  
  var P_BT = 5
  ;
  
  var P_FIAT = 2
    , P_FIAT_ROUND_ROUNDING_MODE  = BigNumber.ROUND_HALF_UP
  ;
  
  var OST_TO_FIAT = 1 ;
  
  var oThis = window.PriceOracle = {
  
    init: function ( config ) {
      var oThis = this;
      
      config = config || {};
      
      if ( config.ost_to_fiat ) {
        OST_TO_FIAT = String( config.ost_to_fiat );
      }
      
      $.extend( PriceOracle, config );
      
      oThis.ost_to_fiat && (delete oThis.ost_to_fiat);
    
    },
  
    ostToFiat: function ( ost ) {
      if( !ost ) return "";
  
      ost = BigNumber( ost );
      
      var oThis = this ,
          conversionFactor = BigNumber( OST_TO_FIAT )
      ;
      
      var result = ost.multipliedBy( conversionFactor );
      
      return oThis.toFiat( result );
    },
  
    toPrecessionFiat : function ( fiat ) {
      fiat = fiat || OST_TO_FIAT ;
      var oThis = this;
    
      fiat = oThis.toFiat( fiat );
      if ( !fiat || oThis.isNaN( fiat ) ) {
        return "";
      }
    
      var fiatBn = BigNumber( fiat );
    
      return fiatBn.toFixed( P_FIAT , P_FIAT_ROUND_ROUNDING_MODE);
    },
  
    toFiat: function( fiat ) {
      var oThis = this;
    
      if ( oThis.isNaN( fiat ) ) {
        return NaN;
      }
      
      fiat = BigNumber( fiat );
      return fiat.toString( );
    },
  
    isNaN : function ( val ) {
      return typeof val === "undefined" || val === "" || val === null || isNaN( val );
    },
  
    getOstPrecession : function () {
      return P_OST ;
    },
  
    getFiatPrecession : function () {
      return P_FIAT ;
    },
  
    getBtPrecession : function () {
      return P_BT ;
    }
    
  }
  
  
})( window, jQuery );