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

  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);