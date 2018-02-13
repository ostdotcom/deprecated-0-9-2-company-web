;
(function (window, $) {
  var ost  = ns("ost");


  console.log("ost.transactions defined");
  var oThis = ost.transactions = {
    simpleDataTable: null
    ,init: function ( config ) {
      var oThis = this;

      oThis.simpleDataTable = new ost.SimpleDataTable({
        resultFetcher: function () {
          oThis.getDummyData.apply( oThis, arguments );
        }
      });

      oThis.bindEvents();
    }

    ,bindEvents: function () {
      $("#transaction_list").on("click", ".editRow", function () {
        ost.coverElements.show("#transaction_editor");
      });
    }

    , bindEditorEvents: function () {

    }




    /* Begin :: Dummy Data */
    , getDummyData: function (currentData, lastMeta, callback ) {
      //The Basic Stuff to configure. (Standard Code)
      var meta = null;
      var pageSize = 20;
      var maxPages = 3;
      var maxEntires = pageSize * maxPages;
      var resultTypeKey = "transactions";

      //Data Builder Logical Variables. (Standard Code)
      var newData = []
        , newMeta = {}
        , currentDataCnt = currentData.length
        , newDataCnt = Math.min(pageSize, (maxEntires - currentDataCnt) )
        , newCurrentSize = currentDataCnt + newDataCnt
        , uts = Date.now()
      ;

      console.log("currentDataCnt", currentDataCnt);
      //Custom Data Variables
      var transaction_types = ["User To User", "Company To User", "User to Company"];

      if (  newDataCnt > 0 ) {
        for(var cnt = 0; cnt < newDataCnt; cnt++ ) {
          /* Custom Code for generating data */
          var coinValue = Math.round( Math.random() * 1000 ) / 10;
          /* Please remember, backend will send 0/1 for boolean cases, not true/false */
          var someBooleanValue = Math.round( Math.random() );

          /* Adding Data (Standard Code) */
          newData.push({
            /* Common Data Properties */
            id: (currentDataCnt + cnt + 1),
            uts: uts + cnt,

            /* Custom properties */
            name: "Transaction " + Number(currentDataCnt + cnt + 1),
            kind: transaction_types[ (currentDataCnt + cnt + 1) % transaction_types.length],
            value_in_bt: coinValue,
            value_in_usd: coinValue * 10,
            commission_percent: Math.round( Math.random() * 25 ),
            use_price_oracle: someBooleanValue
          });
        }
      }

      /* Dealing with Meta (Standard Code) */
      if ( newCurrentSize < maxEntires ) {
        //Tell frontend we have more data.
        newMeta["has_more"] = 1;
        //Dont Worry about this, this will be backend generated. (Standard Code)
        newMeta["next_page_payload"] = {
          some_backend_param_1: "some_backend_param_value",
          some_backend_param_2: "some_backend_param_value",
          some_backend_param_3: "some_backend_param_value",
          some_backend_param_4: "some_backend_param_value"
        }
      }

      /* Build Response (Standard Code) */
      var response = {
        success: true,
        data : {
          result_type: resultTypeKey,  
          meta: newMeta
        }
      };
      response.data[ resultTypeKey ] = newData;

      /* Trigger Callback */
      setTimeout(function () {
        callback( response );
      }, 300);

    }
    /* End :: Dummy Data */


  };

})(window, jQuery);