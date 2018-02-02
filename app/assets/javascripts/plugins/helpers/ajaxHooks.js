;
(function(window, $){
  
  // //Add CSRF TOKEN
  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    var csrf_token = $("meta[name='csrf-token']").attr("content");
    if ( csrf_token ) {
      jqXHR.setRequestHeader('X-CSRF-Token', csrf_token);  
    }
  });

  
  $( window.document ).ajaxError( function( event, jqXHR, settings, thrownError ) { 
    
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
    } else if (thrownError === 'parsererror') {
      msg = 'Requested JSON parse failed.';
    } else if (thrownError === 'timeout') {
      msg = 'Time out error.';
    } else if (thrownError === 'abort') {
      msg = 'Ajax request aborted.';
    } else {
      msg = 'Unable to connect to server.';
    }

    console.log("ajaxError", arguments, msg);
    if ( msg ) {
      jParent
        .find(".general_error")
        .addClass("is-invalid")
          .text(msg)
      ;      
    } else {
      jParent
        .find('.general_error')
        .removeClass("is-invalid")
          .text(msg || "&nbsp;")
      ;
    }

    return msg;
  });
})(window, jQuery);