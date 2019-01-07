;
(function (window, $) {

    var ost  = ns("ost");
    var planner = ns("ost.planner");

    var oThis   = ost.planner.step1 = {

        jTokenForm: $('#economy-planner'),
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
                    ost.coverElements.show("#metamaskConfirmAccount");
                }

            });

        },

        tokenSuccess: function(){
            oThis.setupMetamask();
            oThis.metamask.enable();
        }
    };

})(window, jQuery);