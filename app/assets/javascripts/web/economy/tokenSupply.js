;
(function (window, $) {

  var ost     = ns("ost");
  var oThis, tokenSupply;

  oThis = tokenSupply = ost.tokenSupply = {
    idMintWidgetOverlay: "token_supply_widget_overlay"
    , idMintWidgetWrap: "token_supply_widget_wrap"
    , idShowWidgetBtn: "show_token_supply_widget_btn"

    , jMintWidgetOverlay : null
    , jMintWidgetWrap: null
    , jShowWidgetBtn: null

    , init: function ( config ) {
      var oThis = this;

      $.extend(oThis, config);

      oThis.jMintWidgetOverlay = oThis.jMintWidgetOverlay || $("#" + oThis.idMintWidgetOverlay );
      oThis.jMintWidgetWrap = oThis.jMintWidgetWrap || $("#" + oThis.idMintWidgetWrap );
      oThis.jShowWidgetBtn = oThis.jShowWidgetBtn || $("#" + oThis.idShowWidgetBtn);


      oThis.jMintWidgetWrap.hide();
      oThis.bindEvents();
    }

    , bindEvents: function () {
      var oThis = this;

      oThis.jShowWidgetBtn.off("click.tokenSupply").on("click.tokenSupply", function () {
        oThis.showMintWidget.apply(oThis, arguments);
      });

      ost.mintBtWidget.jBtToMint.on("change" , function () {
        oThis.updateMintTokensBtn();
      });

      ost.mintBtWidget.jStPrimeToMint.on("change" , function () {
        oThis.updateMintTokensBtn();
      });

    }

    ,updateMintTokensBtn : function () {
      var btToMint    = ost.mintBtWidget.jBtToMint.val() || 0 ,
        stPrimeToMint = ost.mintBtWidget.jStPrimeToMint.val() || 0,
        totalMint     = BigNumber(btToMint).plus( stPrimeToMint ),
        jMintTokenBtn =  $('#mint-token-btn')
      ;
      if( totalMint.isZero() ){
        jMintTokenBtn.prop('disabled', true);
      }else {
        jMintTokenBtn.prop('disabled', false);
      }
    }

    , showMintWidget: function () {
      var oThis = this;

      oThis.jMintWidgetOverlay.fadeOut({
        complete: function () {
          oThis.jMintWidgetWrap.fadeIn({
            complete: function () {
              ost.mintBtWidget.jBtToMint.trigger("change");
            }
          });
        }
      });
    }

  };
})(window, jQuery);