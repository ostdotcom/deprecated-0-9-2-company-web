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
      oThis.bindActions();
    },

    bindActions : function () {
      oThis.jMintTokensBtn.on("click",function () {
        oThis.onMintToken();
      });

      oThis.jMintTokenContinueBtn.on("click",function () {
        $("#stake-mint-confirm-modal").modal('show');
      });
    },

    onMintToken: function () {
      oThis.showSection(  oThis.jStakeMintProcess ) ;
      oThis.googleCharts_1 = new GoogleCharts();
      oThis.printSupplyChart();
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
          var whitelisted = utilities.deepGet( oThis.data , "origin_addresses.whitelisted"),
              selectedAddress = oThis.metamask.ethereum.selectedAddress
          ;
          $('#metamask_selected_address').setVal( selectedAddress );
          if( !whitelisted || !whitelisted.indexOf( selectedAddress ) > -1 ){
            //TODO uncomment  show once section is created
            // oThis.showSection( oThis.jAddressNotWhitelistedSection ) ;
          }
          else{
            oThis.checkForOstBal();
          }
        }

      });

    },


    checkForOstBal : function(){
      //TODO uncomment  show once section is created
      //oThis.showSection(  oThis.jInsufficientBalSection ) ;
    },

    showSection : function( jSection ){
      oThis.jMintSections.hide();
      jSection.show();
    },

    printSupplyChart: function(){
      oThis.googleCharts_1.draw({
        data: [
          ['Type', 'Tokens'],
          ['OST Available', 100],
          ['OST to be staked for minting tokens', 100]
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

  }

})(window,jQuery);