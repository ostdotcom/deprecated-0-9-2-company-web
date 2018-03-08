;
(function(window, $){

  if ( !window.console ) {
    window.console = {
      log: function () {}
      ,error: function () {}
    }
  }


  var jqDataNameSpace     = "ostFormHelper";
  var eventNameSpace      = "";
  var customFormInputAttr = "ost-formelement";
  var autoBinderAttr      = "data-ost-formhelper";

  var FormHelper = window.FormHelper = function  ( jForm ) {
    this.jForm  = jForm;
    if ( !jForm.is("form") ) {
      console.log("FormHelper :: Error instantiating class. jForm :: ");
      console.log( jForm );
      throw "FormHelper only works on form elements.";
    }
  };

  FormHelper.eventNameSpace  = eventNameSpace;
  FormHelper.jqDataNameSpace = jqDataNameSpace;

  FormHelper.prototype = {
    jForm: null
    //Error Container Template
    , formInputSelectors : ["input", "select", "textarea"]

    //Callbacks
    , beforeSend : null
    , success: null
    , error: null
    , complete: null
    , autoDisableSubmitBtn: true
    , autoEnableSubmitBtn: true

    , init: function() {
      var oThis = this;
      oThis.bindValidator();

    }

    /* BEGIN: Form Validity Properties and methods. */
    , jqValidateOptions: null
    , validator: null
    , bindValidator: function () {
      var oThis = this
        , jForm = oThis.jForm
        , jqValidateOptions = oThis.jqValidateOptions
      ;
      if ( !jqValidateOptions ) {
        oThis.jqValidateOptions = jqValidateOptions = {};
      }

      if ( !jqValidateOptions.submitHandler ) {
        jqValidateOptions.submitHandler = function () {
          try {
            oThis.submitHandler.apply(oThis, arguments);
          } catch( ex ) {
            console.log("IMPORTANT :: ERROR SUBMITING FORM");
            console.log( ex );
          }
          
        }
      }

      if ( !jqValidateOptions.showErrors ) {
        jqValidateOptions.showErrors = function () {
          var oValidator = this;
          // this.defaultShowErrors();
          oThis.showErrors.apply(oThis, arguments);
          oValidator.hideErrors();
        }
      }

      oThis.validator = jForm.validate( jqValidateOptions );

    }

    /* END: Form Validity Properties and methods. */

    /* BEGIN: BeforeSubmit Event */
    /*
      beforeSubmit event is cancelable event.
      Listners can cancel this event to indicate they want to prevent form from submission.
    */
    , getBeforeSubmitEventName: function () {
      return eventNameSpace + "beforeSubmit";
    }

    , triggerBeforeSubmit: function ( ajaxConfig ) {
      var oThis = this;

      //Let's assume form is valid.
      oThis.formValidity = true;

      //Make an event
      var event = $.Event( oThis.getBeforeSubmitEventName() );

      //Trigger it.
      oThis.jForm.trigger( event, [ajaxConfig] );

      //Return false, if the event has been canceled.
      return !event.isDefaultPrevented();
    }
    /* END: BeforeSubmit Event*/

    /* BEGIN: submitForm Method, properties and events */
    , jqXhr : null
    , isFormSubmitInProgress: function () {
      //Return if jqXhr exists.
      return true && this.jqXhr;
    }

    , submitHandler : function (form, event) {
      var oThis = this;

      console.log("jqValidateOptions.submitHandler triggered!");

      //Clear all errors
      oThis.clearErrors();

      //Generate AjaxConfig
      var ajaxConfig = oThis.getAjaxConfig();
      //Trigger cancelable beforeSubmit 
      if ( !oThis.triggerBeforeSubmit( ajaxConfig ) ) {
        console.log("FormHelper :: beforeSubmit event has been canceled.");
        //Some listner has objected to form submission.
        return;
      }

      //Change submit btn text.
      oThis.updateSubmitText();

      //Submit the form!
      oThis.submitForm( ajaxConfig );
    }

    , updateSubmitText: function () {

    }

    , submitForm: function ( ajaxConfig ) {

      var oThis = this;


      //Change the text
      oThis.jForm.find("[data-submiting]").each(function ( indx, el) {
        var jEL = $( el );
        jEL.data("beforeSubmitText", jEL.text() );
        jEL.text( jEL.data("submiting") );
        oThis.autoDisableSubmitBtn && jEL.prop('disabled', true);
      });
      

      //This method can be used to 'forcefully' submit the form.
      ajaxConfig = ajaxConfig || oThis.getAjaxConfig();
      oThis.jqXhr = $.ajax( ajaxConfig );
      
      oThis.triggerFormSubmit( oThis.jqXhr );

      return oThis.jqXhr;

    }

    , getAjaxConfig: function () {
      var oThis = this;
      
      return {
        url: oThis.getActionUrl()
        , method: oThis.getActionMethod()
        , data: oThis.getSerializedData()
        , beforeSend: function (jqXHR, settings) {
          //Populate jqXHR so that ajaxHooks knows where to populate general error.
          jqXHR.ost = {
            jParent: oThis.jForm
          };
          if ( oThis.beforeSend ) {
            oThis.beforeSend(jqXHR, settings);
          }
        }

        , error: function ( jqXHR, textStatus, errorThrown ) {
          if ( oThis.error ) {
            oThis.error.apply(oThis, arguments );
          }
        }

        , dataFilter: function ( strResponse, dataType ) {
          if ( oThis.dataFilter ) {
            oThis.dataFilter.apply(oThis, arguments );
          }
          var resp = JSON.parse( strResponse );

          if ( resp && !resp.success ) {
            //We have errors! Lets show them.
            oThis.showServerErrors( resp );
          }

          return strResponse;
        }
        , success: function (response) {
          if ( oThis.success ) {
            oThis.success.apply( oThis, arguments);
          } else if ( response.success && oThis.jForm.data("redirect") ) {
            window.location = oThis.jForm.data("redirect");
          }
        }
        , complete: function () {
          //Revert back the submit text
          oThis.jForm.find("[data-submiting]").each(function ( indx, el) {
            var jEL = $( el );
            jEL.text( jEL.data("beforeSubmitText") );
            oThis.autoEnableSubmitBtn && jEL.prop('disabled', false);
          });

          if ( oThis.complete ) {
            oThis.complete.apply( oThis, arguments);
          }

          //Make sure to reset it. Or else...
          //the next request will NOT go.
          oThis.jqXhr = null;

        }

        , statusCode: { 
          401: function () {
            //Redirect to Login.
            window.location = '/login';
          }
        }
      };
    }

    , getFormSubmitEventName: function () {
      return eventNameSpace + "formSubmit";
    }
    , triggerFormSubmit: function ( jqXHR ) {
      var oThis = this;

      //Let's assume form is valid.
      oThis.formValidity = true;

      //Make an event
      var event = $.Event( oThis.getFormSubmitEventName() );

      //Trigger it.
      oThis.jForm.trigger( event, [jqXHR] );

    }
    /* END: submitForm Method, properties and events */


    /* BEGIN: action url of Form */
    , getActionUrl: function () {
      var oThis = this;
      return oThis.jForm.attr("action");
    }
    , isActionUrlValid: function () {
      var oThis = this;

      var actionUrl = oThis.getActionUrl();
      if ( actionUrl.length > 0 ) {
        return true;
      } else {
        console.log("FormHelper :: Action Url is invalid");
      }
      return false;
    }
    /* END: action url of Form */

    /* BEGIN: METHOD of Form */
    , getActionMethod: function () {
      var oThis = this;
      return oThis.jForm.attr("method");
    }
    , isActionMethodValid: function () {
      var oThis = this;

      var validMethods = ["POST", "GET", "PUT"];

      var actionMethod = oThis.getActionUrl() || "INVALID";
      if ( validMethods.indexOf( actionMethod ) >= 0 ) {
        return true;
      } else {
        console.log("FormHelper :: Action Mehtod is invalid. Specified method : " + actionMethod);
      }
      return false;
    }
    /* END: METHOD of Form */

    , getSerializedData: function() {
      var oThis = this
        , jForm = oThis.jForm
        , data  = jForm.serializeArray()
        , jCustomElements = jForm.find( customFormInputAttr );
      ;

      jCustomElements.each(function ( indx, el ){
        var jEl = $( el )
            ,elData = {
              name: jEl.attr("name")
              , value: jEl.val()
            }
        ;
        data.push( elData );
      });

      return data;
    }


    , showServerErrors: function ( response ) {
      var oThis = this;

      var serverErrors = response.err.error_data || {};
      if ( serverErrors instanceof Array ) {
        //Hack for now.
        serverErrors = serverErrors[ 0 ] || {};
      }
      oThis.validator.showErrors( serverErrors );

      var generalErrorMessage = response.err.display_text;

      if ( generalErrorMessage ) {
        oThis.jForm.find(".general_error")
          .addClass("is-invalid")
          .html( generalErrorMessage );
      }
    }

    , clearErrors: function () {
      var oThis = this;
      oThis.jForm.find(".is-invalid").removeClass("is-invalid");
    }

    , showErrors: function ( mapData, arrayData ) {
      try {
        var oThis = this;

        $.each(arrayData, function(indx, errorData ) {
          if ( errorData.element ) {
            var jEl = $( errorData.element );
            
            var jError = jEl.parent()
                .find(".invalid-feedback")
            ;
            if ( !jError.length ) {
              jError = jEl.closest(".form-group")
                .find(".invalid-feedback")
              ;
            }

            jEl.addClass("is-invalid");
            jError.addClass("is-invalid");
            jError.length && jError.html( errorData.message );
          }        
        });

        var validElements = oThis.validator.validElements();
        validElements.each(function (indx, el) {
          var jEl = $(el);

          var jError = jEl.parent()
              .find(".invalid-feedback")
          ;
          if ( !jError.length ) {
            jError = jEl.closest(".form-group")
              .find(".invalid-feedback")
            ;
          }

          jEl.removeClass("is-invalid");
          jError.removeClass("is-invalid");
        });
      } catch( ex ) {
        //Keep the try catch. Please :) ~ Rachin Kapoor
        console.log( ex );
      }

    }

  };




  //jQuerry related stuff
  $.fn.extend({
    formHelper: function ( config ) {
      var jEl = $( this )
          ,helper = jEl.data( jqDataNameSpace );
      ;

      if ( !helper || !helper instanceof FormHelper ) {
        helper = new FormHelper( jEl );
        jEl.data( jqDataNameSpace, helper );
        helper.init();
      }
      if ( config && typeof config === "object") {
        $.extend(helper, config );
      } 
      return helper;
    }
    , setVal: function ( val, orgEvent ) {
      var jEl       = $( this )
        , preVal    = jEl.val()
        , strPreVal = String( preVal )
        , strVal    = String( val )
      ;

      if ( strVal === strPreVal ) {
        return false;
      }
      // console.log(" id\t\t\t|",jEl.prop("id"), "\n preVal\t\t|", preVal, "\n val\t\t|", val, "\n orgEvent\t|", orgEvent, "\n strPreVal\t|", strPreVal, "\n strVal\t\t|", strVal );
      $.fn.val.call( this, val );

      var eventArgs = args = Array.prototype.slice.call(arguments);
      jEl.trigger("change", eventArgs);
      return true;
    }
    , safeSetVal : function ( val, orgEvent ) { 
      var jEl = $( this );

      if ( orgEvent &&  jEl.is( orgEvent.currentTarget ) ) {
        return false;
      }
      
      return $.fn.setVal.apply( this, arguments);
    }
  })
  $( function () {
    jForms = $("[" + autoBinderAttr + "]");
    jForms.each(function ( indx, formEl ) {
      $( formEl ).formHelper();
    });
    // For eye toggle
    $('.input-group-eye').click(function(){
      var $elem = $(this).closest('.input-group').find('.form-control-input-group');
      if($elem.attr('type') == 'text'){
        $(this).find('svg.icon').css('fill', '#d3e3e5');
        $elem.attr('type','password');
      } else {
        $(this).find('svg.icon').css('fill', '#597A84');
        $elem.attr('type','text');
      }
    });
  });

})(window, jQuery);