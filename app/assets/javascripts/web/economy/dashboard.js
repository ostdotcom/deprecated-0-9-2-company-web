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
        headers: [
          {type: 'date', title: 'Date'},
          {type: 'number', title: 'Transaction count'},
          {type: 'number', title: 'OST Amount'},
        ],
        ajax: {
          url: 'http://devcompany.com:8080/month.json'
        },
        ajaxCallback: function(response){
          var data = [];
          $.each( response.data.number_of_transactions, function( index, value ) {
            data.push([new Date(value.timestamp*1000), value.transaction_count, value.ost_amount]);
          });
          console.log(data);
          return data;
        },
        options: {
          // Gives each series an axis that matches the vAxes number below.
          series: {
            0: {targetAxisIndex: 0},
            1: {targetAxisIndex: 1}
          },
          vAxes: {
            // Adds titles to each axis.
            0: {title: ''},
            1: {title: ''}
          }
        },
        selector: '#transactionsValue',
        type: 'LineChart'
      });
    }
  };

})(window, jQuery);