;
(function (window,$) {
  var ost = ns("ost") ,
     Progressbar = ns("ost.ProgressBar") ,
     Polling = ns("ost.Polling") ,
     utilities =  ns("ost.utilities")
;
  
  var oThis = ost.tokenMint = {

    //Static jQuery elements start
    jMintTokensBtn                  :   $("#mint-tokens"),
    jMintTokenContinueBtn           :   $("#token-mint-continue-btn"),
    jStakeMintStart                 :   $("#stake-mint-start"),
    jStakeMintProcess               :   $("#stake-mint-process"),
    jAddressNotWhitelistedSection   :   $('#jAddressNotWhitelistedSection') ,
    jInsufficientBalSection         :   $('#jInsufficientBalSection') ,
    jSelectedAddress                :   $("[name='staker_address']"),
    jBtToOstConversion              :   $('.bt_to_ost_conversion'),
    jMintSections                   :   $('.jMintSections'),
    jConfirmStakeMintForm           :   $('#stake-mint-confirm-form'),
    jGetOstForm                     :   $('#get-ost-form'),
    jGetOstBtn                      :   $('#get-ost-btn'),
    jTokenStakeAndMintSignSection   :   $('#jTokenStakeAndMintSignSection'),
    jSignHeaders                    :   $('.jSignHeader'),
    jAllowStakeAndMintMsgWrapper    :   $('.jAllowStakeAndMintWrapper'),
    jAutorizeStakeAndMintMsgWrapper :   $('.jAutorizeStakeAndMintWrapper'),
    jSignClientErrorBtnWrap         :   $('.jSignClientErrorBtnWrap'),
    jSignServerErrorBtnWrap         :   $('.jSignServerErrorBtnWrap'),
    jStakeAndMintConfirmModal       :   $("#stake-mint-confirm-modal"),
    jGoBackBtn                      :   $('.jGoBackBtn'),
    jClientRetryBtn                 :   $('.jClientRetryBtn'),
    jServerRetryBtn                 :   $('.jServerRetryBtn'),
    //Static jQuery elements End
  
    //Dynamic jQuery elements start
    jBtToMint                       :   null,
    //Dynamic jQuery elements start
    
    metamask                        :   null,
    walletAddress                   :   null,  //Used only for caching once approve transaction is done.
  
    //FormHelpers start
    confirmStakeMintFormHelper      :   null ,
    getOstFormHelper                :   null ,
    //FormHelpers end
    
    //Polling start
    getOstPolling                   :   null,
    stakeAndMintPolling             :   null,
    //Polling end
  
    //Backend required data with key name start
    approve_transaction_hash        :   null,
    request_stake_transaction_hash  :   null,
    //Backend required data with key name end
    
    //Data from backend start
    mintApi : null,
    workFlowStatusApi: null,
    chainId : null,
    redirectRoute : null,
    dataConfig: null,
    btToMintId: null,
    //Data from backend end
  
    //General error msg start
    genericErrorMessage             :   'Something went wrong!',
    getOstError                     :   "Not able to grant OST right now, try again later.",
    stakeAndMintError               :   "Looks like there was an issue in the minting process, Please connect with customer support with the 2 transaction hash.",
    //General error msg end

    init : function (config) {
      
      console.log("===config====" , config );
      
      $.extend(oThis,config);
      var workflowId = oThis.getWorkflowId() ,
          desiredAccounts = oThis.getWhitelistedAddress()
      ;
      
      oThis.setupMetamask( desiredAccounts );
      oThis.initFlow();
      
      if( workflowId ) {
        oThis.metamask.enable();
      }
      
    },
    
    initFlow : function () {
      oThis.initPriceOracle();
      oThis.initUIValues();
      oThis.bindActions();
    },
    
    initPriceOracle : function ( ) {
      PriceOracle.init({
        "ost_to_fiat" : oThis.getPricePoint() ,
        "ost_to_bt"   : oThis.getOstToBTConversion()
      });
    },
    
    initUIValues: function() {
      oThis.jBtToMint = $("#"+oThis.btToMintId) ;
      oThis.jBtToOstConversion.text(  oThis.getOstToBTConversion() );
      oThis.initConfirmStakeMintFormHelper();
      oThis.initGetOstFormHelper();
    },
    
    initConfirmStakeMintFormHelper : function () {
      oThis.confrimStakeMintFormHelper = oThis.jConfirmStakeMintForm.formHelper({
        success: function (  res ) {
          if( res.success  ){
            oThis.onConfirmStakeMintSuccess( res ) ;
          }
        }
      });
    },
    
    initGetOstFormHelper: function () {
      oThis.getOstFormHelper = oThis.jGetOstForm.formHelper({
        beforeSend : function () {
         oThis.requestingOstUIState();
        },
        success: function ( res ) {
          if( res.success ){
            var workflowId = utilities.deepGet( res , "data.workflow.id") ;
            setTimeout( function () {
              oThis.onWorkFlow( workflowId );
            }, 0 );
          }else {
            oThis.resetGetOstUIState( res );
          }
        },
        error: function ( jqXhr , error ) {
         oThis.resetGetOstUIState( error );
        }
      });
    },

    bindActions : function () {
      oThis.jMintTokensBtn.off('click').on("click",function () {
        utilities.btnSubmittingState( $(this) );
        oThis.onMintToken();
      });

      oThis.jMintTokenContinueBtn.off('click').on("click",function () {
        oThis.jStakeAndMintConfirmModal.modal('show');
      });
      
      oThis.jGoBackBtn.off('click').on('click' , function () {
        oThis.showSection( oThis.jStakeMintProcess );
      });
      
      oThis.jClientRetryBtn.off('click').on('click' , function () {
        oThis.approve();
      });
      
      oThis.jServerRetryBtn.off('click').on('click' , function () {
        oThis.resetState();
        oThis.sendTransactionHashes();
      });

    },

    onMintToken: function () {
      oThis.metamask.enable();
    },
    
    setupMetamask: function( desiredAccounts ){

      oThis.metamask = new Metamask({
        desiredNetwork: oThis.chainId,
        desiredAccounts : desiredAccounts , //Handling of undefined is present in Metamask so not to worry.

        onNotDapp: function(){
          ost.coverElements.show("#installMetamaskCover");
        },

        onNotMetamask: function(){
          ost.coverElements.show("#installMetamaskCover");
        },

        onWaitingEnable: function(){
          ost.coverElements.show("#metamaskLockedCover");
        },
        
        onUserRejectedProviderAccess: function(){
          ost.coverElements.show("#metamaskDisabledCover");
        },

        onNotDesiredNetwork: function(){
          ost.coverElements.show("#metamaskWrongNetworkCover");
        },

        onNotDesiredAccount: function(){
          ost.coverElements.show("#metamaskWrongAccountCover");
        },

        onDesiredAccount: function(){
          ost.coverElements.hideAll();
          oThis.onDesiredAccount();
        },

        onNewAccount: function(){
          ost.coverElements.hideAll();
          oThis.validateAccount();
        }
      });
    },
  
    onDesiredAccount : function () {
      oThis.setStakerAddress();
      var workflowId = oThis.getWorkflowId() ;
      if( workflowId ){
        oThis.onWorkFlow( workflowId );
      }else {
        oThis.checkEthBal();
      }
    },
  
    onWorkFlow : function ( workflowId ) {
      oThis.startGetOstPolling( workflowId )
    },
  
    validateAccount : function () {
      var whitelisted = oThis.getWhitelistedAddress(),
          selectedAddress = oThis.getWalletAddress()
      ;
     oThis.setStakerAddress();
      if( !whitelisted || whitelisted.indexOf( selectedAddress.toLowerCase() ) < 0 ){
        oThis.showSection( oThis.jAddressNotWhitelistedSection ) ;
      }
      else{
        oThis.checkForBal();
      }
    },
  
    setStakerAddress : function (  ) {
      var selectedAddress = oThis.getWalletAddress() ;
      oThis.jSelectedAddress.setVal( selectedAddress );
    },

    checkForBal: function () {
      oThis.resetGetOstUIState();
      oThis.checkEthBal();
    },
  
    checkEthBal : function () {
      var walletAddress = oThis.getWalletAddress() ;
      oThis.metamask.getBalance( walletAddress  , function ( eth ) {
        var minETHRequire = oThis.getMinETHRequired(),
            ethBN = eth && BigNumber( eth )
        ;
        if( !ethBN ||  ethBN.isLessThan( minETHRequire ) ){
          oThis.showSection(  oThis.jInsufficientBalSection ) ;
          $('buy-eth-btn').show();
        }else {
          oThis.checkForOstBal();
        }
      }) ;
    },
    
    checkForOstBal : function(){
      var walletAddress = oThis.getWalletAddress() ,
          simpleTokenContractAddress  =   oThis.getSimpleTokenContractAddress()
      ;
      oThis.metamask.balanceOf( walletAddress , simpleTokenContractAddress , function ( ost ) {
        var minOstRequire = oThis.getMinOstRequired() ,
            ostBN =  ost && ost && BigNumber( ost )
        ;
        if( !ostBN || ostBN.isLessThan( minOstRequire ) ){
          oThis.showSection(  oThis.jInsufficientBalSection ) ;
          $('buy-ost-btn').show();
        }else {
          ost = PriceOracle.fromWei( ost );
          oThis.onValidationComplete( ost );
        }
      } ) ;
    },
    
    /*********************************************************************************************************-/
     *                                                                                                       *
     *       NOTE IMPORTANT : OST PASSED AFTER VALIDATION ON BALANCE IS NOT IN WEI , ITS ABSOLUTE VALUE      *
     *                                                                                                       *
     *********************************************************************************************************/
  
    onValidationComplete : function ( ost ) {
      var btToMint = oThis.getBTtoMint() ,
          ostToStake = PriceOracle.btToOst( btToMint );
      ;
      if( !PriceOracle.isNaN( ost )){
        oThis.totalOST = Number( ost );
      }
      oThis.mintDonuteChart = new GoogleCharts();
      oThis.initSupplyPieChart( ostToStake );
      $('.total-ost-available').text( PriceOracle.toPrecessionOst( ost ) );  //No mocker so set via precession
      oThis.updateSlider( ost );
      oThis.showSection(  oThis.jStakeMintProcess ) ;
    },
  
    requestingOstUIState : function () {
      $('.jStatusWrapper').hide();
      $('.jGetOstLoaderText').show();
      //This will be handled by FormHelper , but its a common function for long polling so dont delete
      utilities.btnSubmittingState( oThis.jGetOstBtn );
    } ,
  
    resetGetOstUIState: function () {
      $('.jStatusWrapper').show();
      $('.jGetOstLoaderText').hide();
      //This will be handled by FormHelper , but its a common function for long polling so dont delete
      utilities.btnSubmitCompleteState( oThis.jGetOstBtn );
    },
  
  
    startGetOstPolling: function ( workflowId ) {
      if( !workflowId ) return ;
      oThis.requestingOstUIState();
      var workflowApi = oThis.getWorkFlowStatusApi( workflowId )
      ;
      oThis.getOstPolling = new Polling({
        pollingApi      : workflowApi ,
        pollingInterval : 4000,
        onPollSuccess   : oThis.getOstPollingSuccess.bind( oThis ),
        onPollError     : oThis.getOstPollingError.bind( oThis )
      });
      oThis.getOstPolling.startPolling();
    },
  
    getOstPollingSuccess : function( response ){
      if(response && response.success){
        if( oThis.getOstPolling.isWorkflowFailed( response ) || oThis.getOstPolling.isWorkflowCompletedFailed( response ) ){
          oThis.showGetOstPollingError( response );
        }else if( !oThis.getOstPolling.isWorkFlowInProgress( response ) ){
          oThis.getOstPolling.stopPolling();
          oThis.checkForBal();
        }
      }else {
        oThis.showGetOstPollingError( response );
      }
    },
  
    getOstPollingError : function( jqXhr , error  ){
      if( oThis.getOstPolling.isMaxRetries() ){
        oThis.showGetOstPollingError( error );
      }
    },
  
    showGetOstPollingError : function ( res ) {
      oThis.getOstPolling.stopPolling();
      utilities.showGeneralError( oThis.jGetOstForm ,  res ,  oThis.getOstError  );
      oThis.resetGetOstUIState();
    },
    
    updateSlider : function ( ost ) {
      var maxBT = oThis.getMaxBTToMint( ost ),
          jSlider = oThis.jBtToMint.closest( '.form-group' ).find('#'+oThis.btToMintId+"_slider")
      ;
      oThis.jBtToMint.attr("max" , maxBT );
      jSlider.slider({"max" : maxBT }) ;
    },
    
    ostToStakeOnBtChange : function ( val ) {
      
      if( PriceOracle.isNaN( oThis.totalOST )) {
        return val ;
      }
      var ostToStake = PriceOracle.btToOst( val ) ,
          ost        = PriceOracle.toOst( ostToStake )
      ;
      if(  PriceOracle.isNaN( ost)  ){
        return val;
      }
      
      oThis.updateSupplyPieChart( ostToStake ) ;
      
      return ost ; //Mocker will take care of precession
    },
  
    ostAvailableOnBtChange : function ( val ) {
      if( PriceOracle.isNaN( oThis.totalOST )) {
        return val ;
      }
      var ostToStake = PriceOracle.btToOst( val ) ;
      if( PriceOracle.isNaN( ostToStake )) {
        return oThis.totalOST  ;
      }
      ostToStake = Number( ostToStake ) ;
      
      var ostAvailable = oThis.totalOST - ostToStake;
      
      if( ostAvailable < 0 ){
        return 0 ;
      }
      
      return ostAvailable ; 
    },
  
    getWalletAddress : function () {
      return oThis.walletAddress || oThis.metamask.getWalletAddress();
    },
  
    getMinETHRequired : function () {
      return utilities.deepGet( oThis.dataConfig , "min_eth_required" );
    },
    
    getMinOstRequired : function () {
      return utilities.deepGet( oThis.dataConfig , "min_ost_required" );
    },
    
    getPricePoint : function () {
      return utilities.deepGet( oThis.dataConfig , "price_points.OST.USD" ) ;
    },
    
    getOstToBTConversion : function () {
      return  utilities.deepGet( oThis.dataConfig , "token.conversion_factor" ) ;
    },
  
    getSimpleTokenABI : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.simple_token.abi" );
    },
  
    getSimpleTokenContractAddress : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.simple_token.address" );
    },
  
    getBrandedTokenABI : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.branded_token.abi" );
    },
  
    getBrandedTokenContractAddress : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.branded_token.address" );
    },
  
    getGatewayComposerDetails  : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails" ) ;
    },
  
    getGatewayComposerTxParams: function(){
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.request_stake_tx_params" ) ;
    },
  
    getGatewayComposerContractAddress  : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.contract_details.gateway_composer.address" ) ;
    },
  
    getGatewayComposerABI  : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.contract_details.gateway_composer.abi" ) ;
    },
  
    getSimpleTokenContractGas : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.simple_token.gas.approve" );
    },
  
    getGatewayComposerContractGas : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.contract_details.gateway_composer.gas.requestStake" ) ;
    },
  
    getGasPrice : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails.gas_price" );
    },
  
    getWhitelistedAddress : function () {
      var whitelistedAddress = utilities.deepGet( oThis.dataConfig , "origin_addresses.whitelisted") ;
      if( whitelistedAddress && whitelistedAddress instanceof Array ){
        whitelistedAddress = whitelistedAddress &&  whitelistedAddress.map( function ( a ) {
          return typeof a == "string" ? a.toLowerCase() : a ;
        });
      }
      return whitelistedAddress ;
    },
    
    getDesiredAccount : function () {
      var whitelistedAddresses = oThis.getWhitelistedAddress();
      return whitelistedAddresses && whitelistedAddresses[ 0 ] ; //For now considering owner address as whitelisted address
    },
    
    getWorkflowId : function () {
      return utilities.deepGet( oThis.dataConfig , "workflow.id" ) ;
    },
  
    getMaxBTToMint : function ( ost ) {
      return PriceOracle.ostToBt(ost );  //Mocker will take care of precession
    },
    
    getWorkFlowStatusApi : function ( id ) {
      id = id || oThis.getWorkflowId();
      return oThis.workFlowStatusApi + "/" + id ;
    },
    
    getBTtoMint: function () {
      return oThis.jBtToMint.val();
    },
    
    setDataInDataConfig : function ( key , data ) {
      if( !key ) return ;
      oThis.dataConfig[ key  ] = data ;
    },
  
    btToFiat : function (val) {
      return PriceOracle.btToFiat( val ) ;  //Mocker will take care of precession
    },

    showSection : function( jSection ){
      oThis.jMintSections.hide();
      jSection.show();
    },
  
    updateSupplyPieChart: function (  ostToStake ) {
      if( !oThis.mintDonuteChart ) return ;
      
      ostToStake    = ostToStake && Number(ostToStake) || 0;
    
      var ostAvailable  = oThis.totalOST -  ostToStake  ;
      
      if( ostAvailable < 0){
        ostAvailable = 0;
      }
      
      var data = [
        ['Type', 'Tokens'],
        ['OSTAvailable', ostAvailable],
        ['OSTStaked', ostToStake]
      ];
     oThis.mintDonuteChart.draw({
        data : data
      });
    },
    
    initSupplyPieChart: function( ostToStake  ){
      
      ostToStake    = ost && Number( ostToStake ) || 0 ;
      
      var ostAvailable  = oThis.totalOST -  ostToStake  ;
      oThis.mintDonuteChart.draw({
        data: [
          ['Type', 'Tokens'],
          ['OSTAvailable', ostAvailable],
          ['OSTStaked', ostToStake]
        ],
        selector: '#ostSupplyInAccountPie',
        type: 'PieChart',
        options: {
          title: 'OST SUPPLY IN ACCOUNT',
          pieHole: 0.7,
          pieSliceText: 'none',
          pieSliceBorderColor: 'none',
          colors: ['34445b','88c7ca'],
          backgroundColor: 'transparent',
          enableInteractivity: false,
          legend: 'none',
          chartArea: {
            width  : 180,
            height : 180,
            top    : 10,
            left   : 10
          },
          animation  : {
            startup  : true,
            easing   : "out",
            duration : 300
          }
        }
      })
    },
    
    onConfirmStakeMintSuccess : function ( res ) {
        var data = res && res.data  ;
        oThis.setDataInDataConfig( "gatewayComposerDetails" ,  data );
        oThis.jStakeAndMintConfirmModal.modal('hide');
        oThis.showSection( oThis.jTokenStakeAndMintSignSection ) ;
        oThis.approve();
    },
    
    approve: function () {
      oThis.resetState();
      
      var btToMint      = oThis.getBTtoMint() ,
          ostToStake    = PriceOracle.btToOst( btToMint ) ,
          ostToStakeWei = PriceOracle.toWei( ostToStake )
      ;
  
      // Build params for approve
      var params = [
        oThis.getGatewayComposerContractAddress(),
        ostToStakeWei
      ];
  
      // Create Encoded ABI using params
      var data = oThis.metamask.getContractEncodedABI(
        oThis.getSimpleTokenContractAddress(),
        'approve',  //ABI method name
        params,
        oThis.getSimpleTokenABI()
      );
  
      // Create options ABI using data
      var options = {
        method: 'eth_sendTransaction',
        params: [
          {
            "from": oThis.getWalletAddress(),
            "to": oThis.getSimpleTokenContractAddress(),
            "data": data,
            "gas": oThis.getSimpleTokenContractGas(),
            "gasPrice": oThis.getGasPrice()
          }
        ]
      };
  
      // If data then send transaction...
      if(data){
        oThis.metamask.sendAsync(options, function(err, result){
          
          if(  err || ( result && result.error ) ){
            oThis.onApproveError( err );
          }else if( result ){
            oThis.onApprove( result );
          }
          err && console.error(err);
          result && console.log(result);
        });
      }
      
    },
  
    onApprove: function ( res ) {
      oThis.walletAddress = oThis.getWalletAddress(); //Cache once approve transaction is confirmed from metamask.
      oThis.approve_transaction_hash = res['result'] ;
      oThis.bindBeforeUnload(  );
      oThis.updateIconState( oThis.jAllowStakeAndMintMsgWrapper,  '.processing-state-icon');
      
      setTimeout( function () { //Delay so that confirm metamask pop-up is visible
        oThis.sendRequestStakeRequest();
      } , 500 )
      
    },
    
    
    onApproveError : function () {
      oThis.updateIconState( oThis.jAllowStakeAndMintMsgWrapper,  '.error-state-icon');
      oThis.jSignClientErrorBtnWrap.show();
    },
  
    sendRequestStakeRequest : function () {
      oThis.updateIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.pre-state-icon');
      oThis.jSignClientErrorBtnWrap.hide();
      oThis.convertToBrandedTokens( oThis.requestStake, oThis.onRequestStateError );
    },
  
    convertToBrandedTokens: function ( sucCallback ,  errCallback ) {
      
      var btToMint      = oThis.getBTtoMint() ,
          ostToStake    = PriceOracle.btToOst( btToMint ) ,
          ostToStakeWei = PriceOracle.toWei( ostToStake )
      ;
      
      var options = {
        method: 'eth_call',
        params: [
          {
            to: oThis.getBrandedTokenContractAddress(),
            data: oThis.getContractEncodedABI(oThis.getBrandedTokenContractAddress(), 'convertToBrandedTokens', [ostToStakeWei])
          }
        ]
      };
  
      oThis.metamask.sendAsync(options, function(err, result){
       
        if( err || ( result && result.error ) ){
          errCallback && errCallback( err );
        }else if( result && result.result ) {
          var btToMintWei = result.result ;
          sucCallback && sucCallback( ostToStakeWei, btToMintWei )
        }
  
        err && console.error(err);
        result && console.log(result);
        
      });
      
    },
    
    requestStake: function ( ostToStakeWei , btToMintWei ) {
      
      // Build params for requestStake
      var params = [
        ostToStakeWei,// OST wei as string
        btToMintWei,  // BT wei as string
        oThis.getGatewayComposerTxParams()['gateway_contract'],
        oThis.getGatewayComposerTxParams()['stake_and_mint_beneficiary'],
        oThis.getGatewayComposerTxParams()['gas_price'],
        oThis.getGatewayComposerTxParams()['gas_limit'],
        oThis.getGatewayComposerTxParams()['staker_gateway_nonce']
      ];
  
      // Create Encoded ABI using params
      var data = oThis.metamask.getContractEncodedABI(
        oThis.getGatewayComposerContractAddress(),
        'requestStake',  //method name
        params,
        oThis.getGatewayComposerABI()
      );
  
      // Create options ABI using data
      var options = {
        method: 'eth_sendTransaction',
        params: [
          {
            "from": oThis.getWalletAddress(),
            "to": oThis.getGatewayComposerContractAddress(),
            "data" : data,
            "gas": oThis.getGatewayComposerContractGas(),
            "gasPrice": oThis.getGasPrice()
          }
        ]
      };
  
      // If data then send transaction...
      if(data){
        oThis.metamask.sendAsync(options, function(err, result){
          
          if(  err || (result && result.error ) ){
            oThis.onRequestStateError( err );
          }else if(   result && result.result ){
            oThis.onRequestStateSuccess( result );
          }
          
          err && console.error(err);
          result && console.log(result);
          
        });
      }
      
    },
    
    onRequestStateSuccess: function ( res ) {
      oThis.request_stake_transaction_hash = res['result'] ;
      oThis.stake_address = oThis.getWalletAddress();
      oThis.updateIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.processing-state-icon');
      oThis.sendTransactionHashes();
    },
  
    onRequestStateError : function ( error ) {
      oThis.updateIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.error-state-icon');
      oThis.jSignClientErrorBtnWrap.show();
    },
  
    //This is not workflow dependent code, its just to make sure both transaction hash are send to backend
    sendTransactionHashes : function () {
      oThis.stakeAndMintPolling = new Polling({
        pollingApi      : oThis.mintApi ,
        pollingMethod   : "POST",
        data            : oThis.getConfirmStakeAndMintIntendData(),
        pollingInterval : 4000,
        onPollSuccess   : oThis.confirmStakeAndMintIntendSuccess.bind( oThis ),
        onPollError     : oThis.confirmStakeAndMintIntendError.bind( oThis )
      });
      oThis.stakeAndMintPolling.startPolling();
    },
  
    getConfirmStakeAndMintIntendData : function () {
      var btToMint = oThis.getBTtoMint() ,
          ostToStake = PriceOracle.btToOstPrecession( btToMint ) //As it goes to backend and comes back as is.
      ;
      return {
        'approve_transaction_hash'       : oThis.approve_transaction_hash,
        'request_stake_transaction_hash' : oThis.request_stake_transaction_hash,
        'staker_address' : oThis.stake_address,
        'fe_bt_to_mint' : btToMint ,      //JUST FOR FE
        'fe_ost_to_stake' : ostToStake    //JUST FOR FE
      }
    },
  
    confirmStakeAndMintIntendSuccess : function ( res ) {
      oThis.stakeAndMintPolling.stopPolling() ; //Stop immediately
      if( res && res.success ){
        oThis.unbindBeforeUnload();
        setTimeout( function () { //Wait for atleast 0.5sec so that user can see the processing icon
          window.location = oThis.redirectRoute ;
        } , 500 );
      }else {
        oThis.confirmStakeAndMintIntendErrorStateUpdate( res );
      }
    },
  
    confirmStakeAndMintIntendError : function (jqXhr ,  error ) {
      if( oThis.stakeAndMintPolling.isMaxRetries() ){
        oThis.stakeAndMintPolling.stopPolling() ;
        oThis.confirmStakeAndMintIntendErrorStateUpdate( error );
      }
    },
  
    confirmStakeAndMintIntendErrorStateUpdate : function ( res ) {
      oThis.jSignServerErrorBtnWrap.show();
      utilities.showGeneralError( oThis.jTokenStakeAndMintSignSection , res , oThis.stakeAndMintError );
    },
  
    updateIconState: function (jWrapper ,  sSelector  ) {
      if(!jWrapper) return ;
      jWrapper = jWrapper ;
      jWrapper.find('.state-icon').hide();
      jWrapper.find( sSelector ).show();
    },
  
    bindBeforeUnload : function( bindLoad ){
      $(window).on("beforeunload",function(event) {
        return "There are unsaved changes made to this page." ;
      });
    },
  
    unbindBeforeUnload : function () {
      $(window).off("beforeunload");
    },
  
    resetState : function () {
      oThis.updateIconState( $('.jMintMsgWrapper'),  '.pre-state-icon');
      oThis.jSignClientErrorBtnWrap.hide();
      oThis.jSignServerErrorBtnWrap.hide();
    }
    
  }

})(window,jQuery);