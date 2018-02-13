;
(function (window, $) {

  var metamask  = ns("ost.metamask");
  
  var NOTHING_IN_PROGRESS     = 0
    , OST_GRANT_IN_PROGRESS   = 1
    , OST_GRANT_SUCCESS       = 2
    , OST_GRANT_CONFIRMED     = 3
    , READ_ETH_BALANCE        = 4
    , ETH_GRANT_IN_PROGRESS   = 5
    , ETH_GRANT_SUCCESS       = 6
    , ETH_GRANT_CONFIRMED     = 7
    , COMPLETED               = 100

  ;


  
  var oThis = metamask.getOstHelper = {
    init: function ( config ) {
      var oThis = this;
      $.extend( oThis, config);

      if ( !$("#getInitialOstCover").length ) {
        //If possible, do not render the get initial ost cover element on the page.
        return;
      }

      oThis.jForm = $("#get_initial_ost");
      var formHelper = oThis.formHelper = oThis.jForm.formHelper();
      formHelper.success = function() {
        oThis.onFormSuccess.apply(oThis, arguments);
      };

      var __submitHandler = formHelper.submitHandler;
      oThis.submitTheForm = function () {
        __submitHandler.apply( formHelper, arguments);
      }

      formHelper.submitHandler = function () {
        console.log("submitHandler triggered!");
        oThis.nextStep();
      };
      
      oThis.bindEvents();
    }

    , jForm : null
    , formHelper: null
    , currentStep: OST_GRANT_CONFIRMED
    , nextStep: function () {
      var oThis = this;

      console.log("nextStep :: currentStep = " , oThis.currentStep );
      ost.metamask.stopObserver();
      switch( oThis.currentStep ) {

        case NOTHING_IN_PROGRESS:
          console.log("nextStep :: NOTHING_IN_PROGRESS calling submitTheForm");
          oThis.submitTheForm.apply( oThis, arguments );
        break;
        
        case OST_GRANT_IN_PROGRESS:
          var transaction_hash = arguments[0];
          console.log("nextStep :: OST_GRANT_IN_PROGRESS calling validateTransactionHash \n", transaction_hash);
          
          metamask.validateTransactionHash( transaction_hash, function ( response ) {
            oThis.validateHashCallback(response);
          });
        break;

        case OST_GRANT_CONFIRMED:
          console.log("nextStep :: OST_GRANT_CONFIRMED calling getUserEthBalance");
          oThis.getUserEthBalance.apply( oThis, arguments );
        break;

        case READ_ETH_BALANCE:
          console.log("nextStep :: READ_ETH_BALANCE calling getEthFromFocet");
          oThis.getEthFromFocet();
        break;

        case ETH_GRANT_IN_PROGRESS:
          var transaction_hash = arguments[0];
          console.log("nextStep :: ETH_GRANT_IN_PROGRESS calling validateTransactionHash \n", transaction_hash);
          metamask.validateTransactionHash( transaction_hash, function ( response ) {
            oThis.validateHashCallback(response);
          });
        break;

        case ETH_GRANT_SUCCESS:
          oThis.allStepsCompleted.apply( oThis, arguments);
        break;

      }
      oThis.currentStep++;
    }
    , stepFailed: function () {
      switch( oThis.currentStep ) {
        case NOTHING_IN_PROGRESS:
        case OST_GRANT_IN_PROGRESS:
        case OST_GRANT_SUCCESS:
          //Reset to NOTHING_IN_PROGRESS. Start from begining.
          oThis.currentStep = NOTHING_IN_PROGRESS;
          ost.metamask.startObserver();
        break;
        case OST_GRANT_CONFIRMED:
        //Do Nothing. Next time continue from here.
        break;
        case READ_ETH_BALANCE: 
        case ETH_GRANT_IN_PROGRESS:
          //Reset to OST_GRANT_CONFIRMED. Start from granting Eth again.
          oThis.currentStep = OST_GRANT_CONFIRMED;
        break;
        default:
          console.log("stepFailed :: Something missed out. oThis.currentStep = " , oThis.currentStep);
      }
    }

    , allStepsCompleted: function () {
      console.log("allStepsCompleted!");
      oThis.currentStep = COMPLETED;
      ost.coverElements.hide("#getInitialOstCover");
      if ( oThis.onOstGrantedCallback ) {
        oThis.onOstGrantedCallback();
      }
      console.log("oThis.onOstGrantedCallback ", oThis.onOstGrantedCallback  );
    }

    , submitTheForm : null
    , onFormSuccess: function ( response ) {
      var oThis = this;

      if ( response.success ) {
        var data = response.data
          , transaction_hash = data.transaction_hash
        ;
        
        //OST has been granted.
        oThis.nextStep( transaction_hash );
      } else {
        //Failed to grant OST.
        oThis.stepFailed();
      }
    }
    , validateHashCallback: function ( response ) {
      var oThis = this;

      if ( response.success ) {
        oThis.nextStep( response );
      } else {
        oThis.stepFailed( response );
      }
    }
    , getUserEthBalance: function ( callback) {
      var oThis = this;
      web3.eth.getBalance( oThis.getUserAddress(), function ( error, response ) {
        if ( !error && response ) {
          console.log("web3.eth.getBalance callback \n", response);
          try {
            var amt       = web3.fromWei( response, "ether" )
              , strAmt    = amt.toString()
              , maxLen    = Math.min(strAmt.length, 4)
              , subStrAmt = strAmt.substring(0, maxLen)
              , subStrVal = Number( subStrAmt )
            ;

            console.log("subStrVal", subStrVal);
            if ( subStrVal > 20 ) {
              //We have sufficient Balance.
              oThis.allStepsCompleted();
            } else {
              oThis.nextStep( subStrVal );
            }
            
          } catch( e ) {
            console.log("Error converting response");
          }
          
          
        }
        
      });
    }

    , ethFocetCallback: function ( response ) {
      var oThis = this;

    }
    , bindEvents: function () {
      var oThis = this;

      //Bind on Address Change.
      $( metamask ).on(metamask.events.onAddressChanged, function ( event, eventData, newAddress ) {
        console.log("metamask.events.onAddressChanged");
        //I have received a valid address.
        $("#ost__planner__address").text( newAddress );
        $("#eth_address").val( newAddress );
      });
    }

    , onOstGrantedCallback: null
    , getOst : function ( callback ) {
      var oThis = this;
      oThis.onOstGrantedCallback = callback;
      ost.metamask.startObserver();
      ost.coverElements.show("#getInitialOstCover");
    }
    , getUserAddress: function () {
      return $("#eth_address").val();
    }

    , getEthFromFocet: function () {
      var oThis = this;

      var address = oThis.getUserAddress();
      var ostFocetCallback = function ( response ) {
        console.log("getEthFromFocet :: ostFocetCallback \n", response);
        if ( response.success ) {
          if ( response.data.is_user_greedy || !response.data.transaction_hash ) {
            console.log("getEthFromFocet :: ostFocetCallback  :: No Transaction Hash. But, Success.", response);
            oThis.allStepsCompleted();
          } else {
            oThis.nextStep( response.data.transaction_hash );  
          }
        } else {
          oThis.stepFailed();
        }
      };

      var metaMaskFocetCallback = function ( response ) {
        console.log("getEthFromFocet :: metaMaskFocetCallback \n", response);
        if ( response.success ) {
          ostFocetCallback( response );
        } else {
          //We have failed. Lets try to get it from Ost Focet.
          oThis.getEthFromOstFocet(address, ostFocetCallback );
        }
      };

      oThis.getEthFromMetaMaskFocet(address, metaMaskFocetCallback);

    }

    , getEthFromMetaMaskFocet: function ( address, callback, retryCount ) {
      var oThis = this
        , MAX_RETRIES = 3
      ;

      retryCount = retryCount || 0;

      if ( retryCount >= MAX_RETRIES ) {
        console.log("getEthFromMetaMaskFocet :: MAX_RETRIES");
        //We have tried sufficient times.
        if ( callback ) {
          setTimeout(function () {
            callback({
              success: false,
              err: {
                msg: "MetaMask refused to grant ETH"
              }
            });
          }, 10);
        }
        return;
      }


      //Retry with MetaMask Focet.
      var retryFn = function () {
        console.log("getEthFromMetaMaskFocet :: retryFn");
        //We should retry again.
        setTimeout( function () {
          retryCount ++;
          oThis.getEthFromMetaMaskFocet(address, callback, retryCount);
        }, 300);
      };

      var successCallback = function ( transaction_hash ) {
        console.log("getEthFromMetaMaskFocet :: successCallback");
        if ( callback ) { 
          setTimeout( function () {
            callback({
              success: true,
              data: {
                "transaction_hash" : transaction_hash,
                "is_user_greedy": false
              }
            });
          }, 10);
        }
      };

      var userGreedyCallback = function () {
        console.log("getEthFromMetaMaskFocet :: userGreedyCallback");
        if ( callback ) {
          setTimeout( function () {
            callback({
              success: true,
              data: {
                "transaction_hash" : null,
                "is_user_greedy": true
              }
            });
          }, 10);
        }
      }

      var xhr = $.ajax("https://faucet.metamask.io/", {
        type: "POST",
        processData: false,
        contentType: "application/rawdata",
        data: address,
        success: function ( response ) {

          if ( typeof response === 'string' && response.length ) {
            successCallback( response );
          } else if ( response.error ) {

            var errorString = String( response.error ).toLowerCase();
            var greedyString = String("User is greedy").toLowerCase();
            if ( errorSting.indexOf( greedyString ) < 0 ) {
              //We have an error. Lets Retry.
              retryFn();
            } else if ( callback ) {
              //User already has sufficient Eths. Lets call success.
              userGreedyCallback();
            }
          }
        },
        error: function () {
          retryFn();
        }
      });

      //Supress MetaMask Errors.
      xhr.ost = {
        jParent: $("<div></div>")
      };
    },

    getEthFromOstFocet: function ( address, callback ) {
      console.log("getEthFromOstFocet :: Get Eth from OST Focet!");
      //To-Do: Write an Api call to backend. Below is a dummy code.

      var ajaxConfig = {

        success: function ( response ) {
          if ( callback ) {
            callback( response );
          }
        },
        error: function () {
          if ( callback ) {
            callback( {
              success: false,
              err: {
                msg: "Something went wrong!"
              }
            });
          }
        }
      }

      setTimeout(function () {
        ajaxConfig.success({
          success: true,
          data: {
            transaction_hash: "0xa7c22df7a4beabe9d3f8962ddfb912f350953482c54dfa58e2fbe8e30bc7b113"
          }
        })
      }, 300);
    }



  };

})(window, jQuery);