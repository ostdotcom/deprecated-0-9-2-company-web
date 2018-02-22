;
(function (window , $) {

  var ost  = ns('ost'),
      users = {},
      transactionTypes = {}
  ;

  ost.simulator = {
    simulatorTable : null,

    init : function () {
      var oThis =  this
      ;

      oThis.initHandleBarHelpers();
      oThis.bindEvents();

      if( !oThis.simulatorTable ) {
        oThis.simulatorTable =  new ost.SimpleDataTable( {
          resultFetcher: function ( currentData, lastMeta, callback ) {
            var wrapperCallBack = function ( response ) {
              oThis.updateUsersHash( response );
              oThis.updateTransactionTypesHash( response );
              callback && callback.apply( null , arguments );
            };

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
    },

    bindEvents : function () {
      var oThis =  this
      ;

      $('.run-transaction-btn').on('click' ,  function () {
        oThis.simulateTransaction()
      });
    },

    simulateTransaction: function () {

    },

    updateUsersHash : function (response) {
      var data = response && response.data ,
          updatedUsers  = data &&  data.economy_users
      ;
      $.extend(users , updatedUsers);
    },

    updateTransactionTypesHash : function (response) {
      var data = response && response.data ,
          updatedTransactionTypes  = data &&  data.transaction_types
      ;
      $.extend(transactionTypes , updatedTransactionTypes);
    },

    initHandleBarHelpers : function ( ) {
      var date = new Date();

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

      Handlebars.registerHelper('timeStamp', function(response) {
        var rowData = response.data.root || {} ,
          timeStamp = rowData.block_timestamp
        ;
        return date;
      });
    }



  }

})(window ,  jQuery);