;
(function (window , $) {

  var ost  = ns('OST'),
      users = {},
      transactionTypes = {},
      pendingTransactionsUUID = [],
      pollPendingTransactions = null,
      pollingApi , pollingTimeOut
  ;

  ost.simulator = {
    simulatorTable : null,

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
        if(transaction.status == 'pending') {
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
        if(status !== 'pending'){
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

      Handlebars.registerHelper('getUserName' , function (userId , options) {
        var user = users[userId] || {}
        ;
        return user['name'] ;
      });

      Handlebars.registerHelper('transactionFee', function(response ) {
        var rowData = response.data.root || {};
        if( rowData.gas_value ) {
          return PriceOracle.toOst(rowData.gas_value);
        }
      });

      Handlebars.registerHelper('ifTransactionPending' , function (status  ,  options) {
        if(status == 'pending') {
          return options.fn(this);
        }else {
          return options.inverse(this);
        }
      });

      Handlebars.registerHelper('timeStamp', function(response) {
        var rowData = response.data.root || {} ,
          timeStamp = rowData.block_timestamp
        ;
        return date;
      });
    }



  }

})(window ,  jQuery);