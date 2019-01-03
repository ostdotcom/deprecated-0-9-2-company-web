;
(function (window, $) {
  var ost = ns("ost") ,
    EventNameSpacing = ost.EventNameSpacing
  ;

  var oThis = ost.team = {
    simpleDataTable: null,
    jParent: $('#team_list'),
    jInviteMemberForm: $('#invite_new_member_form'),
    inviteMemberFormHelper: null,
    sSelectPicker: 'select.selectpicker',
    userID : null ,
    
    jInviteUserCover  : $('#invite_new_member'),
    
    jSuccessModal     : $('#successModal'),
    jErrorModal       : $('#errorModal'),
    jDeleteUserModal  : $('#deleteUserModal'),
    jAssignRoleModal  : $('#assignAdminModal'),
    jUnAssignRoleModal: $('#unassignAdminModal'),
    jResetMfaModal    : $('#resetMfa'),
    
    jDeleteUserBtn  :  $(".delete-user-btn"),
    jAssignRoleBtn  :  $(".assign-admin-btn"),
    jUnAssignRoleBtn: $(".unassign-admin-btn"),
    jResetMfaBtn    : $(".reset-mfa-btn"),

    jDeleteUserForm  :  $("#delete_user_form"),
    jAssignRoleForm  :  $("#assign_user_form"),
    jUnAssignRoleForm: $("#unassign_user_form"),
    jResetMfaForm    : $("#reset_mfa_form"),

    deleteUserFormHelper  :  null,
    assignRoleFormHelper  :  null,
    unAssignRoleFormHelper: null,
    resetMfaFormHelper   : null,

    jUserID: $('.user-id'),
    jIsSuperAdmin: $('.isSuperAdmin'),

    jCurrentModal: null,

    init : function () {
      
      var datatableConfig={
        jParent:oThis.jParent,
        resultFetcherCallback : function ( results ) {
          oThis.initSelectPicker();
          oThis.bindSelectPickerEvents();
        },
        resultFetcher: function (currentData, lastMeta, callback) {
        
          var wrapperCallBack = function (response) {
            response = oThis.dataFormator(response);
            callback && callback.apply(null, arguments);
          };
        
          var fetcherScope = this,
            fetcher = ost.SimpleDataTable.prototype.resultFetcher,
            args = Array.prototype.slice.call(arguments)
          ;
        
          args.pop();
          args.push(wrapperCallBack);
          fetcher.apply(fetcherScope, args);
        }
      };
      
      oThis.eventNameSpace  = new EventNameSpacing("userManagement");
      oThis.simpleDataTable = new ost.SimpleDataTable(datatableConfig);
      oThis.bindEvents();
      oThis.initForms();
    },
  
    bindEvents: function () {
      
      $("#invite_new_member_btn").off( oThis.eventNameSpace.nameSpacedEvents('click') )
        .on(  oThis.eventNameSpace.nameSpacedEvents('click') , function () {
        ost.coverElements.show( oThis.jInviteUserCover );
      });
      $("#invite_new_member_cancel_btn").off( oThis.eventNameSpace.nameSpacedEvents('click') )
        .on( oThis.eventNameSpace.nameSpacedEvents('click') , function () {
        ost.coverElements.hide( oThis.jInviteUserCover );
      });
      $('.modal').off(  oThis.eventNameSpace.nameSpacedEvents( 'hidden.bs.modal' )  )
        .on( oThis.eventNameSpace.nameSpacedEvents( 'hidden.bs.modal' )  , function () {
        oThis.userID = null ;
      });
      
    },
  
    initSelectPicker : function () {
      $(oThis.sSelectPicker).selectpicker();
    },
  
    initForms: function () {
      oThis.inviteMemberFormHelper = oThis.jInviteMemberForm.formHelper({
        success: function (response) {
          if( response.success ){
            oThis.onInviteUserSuccess(response);
          }
        }
      });

      oThis.resetMfaFormHelper = oThis.jResetMfaForm.formHelper({
        success: function (response) {
          if( response.success ){
            oThis.onUserUpdateSuccess(response);
          }
        }
      });

      oThis.assignRoleFormHelper = oThis.jAssignRoleForm.formHelper({
        success: function (response) {
          if( response.success ){
            oThis.onUserUpdateSuccess(response);
          }
        }
      });
      oThis.unAssignRoleFormHelper = oThis.jUnAssignRoleForm.formHelper({
        success: function (response) {
          if( response.success ){
            oThis.onUserUpdateSuccess(response);
          }
        }
      });
      oThis.deleteUserFormHelper = oThis.jDeleteUserForm.formHelper({
        success: function (response) {
          if( response.success ){
            oThis.onDeleteUserSuccess(response);
          }
        }
      });

    },
    
    bindSelectPickerEvents:function() {
      $(oThis.sSelectPicker).off( oThis.eventNameSpace.nameSpacedEvents('change') )
        .on(oThis.eventNameSpace.nameSpacedEvents('change'), function (e) {
        var val = $(this).val()  ,
            parent = $(this).closest('.ost-table-row') ,
            userID = parent.data('user-id')
        ;
        oThis.hideModal();
        oThis.userID = userID ;
        switch(  val ) {
          case "delete":
            oThis.jCurrentModal = oThis.jDeleteUserModal;
            break;
          case "assign":
            oThis.jCurrentModal = oThis.jAssignRoleModal;
            oThis.setUserIDAdminRole(1);
            break;
          case "un-assign":
            oThis.jCurrentModal = oThis.jUnAssignRoleModal;
            oThis.setUserIDAdminRole( );
            break;
          case "reset-mfa":
            oThis.jCurrentModal = oThis.jResetMfaModal;
            break;
        }
        oThis.setUserID();
        oThis.resetSelectPicker();
        oThis.showModal( oThis.jCurrentModal );
      });
    },

    setUserID: function(){
      oThis.jCurrentModal.find(oThis.jUserID).val( oThis.userID );
    },

    setUserIDAdminRole: function( val ) {
      val = val || 0 ;
      oThis.jCurrentModal.find(oThis.jIsSuperAdmin).val( val );
    },
  
    hideModal : function ( jEl ) {
      jEl = jEl || $('.modal') ;
      jEl.modal('hide');
    },
    
    showModal : function ( jEl ) {
      if( jEl ){
        jEl.modal('show');
      }
    },

    resetSelectPicker: function() {
      $(oThis.sSelectPicker).val('default');
      $(oThis.sSelectPicker).selectpicker("refresh");
    },

    onInviteUserSuccess: function ( response ) {
      ost.coverElements.hide( oThis.jInviteUserCover );
      oThis.onActionSuccess( response ,  function ( result ) {
        oThis.simpleDataTable.prependResult(result);
        oThis.initSelectPicker();
        oThis.bindSelectPickerEvents();
      });
    },
  
    onDeleteUserSuccess : function ( response ) {
      oThis.setModalSuccessMsg("User deleted successfully!") ;
      oThis.onActionSuccess( response ,  function ( result ) {
        var userID = result && result.id ,
          resultToDelete =oThis.simpleDataTable.getResultById( userID )
        ;
        oThis.simpleDataTable.deleteResult( resultToDelete );
      });
      oThis.hideModal(  );
      oThis.showModal( oThis.jSuccessModal );
    },
  
    onUserUpdateSuccess : function ( response ) {
      oThis.setModalSuccessMsg("User updated successfully!") ;
      oThis.onActionSuccess( response ,  function ( result ) {
        oThis.simpleDataTable.updateResult(result);
      });
      oThis.hideModal(  );
      oThis.showModal( oThis.jSuccessModal );
    },
    
    jSuccessMsgEl : null ,
    setModalSuccessMsg: function ( msg ) {
      msg = msg || "Success";
      if( !oThis.jSuccessMsgEl ){
        oThis.jSuccessMsgEl = oThis.jSuccessModal.find('.success-msg') ;
      }
      oThis.jSuccessMsgEl.text( msg ) ;
    },
  
    dataFormator: function (res) {
      var data      = res && res.data,
        resultType  = data && data['result_type'],
        results     = resultType && data[resultType],
        managers    = data && data['managers'],
        len         = results && results.length, cnt,
        currentResult, manageId,
        currentManager
      ;
      if (!len) return res;
      for (cnt = 0; cnt < len; cnt++) {
        currentResult   = results[cnt];
        manageId        = currentResult['manager_id'];
        currentManager  = managers[manageId];
        if (currentManager) {
          currentResult['manager'] = currentManager;
        }
      }
      return res;
    },
  
    getResults : function ( response ) {
      var data      = response && response.data,
        resultType  = data && data['result_type'],
        results     = resultType && data[resultType]
      ;
      return results ;
    },
  
    onActionSuccess : function ( response ,  callback  ) {
      response = oThis.dataFormator(response);
      var results   = oThis.getResults( response ),
        len         = results && results.length, cnt,
        currentResult , id
      ;
      if (!len) return response;
      for (cnt = 0; cnt < len; cnt++) {
        currentResult = results[cnt];
        id = currentResult && currentResult[id] ;
        if (currentResult) {
          callback( currentResult );
        }
      }
    }
    


  }

})(window, jQuery);