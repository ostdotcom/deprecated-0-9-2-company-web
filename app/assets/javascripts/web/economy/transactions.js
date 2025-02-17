;
(function (window, $) {
  var ost  = ns("ost");


  console.log("ost.transactions defined");
  var oThis = ost.transactions = {
    simpleDataTable: null
    , events : {
      "transactionsAutoCreated": "transactionsAutoCreated"
    }
    ,init: function ( config ) {

      var oThis = this;
      $.extend(oThis, config);

      oThis.client_id = config.client_id;

      var dataTableConfig = {
        jParent: $("#transaction_list")
      };
      if ( config.auto_create_transactions ) {
        dataTableConfig.resultFetcher = function () {
          return oThis.autoCreateTransactions.apply( oThis, arguments);
        }
      }

      oThis.simpleDataTable = new ost.SimpleDataTable( dataTableConfig );

      oThis.bindEvents();
    }

    , bindEvents: function () {
      var oThis = this;

      $("#transaction_list").on("click", ".editRow", function ( event ) {
        var jEditBtn    = $( event.target )
          , resultId    = jEditBtn.data( "resultId" )
          , transaction = oThis.simpleDataTable.getResultById( resultId )
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

      $( oThis ).on(ost.transactions.editor.events.created, function (event, result, newResult, device_id ) {
        if ( oThis.simpleDataTable.getResultById( result.id ) ) {
          //Already Existing Result.
          console.log("result", result);
          oThis.simpleDataTable.updateResult( result );
        } else {
          //New Result.
          oThis.simpleDataTable.prependResult( result );
        }
      });

      $( oThis ).on(ost.transactions.editor.events.updated, function (event, result, newResult, deviceId ) {
        console.log("editor.events.updated triggered");
        oThis.simpleDataTable.updateResult( result );
      });
    }

    /* Begin :: Dummy Data */
    , autoCreateTransactions: function (currentData, lastMeta, callback ) {
      var oThis = this
          , resultTypeKey = "actions"
        , createdTransactions = [ {
            name: "Upvote",
            kind: "user_to_user",
            currency: "BT",
            amount: 5,
            commission_percent: 1,
            arbitrary_amount: false,
            arbitrary_commission: false
          }, {
            name: "Reward",
            kind: "company_to_user",
            currency: "BT",
            amount: 2,
            arbitrary_amount: false
          }, {
            name: "Purchase",
            kind: "user_to_user",
            currency: "BT",
            amount: 8,
            commission_percent: 1,
            arbitrary_amount: false,
            arbitrary_commission: false
          },{
            name: "Download",
            kind: "user_to_company",
            currency: "BT",
            amount: 1,
            arbitrary_amount: false
          }]
          , ts = Date.now()
          , totalCnt = cnt = createdTransactions.length
          , data
      ;

      console.log("createdTransactions.length", createdTransactions.length );
      /* Build Response (Standard Code) */
      var finalResponse = {
        success: true,
        data : {
          result_type: resultTypeKey,
          meta: {
            next_page_payload: {}
          }
        }
      };
      finalResponse.data[ resultTypeKey ] = createdTransactions;

      var triggerCallback = function () {
        var eventName = oThis.events.transactionsAutoCreated;
        //All finished.
        callback( finalResponse );

        $( oThis ).trigger(eventName, [finalResponse] );
      };

      var onSaveCallback = function ( response, actionData ) {
        console.log( response );
        totalCnt--;
        if ( response.success ) {
          var responseResultTypeKey = response.data.result_type
            , newActionData         = response.data[ responseResultTypeKey ]
          ;
          $.extend(actionData, newActionData);
        } else {
          console.log("Failed to save autocreated transactions");
          var dataIndx = createdTransactions.indexOf( actionData );
          if ( dataIndx < 0 )  {
            console.log("dataIndx is less than 0: ", dataIndx);
          } else {
            createdTransactions.splice(dataIndx, 1);
          }

        }
        if ( !totalCnt ) {
          console.log("finalResponse", JSON.stringify( finalResponse ), "\n", finalResponse  );
          triggerCallback();
        } else {
          console.log("totalCnt is not zero" , totalCnt);
        }
      };

      while( cnt-- ) {
        data = createdTransactions[ cnt ];
        data.id = data.id = ( ts + cnt ) * -1;
        data.ust = ts;
        data.client_id = oThis.client_id;
        oThis.saveAutoGeneratedAction( data, onSaveCallback );
      }

    }

    , saveAutoGeneratedAction: function (data, onSaveCallback) {
      var oThis = this;
      $.post({
        url : "/api/economy/action/create"
        , data : data
        , success: function ( response ) {
          onSaveCallback && onSaveCallback(response, data);
        }
        , failed: function () {

        }
      })

    }

    // /* Begin :: Dummy Data */
    // , getDummyData: function (currentData, lastMeta, callback ) {
    //   //The Basic Stuff to configure. (Standard Code)
    //   var meta = null;
    //   var pageSize = 20;
    //   var maxPages = 3;
    //   var maxEntires = pageSize * maxPages;
    //   var resultTypeKey = "transactions";

    //   //Data Builder Logical Variables. (Standard Code)
    //   var newData = []
    //     , newMeta = {}
    //     , currentDataCnt = currentData.length
    //     , newDataCnt = Math.min(pageSize, (maxEntires - currentDataCnt) )
    //     , newCurrentSize = currentDataCnt + newDataCnt
    //     , uts = Date.now()
    //   ;

    //   console.log("currentDataCnt", currentDataCnt);
    //   //Custom Data Variables
    //   var transaction_types = ["user_to_user", "company_to_user", "user_to_company"];
    //   var currency_types = ["BT", "USD"];

    //   if (  newDataCnt > 0 ) {
    //     for(var cnt = 0; cnt < newDataCnt; cnt++ ) {
    //       /* Custom Code for generating data */
    //       var coinValue = Math.round( Math.random() * 1000 ) / 10;
    //       /* Please remember, backend will send 0/1 for boolean cases, not true/false */
    //       var someBooleanValue = Math.round( Math.random() );

    //       /* Adding Data (Standard Code) */
    //       newData.push({
    //         /* Common Data Properties */
    //         id: (currentDataCnt + cnt + 1),
    //         uts: uts + cnt,

    //         /* Custom properties */
    //         client_id: 2,
    //         name: "Transaction " + Number(currentDataCnt + cnt + 1),
    //         kind: transaction_types[ (currentDataCnt + cnt + 1) % transaction_types.length],
    //         amount: coinValue,
    //         currency: currency_types[  (currentDataCnt + cnt + 1) % currency_types.length ],
    //         commission_percent: Math.round( Math.random() * 10)
    //       });
    //     }
    //   }

    //   /* Dealing with Meta (Standard Code) */
    //   if ( newCurrentSize < maxEntires ) {
    //     //Tell frontend we have more data.
    //     newMeta["has_more"] = 1;
    //     //Dont Worry about this, this will be backend generated. (Standard Code)
    //     newMeta["next_page_payload"] = {
    //       some_backend_param_1: "some_backend_param_value",
    //       some_backend_param_2: "some_backend_param_value",
    //       some_backend_param_3: "some_backend_param_value",
    //       some_backend_param_4: "some_backend_param_value"
    //     }
    //   }

    //   /* Build Response (Standard Code) */
    //   var response = {
    //     success: true,
    //     data : {
    //       result_type: resultTypeKey,  
    //       meta: newMeta
    //     }
    //   };
    //   response.data[ resultTypeKey ] = newData;

    //   /* Trigger Callback */
    //   setTimeout(function () {
    //     callback( response );
    //   }, 300);

    // }
    /* End :: Dummy Data */


  };

})(window, jQuery);