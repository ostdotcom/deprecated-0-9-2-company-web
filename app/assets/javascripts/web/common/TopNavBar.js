(function (window, $) {
  $( function () {
    $(".nav-products").mouseenter( function () {
      $(this).find('.mega-dropdown-menu').addClass('open');
    });
    $(".nav-products").mouseleave( function () {
      $(this).find('.mega-dropdown-menu').removeClass('open');
    });
  })

})(window,jQuery)