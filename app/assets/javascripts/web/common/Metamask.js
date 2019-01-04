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
        desiredAccount: null,

        init: function() {
            var oThis = this;

            // Modern Dapp browser / Metamask...
            if (typeof window.ethereum !== 'undefined') {
                oThis.isDapp = true;
                oThis.ethereum = ethereum;
                oThis.web3 = new Web3(ethereum);
                oThis.setMetamask();
                if(oThis.isMetamask) {
                    ethereum.on('accountsChanged', oThis.onAccountsChanged);
                    ethereum.on('networkChanged', oThis.onNetworkChanged);
                }
            }
            // Legacy Dapp browser / Metamask...
            else if (typeof window.web3 !== 'undefined') {
                oThis.isDapp = true;
                oThis.web3 = new Web3(web3.currentProvider);
                oThis.setMetamask();
            }
            // No Dapp browser / Metamask...
            else {
                oThis.isDapp = false;
                oThis.onNotDapp();
            }
        },

        setMetamask: function() {
            var oThis = this;
            oThis.isMetamask = (oThis.web3.currentProvider.isMetaMask && oThis.web3.currentProvider._metamask) ? true : false;
            if(oThis.isMetamask){
                oThis.metamask = oThis.web3.currentProvider._metamask;
                oThis.onMetamask();
            } else {
                oThis.onNotMetamask();
            }
        },

        enable: function() {
            var oThis = this;

            if(!oThis.isDapp) return oThis.onNotDapp();
            if(!oThis.isMetamask) return oThis.onNotMetamask();

            oThis.ethereum && oThis.ethereum.enable()
                .then(function(accounts){
                    oThis.onEnabled();
                    if (ethereum.networkVersion !== oThis.desiredNetwork) {
                        oThis.onNotDesiredNetwork();
                    } else {
                        oThis.onDesiredNetwork();
                        if(oThis.desiredAccount && accounts[0] !== oThis.desiredAccount){
                            oThis.onNotDesiredAccount();
                        } else {
                            oThis.onDesiredAccount();
                        }
                    }
                })
                .catch(function(reason){
                    if (reason === 'User rejected provider access') {
                        oThis.onUserRejectedProviderAccess();
                    } else {
                        console.error('There was an issue signing you in Metamask.');
                    }
                });
        },

        watchAsset: function(params) {
            var oThis = this;

            if(!oThis.isDapp) return oThis.onNotDapp();
            if(!oThis.isMetamask) return oThis.onNotMetamask();

            oThis.ethereum && oThis.ethereum.sendAsync({
                method: 'metamask_watchAsset',
                params: params,
                id: Math.round(Math.random() * 100000),
            }, console.log)
        },

        sendTransaction: function(params, callback) {

            var oThis = this;

            if(!oThis.isDapp) return oThis.onNotDapp();
            if(!oThis.isMetamask) return oThis.onNotMetamask();

            oThis.ethereum && oThis.ethereum.sendAsync({
                method: 'eth_sendTransaction',
                params: params,
                from: oThis.ethereum.selectedAddress,
            }, callback)
        },

        /**
         * List of flags specific to Metamask, implemented as Promises or functions
         * Avoid usage unless UI needs such granular checks
         *
         */

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
         * Positive flows:
         * ---------------
         * onMetamask
         * onEnabled
         * onDesiredNetwork
         * onDesiredAccount
         *
         * Negative flows:
         * ---------------
         * onNotDapp
         * onNotMetamask
         * onUserRejectedProviderAccess
         * onNotDesiredNetwork
         * onNotDesiredAccount
         *
         */

        onNotDapp: function(callback){
            console.error('dApp browser or MetaMask not detected');
            callback && callback();
        },

        onMetamask: function(callback){
            console.log('MetaMask detected');
            callback && callback();
        },

        onNotMetamask: function(callback){
            console.error('dApp browser but not MetaMask detected');
            callback && callback();
        },

        onNotDesiredNetwork: function(callback){
            console.error('Wrong network selected, please switch it in your MetaMask UI.');
            callback && callback();
        },

        onDesiredNetwork: function(callback){
            console.log('Desired network selected');
            callback && callback();
        },

        onNotDesiredAccount: function(callback){
            console.error('Wrong account selected, please switch it in your MetaMask UI.');
            callback && callback();
        },

        onDesiredAccount: function(callback){
            console.log('Desired account selected');
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

        /**
         * List of trigger callback methods that can be set on initiation:
         *
         * onAccountsChanged
         * onNetworkChanged
         *
         */

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