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
    elem: null,
    type: null,

    validate: function(){
      var oThis = this;

      if ( ($.isEmptyObject(oThis.data) && $.isEmptyObject(oThis.ajax)) || $.isEmptyObject(oThis.options) || !oThis.elem || !oThis.type ){
        console.warn('Mandatory inputs for Google charts are missing [data,ajax,options,elem,type]');
        return false;
      }

      return true;
    },

    load: function(){
      var oThis = this;
      if (typeof google != "undefined" && typeof google.charts != "undefined") {
        google.charts.load(oThis.version, {packages: oThis.packages});
        console.log('Google charts loaded and ready to draw...');
        oThis.draw();
      } else {
        console.warn('Google charts not loaded. Attempting to load https://www.gstatic.com/charts/loader.js asynchronously...');
        $.ajax({
          url: '//www.gstatic.com/charts/loader.js',
          dataType: "script",
          cache: true,
          success: function(){
            oThis.load();
          },
          failure: function(){
            console.warn('Google charts not loaded. Could not load https://www.gstatic.com/charts/loader.js asynchronously');
          }
        });
      }
    },

    draw: function(config){
      var oThis = this;
      $.extend( oThis, config );

      console.log('draw called...');
      console.log(google);

      if ( ($.isEmptyObject(oThis.data) && $.isEmptyObject(oThis.ajax)) || $.isEmptyObject(oThis.options) || !oThis.elem || !oThis.type ){
        console.warn('Mandatory inputs for Google charts are missing [data,ajax,options,elem,type]');
        return false;
      }

      google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable(oThis.data);
        var chart = new google.visualization[oThis.type](document.getElementById(oThis.elem));
        chart.draw(data, oThis.options);
      });

    }

  };

  window.GoogleCharts = GoogleCharts;

})(window, jQuery);