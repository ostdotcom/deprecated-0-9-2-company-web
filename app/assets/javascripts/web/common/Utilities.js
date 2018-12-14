;
(function (window , $) {
  var ost = ns('ost');

  var oThis = ost.utilities = {

    /*
     * Validate Re-Captcha within form
     *
     * jForm: Parent form's jQuery object
     * jError: jQuery object of error element
     * errorText: Error message to be displayed
     */
    validateCaptcha : function (jForm, jError, errorText) {
      if( jForm.find('.g-recaptcha')[0] !== undefined && typeof grecaptcha !== 'undefined'){

        if(  grecaptcha.getResponse() === '' ){
          $(jError)
            .text(errorText)
            .addClass("is-invalid");
          return false;
        }
        else {
          $(jError)
            .text('&nbsp;')
            .removeClass("is-invalid");
          return true;
        }
      }

    }
  }

})(window , jQuery);
