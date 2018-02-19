;
(function (window ,  $) {

    var ost =  ns("ost")
    ;

    ost.users = {
        simpleDataTable : null,
        init : function ( config ) {
            var oThis =  this
            ;
            oThis.handelBarHelpers();
            oThis.simpleDataTable =   new ost.SimpleDataTable( );
            oThis.bindEvents();
        },

        bindEvents : function () {
            var oThis =  this;
            $('#add_users').on('click' , function () {
                var jResult = oThis.simpleDataTable.prependResult(getNewUser()),
                    jForm = jResult.find("form");
                jForm.formHelper();
            });

            $('.save-user-btn').on('click' , function () {

            });

            $('.cancel-user-btn').on('click' ,  function () {
                $(this).closest('tr').remove();
            });
        },

        handelBarHelpers : function () {
            var oThis =  this;

            Handlebars.registerHelper('ifUser', function( id  , options ) {
              if( id > 0 ){
                  return options.fn(this);
              }else {
                  return options.inverse(this);
              }
            });
        }


    };

    function getNewUser() {
        return {
            id: -Date.now(),
            name: null,
            token_balance: null,
            total_airdropped_tokens: null
        }
    }

})(window , jQuery);