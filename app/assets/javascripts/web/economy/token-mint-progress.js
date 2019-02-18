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
        onPollSuccess   : oThis.onPollingSuccess,
        onPollError     : oThis.onPollingError
      });
      oThis.polling.startPolling();
    },

    onPollingSuccess : function( response ){
      var pollingThis =  this ;
      if(response && response.success){
        oThis.progressBar.updateProgressBar( response );
        if( pollingThis.isWorkflowFailed( response ) || pollingThis.isWorkflowCompletedFailed( response ) ){
           oThis.onWorkflowFailed( response );
        } else if( !pollingThis.isWorkFlowInProgress( response )){
          oThis.onWorkflowComplete( response );
        }
      }else {
       oThis.onWorkflowFailed( response );
      }
    },
    
    onPollingError : function (jqXHR , error ) {
      var pollingThis = this ;
      if(pollingThis.isMaxRetries()){
        oThis.onWorkflowFailed( error );
      }
    },
  
    onWorkflowComplete : function ( response ) {
      oThis.polling.stopPolling();
      
      var amountMinted = utilities.deepGet( response , "data.workflow_payload.amountMinted" ) ,
          toEthBT      = window.web3.fromWei( amountMinted , "ether")
      ;
      
      if( toEthBT ){
        $('.total-token-minted').text( PriceOracle.toPrecessionBT( toEthBT ) );
      }
      oThis.showSection( oThis.jMintPollingSuccess );
    },
  
    onWorkflowFailed : function ( response ) {
      oThis.polling.stopPolling() ;
      utilities.showGeneralError(  oThis.jMintPollingError , response );
      oThis.showSection( oThis.jMintPollingError );
    },
    
    showSection: function ( jSection ) {
      oThis.jSection.hide();
      jSection.show();
    }
  }

})(window,jQuery);