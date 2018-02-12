;
(function (window, $) {

  var ost  = ns("ost");  
  

  var oThis   = ost.planner = {
    config: null,
    init: function ( config ) {
      oThis.config = config;
      oThis.bindEvents();
    },
    bindEvents: function () {
      //Bind all events here.
      oThis.bindGetInitialOstEvents();
      

    },
    bindGetInitialOstEvents: function () {
      if ( !$("#getInitialOstCover").length ) {
        //If possible, do not render the get initial ost cover element on the page.
        return;
      }

      //Dummy btn event.
      $("#getInitialOstBtn").on("click", function () {
        oThis.getInitialOst();
      });

      //Needed.
      var metamask = ost.metamask;
      $( metamask ).on(metamask.events.onAddressChanged, function ( event, eventData, newAddress ) {
        console.log("I have received the event");
        $("#ost__planner__address").text( newAddress );
        $("#eth_address").val( newAddress );
      });

    },
    getInitialOst: function () {
      var oThis = this;
      console.log("planner :: getInitialOst");
      ost.coverElements.show("#getInitialOstCover");
      ost.metamask.startObserver();
    },
    onGetOstSuccess: function () {
      var metamask = ost.metamask;
      metamask.stopObserver();
    },
    onGetOstFailed: function () {
      alert("onGetOstComplete triggered!");
    }


  };

})(window, jQuery);