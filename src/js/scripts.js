$(window).scroll(function () {
  if ($(window).scrollTop() >= 24) {
    $('.header').addClass('fixed-header');
    $('.head-titles').addClass('fixed-content');
  }
  else {
    $('.header').removeClass('fixed-header');
    $('.head-titles').removeClass('fixed-content');
  }
});