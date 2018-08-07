;
(function (window, $) {
  var parentNS  = ns("ost");

  var oThis = parentNS.ostScan = {
    config: {
        apiCallInterval : 1000
      , validateTransactionHashMaxTry: 100
      , getBalanceMaxTry: 10
      , simpleTokenContractAddress: "0x2C4e8f2D746113d0696cE89B35F0d8bF88E0AEcA"

    }
    , init: function ( config ) {
      var oThis = this;

      if ( config ) {
        $.extend( oThis.config, config );
      }
    }
    , getUserOstEthBalance : function (address, callback) {

      $.ajax( {
          url:"/api/economy/users/fetch-balances",
          data: {
           "address" :address
          },
          type:"GET",
          success:function(response){
            callback && callback( response );
          },
          error : function (response ) {
            callback && callback( response );
          }
        }

      );

    }



  };

})(window, jQuery);