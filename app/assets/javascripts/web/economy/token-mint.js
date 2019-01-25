;
(function (window,$) {
  var ost = ns("ost") ,
     Progressbar = ns("ost.ProgressBar") ,
     Polling = ns("ost.Polling") ,
     utilities =  ns("ost.utilities")
;
  
  var oThis = ost.tokenMint = {

    jMintTokensBtn                  :  $("#mint-tokens"),
    jMintTokenContinueBtn           :  $("#token-mint-continue-btn"),
    jStakeMintStart                 :  $("#stake-mint-start"),
    jStakeMintProcess               :  $("#stake-mint-process"),
    jConfirmAccountCover            :  $('#metamaskConfirmAccount'),
    jMintSections                   :  $('.jMintSections'),
    jAddressNotWhitelistedSection   :  $('#jAddressNotWhitelistedSection') ,
    jInsufficientBalSection         :  $('#jInsufficientBalSection') ,
    genericErrorMessage             :  'Something went wrong!',
    metamask                        :  null,
    whitelisted                     :  null,
    contracts                       :  null,
    signMessage                     :  null,
    progressBar                     :  null,
    polling                         :  null,
    mintingStatusEndPoint           :  null,

    init : function (config) {
      $.extend(oThis,config);
      PriceOracle.init({
        "ost_to_fiat" : oThis.getPricePoint()
      });
      oThis.bindActions();
    },

    bindActions : function () {
      oThis.jMintTokensBtn.on("click",function () {
        oThis.onMintToken();
      });

      oThis.jMintTokenContinueBtn.on("click",function () {
        $("#stake-mint-confirm-modal").modal('show');
      });
      
      $('#bt_to_mint').on( 'change' , function () {
      
      });
    },

    onMintToken: function () {
      oThis.mintDonuteChart = new GoogleCharts();
      oThis.initSupplyPieChart();
      oThis.setupMetamask();
      oThis.metamask.enable();
    },
    
    setupMetamask: function(){

      oThis.metamask = new Metamask({
        desiredNetwork: oThis.chainId,

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
          ost.coverElements.show("#metamaskSignTransaction");
        },

        onNewAccount: function(){
          var whitelisted = utilities.deepGet( oThis.dataConfig , "origin_addresses.whitelisted"),
              selectedAddress = oThis.getWalletAddress()
          ;
          $('#metamask_selected_address').setVal( selectedAddress );
          if( !whitelisted || !whitelisted.indexOf( selectedAddress ) > -1 ){
             oThis.showSection( oThis.jAddressNotWhitelistedSection ) ;
          }
          else{
            oThis.checkForOstBal();
          }
  
          //TODO delete
          oThis.showSection( oThis.jStakeMintProcess ) ;
        }

      });

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
      }) ;
    },
  
    onValidationComplete : function () {
  
      oThis.showSection(  oThis.jStakeMintProcess ) ;
    },
  
    
    btToFiat : function (val) {
      return val ; //TODO
    },
  
    ostAvailableOnBtChange : function ( val ) {
      return val ; //TODO
    },
  
    ostToStakeOnBtChange : function ( val ) {
      oThis.updateSupplyPieChart();
      return val ; //TODO
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

    showSection : function( jSection ){
      oThis.jMintSections.hide();
      jSection.show();
    },
  
    updateSupplyPieChart: function ( data ) {
      oThis.mintDonuteChart && oThis.mintDonuteChart.draw({
        data : data
      });
    },
    
    initSupplyPieChart: function( data ){
      oThis.mintDonuteChart.draw({
        data: [
          ['Type', 'Tokens'],
          ['OSTAvailable', 200],
          ['OSTStaked', 100]
        ],
        //data : data,
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
    }
    
    
    
    //Start polling code

    //END polling code
  }

})(window,jQuery);