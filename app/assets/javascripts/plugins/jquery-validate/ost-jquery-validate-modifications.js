(function (window, $) {
  
  $.validator.prototype.checkForm = function() {
    this.prepareForm();
    var elements = (this.currentElements = this.elements())
        , i = 0;
    ;
    while ( elements[i] ) {
      var foundElements = this.findByName( elements[i].name );
      if (foundElements.length != undefined && foundElements.length > 1 ) {
        for (var cnt = 0; cnt < foundElements.length; cnt++) {
          this.check( foundElements[cnt] );
        }
      } else {
        this.check( elements[i] );
      }
      i++;
    }
    return this.valid();
  };

})(window, jQuery);