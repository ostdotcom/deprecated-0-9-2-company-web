/*
  Note: We are using the Web3 Provided By MetaMask.
  Its Vestion is 0.2x.x.
  Documentation: https://github.com/ethereum/wiki/wiki/JavaScript-API
*/

;
(function (window, $) {

  var ost     = ns("ost");

  var oThis = ost.mintBtWidget = {
    /* Mandetory Configs */
    simple_token_contract_address : null
    , staker_address  : null
    , idOstToTransfer : null
    , idStPrimeToMint : null
    , idBtToMint      : null
    , idTokenUsdValue : null
    , idOstBalance    : null
    , idOstAfter      : null

    /* jQuery Dom Refrences */
    , jOstToTransfer  : null
    , jBtToMint       : null
    , jTokenUsdValue  : null
    , jOstBalance     : null
    , jOstAfter       : null
    /* 
      NOTE: Try to only read from jStPrimeToMint, Please avoid setting Property. 
      Discuss if needed, jStPrimeToMint is not always owned by this widget.
      Feel free to listen to its events.
    */
    , jStPrimeToMint  : null

    , init: function ( config ) {
      var oThis = this;

      config = config || {};

      $.extend( oThis, config );

      oThis.jOstToTransfer  = oThis.jOstToTransfer  || $( "#" + oThis.idOstToTransfer );
      oThis.jBtToMint       = oThis.jBtToMint       || $( "#" + oThis.idBtToMint );
      oThis.jTokenUsdValue  = oThis.jTokenUsdValue  || $( "#" + oThis.idTokenUsdValue );
      oThis.jOstBalance     = oThis.jOstBalance     || $( "#" + oThis.idOstBalance );
      oThis.jOstAfter       = oThis.jOstAfter       || $( "#" + oThis.idOstAfter );
      oThis.jStPrimeToMint  = oThis.jStPrimeToMint  || $( "#" + oThis.idStPrimeToMint );

      PriceOracle.bindCurrencyElements(oThis.jBtToMint, oThis.jTokenUsdValue, oThis.jOstToTransfer);
      oThis.jBtToMint.trigger("change");
      google.charts.load('current', {packages: ['corechart']});

      oThis.bindEvents();

    }

    , bindEvents: function () {
      var oThis = this;

      oThis.jBtToMint.on("change", function () {
        oThis.updateChart();
      });
      oThis.jStPrimeToMint.on("change", function () {
        oThis.updateChart();
      });



      google.charts.setOnLoadCallback( function () {
        oThis.onChartsLoaded.apply(oThis, arguments);
      });
    }

    , onTransferCallback : null
    , transferToStaker: function ( onTransferCallback ) {
      var oThis = this;

      if ( oThis.onTransferCallback ) {
        console.log("Transfer already in progress...");
        return false;
      }

      oThis.onTransferCallback = onTransferCallback;
      oThis.startObserver();

      return true;
    }

    , userAddress: null
    , onAddressChanged: function ( event, eventData, newAddress ) {
      //DO NOT Assign oThis HERE. Required for bindMetaMaskEvents/unbindMetaMaskEvents
      oThis.userAddress = newAddress || null;
    }

    , isSendInProgress : false
    , onObservationComplete: function (event, success, response) { 
      //DO NOT Assign oThis HERE. Required for bindMetaMaskEvents/unbindMetaMaskEvents

      if ( !success ) { 
        return;
      }

      if ( oThis.isSendInProgress ) {
        return;
      }

      oThis.isSendInProgress = true;

      var contract  = oThis.simpleTokenContract = oThis.simpleTokenContract || oThis.createSimpleTokenContract()
        , recipient = oThis.staker_address
        , web3      = ost.metamask.web3()
        , ostToTransfer
        , transactionObject
        , sendCallback
      ;

      //Set contract curerent Provider -- Not working for web.
      // contract.setProvider( web3.currentProvider );

      ostToTransfer     = oThis.jOstToTransfer.val();
      //Conver the ost to wei scale.
      ostToTransfer     = web3.toWei(ostToTransfer, "ether");

      sendCallback =function (error, result) { 
        var forwardResponse = {
          success: true
          , data: {}
        }

        console.log("sendCallback");
        console.log.apply(console, arguments);



        if ( error ) {
          console.log("sendTransaction error", error);
          forwardResponse.success = false;
          forwardResponse.err = {
            display_message: "Failed to transfer OST."
          };
          
        } else {
          forwardResponse.success = true;
          forwardResponse.data.transaction_hash = result;
          oThis.metamask.validateTransactionHash( result , function ( response ) {
            console.log("validateTransactionHash response", response);
          });
        }

        var callback = oThis.onTransferCallback;
        oThis.onTransferCallback = null;
        oThis.stopObserver();
        callback && callback( forwardResponse );

        oThis.isSendInProgress = false;
      };


      //Create webjs transaction object.
      transactionObject = contract.transfer(recipient, ostToTransfer, {
        from: oThis.userAddress
      }, sendCallback);
      //Encode it.
      // encodedAbi        = transactionObject.encodeABI();

      console.log("transactionObject", transactionObject);

      return;

    }


    , startObserver: function () {
      var oThis = this;

      oThis.bindMetaMaskEvents();
      ost.metamask.startObserver( oThis );
    }

    ,bindMetaMaskEvents: function () {
      var oThis = this;

      var metamask = ost.metamask
        , jMetaMask = $( metamask )
      ;
      jMetaMask.on( metamask.events.onObservationComplete, oThis.onObservationComplete);
      jMetaMask.on(metamask.events.onAddressChanged, oThis.onAddressChanged);

    }

    , stopObserver: function () {
      var oThis = this;

      oThis.unbindMetaMaskEvents();
      ost.metamask.stopObserver( oThis );

    }

    , unbindMetaMaskEvents: function () {
      var oThis = this;


      var metamask = ost.metamask
        , jMetaMask = $( metamask )
      ;
      jMetaMask.off( metamask.events.onObservationComplete, oThis.onObservationComplete);
      jMetaMask.off(metamask.events.onAddressChanged, oThis.onAddressChanged);
      oThis.userAddress = null;
    }

    //Every thing to do with charts
    , gChart: null
    , gDataTable : null
    // gi stands for google index.
    , giOstAvailable: -1
    , giStPrime: -1
    , giBtToMint: -1
    , onChartsLoaded : function () {
      var oThis = this;

      var gDataTable = oThis.gDataTable = new google.visualization.DataTable();
      //Define the Column
      gDataTable.addColumn( 'string', 'Type');
      gDataTable.addColumn( 'number', 'Tokens');
      
      
      
      //Define Rows.
      oThis.giStPrime       = gDataTable.addRow( ['Allocated for Transaction Fee', 0] );
      oThis.giBtToMint      = gDataTable.addRow( ['Used for Creating Tokens', 0] );
      oThis.giOstAvailable  = gDataTable.addRow( ['Remaining Ost', 0] );


      oThis.gChart = new google.visualization.PieChart(document.getElementById('ostSupplyPie'));

      oThis.updateChart();
    }

    , updateChart: function () {
      var oThis = this;

      if ( !oThis.gDataTable || !oThis.gChart ) {
        console.log("chart not ready");
        return;
      }

      var ostBalance    = oThis.jOstBalance.val() || "0"
        , btToMint      = oThis.jBtToMint.val() || "0"
        , stPrimeToMint = oThis.jStPrimeToMint.val() || "0"
        , ostToTransfer = oThis.jOstToTransfer.val()
        , colIndex      = 1
        , remainingOst
      ;

      console.log("btToMint", btToMint, 
        "stPrimeToMint", stPrimeToMint, 
        "ostBalance", ostBalance , 
        "ostToTransfer", ostToTransfer 
      );

      remainingOst  = BigNumber(ostBalance).minus(ostToTransfer);

      oThis.gDataTable.setCell(oThis.giStPrime, colIndex, stPrimeToMint );
      oThis.gDataTable.setCell(oThis.giBtToMint, colIndex, ostToTransfer.toString(10) );
      oThis.gDataTable.setCell(oThis.giOstAvailable, colIndex, remainingOst.toString(10) );

      oThis.gChart.draw(oThis.gDataTable, oThis.chartOptions);


      console.log( "remainingOst", remainingOst.toString( 10 ) );
      oThis.jOstAfter.html( remainingOst.toString( 10 ) );
    }

    , chartOptions : {
      pieHole: 0.7,
      pieSliceText: 'none',
      pieSliceBorderColor: 'none',
      colors: ['f6c62b','88c7ca','34445b'],
      legend: 'none',
      chartArea: {
        width: 180,
        height: 180,
        top: 10,
        left: 10
      },
      animation : {
        startup     : true
        , easing    : "out"
        , duration  : 300
      }
    }

    /* Let This be the last property */
    , createSimpleTokenContract: function () {
      var oThis = this;

      var web3 = ost.metamask.metaMaskWeb3();
      var Contract =  web3.eth.contract(oThis.simpleTokenAbi)
      return Contract.at(oThis.simple_token_contract_address );
    }
    , simpleTokenAbi: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TOKEN_NAME","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"TOKEN_SYMBOL","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_adminAddress","type":"address"}],"name":"setAdminAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"TOKEN_DECIMALS","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_opsAddress","type":"address"}],"name":"setOpsAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DECIMALSFACTOR","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"opsAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TOKENS_MAX","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"finalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_proposedOwner","type":"address"}],"name":"initiateOwnershipTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposedOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"completeOwnershipTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"adminAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Burnt","type":"event"},{"anonymous":false,"inputs":[],"name":"Finalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newAddress","type":"address"}],"name":"AdminAddressChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newAddress","type":"address"}],"name":"OpsAddressChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_proposedOwner","type":"address"}],"name":"OwnershipTransferInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnershipTransferCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]

  }



})(window, jQuery);