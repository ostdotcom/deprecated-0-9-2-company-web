;
(function (window) {

  var narBarMenuNs = ns("ost.narBarMenu"),
    oThis;

  narBarMenuNs.index = oThis = {

    jNavEl: null,
    jUberBanner: null,
    jNavPhantomEl: null,
    heightTrigger: 0,

    init: function () {

      oThis.jNavEl =  $('.ost-nav');
      oThis.jUberBanner = $('.uber-banner-winners');
      oThis.jNavPhantomEl = $('.navbar-phatom-el');

      oThis.setupNavbar();
    },

    setupNavbar: function(){

      if(oThis.jUberBanner.length === 0) {
        oThis.heightTrigger = 0;
      } else {
        oThis.heightTrigger = oThis.jUberBanner.outerHeight();
      }

    },

    fixedNavBarMenu : function(){
      var scrollTop = $(window).scrollTop() ;
      if(scrollTop > oThis.heightTrigger){
        oThis.jNavPhantomEl.height( oThis.jNavEl.outerHeight() );
        oThis.jNavEl.addClass('nav-box-shadow fixed-top');
      }
      else{
        oThis.jNavPhantomEl.height( 0 );
        oThis.jNavEl.removeClass('nav-box-shadow fixed-top');
      }

    },

  };

  $(document).ready(function () {
    oThis.init();
    $(window).on('scroll resize', function(){
      oThis.fixedNavBarMenu();
    });
  });


})(window);