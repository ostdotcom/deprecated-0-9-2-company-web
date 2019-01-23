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
    redeploy : null,
    polling : 0 ,
    tokenDeployContainer : null,
    

    init : function (config) {
      $.extend(oThis, config);
      oThis.deploymentPercentTooltip = $(".deploymentPercentTooltip");
      oThis.deploymentPercentTooltipText = $(".deploymentPercentTooltip .tooltip-text");
      oThis.deploymentPercentTooltipArrow = $(".arrow");
      oThis.progressBar = $(".progress-bar-container .progress-bar");
      oThis.progressBarFull = $(".progress-bar-container .progress");
      oThis.progressStep = $("#progressStep");
      oThis.resetDeploy = $(".reset-deployment");
      oThis.tokenDeployContainer = $(".token-deploy-container");

      oThis.bindActions();
      oThis.setTooltipPosition();
      oThis.getDeployStatus();
    },

    bindActions : function(){
      oThis.resetDeploy.on("click",function () {
        oThis.onResetDeploy();
      });
    },

    onResetDeploy : function(){
      $.ajax({
        url: oThis.resetdeployEndPoint,
        method: "POST",
        success : function (response) {
          if( response.success ){
            window.location = oThis.redirectUrl;
          }else {
            oThis.onResetFailure( response );
          }
        },
        error : function (response) {
          oThis.onResetFailure( response );
        }
      })
    },

    onResetFailure : function( res ){
      //TODO show error whereever UX says
    } ,

    getDeployStatus : function() {

      oThis.polling = new Polling({
        pollingApi : oThis.getDeployStatusEndPoint ,
        onPollSuccess :  oThis.onPollingSuccess.bind( oThis )
      });
      oThis.polling.startPolling();

    },

    onPollingSuccess : function( response ){
      if(response && response.success){
        var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
        if( currentWorkflow.status = "failed"){
          oThis.tokenDeployContainer.hide();
          oThis.resetDeploy.show();
        }
        else{
          oThis.updateProgressBar( currentWorkflow );
          if( currentWorkflow && currentWorkflow.percent_completion  >= 100){
            oThis.polling && oThis.polling.stopPolling();
          }
        }
      }
    },

    updateProgressBar: function (currentWorkflow) {
      var percentCompletion = currentWorkflow && currentWorkflow.percent_completion || 0 ;
      oThis.progressBar.width(percentCompletion+'%');
      oThis.progressStep.html(currentWorkflow.display_text);
      oThis.setTooltipPosition( percentCompletion  );
    },

    setTooltipPosition: function(percent_completion) {
        var tooltipOffsetLeft = 5;
        var arrowHalfLength = 6;
        var tooltipWidth = oThis.deploymentPercentTooltip.width();
        var progressBarFullWidth = oThis.progressBarFull.width();

        if(typeof percent_completion === 'undefined') percent_completion = 0;

        oThis.deploymentPercentTooltipText.text(percent_completion +"%");

        oThis.deploymentPercentTooltip.css({
          left: (percent_completion/100)*progressBarFullWidth+'px'
        });
        oThis.deploymentPercentTooltipArrow.css({
          left: tooltipWidth / 2 - arrowHalfLength
        });
    }

  };


})(window, jQuery);