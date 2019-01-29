;
(function (window, $) {

  var ost  = ns("ost") ,
      Polling = ns("ost.Polling") ,
    Progressbar = ns("ost.ProgressBar") ,
      utilities = ns("ost.utilities")
  ;
  var oThis = ost.tokenDeploy = {
    jResetDeployBtn : null,
    polling : 0 ,
    tokenDeployContainer : null,
    jResetDeployError: null ,
    sProgressBarEl :null,
    

    init : function (config) {
      $.extend(oThis, config);

      oThis.jResetDeployBtn = $(".j-reset-deployment-btn");
      oThis.tokenDeployContainer = $(".token-deploy-container");
      oThis.jResetDeployError =  $('.deploy-error-state');
      oThis.sProgressBarEl = ".token-deploy-content";
      oThis.bindActions();

      if( !oThis.isPollFailed  ){
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
        onPollSuccess   : oThis.onPollingSuccess.bind( oThis ),
        onPollError     : oThis.onPollingError.bind( oThis )
      });
      oThis.polling.startPolling();
    },

    onPollingSuccess : function( response ){
      if(response && response.success){
        var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
        if( currentWorkflow.status == oThis.currentStepFailedStatus ){
          oThis.onCurrentStepFailed( response )
        }
        else{
          oThis.shouldStopPolling( currentWorkflow );
          oThis.progressBar.updateProgressBar( currentWorkflow );

        }
      }
    },

    onPollingError : function( jqXhr , error  ){
      if( oThis.polling.isMaxRetries() ){
        oThis.onCurrentStepFailed( error );
      }
    },

    shouldStopPolling : function( currentWorkflow ){
      if( currentWorkflow && currentWorkflow.percent_completion  >= 100){
        oThis.polling && oThis.polling.stopPolling();
      }
    },

    onCurrentStepFailed : function( res ){
      oThis.tokenDeployContainer.hide();
      utilities.showGeneralError(oThis.jResetDeployError , res );
    }


  };


})(window, jQuery);