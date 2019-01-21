;
(function (window,$) {
  var ost = ns("ost") ,
     token_mint = ns("ost.token_mint") ,
     utilities =  ns("ost.utilities")
;
  
  var oThis = ost.token_mint = {

    jMintTokensBtn                  :  $("#mint-tokens"),
    jStakeMintScreen1               :  $("#stake-mint-1"),
    jStakeMintScreen2               :  $("#stake-mint-2"),
    jConfirmAccountCover            :  $('#metamaskConfirmAccount'),
    genericErrorMessage             :  'Something went wrong!',
    personalSignCancelErrorMessage  :  'Could not proceed as you denied message signature in MetaMask.',
    metamask                        :  null,
    whitelisted                     :  null,
    contracts                       :  null,
    signMessage                     :  null,

    init : function (config) {
      $.extend(oThis,config);
      oThis.setupMetamask();
      oThis.bindActions();
      oThis.googleCharts_1 = new GoogleCharts();
      oThis.printSupplyChart();
    },

    bindActions : function () {
      oThis.jMintTokensBtn.on("click",function () {
        oThis.onMintToken();
      });
    },

    onMintToken: function () {
      oThis.jStakeMintScreen1.hide();
      oThis.jStakeMintScreen2.show();
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
              selectedAddress = oThis.metamask.ethereum.selectedAddress ;
          if( !whitelisted || !whitelisted.indexOf( selectedAddress ) > -1 ){

            //TODO this needs to be fixed...
            //setTimeout(function(){
              //ost.coverElements.hideAll();
              oThis.jStakeMintScreen1.hide();
              oThis.jStakeMintScreen2.show();
            //}, 500);
          }
          else{
            oThis.initConfirmFlow();
            ost.coverElements.show("#metamaskConfirmAccount");
          }
        }

      });

    },

    initConfirmFlow: function(){
      var signMessage = utilities.deepGet( oThis.data ,  "sign_messages.wallet_association" ) ;
      oThis.jConfirmAccountCover.find(".confirm-address").text(oThis.metamask.ethereum.selectedAddress);
      oThis.personalSign( signMessage );
    },

    personalSign: function(message){

      if(!message) return;
      oThis.jConfirmAccountCover.find(".error-state-wrapper").hide();
      oThis.jConfirmAccountCover.find('.default-state-wrapper').show();
      var from = oThis.metamask.ethereum.selectedAddress;

      oThis.jConfirmAccountCover.find(".btn-confirm").off('click').on('click', function(e){
        oThis.metamask.sendAsync({
          method: 'personal_sign',
          params: [message, from],
          from: from
        }, function(err, result){
          if(err){
            return oThis.showError(err);
          }
          if(result && result.error){
            return oThis.showError(oThis.personalSignCancelErrorMessage);
          } else {
            oThis.associateAddress(result);

          }
        });
      });

    },

    associateAddress: function(result){

      $('.btn-confirm').text("confirming...").prop("disabled",true);

      if(!result) return;
      oThis.jConfirmAccountCover.find(".error-state-wrapper").hide();
      oThis.jConfirmAccountCover.find('.default-state-wrapper').show();
      var from = oThis.metamask.ethereum.selectedAddress;

      $.ajax({
        url: oThis.addressesEndPoint,
        method: 'POST',
        data: {
          owner: from,
          personal_sign: result.result
        },
        success: function(response){
          if(response.success){
            console.log(response);
            oThis.jConfirmAccountCover.find(".btn-confirm").text("confirm Address").prop('disabled', false);
            window.location = oThis.redirectRoute;

            // sign transaction logic
          } else { //TODO revisit
            if(response.err && response.err.error_data && response.err.error_data.length > 0){
              oThis.showError(response.err.error_data[0].msg);
            }
            else {
              oThis.showError(response.err.display_text);
            }
          }
        },
        error: function (response) {
          oThis.showError()
        }
      });
    },

    showError: function(message){
      if(typeof message === 'undefined') {
        message = oThis.genericErrorMessage;
      }
      oThis.jConfirmAccountCover.find(".btn-confirm").text("confirm Address").prop('disabled', false);
      oThis.jConfirmAccountCover.find('.default-state-wrapper').hide();
      oThis.jConfirmAccountCover.find(".error-state-wrapper").show();
      $(".error-state-wrapper").find(".display-header").text(message);
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
    }

  }

})(window,jQuery);