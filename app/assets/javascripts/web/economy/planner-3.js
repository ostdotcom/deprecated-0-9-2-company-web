;
(function (window, $) {

  var ost  = ns("ost");  

  var oThis = ost.planner_3 = {
    init: function ( config ) {
      oThis.bindEvents();
      google.charts.setOnLoadCallback(oThis.plotChart);
    },

    bindEvents: function () {

    },

    plotChart: function(){
      var data = google.visualization.arrayToDataTable([
        ['Type', 'Tokens'],
        ['Allocated for Transaction Fee',      30],
        ['Used for Creating Tokens',  310],
        ['Total Available',     350],
      ]);

      var options = {
        pieHole: 0.7,
        pieSliceText: 'none',
        pieSliceBorderColor: 'none',
        colors: ['f6c62b','88c7ca','34445b'],
        legend: 'none',
        chartArea: {
          width: 180,
          height: 180,
          top: 10,
          left: 10
        }
      };

      var chart = new google.visualization.PieChart(document.getElementById('ostSupplyPie'));
      chart.draw(data, options);
    }

  };

})(window, jQuery);