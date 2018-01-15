;
(function (window) {

  var homeNs = ns("simpletoken.home"),
    utilsNs = ns("simpletoken.utils"),
    oThis;

  homeNs.signup = oThis = {

    init: function (config) {
      oThis.bindButtonActions();
    },

    bindButtonActions: function () {

    },

  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);