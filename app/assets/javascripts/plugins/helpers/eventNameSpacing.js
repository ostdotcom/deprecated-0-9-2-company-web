;
(function (window, $) {

  var ost  = ns("ost");

  var EventNameSpacing = ost.EventNameSpacing = function ( namespace ) {
    var oThis =  this;
    oThis.namespace = namespace;
  };

  EventNameSpacing.prototype = {
    constructor : EventNameSpacing,
    namespace : "",

    nameSpacedEvents : function ( events ) {
      if(!events) return;
      var oThis =  this,
          events = events.split(" "),
          event = "" , nameSpacedEvents = " "
      ;
      for(var i = 0 ; i < events.length ; i++){
        event = events[i];
        nameSpacedEvents =  nameSpacedEvents + event + "." + oThis.namespace + " " ;
      }
      return nameSpacedEvents;
    }

  };

})(window, jQuery);