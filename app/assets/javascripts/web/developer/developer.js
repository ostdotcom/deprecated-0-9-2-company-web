;
(function (window, $) {
  var ost = ns("ost")
  ;

  var oThis = ost.developer = {

    jShowKeyBtn     : $('.show-keys-btn'),
    jGenerateKeyBtn : $('.generate-key-btn'),
    jDeleteKey      : $('.delete-key'),
    jKeysWrapper    : $('.keys-wrapper'),
    jMainContainer  : $('.developers-container'),
    jErrorEl        : $('.error'),
    keys            : null,


    init: function( config ){
      var oThis = this;
      config = config || {};

      $.extend( oThis, config );
      oThis.bindEvents();
    },

    bindEvents: function() {
      var oThis = this;
      oThis.jShowKeyBtn.on('click',function(){
        oThis.showKeys();
      });
      oThis.jMainContainer.on('click',oThis.jGenerateKeyBtn,function(){
        oThis.generateKeys();
      });

      oThis.jKeysWrapper.on('click',oThis.jDeleteKey,function(){
        oThis.deleteAPIKey();
      });

    },

    showKeys: function(){
      var oThis = this;
      $.ajax({
        url       : oThis.api_get_key,
        method    : 'GET',
        success   : function ( response ) {
          if( response.data ){
            oThis.keys = response.data.keys;
            oThis.onSuccess();
          }
        },
        error     : function ( err ) {
          oThis.onError( err );
        },
        complete  : function () {

        }
      });
    },

    generateKeys: function(){
      var oThis = this;
      $.ajax({
        url       : oThis.api_get_key,
        method    : 'POST',
        success   : function ( response ) {
          if( response.data ){
            oThis.keys = response.data.keys;
            oThis.onSuccess();
          }
        },
        error     : function ( err ) {
          oThis.onError( err );
        },
        complete  : function () {

        }
      });
    },

    deleteAPIKey: function(){
      var oThis = this;
      $.ajax({
        url       : oThis.api_delete_key,
        method    : 'POST',
        success   : function ( response ) {
          if( response.data ){
            oThis.keys = response.data.keys;
            oThis.onSuccess();
          }
        },
        error     : function ( err ) {
          oThis.onError( err );
        },
        complete  : function () {

        }
      });
    },

    onSuccess: function() {
      var oThis = this;
      if( ! oThis.keys) return;

      var length = oThis.keys.length;

      oThis.appendKeysInfoToDOM();
      if(length == 2){
        oThis.jShowKeyBtn.hide();
      } else if(length == 1){
        oThis.jShowKeyBtn.hide();
        oThis.jGenerateKeyBtn.show();
      }
    },

    onError( err ) {
      if( !err ) return;
      var errorJson = err['responseJSON'],
          error     = errorJson.err;
      oThis.jErrorEl.text( error.display_text );
    },

    appendKeysInfoToDOM: function(){
      var oThis = this,
          source   = document.getElementById("api-info").innerHTML,
          template = Handlebars.compile(source),
          context = {'keys': oThis.keys},
          html    = template(context);
      $('.keys-wrapper').empty();
      $('.keys-wrapper').append(html);
    }
  }

})(window, jQuery);