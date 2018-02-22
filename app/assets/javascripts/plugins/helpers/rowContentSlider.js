;
(function (window, $) {

    var jParent  = $('.slider-parent-container'),
        sWrapper = jParent.data('slider-content-wrapper'),
        sBtn     = jParent.data('slider-btn-selector')  || ".slider-btn",
        sContent = jParent.data('slider-content-selector') || ".code-session"
      ;

    if(jParent && sWrapper) {
      jParent.on('click', sBtn ,  function () {
        var jElToSlide =  $(this).closest(sWrapper).find(sContent);
        jElToSlide.slideToggle();
      });
    }

})(window, jQuery);