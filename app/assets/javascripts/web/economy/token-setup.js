;
(function (window, $) {

    var ost         = ns("ost"),
        formHelper  = window.FormHelper.prototype,
        redirectMap = window.redirectMap ,
        utilities   = ns('ost.utilities')
    ;

    var oThis = ost.tokenSetup = {

        jTokenForm:                       $('#economy-planner'),
        jConfirmAccountCover:             $('#metamaskConfirmAccount'),
        genericErrorMessage:              'Something went wrong!',
        metamask:                         null,

        init: function( config ){
            $.extend(oThis, config);
            oThis.bindActions();
            oThis.jTokenForm.formHelper().success = oThis.tokenSuccess;
            PriceOracle.init({
              'ost_to_fiat' : config['ost_to_fiat']
            });
            oThis.initDisplayFiatValue() ;
            $()
        },

        bindActions : function(){
          $("#advance-options-accordion").on('show.bs.collapse',function () {
              $(".slider-recommendation").hide();
              $(".header-recommendation").show();
          })
        },
  
        ostToFiat  : function ( value ) {
          return PriceOracle.ostToFiat( value );
        },
  
        initDisplayFiatValue : function () {
          $('.j-fiat-value').text( "$" + PriceOracle.toPrecessionFiat( ) );
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
                       var walletAssociation = utilities.deepGet( response , "data.wallet_association" );
                       oThis.personalSign( walletAssociation );
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
                        oThis.startTokenDeployment();
                    } else {
                        var errorData = utilities.deepGet( response ,  "err.error_data") || [];
                        var errorMsg ;
                      if(errorData.length > 0 ){
                          errorMsg =  errorData[0].msg ;
                          oThis.showError( errorMsg );
                        } else {
                          errorMsg = utilities.deepGet( response ,  "err.display_text") ;
                          oThis.showError( errorMsg );
                        }
                    }
                },
                error: function (response) {
                    oThis.showError( )
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
                  oThis.showError(errorData[0].msg);
                }
                else{
                  errorMsg = utilities.deepGet(response, ".err.display_text")
                  oThis.showError(errorMsg);
                }

              }
            },
            error: function (response) {
              oThis.showError()

            }
          })
        },

        showError: function(message){
            if( !message ) {
              message = oThis.genericErrorMessage;
            }
            oThis.jConfirmAccountCover.find(".btn-confirm").text("Confirm Address").prop('disabled', false);
            oThis.jConfirmAccountCover.find('.default-state-wrapper').hide();
            oThis.jConfirmAccountCover.find(".error-state-wrapper").show();
            oThis.jConfirmAccountCover.find(".error-state-wrapper .display-header").text(message);
        }
    };

})(window, jQuery);