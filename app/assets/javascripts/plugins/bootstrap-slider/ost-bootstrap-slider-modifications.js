(function (window, $) {

  Slider.prototype._applyToFixedAndParseFloat =  function ( num , toFixedInput ) {
    var truncatedNum = num.toFixed( toFixedInput ) ,
        step =  this.options.step ,
        eFactor = BigNumber( 10 ^ toFixedInput ),
        eStep   = eFactor.multipliedBy( step ),
        eNum    = eFactor.multipliedBy( num ),
        eFinal  = eNum.dividedBy( eStep ),
        finalNum
    ;
    eFinal = eFinal.integerValue(BigNumber.ROUND_HALF_UP);
    eFinal = eFinal.multipliedBy( eStep );
    finalNum = eFinal.dividedBy( eFactor );

    console.log("num", num, "finalNum.toString( 10 )", finalNum.toString( 10 ) )
    return parseFloat( finalNum.toString( 10 ) );
  };

})(window, jQuery);