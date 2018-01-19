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

  $.fn.extend({
    formHelper: function () {
      var jEl = $( this )
          ,helper = jEl.data( jqDataNameSpace );
      ;

      if ( !helper || !helper instanceof FormHelper ) {
        helper = new FormHelper( jEl );
      }

      return helper;
    }
  });

  function FormHelper( jForm ) {
    this.jForm  = jForm;
    if ( !jFomr.is("form") ) {
      console.log("FormHelper :: Error instantiating class. jForm :: ");
      console.log( jForm );
      throw "FormHelper only works on form elements.";
    }

    this.init();

  }

  FormHelper.eventNameSpace  = eventNameSpace;
  FormHelper.jqDataNameSpace = jqDataNameSpace;

  FormHelper.prototype = {
    jForm: null
    //Callbacks
    , beforeSend : null
    , success: null
    , error: null
    , complete: null

    , init: function() {
      var oThis = this;

      //Event listerns
      oThis.bindOnSubmit();
      oThis.bindOnValidateForm();

    }

    , bindOnSubmit: function () {
      var oThis = this;
      oThis.jForm.on('submit', function ( event ) {

        //Check if form is already submitting.
        if ( oThis.isFormSubmitInProgress() ) {
          console.log("FormHelper :: Form Submit already in progress");
          return;
        }

        //Supress the submit event.
        event.preventDefault();

        //Trigger triggerValidateForm.
        oThis.triggerValidateForm();

        //Check the validity of form inputs.
        if ( !oThis.isFormValid() ) {
          //Some errors.
          console.log("FormHelper :: Form inputs are not valid");
          return;
        }

        //Trigger cancelable beforeSubmit 
        if ( !oThis.triggerBeforeSubmit() ) {
          console.log("FormHelper :: beforeSubmit event has been canceled.");
          //Some listner has objected to form submission.
          return;
        }

        //Submit the form!
        oThis.submitForm();


      });
    }

    /* BEGIN: Form Validity Properties and methods. */
    , formValidity: true
    , isFormValid: function () {
      return this.formValidity;
    }
    , updateFormValidity: function ( isValid ) {
      var oThis = this;

      //Caller can listen to "ost.validateForm" event and set form as invalid by using this method.
      //Multiple event listerns can listen to the event and set validity as needed. 
      //So, we will always && with existing value.
      //This means formValidity needs to be reset to true by triggerValidateForm method.
      oThis.formValidity = oThis.formValidity && isValid;

    }
    , getValidateFormEventName: function () {
      return eventNameSpace + "validate";
    }
    , triggerValidateForm: function () {
      var oThis = this;


      //Let's assume form is valid.
      oThis.formValidity = true;

      //Make an event
      var event = $.Event( oThis.getValidateFormEventName() );

      //Trigger it.
      oThis.jForm.trigger( event );
    }
    , bindOnValidateForm: function () {
      var oThis = this;
      oThis.jForm.on( oThis.getValidateFormEventName(), function () {
        oThis.validateForm();
      });
    }
    , validateForm: function () {
      var oThis = this;

      var isValid = true;
      isValid = oThis.isActionMethodValid() && isValid;
      isValid = oThis.isActionUrlValid() && isValid;

      oThis.updateFormValidity( isValid );

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
      var oThis = this;
      return oThis.jForm.serializeArray();
    }




    , showErrors: function ( data ) {

    }

  };

})(window, jQuery);