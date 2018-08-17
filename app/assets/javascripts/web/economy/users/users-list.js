;
(function (window ,  $) {

    var ost =  ns("ost")
        , users = ns("ost.users")
        , savedUserId = null
    ;

    var oThis = users.list = {
      simpleDataTable : null,
      init : function ( config ) {

        $('#show_empty_user').hide();
        $("#user_right_button_wrap").hide();

          var oThis =  this,
              isAirDropInProcess
          ;
          oThis.handelBarHelpers();
          oThis.simpleDataTable =   new ost.SimpleDataTable({
            jParent : $("#user_list")
            , params  : {order_by: "created"}
            , resultFetcherCallback : function ( results ) {
              if ( results && results.length > 0 ) {
                $('#show_user_list').show();
                $('#show_empty_user').hide();
              } else {
                $('#show_user_list').hide();
                $('#show_empty_user').show();
              }
              $("#user_right_button_wrap").show();
              oThis.simpleDataTable.resultFetcherCallback = null;
            }
          });


          oThis.bindEvents();
          isAirDropInProcess = $('.users-list-container').data('airdrop-processing');
          if(!!isAirDropInProcess){
            $('#airdrop_token_modal').modal('show');
          }


          // $('#show_user_list').hide()
          // $('#show_empty_user').hide()
      }
      , bindEvents : function () {
            var oThis =  this ,
                config =  { success :  function () {
                                            var jForm = this.jForm;
                                            savedUserId = jForm.data('user-id');
                                            oThis.onFormSuccess.apply(oThis, arguments);
                                       }
                          }
                ;

            $('#add_users').on('click' , function () {
              //console.log("in btn click")
                var jResult = oThis.simpleDataTable.prependResult(createNewUser()),
                    jForm = jResult.find("form");
                jForm.formHelper( config );
                oThis.autoFocus();
            });

            $('#add_new_user').on('click' , function () {
              console.log("in btn click");
              $('#show_empty_user').hide();
              $('#show_user_list').show();
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

      updateNewAddedUser : function ( response ) {
          if( response && response.success ) {
              var oThis       =  this
                , data        = response['data'] || {}
                , newData     = data["user"]
                , currentData
              ;

              currentData = oThis.simpleDataTable.getResultById( savedUserId );
              console.log("currentData", currentData);
              console.log("newData", newData);

              $.extend(currentData , newData);
              console.log("finalData", currentData);
              oThis.updateUserMode(currentData);
              oThis.simpleDataTable.updateResult( currentData );
          }
      },

      updateUserMode : function (currentData) {
          delete currentData['mode'];
      },

      showAirDropTokenEditor : function () {
          ost.users.airDropEditor.showEditor();
      }

      , handelBarHelpers : function () {
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
            airdropped_tokens: null,
            mode: 'new'
        }
    }

})(window , jQuery);