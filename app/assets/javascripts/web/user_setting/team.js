;
(function (window, $) {
  var ost = ns("ost")
  ;

  var oThis = ost.team = {
    simpleDataTable: null,
    jParent : $('#team_list'),
    jForm: $('#invite_new_member_form'),

    init : function () {
      var datatableConfig={
        jParent:oThis.jParent,
        resultFetcherCallback : function ( results ) {
          oThis.initSelectPicker();
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

    },
  
    initSelectPicker : function () {
      $('select.selectpicker').selectpicker();
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
    }
  }

})(window, jQuery);