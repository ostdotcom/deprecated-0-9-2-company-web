;
(function (window , $ ) {

  var ostFormHelper = $('#form-resend-verification').formHelper({
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