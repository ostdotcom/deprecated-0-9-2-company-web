;
(function (window, $) {
  var parentNS  = ns("ost");

  var oThis = parentNS.etherScan = {
    config: {
      apiEndPoint: "https://api-ropsten.etherscan.io/api/"
      , apiCallInterval : 5000
      , validateTransactionHashMaxTry: 100
      , getBalanceMaxTry: 10

    }

    , getUserEthBalance : function (address, callback, trycount_bal) {
      var oThis = this;


      if ( typeof trycount_bal === "number") {
        trycount_bal++;
      } else {
        trycount_bal = 0;
      }

      if ( trycount_bal >= oThis.config.getBalanceMaxTry ) {
        //Failed.
        //Respond with failuer
        setTimeout(function () {
          callback && callback( {
            success: false,
            data: {
              "address": address
            },
            err: {
              display_text: "Transaction Timed-out.Cannot get balance   Transaction-Hash: " + transactionHash
            }
          })
        }, 0);
        return;
      }


      console.log("User address:", address);

      $.ajax( {
          url:oThis.config.apiEndPoint,
          data: {
            "module" 	: "account"
            , "action"	: "balance"
            , "address" : address
          },
          type:"GET",
          success:function(response){
            if(response.status == 1 ) {
              console.log(response.status)
              console.log(response.result)

              var amtInWie = BigNumber(response.result);
              var ethToWie = BigNumber( 10 ).exponentiatedBy( 18 );
              var amtInEth = amtInWie.dividedBy(ethToWie);

              if (callback) {
                setTimeout(function () {
                  callback({
                    success: true,
                    data: {
                      "balanceInWie": amtInWie,
                      "balanceInEth": amtInEth
                    }
                  });
                },10);
              }

            } else {
              console.log("Failed to get User Eth Balance ..... this means api returned 0");
              //Failed to get balance.
              setTimeout(function () {
                // oThis.getUserEthBalance(address, callback, trycount_bal);
              }, 1000);
              // return
            }



          },
          error : function (response ) {

            console.log("Failed to get User eth balance trying again ...... this means api call failed")
            oThis.getUserEthBalance(address ,callback,trycount_bal);
            //return;

          }
        }

      );


    }

    , validateTransactionHash: function ( transactionHash, callback, tryCount ) {
      var oThis = this;

      if ( typeof tryCount === "number") {
        tryCount++;
      } else {
        tryCount = 0;
      }

      if ( tryCount >= oThis.config.validateTransactionHashMaxTry ) {
        //Failed.
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
        }, 0);
        return;
      }

      $.ajax({
        url: oThis.config.apiEndPoint
        , data: {
          module: "transaction"
          , action: "gettxreceiptstatus"
          , txhash: transactionHash
        }
        , success: function (response) {
          if ( response.status == "1" && response.hasOwnProperty( "result" ) ){
            //Success.
            console.log("validateTransactionHash :: response", response);
            if ( callback ) {

              setTimeout(function () {
                callback({
                  success: true,
                  data: {
                    "transaction_hash" : transactionHash,
                    "api_response": response
                  }
                });
              }, oThis.config.apiCallInterval);
            }

          } else {
            // Failed. - Must-Retry
            console.log("validateTransactionHash :: error", error);
            oThis.validateTransactionHash( transactionHash, callback, tryCount);
          }

        }
        , error: function () {
          // Failed. - Must-Retry
          oThis.validateTransactionHash( transactionHash, callback, tryCount);
        }
      });

    }

  };

})(window, jQuery);