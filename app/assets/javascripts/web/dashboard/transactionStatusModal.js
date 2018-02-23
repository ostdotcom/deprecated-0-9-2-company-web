;
(function (window, $) {

  var ost = ns("ost");
  ost.transactionStatusModal = {
    init: function ( config ) {
      var oThis = this;

      oThis.callback = null;
      oThis.ajaxConfig = {
        //Some generic things.
        success: function ( response ) {
          oThis.onPollResponse( response );


          //If not all steps complete.
          if ( !oThis.areAllStepsComplete() ) {
            oThis.scheduleNextRequest();
          }
        }
        , error: function () {
          //Silent handling. Please re-scheudle.
          oThis.scheduleNextRequest();
        }
      };
      oThis.resetView();

    }
    , callback : null
    , ajaxConfig: null
    , poll: function ( pollUrl, requestData, callback ) {
      var oThis = this;
      //Always re-init.
      oThis.init();

      //Call sendPollRequest.

    }
    , scheduleNextRequest: function () {

    }
    , sendPollRequest: function () {
      //Fire ajax here.

    }
    , onPollResponse: function () {
      var oThis = this;


      //Update UI
    }
    , updateView : function () {
      //Read response to build/Update UI
    }
    , resetView: function () {

    }
    , show: function () {
      var oThis = this;

    }
    , hide: function () {
      var oThis = this;

    }
    , areAllStepsComplete: function () {

    }
    , onAllStepsComplete: function () {
      var oThis = this;

      setTimeout( function () {
        //Clearup. SetTime out because ajax success might be still reading some flags.
        oThis.init();
      }, 10);
    }
  };
})(window, jQuery);


