;
(function (window) {

  var parentNS = ns("ost.user")
    , ost = ns("ost")
  ;

  parentNS.signup = oThis = {
    jForm: null
    , init: function (config) {
      oThis.jForm = $('#sign_up_form');
      oThis.bindEventListeners();
    }
    , bindEventListeners: function () {
      // user token to be removed start
      $("#user-token-symbol").keyup( function () {
        clearTimeout( oldTimeOut );
        var newSymbol = this.value;
        oldTimeOut = setTimeout( function () {
          oThis.updateSymbols( newSymbol );
        }, 200);
      });
      //user token to be removed end

      oThis.jForm.on('beforeSubmit',function (event) {
        if(!oThis.isCaptchaValid){
          event.preventDefault();
        }
      });

      $('#register-btn').on('click',function () {
        oThis.isCaptchaValid = ost.utilities.validateCaptcha(
          oThis.jForm,
          $('.recaptcha-submit-error'),
          "Please select the captcha"
        );
      });
    }
    , updateSymbols: function ( text ) {
      text = String( text ).toUpperCase();
      $(".token_icon").text( text );
    }
  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);