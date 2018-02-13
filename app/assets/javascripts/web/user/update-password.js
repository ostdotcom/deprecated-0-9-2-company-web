;
(function (window) {

  var parentNS = ns("simpletoken.home")
      , utilsNs = ns("simpletoken.utils")
      , oThis
  ;

  parentNS.updatePassword = oThis = {
    jForm: null
    , init: function (config) {
      var oThis = this;

      oThis.jForm = $('#update_password_form');
      oThis.bindEventListeners();
      oThis.formHandler();
    }
    , bindEventListeners: function () {
      var oThis = this;

    }
    , formHandler: function() {
      var oThis = this;

      var formHelper = oThis.jForm.formHelper();
      formHelper.success = function( response ) {
        if ( response && response.success ) {
          oThis.jForm.hide();
          $('#password-updated-container').show();          
        }
      };
    }

  };

  $(document).ready(function () {
    oThis.init();
  });

})(window);