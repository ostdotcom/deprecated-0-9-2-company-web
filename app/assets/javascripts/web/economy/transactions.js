;
(function (window, $) {
  var ost  = ns("ost");


  console.log("ost.transactions defined");
  var oThis = ost.transactions = {
    simpleDataTable: null
    ,init: function ( config ) {
      var oThis = this;

      oThis.simpleDataTable = new ost.SimpleDataTable({
        // resultFetcher: function () {
        //   oThis.getDummyData.apply( oThis, arguments );
        // }
      });

      oThis.bindEvents();
    }

    , bindEvents: function () {
      var oThis = this;

      $("#transaction_list").on("click", ".editRow", function ( event ) {
        var jEditBtn    = $( event.target )
          , resultId    = jEditBtn.data( "resultId" )
          , transaction = oThis.simpleDataTable.getResultWithId( resultId )
        ;

        if ( transaction ) {
          //DO NOT CREATE A COPY. KEEP THE OBJECT REFRENCE SAME

          if ( Number( resultId ) < 0 ) {
            //This is a new transaction.
            ost.transactions.editor.createNewTransaction( transaction );
          } else {
            //Edit Existing Transaction
            ost.transactions.editor.editTransaction( transaction );  
          }
        }

      });

      $("#create_transaction_btn").on("click", function () {
        ost.transactions.editor.createNewTransaction();
      });

      //setTimeout is needed because ost.transactions.editor will
      //not be initialised at this point of time.
      setTimeout( function () {
        oThis.bindEditorEvents();
      }, 100);

    }

    , bindEditorEvents: function () {
      var oThis = this;

      $( oThis ).on(ost.transactions.editor.events.created, function () {

      });

      $( oThis ).on(ost.transactions.editor.events.updated, function (event, result, newResult, deviceId ) {
        console.log("editor.events.updated triggered");
        oThis.simpleDataTable.updateResult( result );
      });
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
      var transaction_types = ["user_to_user", "company_to_user", "user_to_company"];
      var currency_types = ["bt", "usd"];

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
            client_id: 2,
            name: "Transaction " + Number(currentDataCnt + cnt + 1),
            kind: transaction_types[ (currentDataCnt + cnt + 1) % transaction_types.length],
            value_in_bt: coinValue,
            value_in_usd: coinValue * 10,
            currency_type: currency_types[  (currentDataCnt + cnt + 1) % currency_types.length ],
            commission_percent: Math.round( Math.random() * 10)
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