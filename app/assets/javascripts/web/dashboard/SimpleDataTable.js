;
(function (window, $) {
  var ost  = ns("ost");

  var SimpleDataTable = ost.SimpleDataTable = function ( config ) {
    var oThis = this;


    $.extend( oThis, config );

    oThis.jParent           = oThis.jParent || $('[data-simple-table]');
    oThis.jRowTemplateHtml  = oThis.jRowTemplateHtml || oThis.jParent.find( '[data-row-template]' );
    oThis.rowTemplate       = oThis.rowTemplate ||  Handlebars.compile( oThis.jRowTemplateHtml.html() );
    oThis.fetchResultsUrl   = oThis.fetchResultsUrl || oThis.jParent.data("url") || null

    console.log("oThis", oThis);

    oThis.jDataLoader       = oThis.jDataLoader || oThis.createLoadingWrap( oThis.jParent );

    oThis.fetchResults( true );

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
    
    , getRowTemplate: function () {
      var oThis = this;

      return oThis.rowTemplate;
    }

    , results: []
    , lastMeta: null
    , hasNextPage: true
    , isLoadingData: true
    , fetchResults: function ( isFirstLoad ) {
      var oThis = this;
      if ( !isFirstLoad && oThis.isLoadingData ) {
        return;
      }

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

        console.log("hideLoading called after processResponse");
        //Hide Loading
        oThis.hideLoading();
      });
    }
    , fetchResultsUrl : null
    , resultFetcher: function ( currentData, lastMeta, callback ) {
      var oThis = this;

      console.log("oThis.fetchResultsUrl", oThis.fetchResultsUrl);

      var data = {};

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

    ,deleteDataIndex : function ( index ) {

     }

    , updateResult: function ( result ) {
      var oThis = this;

      var resultIndex = -1;
      $.each( oThis.results, function (index, thisResult) {
        if ( thisResult === result ) {
          resultIndex = index;
          return false;
        }
      });

      if ( resultIndex < 0 ) {
        console.log("updateResult", "did not find resultIndex");
        return false;
      }

      var jOldResult = oThis.jParent.find("[data-result-index='" + resultIndex + "']");
      if ( !jOldResult.length ) {
        console.log("updateResult", "did not find jOldResult");
        return false;
      }

      var jResult = oThis.createResultMarkup( result );
      jResult.attr("data-result-index", resultIndex);
      jOldResult.replaceWith( jResult );

    }

    , createResultMarkup : function ( result ) {
      var oThis = this;

      var rowTemplate   = oThis.getRowTemplate()
        , rowMarkUp     = rowTemplate( result )
        , jResult       = $( rowMarkUp )
      ;

      return jResult;
    }

    , processResponse: function ( response ) {
      var oThis = this;

      console.log("Datatable :: processResponse called!");
      console.log("response", response);

      if ( response.success ) {

        var data            = response.data
          , newMeta         = data.meta || {}
          , result_type     = data.result_type
          , newResults      = data[ result_type ] || []
          , nextPagePayload = newMeta.next_page_payload || {}
        ;

        if ( newResults.length ) {
          for(var cnt = 0; cnt < newResults.length; cnt++ ) {
            oThis.appendResult( newResults[ cnt ] );
          }
        }

        //Deal with meta
        oThis.hasNextPage = false;
        if ( Object.keys( nextPagePayload ).length ) {
          console.log("nextPagePayload", nextPagePayload);
          //We have next page.
          oThis.hasNextPage = true;
        }

        oThis.lastMeta = newMeta;
        oThis.isLoadingData = false;
      } else {
        oThis.showDataLoadError( response );
      }
      console.log("Datatable :: processResponse done!");
    }
    , createLoadingWrap: function ( jParent ) {
      var jWrap = $('<div data-simple-table-end></div>');
      //Do you magic here.
      var jContent = $(''
        + '<div class="container simple-data-table-loader" style="display: none;">'
          + '<div class="text-center">'
            + '<img src="/ajax-loader.gif" />'
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
      oThis.unbindScrollObserver();
      console.log("showLoading");
    }

    , hideLoading: function () {
      var oThis = this;
      oThis.jDataLoader.find(":first-child").hide();
      oThis.bindScrollObserver();
      console.log("hideLoading");
    }

    , showDataLoadError: function ( response ) {

    }
    , scrollObserver : function () {
      var oThis = this;

      var checkForPartialVisibility = true;
      if ( oThis.jDataLoader.visible( checkForPartialVisibility ) ) {
        oThis.fetchResults();
      }
    }
    , bindScrollObserver: function () {
      var oThis = this;
      
      //Trigger once.
      oThis.scrollObserver();
      //Now bind it.
      $(window).on("scroll", oThis.scrollObserver );

    }
    , unbindScrollObserver: function () {
      var oThis = this;

      $(window).off("scroll", oThis.scrollObserver );
    }

    , getResults: function () {
      var oThis = this;

      return oThis.results;
    }
    , getResultWithId: function ( resultId, idKey ) {
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

  }

})(window, jQuery);