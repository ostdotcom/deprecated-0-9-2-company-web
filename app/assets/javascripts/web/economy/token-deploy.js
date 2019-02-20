;
(function (window, $) {

  var ost  = ns("ost") ,
      Polling = ns("ost.Polling") ,
      Progressbar = ns("ost.ProgressBar") ,
      utilities = ns("ost.utilities")
  ;
  var oThis = ost.tokenDeploy = {
    
    jResetDeployBtn : null,
    polling : null ,
    tokenDeployContainer : null,
    jResetDeployError: null ,
    sProgressBarEl :null,
    jDeploySuccessState : null,
    jTokenDeployInProgress : null,
    workflowID : null,
    

    init : function (config) {
      $.extend(oThis, config);

      console.log("======config======" , config);
      
      oThis.jResetDeployBtn = $(".j-reset-deployment-btn");
      oThis.tokenDeployContainer = $(".token-deploy-container");
      oThis.jResetDeployError =  $('.deploy-error-state');
      oThis.sProgressBarEl = ".token-deploy-progress-wrapper";
      oThis.jDeploySuccessState = $('.deploy-success-state');
      oThis.jTokenDeployInProgress = $('.token-deploy-in-progress');

      oThis.bindActions();

      if( oThis.workflowId ){
        oThis.progressBar = new Progressbar({
          sParentEl : oThis.sProgressBarEl
        });
        oThis.progressBar.setTooltipPosition(0);
        oThis.getDeployStatus();
      }

    },

    bindActions : function(){
      oThis.jResetDeployBtn.on("click",function () {
        oThis.onResetDeploy();
      });
    },

    onResetDeploy : function(){
      utilities.clearErrors( oThis.jResetDeployError ) ;
      $.ajax({
        url: oThis.resetdeployEndPoint,
        method: "POST",
        beforeSend: function(){
          utilities.btnSubmittingState( oThis.jResetDeployBtn );
        },
        success : function (response) {
          if( response.success ){
            window.location = oThis.redirectUrl;
          }else {
            oThis.onResetFailure( response );
          }
        },
        error : function (response) {
          oThis.onResetFailure( response );
        },
        complete: function () {
          utilities.btnSubmitCompleteState( oThis.jResetDeployBtn );
        }
      })
    },

    onResetFailure : function( res ){
      utilities.showGeneralError(oThis.jResetDeployError , res );
    } ,

    getDeployStatus : function() {
      oThis.polling = new Polling({
        pollingApi      : oThis.getDeployStatusEndPoint ,
        pollingInterval : 4000,
        onPollSuccess   : oThis.onPollingSuccess,
        onPollError     : oThis.onPollingError
      });
      oThis.polling.startPolling();
    },

    onPollingSuccess : function( response ){
      var pollingThis = this ;
      if(response && response.success){
        oThis.progressBar.updateProgressBar( response );
        if( pollingThis.isWorkflowFailed( response ) ||  pollingThis.isWorkflowCompletedFailed( response )){
         oThis.onCurrentStepFailed( response );
        } else if( !pollingThis.isWorkFlowInProgress( response ) ){
            oThis.pollingComplete();
        }
      }else {
        oThis.onCurrentStepFailed( response );
      }
    },

    onPollingError : function( jqXhr , error  ){
      var pollingThis = this ;
      if(pollingThis.isMaxRetries() ){
        oThis.onCurrentStepFailed( error );
      }
    },
  
    pollingComplete : function(  ){
      oThis.polling && oThis.polling.stopPolling();
      oThis.jTokenDeployInProgress.hide();
      oThis.jDeploySuccessState.show();
      $('#sidebar .to-enable-on-setup').removeClass('disabled');
    },

    onCurrentStepFailed : function( res ){
      oThis.polling && oThis.polling.stopPolling();
      oThis.tokenDeployContainer.hide();
      oThis.jResetDeployError.show();
      utilities.showGeneralError(oThis.jResetDeployError , res );
    }


  };


})(window, jQuery);