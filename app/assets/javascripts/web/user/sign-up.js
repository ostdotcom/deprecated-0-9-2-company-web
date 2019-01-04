;
(function (window) {

  var parentNS = ns("ost.user")
    , ost = ns("ost")
  ;

  parentNS.signup = oThis = {
    jForm: null
    , formHelper : null
    , init: function (config) {
      oThis.jForm = $('#sign_up_form');
      oThis.bindEventListeners();
    }
    , bindEventListeners: function () {
      $('#register-btn').on('click',function () {
        oThis.isCaptchaValid = ost.utilities.validateCaptcha(
          oThis.jForm,
          $('.recaptcha-submit-error'),
          "Please select the captcha"
        );

        if(!oThis.isCaptchaValid){
          event.preventDefault();
        }
      });

      oThis.jForm.length > 0 && oThis.jForm.formHelper({
        complete: function ( response ) {
          if (typeof grecaptcha != 'undefined') {
            grecaptcha.reset();
          }
        }
      });


    }

  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);