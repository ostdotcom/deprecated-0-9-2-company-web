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
    , idOstStakeForBt : null
    , idStPrimeToMint : null
    , idBtToMint      : null
    , idOstBalance    : null
    , idOstAfter      : null
    , idOstToBt       : null
    , idBtToOst       : null
    , idBtToFiat      : null
    , idForm          : null
    , idTransferHash  : null
    , idOstToTransfer : null
    , idConfirmModal  : "stake-mint-confirm"
    , idConfirmBtn    : "confirm_mint_button"

    /* jQuery Dom Refrences */
    , jOstStakeForBt  : null
    , jBtToMint       : null
    , jOstBalance     : null
    , jOstAfter       : null
    , jOstToBt        : null
    , jBtToOst        : null
    , jBtToFiat       : null
    , jOstToTransfer  : null
    , jForm           : null
    , ostFormHelper   : null
    , jTransferHash   : null
    , jConfirmModal   : null
    , jConfirmBtn     : null
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

      oThis.jOstStakeForBt  = oThis.jOstStakeForBt  || $( "#" + oThis.idOstStakeForBt );
      oThis.jBtToMint       = oThis.jBtToMint       || $( "#" + oThis.idBtToMint );
      oThis.jOstBalance     = oThis.jOstBalance     || $( "#" + oThis.idOstBalance );
      oThis.jOstAfter       = oThis.jOstAfter       || $( "#" + oThis.idOstAfter );
      oThis.jStPrimeToMint  = oThis.jStPrimeToMint  || $( "#" + oThis.idStPrimeToMint );
      oThis.jOstToTransfer  = oThis.jOstToTransfer  || $( "#" + oThis.idOstToTransfer);

      //Conversion related inputs
      oThis.jOstToBt        = oThis.jOstToBt        || $( "#" + oThis.idOstToBt );
      oThis.jBtToOst        = oThis.jBtToOst        || $( "#" + oThis.idBtToOst );
      oThis.jBtToFiat       = oThis.jBtToFiat       || $( "#" + oThis.idBtToFiat );
      
      //Other things.
      oThis.jForm           = oThis.jForm           || $( "#" + oThis.idForm );
      oThis.jConfirmModal   = oThis.jConfirmModal   || $( "#" + oThis.idConfirmModal );
      oThis.jConfirmBtn     = oThis.jConfirmBtn     || $( "#" + oThis.idConfirmBtn );
      oThis.jTransferHash   = oThis.jTransferHash   || $( "#" + oThis.idTransferHash );

      oThis.jOstToBt.val(PriceOracle.ostToBt(1));

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

      oThis.setUpBtToMintSlider();
      oThis.setUpStToMintSlider();

      PriceOracle.bindCurrencyElements(oThis.jBtToMint, null, oThis.jOstStakeForBt);

      google.charts.load('current', {packages: ['corechart']});

      oThis.bindEvents();

      oThis.jBtToMint.trigger("change");  

      if ( String(oThis.jBtToFiat.val()).length > 0 ) {
        oThis.jBtToFiat.trigger("change");
      } else {
        oThis.jOstToBt.trigger("change");
        oThis.jBtToFiat.safeSetVal( PriceOracle.btToFiat( 1 ) );
      }

      oThis.updateBtToOst();

    }

    , setUpBtToMintSlider : function () {
      var oThis = this;

      
    }

    , setUpStToMintSlider : function () {
      var oThis = this;

      
    }

    , bindEvents: function () {
      var oThis = this;

      oThis.jBtToMint.on("change", function () {
        oThis.updateChart();
      });

      oThis.jStPrimeToMint.on("change", function () {
        oThis.updateChart();
        oThis.updateTotalOstToTransfer();
      });

      oThis.jOstStakeForBt.on("change" , function () {
        oThis.updateTotalOstToTransfer();
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

      oThis.jBtToFiat.on("change", function () {
        console.log("jBtToFiat changed!" ,oThis.jBtToFiat.val());
        console.trace();
      })
    }

    ,updateTotalOstToTransfer : function () {
       var stPrimeToMint = oThis.jStPrimeToMint.val(),
           ostStakeForBT = oThis.jOstStakeForBt.val(),
           totalOstToTransfer
       ;
       stPrimeToMint = BigNumber(stPrimeToMint);
       ostStakeForBT = BigNumber(ostStakeForBT);
       if( !PriceOracle.isNaN( stPrimeToMint ) && !PriceOracle.isNaN( ostStakeForBT ) ) {
         totalOstToTransfer = BigNumber(ostStakeForBT).plus(stPrimeToMint);
         oThis.jOstToTransfer.safeSetVal(totalOstToTransfer);
       }
    }

    , ostToBtUpdated: function () {
      var oThis = this;
      console.log("ostToBtUpdated called!");
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
      oThis.transferToStaker( function ( response ) {
        if ( response.success ) {
          var transaction_hash = response.data.transaction_hash;
          console.log("transaction_hash", transaction_hash);
          
          oThis.processStaking( transaction_hash );
        }
      });
      oThis.jConfirmModal.modal("hide");
    }

    , processStaking: function ( transaction_hash ) {
      oThis.jTransferHash.val( transaction_hash );
      
      oThis.submitForm();
    }

    , submitForm: function () {
      //Submit the form.
      var submitHandler = FormHelper.prototype.submitHandler;
      submitHandler.call( oThis.ostFormHelper, oThis.jForm[0] );      
    }

    , onFormSubmitSuccess: function ( response ) {
      console.log("|||||| onFormSubmitSuccess! ||||||");
      oThis.jConfirmModal.modal("hide");

      if ( !response.success ) {
        ost.coverElements.show('#process_failure_error_cover');
        return;
      }

      var data            = response.data || {}
        , pendingCriticalInteractions = data['pending_critical_interactions'] || {}
        , interactionId   = pendingCriticalInteractions["propose_bt"]
      ;

      if (!interactionId) {
        interactionId   = pendingCriticalInteractions["staker_initial_transfer"]
      }

      if ( interactionId ) {
        console.log("onFormSubmitSuccess :: interactionId", interactionId);
        var mintTxStatusModal = new ost.TSM.MintTxStatusModal( interactionId );
        mintTxStatusModal && mintTxStatusModal.show();
      }

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
        , ostStakeForBt
        , totalOstStakeForBt
        , transactionObject
        , sendCallback
      ;

      //Set contract curerent Provider -- Not working for web.
      // contract.setProvider( web3.currentProvider );

      ostStakeForBt     = oThis.jOstStakeForBt.val();
      ostStakeForBt     = BigNumber( ostStakeForBt );
      stPrimeToMint     = oThis.jStPrimeToMint.val();
      stPrimeToMint     = BigNumber( stPrimeToMint );

      totalOstStakeForBt = stPrimeToMint.plus( ostStakeForBt );
      totalOstStakeForBt = totalOstStakeForBt.toString( 10 );

      //Conver the ost to wei scale.
      totalOstStakeForBt     = web3.toWei(totalOstStakeForBt, "ether");


      sendCallback =function (error, result) { 
        var forwardResponse = {
          success: true
          , data: {}
        }

        ost.coverElements.hide('#metamaskSignTransaction');

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

      console.log("totalOstStakeForBt", totalOstStakeForBt);
      //Create webjs transaction object.
      transactionObject = contract.transfer(recipient, totalOstStakeForBt, {
        from: oThis.userAddress
      }, sendCallback);
      //Encode it.
      // encodedAbi        = transactionObject.encodeABI();

      console.log("transactionObject", transactionObject);

      ost.coverElements.show('#metamaskSignTransaction');

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
        , ostStakeForBt = oThis.jOstStakeForBt.val()
        , colIndex      = 1
        , remainingOst
      ;

      console.log("btToMint", btToMint, 
        "stPrimeToMint", stPrimeToMint, 
        "ostBalance", ostBalance , 
        "ostStakeForBt", ostStakeForBt 
      );

      remainingOst  = BigNumber(ostBalance).minus(ostStakeForBt).minus(stPrimeToMint);

      oThis.gDataTable.setCell(oThis.giStPrime, colIndex, stPrimeToMint );
      oThis.gDataTable.setCell(oThis.giBtToMint, colIndex, ostStakeForBt.toString(10) );
      oThis.gDataTable.setCell(oThis.giOstAvailable, colIndex, remainingOst.toString(10) );

      oThis.gChart.draw(oThis.gDataTable, oThis.chartOptions);


      console.log( "remainingOst", remainingOst.toString( 10 ) );
      oThis.jOstAfter.html( remainingOst.toString( 10 ) );
    }

    ,showProcessFailureErrorCover : function () {
      ost.coverElements.show('#process_failure_error_cover');
    }

    , chartOptions : {
      pieHole: 0.7,
      pieSliceText: 'none',
      pieSliceBorderColor: 'none',
      colors: ['fbd764','84d1d4','34445b'],
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