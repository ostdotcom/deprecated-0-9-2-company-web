;
(function (window , $) {

  var ost  = ns('ost');

  var oThis = ost.simulator = {
    simulatorTable : null
    ,txStatus: {
      "PENDING": "processing",
      "PROCESSING": "processing",
      "COMPLETE": "complete",
      "FAILED": "failed"
    }

    ,init : function ( config ) {
      var oThis =  this;
      $.extend(oThis, config);

      oThis.users = {};
      oThis.transactionTypes = {};
      oThis.pendingTransactionsUUID = [];
      oThis.pollingApi = config["tx_status_polling_url"];
      oThis.isPolling = false;

      oThis.pollingInterval = config["long_poll_timeout_millisecond"];
      viewTXDetailUrlPrefix = config['ost_view_tx_detail_url_prefix'];
      oThis.initHandleBarHelpers();
      oThis.createDataTable();
      oThis.bindEvents();
    }

    ,createDataTable: function () {
      var oThis =  this;

      if( oThis.simulatorTable ) {
        return; //Safety Net
      }
      oThis.simulatorTable =  new ost.SimpleDataTable( {
        jParent: $("#transaction-history-table"),
        resultFetcher: function ( currentData, lastMeta, callback ) {
          //Create a wrapper overcallback so that we can intercept data.
          var wrapperCallBack = function ( response ) {
            oThis.updateRequiredDetails( response );
            callback && callback.apply( null , arguments );
          };

          //Call the default fetcher method as we really don't need any
          //Special handling while requesting data.
          //We shall just send our own wrapperCallBack instead of callback we got.
          var fetcherScope = this,
            fetcher = ost.SimpleDataTable.prototype.resultFetcher,
            args = Array.prototype.slice.call(arguments)
          ;

          args.pop();
          args.push(wrapperCallBack);
          fetcher.apply(fetcherScope, args);
        }
      });
    }

    ,bindEvents : function () {
      var oThis =  this;

      $(".run-first-transaction-btn").on('click' , function () {
        oThis.updateDisplayContent();
        $('#run-transaction-form').submit();
      });

      $("#run-transaction-form").formHelper({
        success: function ( response ) {
          if ( response.success ) {
            oThis.createNewTransaction( response );
          }
        }
      });

    }

    ,createNewTransaction : function (response) {
      var oThis =  this,
          data  =  response && response.data,
          transactions = data && data.transactions
      ;
      oThis.updateRequiredDetails(response);
      oThis.simulatorTable.prependResult(transactions[0]);
    }

    ,updateRequiredDetails : function (response) {
      var oThis =  this,
          data  = response && response.data
      ;
      oThis.updateDisplayContent( data );
      oThis.updateUsersHash( data );
      oThis.updateTransactionTypesHash( data );
      oThis.setPendingTransactions( data );
      oThis.startPolling();
    }

    ,updateDisplayContent : function ( data )  {
      data = data || {};
      var transactions = data && data.transactions,
          jFirstTransactionWrapper = $('.first-transaction-wrapper'),
          jTransactionHistoryWrapper = $('.transaction-history-wrapper')
      ;
      if ( (oThis.simulatorTable && oThis.simulatorTable.results && oThis.simulatorTable.results.length ) 
          || (transactions && transactions.length > 0) 
      ) {
        jFirstTransactionWrapper.hide();
        jTransactionHistoryWrapper.show();
      }else {
        jFirstTransactionWrapper.show();
        jTransactionHistoryWrapper.hide();
      }
    }

    ,updateUsersHash : function (data) {
      var updatedUsers  = data.economy_users || {};
      $.extend( oThis.users , updatedUsers);
    }

    ,updateTransactionTypesHash : function (data) {
      var updatedTransactionTypes = data.transaction_types || {};
      $.extend( oThis.transactionTypes , updatedTransactionTypes);
    }

    ,setPendingTransactions : function ( data ) {
      var oThis = this,
          transactions = data && data.transactions,
          transaction
      ;
      for( var i = 0 ;  i < transactions.length  ; i++ ){
        transaction = transactions[i];
        if(transaction.status == oThis.txStatus.PENDING ) {
          console.log("Peding transaction.transaction_uuid", transaction.transaction_uuid);
          oThis.pushPendingTransactions( transaction.transaction_uuid );
        }
      }
    }


    ,isPolling: false
    ,shouldPoll: false
    ,startPolling : function () {
      var oThis = this;
      if ( oThis.isPolling ) {
        console.log("Polling Already in Progress");
        return false;
      }
      console.log("Polling has been started");
      oThis.shouldPoll = true;
      oThis.isPolling = true;
      return oThis.pollTxStatus();
    }

    , stopPolling: function () {
      var oThis = this;
      oThis.shouldPoll = false;
      oThis.isPolling = false;
      console.log("Polling has been stopped");
    }

    , pollXhr : null
    , pollTxStatus: function () {
      var oThis = this;

      if ( oThis.pollXhr ) {
        console.log("Polling request already in progress.");
        return false;
      }

      if ( !oThis.isPollingRequired() ) {
        oThis.stopPolling();
        return false;
      }

      var transaction_uuids = oThis.pendingTransactionsUUID
        , pollData = {
          transaction_uuids: oThis.pendingTransactionsUUID
        }
      ;



      console.log("pollData", pollData);
      oThis.pollXhr = $.ajax({
        url         : oThis.pollingApi
        , data      : pollData
        , success   : function () {
          oThis.onPollSuccess.apply(oThis, arguments);
        }
        , error     : function () {
          oThis.onPollError.apply(oThis, arguments);
        } 
        , complete  : function () {
          oThis.onPollComplete.apply(oThis, arguments);
          oThis.pollXhr = null;
        }
      });
      return true;
    }
    , onPollSuccess: function ( response ) {
      var oThis = this;

      console.log("onPollSuccess triggered \n", arguments);

      if ( response.success ) {
        oThis.updatePendingTransaction( response );
      } else {
        console.log("Keep it quite, we have an api error!");
        //Shhh....
        //Keep it a secret.
      }
    }

    , onPollError: function () {
      var oThis = this;
      console.log("onPollError triggered \n", arguments);
    }

    , onPollComplete: function () {
      var oThis = this;

      //This request has done its job.
      oThis.pollXhr = null;
      oThis.scheduleNextPoll();
    }



    , scheduleNextPoll: function () {
      var oThis = this;

      if ( !oThis.shouldPoll ) {
        oThis.isPolling = false;
        console.log("scheduleNextPoll :: Not scheduling next poll. shouldPoll is false");
        return;
      }

      console.log("scheduleNextPoll :: Next Poll Scheduled");

      setTimeout(function () {
        oThis.pollTxStatus();
      }, oThis.pollingInterval );

    }

    , updatePendingTransaction : function ( response ) {
      var oThis = this,
          data = response && response.data,
          transactions = data && data.transactions,
          currentTransaction , newTransaction,
          status , transaction_uuid
      ;
      if( !transactions || transactions.length == 0 ) return;
      for(var i = 0 ;  i < transactions.length ; i++) {
        newTransaction = transactions[i] ;
        status = newTransaction['status'] ;
        transaction_uuid = newTransaction['transaction_uuid'] ;
        if( status !== oThis.txStatus.PENDING ){
          currentTransaction = oThis.simulatorTable.getResultById(transaction_uuid , 'transaction_uuid');
          $.extend( currentTransaction , newTransaction);
          oThis.simulatorTable.updateResult( currentTransaction );
          oThis.popPendingTransactions(currentTransaction.transaction_uuid);
        }
      }
    }


    , isPollingRequired : function () {
      return oThis.pendingTransactionsUUID.length > 0;
    }

    , pushPendingTransactions : function ( uuid ) {
      console.log("pushPendingTransactions :: oThis.pendingTransactionsUUID", oThis.pendingTransactionsUUID);
      if( oThis.pendingTransactionsUUID.indexOf(uuid) < 0){
          oThis.pendingTransactionsUUID.push(uuid);
      }
    }

    , popPendingTransactions : function (uuid) {
      var index = oThis.pendingTransactionsUUID.indexOf(uuid);
      if( index > -1  ){
        oThis.pendingTransactionsUUID.splice(index ,  1);
      }
    }

    , initHandleBarHelpers : function () {
      var oThis = this,
          date = new Date();

      Handlebars.registerHelper('getUserIconClass' , function (userId , options) {
        var user = oThis.users[userId];

        if ( !user ) {
          return "u-kind-user";
        }

        if ( "reserve" === user.kind ) {
          return "u-kind-company"
        }

        return "u-kind-user";
      });


      Handlebars.registerHelper('getUserName' , function (userId , options) {
        var user = oThis.users[userId];

        if ( !user ) {
          return "";
        }

        if ( "reserve" === user.kind ) {
          return "Company"
        }

        return user['name'] ;
      });

      Handlebars.registerHelper('diplay_transaction_fee', function(transaction_fee, options ) {
        if( transaction_fee ) {
          return PriceOracle.toOst(transaction_fee) + " OST⍺";
        } else {
          return "NA";
        }
      });

      Handlebars.registerHelper('display_bt_commission_amount', function(bt_commission_amount, options ) {
        if( bt_commission_amount ) {
          return PriceOracle.toBt(bt_commission_amount);
        } else {
          return "NA";
        }
      });

      Handlebars.registerHelper('ifTransactionPending' , function (status  ,  options) {
        if(status == oThis.txStatus.PENDING ) {
          return options.fn(this);
        }else {
          return options.inverse(this);
        }
      });

      Handlebars.registerHelper('display_block_timeStamp', function(block_timeStamp, response) {
        if ( !block_timeStamp ) {
          return "NA";
        }

        // block_timeStamp = block_timeStamp * 1000;
        var momentTs = moment.unix(block_timeStamp);

        return (momentTs.fromNow() + " (" + momentTs.utc().format("MMM-DD-YYYY hh:mm:ss A UTC") + ")");

      });

      Handlebars.registerHelper('ifTransactionComplete' , function (status  ,  options) {
        if(status == oThis.txStatus.COMPLETE ) {
          return options.fn(this);
        }else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper('ifNotPending' , function (status  ,  options) {
        if(status != oThis.txStatus.PENDING ) {
          return options.fn(this);
        }else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper('ifShowBlockNumber' , function (block_number  ,  options) {
        if( typeof block_number === "number" ) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper('diplay_block_number' , function (block_number  ,  options) {
        if( typeof block_number === "number" ) {
          return $.number( block_number );
        }
        return "NA";
      });

      Handlebars.registerHelper('diplay_transaction_hash' , function (transaction_hash  ,  options) {
        if( typeof transaction_hash === "string" ) {
          return  '<a href="' +  oThis.viewTXDetailUrlPrefix + transaction_hash + '">' + transaction_hash + '</a>';
        }
        return "NA";
      });

      Handlebars.registerHelper('txName' , function (transaction_type_id  ,  options) {
        if( !transaction_type_id ) {
          return "";
        }
        var txType = oThis.transactionTypes[ transaction_type_id ];
        if ( !txType ) {
          return "";
        }
        return txType.name;
      });
      Handlebars.registerHelper('transaction_kind', function(response, options ) {
        var rowData = response.data.root || {}
          , transaction_type_id    = rowData.transaction_type_id
        ;
        var txType = oThis.transactionTypes[ transaction_type_id ];
        if ( !txType ) {
          return "";
        }
        return encodeURIComponent( txType.name );
      });

      

      Handlebars.registerHelper('display_bt_transfer_value' , function (bt_transfer_value  ,  options) {
        if( !bt_transfer_value ) {
          return "0";
        }
        return PriceOracle.toBt( bt_transfer_value ).toString();
      });
    }



  }

})(window ,  jQuery);