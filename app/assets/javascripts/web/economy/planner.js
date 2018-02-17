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
        if ( !oThis.has_verified_email ) {
          console.log("oThis.has_varified_email", oThis.has_verified_email);
          oThis.showValidateEmailLightBox();
        } else if ( oThis.grant_initial_ost ) {
          //Get Ost Next.
          oThis.getInitialOst();
        } else {
          oThis.plannerSetUpDone();
        }
      };

      $("#plannerStep1Btn").on('click', function () {
        oThis.formHelper.jForm.submit();
      });
    },

    grant_initial_ost: true, /* Over-Ride using config. */
    getInitialOst: function () {
      var oThis = this;
      ost.metamask.getOstHelper.getOst( function () {
        console.log("getInitialOst flow complete");
        oThis.plannerSetUpDone.apply(oThis, arguments);
      });
    },

    plannerSetUpDone: function () {
      var oThis = this;
      console.log("Planner :: getOstCallback triggered.\n", arguments);
      window.location = "/planner/step-2";
    },

    showValidateEmailLightBox: function () {
      $('#verify-modal').modal();
    }
  };

})(window, jQuery);