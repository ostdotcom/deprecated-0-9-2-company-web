;
(function (window , $) {

  var breakPointClasses = "ost-cbp-xs  ost-cbp-sm  ost-cbp-md  ost-cbp-lg  ost-cbp-xl",
      breakPointClass = ""
  ;

  var ost = ns('ost');

  var responsiveBreakPoint = ost.responsiveBreakPoint =  {

    getWindowWidth : function () {
        return $(window).width();
    },

    getBreakPointClass : function () {
      return breakPointClass;
    }

  };

   function setBreakPointClassOnBody() {
     var windowWidth = responsiveBreakPoint.getWindowWidth()
     ;
     setBreakPointClass( windowWidth );
     removeBreakPointBodyClasses( );
     addBodyClass( breakPointClass );
   }

   function setBreakPointClass( windowWidth ) {
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
   }

   function removeBreakPointBodyClasses( ) {
      $('body').removeClass( breakPointClasses ) ;
   }

   function addBodyClass( breakPointClass) {
     $('body').addClass( breakPointClass );
   }

   $(window).resize( function () {
     setBreakPointClassOnBody();
   });

   setBreakPointClassOnBody();

})(window , jQuery);
