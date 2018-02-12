;
(function (window, $) {
  var ost  = ns("ost");

  var SimpleDataTable = ost.SimpleDataTable = function ( config ) {
    var oThis = this;


    $.extend( oThis, config );

    oThis.jParent           = oThis.jParent || $('[data-simple-table]');
    oThis.jRowTemplateHtml  = oThis.jRowTemplateHtml || oThis.jParent.find( '[data-row-template]' );
    oThis.rowTemplate       = oThis.rowTemplate ||  Handlebars.compile( oThis.jRowTemplateHtml.html() );

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
        //Hide Loading
        oThis.hideLoading();
      });
    }
    , fetchResultsUrl : null
    , resultFetcher: function ( currentData, lastMeta, callback ) {
      var oThis = this;

      $.get({
        url: oThis.fetchResultsUrl
        , success: function ( reponse ) {
          if ( reponse.success ) {
            oThis.processResponse( reponse );  
          } else {
            //To-Do: Show Some Error.
            oThis.showDataLoadError( reponse );
          }
        }
      });
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
          , rowTemplate     = oThis.rowTemplate
        ;

        if ( newResults.length ) {
          Array.prototype.push.apply(oThis.results, newResults);
          for(var cnt = 0; cnt < newResults.length; cnt++ ) {
            oThis.jParent.append( rowTemplate( newResults[ cnt ] ) );
          }
        }

        //Deal with meta
        oThis.hasNextPage = false;
        if ( Object.keys( nextPagePayload ).length ) {
          //We have next page.
          oThis.hasNextPage = true;
        }

        oThis.meta = newMeta;
        oThis.isLoadingData = false;
      } else {
        oThis.showDataLoadError( response );
      }
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
    }

    , hideLoading: function () {
      var oThis = this;
      oThis.jDataLoader.find(":first-child").hide();
      oThis.bindScrollObserver();
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

  }

})(window, jQuery);