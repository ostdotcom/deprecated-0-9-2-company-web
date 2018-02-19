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
      oThis.googleCharts = new GoogleCharts();
      oThis.googleCharts.draw({
        /*data: [
          ['Year', 'Sales', 'Expenses'],
          ['2004',  1000,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ],*/
        ajax: {
          url: 'http://devcompany.com:8080/month.json'
        },
        ajaxCallback: function(response){
          return [
            ['Year', 'Sales', 'Expenses'],
            ['2004',  1000,      400],
            ['2005',  1170,      460],
            ['2006',  660,       1120],
            ['2007',  1030,      540]
          ];
        },
        options: {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' }
        },
        selector: '#transactionsValue',
        type: 'LineChart'
      });
    }
  };

})(window, jQuery);