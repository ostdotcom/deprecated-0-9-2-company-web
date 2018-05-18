;
(function (window , $) {

  var ost  = ns('ost');

  var oThis = ost.simulator = {
    simulatorTable : null
    ,txStatus: {
      "PENDING": "processing",
      "PROCESSING": "processing",
      "WaitingForMining" : "waiting_for_mining",
      "COMPLETE": "complete",
      "FAILED": "failed"
    }

    ,init : function ( config ) {
      var oThis =  this;
      $.extend(oThis, config);

      oThis.users = {};
      oThis.transactionTypes = {};
      oThis.pendingTransactionsID = [];
      oThis.pollingApi = config["tx_status_polling_url"];
      oThis.isPolling = false;

      oThis.pollingInterval = config["long_poll_timeout_millisecond"];
      oThis.viewTXDetailUrlPrefix = config['ost_view_tx_detail_url_prefix'];
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
      var updatedUsers  = data.users || {};
      $.extend( oThis.users , updatedUsers);
    }

    ,updateTransactionTypesHash : function (data) {
      var updatedTransactionTypes = data.transaction_types || {};
      $.extend( oThis.transactionTypes , updatedTransactionTypes);
    }

    ,setPendingTransactions : function ( data ) {
      var oThis = this,
          transactions = data && data.transactions,
          transaction , status
      ;
      for( var i = 0 ;  i < transactions.length  ; i++ ){
        transaction = transactions[i];
        status = transaction.status ;
        if( !oThis.isTransactionComplete(status) ) {
          console.log("Pending transaction.id", transaction.id);
          oThis.pushPendingTransactions( transaction.id );
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

      var transaction_uuids = oThis.pendingTransactionsID
        , pollData = {
          transaction_uuids: oThis.pendingTransactionsID
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
          status , transaction_id
      ;
      if( !transactions || transactions.length == 0 ) return;
      for(var i = 0 ;  i < transactions.length ; i++) {
        newTransaction = transactions[i] ;
        status = newTransaction['status'] ;
        transaction_id = newTransaction['id'] ;
        if( oThis.isTransactionComplete( status )  ){
          currentTransaction = oThis.simulatorTable.getResultById(transaction_id , 'id');
          $.extend( currentTransaction , newTransaction);
          oThis.simulatorTable.updateResult( currentTransaction );
          oThis.popPendingTransactions(currentTransaction.id);
        }
      }
    }


    , isPollingRequired : function () {
      return oThis.pendingTransactionsID.length > 0;
    }

    , isTransactionComplete : function ( status ) {
      return status !== oThis.txStatus.PENDING && status !== oThis.txStatus.WaitingForMining ;
    }

    , pushPendingTransactions : function ( transaction_id ) {
      console.log("pushPendingTransactions :: oThis.pendingTransactionsID", oThis.pendingTransactionsID);
      if( oThis.pendingTransactionsID.indexOf(transaction_id) < 0){
          oThis.pendingTransactionsID.push(transaction_id);
      }
    }

    , popPendingTransactions : function (transaction_id) {
      var index = oThis.pendingTransactionsID.indexOf(transaction_id);
      if( index > -1  ){
        oThis.pendingTransactionsID.splice(index ,  1);
      }
    }

    , initHandleBarHelpers : function () {
      var oThis = this,
          date = new Date();

      Handlebars.registerHelper('getFromUserIconClass' , function ( userId, action_id, options ) {
        var user = oThis.users[userId];

        if ( !user ) {
          return "u-kind-user";
        }

        var txType = oThis.transactionTypes[ action_id ];
        if ( txType && txType.kind && txType.kind.indexOf("company_") === 0 ) {
          return "u-kind-company";
        }

        return "u-kind-user";
      });

      Handlebars.registerHelper('commission_percent', function( options ) {
        //var oThis = this;

        var data = options.data.root
          , actionId = data.action_id
          , txType = oThis.transactionTypes[ actionId ]
        ;
        console.log( "commission_percent :: txType", txType );

        return txType.commission_percent;
      });


      Handlebars.registerHelper('getFromUserName' , function ( userId , action_id, options ) {
        var user = oThis.users[userId];

        if ( !user ) {
          return "";
        }

        var txType = oThis.transactionTypes[ action_id ];
        if ( txType && txType.kind && txType.kind.indexOf("company_") === 0  ) {
          return "Company";
        }

        return user['name'] ;
      });

      Handlebars.registerHelper('getToUserIconClass' , function ( userId, action_id, options ) {
        var user = oThis.users[userId];

        if ( !user ) {
          return "u-kind-user";
        }

        var txType = oThis.transactionTypes[ action_id ];
        if ( txType && txType.kind && txType.kind.indexOf("_company") > 0 ) {
          return "u-kind-company";
        }

        return "u-kind-user";
      });


      Handlebars.registerHelper('getToUserName' , function ( userId , action_id, options ) {
        var user = oThis.users[userId];

        if ( !user ) {
          return "";
        }

        var txType = oThis.transactionTypes[ action_id ];
        if ( txType && txType.kind && txType.kind.indexOf("_company") > 0 ) {
          return "Company";
        }

        return user['name'];
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
        if( !oThis.isTransactionComplete( status ) ) {
          return options.fn(this);
        }else {
          return options.inverse(this);
        }
      });

      Handlebars.registerHelper('display_block_timeStamp', function(block_timeStamp, response) {
        if ( !block_timeStamp ) {
          return "NA";
        }
        // block_timeStamp should be millisecond;
        var momentTs = moment(block_timeStamp);

        return (momentTs.fromNow() + " (" + momentTs.utc().format("MMM-DD-YYYY hh:mm:ss A UTC") + ")");

      });

      Handlebars.registerHelper('ifTransactionComplete' , function (status  ,  options) {
        if( status == oThis.txStatus.COMPLETE ) {
          return options.fn(this);
        }else {
          return options.inverse(this);
        }
      });

      Handlebars.registerHelper('ifShowBlockNumber' , function (block_number  ,  options) {
        if( !PriceOracle.isNaN( block_number ) ) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });

      Handlebars.registerHelper('diplay_block_number' , function (block_number  ,  options) {
        if ( PriceOracle.isNaN( block_number ) ) {
          return "NA";
        }
        var bNumber = BigNumber( block_number );
        return bNumber.toString();
      });

      Handlebars.registerHelper('diplay_transaction_hash' , function (transaction_hash  ,  options) {
        if( typeof transaction_hash === "string" ) {
          return  '<a target="_blank" href="' +  oThis.viewTXDetailUrlPrefix + transaction_hash + '">' + transaction_hash + '</a>';
        }
        return "NA";
      });

      Handlebars.registerHelper('txName' , function (action_id  ,  options) {
        if( !action_id ) {
          return "";
        }
        var txType = oThis.transactionTypes[ action_id ];
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

      Handlebars.registerHelper('ifShouldShowRequestParam', function ( param_name ,response ) {
        console.log("param_name", param_name);
        var rowData =  response.data.root || {}
          , actionId = rowData.action_id
          , txType = oThis.transactionTypes[ actionId ]
        ;
        if (param_name === 'commission_percent'){
          var commissionPercent = txType.commission_percent;

          if (commissionPercent){
            return response.fn(this);
          }else{
            return response.inverse(this);;
          }
        }
        return response.fn(this);
      });
    }



  }

})(window ,  jQuery);