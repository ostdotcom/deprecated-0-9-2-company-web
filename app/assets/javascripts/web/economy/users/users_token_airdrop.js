;
(function (window , $) {
  var ost = ns('ost'),
    users = ns('ost.users')
  ;

  var oThis = users.airDropEditor  =  {
    allUserSimpleData : null,
    newUsersSimpleData : null,
    airDropTokenFormHelper : null,

    showEditor: function( config ) {
      var oThis =  this
      ;

      oThis.airdropEditor = $('#air-drop-tokens-eidtor');
      oThis.airdropEditor.scrollTop(0);
      ost.coverElements.show(oThis.airdropEditor);
      oThis.init( config )
    },

    init : function( config ){
      var oThis =  this,
        jUserType = $('[name=user_type]').val();
      ;
      oThis.initSimpleTableData(jUserType);
      oThis.bindEvents();
      if( !oThis.airDropTokenFormHelper ){
        oThis.airDropTokenFormHelper = $('#token-airdrop-form').formHelper(oThis.getFormHelperConfig());
      }
    },

    getFormHelperConfig : function () {
      var oThis =  this;
      var config = {
          success : function () { oThis.onTokenAirDropSuccess.apply(oThis, arguments)},
          beforeSend : function () {  $('#airdrop_token_modal').modal('show'); }
        };
      return config;
    },

    onTokenAirDropSuccess : function () {
      var oThis = this
      ;
    },

    bindEvents : function () {
      var oThis =  this
      ;

      $('[name=user_type]').change(function () {
        var jUserType = $(this).val(),
            jUserTypeInput = $('.users_list_type')
        ;
        jUserTypeInput.val(jUserType);
        oThis.initSimpleTableData(jUserType);
      });

      $('#air-drop-cancel-btn').on('click' , function () {
        ost.coverElements.hide(oThis.airdropEditor);
      });
    },

    initSimpleTableData : function ( jUserType ) {
      var oThis =  this,
          jWrapper = $('#users-list-container')
      ;

      jWrapper.removeClass();
      jWrapper.addClass(jUserType);
      if( jUserType == "all_users" && !oThis.allUserSimpleData ) {
        oThis.allUserSimpleData  =  new ost.SimpleDataTable({
          jParent : $('#all_users')
          , sScrollParent : "#all-users-list-content-wrapper"

        });
      }else if( !oThis.newUsersSimpleData ) {
        oThis.newUsersSimpleData = new ost.SimpleDataTable({
          jParent: $('#new_users') 
          , sScrollParent : "#new-users-list-content-wrapper"
          , params : {filter : 'newly_created'}
        });
      }
    }

  }

})(window , jQuery);