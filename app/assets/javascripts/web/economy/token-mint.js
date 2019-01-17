;
(function (window,$) {
  var ost = ns("ost");
  var token_mint = ns("ost.token_mint");

  var oThis = ost.token_mint = {

    jMintTokensBtn    :  $("#mint-tokens"),
    jStakeMintScreen1 :  $(".stake-mint-1"),
    jStakeMintScreen2 :  $(".stake-mint-2"),
    jConfirmAccountCover :  $('#metamaskConfirmAccount'),
    whitelisted :null,


    init : function (config) {
      $.extend(oThis,config);
      oThis.bindActions();
    },

    bindActions : function () {
      oThis.jMintTokensBtn.on("click",function () {
        oThis.onMintToken();
      });
    },

    onMintToken: function () {
      oThis.jMintTokensBtn.text("processing").prop("disabled",true);
      $.ajax({
        url : oThis.getAddressesEndpoint,
        success: function (response) {
          if(response && response.success){
            console.log("successs of getAddressesEndpoint",response);
            oThis.jMintTokensBtn.text("mint tokens").prop("disabled",false);
            oThis.setupMetamask();
            oThis.whitelisted = response.data.origin_addresses.whitelisted;
            oThis.metamask.enable();

          }
          else {
            console.log("api call successful but returned false");
            oThis.jMintTokensBtn.text("mint tokens").prop("disabled",false);
          }

        },
        error : function (reponse) {
          console.log("api call was not successful");

        }

      });
    },
    setupMetamask: function(){

      oThis.metamask = new Metamask({
        desiredNetwork: '3',

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
          ost.coverElements.show("#metamaskSignTransaction");
        },

        onNewAccount: function(){
          if( oThis.whitelisted.indexOf(oThis.metamask.ethereum.selectedAddress) > -1 ){
            // this needs to be fixed...
            setTimeout(function(){
              ost.coverElements.hideAll();
              oThis.jStakeMintScreen1.hide();
              oThis.jStakeMintScreen2.show();
            }, 500);
          }
          else{
            oThis.initConfirmFlow();
            ost.coverElements.show("#metamaskConfirmAccount");
          }
        }

      });

    },

    initConfirmFlow: function(){
      oThis.jConfirmAccountCover.find(".confirm-address").text(oThis.metamask.ethereum.selectedAddress);

      $.ajax({
        url: oThis.signMessagesEndPoint,
        success: function(response){
          if(response.success){
            oThis.personalSign(response.data.wallet_association);
          } else {
            oThis.showError();
          }
        },
        error: function(response){
          oThis.showError();
        }

      });
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
            window.location = "/testnet/token/mint";

            // sign transaction logic
          } else {
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
    }
  }

})(window,jQuery);