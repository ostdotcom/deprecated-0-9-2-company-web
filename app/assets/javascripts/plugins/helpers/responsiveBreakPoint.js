;
(function (window , $) {

  var breakPointClasses = "ost-cbp-xs  ost-cbp-sm  ost-cbp-md  ost-cbp-lg  ost-cbp-xl"
  ;

  var ost = ns('ost');

  var responsiveBreakPoint = ost.responsiveBreakPoint =  {

    getWindowWidth : function () {
        return $(window).width();
    },

    getBreakPointClass : function () {

    }

  };

   $(window).onResize( function () {
     var oThis =  this,
         wWidth = $(oThis).width(),
         breakPointClass

     ;
     setWindowWidth( wWidth );
     breakPointClass = getBreakPointClass( );
     removeBreakPointBodyClass( );
     addBreakPointBodyClass( breakPointClass );
   });


   function getBreakPointClass() {
      var breakPointClass
      ;
      if( windowWidth <  576 ) {
        //xs
        breakPointClass = 'ost-cbp-xs';
      }else if( windowWidth < 768 ){
        //sm
        breakPointClass = 'ost-cbp-sm';
      }else if( windowWidth < 992 ){
        //md
        breakPointClass = 'ost-cbp-md';
      }else if( windowWidth  < 1200 ){
        //lg
        breakPointClass = 'ost-cbp-lg';
      } else  {
        //xl
        breakPointClass = 'ost-cbp-xl';
      }
      return breakPointClass ;
   }

   function removeBreakPointBodyClass( ) {
      $('body').removeClass(breakPointClasses)
   }

   function addBreakPointBodyClass ( breakPointClass ) {
     $('body').removeClass(breakPointClass)
   }

   function setWindowWidth( width ) {
     windowWidth = width;
   }

   function setBreakPointClass( windowClass ) {
     breakPointClass = windowClass;
   }


})(window , jQuery);
