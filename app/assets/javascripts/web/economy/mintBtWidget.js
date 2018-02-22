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
    , idOstToBt       : null
    , idBtToOst       : null
    , idBtToFiat      : null
    , idForm          : null
    , idTransferHash  : null
    , idConfirmModal  : "stake-mint-confirm"
    , idConfirmBtn    : "confirm_mint_button"
    , idProcessModal  : "stake-mint-processing"

    /* jQuery Dom Refrences */
    , jOstToTransfer  : null
    , jBtToMint       : null
    , jTokenUsdValue  : null
    , jOstBalance     : null
    , jOstAfter       : null
    , jOstToBt        : null
    , jBtToOst        : null
    , jBtToFiat       : null
    , jForm           : null
    , ostFormHelper   : null
    , jTransferHash   : null
    , jConfirmModal   : null
    , jConfirmBtn     : null
    , jProcessModal   : null
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

      //Conversion related inputs
      oThis.jOstToBt        = oThis.jOstToBt        || $( "#" + oThis.idOstToBt );
      oThis.jBtToOst        = oThis.jBtToOst        || $( "#" + oThis.idBtToOst );
      oThis.jBtToFiat       = oThis.jBtToFiat       || $( "#" + oThis.idBtToFiat );
      
      //Other things.
      oThis.jForm           = oThis.jForm           || $( "#" + oThis.idForm );
      oThis.jConfirmModal   = oThis.jConfirmModal   || $( "#" + oThis.idConfirmModal );
      oThis.jConfirmBtn     = oThis.jConfirmBtn     || $( "#" + oThis.idConfirmBtn );
      oThis.jProcessModal   = oThis.jProcessModal   || $( "#" + oThis.idProcessModal );
      oThis.jTransferHash   = oThis.jTransferHash   || $( "#" + oThis.idTransferHash );

      console.log("jForm", oThis.jForm);
      oThis.ostFormHelper   = oThis.jForm.formHelper({
        submitHandler : function () {
          if ( oThis.jTransferHash.val() ) {
            oThis.submitForm();
          } else {
            oThis.formSubmitHandler.apply( oThis, arguments );  
          }
        }
        , success: function () {
          oThis.onFormSubmitSuccess.apply(oThis, arguments);
        }
      });

      PriceOracle.bindCurrencyElements(oThis.jBtToMint, oThis.jTokenUsdValue, oThis.jOstToTransfer);

      oThis.jBtToMint.trigger("change");
      google.charts.load('current', {packages: ['corechart']});

      oThis.bindEvents();

      oThis.updateBtToOst();

    }

    , bindEvents: function () {
      var oThis = this;

      oThis.jBtToMint.on("change", function () {
        oThis.updateChart();
      });

      oThis.jStPrimeToMint.on("change", function () {
        oThis.updateChart();
      });

      oThis.jConfirmBtn.on("click", function () {
        oThis.formSubmitConfirmed();
      });


      $( PriceOracle ).on( PriceOracle.events.ostToBtUpdated, function (event, orgEvent, ostToBt ) {
        oThis.ostToBtUpdated.apply(oThis, arguments);
      });

      google.charts.setOnLoadCallback( function () {
        oThis.onChartsLoaded.apply(oThis, arguments);
      });
    }

    , ostToBtUpdated: function () {
      var oThis = this;

      oThis.jBtToMint.trigger("change");
      oThis.updateBtToOst();
    }

    , updateBtToOst: function () {
      var oThis = this;

      oThis.jBtToOst.safeSetVal( PriceOracle.btToOst( 1 ) );
    }

    //Everything Related to Form.
    , formSubmitHandler: function (form, event) {
      var oThis = this;

      oThis.jConfirmModal.modal("show");
    }

    , formSubmitConfirmed : function () {
      var oThis = this;

      oThis.jConfirmBtn.prop("disabled", true);
      oThis.transferToStaker( function ( response ) {
        if ( response.success ) {
          var transaction_hash = response.data.transaction_hash;
          console.log("transaction_hash", transaction_hash);
          oThis.jConfirmModal.modal("hide");
          oThis.processStaking( transaction_hash );
        }
        oThis.jConfirmBtn.prop("disabled", false);
      });
    }

    , processStaking: function ( transaction_hash ) {
      oThis.jTransferHash.val( transaction_hash );
      
      oThis.submitForm();
    }

    , submitForm: function () {
      //Show pop-up
      oThis.jProcessModal.modal("show");
      //Submit the form.
      var submitHandler = FormHelper.prototype.submitHandler;
      submitHandler.call( oThis.ostFormHelper, oThis.jForm[0] );      
    }

    , onFormSubmitSuccess: function ( response ) {
      console.log("|||||| onFormSubmitSuccess! ||||||");
    }


    //Everything related to transfer OST to staker.
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

      var contract  = oThis.simpleTokenContract = oThis.simpleTokenContract || ost.metamask.createSimpleTokenContract()
        , recipient = oThis.staker_address
        , web3      = ost.metamask.web3()
        , stPrimeToMint
        , ostToTransfer
        , totalOstToTransfer
        , transactionObject
        , sendCallback
      ;

      //Set contract curerent Provider -- Not working for web.
      // contract.setProvider( web3.currentProvider );

      ostToTransfer     = oThis.jOstToTransfer.val();
      ostToTransfer     = BigNumber( ostToTransfer );
      stPrimeToMint     = oThis.jStPrimeToMint.val();
      stPrimeToMint     = BigNumber( stPrimeToMint );

      totalOstToTransfer = stPrimeToMint.plus( ostToTransfer );
      totalOstToTransfer = totalOstToTransfer.toString( 10 );

      //Conver the ost to wei scale.
      totalOstToTransfer     = web3.toWei(totalOstToTransfer, "ether");


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
          ost.metamask.validateTransactionHash( result , function ( response ) {
            console.log("validateTransactionHash response", response);
          });
        }

        console.log("forwardResponse", forwardResponse);

        var callback = oThis.onTransferCallback;
        oThis.onTransferCallback = null;
        oThis.stopObserver();
        console.log("forwardResponse", forwardResponse);
        callback && callback( forwardResponse );

        oThis.isSendInProgress = false;

      };

      console.log("totalOstToTransfer", totalOstToTransfer);
      //Create webjs transaction object.
      transactionObject = contract.transfer(recipient, totalOstToTransfer, {
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

  }



})(window, jQuery);