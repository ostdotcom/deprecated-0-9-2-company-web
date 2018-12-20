;
(function (window, $) {
  var ost = ns("ost")
  ;

  var oThis = ost.team = {
    simpleDataTable: null,
    jParent : $('#team_list'),
    jForm: $('#invite_new_member_form'),
    sSelectPicker: 'select.selectpicker',

    init : function () {
      var datatableConfig={
        jParent:oThis.jParent,
        resultFetcherCallback : function ( results ) {
          oThis.initSelectPicker();
          oThis.bindSelectPickerEvents();
        }
      };
      oThis.simpleDataTable = new ost.SimpleDataTable( datatableConfig );
      oThis.bindEvents();
      oThis.initForm();
    },
    bindEvents:function () {
      $("#invite_new_member_btn").on("click", function () {
        ost.coverElements.show( $('#invite_new_member') );
      });
      $("#invite_new_member_cancel_btn").on("click", function () {
        ost.coverElements.hide( $('#invite_new_member') );
      });
      $(".delete-user").on("click", function () {
        oThis.deleteUser();
      });
      $(".unassign-admin").on("click", function () {
        oThis.unassignAdmin();
      });
      $(".assign-admin").on("click", function () {
        oThis.assignAdmin();
      });

    },
  
    initSelectPicker : function () {
      $(oThis.sSelectPicker).selectpicker();
    },

    initForm:function(){
      oThis.jForm.formHelper({
        success: function( response ){
          console.log( response );
          oThis.onInviteUserSuccess( response );
        }
      });
    },

    onInviteUserSuccess: function (  ) {
      ost.coverElements.hide( $('#invite_new_member') );
    },

    bindSelectPickerEvents:function() {
      $(oThis.sSelectPicker).on('changed.bs.select', function (e, clickedIndex) {
        switch( clickedIndex ) {
          case 1:
            oThis.resetSelectPicker();
            $('#deleteUserModal').modal('show');
            break;
          case 2:
            oThis.resetSelectPicker();
            $('#unassignAdminModal').modal('show');
            break;
          case 3:
            oThis.resetSelectPicker();
            $('#assignAdminModal').modal('show');
            break;
        }
      });
    },

    resetSelectPicker: function() {
      $(oThis.sSelectPicker).val('default');
      $(oThis.sSelectPicker).selectpicker("refresh");
    },

    deleteUser: function() {
      $('#deleteUserModal').modal('hide');
      $('#successModal').modal('show');
    },

    unassignAdmin: function() {
      $('#unassignAdminModal').modal('hide');
      $('#successModal').modal('show');
    },

    assignAdmin: function() {
      $('#assignAdminModal').modal('hide');
      $('#successModal').modal('show');
    }


  }

})(window, jQuery);