;
(function (window, $) {

  var ost  = ns("ost");  
  

  var oThis   = ost.planner = {
    hasGrantedEth: false,
    init: function ( config ) {
      var oThis = this;

      $.extend(oThis, config);
      oThis.bindEvents();
    },

    formHelper: null,

    bindEvents: function () {
      var oThis = this;

      //Bind all events here.
      oThis.formHelper = $("#step1").formHelper();
      oThis.formHelper.success = function () {
        //Verify Email First.
        if ( !oThis.has_varified_email ) {
          oThis.showValidateEmailLightBox();
        } else if ( oThis.grant_initial_ost ) {
          //Get Ost Next.
          oThis.getInitialOst();
        }
      };

    },

    grant_initial_ost: true, /* Over-Ride using config. */
    getInitialOst: function () {
      var oThis = this;
      ost.metamask.getOstHelper.getOst( function () {
        console.log("getInitialOst flow complete");
        
        window.location = "/transactions";
      });
    },

    getOstCallback: function () {
      var oThis = this;
      console.log("Planner :: getOstCallback triggered.\n", arguments);

    },

    has_varified_email: true, /* Over-Ride using config. */
    showValidateEmailLightBox: function () {

    }


  };

})(window, jQuery);