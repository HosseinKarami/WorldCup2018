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
$(window).scroll(function () {
  if ($(window).scrollTop() >= 150) {
    $('.viewbys').addClass('fixedView');
    $('.all-matches.all-matches-group').addClass('fixed-padding');
  }
  else {
    $('.viewbys').removeClass('fixedView');
    $('.all-matches.all-matches-group').removeClass('fixed-padding');
  }
});
$('.gotoGroup li a')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function (event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: (target.offset().top - 150)
        }, 1000);
      }
    }
  });


$('body').scrollspy({ target: '#group-name', offset: 170 });