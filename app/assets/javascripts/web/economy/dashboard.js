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
      oThis.googleCharts_1 = new GoogleCharts();
      oThis.googleCharts_2 = new GoogleCharts();
      oThis.bindButtons();
    },

    bindButtons: function(){

      $('._transactions_value .interval').on('click', function(){
        $('._transactions_value .interval').removeClass('active');
        $(this).addClass('active');
        oThis.printTransactionsChart($(this).data('interval'));
      });
      $("._transactions_value [data-interval='hour']").trigger('click');

      $('._transactions_type .interval').on('click', function(){
        $('._transactions_type .interval').removeClass('active');
        $(this).addClass('active');
        oThis.printTypeChart($(this).data('interval'));
      });
      $("._transactions_type [data-interval='hour']").trigger('click');

    },

    printTransactionsChart: function(interval){
      if(['day','hour','month'].indexOf(interval) == -1) {
        return;
      }
      switch(interval) {
        case 'day':
          var url = 'http://devcompany.com:8080/day.json';
          var count = 24;
          var format = 'H';
          break;
        case 'hour':
          var url = 'http://devcompany.com:8080/hour.json'
          var count = 12;
          var format = 'm';
          break;
        case 'month':
          var url = 'http://devcompany.com:8080/month.json'
          var count = 30;
          var format = 'd';
          break;
      }
      oThis.googleCharts_1.draw({
        ajax: {
          url: url
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
            format: format,
            gridlines: {
              color: 'transparent',
              count: count
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

    printTypeChart: function(){
      oThis.googleCharts_2.draw({
        ajax: {
          url: 'http://devcompany.com:8080/transactionByType.json'
        },
        selector: '#transactionsType',
        type: 'ColumnChart',
        options:{
          series: {
            0: {
              labelInLegend: 'Type of Transfers',
              color: 'f6c62b'
            }
          },
          legend: {
            alignment: 'end',
            position: 'top',
            textStyle: oThis.chartTextStyle
          },
          bars: 'vertical',
          chartArea: {
            width: '90%',
            height: '80%'
          },
          hAxis: {
            textStyle: oThis.chartTextStyle,
            ticks: ['a','b','c']
          },
          vAxis: {
            textStyle: oThis.chartTextStyle
          }
        }
      });
    },

    chartTextStyle: {
      color: '597a84',
      fontSize: 10
    }
  };

})(window, jQuery);