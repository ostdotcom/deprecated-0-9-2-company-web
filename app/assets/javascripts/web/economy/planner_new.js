;
(function (window, $) {

    var ost  = ns("ost");
    var planner = ns("ost.planner");

    var oThis   = ost.planner.step1 = {

        jTokenForm: $('#economy-planner'),
        jConfirmAccountCover: $('#metamaskConfirmAccount'),
        metamask: null,

        init: function( config ){
            $.extend(oThis, config);
            oThis.jTokenForm.formHelper().success = oThis.tokenSuccess;
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

        tokenSuccess: function(){
            oThis.setupMetamask();
            oThis.metamask.enable();
        },

        initConfirmFlow: function(){

            oThis.jConfirmAccountCover.find(".confirm-address").text(oThis.metamask.ethereum.selectedAddress);

            $.ajax({
                url: oThis.signMessagesEndPoint,
                success: function(response){
                    if(response.success){
                        oThis.personalSign(response.data.wallet_association);
                    } else {
                        // error handler
                    }
                }
            });
        },

        personalSign: function(message){

            if(!message) return;

            var from = oThis.metamask.ethereum.selectedAddress;

            oThis.jConfirmAccountCover.find(".btn-confirm").off('click').on('click', function(e){
                oThis.metamask.sendAsync({
                    method: 'personal_sign',
                    params: [message, from],
                    from: from
                }, function(err, result){
                    if (err) return console.error('onSendAsync err', err);
                    if (result.error) return console.error('onSendAsync result.error', result.error);
                    // error handler
                    oThis.associateAddress(result);
                });
            });

        },

        associateAddress: function(result){

            if(!result) return;

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
                        // sign transaction logic
                    } else {
                        // error handler
                    }
                }
            });
        },

        showError: function(message){

        }
    };

})(window, jQuery);