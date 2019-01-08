;
(function (window, $) {

  var ost  = ns("ost");
  var token_setup = ns("ost.token_setup");

  var oThis   = token_setup = {
  init : function () {
    oThis.setTooltipPosition();
    setInterval(function () {
      oThis.setTooltipPosition();
    },10);
    }
  ,setTooltipPosition: function() {
      var width = document.getElementsByClassName("progress-bar")[0].offsetWidth;
      $("div.tooltip").css({left:width-20+"px" });
  },
  };

  $(document).ready(function () {
    oThis.init();
  });

})(window, jQuery);