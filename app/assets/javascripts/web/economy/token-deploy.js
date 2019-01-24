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
      oThis.jResetDeployError =  $('.deploy-error-state .general_error');
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
      oThis.jResetDeployError.removeClass('is-invalid').text("");
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
          oThis.progressBar.updateProgressBar( currentWorkflow );

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
      oThis.jResetDeployError.show();
    },


  };


})(window, jQuery);