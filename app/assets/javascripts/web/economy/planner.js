;
(function (window, $) {

  var ost  = ns("ost");  
  

  var oThis   = ost.planner = {
    hasGrantedEth: false,
    init: function ( config ) {
      var oThis = this;

      $.extend(oThis, config);
      oThis.bindEvents();
      oThis.calcConversion();
      $("#bt_rate").setVal( PriceOracle.ostToBt( 1 ).toString( 10 ) );
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

      $('#conversion_rate').on('change',function(){
        oThis.calcConversion();
      });

      PriceOracle.observeOstToBt( $("#bt_rate") );
      
      $( PriceOracle ).on( PriceOracle.events.btToFiatUpdated, function (event, bigRatio, stringRatio ) {
        console.log("updating conversion_rate to", stringRatio);
        $("#conversion_rate").setVal( stringRatio );
        
      });

      PriceOracle.observeBtToFiat( $("#conversion_rate") );
      $( PriceOracle ).on( PriceOracle.events.ostToBtUpdated, function (event, bigRatio, stringRatio ) {
        console.log("updating bt_rate to " , stringRatio);
        $("#bt_rate").setVal( stringRatio );
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
    },

    calcConversion: function(){
      return;
      var $bt_rate = $('#bt_rate');
      var $conversion_rate = $('#conversion_rate');
      var $ost_rate = $('#ost_rate');
      $bt_rate.val(
        BigNumber(oThis.ost_to_fiat)
          .div(BigNumber($conversion_rate.val()))
          .toPrecision(oThis.bt_precision)
          .toString()
      );
    },


  };

})(window, jQuery);