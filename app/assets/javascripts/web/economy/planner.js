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




      PriceOracle.observeBtToFiat( $("#token_worth_in_usd") );
      $( PriceOracle ).on( PriceOracle.events.btToFiatUpdated, function (event, orgEvent, bigRatio, stringRatio ) {

        var jEl = $("#token_worth_in_usd");

        //Make Sure to forward orgEvent;
        var didUpdate = jEl.safeSetVal( stringRatio, orgEvent );
        didUpdate && console.log("updating token_worth_in_usd to", stringRatio);

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