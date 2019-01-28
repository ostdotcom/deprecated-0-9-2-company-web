;
(function (window,$) {
  var ost = ns("ost") ,
     Progressbar = ns("ost.ProgressBar") ,
     Polling = ns("ost.Polling") ,
     utilities =  ns("ost.utilities")
;
  
  var oThis = ost.tokenMint = {

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
    jBtToMint                       :   null,
  
    confirmStakeMintFormHelper      :   null ,
    getOstFormHelper                :   null ,
  
    getOstPolling                   :   null,
    
    genericErrorMessage             :  'Something went wrong!',
    
    metamask                        :   null,
    
    polling                         :   null,

    init : function (config) {
      $.extend(oThis,config);
      var workflowId = oThis.getWorkflowId() ;
      
      if( !workflowId  ){ //Dont do needless init's
        oThis.initPriceOracle();
        oThis.initUIValues();
        oThis.bindActions();
      }else {
        var desiredAccount = oThis.getDesiredAccount();
      }
  
      oThis.setupMetamask( desiredAccount );
      
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
  
    onConfirmStakeMintSuccess : function ( res ) {
      //TODO
    },
    
    initGetOstFormHelper: function () {
      oThis.getOstFormHelper = oThis.jGetOstForm.formHelper({
        beforeSend : function () {
          $('.jStatusWrapper').hide();
          $('.jGetOstLoaderText').show();
        },
        success: function ( res ) {
          if( res.success ){
            oThis.onGetOstInitSuccess( res );
          }
        },
        complete: function () {
          utilities.btnSubmittingState( $('#get-ost-btn') );
        }
      });
    },
  
  
    onGetOstInitSuccess: function ( res ) {
      var workflowId = utilities.deepGet( res , "data.workflow.id") ;
      oThis.getOstPolling = new Polling({
      
      })
    },
    
    onGetOstSuccess : function ( res ) {
    
    },

    bindActions : function () {
      oThis.jMintTokensBtn.off('click').on("click",function () {
        oThis.onMintToken();
      });

      oThis.jMintTokenContinueBtn.off('click').on("click",function () {
        $("#stake-mint-confirm-modal").modal('show');
      });

    },

    onMintToken: function () {
      oThis.metamask.enable();
    },
    
    setupMetamask: function( desiredAccount ){

      oThis.metamask = new Metamask({
        desiredNetwork: oThis.chainId,
        desiredAccount : desiredAccount , //Handling of undefined is present in Metamask so not to worry.

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
          oThis.onAccountValidation()
        }

      });

    },
    
    onAccountValidation : function () {
      var whitelisted = oThis.getWhitelistedAddress(),
          selectedAddress = oThis.getWalletAddress()
      ;
      oThis.jSelectedAddress.setVal( selectedAddress );
      if( !whitelisted || !whitelisted.indexOf( selectedAddress ) > -1 ){
        oThis.showSection( oThis.jAddressNotWhitelistedSection ) ;
      }
      else{
        oThis.checkForOstBal();
      }
  
      //TODO delete
      oThis.showSection( oThis.jStakeMintProcess ) ;
    },

    checkForOstBal : function(){
      var walletAddress = oThis.getWalletAddress() ,
          simpleTokenContractAddress  =   oThis.getSimpleTokenContractAddress()
      ;
      oThis.metamask.balanceOf( walletAddress , simpleTokenContractAddress , function ( ost ) {
        var minOstRequire = oThis.getMinOstRequired();
        if( ost < minOstRequire ){
          oThis.showSection(  oThis.jInsufficientBalSection ) ;
        }else {
          oThis.onValidationComplete( ost );
        }
      } , "ether" ) ;
    },
  
    onValidationComplete : function ( ost ) {
      var btToStake = oThis.jBtToMint.val();
      oThis.OstAvailable = ost;
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
        //I dont know what to do
      }
    },
  
    onWorkFlow : function ( workflowId ) {
    
    },
    
    getSimpleTokenContractAddress : function () {
      return utilities.deepGet( oThis.dataConfig , "contract_details.address" );
    },
    
    getWalletAddress : function () {
      return utilities.deepGet( oThis.metamask , "ethereum.selectedAddress" );
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
      return utilities.deepGet( oThis.dataConfig , "origin_addresses.whitelisted") ;
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

    //Start polling code

    getOst: function () {
      oThis.polling = new Polling({
        pollingApi      : oThis.getOstEndPoint,
        pollingInterval : 4000,
        onPollSuccess   : oThis.onPollingSuccess.bind( oThis ),
        onPollError     : oThis.onPollingError.bind( oThis )
      });
      oThis.polling.startPolling();
    },

    onPollingSuccess: function( res ){

    },
  
    onPollingError : function () {
    
    }

    //END polling code
  }

})(window,jQuery);