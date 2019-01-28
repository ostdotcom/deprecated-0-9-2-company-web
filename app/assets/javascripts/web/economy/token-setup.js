;
(function (window, $) {

    var ost         = ns("ost"),
        formHelper  = window.FormHelper.prototype,
        redirectMap = window.redirectMap ,
        utilities   = ns('ost.utilities')
    ;

    var oThis = ost.tokenSetup = {

        jTokenForm            :  $('#economy-planner'),
        jConfirmAccountCover  :  $('#metamaskConfirmAccount'),
        genericErrorMessage   :  'Something went wrong!',
        metamask              :  null,
        walletAssociation     :  null ,

        init: function( config ){
            $.extend(oThis, config);
            oThis.bindActions();
            oThis.jTokenForm.formHelper().success = oThis.tokenSuccess;
            PriceOracle.init({
              'ost_to_fiat' : config['ost_to_fiat'],
              'P_FIAT': 5
            });
            oThis.initDisplayFiatValue() ;
            oThis.inputSpinner();
        },

        bindActions : function(){
          $("#advance-options-accordion").on('show.bs.collapse',function () {
              $(".slider-recommendation").hide();
              $(".header-recommendation").show();
          })
        },
  
        btToFiat  : function ( conversionFactor ) {
          if( !conversionFactor || !BigNumber) return conversionFactor;
          conversionFactor = BigNumber( conversionFactor );
          var fiatBN = BigNumber( oThis.ost_to_fiat ) ,
            oneBTToFiat = fiatBN.dividedBy(  conversionFactor )
          ;
          return PriceOracle.toFiat( oneBTToFiat );
        },
  
        initDisplayFiatValue : function () {
          var jEL = $('.j-bt-to-fiat-val'),
              jInputEl = $('#'+oThis.ostToBtId),
              val = jInputEl.val()
          ;
          jEL.data("ost-mock-element" , "#"+ oThis.ostToBtId );
          jEL.ostMocker();
          jEL.text(  PriceOracle.btToFiat( val ) );
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
                  
                    oThis.initConfirmFlow();
                    ost.coverElements.show("#metamaskConfirmAccount");
                }

            });

        },

        tokenSuccess: function( res ){
           if( res.success ){
             oThis.setupMetamask();
             oThis.metamask.enable();
           }
        },

        initConfirmFlow: function(){
            oThis.jConfirmAccountCover.find(".confirm-address").text(oThis.metamask.ethereum.selectedAddress);
            oThis.personalSign( oThis.walletAssociation );
        },

        personalSign: function( message ){
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
                      return oThis.showError( "Could not proceed as you denied message signature in MetaMask." );
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
                        oThis.startTokenDeployment();
                    } else {
                        var errorData = utilities.deepGet( response ,  "err.error_data") || [];
                        var errorMsg ;
                      if(errorData.length > 0 ){
                          errorMsg =  errorData[0].msg ;
                          oThis.showError( errorMsg );
                        } else {
                          errorMsg = utilities.deepGet( response ,  "err.display_text") ;
                          oThis.showError( errorMsg );
                        }
                    }
                },
                error: function (response) {
                    oThis.showError( )
                }
            });
        },
        startTokenDeployment : function(){
          $.ajax({
            url : oThis.deploymentEndpoint,
            method : 'POST',
            success: function (response) {
              oThis.jConfirmAccountCover.find(".btn-confirm").text("confirm Address").prop('disabled', false);
              if(response && response.success){
                var byScreenName = utilities.deepGet( response ,  "go_to.by_screen_name" );
                if(byScreenName){
                  window.location = redirectMap && redirectMap[byScreenName]
                }
                else{
                  window.location = oThis.deployRoute;
                }

              }
              else {

                var errorData = utilities.deepGet(response , "err.error_data");
                if(errorData.length > 0){
                  oThis.showError(errorData[0].msg);
                }
                else{
                  var errorMsg = utilities.deepGet(response, ".err.display_text") ;
                  oThis.showError(errorMsg);
                }

              }
            },
            error: function (response) {
              oThis.showError()

            }
          })
        },

        showError: function(message){
            if( !message ) {
              message = oThis.genericErrorMessage;
            }
            oThis.jConfirmAccountCover.find(".btn-confirm").text("Confirm Address").prop('disabled', false);
            oThis.jConfirmAccountCover.find('.default-state-wrapper').hide();
            oThis.jConfirmAccountCover.find(".error-state-wrapper").show();
            oThis.jConfirmAccountCover.find(".error-state-wrapper .display-header").text(message);
        },

        inputSpinner: function () {
          $('<div class="quantity-nav">' +
            '<div class="conversion-currency">BT</div>' +
            '<div class="quantity-button quantity-up">&#x25B2;</div>' +
            '<div class="quantity-button quantity-down">&#x25BC;</div>' +
            '</div>').insertAfter('.quantity input');
          $('.quantity').each(function() {
            var spinner = $(this),
              input = spinner.find('input[type="number"]'),
              btnUp = spinner.find('.quantity-up'),
              btnDown = spinner.find('.quantity-down'),
              min = input.attr('min'),
              max = input.attr('max'),
              step = 0.00001;

            btnUp.click(function() {
              var oldValue = parseFloat(input.val());
              if (oldValue >= max) {
                var newVal = oldValue;
              } else {
                var newVal = (oldValue + step).toFixed(5);
              }
              spinner.find("input").val(newVal);
              spinner.find("input").trigger("change");
            });

            btnDown.click(function() {
              var oldValue = parseFloat(input.val());
              if (oldValue <= min) {
                var newVal = oldValue;
              } else {
                var newVal = (oldValue - step).toFixed(5);
              }
              spinner.find("input").val(newVal);
              spinner.find("input").trigger("change");
            });

          });
        }

    };
    

})(window, jQuery);