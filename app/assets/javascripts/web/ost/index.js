;
(function (window) {

  var oSTNs = ns("ost"),
      oThis;

  oSTNs.index = oThis = {

    init: function (config) {
      oThis.bindButtonActions();
    },

    bindButtonActions: function () {

      $("#subscribe-form-submit").on("click", function (event) {
        event.preventDefault();
        oThis.onSubscribe();
      });

      $(".smooth-scroll").on('click', function (event) {
        if (this.hash !== "") {
          event.preventDefault();
          var hash = this.hash;
          $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 800);
        }
      });

    },

    onSubscribe: function () {
      var jsonpurl = $("#subscribe-form-submit").data('jsonp');
      var email = $("#subscribe-form-email").val();

      var errorLen = 0,
      pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


      if (email == '') {
        oThis.showError('Email is Mandatory!', '.error' );
        errorLen++;
      } else if (pattern.test(email) == false) {
        oThis.showError('Invalid email', '.error' );
        errorLen++;
      } else {
        $('#subscribe-form .error').html('');
      } 

      if (! $("input#subscribe_confirmation").is(":checked")){

        oThis.showError('please confirm checkbox', '.confirmation_error' );
        errorLen++;

      }else{
        $('#subscribe-form .confirmation_error').html('');
      }

      if (errorLen > 0) {
        return false;
      }

      oThis.resetError();
      $("#subscribe-form-submit").prop('disabled', true);

      $.ajax({

        url: jsonpurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {email: email},
        method: 'GET',
        success: function (responseJson) {
          if ((responseJson.error != undefined) && (responseJson.error != '')) {

            var error_msg = [];
            $.each(responseJson.error_message, function (errors_key, errors_value) {
              $.each(errors_value, function (index, value) {
                error_msg.push(value);
              });
            });

            oThis.showError(error_msg.join('. '), '.general_error');

          } else {

            oThis.resetError();
            $('#subscribe-form').hide();
            $('#subscribe-success').show();
          }

        },
        error: function (response, selector) {
          oThis.showError('Something Went Wrong', '.general_error');
        },
        complete: function (response) {
          $("#subscribe-form-submit").prop('disabled', false);
        }

      });
    },



    showError: function (text, selector) {
      $('#subscribe-form ' + selector).html(text);
      $('#subscribe-form-email').addClass('red');
    },

    resetError: function () {
      $('#subscribe-form .confirmation_error, #subscribe-form .error, #subscribe-form .general_error').html('');
      //$('#subscribe-form .error').html('');
      //$('#subscribe-form .general_error').html('');
      $('#subscribe-form-email').removeClass('red');
    }

  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);