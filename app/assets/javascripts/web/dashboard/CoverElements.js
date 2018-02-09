;
(function (window, $) {

  var parentNS  = ns("ost");  

  var oThis = parentNS.coverElements = {
    jContent: null,
    jRoot: null,
    init: function () {
      var oThis = this;
      oThis.jContent = $("#content");
      oThis.jRoot = $("#cover-container");
    },
    show: function ( selector, withoutAnimation ) {
      var oThis = this;


      var activeElements = oThis.jRoot.find(".active-cover")
        , jEl = $( selector )
      ;

      //Compute z-index.
      var newZIndex = Number ( jEl.css("zIndex") || 0 );
      activeElements.each(function (i, el) {
        if ( jEl.is( el ) ) {
          return;
        }
        var thisElZindex = Number( el.style.zIndex );
        if ( thisElZindex >= newZIndex ) {
          newZIndex = thisElZindex + 1;
        }
      });



      //Compute new top
      var newTop = oThis.jContent.offset().top
          , bodyHeight = $("body").height()
          , newTopInPercent = Math.floor( (100 * newTop)/ bodyHeight )
      ;

      var finalCss = {
        display: "block",
        zIndex: newZIndex,
        top: newTop
      };


      var onAnimationComplete = function () {
        jEl.addClass("active-cover").css( finalCss );
      };

      if ( withoutAnimation ) {
        onAnimationComplete();
        return;
      }

      jEl.css({
        display: "block",
        zIndex: newZIndex
      }).animate({
        top: newTop
      }, {
        complete: onAnimationComplete
      });
    },
    hide: function ( selector, withoutAnimation ) {
      var oThis = this;

      var jEl = $( selector )
        , finalCss = {
          top: "100%",
          zIndex: 0
        }
      ;
      var onAnimationComplete = function () {
        jEl.removeClass("active-cover").css( finalCss );
      }
      if ( withoutAnimation ) {
        onAnimationComplete();
        return;
      }
      jEl.animate(finalCss, {
        complete: onAnimationComplete
      });
    },
    getContentTop: function () {
      var oThis = this;
      return oThis.jContent.offset().top;
    }
  };

  parentNS.coverElements.init();

})(window, jQuery);