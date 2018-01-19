;
(function(window, $){
  //Add CSRF TOKEN
  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    var csrf_token = $("meta[name='csrf-token']").attr("content");
    jqXHR.setRequestHeader('X-CSRF-Token', append_csrf_token());
  });

  //
  $( window.document ).ajaxError( function( event, jqXHR, settings ) { 
    var jParent = (jqXHR.ost && jqXHR.ost.jParent ) ? jqXHR.ost.jParent : $("body")
        , msg   = ''
    ;
    if (jqXHR.status === 0) {
      msg = 'Not able to connect to server. Please verify your internet connection.';
    } else if (jqXHR.status == 404) {
      msg = 'Requested page not found.';
    } else if (jqXHR.status == 500) {
      msg = 'Internal Server Error.';
    } else if (jqXHR.status == 401) {
        window.location = '/login';
    } else if (exception === 'parsererror') {
      msg = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
      msg = 'Time out error.';
    } else if (exception === 'abort') {
      msg = 'Ajax request aborted.';
    } else {
      msg = 'Unable to connect to server.';
    }

    jParent.find('.error[data-for="general_error"]').text(msg);
    return msg;
  });

})(window, jQuery);