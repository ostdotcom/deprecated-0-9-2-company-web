;
(function (window, $) {

  var ost  = ns("ost") ,
      Polling = ns("ost.Polling") ,
      utilities = ns("ost.utilities")
  ;
  var oThis = ost.tokenDeploy = {

    percentCompletion : 0 ,

    init : function (config) {
      $.extend(oThis, config);
      oThis.setTooltipPosition();
      oThis.getDeployStatus();
    },

    getDeployStatus : function() {

      var polling = new Polling({
        pollingApi : oThis.getDeployStatusEndPoint ,
        success : function ( response ) {
          if(response && response.success){
            var currentWorkflow = utilities.deepGet( response , "data.workflow_current_step" );
            oThis.updateProgessBar( currentWorkflow );
          }
        },
        isPollingRequired : function () {
          return oThis.percentCompletion == 100 ;
        }
      });

    },

    setTooltipPosition: function(percent_completion) {

        var tooltipOffsetLeft = 5;
        var arrowHalfLength = 6;
        var tooltipWidth = $(".tooltip").width(); //TODO specific name and cache

        if(typeof percent_completion === 'undefined') percent_completion = 0;

        $(".tooltip-text").text(percent_completion +"%"); //TODO specific name and cache

        $("div.tooltip").css({  //TODO specific name and cache
          left: Math.max(0, percent_completion-tooltipOffsetLeft)+'%'
        });
        $(".arrow").css({ //TODO specific name and cache
          left: tooltipWidth / 2 - arrowHalfLength
        });
    },

    updateProgessBar: function (currentStatus) {
        oThis.percentCompletion = currentStatus && currentStatus.percent_completion || 0 ;
        $(".progress-bar")[0].style.width = oThis.percentCompletion+'%'; //TODO specific name and cache
        $("#progressStep").html(currentStatus.display_text); //TODO specific name and cache
        oThis.setTooltipPosition( oThis.percentCompletion  );
    }
  };


})(window, jQuery);