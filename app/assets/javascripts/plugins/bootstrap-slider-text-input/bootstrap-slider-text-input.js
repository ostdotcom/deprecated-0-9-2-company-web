;
(function(window, $){

  var SliderTextInput = function(slider) {

    var SLIDER_NAMESPACE_MAIN = 'slider';
    var SLIDER_NAMESPACE_ALTERNATE = 'bootstrapSlider';
    if ($.fn.slider) {
      var SLIDER_NAMESPACE = SLIDER_NAMESPACE_MAIN;
    } else {
      var SLIDER_NAMESPACE = SLIDER_NAMESPACE_ALTERNATE;
    }

    var textInputLeft = $(slider).closest('.form-group').find('.slider-input-left input').get().shift()
    var textInputRight = $(slider).closest('.form-group').find('.slider-input-right input').get().shift()
    var textInputBottom = $(slider).closest('.form-group').find('.slider-input-bottom input').get().shift()
    var textInputTop = $(slider).closest('.form-group').find('.slider-input-top input').get().shift()
    var textInput = textInputLeft || textInputRight || textInputBottom || textInputTop;

    var sliderValueToTextInput = function () {
      var value = $(slider)[SLIDER_NAMESPACE]('getValue');

      if (Array.isArray(value)) {
        if ($(textInputLeft).val() !== value[0]) {
          $(textInputLeft).setVal(value[0]);
          $(textInputLeft).valid && $(textInputLeft).valid();
        }

        if ($(textInputRight).val() !== value[1]) {
          $(textInputRight).setVal(value[1]);
          $(textInputRight).valid && $(textInputRight).valid();
        }
      } else {
        if ($(textInput).val() !== value) {
          $(textInput).setVal(value);
          $(textInput).valid && $(textInput).valid();
        }
      }
    }



    var textInputValueToSlider = function (element) {
      var sliderValue = $(slider)[SLIDER_NAMESPACE]('getValue')
      var value = parseFloat($(element).val())

      if (Array.isArray(sliderValue)) {
        if (element === textInputLeft) {
          sliderValue[0] = value
        } else if (element === textInputRight) {
          sliderValue[1] = value
        }
      } else {
        sliderValue = value
      }

      $(slider)[SLIDER_NAMESPACE]('setValue', sliderValue)
    }

    var validateValues = function () {
      var valueLeft = parseFloat($(textInputLeft).val())
      var valueRight = parseFloat($(textInputRight).val())

      if (valueLeft > valueRight) {
        var tmp = valueLeft
        $(textInputLeft).setVal(valueRight)
        $(textInputRight).setVal(tmp);
        $(slider)[SLIDER_NAMESPACE]('setValue', [valueRight, valueLeft])
      }

      sliderValueToTextInput()
    }

    $(slider).change(function () {
      sliderValueToTextInput()
    })

    $(textInput).on('input change', function (event) {
      textInputValueToSlider(event.target)
    });

    $(textInput).on('blur', function (event) {
      validateValues()
    });

    sliderValueToTextInput();
  }

  $.bridget('sliderTextInput', SliderTextInput);

  $(function() {
    $("input[data-provide=slider]").sliderTextInput();
  });

})(window, jQuery);