;
(function ( window, $ ) {
  
  var P_OST = 5
    , P_OST_ROUND_ROUNDING_MODE   = BigNumber.ROUND_HALF_UP
  ;
  
  var P_BT = 5
    , P_BT_ROUND_ROUNDING_MODE    = BigNumber.ROUND_HALF_UP
  ;
  
  var P_FIAT = 2
    , P_FIAT_ROUND_ROUNDING_MODE  = BigNumber.ROUND_HALF_UP
  ;
  
  var OST_TO_FIAT = 1 ;
  
  var OST_TO_BT = 1 ;
  
  var oThis = window.PriceOracle = {
  
    P_FIAT : null , //Keeping FIAT precession as configurable as it can be asked for
  
    init: function ( config ) {
      var oThis = this;
      
      config = config || {};
      
      if ( config.ost_to_fiat ) {
        OST_TO_FIAT = String( config.ost_to_fiat );
      }
  
      if ( config.ost_to_bt ) {
        OST_TO_BT = String( config.ost_to_bt );
      }
      
      $.extend( PriceOracle, config );
      
      oThis.ost_to_fiat && (delete oThis.ost_to_fiat);
      oThis.ost_to_bt && (delete oThis.ost_to_bt);
    
    },
  
    ostToFiat: function ( ost ) {
      if( !ost ) return "";
  
      ost = BigNumber( ost );
      
      var oThis = this ;
      
      var result = ost.multipliedBy( OST_TO_FIAT );
      
      return oThis.toFiat( result );
    },
    
    btToFiat : function ( bt ) {
      if( !bt ) return "";
  
      bt = BigNumber( bt );
  
      var oThis = this ,
          fiatBN = BigNumber( OST_TO_FIAT ) ,
          oneBTToFiat = fiatBN.dividedBy(  OST_TO_BT )
      ;
  
      var result = oneBTToFiat.multipliedBy( bt );
  
      return oThis.toFiat( result );
    },
    
    btToFiatPrecession : function ( bt) {
      if( !bt ) return "";
  
      var oThis = this ;
  
      var fiat = oThis.btToFiat( bt );
  
      return oThis.toPrecessionFiat( fiat );
    },
    
    ostToBt : function ( ost  ) {
      if( !ost ) return "";
  
      ost = BigNumber( ost );
  
      var oThis = this ;
  
      var result = ost.multipliedBy( OST_TO_BT  );
  
      return oThis.toBT( result );
    },
  
    ostToBtPrecession : function ( ost  ) {
      if( !ost ) return "";
    
      var oThis = this ;
  
      var result = oThis.ostToBt( ost );
    
      return oThis.toPrecessionBT( result );
    },
    
    btToOst : function (  bt ) {
      if( !bt ) return "";
  
      bt = BigNumber( bt );
      
      var oThis = this ;
      
      var result = bt.dividedBy( OST_TO_BT );
      
      return oThis.toOst( result ) ;
    },
  
    btToOstPrecession : function (  bt ) {
      if( !bt ) return "";
    
      var oThis = this ;
      
      var result = oThis.btToOst( bt );
    
      return oThis.toPrecessionOst( result ) ;
    },
  
    toBT: function ( bt ) {
      var oThis = this;
      
      if ( oThis.isNaN( bt ) ) {
        return NaN;
      }
      bt = BigNumber( bt );
      return bt.toString();
    },
  
    toPrecessionBT : function ( bt ) {
      var oThis = this;
  
      bt = oThis.toBT( bt );
      if ( ! bt  ) {
        return "";
      }
      bt = BigNumber( bt );
      return  bt.toFixed( P_BT , P_BT_ROUND_ROUNDING_MODE );
    },
  
    toOst: function ( ost ) {
      var oThis = this;
      
      if ( oThis.isNaN( ost ) ) {
        return "";
      }
      
      ost = BigNumber( ost ) ;
      return ost.toString( );
    },
  
    toPrecessionOst: function ( ost ) {
      var oThis = this;
  
      ost = oThis.toOst( ost );
      if ( !ost ) {
        return "";
      }
      ost = BigNumber( ost );
      return ost.toFixed( P_OST , P_OST_ROUND_ROUNDING_MODE);
    },
    
    toFiat : function ( fiat ) {
      var oThis = this;
  
      if ( oThis.isNaN( fiat ) ) {
        return NaN;
      }
  
      fiat = BigNumber( fiat );
      return  fiat.toString( );
    },
    
    toPrecessionFiat : function ( fiat ) {
      var oThis = this;
  
      fiat = oThis.toFiat( fiat );
      
      if ( !fiat ) {
        return "";
      }
      
      fiat = BigNumber( fiat );
      var precession = oThis.getFiatPrecession();
      return  fiat.toFixed( precession , P_FIAT_ROUND_ROUNDING_MODE);
    },
  
    fromWei : function( val ) {
      var oThis =  this ;
      if( window.web3 ){
        return window.web3.fromWei( val ) ;
      }else {
        return oThis.__fromWei__( val );
      }
    },
  
    toWei : function( val ) {
      var oThis =  this ;
      if( window.web3 ){
        return window.web3.toWei( val ) ;
      }else {
        return oThis.__toWei__( val );
      }
    },
  
    isNaN : function ( val ) {
      return typeof val === "undefined" || val === "" || val === null || isNaN( val );
    },
  
    getOstPrecession : function () {
      return P_OST ;
    },
  
    //Keeping FIAT precession as configurable as it can be asked for
    getFiatPrecession : function () {
      return oThis.P_FIAT ||  P_FIAT ;
    },
  
    getBtPrecession : function () {
      return P_BT ;
    },
  
  
    //Private method START
    __fromWei__: function ( val ) {
      var oThis = this,
        exp
      ;
    
      if ( oThis.isNaN( val ) ) {
        return NaN;
      }
    
      val = BigNumber( val ) ;
      exp = BigNumber(10).exponentiatedBy(18) ;
      return val.dividedBy(exp).toString(10);
    },
  
    __toWei__: function ( val ) {
      var oThis = this,
        exp
      ;
    
      if ( oThis.isNaN( val ) ) {
        return NaN;
      }
    
      val = BigNumber( val ) ;
      exp = BigNumber(10).exponentiatedBy(18) ;
      return val.multipliedBy(exp).toString(10);
    }
    //Private method END
    
  }
  
  
})( window, jQuery );