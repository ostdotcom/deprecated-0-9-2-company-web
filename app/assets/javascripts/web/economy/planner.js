;
(function (window, $) {

  var ost  = ns("ost");  
  var planner = ns("ost.planner");

  var oThis   = ost.planner.step1 = {
    has_verified_email    : false
    , grant_initial_ost   : false

    , idBtToFiat    : null
    , idOstToFiat   : null
    , idMaxMintBt   : null
    , idOstToBtText : null

    , jBtToFiat     : null
    , jOstToFiat    : null
    , jMaxMintBt    : null
    , jOstToBtText  : null

    , init: function ( config ) {
      var oThis = this;

      $.extend(oThis, config);

      oThis.jBtToFiat     = oThis.jBtToFiat     || $("#" + oThis.idBtToFiat );
      oThis.jOstToFiat    = oThis.jOstToFiat    || $("#" + oThis.idOstToFiat );
      oThis.jMaxMintBt    = oThis.jMaxMintBt    || $("#" + oThis.idMaxMintBt );
      oThis.jOstToBtText  = oThis.jOstToBtText  || $("#" + oThis.idOstToBtText );

      console.log("jOstToBtText", oThis.jOstToBtText);

      oThis.bindEvents();
      oThis.updateConvertionRatioText();
    },

    formHelper: null,

    bindEvents: function () {
      var oThis = this;



      //Bind all events here.
      oThis.formHelper = $("#step1-form").formHelper();
      oThis.formHelper.success = function () {
        oThis.onFormSucces.apply( oThis, arguments);
      };

      $("#plannerStep1Btn").on('click', function () {
        oThis.formHelper.jForm.submit();
      });


      $( PriceOracle ).on( PriceOracle.events["ostToBtUpdated"], function () {
        oThis.onOstToBtUpdated.apply( oThis, arguments);
      })
    },

    onOstToBtUpdated: function (event, orgEvent, bnOstToBt, OST_TO_BT) {
      var oThis = this;

      oThis.updateConvertionRatioText();
    },

    updateConvertionRatioText: function () {
      var oThis = this;

      var btToOst         = PriceOracle.btToOst(1)
        , ostToBt         = PriceOracle.ostToBt(1)
        , btVal
        , ostVal
        , finalText
      ;

      if ( btToOst.isGreaterThan( 1 ) ) {
        btVal = 1;
        ostVal = btToOst;
      } else {
        btVal  = ostToBt;
        ostVal = 1;
      }

      finalText = PriceOracle.toDisplayBt( btVal ) + " = " + PriceOracle.toOst( ostVal ) + " OST";

      console.log("finalText", finalText);
      oThis.jOstToBtText.html( finalText );
    },


    onFormSucces: function ( response ) {
      var oThis = this;

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
    },

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