;
(function (window) {

  var parentNS = ns("simpletoken.home")
      , utilsNs = ns("simpletoken.utils")
      , oThis
  ;

  parentNS.signup = oThis = {
    jForm: null
    , init: function (config) {
      oThis.bindEventListeners();
    }
    , bindEventListeners: function () {

    }


    

  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);