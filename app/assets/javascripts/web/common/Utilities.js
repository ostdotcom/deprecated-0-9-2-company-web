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
          $(jError).text(errorText);
          $(jError).addClass("is-invalid");

          return false;
        }
        else {
          $(jError)
            .text('&nbsp;')
            .removeClass("is-invalid");
          return true;
        }
      }

    } ,
  
    deepGet: function(data , path) {
    
      if(!data || !path ){
        return false;
      }
    
      var paths = path.split('.')
        , current = data
        , i
      ;
      for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
          return undefined;
        } else {
          current = current[paths[i]];
        }
      }
      return current;
    }
  }

})(window , jQuery);
