;
(function(window, $){

  if ( !window.console ) {
    window.console = {
      log: function () {}
      ,error: function () {}
    }
  }

  var jqDataNameSpace = "ostFormHelper";
  var eventNameSpace = "";
  var customFormInputAttr = "ost-formelement";
  var autoBinderAttr = "ost-formhelper";

  function FormHelper( jForm ) {
    this.jForm  = jForm;
    if ( !jForm.is("form") ) {
      console.log("FormHelper :: Error instantiating class. jForm :: ");
      console.log( jForm );
      throw "FormHelper only works on form elements.";
    }
  }

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


      }

      if ( !jqValidateOptions.submitHandler ) {
        jqValidateOptions.submitHandler = function () {
          console.log("jqValidateOptions.submitHandler triggered!");
          //Trigger cancelable beforeSubmit 
          if ( !oThis.triggerBeforeSubmit() ) {
            console.log("FormHelper :: beforeSubmit event has been canceled.");
            //Some listner has objected to form submission.
            return;
          }

          //Submit the form!
          oThis.submitForm();
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

    , triggerBeforeSubmit: function () {
      var oThis = this;

      //Let's assume form is valid.
      oThis.formValidity = true;

      //Make an event
      var event = $.Event( oThis.getBeforeSubmitEventName() );

      //Trigger it.
      oThis.jForm.trigger( event );

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
    , submitForm: function () {
      var oThis = this;

      //This method can be used to 'forcefully' submit the form.
      oThis.jqXhr = $.ajax({
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
        , dataFilter: function ( data, dataType ) {
          if ( oThis.dataFilter ) {
            oThis.dataFilter.apply(oThis, arguments );
          }

          if ( data && !data.success ) {
            //We have errors! Lets show them.
            oThis.showErrors( data );
          }

          return data;
        }
        , success: function () {
          if ( oThis.success ) {
            oThis.success.apply( oThis, arguments);
          }
        }
        , complete: function () {
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
      });
      
      oThis.triggerFormSubmit( oThis.jqXhr );

      return oThis.jqXhr;

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




    , showErrors: function ( data ) {

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
  });
  $( function () {
    jForms = $("[" + autoBinderAttr + "]");
    jForms.each(function ( indx, formEl ) {
      $( formEl ).formHelper();
    });
  });

})(window, jQuery);