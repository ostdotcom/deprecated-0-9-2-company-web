/**
  Note for Devs: This class allows multiple instances to occour.
  But, only 1 ever instance can be in existance. (Because only 1 UI Modal can be in existance.)
  If you are retaining the instance, it is your responsibility to release it. 
  Its best to create the instance inside a function and never retain the instance.

  Ideal use:

  var myFn = function () {
    var critical_chain_interaction_log_id = 5;
    var myInstance = new ost.TSM( critical_chain_interaction_log_id );
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

  var singleInstance = null;

  var TxStatusModal = ost.TSM = function (data, url, config ) {
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
    oThis.metaData  = oThis.metaData || {};

    if ( !oThis.data ) {
      console.log("IMPORTANT :: TxStatusModal :: please provide critical_chain_interaction_log_id" );
      return null;
    }
    oThis.jModal        = oThis.jModal        || $("#tx-status-modal");
    oThis.jList         = oThis.jList         || oThis.jModal.find("#tx-status-list");
    oThis.jRowTemplate  = oThis.jRowTemplate  || oThis.jModal.find("#tx-status-row-template");
    oThis.rowTemplate   = oThis.rowTemplate   || oThis.createRowTemplate();
    oThis.jHeader       = oThis.jHeader       || oThis.jModal.find("#tx-status-header");
    oThis.jFooter       = oThis.jFooter       || oThis.jModal.find("#tx-status-footer");


    oThis.init();

  }

  //Static Stuff
  TxStatusModal.UiStates = {
    "START"         : 0
    , "PROCESSING"  : 1
    , "SUCCESS"     : 2
    , "ERROR"       : 3
  };

  TxStatusModal.ElementTypes = {
    "HEADER"    : "header"
    , "FOOTER"  : "footer"
  }

  TxStatusModal.HeaderTemplateIds = {};
  TxStatusModal.HeaderTemplateIds[ TxStatusModal.UiStates.START ]       = "default-tx-status-modal-header-start";
  TxStatusModal.HeaderTemplateIds[ TxStatusModal.UiStates.PROCESSING ]  = "default-tx-status-modal-header-processing";
  TxStatusModal.HeaderTemplateIds[ TxStatusModal.UiStates.SUCCESS ]     = "default-tx-status-modal-header-success";
  TxStatusModal.HeaderTemplateIds[ TxStatusModal.UiStates.ERROR ]       = "default-tx-status-modal-header-error";

  TxStatusModal.FooterTemplateIds = {};
  TxStatusModal.FooterTemplateIds[ TxStatusModal.UiStates.START ]       = "default-tx-status-modal-footer-start";
  TxStatusModal.FooterTemplateIds[ TxStatusModal.UiStates.PROCESSING ]  = "default-tx-status-modal-footer-processing";
  TxStatusModal.FooterTemplateIds[ TxStatusModal.UiStates.SUCCESS ]     = "default-tx-status-modal-footer-success";
  TxStatusModal.FooterTemplateIds[ TxStatusModal.UiStates.ERROR ]       = "default-tx-status-modal-footer-error";

  TxStatusModal.prototype = {
    constructor: TxStatusModal
    , data              : null
    , url               : "/api/economy/token/get-critical-chain-interaction-status"
    , jModal            : null
    , jHeader           : null
    , jFooter           : null

    , headerTemplateIds : null /* An Object/Map of uiState & Ids of Script tags with type != "text/javascript" */
    , headerTemplates   : null /* An Object/Map of uiState & compiled HandleBar templates */

    , footerTemplateIds : null /* An Object/Map of uiState & Ids of Script tags with type != "text/javascript" */
    , footerTemplates   : null /* An Object/Map of uiState & compiled HandleBar templates */

    , metaData        : null
    , isPolling       : false
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
      });

      oThis.initMetaData();
      oThis.initAllElementTemplates();
      oThis.setAllElements();
    }

    , initMetaData: function () {
      var oThis = this;

      oThis.metaData = oThis.metaData || {};
      if ( typeof oThis.metaData.uiState != "number" ) {
        oThis.metaData.uiState = TxStatusModal.UiStates.START;  
      }
      
    }
    , initAllElementTemplates: function () {
      var oThis = this;

      oThis.initHeaderTemplates();
      oThis.initFooterTemplates();
    }
    , setAllElements : function ( response ) {
      var oThis = this;

      oThis.setHeader( response );
      oThis.setFooter( response );
    }


    /** BEGIN :: Header & its Templates **/
    , initHeaderTemplates : function () {
      var oThis = this;

      oThis.headerTemplateIds = oThis.headerTemplateIds || {};
      oThis.headerTemplates = oThis.headerTemplates || {};
      oThis.populateTemplates(oThis.headerTemplates, oThis.getHeaderTemplateId );
    }
    , getHeaderTemplateId: function ( uiState ) {
      var oThis = this;

      return oThis.headerTemplateIds[ uiState ] || TxStatusModal.HeaderTemplateIds[ uiState ];
    }

    , setHeaderTemplateId: function ( templateId, uiState ) {
      var oThis = this;

      var headerTemplateIds = oThis.headerTemplateIds;
      if ( !headerTemplateIds ) {
        oThis.headerTemplateIds = headerTemplateIds = {};
      }

      headerTemplateIds[ uiState ] = templateId;
    }

    , setHeader : function ( responseData ) {
      var oThis = this;

      var elementType   = TxStatusModal.ElementTypes.HEADER
        , jEl           = oThis.jHeader
        , templatesMap  = oThis.headerTemplates
      ;
      
      return oThis.updateElement(elementType, jEl, templatesMap, responseData);
    }



    /** BEGIN :: Footer & its Templates **/
    , initFooterTemplates : function () {
      var oThis = this;

      oThis.footerTemplateIds = oThis.footerTemplateIds || {};
      oThis.footerTemplates = oThis.footerTemplates || {};
      oThis.populateTemplates(oThis.footerTemplates, oThis.getFooterTemplateId );
    }

    , getFooterTemplateId: function ( uiState ) {
      var oThis = this;

      return oThis.footerTemplateIds[ uiState ] || TxStatusModal.FooterTemplateIds[ uiState ];
    }

    , setFooterTemplateId: function ( templateId, uiState ) {
      var oThis = this;

      var footerTemplateIds = oThis.footerTemplateIds;
      if ( !footerTemplateIds ) {
        oThis.footerTemplateIds = footerTemplateIds = {};
      }

      footerTemplateIds[ uiState ] = templateId;
    }

    , setFooter: function ( responseData ) {
      var oThis = this;

      var elementType   = TxStatusModal.ElementTypes.FOOTER
        , jEl           = oThis.jFooter
        , templatesMap  = oThis.footerTemplates
      ;
      
      return oThis.updateElement(elementType, jEl, templatesMap, responseData);
    }

    /** BEGIN :: Generic/Reusable Template Related Stuff **/
    , populateTemplates: function ( templatesMap, templateIdGetter ) {
      var oThis = this;

      var uiStakeKey
        , uiState
        , templateId
        , jTemplateEl
        , templateHtml
        , template
      ;

      for( uiStakeKey in TxStatusModal.UiStates ) {

        uiState = TxStatusModal.UiStates[ uiStakeKey ];


        if ( templatesMap[ uiState ] ) {
          //Skiped because templatesMap already has it.
          continue;
        }

        
        templateId = templateIdGetter.call(oThis, uiState);
        jTemplateEl = $( "#" + templateId );
        templateHtml = "";
        if ( jTemplateEl.length ) {
          templateHtml = jTemplateEl.html() || "";
        } else {
          templateHtml = "";
        }
        template = Handlebars.compile( templateHtml );
        templatesMap[ uiState ] = template;
      }
    }

    , getCurrentUiState: function () {
      var oThis = this;

      return oThis.metaData.uiState;
    }

    , setCurrentUiState: function ( uiState ) {
      var oThis = this;

      oThis.metaData = oThis.metaData || {};
      oThis.metaData.uiState = uiState;
    }

    , updateElement: function ( elementType, jEl, templatesMap, responseData ) {
      var oThis = this;

      var uiState       = oThis.getCurrentUiState()
        , template      = templatesMap[ uiState ]
        , finalHtml     = ""
        , templatePayload
      ;
      
      if ( template ) {
        templatePayload = {
          "uiState"       : uiState
          , "elementType" : elementType
          , "metaData"    : oThis.metaData || {}
          , "data"        : responseData || {}
        };
        finalHtml = template( templatePayload );
      } else {
        console.log("IMPORTANT :: updateElement :: template not found for uiState = ", uiState, " elementType", elementType);
      }

      console.log("finalHtml" , finalHtml);

      jEl.html( finalHtml );
    }

    /** BEGIN :: Show/Hide Methods **/
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

    /** BEGIN :: Polling Related Methods **/
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
      }, 3000);

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
      } else if ( proccessedCnt === results.length ) {
        oThis.stopPolling();
        oThis.onTxSuccess( response );
      } else {
        oThis.onTxProcessing( response );
      }
    }

    /** BEGIN :: Mehtods dealing with different Tx statuses. **/
    , onTxProcessing : function ( response ) { 
      var oThis = this;
      oThis.setCurrentUiState( TxStatusModal.UiStates.PROCESSING );
      oThis.setAllElements( response );
    }
    , onTxSuccess : function ( response ) {
      var oThis = this;
      singleInstance = null;
      oThis.setCurrentUiState( TxStatusModal.UiStates.SUCCESS );
      oThis.setAllElements( response );
      oThis.callTrigger("txSuccess", response);
    }
    , onTxFailed : function ( response ) {
      var oThis = this;
      singleInstance = null;
      oThis.setCurrentUiState( TxStatusModal.UiStates.ERROR );
      oThis.setAllElements( response );
      oThis.callTrigger("txFailed", response);
    }

    /** BEGIN :: Generic Methods that trigger events **/
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



  // Code to Simulate:
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

  //   var txStatusModal = new ost.TSM(4, "/tx_dummy.json");
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





