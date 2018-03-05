;
(function (window, $) {

  var logMe = false;

  if ( !window.console ) {
    window.console = {
      log: function () {}
      ,error: function () {}
    }
  }


  var jqDataNameSpace     = "ostNumberAutoCorrector";
  var eventNameSpace      = ".numberAutoCorrectEventNamesapce";
  var delegateAttr        = "data-ost-num-autocorrect-delegate-element"; /* FUTURE (MAY BE) */
  var autoBinderAttr      = "data-ost-num-autocorrect-element";
  var PluginClass;

  

  var Corrector = PluginClass = function (jElement ) {
    var oThis = this;

    oThis.jElement = jElement;
    oThis.onChange = function () {
      oThis.update();
    };
  }

  PluginClass.prototype = {
    constructor       : PluginClass
    , jElement        : null

    , update : function () { 
      var oThis = this;

      var jTarget = oThis.jElement
        /* Everything read from DOM */
        , valType     = jTarget.attr("type")
        , minVal      = jTarget.attr("min")   || undefined
        , maxVal      = jTarget.attr("max")   || undefined
        , stepVal     = jTarget.attr("step")  || undefined
        , targertVal  = Number( jTarget.val() )

        /* All Numbers */
        , minNum      = Number( minVal )
        , maxNum      = Number( maxVal )
        , stepNum     = Number( stepVal )
        , targertNum  = Number( targertVal )

        /* All BigNumbers */
        , stepBn      = BigNumber( stepNum )
        , targertBn   = BigNumber( targertNum )
        , finalVal    = targertVal

        /* Variables Required for step correction */
        /* e Values are values represented in exponential scale. */
        , toFixedFactor
        , eFactor
        , eStep
        , eVal
        , eFinal

        /* Everything else */
        
      ;



      /* Check for NaN */
      if ( targertBn.isNaN() ) {
        
        if ( isNaN( minNum ) ) {
          logMe && console.log("Corrector :: update :: targertBn & minNum is NaN");
          finalVal = 0;
        } else {
          logMe && console.log("Corrector :: update :: targertBn is NaN");
          finalVal = minNum;
        }
      } 
      /* Check for min. */
      else if ( !isNaN( minNum ) && targertVal < minNum ) {
        logMe && console.log("Corrector :: update :: targertBn < minNum");
        finalVal = minNum;
      }
      /* Check for max. */
      else if ( !isNaN( maxNum ) && targertVal > maxNum ) {
        logMe && console.log("Corrector :: update :: targertBn > maxNum");
        finalVal = maxNum;
      }

      /* Validate Step */
      else if ( !stepBn.isNaN() && !targertBn.modulo( stepBn ).isZero() ) {
        //Find Decimal Palces
        toFixedFactor = stepBn.decimalPlaces();

        //Some comment here that explains things below.
        eFactor   = BigNumber( 10 ).exponentiatedBy( toFixedFactor );
        eStep     = eFactor.multipliedBy( stepBn );
        eVal      = eFactor.multipliedBy( targertBn );

        //Calculate eFinal
        eFinal    = eVal.dividedBy( eStep );
        logMe && console.log("1 eFinal", eFinal.toString( 10 ) );
        eFinal    = eFinal.integerValue(BigNumber.ROUND_HALF_UP);
        logMe && console.log("2 eFinal", eFinal.toString( 10 ) );
        eFinal    = eFinal.multipliedBy( eStep );
        logMe && console.log("3 eFinal", eFinal.toString( 10 ) );

        //Calculate finalNum
        finalVal  = eFinal.dividedBy( eFactor );
        logMe && console.log("1 finalNum", finalVal.toString( 10 ) );
        finalVal  = parseFloat( finalVal.toString( 10 ) );
        logMe && console.log(
          "Corrector :: update :: Correcting step"
          , "\n\t targertVal", targertVal
          , "\n\t eFactor", eFactor.toString( 10 )
          , "\n\t eStep", eStep.toString( 10 )
          , "\n\t eVal", eVal.toString( 10 )
          , "\n\t eFinal", eFinal.toString( 10 )
          , "\n\t =====finalVal", finalVal
        );
      }

      logMe && console.log(
        "Corrector :: update ::"
        , "\n\t targertVal", targertVal
        , "\n\t valType", valType
        , "\n\t minVal", minVal
        , "\n\t maxVal", maxVal
        , "\n\t stepVal", stepVal
        
        , "\n\t =====finalVal", finalVal
      );
      oThis.updateVal( finalVal );
      


    }
    , updateVal: function ( newVal ) {
      var oThis = this;

      var jTarget = oThis.jElement;
      if ( jTarget.safeSetVal ) {
        jTarget.safeSetVal( newVal );
      } else if ( jTarget.setVal ) {
        jTarget.setVal( newVal );
      } else {
        jTarget.val( newVal );
      }

      if ( jTarget.valid ) {
        jTarget.valid();
      }
    }
    , start : function () {
      var oThis = this;


      var jTarget = oThis.jElement
        , args    = oThis.getOnOffArgs()
      ;

      jTarget.on.apply(jTarget,  args);
    }
    , stop : function () {
      var oThis = this;


      var jTarget = oThis.jElement
        , args    = oThis.getOnOffArgs()
      ;

      jTarget.off.apply(jTarget,  args);

    }


    , getOnOffArgs : function () {
      var oThis = this;

      var args = [
        "blur" + eventNameSpace
        + "change" + eventNameSpace
      ];
      if ( oThis.filter ) {
        args.push( oThis.filter );
      }

      args.push( oThis.onChange );

      return args;
    }
  };


  //jQuerry related stuff
  $.fn.extend({
    numberAutoCorrector: function ( config ) {
      var jElement          = $( this )
          , data            = jElement.data()
          , pluginInstance  = data[ jqDataNameSpace ]
      ;


      if ( !pluginInstance || !pluginInstance instanceof PluginClass ) {

        pluginInstance = new PluginClass( jElement );
        pluginInstance.start();
        jElement.data( jqDataNameSpace, pluginInstance );
        pluginInstance.update();
      }
      if ( config && typeof config === "object") {
        $.extend(pluginInstance, config );
      } 
      return pluginInstance;
    }
  });
  $( function () {
    var jElements = $("[" + autoBinderAttr + "]");
    jElements.each(function ( indx, jElement ) {
      var numberAutoCorrector = $( jElement ).numberAutoCorrector();
    });
  });


})(window, jQuery);