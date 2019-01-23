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
    resetDeploy : null,
    polling : 0 ,
    tokenDeployContainer : null,
    jResetDeployError: null ,
    

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
      oThis.jResetDeployError =  $('.deploy-error-state .general_error');
      oThis.bindActions();

      if( !oThis.isPollFailed  ){
        oThis.setTooltipPosition();
        oThis.getDeployStatus();
      }

    },

    bindActions : function(){
      oThis.resetDeploy.on("click",function () {
        oThis.onResetDeploy();
      });
    },

    onResetDeploy : function(){
      oThis.jResetDeployError.removeClass('is-invalid').text("");
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
      $('.deploy-error-state .general_error')
        .addClass("is-invalid")
        .text("Something went wrong, please try again!");
    } ,

    getDeployStatus : function() {
      oThis.polling = new Polling({
        pollingApi      : oThis.getDeployStatusEndPoint ,
        pollingInterval : 4000,
        onPollSuccess   : oThis.onPollingSuccess.bind( oThis ),
        onPollError     : oThis.onPollingError.bind( oThis )
      });
      oThis.polling.startPolling();
    },

    onPollingSuccess : function( response ){
      if(response && response.success){
        var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
        if( currentWorkflow.status == oThis.currentStepFailedStatus ){
          oThis.onCurrentStepFailed()
        }
        else{
          oThis.shouldStopPolling( currentWorkflow );
          oThis.updateProgressBar( currentWorkflow );
        }
      }
    },

    onPollingError : function( jqXhr , error  ){
      if( oThis.polling.isMaxRetries() ){
        oThis.onCurrentStepFailed();
      }
    },

    shouldStopPolling : function( currentWorkflow ){
      if( currentWorkflow && currentWorkflow.percent_completion  >= 100){
        oThis.polling && oThis.polling.stopPolling();
      }
    },

    onCurrentStepFailed : function(){
      oThis.tokenDeployContainer.hide();
      oThis.resetDeploy.show();
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