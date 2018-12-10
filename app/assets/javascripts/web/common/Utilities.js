;
(function (window , $) {
  var ost = ns('ost');

  var oThis = ost.utilities = {
    captchaFailureMsg : "please select the captcha"

    ,validateCaptcha : function (jForm) {
      if( jForm.find('.g-recaptcha')[0] != undefined && grecaptcha != undefined){

        if(  grecaptcha.getResponse() == '' ||  grecaptcha == undefined){
          console.log("from utilities",grecaptcha.getResponse());
          $('.recaptcha-login-error').text(oThis.captchaFailureMsg);
          return false;
        }
        else{
          return true;
        }
      }

    }
  }

})(window , jQuery);
