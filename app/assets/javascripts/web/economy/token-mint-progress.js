;
(function (window,$) {
  var ost = ns("ost") ,
    Progressbar = ns("ost.ProgressBar") ,
    Polling = ns("ost.Polling") ,
    utilities =  ns("ost.utilities")
  ;

  var oThis = ost.tokenMintProgress = {
  
    jMintPollingError     : $('.minting-error-state'),
    jMintPollingSuccess   : $('#minting-complete'),
    jSection              : $('.jSection'),
  
    sProgressBarEl        :  '#mint-progress',

    genericErrorMessage   :  'Something went wrong!',
    progressBar           :  null,
    polling               :  null,
    
    mintingStatusEndPoint :  null,
    workflowId            :  null,
    

    init : function ( config ) {
      $.extend( oThis , config );
      oThis.progressBar = new Progressbar({
        sParentEl : oThis.sProgressBarEl
      });
      oThis.progressBar.setTooltipPosition(0);
      oThis.getMintingStatus();
    },

    getMintingStatus : function() {
      if( !oThis.workflowId ) return ;
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
        oThis.progressBar.updateProgressBar( response );
        if( oThis.polling.isWorkflowFailed( response ) || oThis.polling.isWorkflowCompletedFailed( response ) ){
           oThis.onWorkflowFailed( response );
        } else if( !oThis.polling.isWorkFlowInProgress( response )){
          oThis.onWorkflowComplete( response );
        }
      }else {
       oThis.onWorkflowFailed( response );
      }
    },
    
    onPollingError : function (jqXHR , error ) {
      if(oThis.polling.isMaxRetries()){
        oThis.onWorkflowFailed( error );
      }
    },
  
    onWorkflowComplete : function ( response ) {
      oThis.showSection( oThis.jMintPollingSuccess );
    },
  
    onWorkflowFailed : function ( response ) {
      utilities.showGeneralError(  oThis.jMintPollingError , response );
      oThis.showSection( oThis.jMintPollingError );
    },
    
    showSection: function ( jSection ) {
      oThis.jSection.hide();
      jSection.show();
    }
  }

})(window,jQuery);