//step_3_link

;
(function (window, $) {
  var ost     = ns("ost")
    , planner = ns("ost.planner")
  ;
  var oThis = ost.planner.step2 = {
    jNext: null
    , init: function( config ) {
      var oThis = this;

      oThis.jNext = $("#step_3_link");

      if( ost.transactions && ost.transactions.auto_create_transactions ) {
        oThis.jNext.prop("disabled", true);
        $( ost.transactions ).on( ost.transactions.events.transactionsAutoCreated, function () {
          oThis.jNext.prop("disabled", false);
        });
      }
    }
  };

})(window, jQuery);