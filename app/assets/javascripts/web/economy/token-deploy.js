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

    percentCompletion : 0 ,

    init : function (config) {
      $.extend(oThis, config);
      oThis.deploymentPercentTooltip = $(".deploymentPercentTooltip");
      oThis.deploymentPercentTooltipText = $(".deploymentPercentTooltip.tooltip-text");
      oThis.deploymentPercentTooltipArrow = $(".arrow");
      oThis.progressBar = $(".progress-bar")[0];
      othis.progressStep = $("#progressStep");
      oThis.setTooltipPosition();
      oThis.getDeployStatus();
    },

    getDeployStatus : function() {

      var polling = new Polling({
        pollingApi : oThis.getDeployStatusEndPoint ,
        success : function ( response ) {
          if(response && response.success){
            var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
            oThis.updateProgessBar( currentWorkflow );
          }
        },
        isPollingRequired : function () {
          return oThis.percentCompletion == 100 ;
        }
      });

    },

    setTooltipPosition: function(percent_completion) {

        var tooltipOffsetLeft = 5;
        var arrowHalfLength = 6;
        var tooltipWidth = oThis.deploymentPercentTooltip.width(); //TODO specific name and cache

        if(typeof percent_completion === 'undefined') percent_completion = 0;

        oThis.deploymentPercentTooltipText.text(percent_completion +"%"); //TODO specific name and cache

        oThis.deploymentPercentTooltip.css({  //TODO specific name and cache
          left: Math.max(0, percent_completion-tooltipOffsetLeft)+'%'
        });
        oThis.deploymentPercentTooltipArrow.css({ //TODO specific name and cache
          left: tooltipWidth / 2 - arrowHalfLength
        });
    },

    updateProgessBar: function (currentStatus) {
        oThis.percentCompletion = currentStatus && currentStatus.percent_completion || 0 ;
        oThis.progressBar.style.width = oThis.percentCompletion+'%'; //TODO specific name and cache
        oThis.progressStep.html(currentStatus.display_text); //TODO specific name and cache
        oThis.setTooltipPosition( oThis.percentCompletion  );
    }
  };


})(window, jQuery);