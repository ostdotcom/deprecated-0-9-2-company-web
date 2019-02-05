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
      config = config || {};

      $.extend( oThis, config );
      oThis.bindEvents();
    },

    bindEvents: function() {

      oThis.jShowKeyBtn.on('click',function( e ){
        e.stopPropagation();
        oThis.showKeys();
      });

      oThis.jMainContainer.on('click',oThis.jGenerateKeyBtn,function( e ){
        e.stopPropagation();
        oThis.generateKeys();
      });

      oThis.jKeysWrapper.on('click',oThis.jDeleteKey,function( e ){
        e.stopPropagation();
        oThis.deleteAPIKey();
      });

    },

    showKeys: function(){
      $.ajax({
        url       : oThis.api_get_key,
        method    : 'GET',
        success   : function ( response ) {
          if( response.data ){
            oThis.keys = response.data['api_keys'];
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

      oThis.jGenerateKeyBtn.text("Generating new key...");
      oThis.jGenerateKeyBtn.attr('disabled',true);
      $.ajax({
        url       : oThis.api_get_key,
        method    : 'POST',
        success   : function ( response ) {
          if( response.data ){
            oThis.keys = response.data['api_keys'];
            oThis.onSuccess();
          }
        },
        error     : function ( err ) {
          oThis.onError( err );
        },
        complete  : function () {
          oThis.jGenerateKeyBtn.text("Generate new key");
          oThis.jGenerateKeyBtn.attr('disabled',false);
        }
      });
    },

    deleteAPIKey: function(){
      $.ajax({
        url       : oThis.api_delete_key,
        method    : 'POST',
        success   : function ( response ) {
          if( response.data ){
            oThis.keys = response.data['api_keys'];
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
      if( ! oThis.keys) return;

      var length = oThis.keys.length;

      oThis.appendKeysInfoToDOM();
      if(length == 2){
        oThis.jShowKeyBtn.hide();
        oThis.jGenerateKeyBtn.hide();
        oThis.jErrorEl.hide();
      } else if(length == 1){
        oThis.jShowKeyBtn.hide();
        oThis.jGenerateKeyBtn.show();
        oThis.jErrorEl.show();
      }
    },

    onError( err ) {
      if( !err ) return;
      var errorJson = err['responseJSON'],
          error     = errorJson.err;
      oThis.jErrorEl.show();
      oThis.jErrorEl.text( error.display_text );
    },

    appendKeysInfoToDOM: function(){
      var source   = document.getElementById("api-info").innerHTML,
          template = Handlebars.compile(source),
          context = {'keys': oThis.keys},
          html    = template(context);
      $('.keys-wrapper').empty();
      $('.keys-wrapper').append(html);
    }
  }

})(window, jQuery);