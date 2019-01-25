;
(function (window,$) {
  var ost = ns("ost") ,
    Progressbar = ns("ost.ProgressBar") ,
    Polling = ns("ost.Polling") ,
    utilities =  ns("ost.utilities")
  ;

  var oThis = ost.tokenMintProgress = {

    genericErrorMessage             :  'Something went wrong!',
    progressBar                     :  null,
    polling                         :  null,
    mintingStatusEndPoint           :  null,
    sProgressBarEl                  :  '#mint-progress',
    jMintPollingError               : $('.minting-error-state'),
    jTokenMintProgressContainer     : $('.token-minting-progress-container'),

    init : function ( config ) {
      $.extend( oThis , config );
      oThis.progressBar = new Progressbar({
        sParentEl : oThis.sProgressBarEl
      });
      oThis.progressBar.setTooltipPosition(0);
      oThis.getMintingStatus();
    },

    getMintingStatus : function() {
      oThis.polling = new Polling({
        pollingApi : oThis.mintingStatusEndPoint ,
        pollingInterval : 4000,
        onPollSuccess   : oThis.onPollingSuccess.bind( oThis ),
        onPollError     : oThis.onPollingError.bind( oThis )
      });
      oThis.polling.startPolling();
    },

    onPollingSuccess : function( response ){
      if(response && response.success){
        var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
        if( currentWorkflow.status = oThis.currentStepFailedStatus){
              oThis.onCurrentStepFailed();
        }
        else{
          oThis.shouldStopPolling( currentWorkflow );
          oThis.progressBar.updateProgressBar( currentWorkflow );

        }
      }
    },
    onPollingError : function (jqXHR , error ) {
      if(oThis.polling.isMaxRetries()){
        oThis.currentStepFailed();
      }
      
    },
    shouldStopPolling( currentWorkflow ){
      if(currentWorkflow && currentWorkflow.percent_completion >= 100){
        oThis.polling && oThis.polling.stopPolling();
      }
    },
    onCurrentStepFailed : function () {
      oThis.jTokenMintProgressContainer.hide();
      oThis.jMintPollingError.show();
    }
  }

})(window,jQuery);