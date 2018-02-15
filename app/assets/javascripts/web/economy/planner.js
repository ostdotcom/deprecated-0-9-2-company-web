;
(function (window, $) {

  var ost  = ns("ost");  
  

  var oThis   = ost.planner = {
    hasGrantedEth: false,
    init: function ( config ) {
      var oThis = this;

      $.extend(oThis, config);
      oThis.bindEvents();
      $("#bt_rate").safeSetVal( PriceOracle.ostToBt( 1 ).toString( 10 ) );
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

      $("#plannerStep1Btn").on('click', function () {
        oThis.formHelper.jForm.submit();
      });




      PriceOracle.observeBtToFiat( $("#conversion_rate") );
      $( PriceOracle ).on( PriceOracle.events.btToFiatUpdated, function (event, orgEvent, bigRatio, stringRatio ) {

        var jEl = $("#conversion_rate");

        //Make Sure to forward orgEvent;
        var didUpdate = jEl.safeSetVal( stringRatio, orgEvent );
        didUpdate && console.log("updating conversion_rate to", stringRatio);

      });

      
      PriceOracle.observeOstToBt( $("#bt_rate") );
      $( PriceOracle ).on( PriceOracle.events.ostToBtUpdated, function (event, orgEvent, bigRatio, stringRatio ) {

        var jEl = $("#bt_rate");

        //Make Sure to forward orgEvent;
        var didUpdate = jEl.safeSetVal( stringRatio, orgEvent );
        didUpdate && console.log("updating bt_rate to " , stringRatio);

      });



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

    has_verified_email: true, /* Over-Ride using config. */
    showValidateEmailLightBox: function () {
      $('#verify-modal').modal();
    }
  };

})(window, jQuery);