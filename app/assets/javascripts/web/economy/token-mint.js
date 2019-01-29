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
    stakeAndMintError               :   "Sorry your transaction did not go through, Please connect with customer support with the 2 transaction hash.",
    //General error msg end

    init : function (config) {
      
      console.log("===config====" , config );
      
      $.extend(oThis,config);
      var workflowId = oThis.getWorkflowId() ,
          desiredAccounts = oThis.getWhitelistedAddress()
      ;
      
      if( !workflowId  ){ //Dont do needless init's
        oThis.initPriceOracle();
        oThis.initUIValues();
        oThis.bindActions();
      }
      
      oThis.setupMetamask( desiredAccounts );
      
    },
    
    initPriceOracle : function ( ) {
      PriceOracle.init({
        "ost_to_fiat" : oThis.getPricePoint() ,
        "ost_to_bt" : oThis.getOstToBTConversion()
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
          $('.jStatusWrapper').hide();
          $('.jGetOstLoaderText').show();
        },
        success: function ( res ) {
          if( res.success ){
            var workflowId = utilities.deepGet( res , "data.workflow.id") ;
            oThis.startGetOstPolling( workflowId );
          }
        },
        complete: function () {
          utilities.btnSubmittingState( oThis.jGetOstBtn );
        }
      });
    },
  
  
    startGetOstPolling: function ( workflowId ) {
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
        var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
          if( oThis.shouldStopPolling( currentWorkflow ) ){
            oThis.getOstPolling.stopPolling();
            window.location = "" //Self load
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
      utilities.btnSubmitCompleteState( oThis.jGetOstBtn );
      utilities.showGeneralError( oThis.jGetOstForm ,  res ,  oThis.getOstError  );
    },
    
    shouldStopPolling : function( currentWorkflow ){
      return currentWorkflow && currentWorkflow.percent_completion  >= 100 ;
    },

    bindActions : function () {
      oThis.jMintTokensBtn.off('click').on("click",function () {
        oThis.onMintToken();
      });

      oThis.jMintTokenContinueBtn.off('click').on("click",function () {
        oThis.jStakeAndMintConfirmModal.modal('show');
      });
      
      oThis.jGoBackBtn.off('click').on('click' , function () {
        oThis.showSection( oThis.jStakeMintProcess );
      });
      
      oThis.jClientRetryBtn.off('click').on('click' , function () {
        oThis.allowStakeAndMint();
      });
      
      oThis.jServerRetryBtn.off('click').on('click' , function () {
        oThis.confirmStakeAndMintIntend();
      });

    },

    onMintToken: function () {
      oThis.metamask.enable();
    },
    
    setupMetamask: function( desiredAccounts ){

      oThis.metamask = new Metamask({
        desiredNetwork: oThis.chainId,
        desiredAccount : desiredAccounts , //Handling of undefined is present in Metamask so not to worry.

        onNotDapp: function(){
          ost.coverElements.show("#installMetamaskCover");
        },

        onNotMetamask: function(){
          ost.coverElements.show("#installMetamaskCover");
        },

        onWaitingEnable: function(){
          ost.coverElements.show("#metamaskLockedCover");
        },

        onEnabled: function(){
          setTimeout(function(){
            ost.coverElements.hideAll();
          }, 500);
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
          oThis.onDesiredAccount();
        },

        onNewAccount: function(){
          oThis.onAccountValidation();
        }

      });

    },
    
    onAccountValidation : function () {
      var whitelisted = oThis.getWhitelistedAddress(),
          selectedAddress = oThis.getWalletAddress() || ""
      ;
      oThis.jSelectedAddress.setVal( selectedAddress );
      if( !whitelisted || whitelisted.indexOf( selectedAddress.toLowerCase() ) < 0 ){
        oThis.showSection( oThis.jAddressNotWhitelistedSection ) ;
      }
      else{
        oThis.checkForBal();
      }
    },

    checkForBal: function () {
      oThis.checkEthBal();
    },
  
    checkEthBal : function () {
      var walletAddress = oThis.getWalletAddress() ;
      oThis.metamask.getBalance( walletAddress  , function ( eth ) {
        var minOstRequire = oThis.getMinETHRequired();
        eth = eth && BigNumber( eth ) ;
        if( !eth ||  eth.isLessThan( minOstRequire ) ){
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
        var minOstRequire = oThis.getMinOstRequired();
        ost = ost && BigNumber( ost );
        if( !ost || ost.isLessThan( minOstRequire ) ){
          oThis.showSection(  oThis.jInsufficientBalSection ) ;
          $('buy-ost-btn').show();
        }else {
          oThis.onValidationComplete( ost );
        }
      } ) ;
    },
  
    onValidationComplete : function ( ost ) {
      var btToStake = oThis.jBtToMint.val();
      oThis.OstAvailable = PriceOracle.fromWei( ost );
      oThis.mintDonuteChart = new GoogleCharts();
      oThis.initSupplyPieChart( ost , btToStake );
      oThis.updateSlider( ost );
      oThis.showSection(  oThis.jStakeMintProcess ) ;
    },
    
    updateSlider : function ( ost ) {
      var maxBT = oThis.getMaxBTToMint( ost ),
          jSlider = oThis.jBtToMint.closest( '.form-group' ).find('#'+oThis.btToMintId+"_slider")
      ;
      jSlider.slider({"max" : maxBT }) ;
      $('.total-ost-available').text( PriceOracle.toPrecessionOst( ost ) );  //No mocker so set via precession
    },
    
    ostToStakeOnBtChange : function ( val ) {
      if( PriceOracle.isNaN( oThis.OstAvailable )) {
        return val ;
      }
      var btStake = PriceOracle.btToOst( val ) ,
          ostAvailable = BigNumber( oThis.OstAvailable ) ,
          result = ostAvailable.minus(  btStake )
      ;
      oThis.updateSupplyPieChart( ostAvailable.toString() ,  btStake ) ;
      return PriceOracle.toOst( result ) ; //Mocker will take care of precession
    },
  
    onDesiredAccount : function () {
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
    
    getSimpleTokenContractAddress : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.address" );
    },
    
    getWalletAddress : function () {
      return utilities.deepGet( oThis.metamask , "ethereum.selectedAddress" );
    },
  
    getMinETHRequired : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.min_eth_required" );
    },
    
    getMinOstRequired : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.min_ost_required" );
    },
    
    getPricePoint : function () {
      return utilities.deepGet( oThis.dataConfig , "price_points.OST.USD" ) ;
    },
    
    getOstToBTConversion : function () {
      return utilities.deepGet( oThis.dataConfig , "token.conversion_factor" ) ;
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

    getGatewayComposerDetails  : function () {
      return utilities.deepGet( oThis.dataConfig , "gatewayComposerDetails" ) ;
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
  
    updateSupplyPieChart: function ( ostAvailable , ostToStake ) {
      if( !oThis.mintDonuteChart ) return ;
      ostAvailable  = ostAvailable && Number( ostAvailable ) ;
      ostToStake    = ostToStake && Number(ostToStake) ;
      var data = [
        ['Type', 'Tokens'],
        ['OSTAvailable', ostAvailable],
        ['OSTStaked', ostToStake]
      ];
     oThis.mintDonuteChart.draw({
        data : data
      });
    },
    
    initSupplyPieChart: function( ostAvailable ,ostToStake  ){
      ostAvailable  = ostAvailable && Number( ostAvailable ) || 100 ;
      ostToStake    = ost && Number( ostToStake ) || 100 ;
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
        oThis.allowStakeAndMint();
    },
    
    allowStakeAndMint: function () {
      oThis.resetState();
      //TODO metamask flow
    },
    
    resetState : function () {
      oThis.updateConfirmStakeAndMintIconState( $('.jMintMsgWrapper'),  '.pre-state-icon');
      oThis.jSignClientErrorBtnWrap.hide();
      oThis.jSignServerErrorBtnWrap.hide();
    },
    
    onConfirmStakeAndMint: function () {
      oThis.approve_transaction_hash = "" ;  //TODO
      oThis.bindBeforeUnload(  );
      oThis.updateConfirmStakeAndMintIconState( oThis.jAllowStakeAndMintMsgWrapper,  '.processing-state-icon');
      oThis.authoriseStakingProcess();
    },
  
    bindBeforeUnload : function( bindLoad ){
      $(window).on("beforeunload",function(event) {
          return "There are unsaved changes made to this page." ;
      });
    },
    
    unbindBeforeUnload : function () {
      $(window).off("beforeunload");
    },
    
    onCancelStakeAndMint : function () {
      oThis.updateConfirmStakeAndMintIconState( oThis.jAllowStakeAndMintMsgWrapper,  '.error-state-icon');
      oThis.jSignClientErrorBtnWrap.show();
    },
  
    updateConfirmStakeAndMintIconState: function (jWrapper ,  sSelector  ) {
      if(!jWrapper) return ;
      jWrapper = jWrapper ;
      jWrapper.find('.state-icon').hide();
      jWrapper.find( sSelector ).show();
    },
    
    
    authoriseStakingProcess: function () {
      oThis.updateConfirmStakeAndMintIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.pre-state-icon');
      oThis.jSignClientErrorBtnWrap.hide();
      //TODO metamask flow
    },
    
    onConfirmAuthorizeStakeAndMint: function () {
      oThis.request_stake_transaction_hash = "" ;  //TODO
      oThis.updateConfirmStakeAndMintIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.processing-state-icon');
      oThis.confirmStakeAndMintIntend();
    },
  
    onCancelAuthorizeStakeAndMint : function () {
      oThis.updateConfirmStakeAndMintIconState( oThis.jAutorizeStakeAndMintMsgWrapper,  '.error-state-icon');
      oThis.jSignClientErrorBtnWrap.show();
    },
  
    confirmStakeAndMintIntend : function () {
      oThis.resetState();
      oThis.stakeAndMintPolling = new Polling({
        pollingApi      : oThis.mintApi ,
        data            : {
          'approve_transaction_hash'        : oThis.approve_transaction_hash,
          'request_stake_transaction_hash' : oThis.request_stake_transaction_hash
        },
        pollingInterval : 4000,
        onPollSuccess   : oThis.confirmStakeAndMintIntendSuccess.bind( oThis ),
        onPollError     : oThis.confirmStakeAndMintIntendError.bind( oThis )
      });
      oThis.stakeAndMintPolling.startPolling();
    },
  
    confirmStakeAndMintIntendSuccess : function ( res ) {
      oThis.stakeAndMintPolling.stopPolling() ; //Stop immediately
      if( res && res.success ){
        oThis.unbindBeforeUnload();
        window.location = oThis.redirectRoute ;
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
    }
    
    
    
  }

})(window,jQuery);