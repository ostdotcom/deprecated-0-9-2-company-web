/*
  Note: We are using the Web3 Provided By MetaMask.
  Its Vestion is 0.2x.x.
  Documentation: https://github.com/ethereum/wiki/wiki/JavaScript-API
*/

;
(function (window, $) {

  var parentNS  = ns("ost");



  var oThis = parentNS.metamask = {
    init: function ( config ) {
      oThis.config = config;
      oThis.idInstall = "#installMetamaskCover";
      oThis.idLocked = "#metamaskLockedCover";
      oThis.idChain = "#metamaskWrongNetworkCover";
      oThis.idAccount = "#metamaskWrongAccountCover";
      oThis.lastValidAddress = null;

      oThis.jInstall = $("#installMetamaskCover");
      oThis.jLocked = $("#metamaskLockedCover");
      oThis.jChian = $("#metamaskWrongNetworkCover");
      oThis.jAccount = $("#metamaskWrongAccountCover");

      oThis.initAllScreens();
    },
    lastValidAddress: null,
    config: {
      tokenName         : "",
      tokenSymbol       : "",
      tokenIcon         : "",
      eligibleGrantVal  : 1,
      eligibleGrantUnit : "OST",
      valueChainId      : 3,
      utilityChianId    : 1410,
      hasRegisteredAddress : false,
      apiCallInterval : 5000,
      validateTransactionHashMaxTry: 100
    },
    flags : {
      is_locked: false,
      has_metamask: true,
      account: "",
      chain_id: null
    },
    events : {
      onAddressChanged: "ost.metamask.onAddressChanged",
      onObservationComplete: "ost.metamask.onObservationComplete"
    },
    web3Obj: null,
    metaMaskWeb3: function () {
      return window.web3;
    },
    web3: function () {
      var oThis = this;

      var ourWeb3 = oThis.web3Obj;
      var dAppWeb3 = oThis.metaMaskWeb3();

      if ( !ourWeb3 ) {
        oThis.web3Obj = ourWeb3 = new Web3();
      }
      if ( dAppWeb3 && dAppWeb3.currentProvider ) {
        ourWeb3.setProvider( dAppWeb3.currentProvider );
      }
      return ourWeb3;
    },

    shouldObserve: false,
    isObserving: false,
    startObserver: function () {
      var oThis = this;
      console.log("startObserver");
      oThis.shouldObserve = true;
      oThis.observeMetamask();
      
    },

    stopObserver: function () {
      oThis.shouldObserve = false;
      //Reset the required flags.
      //Account needs to be reset so that it may trigger address changed next time?
      oThis.flags.accounts = "";
      console.log("stopObserver");
    },

    reObserve : function () {
      if ( !oThis.shouldObserve ) { 
        return;
      }

      setTimeout(function () {
        if ( oThis.shouldObserve ) {
          oThis.observeMetamask();  
        }
      },3000);
    },

    observationComplete: function (success, response) {
      var oThis = this;
      console.log("observeMetamask :: Observation Complete!", arguments);
      oThis.isObserving = false;
      oThis.reObserve();

      $( oThis ).trigger( oThis.events.onObservationComplete, [success, response] );
    },

    observeMetamask: function () {
      var oThis = this;
      if ( oThis.isObserving || !oThis.shouldObserve ) {
        console.log("observeMetamask :: IGNORED :: isObserving:", oThis.isObserving, "shouldObserve: ", oThis.shouldObserve);
        return;
      }
      //Mark as observing.
      oThis.isObserving = true;
      var flags = oThis.flags;


      //
      var observationComplete = oThis.observationComplete;
      //Put in callbacks in reverse order;
      var chainCallback = function (success, response) {
        oThis.flags.chain_id = response.data.chainId;
        if ( success ) { 
          ost.coverElements.hide( oThis.idChain );

          //IF ADDING A NEW VALIDATION CALL HERE, REMOVE THIS AS WELL.
          //Add a Similar comment in the callback of next validation call.
          observationComplete.apply(oThis, arguments);
        } else {
          ost.coverElements.show( oThis.idChain );
          observationComplete.apply(oThis, arguments);
        }
        
      }


      var accountCallback = function (success, response) {
        if ( success ) { 
          ost.coverElements.hide( oThis.idAccount );
          oThis.validateValueChainId( chainCallback );
        } else {
          oThis.updateAccount(""); //Force Update to empty string.
          ost.coverElements.show( oThis.idAccount );
          observationComplete.apply(oThis, arguments);
        }
      }

      var unlockedCallback = function (success, response) {
        flags.is_locked = success;

        var account = "";
        if ( success ) {
          account = response.data.accounts[ 0 ];
          ost.coverElements.hide( oThis.idLocked );
          oThis.validateAccountAddress( account, accountCallback );
        } else {
          oThis.updateAccount( account );
          ost.coverElements.show( oThis.idLocked );
          observationComplete.apply(oThis, arguments);
        }
      };

      var installCallback = function (success, response) {
        flags.has_metamask = success;
        if ( success ) {
          ost.coverElements.hide( oThis.idInstall );
          oThis.validateMetaMaskUnlocked( unlockedCallback );
        } else {
          ost.coverElements.show( oThis.idInstall );
          observationComplete.apply(oThis, arguments);
        }
      };

      oThis.validateInstallation( installCallback );
    },

    validateInstallation: function ( callback ) {
      var oThis = this;

      var metaMaskWeb3 = oThis.metaMaskWeb3()
        , response = {
          success : metaMaskWeb3 ? true : false
          , data  : {

          }
        }
      ;

      if ( metaMaskWeb3 ) {
        response.data.metaMaskWeb3 = metaMaskWeb3;
      }

      callback && callback(response.success, response);
      
    },

    validateMetaMaskUnlocked: function ( callback ) {
      var oThis = this;

      //Check for accounts.
      var web3 = oThis.web3();

      web3.eth.getAccounts(function (err, accounts) {
        var response = {
              success : true,
              data    : {
                account: accounts
              }
          }
        ;

        if ( err || !accounts || !accounts.length ) {
          response.success = false;
        } else {
          response.data.accounts = accounts;
        }
        callback && callback(response.success, response);
      });
    },

    validateAccountAddress: function ( newAccount, callback ) {
      var oThis = this;

      var config = oThis.config
        , response = {
            success : true
            , data  : {
              account: newAccount
            }
        }
      ;

      if ( oThis.lastValidAddress && oThis.lastValidAddress == newAccount ) {
        oThis.updateAccount( newAccount );
        callback && callback( response.success, response );
        return;
      }


      //Ajax to validate address here.
      var ajaxConfig = {
        url: "/api/client/validate-eth-address/"
        , data : {
          "eth_address": newAccount
        }
        , success: function ( response ) {
          oThis.updateAccount( newAccount );
          response.data = response.data || {};
          response.data.account = newAccount;
          if ( response.success ) {
            oThis.lastValidAddress = newAccount;
          } else {
            oThis.lastValidAddress = null;
          }
          callback && callback( response.success, response );
        }
      };

      $.get( ajaxConfig );

        
    },


    validateValueChainId: function ( callback ) {
      var oThis = this;
      //ost.metamask.web3().eth.net.getId
      var web3      = oThis.web3()
        , config    = oThis.config
        , chainId   = web3.version.network
        , response  = {
            success : (chainId == config.valueChainId)
            , data  : {
              chainId: chainId
            }
        }
      ;
      console.log("chainId", chainId, "config.valueChainId", config.valueChainId);
      setTimeout(function () {
        callback && callback( response.success, response );
      }, 100);
    },



    updateAccount: function ( newAccount ) {
      var oThis = this;

      var flags = oThis.flags;

      newAccount = newAccount || "";
      if ( flags.account != newAccount) {
        flags.account = newAccount;
        console.log("newAccount", newAccount);
        oThis.triggerMyEvent( oThis.events.onAddressChanged, {address: newAccount}, newAccount );        
      } else {
        console.log("account not changed", newAccount, "|" , flags.account, "|");
      }
    },

    getAccountAddress: function () {
      var oThis = this;

      return oThis.flags.account || null;
    },

    triggerMyEvent: function ( eventName ) {
      var oThis = this;

      

      var args = Array.prototype.slice.call(arguments);
      eventName = args.shift();
      var event = $.Event( eventName );
      $( oThis ).trigger( event, args );
    },

    validateTransactionHash: function ( transactionHash, callback, tryCount ) {
      var oThis = this;

      tryCount = tryCount || 0;
      if ( tryCount >= oThis.config.validateTransactionHashMaxTry ) {
        //Respond with failuer
        setTimeout(function () {
          callback && callback( {
            success: false,
            data: {
              "transaction_hash": transactionHash
            },
            err: {
              display_text: "Transaction Timed-out. Transaction may still be mined. Transaction-Hash: " + transactionHash
            }
          })
        }, 100);
        return;
      }

      
      
      web3.eth.getTransactionReceipt(transactionHash, function (error, data) {
        if (data && data.blockNumber ) {
          console.log("validateTransactionHash :: data", data);
          if ( callback ) {

            setTimeout(function () {
              callback({
                success: true,
                data: {
                  "transaction_hash" : transactionHash,
                  "transaction_receipt": data
                }
              });
            }, 10);
          }
          return;
        } else if ( error ) {
          console.log("validateTransactionHash :: error", error);
          setTimeout(function () {
            callback({
              success: false,
              data: {
                "transaction_hash" : transactionHash,
                "transaction_error": error
              },
              err: {
                msg: "Transaction Failed"
              }
            });
          }, 10);
          return;
        } 
        //Lets retry.
        setTimeout(function () {
          oThis.validateTransactionHash(transactionHash, callback, ++tryCount);
        }, oThis.config.apiCallInterval);
      });
    },

    getEthBalance : function (address, callback) {

    },



    //Doms
    jInstall : null,
    jLocked : null,
    jChian : null,
    jAccount : null,

    idInstall : null,
    idLocked : null,
    idChain : null,
    idAccount : null,

    initAllScreens: function () {
      var oThis = this;

      oThis.initInstallScreen();      
      oThis.initLockedScreen();
      oThis.initChianScreen();
      oThis.initAccountScreen();
    },

    initInstallScreen: function () {
      $("#install_metamask").on("click", function () {
        console.log("Here!");
        $("#metamask_installed").removeClass("d-none");
        $("#install_metamask").hide()
      });
      $("#metamask_installed").on("click", function () {
        location.reload();
      });


    },
    initLockedScreen: function () {
      $("#metamask_unlocked").on("click", function () {
        location.reload();
      });
    },
    initChianScreen: function () {

    },
    initAccountScreen: function () {

    },

    /* Let This be the last property */
    createSimpleTokenContract: function () {
      var oThis = this;

      var web3 = ost.metamask.metaMaskWeb3();
      var Contract =  web3.eth.contract(oThis.simpleTokenAbi)
      return Contract.at(oThis.config.simpleTokenContractAddress );
    },
    simpleTokenAbi: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TOKEN_NAME","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"TOKEN_SYMBOL","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_adminAddress","type":"address"}],"name":"setAdminAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"TOKEN_DECIMALS","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_opsAddress","type":"address"}],"name":"setOpsAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DECIMALSFACTOR","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"opsAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TOKENS_MAX","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"finalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_proposedOwner","type":"address"}],"name":"initiateOwnershipTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposedOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"completeOwnershipTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"adminAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Burnt","type":"event"},{"anonymous":false,"inputs":[],"name":"Finalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newAddress","type":"address"}],"name":"AdminAddressChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newAddress","type":"address"}],"name":"OpsAddressChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_proposedOwner","type":"address"}],"name":"OwnershipTransferInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnershipTransferCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]

  };



})(window, jQuery);