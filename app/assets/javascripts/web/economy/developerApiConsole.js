;
(function (window, $) {
  var ost     = ns("ost")
    , oThis
  ;

  var developerApi = oThis = ost.developerApi = {
    idForm              : "fetch-api-details-form"
    , idFetchDetailsBtn : "fetch-api-details-btn"
    , idApiDetails      : "api-details-wrap"
    , idApiKey          : "api-key-text"
    , idApiSecret       : "api-secret-text"

    , jForm             : null
    , jFetchDetailsBtn  : null
    , jApiDetails       : null
    , jApiKey           : null
    , jApiSecret        : null

    , formHelper        : null

    , init: function ( config ) {
      var oThis = this;

      $.extend( oThis, config );

      oThis.jForm             = oThis.jForm             || $( "#" + oThis.idForm )
      oThis.jFetchDetailsBtn  = oThis.jFetchDetailsBtn  || $( "#" + oThis.idFetchDetailsBtn );
      oThis.jApiDetails       = oThis.jApiDetails       || $( "#" + oThis.idApiDetails );
      oThis.jApiKey           = oThis.jApiKey           || $( "#" + oThis.idApiKey );
      oThis.jApiSecret        = oThis.jApiSecret        || $( "#" + oThis.idApiSecret );

      oThis.formHelper = oThis.jForm.formHelper();

      oThis.bindEvents();
    }
    , bindEvents: function () {
      var oThis = this;

      oThis.formHelper.success = function ( response ) {
        oThis.fetchApiDetailsSuccess.apply(oThis, arguments);
      };
    }
    , fetchApiDetailsSuccess: function ( response ) {
      var oThis = this;

      console.log("response", response);
      if (!response.success ) {
        return;
      }

      var data = response.data || {}
        , api_credentials = data.api_credentials || {}
        , api_key = api_credentials.api_key || ""
        , api_secret = api_credentials.api_secret || ""
      ;

      oThis.jApiKey.html( api_key );
      oThis.jApiSecret.html( api_secret );

      oThis.jApiDetails.slideDown();
      oThis.jFetchDetailsBtn.fadeOut();

    }

  };

})(window, jQuery);