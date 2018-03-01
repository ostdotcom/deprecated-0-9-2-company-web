;
(function (window , $) {

  var ost  = ns('ost'),
      users = {},
      transactionTypes = {},
      pendingTransactionsUUID = [],
      pollPendingTransactions = null,
      pollingApi , pollingTimeOut
  ;



  var oThis = ost.simulator = {
    simulatorTable : null,
    txStatus: {
      "PENDING": "processing",
      "PROCESSING": "processing",
      "COMPLETE": "complete",
      "FAILED": "failed"
    },

    init : function ( config ) {
      var oThis =  this;
      $.extend(oThis, config);

      pollingApi = config["tx_status_polling_url"];
      pollingTimeOut = config["long_poll_timeout_millisecond"];
      oThis.initHandleBarHelpers();
      oThis.createDataTable();
      oThis.bindEvents();
    },

    createDataTable: function () {
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
    },

    bindEvents : function () {
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

    },

    createNewTransaction : function (response) {
      var oThis =  this,
          data  =  response && response.data,
          transactions = data && data.transactions
      ;
      oThis.updateRequiredDetails(response);
      oThis.simulatorTable.prependResult(transactions[0]);
    },

    updateRequiredDetails : function (response) {
      var oThis =  this,
          data  = response && response.data
      ;
      oThis.updateDisplayContent( data );
      oThis.updateUsersHash( data );
      oThis.updateTransactionTypesHash( data );
      oThis.setPendingTransactions( data );
      oThis.pollPendingTransactions( );
    },

    updateDisplayContent : function ( data )  {
      var transactions = data && data.transactions,
          jFirstTransactionWrapper = $('.first-transaction-wrapper'),
          jTransactionHistoryWrapper = $('.transaction-history-wrapper')
      ;
      if(transactions && transactions.length > 0){
        jFirstTransactionWrapper.hide();
        jTransactionHistoryWrapper.show();
      }else {
        jFirstTransactionWrapper.show();
        jTransactionHistoryWrapper.hide();
      }
    },

    updateUsersHash : function (data) {
      var updatedUsers  = data.economy_users || {};
      $.extend(users , updatedUsers);
    },

    updateTransactionTypesHash : function (data) {
      var updatedTransactionTypes = data.transaction_types || {};
      $.extend(transactionTypes , updatedTransactionTypes);
    },

    setPendingTransactions : function ( data ) {
      var oThis = this,
          transactions = data && data.transactions,
          transaction
      ;
      for( var i = 0 ;  i < transactions.length  ; i++ ){
        transaction = transactions[i];
        if(transaction.status == oThis.txStatus.PENDING ) {
          oThis.pushPendingTransactions(transaction.transaction_uuid);
        }
      }
    },

    pollPendingTransactions : function () {
      var oThis = this
      ;
      if(oThis.isPollingRequired()){
        oThis.startPolling();
      }else {
        oThis.stopPolling();
      }
    },

    startPolling : function () {
      var oThis = this
      ;
      pollPendingTransactions =  setTimeout( function () {
        $.get({
          url: pollingApi,
          data : {transaction_uuids : pendingTransactionsUUID},
          success: function ( response ) {
            if ( response.success ) {
              oThis.updatePendingTransaction(response);
              oThis.pollPendingTransactions();
            }
          },
          error : function () {
            console.log('error occured in polling');
            oThis.pollPendingTransactions();
          }
        });
      } , pollingTimeOut )
    },

    updatePendingTransaction : function ( response ) {
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
    },

    stopPolling : function () {
      clearTimeout(pollPendingTransactions);
    },

    isPollingRequired : function () {
      return pendingTransactionsUUID.length > 0 ;
    },

    pushPendingTransactions : function (uuid) {
      if(pendingTransactionsUUID.indexOf(uuid) < 0){
          pendingTransactionsUUID.push(uuid);
      }
    },

    popPendingTransactions : function (uuid) {
      var index = pendingTransactionsUUID.indexOf(uuid);
      if( index > -1  ){
        pendingTransactionsUUID.splice(index ,  1);
      }
    },

    initHandleBarHelpers : function ( ) {
      var oThis = this,
          date = new Date();

      Handlebars.registerHelper('getUserIconClass' , function (userId , options) {
        var user = users[userId];

        if ( !user ) {
          return "u-kind-user";
        }

        if ( "reserve" === user.kind ) {
          return "u-kind-company"
        }

        return "u-kind-user";
      });


      Handlebars.registerHelper('getUserName' , function (userId , options) {
        var user = users[userId];

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
          return PriceOracle.toOst(transaction_fee) + "OST";
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
          return transaction_hash;
        }
        return "NA";
      });

      Handlebars.registerHelper('txName' , function (transaction_type_id  ,  options) {
        if( !transaction_type_id ) {
          return "";
        }
        var txType = transactionTypes[ transaction_type_id ];
        if ( !txType ) {
          return "";
        }
        return txType.name;
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