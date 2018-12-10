;
(function (window) {

  var parentNS = ns("ost.user"),
      ost = ns("ost")
    , oThis
  ;

  parentNS.signup = oThis = {
    jForm: null,
    isCaptchaValid : null,
    jForm : $('#login_form')
    , init: function (config) {

      oThis.bindEventListeners();
    }
    , bindEventListeners: function () {
      var oThis = this;
      $('#login_form').on('beforeSubmit',function (event) {
        if(!oThis.isCaptchaValid){
          event.preventDefault();
        }
      })

      $('#login-btn').on('click',function () {
          oThis.isCaptchaValid = ost.utilities.validateCaptcha(oThis.jForm);
      })
    }
  };
  $(document).ready(function () {
    oThis.init();
  });

})(window);
