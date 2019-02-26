(function(window, $){
  var ost = ns('ost');

  var oThis = ost.leftMenu = {

    isUserWhitelisted : false,
    isMainnetWhitelistingRequested : false,
    currentEnv : null,
    redirectMainnet : window.location.href,
    redirectSandbox : window.location.href,
    sandboxSubUrlPrefix: null,
    mainSubEnvUrlPrefix: null,
    jChangeModeToggle :  $('#switch_mode_checkbox'),

    jConfirmModeChangeModal : $('#confirm_mode_change_modal'),
    jConfirmModeChangeModalDefaultState : $('#confirm_mode_change_modal .default-state'),
    jConfirmModeChangeModalSuccessState : $('#confirm_mode_change_modal .success-state'),
    jConfirmModeChangeBtn : $('.confirm-mode-change-btn'),
    jConfirmModeChangeCheckbox : $('.confirm-mode-change-checkbox'),

    jWhitelistUserModal : $('#whitelist_user_modal'),
    jWhitelistUserCheckbox : $('#whitelist_user_checkbox'),
    jWhitelistUserModalDefaultState : $('#whitelist_user_modal .default-state'),
    jWhitelistUserModalSuccessState : $('#whitelist_user_modal .success-state'),

    init: function( config ){
      var oThis = this;
      config = config || {};

      $.extend( oThis, config );
      oThis.bindEvents();
      oThis.initWhitelistUserForm();
      oThis.initTooltip();
    },

    initWhitelistUserForm: function() {
      $("#whitelist_user_form").formHelper({
        success: function ( response ) {
          if ( response.success ) {
            oThis.onRequestWhitelistUserSuccess( response );
          }
        }
      });
    },

    initTooltip: function() {
      if(!oThis.isUserWhitelisted && oThis.isMainnetWhitelistingRequested)
      {
        $('[data-toggle="tooltip"]').tooltip();
      }
    },

    bindEvents : function() {
      var oThis = this;

      oThis.jChangeModeToggle.on('click', function( event ){
        event.preventDefault();
        if(oThis.currentEnv == oThis.sandboxSubUrlPrefix){
          if( !oThis.isUserWhitelisted ) {
            oThis.jWhitelistUserModal.modal('show');
          } else{
            oThis.jConfirmModeChangeModal.modal('show');
          }
        } else if(oThis.currentEnv == oThis.mainSubEnvUrlPrefix){
          oThis.jChangeModeToggle.prop('checked', true);
          window.location = oThis.redirectSandbox;
        }
      });

      oThis.jConfirmModeChangeBtn.on('click', function( event ) {
        oThis.jChangeModeToggle.prop('checked', false);
        oThis.jConfirmModeChangeModal.modal('hide');
        window.location = oThis.redirectMainnet;
      });

      // oThis.jWhitelistUserModal.on("show.bs.modal", function () {
      //   //reset the checkbox and clear errors
      //   oThis.jWhitelistUserCheckbox.prop('checked', false);
      //   $('.error').text('');
      // });

    },

    onRequestWhitelistUserSuccess: function(){
      $('.switch-mode').addClass('disabled');
      oThis.isMainnetWhitelistingRequested = true;
      oThis.jWhitelistUserModalDefaultState.hide();
      oThis.jWhitelistUserModalSuccessState.show();
    }

  };


  })(window, jQuery);