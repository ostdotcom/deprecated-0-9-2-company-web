(function (window ,  $) {

  var ost = ns('ost');
   ost.carousel = {};

  ost.carousel.home = {

    init : function (data) {
      console.log(data);
      initHandleBarHelper();
      createCarousel(data);
      initCarousel();
    }

  };

  function createCarousel(data) {
    var oneElCarousel = Handlebars.compile($("#one-el-carousel").html()),
        towElCarousel = Handlebars.compile($("#two-el-carousel").html()),
        jWrapper = $('#carousel-wrapper'),
        jMarkup
      ;
    jWrapper.empty();
    jWrapper.append(oneElCarousel(data[0]));
    for(var i = 1 ;  i < data.length ; i ++ ) {
      jMarkup = towElCarousel( [ data[i] , data[i+1] ] );
      jWrapper.append(jMarkup);
      i++;
    }
  }

  function initCarousel() {
    $('#carousel-wrapper').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }
      ]
    });
  };

  function initHandleBarHelper (){

    Handlebars.registerHelper('ifVideo', function(video, options ) {
      if( video ){
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('ifImage', function(image, options ) {
      if(image){
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
    Handlebars.registerHelper('ifTitle', function(title, options ) {
      if(title){
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('ifDescription', function(description, options ) {
      if(description){
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('ifDate', function(date, options ) {
      if(date){
        return options.fn(this);
      } else {
        return options.fn(this) //options.inverse(this);
      }
    });

  }



})(window ,  jQuery);