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
    },

    btnSubmittingState : function ( jEl ) {
      var preText = jEl.text(),
          submittingText = jEl.data('submitting')
      ;
      jEl.data("pre-text", preText );
      jEl.text( submittingText );
      jEl.prop("disabled" ,  true );
    },

    btnSubmitCompleteState : function ( jEl ) {
      var preText =  jEl.data('pre-text');
      jEl.text( preText );
      jEl.prop("disabled" ,  false );
    }
  }

})(window , jQuery);
