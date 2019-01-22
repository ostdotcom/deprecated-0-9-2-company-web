;
(function (window, $) {

    var ost  = ns("ost");
    var planner = ns("ost.planner");

    var oThis   = ost.planner.step1 = {

        jTokenForm:                       $('#economy-planner'),
        jConfirmAccountCover:             $('#metamaskConfirmAccount'),
        genericErrorMessage:              'Something went wrong!',
        personalSignCancelErrorMessage:   'Could not proceed as you denied message signature in MetaMask.',
        metamask:                         null,

        init: function( config ){
            $.extend(oThis, config);
            oThis.bindActions();
            oThis.jTokenForm.formHelper().success = oThis.tokenSuccess;
        },

        bindActions : function(){
          $("#advance-options-accordion").on('show.bs.collapse',function () {
              $(".slider-recommendation").hide();
              $(".header-recommendation").show();
          })
        },
        setupMetamask: function(){

            oThis.metamask = new Metamask({
                desiredNetwork: '3',

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
                    ost.coverElements.show("#metamaskDisabledCover");
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
           }
        },

        initConfirmFlow: function(){

            oThis.jConfirmAccountCover.find(".confirm-address").text(oThis.metamask.ethereum.selectedAddress);

            $.ajax({
                url: oThis.signMessagesEndPoint,
                success: function(response){
                    if(response.success){
                        oThis.personalSign(response.data.wallet_association);
                    } else {
                        oThis.showError();
                    }
                },
                error: function(response){
                  oThis.showError();
                }

            });
        },

        personalSign: function(message){

            if(!message) return;
            oThis.jConfirmAccountCover.find(".error-state-wrapper").hide();
            oThis.jConfirmAccountCover.find('.default-state-wrapper').show();
            var from = oThis.metamask.ethereum.selectedAddress;

            oThis.jConfirmAccountCover.find(".btn-confirm").off('click').on('click', function(e){
                oThis.metamask.sendAsync({
                    method: 'personal_sign',
                    params: [message, from],
                    from: from
                }, function(err, result){
                    if(err){
                      return oThis.showError(err);
                    }
                    if(result && result.error){
                      return oThis.showError(oThis.personalSignCancelErrorMessage);
                    } else {
                      oThis.associateAddress(result);
                    }
                });
            });

        },

        associateAddress: function(result){

          $('.btn-confirm').text("confirming...").prop("disabled",true);

            if(!result) return;
            oThis.jConfirmAccountCover.find(".error-state-wrapper").hide();
            oThis.jConfirmAccountCover.find('.default-state-wrapper').show();
            var from = oThis.metamask.ethereum.selectedAddress;

            $.ajax({
                url: oThis.addressesEndPoint,
                method: 'POST',
                data: {
                    owner: from,
                    personal_sign: result.result
                },
                success: function(response){
                    if(response.success){
                        console.log(response);
                        oThis.jConfirmAccountCover.find(".btn-confirm").text("confirm Address").prop('disabled', false);
                        window.location = "/testnet/token/deploy";
                        // sign transaction logic
                    } else {
                        if(response.err && response.err.error_data && response.err.error_data.length > 0){
                          oThis.showError(response.err.error_data[0].msg);
                        }
                        else {
                          oThis.showError(response.err.display_text);
                        }
                    }
                },
                error: function (response) {
                    oThis.showError()
                }
            });
        },

        showError: function(message){
            if(typeof message === 'undefined') {
              message = oThis.genericErrorMessage;
            }
          oThis.jConfirmAccountCover.find(".btn-confirm").text("confirm Address").prop('disabled', false);
            oThis.jConfirmAccountCover.find('.default-state-wrapper').hide();
            oThis.jConfirmAccountCover.find(".error-state-wrapper").show();
          $(".error-state-wrapper").find(".display-header").text(message);
        }
    };

})(window, jQuery);