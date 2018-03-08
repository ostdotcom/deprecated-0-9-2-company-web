;
(function (window ,  $) {

  var contentsToBlur = "#app-header , #app-content" ;

  $('.modal').on('shown.bs.modal' , function () {
    $(contentsToBlur).addClass('blur-content');
  });

  $('.modal').on('hidden.bs.modal' , function () {
    $(contentsToBlur).removeClass('blur-content');
  });


})(window , jQuery);