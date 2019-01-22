;
(function (window, $) {

  var ost  = ns("ost") ,
      Polling = ns("ost.Polling") ,
      utilities = ns("ost.utilities")
  ;
  var oThis = ost.tokenDeploy = {
    deploymentPercentTooltip : null,
    deploymentPercentTooltipText : null,
    deploymentPercentTooltipArrow : null,
    progressBar : null,
    progressStep : null,
  
    polling : 0 ,
    

    init : function (config) {
      $.extend(oThis, config);
      oThis.deploymentPercentTooltip = $(".deploymentPercentTooltip");
      oThis.deploymentPercentTooltipText = $(".deploymentPercentTooltip.tooltip-text");
      oThis.deploymentPercentTooltipArrow = $(".arrow");
      oThis.progressBar = $(".progress-bar")[0];
      oThis.progressStep = $("#progressStep");
      oThis.setTooltipPosition();
      oThis.getDeployStatus();
    },

    getDeployStatus : function() {

      oThis.polling = new Polling({
        pollingApi : oThis.getDeployStatusEndPoint ,
        success : function ( response ) {
          if(response && response.success){
            var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
            oThis.updateProgessBar( currentWorkflow );
          }
        }
      });

    },

    setTooltipPosition: function(percent_completion) {

        var tooltipOffsetLeft = 5;
        var arrowHalfLength = 6;
        var tooltipWidth = oThis.deploymentPercentTooltip.width();

        if(typeof percent_completion === 'undefined') percent_completion = 0;

        oThis.deploymentPercentTooltipText.text(percent_completion +"%");

        oThis.deploymentPercentTooltip.css({
          left: Math.max(0, percent_completion-tooltipOffsetLeft)+'%'
        });
        oThis.deploymentPercentTooltipArrow.css({
          left: tooltipWidth / 2 - arrowHalfLength
        });
    },

    updateProgessBar: function (currentStatus) {
        var percentCompletion = currentStatus && currentStatus.percent_completion || 0 ;
        oThis.progressBar.style.width = percentCompletion+'%';
        oThis.progressStep.html(currentStatus.display_text);
        oThis.setTooltipPosition( percentCompletion  );
        if( percentCompletion  >= 100){
          oThis.polling && oThis.polling.stopPolling();
        }
    }
  };


})(window, jQuery);