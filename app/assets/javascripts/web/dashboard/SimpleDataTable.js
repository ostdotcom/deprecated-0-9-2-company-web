;
(function (window, $) {
  var logMe = false;

  var ost  = ns("ost");

  var SimpleDataTable = ost.SimpleDataTable = function ( config ) {
    var oThis = this;


    $.extend( oThis, config );

    if ( !oThis.jParent ) {
      console.log("jParent is mandetory config for SimpleDataTable");
      throw "jParent is mandetory config for SimpleDataTable";
    }
    oThis.jRowTemplateHtml  = oThis.jRowTemplateHtml || oThis.jParent.find( '[data-row-template]' );
    oThis.rowTemplate       = oThis.rowTemplate ||  Handlebars.compile( oThis.jRowTemplateHtml.html() );
    oThis.fetchResultsUrl   = oThis.fetchResultsUrl || oThis.jParent.data("url") || null ;
    //To be passed by config (when needed)
    oThis.sScrollParent      = oThis.sScrollParent;

    logMe && console.log("oThis", oThis);

    oThis.jDataLoader       = oThis.jDataLoader || oThis.createLoadingWrap( oThis.jParent );
    oThis.jRowTemplateHtml && oThis.jRowTemplateHtml.remove();

    oThis.loadTableData();

    var wrapperScrollObserver = oThis.scrollObserver || function () {};
    oThis.scrollObserver = function () {
      wrapperScrollObserver.apply( oThis, arguments );
    };
  };

  SimpleDataTable.prototype = {
    constructor: SimpleDataTable
    , jParent: null
    , jRowTemplateHtml : null
    , rowTemplate : null
    , sScrollParent: null
    , events: {
      "responseProcessed": "responseProcessed"
    }
    , resultFetcherCallback: null
    
    , getRowTemplate: function () {
      var oThis = this;

      return oThis.rowTemplate;
    }

    , results: null
    , lastMeta: null
    , hasNextPage: true
    , isLoadingData: true
    , loadTableData: function () {
      var oThis = this;
      
      var isFirstLoad = true;

      oThis.jParent.html('');
      oThis.results = [];
      oThis.lastMeta = null;
      oThis.hasNextPage = true;
      oThis.isLoadingData = true;

      oThis.fetchResults( isFirstLoad );

    }
    , reloadTableData: function () {
      var oThis = this;

      oThis.loadTableData();
    }
    , fetchResults: function ( isFirstLoad ) {
      var oThis = this;
      if ( !isFirstLoad && oThis.isLoadingData ) {
        return;
      }
      logMe && console.log("oThis.hasNextPage", oThis.hasNextPage);
      if ( !oThis.hasNextPage ) {
        return;
      }

      oThis.isLoadingData = true;
      //Unbind Scroll
      oThis.unbindScrollObserver();
      //Show Loading
      oThis.showLoading();

      oThis.resultFetcher(oThis.results, oThis.lastMeta, function ( response ) {
        oThis.processResponse( response );

        if ( oThis.hasNextPage ) {
          setTimeout( function () {
            oThis.bindScrollObserver();
          }, 300);
        }

        logMe && console.log("hideLoading called after processResponse");
        //Hide Loading
        oThis.hideLoading();

        oThis.resultFetcherCallback && oThis.resultFetcherCallback(oThis.results);
      });
    }
    , fetchResultsUrl : null
    , resultFetcher: function ( currentData, lastMeta, callback ) {
      var oThis = this;

      logMe && console.log("oThis.fetchResultsUrl", oThis.fetchResultsUrl);

      var data = oThis.params || {};

      if ( lastMeta && lastMeta.next_page_payload ) {
          data = lastMeta.next_page_payload;
      }

      $.get({
        url: oThis.fetchResultsUrl
        ,data : data
        , success: function ( response ) {
          if ( response.success ) {
            callback( response );
          } else {
            //To-Do: Show Some Error.
            oThis.showDataLoadError( response );
          }
        }
      });
    }

    , createResultMarkup : function ( result ) {
        var oThis = this;

        if ( result === oThis.dataDeletedResult ) {
          return $('<div style="display: none !important;"></div>');
        }

        var rowTemplate   = oThis.getRowTemplate()
          , rowMarkUp     = rowTemplate( result )
          , jResult       = $( rowMarkUp )
        ;

        return jResult;
    }

    , appendResult: function ( result ) {
      var oThis = this;

      //Add to result and Calculate the index.
      //result will always be pushed into array.
      //its up-to appendResult/prependResult how they want to place it in UI.
      var resultIndex = oThis.results.push( result ) - 1;

      var jResult = oThis.createResultMarkup( result );
      jResult.attr("data-result-index", resultIndex);
      oThis.jParent.append( jResult );
      return jResult;
    }
    , prependResult: function ( result ) {
      var oThis = this;

      //Add to result and Calculate the index.
      //result will always be pushed into array.
      //its up-to appendResult/prependResult how they want to place it in UI.
      var resultIndex = oThis.results.push( result ) - 1;

      var jResult = oThis.createResultMarkup( result );
      jResult.attr("data-result-index", resultIndex);
      oThis.jParent.prepend( jResult );
      return jResult;
    }

    ,deleteResult : function ( result ) {
      var oThis = this;

      var resultIndex = oThis.getResultIndexForResult( result )
        , jResult
      ;

      if ( resultIndex < 0 ) {
        logMe && console.log("deleteResult", "did not find resultIndex for result", result );
        return false;
      }

      //Update the data.
      //result will only be replaced with dataDeletedResult Object. Do not replace it.
      oThis.results.splice(resultIndex, 1, oThis.dataDeletedResult );

      //Now remove the dom.
      jResult = oThis.getResultDomForIndex( resultIndex );

      if ( jResult.length ) {
        jResult.remove();
        return true;
      }
      logMe && console.log("Result deleted, but Dom not found");
      return false;
    }

    , updateResult: function ( result ) {
      var oThis = this;


      var resultIndex = oThis.getResultIndexForResult( result )
        , jOldResult
      ;

      if ( resultIndex < 0 ) {
        logMe && console.log("updateResult", "did not find resultIndex for result", result );
        return false;
      }

      jOldResult = oThis.getResultDomForIndex( resultIndex );
      if ( !jOldResult ) {
        logMe && console.log("updateResult", "did not find jOldResult");
        return false;
      }

      var jResult = oThis.createResultMarkup( result );
      jResult.attr("data-result-index", resultIndex);
      jOldResult.replaceWith( jResult );

    }

    , getResultDomForResult: function ( result ) {
      var oThis =  this;

      var resultIndex = oThis.getResultIndexForResult( result ) ;
      if ( resultIndex < 0 ) {
        logMe && console.log("getResultDomForResult", "did not find resultIndex for result", result );
        return null;
      }

      return oThis.getResultDomForIndex( resultIndex );
    }

    , getResultDomForIndex: function ( resultIndex ) {
      var oThis =  this;


      var jResult = oThis.jParent.find("[data-result-index='" + resultIndex + "']");
      if ( jResult.length ) {
        return jResult;
      } else {
        return null;
      }

    }

    , getResultIndexForResult: function ( result ) {
      var oThis = this;

      var resultIndex = -1;
      $.each( oThis.results, function (index, thisResult) {
        if ( thisResult === result ) {
          resultIndex = index;
          return false;
        }
      });
      return resultIndex;
    }

    , processResponse: function ( response ) {
      var oThis = this;

      logMe && console.log("Datatable :: processResponse called!");
      logMe && console.log("response", response);

      if ( response.success ) {

        var data            = response.data
          , newMeta         = data.meta || {}
          , result_type     = data.result_type
          , newResults      = data[ result_type ] || []
          , nextPagePayload = newMeta.next_page_payload || {}
          , newResult       = null
          , oldResult       = null
        ;

        if ( newResults.length ) {
          for(var cnt = 0; cnt < newResults.length; cnt++ ) {
            newResult = newResults[ cnt ];
            oldResult = oThis.isResultPresent( newResult );
            if( !oldResult ){
              oThis.appendResult( newResult );
            }else {
              $.extend( oldResult , newResult );
             // oThis.updateResult( oldResult );
            }
          }
        }

        //Deal with meta
        oThis.hasNextPage = false;
        if ( Object.keys( nextPagePayload ).length ) {
          logMe && console.log("nextPagePayload", nextPagePayload);
          //We have next page.
          oThis.hasNextPage = true;
        }

        oThis.lastMeta = newMeta;
        oThis.isLoadingData = false;
      } else {
        oThis.showDataLoadError( response );
      }
      logMe && console.log("Datatable :: processResponse done!");
      oThis.applyTrigger(oThis.events.responseProcessed, arguments );
    }
    , createLoadingWrap: function ( jParent ) {
      var jWrap = $('<div data-simple-table-end class="w-100"></div>');
      //Do you magic here.
      var jContent = $(''
        + '<div class="container simple-data-table-loader mb-4" style="display: none;">'
          + '<div class="text-center">'
            + '<img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/processed-loader-1.gif" height="30" width="30"/>'
          + '</div>'
        + '</div>'
      );

      jWrap.append( jContent );
      jWrap.insertAfter( jParent );
      return jWrap;
    }

    , showLoading: function () {
      var oThis = this;
      oThis.jDataLoader.find(":first-child").show();
      logMe && console.log("showLoading", oThis.jDataLoader);
      logMe && console.log("showLoading", oThis.jDataLoader.find(":first-child"));
      oThis.unbindScrollObserver();
      logMe && console.log("showLoading");
    }

    , hideLoading: function () {
      var oThis = this;
      oThis.jDataLoader.find(":first-child").hide();
      oThis.bindScrollObserver();
      logMe && console.log("hideLoading");
    }

    , showDataLoadError: function ( response ) {

    }
    , scrollObserver : function () {
      var oThis = this;

      var partial = true 
        , hidden  = null 
        , direction   = "vertical"
        , container   = oThis.sScrollParent
      ;

      if ( oThis.jDataLoader.visible(partial,hidden,direction,container) ) {
        logMe && console.log("---->> oThis.jDataLoader is Visible");
        oThis.fetchResults();
      } else {
        logMe && console.log("---->> oThis.jDataLoader is not Visible ...do");
      }
    }
    , bindScrollObserver: function () {
      var oThis = this;

      var jScrollParent = oThis.getJScrollParent();

      //Trigger once.
      oThis.scrollObserver();

      //Now bind it.
      jScrollParent.on("scroll", oThis.scrollObserver );

    }
    , unbindScrollObserver: function () {
      var oThis = this;

      var jScrollParent = oThis.getJScrollParent();

      jScrollParent.off("scroll", oThis.scrollObserver );
    }

    , getJScrollParent: function () {
      var oThis = this;

      if ( oThis.sScrollParent ) {
        return $( oThis.sScrollParent );
      } else {
        return $( window );
      }
    }

    , getResults: function () {
      var oThis = this;

      return oThis.results;
    }

    ,isResultPresent : function ( newResult ) {
      var oThis = this
        , resultId = newResult['id']
      ;
      return oThis.getResultById( resultId );
    }

    , getResultById: function ( resultId, idKey ) {
      var oThis = this;

      idKey = idKey || "id";
      var foundResult = null;
      $.each( oThis.results, function ( index, result ) {
        if ( result[ idKey ] == resultId ) {
          foundResult = result;
         return false;
        }
      });
      return foundResult;
    }
    , dataDeletedResult: {
      id: "__deleted"
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