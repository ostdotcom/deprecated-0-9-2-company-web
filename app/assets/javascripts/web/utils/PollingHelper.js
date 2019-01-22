;
(function (window , $) {
  
  var ost = ns('ost');
  
  ost.Polling = function ( config ) {
     var oThis = this ;
     $.extend( oThis  ,  config );
    
  };
  
  ost.Polling.prototype =  {
  
    pollingApi:null ,
    pollXhr : null ,
    pollingInterval : 2000 ,
    
    maxRetry: 5,
    currentRetry: 0,
    
    isPolling: false ,
    shouldPoll: false ,
    
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
  
    isPollingRequired : function ( response  ) {
      return false ; //Overwrite from outside
    },
  
    poll: function () {
      var oThis = this;
    
      if ( oThis.pollXhr ) {
        console.log("Polling request already in progress.");
        return false;
      }
  
      if ( !oThis.isPollingRequired() ) {
        oThis.stopPolling();
        return false;
      }
      
      var data = oThis.getData( );
      
      oThis.pollXhr = $.ajax({
        url         : oThis.pollingApi
        , data      : data
        , success   : function () {
          oThis.onPollSuccess.apply(oThis, arguments);
        }
        , error     : function () {
          oThis.onPollError.apply(oThis, arguments);
        }
        , complete  : function () {
          oThis.onPollComplete.apply(oThis, arguments);
        }
      });
      return true;
    },
  
    getData : function () {
      return oThis.data || {} //Owerrite from outside
    }
    
    , onPollSuccess: function ( response ) {
      //Overwrite from outside
    }
  
    , onPollError: function () {
      //Overwrite from outside
    }
  
    , onPollComplete: function () {
      var oThis = this;
      oThis.pollXhr = null;
      oThis.currentRetry++;
      if( !oThis.isMaxRetries() ){
        oThis.scheduleNextPoll();
      }
    },
    
    isMaxRetries: function () {
      var oThis = this;
      return oThis.currentRetry < oThis.maxRetry ;
    }
  
    , scheduleNextPoll: function () {
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
    
    }
    
  }
  
})(window , jQuery );