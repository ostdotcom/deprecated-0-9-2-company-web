;
(function (window, $) {
  var ost = ns('ost'),
    users = ns('ost.users')
  ;

  var oThis = users.airDropEditor = {
    allUserSimpleData: null,
    newUsersSimpleData: null,
    airDropTokenFormHelper: null,

    showEditor: function (config) {
      var oThis = this
      ;

      oThis.airdropEditor = $('#air-drop-tokens-eidtor');
      oThis.airdropEditor.scrollTop(0);
      ost.coverElements.show(oThis.airdropEditor);
      oThis.init(config)
    }

    , getSelectedUserType: function () {
      var oThis = this
        , jUserType   = $('.j-user-type:checked')
      ;

      if ( !jUserType.length ) {
        return "all_users";
      }

      return jUserType.data("userType") || "all_users";
    }
    , isInitDone: false
    , init: function (config) {
      var oThis = this;

      if ( oThis.isInitDone ) {
        return;
      }

      userType = oThis.getSelectedUserType();
      oThis.initSimpleTableData(userType);
      oThis.bindEvents();
      if (!oThis.airDropTokenFormHelper) {
        oThis.airDropTokenFormHelper = $('#token-airdrop-form').formHelper(oThis.getFormHelperConfig());
      }
      oThis.isInitDone = true; 
    },

    getFormHelperConfig: function () {
      var oThis = this;
      var config = {
        beforeSend: function () {
          oThis.beforeAirDrop.apply(oThis, arguments)
        },
        success: function () {
          oThis.onTokenAirDropSuccess.apply(oThis, arguments)
        }
      };
      return config;
    },

    beforeAirDrop: function () {
      var oThis = this,
        jModal = $('#airdrop_token_modal')
      ;
      jModal.modal('show');
    },

    onTokenAirDropSuccess: function ( response ) {
      var oThis = this;

      if ( !response.success ) {
        return;
      }

      var data = response.data || {}
        , pending_critical_interactions = data.pending_critical_interactions || {}
        , airdrop_users   = pending_critical_interactions.airdrop_users || false
      ;

      console.log("onTokenAirDropSuccess :: data", data);
      if ( airdrop_users ) {
        airdrop_users = String( airdrop_users );
        var txModal = new ost.TSM.AirdropTxStatusModal( airdrop_users )
        txModal && txModal.show();
      }
      // 
    },

    bindEvents: function () {
      var oThis = this;

      $('.j-user-type').change(function () {

        var userType = oThis.getSelectedUserType()
          , jUserTypeInput = $('.users_list_type')
        ;
        jUserTypeInput.val( userType );
        oThis.initSimpleTableData(userType );
      });

      $('#air-drop-cancel-btn').on('click', function () {
        ost.coverElements.hide(oThis.airdropEditor);
      });

    },

    initSimpleTableData: function ( userType ) {
      var oThis = this,
        jWrapper = $('#users-list-container')
      ;

      jWrapper.removeClass();
      jWrapper.addClass( userType );
      if (userType == "all_users" && !oThis.allUserSimpleData) {
        oThis.allUserSimpleData = new ost.SimpleDataTable({
          jParent: $('#all_users')
          , sScrollParent: "#all-users-list-content-wrapper"
        });
      } else if ( !oThis.newUsersSimpleData ) {
        oThis.newUsersSimpleData = new ost.SimpleDataTable({
          jParent: $('#new_users')
          , sScrollParent: "#new-users-list-content-wrapper"
        });
      }
    }

  }

})(window, jQuery);