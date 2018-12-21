;
(function (window, $) {
  var ost = ns("ost") ,
    EventNameSpacing = ost.EventNameSpacing
  ;

  var oThis = ost.team = {
    simpleDataTable: null,
    jParent: $('#team_list'),
    jForm: $('#invite_new_member_form'),
    sSelectPicker: 'select.selectpicker',
    actionID : null ,
    
    deleteUserEndpoint : "/api/manager/super_admin/delete-admin",
    resetMfaEndpoint : "/api/manager/super_admin/reset-mfa",
    updateRoleEndPoint : "/api/manager/super_admin/update-super-admin-role",
    
    jInviteUserCover  : $('#invite_new_member'),
    
    jSuccessModal : $('#successModal'),
    jErrorModal : $('#errorModal'),
    jDeleteUserModal : $('#deleteUserModal'),
    jAssignRoleModal : $('#assignAdminModal'),
    jUnAssignRoleModal: $('#unassignAdminModal'),
    jResetMfaModal: $('#resetMfa'),

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
      oThis.initForm();
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
      $(".delete-user-btn").off( oThis.eventNameSpace.nameSpacedEvents('click') )
        .on( oThis.eventNameSpace.nameSpacedEvents('click') , function () {
        oThis.deleteUser();
      });
      $(".unassign-admin-btn").off( oThis.eventNameSpace.nameSpacedEvents('click') )
        .on( oThis.eventNameSpace.nameSpacedEvents('click') , function () {
        oThis.unassignAdmin();
      });
      $(".assign-admin-btn").off( oThis.eventNameSpace.nameSpacedEvents('click') )
        .on( oThis.eventNameSpace.nameSpacedEvents('click') , function () {
        oThis.assignAdmin();
      });
      $(".reset-mfa-btn").off( oThis.eventNameSpace.nameSpacedEvents('click') )
        .on( oThis.eventNameSpace.nameSpacedEvents('click') , function () {
        oThis.resetMfa();
      });
      $('.modal').off(  oThis.eventNameSpace.nameSpacedEvents( 'hidden.bs.modal' )  )
        .on( oThis.eventNameSpace.nameSpacedEvents( 'hidden.bs.modal' )  , function () {
        oThis.actionID = null ;
      });
      
    },
  
    initSelectPicker : function () {
      $(oThis.sSelectPicker).selectpicker();
    },
  
    initForm: function () {
      oThis.jForm.formHelper({
        success: function (response) {
          if( response.success ){
            oThis.onInviteUserSuccess(response);
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
        oThis.actionID = userID ;
        switch(  val ) {
          case "delete":
            oThis.showModal( oThis.jDeleteUserModal );
            break;
          case "assign":
            oThis.showModal( oThis.jAssignRoleModal );
            break;
          case "un-assign":
            oThis.showModal( oThis.jUnAssignRoleModal );
            break;
          case "reset-mfa":
            oThis.showModal( oThis.jResetMfaModal );
            break;
        }
        oThis.resetSelectPicker();
      });
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

    deleteUser: function() {
      var data = oThis.getData() ;
      $.ajax({
        url: oThis.deleteUserEndpoint,
        data: data,
        method: 'POST',
        success: function ( res ) {
          if( res.success ){
            oThis.onDeleteUserSuccess( res );
          }else {
            oThis.onActionError( res );
          }
        },
        error: function ( error ) {
          oThis.onActionError( error );
        }
      })
    },

    assignAdmin: function() {
      var data = oThis.getRoleBaseData( 1 ) ;
      $.ajax({
        url: oThis.updateRoleEndPoint,
        data: data,
        method: 'POST',
        success: function ( res ) {
          if( res.success ){
            oThis.onUserUpdateSuccess( res );
          }else {
            oThis.onActionError( res );
          }
        },
        error: function ( error ) {
          oThis.onActionError( error );
        }
      })
    },
  
    unassignAdmin: function() {
      var data = oThis.getRoleBaseData(  ) ;
      $.ajax({
        url: oThis.updateRoleEndPoint,
        data: data,
        method: 'POST',
        success: function ( res ) {
          if( res.success ){
            oThis.onUserUpdateSuccess( res );
          }else {
            oThis.onActionError( res );
          }
        },
        error: function ( error ) {
          oThis.onActionError( error );
        }
      })
    },
  
    resetMfa : function () {
      var data = oThis.getData() ;
      $.ajax({
        url: oThis.resetMfaEndpoint,
        data: data,
        method: 'POST',
        success: function ( res ) {
          if( res.success ){
            oThis.onUserUpdateSuccess( res );
          }else {
            oThis.onActionError( res );
          }
        },
        error: function ( error ) {
          oThis.onActionError( error );
        }
      })
    },
    
    getData : function () {
      return {
        "to_update_client_manager_id" : oThis.actionID
      }
    },
    
    getRoleBaseData : function ( val ) {
      val = val || 0;
      var data = oThis.getData();
      data['is_super_admin'] = val ;
      return data ;
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
    },
  
    onUserUpdateSuccess : function ( response ) {
      oThis.setModalSuccessMsg("User updated successfully!") ;
      oThis.onActionSuccess( response ,  function ( result ) {
        oThis.simpleDataTable.updateResult(result);
      });
    },
    
    jSuccessMsgEl : null ,
    setModalSuccessMsg: function ( msg ) {
      msg = msg || "Success";
      if( !oThis.jSuccessMsgEl ){
        oThis.jSuccessMsgEl = oThis.jSuccessModal.find('.success-msg') ;
      }
      oThis.jSuccessMsgEl.text( msg ) ;
    },
    
    jErrorMsgEl : null ,
    setModalErrorMsg : function ( msg ) {
      msg = msg || "Something went wrong.";
      if( !oThis.jErrorMsgEl ){
        oThis.jErrorMsgEl = oThis.jErrorModal.find('.error-msg') ;
      }
      oThis.jErrorMsgEl.text( msg ) ;
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
  
    onActionSuccess : function ( response ,  callback  , hideModal , showModal ) {
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
      oThis.hideModal( hideModal );
      showModal = showModal || oThis.jSuccessModal ;
      oThis.showModal( showModal );
    },
  
    onActionError : function (  response  ) {
      var errorText =  response && response.err &&  response.err.display_text;
      errorText = errorText || "Something went wrong";
      oThis.setModalErrorMsg( errorText );
      oThis.hideModal();
      oThis.showModal( oThis.jErrorModal );
    }
    


  }

})(window, jQuery);