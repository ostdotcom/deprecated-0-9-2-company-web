;(function (window, $) {

    var Metamask = function ( config ) {
        var oThis = this;
        $.extend( oThis, config );
        oThis.init();
    };

    Metamask.prototype = {

        constructor: Metamask,
        web3: null,
        ethereum: null,
        metamask: null,
        isDapp: false,
        isMetamask: false,
        desiredNetwork: '3',

        init: function() {
            var oThis = this;

            // Modern Metamask...
            if (window.ethereum) {
                oThis.isDapp = true;
                oThis.ethereum = ethereum;
                oThis.web3 = new Web3(ethereum);
                oThis.setMetamask();
                if(oThis.isMetamask) {
                    ethereum.on('accountsChanged', oThis.onAccountsChanged);
                    ethereum.on('networkChanged', oThis.onNetworkChanged);
                }
            }
            // Legacy Metamask...
            else if (window.web3) {
                oThis.isDapp = true;
                oThis.web3 = new Web3(web3.currentProvider);
                oThis.setMetamask();
            }
            // No Metamask...
            else {
                oThis.isDapp = false;
                oThis.onNotInstalled();
            }
        },

        setMetamask: function() {
            var oThis = this;
            oThis.isMetamask = (oThis.web3.currentProvider.isMetaMask && oThis.web3.currentProvider._metamask) ? true : false;
            if(oThis.isMetamask){
                oThis.metamask = oThis.web3.currentProvider._metamask;
                oThis.onIsInstalled();
            } else {
                oThis.onNotInstalled();
            }
        },

        enable: function() {
            var oThis = this;

            if(!oThis.isMetamask) return oThis.onNotInstalled();

            oThis.ethereum.enable()
                .then(function(){
                    oThis.onEnabled();
                })
                .catch(function(reason){
                    if (reason === 'User rejected provider access') {
                        oThis.onUserRejectedProviderAccess();
                    } else {
                        console.error('There was an issue signing you in Metamask.');
                    }
                });
        },

        isApproved: function() {
            var oThis = this;
            return oThis.metamask && oThis.metamask.isApproved().then(function(r){
                return r;
            })
        },

        isUnlocked: function() {
            var oThis = this;
            return oThis.metamask && oThis.metamask.isUnlocked().then(function(r){
                return r;
            })
        },

        isEnabled: function() {
            var oThis = this;
            return oThis.metamask && oThis.metamask.isEnabled();
        },

        /**
         * List of callback methods that can be set on initiation:
         *
         * onIsInstalled
         * onNotInstalled
         */

        onIsInstalled: function(callback){
            console.log('MetaMask detected');
            callback && callback();
        },

        onNotInstalled: function(callback){
            console.error('MetaMask not detected');
            callback && callback();
        },

        onNotUnlocked: function(callback){
            console.error('MetaMask not unlocked. Please sign in.');
            callback && callback();
        },

        onEnabled: function(callback){
            console.log('User enabled provider access');
            callback && callback();
        },

        onUserRejectedProviderAccess: function(callback) {
            console.error('User rejected provider access');
            callback && callback();
        },

        onAccountsChanged: function(accounts) {
            console.log('Accounts:', accounts);
        },

        onNetworkChanged: function(network) {
            console.log('Network:', network);
        },

    };

    window.Metamask = Metamask;

})(window, jQuery);

var mm = new Metamask();