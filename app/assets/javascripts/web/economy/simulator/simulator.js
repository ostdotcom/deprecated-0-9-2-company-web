;
(function (window , $) {

  var ost  = ns('ost'),
      users = {},
      transactionTypes = {},
      pendingTransactionsUUID = [],
      pollPendingTransactions = null,
      pollingApi , pollingTimeOut
  ;

  ost.simulator = {
    simulatorTable : null,

    init : function () {
      var oThis =  this,
          jPollingEl =  $('#polling-config');
      ;
      pollingApi = jPollingEl.data('polling-api');
      pollingTimeOut = jPollingEl.data('polling-timeout');
      oThis.initHandleBarHelpers();
      oThis.bindEvents();

      if( !oThis.simulatorTable ) {
        oThis.simulatorTable =  new ost.SimpleDataTable( {
          resultFetcher: function ( currentData, lastMeta, callback ) {
            var wrapperCallBack = function ( response ) {
              oThis.updateRequiredDetails( response );
              callback && callback.apply( null , arguments );
            };

            var fetcherScope = this,
                fetcher = ost.SimpleDataTable.prototype.resultFetcher,
                args = Array.prototype.slice.call(arguments)
            ;

            args.pop();
            args.push(wrapperCallBack);
            fetcher.apply(fetcherScope, args);
            oThis.pollPendingTransactions( );
          }
        });
      }
    },

    bindEvents : function () {
      var oThis =  this
      ;

      $('.run-transaction-btn').on('click' ,  function () {
        var api = $(this).data('run-transaction-api');
        oThis.runTransaction(api);
      });
    },

    runTransaction: function (api) {
      var oThis =  this;
      $.ajax({
        url: api,
        method: "POST",
        success: function ( response ) {
          if ( response.success ) {
            oThis.addNewTransaction(response);
          }
        }
      });
    },

    addNewTransaction : function (response) {
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
      oThis.updateUsersHash( data );
      oThis.updateTransactionTypesHash( data );
    },

    updateUsersHash : function (data) {
      var updatedUsers  = data.economy_users || {};
      $.extend(users , updatedUsers);
    },

    updateTransactionTypesHash : function (data) {
      var updatedTransactionTypes = data.transaction_types || {};
      $.extend(transactionTypes , updatedTransactionTypes);
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
          status , id
      ;
      if( !transactions || transactions.length == 0 ) return;
      for(var i = 0 ;  i < transactions.length ; i++) {
        newTransaction = transactions[i] ;
        status = newTransaction['status'] ;
        id = newTransaction[id] ;
        if(status !== 'pending'){
          currentTransaction = oThis.simulatorTable.getElementById(id , 'transaction_uuid');
          $.extend( currentTransaction , newTransaction);
          oThis.simpleDataTable.updateResult( currentTransaction );
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

      Handlebars.registerHelper('fromUserName' , function (fromUserId , options) {
        var user = users[fromUserId] || {}
        ;
        return user['name'] ;
      });

      Handlebars.registerHelper('toUserName' , function (toUserId , options) {
        var user = users[toUserId] || {}
        ;
        return user['name'] ;
      });

      Handlebars.registerHelper('transactionFee', function(response ) {
        var rowData = response.data.root || {};
        if( rowData.gas_value ) {
          return PriceOracle.toOst(rowData.gas_value);
        }
      });

      Handlebars.registerHelper('ifTransactionPending' , function (status  , uuid ,  options) {
        if(status == 'pending') {
          /*
          * TODO wrong way
          * Confirm if UI logic updates your functional logic, if not confirm why.
          * One disadvantage is that pendingTransactionsUUID is getting updated from here will be tricky to understand.
          * */
         oThis.pushPendingTransactions(uuid);
          return options.fn(this);
        }else {
          oThis.popPendingTransactions(uuid);
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