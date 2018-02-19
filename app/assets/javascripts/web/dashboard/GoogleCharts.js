;(function (window, $) {

  var GoogleCharts = function ( config ) {
    var oThis = this;
    $.extend( oThis, config );

    oThis.load();

  };

  GoogleCharts.prototype = {

    constructor: GoogleCharts,
    version: 'current',
    packages: ['corechart'],
    data: [],
    ajax: {},
    options: {},
    selector: null,
    type: null,

    load: function(){
      var oThis = this;
      if (typeof google != "undefined" && typeof google.charts != "undefined") {
        google.charts.load(oThis.version, {packages: oThis.packages});
        console.log('Google charts loaded and ready to draw...');
      } else {
        console.warn('Google charts not loaded. Include https://www.gstatic.com/charts/loader.js');
      }
    },

    draw: function(config){
      var oThis = this;
      $.extend( oThis, config );

      if ( ($.isEmptyObject(oThis.data) && $.isEmptyObject(oThis.ajax)) || $.isEmptyObject(oThis.options) || !oThis.selector || !oThis.type ){
        console.warn('Mandatory inputs for Google charts are missing [data OR ajax, options, selector, type]');
        return false;
      }

      if(!$.isEmptyObject(oThis.ajax)){
        var ajaxObj = {
          success: function(response){
            oThis.data = oThis.ajaxCallback(response);
            oThis.render();
          }
        }
        $.extend( ajaxObj, oThis.ajax );
        $.ajax(ajaxObj);
      } else {
        oThis.render();
      }

    },

    render: function(){
      var oThis = this;
      google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable(oThis.data);
        var chart = new google.visualization[oThis.type]($(oThis.selector)[0]);
        chart.draw(data, oThis.options);
      });
    },

    ajaxCallback: function(response){
      return response;
    }

  };

  window.GoogleCharts = GoogleCharts;

})(window, jQuery);