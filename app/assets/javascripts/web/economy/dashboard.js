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
      oThis.simpleDataTable = new ost.SimpleDataTable({
        jParent: $("#top-holders")
      });
      oThis.googleCharts_1 = new GoogleCharts();
      oThis.googleCharts_2 = new GoogleCharts();
      oThis.googleCharts_3 = new GoogleCharts();
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

      oThis.printSupplyChart();

    },

    printTransactionsChart: function(interval){
      if(['day','hour','month','year','all'].indexOf(interval) == -1) {
        return;
      }
      switch(interval) {
        case 'hour':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Hour'
          var count = 12;
          var format = 'm';
          break;
        case 'day':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Day';
          var count = 24;
          var format = 'H';
          break;
        case 'month':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Month'
          var count = 30;
          var format = 'd';
          break;
        case 'year':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Year'
          var count = 12;
          var format = 'm';
          break;
        case 'all':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=All'
          var count = 12;
          var format = 'm';
          break;
      }
      oThis.googleCharts_1.draw({
        ajax: {
          url: url
        },
        selector: '#transactionsValue',
        type: 'LineChart',
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
      });
    },

    printTypeChart: function(interval){
      switch(interval) {
        case 'hour':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Hour'
          var count = 12;
          var format = 'm';
          break;
        case 'day':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Day';
          var count = 24;
          var format = 'H';
          break;
        case 'month':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Month'
          var count = 30;
          var format = 'd';
          break;
        case 'year':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Year'
          var count = 12;
          var format = 'm';
          break;
        case 'all':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=All'
          var count = 12;
          var format = 'm';
          break;
      }
      oThis.googleCharts_2.draw({
        ajax: {
          url: url
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

    printSupplyChart: function(){
      oThis.googleCharts_3.draw({
        data: [
          ['Category', 'Value'],
          [$('[data-ost_available_key]').text(),    parseInt($('[data-ost_available_val]').text())],
          [$('[data-ost_allocated_key]').text(),    parseInt($('[data-ost_allocated_val]').text())],
          [$('[data-ost_staked_key]').text(),       parseInt($('[data-ost_staked_val]').text())]
        ],
        selector: '#ostSupplyPie',
        type: 'PieChart',
        options: {
          pieHole: 0.7,
          pieSliceText: 'none',
          pieSliceBorderColor: 'none',
          colors: ['f6c62b','88c7ca','34445b'],
          backgroundColor: 'transparent',
          legend: 'none',
          chartArea: {
            width: 180,
            height: 180,
            top: 10,
            left: 10
          }
        }
      })
    },

    chartTextStyle: {
      color: '597a84',
      fontSize: 10
    }
  };

})(window, jQuery);