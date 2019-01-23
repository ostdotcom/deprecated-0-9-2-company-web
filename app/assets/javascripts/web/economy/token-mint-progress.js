;
(function (window,$) {
  var ost = ns("ost") ,
    Progressbar = ns("ost.ProgressBar") ,
    Polling = ns("ost.Polling") ,
    utilities =  ns("ost.utilities")
  ;

  var oThis = ost.tokenMint = {

    genericErrorMessage             :  'Something went wrong!',
    progressBar                     :  null,
    polling                         :  null,
    mintingStatusEndPoint           :  null,

    init : function ( config ) {
      $.extend( oThis , config );
      oThis.progressBar = new Progressbar();
      oThis.getMintingStatus();
    },

    getMintingStatus : function() {
      oThis.polling = new Polling({
        pollingApi : oThis.mintingStatusEndPoint ,
        onPollSuccess :  oThis.onPollingSuccess.bind( oThis )
      });
      oThis.polling.startPolling();
    },

    onPollingSuccess : function( response ){
      if(response && response.success){
        var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
        if( currentWorkflow.status = "failed"){
          //do something
        }
        else{
          oThis.progressBar.updateProgressBar( currentWorkflow );
          if( currentWorkflow && currentWorkflow.percent_completion  >= 100){
            oThis.polling && oThis.polling.stopPolling();
          }
        }
      }
    }
  }

})(window,jQuery);