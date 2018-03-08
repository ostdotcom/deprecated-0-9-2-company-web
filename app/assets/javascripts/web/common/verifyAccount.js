;
(function (window , $ ) {

  var jForm = $('#form-resend-verification') ;
  if( !jForm ||  jForm.length == 0) return ;
  var ostFormHelper = jForm.formHelper({
    success : function ( response ) {
      if( response.success ){
        setTimeout( function () {
          var jEl = $('#verify-email-header'),
              successMessage =  jEl.data('success-text');
          jEl.text(successMessage);
        } , 300);
      }
    }
  });


})(window ,  jQuery);