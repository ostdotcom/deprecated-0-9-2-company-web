/**
 * Created by Akshay on 2/16/18.
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
      $("._transactions_value [data-interval='day']").trigger('click');

      $('._transactions_type .interval').on('click', function(){
        $('._transactions_type .interval').removeClass('active');
        $(this).addClass('active');
        oThis.printTypeChart($(this).data('interval'));
      });
      $("._transactions_type [data-interval='day']").trigger('click');

      oThis.printSupplyChart();

    },

    printTransactionsChart: function(interval){
      switch(interval) {
        case 'hour':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Hour'
          var count = 12;
          var format = 'm';
          var columns_1 = {
            type: 'datetime',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'day':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Day';
          var count = 12;
          var format = 'h aa';
          var columns_1 = {
            type: 'datetime',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'week':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Week';
          var count = 7;
          var format = 'EEE';
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'month':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Month'
          var count = 15;
          var format = 'd';
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'year':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=Year'
          var count = 12;
          var format = "MMM''yy";
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'all':
          var url = '/api/economy/token/graph/number-of-transactions?graph_duration=All'
          var count = 12;
          var format = "MMM''yy";
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
      }

      oThis.googleCharts_1.draw({
        ajax: {
          url: url
        },
        selector: '#transactionsValue',
        type: 'ComboChart',
        noDataHTML: $('#graphsNodataHTML').html(),
        loadingHTML: "<div class='loader'></div>",
        columns: [
          columns_1,
          {
            type: 'number',
            opt_label: 'No. of Transactions',
            opt_id: 'transaction_count'
          },
          {
            type: 'number',
            opt_label: 'Volume of Transactions in OST⍺',
            opt_id: 'ost_amount'
          }
        ],
        options: {
          seriesType: 'bars',
          series: {
            0: {
              targetAxisIndex: 0,
              labelInLegend: 'No. of Transactions (left axis)',
              color: 'ff8385',
              type: 'line'
            },
            1: {
              targetAxisIndex: 1,
              labelInLegend: 'Volume of Transactions in OST⍺ (right axis)',
              color: 'b2dde6'
            }
          },
          vAxes: {
            0: {
              title: ''
            },
            1: {
              title: '',
              format: 'short'
            }
          },
          lineWidth: 2,
          bar: {
            groupWidth: 30
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


      setTimeout(function () {
        oThis.modifyOstAmountAxisLables();
      },100);
    },

    modifyOstAmountAxisLables: function () {
      var oThis = this;
      var allTextTags = $("#transactionsValue svg g text[text-anchor='start']")
        , len   = allTextTags.length
        , maxX  = 0
        , axisTextTags 
        
        , jThisTag
        , thisTagText
        , xAttr
      ;

      if ( !len ) {
        setTimeout(function () {
          oThis.modifyOstAmountAxisLables();
        },100);
        return;
      }

      while( len-- ) {
        jThisTag    = allTextTags.eq( len );
        thisTagText = jThisTag.text();
        xAttr       = jThisTag.attr("x");
        ;
        maxX = Math.max(maxX, Number(xAttr) )
      }

      allTextTags.filter("[x='" + maxX + "']")

    },

    printTypeChart: function(interval){
      switch(interval) {
        case 'hour':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Hour';
          break;
        case 'day':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Day';
          break;
        case 'week':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Week';
          break;
        case 'month':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Month';
          break;
        case 'year':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=Year';
          break;
        case 'all':
          var url = '/api/economy/token/graph/transaction-types?graph_duration=All';
          break;
      }
      oThis.googleCharts_2.draw({
        ajax: {
          url: url
        },
        selector: '#transactionsType',
        type: 'ColumnChart',
        noDataHTML: $('#transactionsbytype').html(),
        loadingHTML: "<div class='loader'></div>",
        columns: [
          {
            type: 'string',
            opt_label: 'Type',
            opt_id: 'type'
          },
          {
            type: 'number',
            opt_label: 'No. of Transactions',
            opt_id: 'total_transfers'
          }
        ],
        options:{
          series: {
            0: {
              labelInLegend: 'Type of Transaction',
              color: 'f6c62b'
            }
          },
          legend: {
            alignment: 'end',
            position: 'top',
            textStyle: oThis.chartTextStyle
          },
          bars: 'vertical',
          bar: {
            groupWidth: 30
          },
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