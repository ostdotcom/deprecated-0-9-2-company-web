;
(function (window) {

  var parentNS = ns("ost.user")
    , ost = ns("ost")
    , oThis
  ;

  parentNS.resetPassword = oThis = {
    jForm: null
    , formHelper : null
    , init: function (config) {
      oThis.jForm = $('#rest_password_form');
      oThis.bindEventListeners();
      oThis.formHandler();
    }
    , bindEventListeners: function () {
      var oThis = this;

      $('#recover-email-btn').on('click',function () {
        oThis.isCaptchaValid = ost.utilities.validateCaptcha(
          oThis.jForm,
          $('.recaptcha-submit-error'),
          "Please select the captcha"
        );
        if(!oThis.isCaptchaValid){
          event.preventDefault();
        }
      })


      oThis.jForm.formHelper({
        complete: function ( response ) {
          if (typeof grecaptcha != 'undefined') {
            grecaptcha.reset();
          }
        }
      });





    }
    , formHandler: function( response ) {
      var formHelper = oThis.jForm.formHelper();
      formHelper.success = function( response ) {
        if ( response && response.success ) {
          oThis.jForm.hide();
          $('#resetEmailSent').show();
        }
      };
    }

  };

  $(document).ready(function () {
    oThis.init();
  });

})(window);