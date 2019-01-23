;
(function ( window, $ ) {
  
  var P_OST = 5
  ;
  
  var P_BT = 5
  ;
  
  var P_FIAT = 2
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
      
      var oThis = this;
      ost = BigNumber( ost );
      
      var result = ost.multipliedBy( OST_TO_FIAT );
      
      return oThis.toFiat( result );
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