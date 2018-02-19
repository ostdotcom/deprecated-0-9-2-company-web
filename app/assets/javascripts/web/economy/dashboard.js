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
        ajax: {
          url: 'http://devcompany.com:8080/month.json'
        },
        ajaxCallback: function(response){
          var data = [];
          data.push(Object.keys(response.data[response.data.result_type][0]));
          $.each( response.data[response.data.result_type], function( index, value ) {
            data.push([new Date(value.timestamp*1000), value.transaction_count, value.ost_amount]);
          });
          return data;
        },
        options: {
          series: {
            0: {
              targetAxisIndex: 0,
              labelInLegend: 'No. of Transfers',
              color: '84d1d4'
            },
            1: {
              targetAxisIndex: 1,
              labelInLegend: 'Value of Transfers',
              color: 'ff5f5a'
            }
          },
          legend: {
            alignment: 'end',
            position: 'top',
            textStyle: oThis.chartTextStyle
          },
          chartArea: {
            width: '90%',
            height: '80%'
          },
          hAxis: {
            format: 'd',
            gridlines: {
              color: 'transparent',
              count: 30
            },
            textStyle: oThis.chartTextStyle
          },
          vAxis: {
            gridlines: {
              color: 'e3eef3'
            },
            textStyle: oThis.chartTextStyle
          }
        },
        selector: '#transactionsValue',
        type: 'LineChart'
      });
    },

    chartTextStyle: {
      color: '597a84',
      fontSize: 10
    }
  };

})(window, jQuery);