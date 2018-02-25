/**
  Note for Devs: This class allows multiple instances to occour.
  But, only 1 ever instance can be in existance. (Because only 1 UI Modal can be in existance.)
  If you are retaining the instance, it is your responsibility to release it. 
  Its best to create the instance inside a function and never retain the instance.

  Ideal use:

  var myFn = function () {
    var critical_chain_interaction_log_id = 5;
    var myInstance = new TxStatusModal( critical_chain_interaction_log_id );
    if ( !myInstance ) {
      //TxStatusModal already being used by someone else.
      return;
    }

    // Some customisations
    myInstance.data.someOtherParam = "something"

    //Listen to events.
    $( myInstance ).on(myInstance.events.txSuccess, function () {
      //Do Something here.
    });
    $( myInstance ).on(myInstance.events.txFailed, function () {
      //Do Something here.
    });
  };
  myFn();
**/



;
(function (window, $) {

  var ost = ns("ost");

  //var txStatusModal = new ost.TxStatusModal(4);
  //txStatusModal.show(1,"/tx_dummy.json");

  var singleInstance = null;

  var TxStatusModal = ost.TxStatusModal = function (data, url, config ) {
    var oThis = this;

    if ( singleInstance ) {
      return null; //Can not allow multiple instances.
    }
    singleInstance = oThis;

    $.extend(oThis, config);

    if ( typeof data === "string" || typeof data === "number") {
      var dataObj = {};
      dataObj.critical_chain_interaction_log_id = data;
      data = dataObj;
    }

    oThis.url   = url   || oThis.url;
    oThis.data  = data  || oThis.data;

    if ( !oThis.data ) {
      console.log("IMPORTANT :: TxStatusModal :: please provide critical_chain_interaction_log_id" );
      return null;
    }
    oThis.jModal        = oThis.jModal        || $("#tx-status-modal");
    oThis.jList         = oThis.jList         || oThis.jModal.find("#tx-status-list");
    oThis.jRowTemplate  = oThis.jRowTemplate  || oThis.jModal.find("#tx-status-row-template");
    oThis.rowTemplate   = oThis.rowTemplate   || oThis.createRowTemplate();

    oThis.init();

  }

  TxStatusModal.prototype = {
    constructor: TxStatusModal
    , data      : null
    , url       : "/api/economy/token/get-critical-chain-interaction-status"
    , jModal    : null
    , isPolling : false
    , events    : {
      pollSuccess     : "pollSuccess"
      , pollError     : "pollError"
      , pollComplete  : "pollComplete"
      , txSuccess     : "txSuccess"
      , txFailed      : "txFailed"
    }
    , simpleDataTable : null
    , rowTemplate     : null
    , createRowTemplate : function () {
      var oThis = this;

      var rowTemplateHtml = oThis.jRowTemplate.html()
        , rowTemplate   = Handlebars.compile( rowTemplateHtml )
      ;
      console.log("rowTemplateHtml", rowTemplateHtml);
      console.log("createRowTemplate :: oThis.rowTemplate", rowTemplate);
      
      return rowTemplate;
    }
    , init: function () {
      var oThis = this;

      //Empty the table.
      oThis.jList.html("");
      oThis.simpleDataTable = oThis.simpleDataTable || new ost.SimpleDataTable({
        jParent             : oThis.jList
        , jRowTemplateHtml  : null
        , rowTemplate       : oThis.rowTemplate
        , fetchResults      : function () {} /* Hack to prevent datatable requests */
      })

    }
    , show      : function () {
      var oThis = this;
      //Show the model.
      oThis.jModal.modal("show");
      !oThis.isPolling && oThis.startPolling();
    }

    , hide    : function () {
      var oThis = this;

      oThis.jModal.modal("hide");
    }


    , startPolling: function () {
      var oThis = this;

      if ( oThis.isPolling ) {
        return false;
      }
      oThis.shouldPoll = true;
      oThis.isPolling = true;
      oThis.simpleDataTable.showLoading();
      return oThis.pollTxStatus();

    }

    , stopPolling: function () {
      var oThis = this;
      oThis.shouldPoll = false;
    }

    , pollXhr : null
    , pollTxStatus: function () {
      var oThis = this;

      if ( oThis.pollXhr ) {
        console.log("Polling request already in progress.");
        return false;
      }

      console.log("oThis.data", oThis.data);
      oThis.pollXhr = $.ajax({
        url         : oThis.url
        , data      : oThis.data
        , success   : function () {
          oThis.onPollSuccess.apply(oThis, arguments);
        }
        , error     : function () {
          oThis.onPollError.apply(oThis, arguments);
        } 
        , complete  : function () {
          oThis.onPollComplete.apply(oThis, arguments);
          oThis.pollXhr = null;
        }
      });
      return true;
    }
    , onPollSuccess: function ( response ) {
      var oThis = this;

      console.log("onPollSuccess triggered \n", arguments);
      //Let the world know that we have a response.
      //Let them be free to modify anything they want.
      oThis.applyTrigger("pollSuccess", arguments);

      if ( response.success ) {
        oThis.processResponse( response );
      } else {
        console.log("Keep it quite, we have an api error!");
        //Shhh....
        //Keep it a secret.
      }

      oThis.scheduleNextPoll();
    }
    , onPollError: function () {
      var oThis = this;

      console.log("onPollError triggered \n", arguments);
      //Let the world know that we have an error.
      //Let them be free to modify anything they want.
      $( oThis ).trigger(oThis.events.pollError, Array.prototype.slice.call(arguments) );

      //Never mind, lets poll again.
      oThis.scheduleNextPoll();

    }

    , onPollComplete: function () {
      var oThis = this;
      //Let the world know that we have an error.
      //Let them be free to modify anything they want.
      $( oThis ).trigger(oThis.events.pollComplete, Array.prototype.slice.call(arguments) );
      console.log("onPollComplete triggered \n", arguments);
      //This request has done its job.
      oThis.pollXhr = null;
    }


    , shouldPoll: true
    , scheduleNextPoll: function () {
      var oThis = this;

      if ( !oThis.shouldPoll ) {
        oThis.isPolling = false;
        return;
      }

      setTimeout(function () {
        oThis.pollTxStatus();
      }, 600);

    }

    , processResponse: function ( response ) {
      var oThis = this;

      var dataTable     = oThis.simpleDataTable
        , data          = response.data
        , resultType    = data["result_type"]
        , results       = data[ resultType ]
        , hasFailed     = false
        , proccessedCnt = 0
      ;

      
      oThis.simpleDataTable.hideLoading();
      results.forEach( function (result, i ) {
        result.id   = i;
        result.uts  = Date.now()
        var existing = dataTable.getResultById( result.id );
        if ( existing ) {
          $.extend( existing, result );
          dataTable.updateResult( existing );
        } else {
          dataTable.appendResult( result );
        }
        switch( result.status ) {
          case "processed":
            proccessedCnt ++;
            break;
          case "failed":
          case "time_out":
            hasFailed = true;
            break;
          case "pending":
          case "queued":
            break;
        }
      });
      if ( hasFailed ) {
        oThis.stopPolling();
        oThis.onTxFailed( response );
        setTimeout(function () {
          oThis.hide();  
        }, 900);
      } else if ( proccessedCnt === results.length ) {
        oThis.stopPolling();
        oThis.onTxSuccess( response );
        setTimeout(function () {
          oThis.hide();  
        }, 900);
      }
    }
    , onTxSuccess : function ( response ) {
      var oThis = this;

      oThis.callTrigger("txSuccess", response);
    }

    , callTrigger: function ( eventKey, data ) {
      var oThis = this;

      var args = Array.prototype.slice.call(arguments);
      args.shift();
      $( oThis ).trigger(oThis.events[eventKey], args );
    }

    , applyTrigger: function ( eventKey, argsAsArgumnets ) {
      var oThis = this;

      var args = Array.prototype.slice.call( argsAsArgumnets );
      $( oThis ).trigger(oThis.events[eventKey], args );
    }

  }

})(window, jQuery);



  // // Code to Simulate:
  // (function () {
  //   //Config for simulation:
  //   var noOfSteps = 5;
  //   var noOfPollRequests = (2 * noOfSteps) + Math.max(0, (noOfSteps - 1) );
  //   var resolveIn        = parseInt( noOfPollRequests/noOfSteps );
  //   var shouldFail = false;

  //   var results = [];
  //   for(var cnt = 0; cnt < noOfSteps; cnt++ ) {
  //     results.push({
  //       "status": "queued"
  //       , "display_text": "Step " + Number(cnt + 1) + " is queued"
  //     });
  //   }

  //   var txStatusModal = new ost.TxStatusModal(4, "/tx_dummy.json");
  //   txStatusModal.pollTxStatus = function () {
  //     var response = {
  //       success: true 
  //       , data: {
  //         "result_type" : "tx_data"
  //         , "tx_data"   : results
  //       }
  //     };
  //     if ( noOfPollRequests % resolveIn == 0 || !noOfPollRequests ) {
  //       for(var cnt = 0; cnt < noOfSteps; cnt++ ) {
  //         var thisResult = results[ cnt ];
  //         if ( thisResult.status === "processed") {
  //           continue;
  //         }          
  //         if ( thisResult.status === "pending" ) {
  //           thisResult.status = "processed";
  //           thisResult.display_text = "Step " + Number(cnt + 1) + " is processed";
  //         }
  //         if ( thisResult.status === "queued" ) {
  //           if ( noOfPollRequests ) {
  //             thisResult.status = "pending"; 
  //             thisResult.display_text = "Step " + Number(cnt + 1) + " is pending"; 
  //           }
  //           if ( noOfPollRequests ) {
  //             break;
  //           } else {
  //             //Last request.
  //             thisResult.status = shouldFail ? "failed" : "processed";
  //             thisResult.display_text = "Step " + Number(cnt + 1) + " is " + (shouldFail ? "Failed" : "Processed");
  //             if ( shouldFail ) {
  //               break;
  //             }
  //           }
  //         } 
  //       }
  //     }
  //     --noOfPollRequests;
  //     setTimeout(function () {
  //       txStatusModal.onPollSuccess( response );
  //     }, 300)
  //   }
  //   setTimeout(function () {
  //     txStatusModal.show();
  //   }, 2000);
  
  // })();





