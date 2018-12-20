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

        init: function() {
            var oThis = this;

            // Modern Metamask...
            if (window.ethereum) {
                oThis.isDapp = true;
                oThis.ethereum = ethereum;
                oThis.web3 = new Web3(ethereum);
                oThis.setMetamask();
                ethereum.on('accountsChanged', oThis.onAccountsChanged);
                ethereum.on('networkChanged', oThis.onNetworkChanged);
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
            }
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

        enable: function() {

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

        onAccountsChanged: function(accounts) {
            console.log('Accounts: ', accounts);
        },

        onNetworkChanged: function(network) {
            console.log('Network: ', network);
        },

    };

    window.Metamask = Metamask;

})(window, jQuery);

var mm = new Metamask();