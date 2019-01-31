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

      $('body').addClass('has-cover-element');

      var activeElements = oThis.jRoot.find(".active-cover")
        , jEl = $( selector )
      ;

      //Compute z-index.
      var minZIndex  = 1
        , newZIndex  = Number ( jEl.css("zIndex") )
      ;
      if ( isNaN( newZIndex ) ) {
        newZIndex = 0;
      }
      newZIndex = newZIndex || minZIndex;

      activeElements.each(function (i, el) {
        if ( jEl.is( el ) ) {
          jEl.addClass('activating-cover');
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
        top: newTop,
        scrollTop: 0,
        height: "calc(100vh - " + newTop + "px)"
      };


      var onAnimationComplete = function () {
        jEl.removeClass('activating-cover');
        jEl.addClass("active-cover").css( finalCss );
        $('body').addClass('has-cover-element');
      };

      if ( withoutAnimation ) {
        onAnimationComplete();
        return;
      }

      jEl.css({
        display: "block",
        zIndex: newZIndex
      }).animate({
        top: newTop,
        scrollTop: 0
      }, {
        complete: onAnimationComplete
      });
    },
    hide: function ( selector, withoutAnimation ) {

      
      var oThis = this;

      var jEl = $( selector )
        , finalCss = {
          top: "100%",
          zIndex: 0,
          display: "none"
        }
      ;

      if ( !jEl.hasClass("active-cover") ) {
        return;
      }

      var onAnimationComplete = function () {
        jEl.removeClass("active-cover").css( finalCss );
        var activeElements = oThis.jRoot.find(".active-cover");
        if ( !activeElements.length ) {
          console.log("onAnimationComplete :: activeElements", activeElements);
          //No Active Elements.
          $('body').removeClass('has-cover-element');
        }
      }
      if ( withoutAnimation ) {
        onAnimationComplete();
        return;
      }
      jEl.animate(finalCss, {
        complete: onAnimationComplete
      });
    },
    hideAll: function() {
      var oThis = this;
      var activeCEs = $(".active-cover , .activating-cover");

      if(activeCEs.length < 1){
        return;
      }

      activeCEs.each(function(index){
        oThis.hide($(this));
      });
    },
    getContentTop: function () {
      var oThis = this;
      return oThis.jContent.offset().top;
    }
  };

  parentNS.coverElements.init();

})(window, jQuery);