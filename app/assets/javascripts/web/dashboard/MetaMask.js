;
(function (window, $) {

  var parentNS  = ns("ost");  

  



  var oThis = parentNS.metamask = {
    init: function ( config ) {
      oThis.config = config;
      oThis.idInstall = "#installMetamaskCover";
      oThis.idLocked = "#metamaskLockedCover";
      oThis.idChian = "#metamaskWrongNetworkCover";
      oThis.idAccount = "#metamaskWrongAccountCover";


      oThis.jInstall = $("#installMetamaskCover");
      oThis.jLocked = $("#metamaskLockedCover");
      oThis.jChian = $("#metamaskWrongNetworkCover");
      oThis.jAccount = $("#metamaskWrongAccountCover");
    },
    config: {
      tokenName         : "",
      tokenSymbol       : "",
      tokenIcon         : "",
      eligibleGrantVal  : 1,
      eligibleGrantUnit : "OST",
      valueChainId      : 3,
      utilityChianId    : 1410,
      hasRegisteredAddress : false
    },
    flags : {
      is_locked: false,
      has_metamask: true,
      account: "",
      chain_id: null
    },
    events : {
      onAddressChanged: "ost.metamask.onAddressChanged"
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

    observeMetamask: function () {
      var oThis = this;
      if ( oThis.isObserving || !oThis.shouldObserve ) {
        console.log("observeMetamask :: IGNORED :: isObserving:", isObserving, "shouldObserve: ", oThis.shouldObserve);
        return;
      }
      //Mark as observing.
      oThis.isObserving = true;
      var flags = oThis.flags;


      //
      var observationComplete = function (success, response) {
        oThis.isObserving = false;
        oThis.reObserve();
        console.log("observeMetamask :: Observation Complete!");
      };

      //Put in callbacks in reverse order;
      var chainCallback = function (success, response) {
        oThis.flags.chain_id = response.data.chainId;
        if ( success ) { 
          ost.coverElements.hide( oThis.idChian );

          //IF ADDING A NEW VALIDATION CALL HERE, REMOVE THIS AS WELL.
          //Add a Similar comment in the callback of next validation call.
          observationComplete();
        } else {
          ost.coverElements.show( oThis.idChian );
          observationComplete();
        }
        
      }


      var accountCallback = function (success, response) {
        if ( success ) { 
          ost.coverElements.hide( oThis.idAccount );
          oThis.validateValueChainId( chainCallback );
        } else {
          oThis.updateAccount(""); //Force Update to empty string.
          ost.coverElements.show( oThis.idAccount );
          observationComplete();
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
          observationComplete();
        }
      };

      var installCallback = function (success, response) {
        flags.has_metamask = success;
        if ( success ) {
          ost.coverElements.hide( oThis.idInstall );
          oThis.validateMetaMaskUnlocked( unlockedCallback );
        } else {
          ost.coverElements.show( oThis.idInstall );
          observationComplete();
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
      var web3 = oThis.web3()
        , accounts = web3.eth.accounts
        , response = {
            success : true,
            data    : {
              account: accounts
            }
        }
      ;

      if ( !accounts || !accounts.length ) {
        response.success = false;
      } else {
        response.data.accounts = accounts;
      }
      callback && callback(response.success, response);
      
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
      if ( !config.hasRegisteredAddress ) {
        oThis.updateAccount( newAccount );
        callback && callback( response.success, response );
        return;
      }

      //Ajax to validate address here.
      var ajaxConfig = {
        success: function ( response ) {
          oThis.updateAccount( newAccount );
          response.data = response.data || {};
          response.data.account = newAccount;
          callback && callback( response.success, response );
        }
      };

      //Dummy Code: //Work with Puneet here
      setTimeout(function () {
        ajaxConfig.success({ success: true, data: {}});
      }, 300);
    },


    validateValueChainId: function ( callback ) {
      var oThis = this;

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

    triggerMyEvent: function ( eventName ) {
      var oThis = this;

      

      var args = Array.prototype.slice.call(arguments);
      eventName = args.shift();
      var event = $.Event( eventName );
      $( oThis ).trigger( event, args );
    },

    //Doms
    jInstall : null,
    jLocked : null,
    jChian : null,
    jAccount : null
  };



})(window, jQuery);