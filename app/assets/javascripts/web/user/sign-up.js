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
      var oThis = this;

      var oldTimeOut;
      $("#user-token-symbol").keyup( function () {
        clearTimeout( oldTimeOut );
        var newSymbol = this.value;
        oldTimeOut = setTimeout( function () {
          oThis.updateSymbols( newSymbol );
        }, 200);
      });
    }
    , updateSymbols: function ( text ) {
      text = String( text ).toUpperCase();
      $(".token_icon").text( text );
    }
  };

  $(document).ready(function () {
    oThis.init({i18n: {}});
  });

})(window);