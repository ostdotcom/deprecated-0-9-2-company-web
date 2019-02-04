;
(function (window, $) {
  var ost = ns("ost")
  ;

  var oThis = ost.developer = {

    jShowKeyBtn : $('.show-keys-btn'),
    jKeysWrapper: $('.keys-wrapper'),
    keys: null,


    init: function(){
      var oThis = this;
      oThis.bindEvents();
    },

    bindEvents: function() {
      var oThis = this;
      oThis.jShowKeyBtn.on('click',function(){
        oThis.fetchKeys();
      });
    },

    fetchKeys: function(){
      var oThis = this,
          data = {};
      $.ajax({
        url       : '/',
        method    : 'GET',
        data      : data,
        success   : function ( response ) {
          if( response.data ){
            oThis.keys = response.data.keys;
            oThis.appendToDOM( oThis.jKeysWrapper, oThis.keys );
            oThis.jKeysWrapper.show();
          }

        },
        error     : function () {

        },
        complete  : function () {

        }
      });

      //TODO: temp for testing
      oThis.keys = [
        {
          'api_key' : 'guywguywgdgwui',
          'api_secret': 'hbhehgfgegfhj'
        },
        {
          'api_key' : 'guywguywgdgwui',
          'api_secret': 'hbhehgfgegfhj',
          'expiry': 'gwfy7678236782cvh'
        }
      ];
      oThis.appendToDOM( oThis.jKeysWrapper, oThis.keys );
      oThis.jKeysWrapper.show();
    },

    appendToDOM: function( jWrapper, keys ){
      var c = document.createDocumentFragment();

      if(!keys || !jWrapper) return;

      keys.forEach(function( item, index) {
        var divEl = document.createElement("div"),
            keyPEl  = document.createElement("p"),
            keyHEl  = document.createElement("h4"),
            secretPEl  = document.createElement("p"),
            secretHEl  = document.createElement("h4");
        keyHEl.innerText = 'API key';
        secretHEl.innerText = 'Secret';
        keyPEl.innerText = item.api_key;
        secretPEl.innerText =  item.api_secret;
        divEl.appendChild(keyHEl);
        divEl.appendChild(keyPEl);
        divEl.appendChild(secretHEl);
        divEl.appendChild(secretPEl);
        divEl.className = 'dev-container-box';
        c.appendChild(divEl);
      });
      jWrapper[0].append(c);
    }

  }

})(window, jQuery);