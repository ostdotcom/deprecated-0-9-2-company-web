;
(function (window, $) {
  var ost = ns('ost') ,
    utilities =  ns("ost.utilities")
  ;

  ost.ProgressBar = function (config) {
    var oThis = this;
    $.extend(oThis, config);

    if( oThis.sParentEl ){
        oThis.jParentEL = $( oThis.sParentEl ) ;
    }

    if( !oThis.jParentEL || oThis.jParentEL.length == 0 ){
      console.log("jParent is mandetory config for ProgressBar");
      throw "jParent is mandetory config for ProgressBar";
    }

    oThis.progressBarTooltip = oThis.jParentEL.find( '.progressBarTooltip' );
    oThis.progressBarTooltipText =  oThis.jParentEL.find( '.progressBarTooltip .tooltip-text' );
    oThis.progressBarTooltipArrow = oThis.jParentEL.find( '.arrow' );
    oThis.progressBar = oThis.jParentEL.find( '.progress-bar-container .progress-bar' );
    oThis.progressBarFull = oThis.jParentEL.find( '.progress-bar-container .progress' );
    oThis.progressStep = oThis.jParentEL.find( '.progressStep' );

  };

  ost.ProgressBar.prototype = {

    sParentEl : null,
    jParentEL : null ,

    progressBarTooltip      : null,
    progressBarTooltipText  : null,
    progressBarTooltipArrow : null,
    progressBar             : null,
    progressBarFull         : null,
    progressStep            : null,

    tooltipOffsetLeft       : 5,
    arrowHalfLength         : 8,
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
      // oThis.progressBarTooltipArrow.css({
      //   left: tooltipWidth / 2 - oThis.arrowHalfLength
      // });
    },

    updateProgressBar: function (res) {
      var oThis = this,
        status = utilities.deepGet( res , 'data.workflow_current_step.status'),
        percentCompletion = status == "completed" ? 100 : utilities.deepGet( res , 'data.workflow_current_step.percent_completion') || 0,
        currentStep = utilities.deepGet( res , 'data.workflow_current_step.display_text') || ""
      ;
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