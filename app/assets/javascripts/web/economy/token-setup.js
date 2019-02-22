;
(function (window, $) {

    var ost         = ns("ost"),
        formHelper  = window.FormHelper.prototype,
        redirectMap = window.redirectMap ,
        utilities   = ns('ost.utilities')
    ;

    var oThis = ost.tokenSetup = {

        jTokenForm                  :  $('#economy-planner'),
        jConfirmAccountCover        :  $('#metamaskConfirmAccount'),
        genericErrorMessage         :  'Something went wrong!',
        metamask                    :  null,
        walletAssociation           :  null ,

        jDefaultStateWrapper         :  $('#default-state-wrapper'),
        jGeneralErrorState           :  $('#general-error-state'),
        jRejectedSignErrorState      :  $('#rejected-sign-error-state'),
        jAssociateAddressErrorState  :  $('#associate-address-error-state'),
        jConfirmAccountSection       :  $('.confirm-account-section'),
        jDeploymentErrorState        :  $('#deployment-error-state'),
        jTokenSetupAdminErrorModal  :  $('#token_setup_admin_error'),

        init: function( config ){
            $.extend(oThis, config);
            oThis.bindActions();
            oThis.jTokenForm.formHelper().success = oThis.tokenSuccess;
            PriceOracle.init({
              'ost_to_fiat' : config['ost_to_fiat'],
              'ost_to_bt' : config['ost_to_bt'],
              'P_FIAT': 5
            });
            oThis.initDisplayFiatValue() ;
            oThis.inputSpinner();
        },

        bindActions : function(){

          $("#advance-options-accordion").on('show.bs.collapse',function () {
              $(".slider-recommendation").hide();
              $(".header-recommendation").show();
          })

          $('#mm-reconnect').off('click').on('click', function(){
              oThis.metamask.enable();
          });
        },
  
        btToFiat  : function ( conversionFactor ) {
          if( !conversionFactor || !BigNumber) return conversionFactor;
          conversionFactor = BigNumber( conversionFactor );
          var fiatBN = BigNumber( oThis.ost_to_fiat ) ,
            oneBTToFiat = fiatBN.dividedBy(  conversionFactor )
          ;
          return PriceOracle.toFiat( oneBTToFiat );
        },
  
        initDisplayFiatValue : function () {
          var jEL = $('.j-bt-to-fiat-val'),
              jInputEl = $('#'+oThis.ostToBtId),
              val = jInputEl.val() ,
              fiatVal = PriceOracle.btToFiatPrecession( 1 )
          ;
          jEL.data("ost-mock-element" , "#"+ oThis.ostToBtId );
          jEL.ostMocker();
          jEL.text( fiatVal );
          $('.j-fiat-value').text( fiatVal );
        },

        setupMetamask: function(){

            oThis.metamask = new Metamask({
                desiredNetwork: oThis.chainId,

                onNotDapp: function(){
                    ost.coverElements.show("#installMetamaskCover");
                },

                onNotMetamask: function(){
                    ost.coverElements.show("#installMetamaskCover");
                },

                onWaitingEnable: function(){
                    ost.coverElements.show("#metamaskLockedCover");
                },

                onUserRejectedProviderAccess: function(){
                    ost.coverElements.show("#metamaskConnectRequestRejected");
                },

                onNotDesiredNetwork: function(){
                    ost.coverElements.show("#metamaskWrongNetworkCover");
                },

                onNotDesiredAccount: function(){
                    ost.coverElements.show("#metamaskWrongAccountCover");
                },

                onDesiredAccount: function(){
                    ost.coverElements.show("#metamaskSignTransaction");
                },

                onNewAccount: function(){
                  
                    oThis.initConfirmFlow();
                    ost.coverElements.show("#metamaskConfirmAccount");
                }

            });

        },

        tokenSuccess: function( res ){
           if( res.success ){
             oThis.setupMetamask();
             oThis.metamask.enable();
           } else {
             var errorMsg = utilities.deepGet(res, "err.display_text") ;
             if(errorMsg === ''){
               oThis.jTokenSetupAdminErrorModal.modal('show');
             }
           }
        },

        initConfirmFlow: function(){
            oThis.jConfirmAccountCover.find(".confirm-address").text(oThis.metamask.getWalletAddress());
            oThis.personalSign( oThis.walletAssociation );
        },

        personalSign: function( message ){
            if(!message) return;

            oThis.jConfirmAccountSection.hide();
            oThis.jDefaultStateWrapper.show();

            var from = oThis.metamask.getWalletAddress();

            oThis.jConfirmAccountCover.find(".btn-confirm").off('click').on('click', function(e){
              $('.btn-confirm').text("confirming...").prop("disabled",true);
                oThis.metamask.sendAsync({
                    method: 'personal_sign',
                    params: [message, from],
                    from: from
                }, function(err, result){
                    if(err){
                      return oThis.showConfirmError(oThis.jGeneralErrorState);
                    }
                    if(result && result.error){
                      return oThis.showConfirmError(oThis.jRejectedSignErrorState);
                    } else {
                      oThis.associateAddress(result);
                    }
                });
            });

        },

        associateAddress: function(result){

          $('.btn-confirm').text("confirming...").prop("disabled",true);

            if(!result) return;
            oThis.jConfirmAccountSection.hide();
            oThis.jDefaultStateWrapper.show();
            var from = oThis.metamask.getWalletAddress();

            $.ajax({
                url: oThis.addressesEndPoint,
                method: 'POST',
                data: {
                    owner: from,
                    personal_sign: result.result
                },
                success: function(response){
                    if(response.success){
                        oThis.startTokenDeployment();
                    } else {
                      var errorData = utilities.deepGet( response ,  "err.error_data") || [];
                        var errorMsg ;
                      if(errorData.length > 0 ){
                          errorMsg =  errorData[0].msg ;
                          oThis.showConfirmError(oThis.jAssociateAddressErrorState);
                        } else {
                          errorMsg = utilities.deepGet( response ,  "err.display_text") ;
                          oThis.showConfirmError(oThis.jGeneralErrorState);
                        }
                    }
                },
                error: function (response) {
                  oThis.showConfirmError(oThis.jGeneralErrorState);
                }
            });
        },
        startTokenDeployment : function(){
          $.ajax({
            url : oThis.deploymentEndpoint,
            method : 'POST',
            success: function (response) {
              oThis.jConfirmAccountCover.find(".btn-confirm").text("confirm Address").prop('disabled', false);
              if(response && response.success){
                var byScreenName = utilities.deepGet( response ,  "go_to.by_screen_name" );
                if(byScreenName){
                  window.location = redirectMap && redirectMap[byScreenName]
                }
                else{
                  window.location = oThis.deployRoute;
                }

              }
              else {

                var errorData = utilities.deepGet(response , "err.error_data");
                if(errorData.length > 0){
                  oThis.showConfirmError(oThis.jDeploymentErrorState)
                }
                else{
                  var errorMsg = utilities.deepGet(response, "err.display_text") ;
                  if(errorMsg === ''){
                    oThis.jTokenSetupAdminErrorModal.modal('show');
                  } else {
                    oThis.showConfirmError(oThis.jGeneralErrorState);
                  }
                }

              }
            },
            error: function (response) {
              oThis.showConfirmError(oThis.jGeneralErrorState);
            }
          })
        },


        showConfirmError : function(errorContext){
          oThis.jConfirmAccountCover.find(".btn-confirm").text("confirm Address").prop('disabled', false);
          oThis.jConfirmAccountSection.hide();
          errorContext.show();
        },

        inputSpinner: function () {
          $('<div class="quantity-nav">' +
            '<span class="quantity-button quantity-up"><img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/spinner-up-arrow.svg" width="12" height="10" /></span>' +
            '<span class="quantity-button quantity-down"><img src="https://dxwfxs8b4lg24.cloudfront.net/ost-kit/images/spinner-down-arrow.svg" width="12" height="10" /></span>' +
            '</div>').insertAfter('.quantity input');
          $('.quantity').each(function() {
            var spinner = $(this),
              input = spinner.find('input[type="number"]'),
              btnUp = spinner.find('.quantity-up'),
              btnDown = spinner.find('.quantity-down'),
              min = input.attr('min'),
              max = input.attr('max'),
              step = 0.00001;

            btnUp.click(function() {
              var oldValue = parseFloat(input.val());
              if (oldValue >= max) {
                var newVal = oldValue;
              } else {
                var newVal = (oldValue + step).toFixed(5);
              }
              spinner.find("input").val(newVal);
              spinner.find("input").trigger("change");
            });

            btnDown.click(function() {
              var oldValue = parseFloat(input.val());
              if (oldValue <= min) {
                var newVal = oldValue;
              } else {
                var newVal = (oldValue - step).toFixed(5);
              }
              spinner.find("input").val(newVal);
              spinner.find("input").trigger("change");
            });

          });
        }

    };
    

})(window, jQuery);