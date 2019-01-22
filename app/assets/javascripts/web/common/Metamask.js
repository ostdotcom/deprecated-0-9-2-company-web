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
                    ethereum.on('accountsChanged', function(accounts){
                        oThis.onAccountsChanged(accounts);
                        oThis.enable();
                    });
                    ethereum.on('networkChanged', function(network){
                        oThis.onNetworkChanged(network);
                        oThis.enable();
                    });
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

            oThis.isApproved().then(function(r){
              if(!r) oThis.onWaitingEnable();
            });
            oThis.ethereum && oThis.ethereum.enable()
                .then(function(accounts){
                    oThis.onEnabled();
                    if (ethereum.networkVersion !== oThis.desiredNetwork) {
                        oThis.onNotDesiredNetwork();
                    } else {
                        oThis.onDesiredNetwork();
                        if(oThis.desiredAccount){
                            if(accounts[0] !== oThis.desiredAccount){
                                oThis.onNotDesiredAccount();
                            } else {
                                oThis.onDesiredAccount();
                            }
                        } else {
                            oThis.onNewAccount();
                        }
                    }
                })
                .catch(function(reason){
                    if (reason === 'User rejected provider access') {
                        oThis.onUserRejectedProviderAccess();
                    } else {
                        console.error('There was an issue signing you in Metamask.', reason);
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

        sendAsync: function(options, callback) {

            var oThis = this;

            if(!oThis.isDapp) return oThis.onNotDapp();
            if(!oThis.isMetamask) return oThis.onNotMetamask();

            oThis.ethereum && oThis.ethereum.sendAsync(options, function(err, result){
                oThis.onSendAsync(err, result, callback);
            })
        },

        /**
         * Higher order helper methods:
         *
         * getBalance(walletAddress, callback)
         * balanceOf(walletAddress, contractAddress, callback)
         *
         */
        getBalance: function(walletAddress, callback) {

            var oThis = this;

            if(!oThis.isDapp) return oThis.onNotDapp();
            if(!oThis.isMetamask) return oThis.onNotMetamask();
            if(typeof walletAddress === 'undefined') return;

            var options = {
                method: 'eth_getBalance',
                params: [walletAddress, "latest"]
            };

            oThis.ethereum && oThis.ethereum.sendAsync(options, function(err, result){
                oThis.onSendAsync(err, result, callback);
            });

        },

        balanceOf: function(walletAddress, contractAddress, callback) {

            var oThis = this;

            if(!oThis.isDapp) return oThis.onNotDapp();
            if(!oThis.isMetamask) return oThis.onNotMetamask();
            if(typeof walletAddress === 'undefined' || typeof contractAddress === 'undefined') return;

            var options = {
                method: 'eth_call',
                params: [
                    {
                        to: contractAddress,
                        data: web3.sha3('balanceOf(address)').slice(0,10) + "000000000000000000000000" + walletAddress.substring(2),
                    },
                    "latest"
                ]
            };

            oThis.ethereum && oThis.ethereum.sendAsync(options, function(err, result){
                oThis.onSendAsync(err, result, callback);
            });

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
         * onNewAccount
         * onSendAsync
         *
         * Negative flows:
         * ---------------
         * onNotDapp
         * onNotMetamask
         * onWaitingEnable
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

        onNewAccount: function(callback){
            console.log('Confirm account selection...');
            callback && callback();
        },

        onWaitingEnable: function(callback){
            console.log('Waiting to be enabled...');
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

        onSendAsync: function(err, result, callback) {
            if (err) console.error('onSendAsync err', err);
            if (result && result.error) console.error('onSendAsync result.error', result.error);
            if (result) console.log('onSendAsync result', result);
            callback && callback(err, result);
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