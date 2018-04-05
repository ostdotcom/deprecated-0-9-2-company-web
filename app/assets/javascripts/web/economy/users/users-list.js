;
(function (window ,  $) {

    var ost =  ns("ost")
        , users = ns("ost.users")
        , savedUserId = null
    ;

    var oThis = users.list = {
        simpleDataTable : null,
        init : function ( config ) {
            var oThis =  this,
                isAirDropInProcess
            ;
            oThis.handelBarHelpers();
            oThis.simpleDataTable =   new ost.SimpleDataTable({
                jParent : $("#user_list"),
                params  : {order_by: "creation_time"}
            });
            oThis.bindEvents();
            isAirDropInProcess = $('.users-list-container').data('airdrop-processing');
            if(!!isAirDropInProcess){
              $('#airdrop_token_modal').modal('show');
            }
        },

        bindEvents : function () {
            var oThis =  this ,
                config =  { success :  function () {
                                            var jForm = this.jForm;
                                            savedUserId = jForm.data('user-id');
                                            oThis.onFormSuccess.apply(oThis, arguments);
                                       }
                          }
                ;

            $('#add_users').on('click' , function () {
                var jResult = oThis.simpleDataTable.prependResult(createNewUser()),
                    jForm = jResult.find("form");
                jForm.formHelper( config );
                oThis.autoFocus();
            });

            $('#user_list').on('click' , '.cancel-user-btn' ,  function () {
                var jForm =  $(this).closest('.add-user-form'),
                    userId = jForm && jForm.data('user-id');

                var resultToDelete =oThis.simpleDataTable.getResultById( userId );
                console.log("resultToDelete" , resultToDelete );
                oThis.simpleDataTable.deleteResult( resultToDelete );
            });

            $('#airdrop_btn').on('click' ,  function () {
                oThis.showAirDropTokenEditor();
            });
        },

       autoFocus : function() {
         var jUserNameInput =  $('.add-user-name-input');
         if( jUserNameInput && jUserNameInput.length > 0 ) {
           jUserNameInput.eq(0).focus();
         }
       },

        onFormSuccess : function ( response ) {
            var oThis =  this;
            oThis.updateNewAddedUser(response);
        },

        updateNewAddedUser : function (responces) {
            if( responces && responces.success ) {
                var oThis   =  this ,
                    data    = responces && responces['data'],
                    result_type = data && data['result_type'],
                    newData = result_type && data[result_type][0],
                    currentData
                ;
                currentData = oThis.simpleDataTable.getResultById( savedUserId );
                $.extend(currentData , newData);
                oThis.updateUserMode(currentData);
                oThis.simpleDataTable.updateResult( currentData );
            }
        },

        updateUserMode : function (currentData) {
            delete currentData['mode'];
        },

        showAirDropTokenEditor : function () {
            ost.users.airDropEditor.showEditor();
        },

        handelBarHelpers : function () {
            var oThis =  this;

            Handlebars.registerHelper('ifEditUser', function( mode  , options ) {
              if( mode === 'new' || mode === 'edit' ){
                  return options.fn(this);
              }else {
                  return options.inverse(this);
              }
            });
        }

    };

    function createNewUser() {
        return {
            id: -Date.now(),
            name: null,
            token_balance: null,
            total_airdropped_tokens: null,
            mode: 'new'
        }
    }

})(window , jQuery);