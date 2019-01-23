;
(function (window, $) {
  var ost = ns('ost');

  ost.ProgressBar = function (config) {
    var oThis = this;
    $.extend(oThis, config);
  };

  ost.ProgressBar.prototype = {

    progressBarTooltip      : $(".progressBarTooltip"),
    progressBarTooltipText  : $(".progressBarTooltip .tooltip-text"),
    progressBarTooltipArrow : $(".arrow"),
    progressBar             : $(".progress-bar-container .progress-bar"),
    progressBarFull         : $(".progress-bar-container .progress"),
    progressStep            : $("#progressStep"),
    tooltipOffsetLeft       : 5,
    arrowHalfLength         : 6,
    percentCompletion       : 0,
    currentStep: "",

    setTooltipPosition: function (percent_completion) {
      var oThis = this,
          tooltipWidth = oThis.progressBarTooltip.width(),
          progressBarFullWidth = oThis.progressBarFull.width();

      oThis.progressBarTooltipText.text(percent_completion + "%");
      oThis.progressBarTooltip.css({
        left: (percent_completion/100)*progressBarFullWidth+'px'
      });
      oThis.progressBarTooltipArrow.css({
        left: tooltipWidth / 2 - oThis.arrowHalfLength
      });
    },

    updateProgressBar: function (currentStatus) {
      var oThis = this,
        percentCompletion = currentStatus && currentStatus.percent_completion || oThis.percentCompletion,
        currentStep = currentStatus && currentStatus.display_text || oThis.currentStep;

      oThis.setProgressBarWidth(percentCompletion);
      oThis.displayCurrentStep(currentStep);
      oThis.setTooltipPosition(percentCompletion);
    },

    displayCurrentStep: function (current_step) {
      var oThis = this;
      oThis.progressStep.html(current_step);
    },

    setProgressBarWidth: function (percent_completion) {
      var oThis = this;
      oThis.progressBar.width(percent_completion+'%');
    }


  }
})(window, jQuery);