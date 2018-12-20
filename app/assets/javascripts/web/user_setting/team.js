;
(function (window, $) {
  var ost = ns("ost")
  ;

  var oThis = ost.team = {
    simpleDataTable: null
    ,jParent : $('#team_list')

    ,init : function () {
      var datatableConfig={
        jParent:oThis.jParent
      }
      oThis.simpleDataTable = new ost.SimpleDataTable( datatableConfig );
      console.log("simpleDataTable",oThis.simpleDataTable);
      oThis.simpleDataTable.createResultMarkup(oThis.simpleDataTable);
      oThis.bindEvents();
    }
    ,bindEvents:function () {
      $("#invite_new_member_btn").on("click", function () {
        ost.coverElements.show( $('#invite_new_member') );
      });
      $("#invite_new_member_cancel_btn").on("click", function () {
        ost.coverElements.hide( $('#invite_new_member') );
      });

    }
  }

})(window, jQuery);