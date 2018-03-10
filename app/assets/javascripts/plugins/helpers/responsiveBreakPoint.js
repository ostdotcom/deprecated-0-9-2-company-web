;
(function (window , $) {

  /* *
  * Default breakpoint config across website
  * Use only these breakPoints getters, If breakpoints ever changes, this will be the single end point to change.
  * */
  var breakPoints = {
    xs : {
      minWidth : 320,
      maxWidth : 576,
      class : 'ost-cbp-xs'
    },
    sm : {
      minWidth : 576,
      maxWidth : 768,
      class : 'ost-cbp-sm'
    },
    md : {
      minWidth : 768,
      maxWidth : 992,
      class : 'ost-cbp-md'
    },
    lg : {
      minWidth : 992,
      maxWidth : 1200,
      class : 'ost-cbp-lg'
    },
    xl : {
      minWidth : 1200,
      maxWidth : 3000,
      class : 'ost-cbp-xl'
    }
  };

  var ost = ns('ost');

  var oThis = ost.responsiveBreakPoint =  {

    /* *
    * Return window width
    * */
    getWindowWidth : function () {
        return $(window).width();
    },

    /* *
    * Return breakpoint hash depending on width passed or default current window width.
    * param : width , eg : 1024
    * */
    getBreakPointByWidth : function ( width ) {
      var oThis =  this ,
          width =  width || oThis.getWindowWidth()
      ;
      return getBreakPoint( width );
    },

    /* *
    * Return breakpoint hash
    * param : width , eg : 'xs'
    * */
    getBreakPointConfig: function ( breakpoint ) {
      return breakpoint && breakPoints[breakpoint];
    },

    /* *
    * Return breakpoint min width
    * param : breakPoint string , eg : 'xs'
    * */
    getBreakPointMinWidth : function ( breakPoint  ) {
      return breakPoint && breakPoints[breakPoint]['minWidth'];
    },

    /* *
    * Return breakpoint max width
    * param : breakPoint string , eg : 'xs'
    *  */
    getBreakPointMaxWidth : function ( breakPoint ) {
      return breakPoint && breakPoints[breakPoint]['maxWidth'];
    },

    /* *
    * Return breakpoint class width
    * param : breakPoint string , eg : 'xs'
    *  */
    getBreakPointClass : function ( breakPoint ) {
      return breakPoint && breakPoints[breakPoint]['class'];
    },

    /* *
    * Returns class which is added on body
    * */
    getBodyBreakPointClass : function () {
      var jBody = $('body') ;
      for ( var key in breakPoints ) {
        var breakPointObj = breakPoints[key] ;
        if( jBody.hasClass( breakPointObj['class'] ) ){
          return breakPointObj['class'];
        }
      }
      return "";
    }
  };

    /**Private Functions **/

   function setBreakPointClassOnBody() {
     var windowWidth = oThis.getWindowWidth(),
         breakPointObj , bodyClass
     ;
     breakPointObj = getBreakPoint( windowWidth );
     bodyClass     = breakPointObj['class'];
     removeBreakPointBodyClasses( );
     addBreakPointBodyClass( bodyClass );
   }

   function getBreakPoint( windowWidth ) {
     var breakPoint = "" ;
      if( windowWidth < oThis.getBreakPointMaxWidth('xs') ) {
        breakPoint = 'xs' ;
      }else if( windowWidth < oThis.getBreakPointMaxWidth('sm') ){
        breakPoint = 'sm' ;
      }else if( windowWidth < oThis.getBreakPointMaxWidth('md')  ){
        breakPoint = 'md' ;
      }else if( windowWidth < oThis.getBreakPointMaxWidth('lg') ){
        breakPoint = 'lg' ;
      } else  {
        breakPoint = 'xl' ;
      }
      return oThis.getBreakPointConfig( breakPoint );
   };

   function removeBreakPointBodyClasses( ) {
     for ( var key in breakPoints ) {
       var breakPointObj = breakPoints[key] ;
       $('body').removeClass( breakPointObj['class']  ) ;
     }
   }

   function addBreakPointBodyClass( bodyClass ) {
     if( !!bodyClass ){
       $('body').addClass( bodyClass );
     }
   }

   $(window).resize( function () {
     setBreakPointClassOnBody();
   });

   setBreakPointClassOnBody();

})(window , jQuery);
