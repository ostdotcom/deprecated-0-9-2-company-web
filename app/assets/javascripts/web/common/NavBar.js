;
(function (window) {

  var narBarMenuNs = ns("ost.narBarMenu"),
    oThis;

  narBarMenuNs.index = oThis = {

    jNavEl: null,
    jUberBannerDesktop: null,
    jUberBannerMobile: null,
    jNavPhantomEl: null,
    heightTrigger: 0,

    init: function () {

      oThis.jNavEl =  $('.ost-nav');
      oThis.jUberBannerDesktop = $('.uber-banner-desktop');
      oThis.jUberBannerMobile = $('.uber-banner-mobile');
      oThis.jNavPhantomEl = $('.navbar-phatom-el');

      oThis.setupNavbar();
    },

    setupNavbar: function(){

      if(oThis.jUberBannerDesktop.length === 0 && oThis.jUberBannerMobile.length === 0) {
        oThis.heightTrigger = 0;
      } else {
        oThis.heightTrigger = Math.max(oThis.jUberBannerDesktop.outerHeight(), oThis.jUberBannerMobile.outerHeight())
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
    $(window).on('resize', function(){
      oThis.setupNavbar();
    });
    $(window).on('scroll resize', function(){
      oThis.fixedNavBarMenu();
    });
  });


})(window);