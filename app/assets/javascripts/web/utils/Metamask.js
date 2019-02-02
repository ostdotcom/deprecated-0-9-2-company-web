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
        desiredAccounts: null,
        defaultUnit: 'wei',

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
                        var len = oThis.desiredAccounts && oThis.desiredAccounts.length ;
                      if( len > 0 ){
                          var metamaskAccount = accounts[0] && accounts[0].toLowerCase() ,
                              cnt , currAccount , isDesiredAddress = false;
                          ;
                          for( cnt = 0 ;  cnt < len ; cnt ++ ){
                            currAccount = oThis.desiredAccounts[ cnt ];
                            if( metamaskAccount == currAccount ){
                              isDesiredAddress = true ;
                              break ;
                            }
                          }
                          if( isDesiredAddress ){
                            oThis.onDesiredAccount();
                          } else {
                            oThis.onNotDesiredAccount();
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

        sendAsync: function(options, callback) {

            var oThis = this;

            if(!oThis.isDapp) return oThis.onNotDapp();
            if(!oThis.isMetamask) return oThis.onNotMetamask();

            oThis.ethereum && oThis.ethereum.sendAsync(options, function(err, result){
                oThis.onSendAsync(options, err, result);
                callback && callback(err, result);
            })
        },

        /**
         * Higher order helper methods:
         *
         * getBalance(walletAddress, callback, unit)
         * balanceOf(walletAddress, contractAddress, callback, unit)
         * getContractEncodedABI(contractAddress, method, values, abi)
         *
         * For unit, refer: https://github.com/ethereum/wiki/wiki/JavaScript-API#web3fromwei
         *
         */

        getBalance: function(walletAddress, callback, unit) {

            var oThis = this;

            if(!walletAddress) return;
            if(!unit) unit = oThis.defaultUnit;

            var options = {
                method: 'eth_getBalance',
                params: [walletAddress, "latest"]
            };

            oThis.sendAsync(options, function(err, result){
              var val = result && result.result ;
              if( val && val === '0x'){
                result.result = '0x0';
              }
              val && callback && callback(oThis.web3.fromWei(result.result, unit));
            });

        },

        balanceOf: function(walletAddress, contractAddress, callback, unit) {

            var oThis = this;

            if(!walletAddress || !contractAddress) return;
            if(!unit) unit = oThis.defaultUnit;

            var options = {
                method: 'eth_call',
                params: [
                    {
                        to: contractAddress,
                        data: oThis.getContractEncodedABI(contractAddress, 'balanceOf', [walletAddress])
                    },
                    "latest"
                ]
            };

            oThis.sendAsync(options, function(err, result){
                var val = result && result.result ;
                if( val && val === '0x'){
                  result.result = '0x0';
                }
                val && callback && callback(oThis.web3.fromWei(result.result, unit));
            });

        },

        getContractEncodedABI: function(contractAddress, method, values, abi) {

            var oThis = this;

            if(!contractAddress || !method || !values) return;
            if(values.constructor !== Array) return;
            if(!abi) abi = oThis.humanStandardTokenAbi;

            var contractMethod = oThis.web3.eth.contract(abi).at(contractAddress)[method];

            if(typeof contractMethod !== "function") {
                console.error(method+' not found in provided abi');
                return;
            }

            return contractMethod.getData.apply(this, values);

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

        onSendAsync: function(options, err, result) {
            console.log('sendAsync options:', options);
            if (err) console.error('sendAsync err:', err);
            if (result && result.error) console.error('sendAsync result.error:', result.error);
            if (result) console.log('sendAsync result:', result);
        },

        /**
         * List of trigger callback methods that can be set on initiation:
         *
         * onAccountsChanged
         * onNetworkChanged
         *
         */

        onAccountsChanged: function(accounts) {
            var oThis = this;
            console.log('accountsChanged:', accounts);
            !accounts[0] && oThis.onWaitingEnable()
        },

        onNetworkChanged: function(network) {
            console.log('networkChanged:', network);
        },
  
        //Helper function
        getWalletAddress : function () {
          var oThis = this;
          return oThis.ethereum && oThis.ethereum.selectedAddress ;
        },

        /**
         * ERC-20 generic ABI: https://github.com/danfinlay/human-standard-token-abi
         *
         * Used as a fallback if ABI is not provided or for standard ERC-20 methods
         *
         */

        humanStandardTokenAbi: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_initialAmount","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"}],"type":"constructor"},{"payable":false,"type":"fallback"},{"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event","anonymous":false},{"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event","anonymous":false}]

    };

    window.Metamask = Metamask;

})(window, jQuery);