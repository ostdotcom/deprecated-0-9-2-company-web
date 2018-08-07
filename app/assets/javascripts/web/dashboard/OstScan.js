;
(function (window, $) {
  var parentNS  = ns("ost");

  var oThis = parentNS.ostScan = {
    config: {
        apiCallInterval : 1000
      , validateTransactionHashMaxTry: 100
      , getBalanceMaxTry: 10
      , simpleTokenContractAddress: "0x2C4e8f2D746113d0696cE89B35F0d8bF88E0AEcA"

    }
    , init: function ( config ) {
      var oThis = this;

      if ( config ) {
        $.extend( oThis.config, config );
      }
    }
    , getUserOstEthBalance : function (address, callback) {

      // var oThis = this;
      //
      // if ( typeof trycount_bal === "number") {
      //   trycount_bal++;
      // } else {
      //   trycount_bal = 0;
      // }
      //
      // if ( trycount_bal >= oThis.config.getBalanceMaxTry ) {
      //   //Failed.
      //   //Respond with failuer
      //   setTimeout(function () {
      //     callback && callback( {
      //       success: false,
      //       data: {
      //         "address": address
      //       },
      //       err: {
      //         display_text: "Api Timed-out. Failed to get balance."
      //       }
      //     })
      //   }, 0);
      //   return;
      // }

      $.ajax( {
          url:"/api/economy/users/fetch-balances",
          data: {
           "address" :address
          },
          type:"GET",
          success:function(response){
            if(response && response.success == true ) {
              //var amtInWie = BigNumber(response.data.balances.eth);
              //var ethToWie = BigNumber( 10 ).exponentiatedBy( 18 );
              var amtInEth = BigNumber(response.data.balances.eth);
              var ostTokenBalance = BigNumber(response.data.balances.OST)
              if (callback) {
                setTimeout(function () {
                  callback({
                    success: true,
                    data: {
                      "balanceInEth": amtInEth,
                      "ostTokenBalance": ostTokenBalance
                    }
                  });
                },10);
              }

            } else {
              console.log("Failed to get User OST and eth balance ..... this means api returned 0");
              //Failed to get balance.

              // setTimeout(function () {
              //   oThis.getUserOstEthBalance(address, callback, trycount_bal);
              // }, oThis.config.apiCallInterval);
            }



          },
          error : function (response ) {

            console.log("Failed to get User OST and eth balance ...... this means api call failed")
            //Failed to get balance.
            // setTimeout(function () {
            //   oThis.getUserOstEthBalance(address, callback, trycount_bal);
            // }, oThis.config.apiCallInterval);
          }
        }

      );

    }



  };

})(window, jQuery);