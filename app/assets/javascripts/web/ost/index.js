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

      var errors = [];

      if (email == '') {
        errors.push('Email is Mandatory!');
      }

      if (errors.length > 0) {
        oThis.showError(errors.join(' '));
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

            oThis.showError(error_msg.join('. '));

          } else {

            oThis.resetError();
            $('#subscribe-form').hide();
            $('#subscribe-success').show();
          }

        },
        error: function (response) {
          oThis.showError('Something Went Wrong');
        },
        complete: function (response) {
          $("#subscribe-form-submit").prop('disabled', false);
        }

      });
    },



    showError: function (text) {
      $('#subscribe-form .error').html(text);
      $('#subscribe-form-email').addClass('red');
    },

    resetError: function () {
      $('#subscribe-form .error').html('');
      $('#subscribe-form-email').removeClass('red');
    }

  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);