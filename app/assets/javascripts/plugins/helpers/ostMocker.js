;
(function (window, $) {

  if ( !window.console ) {
    window.console = {
      log: function () {}
      ,error: function () {}
    }
  }

  var jqDataNameSpace     = "ostMocker";
  var eventNameSpace      = "";
  var delegateAttr        = "data-ost-mock-delegate-element";
  var autoBinderAttr      = "data-ost-mock-element";

  var Mocker = function ( jElement, targetSelector, filter ) {
    var oThis = this;

    oThis.jElement = jElement;
    oThis.targetSelector = targetSelector;
    oThis.filter = filter;

    oThis.onChange = function () {
      oThis.update();
    };

  }

  Mocker.prototype = {
    constructor       : Mocker
    , jElement        : null
    , targetSelector  : null
    , filter          : null
    , onChange        : null
    , update : function () {
      var oThis = this;

      if ( !oThis.targetSelector || !oThis.jElement ) {
        return;
      }

      var jTarget = $( oThis.targetSelector );
      oThis.jElement.html( jTarget.val() );

    }
    , start : function () {
      var oThis = this;

      if ( !oThis.targetSelector ) {
        return;
      }

      var jTarget = $( oThis.targetSelector )
        , args    = oThis.getOnOffArgs()
      ;

      jTarget.on.apply(jTarget,  args);
    }
    , stop : function () {
      var oThis = this;

      if ( !oThis.targetSelector ) {
        return;
      }

      var jTarget = $( oThis.targetSelector )
        , args    = oThis.getOnOffArgs()
      ;

      jTarget.off.apply(jTarget,  args);

    }
    , getOnOffArgs : function () {
      var oThis = this;


      var args = ["change input"];
      if ( oThis.filter ) {
        args.push( oThis.filter );
      }

      args.push( oThis.onChange );

      return args;
    }
  }


  //jQuerry related stuff
  $.fn.extend({
    ostMocker: function ( config ) {
      var jElement          = $( this )
          , data            = jElement.data()
          , mocker          = data[ jqDataNameSpace ]
          , targetSelector  = data.ostMockDelegateElement
          , filter          = data.ostMockElement
      ;


      if ( !targetSelector ) {
        targetSelector = filter;
        filter = null;
      }

      if ( !mocker || !mocker instanceof Mocker ) {

        mocker = new Mocker( jElement, targetSelector, filter );
        mocker.start();
        jElement.data( jqDataNameSpace, mocker );
        mocker.update();
      }
      if ( config && typeof config === "object") {
        $.extend(mocker, config );
      } 
      return mocker;
    }
  });
  $( function () {
    var jElements = $("[" + autoBinderAttr + "]");
    jElements.each(function ( indx, jElement ) {
      var mocker = $( jElement ).ostMocker();
    });
  });


})(window, jQuery);