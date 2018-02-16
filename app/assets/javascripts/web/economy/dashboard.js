/**
 * Created by fab on 2/16/18.
 */
;
(function ( window, $){

  var ost  = ns("ost");


  var oThis = ost.dashboard = {
    simpleDataTable: null
    ,init: function ( config ) {
      var oThis = this;

      oThis.simpleDataTable = new ost.SimpleDataTable();
    }
  };

})(window, jQuery);