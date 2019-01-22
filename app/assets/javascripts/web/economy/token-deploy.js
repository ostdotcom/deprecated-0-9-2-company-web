;
(function (window, $) {

  var ost  = ns("ost");
  var oThis = ost.tokenDeploy = {

    intervalId: null,

    init : function (config) {
      $.extend(oThis, config);
      oThis.setTooltipPosition();
      oThis.getDeployStatus();
    },

    getDeployStatus : function() {
       $.ajax({
         url: oThis.getDeployStatusEndPoint,
         success:function (response) {
           if(response && response.success){
             oThis.updateProgessBar(response.data.workflow_current_step);
           }
           else{
             console.log("api call was successful but returned false");
           }
         },
         error: function () {
           console.log("the api call was not successful");
         }
       })
    },

    setTooltipPosition: function(percent_completion) {

        var tooltipOffsetLeft = 5;
        var arrowHalfLength = 6;
        var tooltipWidth = $(".tooltip").width();

        if(typeof percent_completion === 'undefined') percent_completion = 0;

        $(".tooltip-text").text(percent_completion +"%");

        $("div.tooltip").css({
          left: Math.max(0, percent_completion-tooltipOffsetLeft)+'%'
        });
        $(".arrow").css({
          left: tooltipWidth / 2 - arrowHalfLength
        });
        if(percent_completion === 100){
          oThis.intervalId.clearInterval();
        }
    },
    updateProgessBar: function (currentStatus) {
        $(".progress-bar")[0].style.width = currentStatus.percent_completion+'%';
        $("#progressStep").html(currentStatus.display_text);
        oThis.setTooltipPosition(currentStatus.percent_completion);
    }
  };


})(window, jQuery);