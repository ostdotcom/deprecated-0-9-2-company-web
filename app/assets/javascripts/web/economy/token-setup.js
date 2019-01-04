;
(function (window, $) {

  var ost  = ns("ost");
  var token_setup = ns("ost.token_setup");

  var oThis   = token_setup = {
  init : function () {
    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip()
    // })

    $(".progress-bar").tooltip({placement: 'top',trigger: 'manual'}).tooltip('show');

    setTimeout(function () {

      var width = document.getElementsByClassName("progress-bar")[0].offsetWidth;

      width = width-(width/2);
      console.log("width",width);
      $("div.tooltip").css({left:width+"px"});
    },0);


  }




};

  $(document).ready(function () {
    oThis.init();
  });

})(window, jQuery);