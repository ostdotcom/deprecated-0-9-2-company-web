;
(function (window, $) {

  var ost     = ns("ost");

  var oThis = ost.mintBtWidget = {
    idOstToTransfer   : null
    , idStPrimeToMint : null
    , idBtToMint      : null
    , idTokenUsdValue : null
    , idOstBalance    : null
    , idOstAfter      : null


    , jOstToTransfer  : null
    , jBtToMint       : null
    , jTokenUsdValue  : null
    , jOstBalance     : null
    , jOstAfter       : null
    /* 
      NOTE: Try to only read from jStPrimeToMint, Please avoid setting Property. 
      Feel free to listen to its events.
    */
    , jStPrimeToMint  : null

    , init: function ( config ) {
      var oThis = this;

      config = config || {};

      $.extend( oThis, config );

      oThis.jOstToTransfer  = oThis.jOstToTransfer  || $( "#" + oThis.idOstToTransfer );
      oThis.jBtToMint       = oThis.jBtToMint       || $( "#" + oThis.idBtToMint );
      oThis.jTokenUsdValue  = oThis.jTokenUsdValue  || $( "#" + oThis.idTokenUsdValue );
      oThis.jOstBalance     = oThis.jOstBalance     || $( "#" + oThis.idOstBalance );
      oThis.jOstAfter       = oThis.jOstAfter       || $( "#" + oThis.idOstAfter );
      oThis.jStPrimeToMint  = oThis.jStPrimeToMint  || $( "#" + oThis.idStPrimeToMint );

      PriceOracle.bindCurrencyElements(oThis.jBtToMint, oThis.jTokenUsdValue, oThis.jOstToTransfer);
      oThis.jBtToMint.trigger("change");

      oThis.bindEvents();

    }

    , bindEvents: function () {
      var oThis = this;

      oThis.jBtToMint.on("change", function () {
        oThis.updateChart();
      });
      oThis.jStPrimeToMint.on("change", function () {
        oThis.updateChart();
      });



      google.charts.setOnLoadCallback( function () {
        oThis.onChartsLoaded.apply(oThis, arguments);
      });
    }


    //Every thing to do with charts
    , gChart: null
    , gDataTable : null
    // gi stands for google index.
    , giOstAvailable: -1
    , giStPrime: -1
    , giBtToMint: -1
    , onChartsLoaded : function () {
      var oThis = this;

      var gDataTable = oThis.gDataTable = new google.visualization.DataTable();
      //Define the Column
      gDataTable.addColumn( 'string', 'Type');
      gDataTable.addColumn( 'number', 'Tokens');
      
      
      
      //Define Rows.
      oThis.giStPrime       = gDataTable.addRow( ['Allocated for Transaction Fee', 0] );
      oThis.giBtToMint      = gDataTable.addRow( ['Used for Creating Tokens', 0] );
      oThis.giOstAvailable  = gDataTable.addRow( ['Remaining Ost', 0] );


      oThis.gChart = new google.visualization.PieChart(document.getElementById('ostSupplyPie'));

      oThis.updateChart();
    }

    , updateChart: function () {
      var oThis = this;

      if ( !oThis.gDataTable || !oThis.gChart ) {
        console.log("chart not ready");
        return;
      }

      var ostBalance    = oThis.jOstBalance.val() || "0"
        , btToMint      = oThis.jBtToMint.val() || "0"
        , stPrimeToMint = oThis.jStPrimeToMint.val() || "0"
        , ostToTransfer = oThis.jOstToTransfer.val()
        , colIndex      = 1
        , remainingOst
      ;

      console.log("btToMint", btToMint, 
        "stPrimeToMint", stPrimeToMint, 
        "ostBalance", ostBalance , 
        "ostToTransfer", ostToTransfer 
      );

      remainingOst  = BigNumber(ostBalance).minus(ostToTransfer);

      oThis.gDataTable.setCell(oThis.giStPrime, colIndex, stPrimeToMint );
      oThis.gDataTable.setCell(oThis.giBtToMint, colIndex, ostToTransfer.toString(10) );
      oThis.gDataTable.setCell(oThis.giOstAvailable, colIndex, remainingOst.toString(10) );

      oThis.gChart.draw(oThis.gDataTable, oThis.chartOptions);


      console.log( "remainingOst", remainingOst.toString( 10 ) );
      oThis.jOstAfter.html( remainingOst.toString( 10 ) );
    }

    , chartOptions : {
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
      },
      animation : {
        startup     : true
        , easing    : "out"
        , duration  : 300
      }
    }

  }



})(window, jQuery);