;
(function (window , $) {
  
  var ost = ns('ost') ,
      utilities =  ns("ost.utilities")
  ;
  
  ost.Polling = function ( config ) {
     var oThis = this ;
     $.extend( oThis  ,  config );
    
  };
  
  var PollingStatusMap = {
    inProgress : "inProgress" ,
    completed  : "completed",
    failed: "failed" ,
    completelyFailed : "completelyFailed"
  };
  
  ost.Polling.prototype =  {
  
    pollingApi:null ,
    pollingMethod : 'GET',
    pollXhr : null ,
    pollingInterval : 2000 ,
    data : null ,
    
    maxRetry: 5,
    currentRetry: 0,
    
    isPolling: false , // To check if already polling
    shouldPoll: false , // To check for next polling
    
    startPolling : function () {
      var oThis = this;
      if ( oThis.isPolling ) {
        console.log("Polling Already in Progress");
        return false;
      }
      console.log("Polling has been started");
      oThis.shouldPoll = true;
      oThis.isPolling = true;
      oThis.currentRetry = 0;
      oThis.poll();
    },
  
    stopPolling: function () {
      var oThis = this;
      oThis.shouldPoll = false;
      oThis.isPolling = false;
      console.log("Polling has been stopped");
    },
  
    poll: function () {
      var oThis = this;
    
      if ( oThis.pollXhr ) {
        console.log("Polling request already in progress.");
        return false;
      }
      
      var data = oThis.getData( );
      
      oThis.pollXhr = $.ajax({
        url       : oThis.pollingApi,
        method    : oThis.pollingMethod,
        data      : data,
        success   : function () {
          oThis.onPollSuccess.apply(oThis, arguments);
        },
        error     : function () {
          oThis.currentRetry++;
          oThis.onPollError.apply(oThis, arguments);
        },
        complete  : function () {
          oThis.onPollComplete.apply(oThis, arguments);
        }
      });
      return true;
    },
  
    getData : function () {
      var oThis = this;
      return oThis.data || {} //Overwrite from outside
    },
    
    onPollSuccess: function ( response ) {
      //Overwrite from outside
    },
  
    onPollError: function ( jqXhr , error ) {
      //Overwrite from outside
    },
  
    onPollComplete: function () {
      var oThis = this;
      oThis.pollXhr = null;
      if( !oThis.isMaxRetries() ){
        oThis.scheduleNextPoll();
      }
    },
    
    isMaxRetries: function () {
      var oThis = this;
      return oThis.currentRetry > oThis.maxRetry ;
    },
  
    scheduleNextPoll: function () {
      var oThis = this;
    
      if ( !oThis.shouldPoll ) {
        oThis.isPolling = false;
        console.log("scheduleNextPoll :: Not scheduling next poll. shouldPoll is false");
        return;
      }
    
      console.log("scheduleNextPoll :: Next Poll Scheduled");
    
      setTimeout(function () {
        oThis.poll();
      }, oThis.pollingInterval );
    
    },
    
    //Helper Functions can be overwritten
    isWorkFlowInProgress : function ( res ) {
      var status = utilities.deepGet( res , 'data.workflow_current_step.status') ;
      return status == PollingStatusMap[ 'inProgress' ] ;
    },
    
    isWorkflowFailed: function ( res) {
      var status = utilities.deepGet( res , 'data.workflow_current_step.status') ;
      return status == PollingStatusMap[ 'failed' ] ;
    },
  
    isWorkflowCompletedFailed: function ( res ) {
      var status = utilities.deepGet( res , 'data.workflow_current_step.status') ;
      return  status == PollingStatusMap[ 'completelyFailed' ];
    },
    
    isWorkflowCompleted: function ( res ) {
      var status = utilities.deepGet( res , 'data.workflow_current_step.status') ;
      return status == PollingStatusMap[ 'completed' ] ;
    }
  }
  
})(window , jQuery );