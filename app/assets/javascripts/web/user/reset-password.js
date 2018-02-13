;
(function (window) {

  var parentNS = ns("simpletoken.home")
      , utilsNs = ns("simpletoken.utils")
      , oThis
  ;

  parentNS.signup = oThis = {
    jForm: $('#rest_password_form')
    , init: function (config) {
      oThis.bindEventListeners();
      oThis.formHandler();
    }
    , bindEventListeners: function () {

    }
    , formHandler: function() {
      var formHelper = oThis.jForm.formHelper();
      formHelper.success = function(){
        oThis.jForm.hide();
        $('#resetEmailSent').show();
      };
    }

  };

  $(document).ready(function () {
    oThis.init();
  });

})(window);