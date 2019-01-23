;
(function ( scope, $ ) {
  
  
  var oThis = scope.PriceOracle = {
  
    ostToFiat: function ( ost ,  conversionFactor  ) {
      if( !ost ) return "";
      conversionFactor = conversionFactor || 1 ;
      
      var oThis = this;
      ost = BigNumber( ost );
      conversionFactor = BigNumber( conversionFactor );
      
      var result = ost.multipliedBy( conversionFactor );
      
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
    }
    
  }
  
  
})( window, jQuery );