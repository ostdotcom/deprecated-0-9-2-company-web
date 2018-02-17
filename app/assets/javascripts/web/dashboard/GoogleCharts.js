;(function (window, $) {

  var GoogleCharts = function ( config ) {
    var oThis = this;
    $.extend( oThis, config );

    if(!oThis.validate()){
      return false;
    }

  };

  GoogleCharts.prototype = {

    constructor: GoogleCharts,
    version: 'current',
    packages: ['corechart'],
    data: [],
    ajax: {},
    options: {},
    elem: null,

    validate: function(){
      var oThis = this;
      if (typeof google != "undefined" && typeof google.charts != "undefined" && typeof google.visualization != "undefined") {
        google.charts.load(oThis.version, {packages: oThis.packages});
      } else {
        console.warn('Google charts not loaded. Please include https://www.gstatic.com/charts/loader.js');
        return false;
      }

      if ( ($.isEmptyObject(oThis.data) && $.isEmptyObject(oThis.ajax)) || $.isEmptyObject(oThis.options) || !oThis.elem ){
        console.warn('Mandatory inputs for Google charts are missing [data,ajax,options,elem]');
        return false;
      }
      return true;
    }

  };

  window.GoogleCharts = GoogleCharts;

})(window, jQuery);