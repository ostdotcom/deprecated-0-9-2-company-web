;
(function (window) {

  var parentNS = ns("ost.user")
    , ost = ns("ost")
  ;

  parentNS.signup = oThis = {
    jForm: null
    , isCaptchaValid : null

    , init: function (config) {
      oThis.jForm = $('#login_form');
      oThis.bindEventListeners();
    }
    , bindEventListeners: function () {

      $('#login_form').on('beforeSubmit',function (event) {
        if(!oThis.isCaptchaValid){
          event.preventDefault();
        }
      });

      $('#login-btn').on('click',function () {
          oThis.isCaptchaValid = ost.utilities.validateCaptcha(
            oThis.jForm,
            $('.recaptcha-login-error'),
            "Please select the captcha"
          );
      });
    }
  };
  $(document).ready(function () {
    oThis.init();
  });

})(window);
