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
  }
  else {
    $('.viewbys').removeClass('fixedView');
  }
});
// $('.gotoGroup li a')
//   // Remove links that don't actually link to anything
//   .not('[href="#"]')
//   .not('[href="#0"]')
//   .click(function (event) {
//     // On-page links
//     if (
//       location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
//       &&
//       location.hostname == this.hostname
//     ) {
//       // Figure out element to scroll to
//       var target = $(this.hash);
//       target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//       // Does a scroll target exist?
//       if (target.length) {
//         // Only prevent default if animation is actually gonna happen
//         event.preventDefault();
//         $('html, body').animate({
//           scrollTop: (target.offset().top - 54)
//         }, 1000, function () {
//           // Callback after animation
//           // Must change focus!
//           var $target = $(target);
//           $target.focus();
//           if ($target.is(":focus")) { // Checking if the target was focused
//             return false;
//           } else {
//             $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
//             $target.focus(); // Set focus again
//           };
//         });
//       }
//     }
//   });

// $(function () {
//   var $grouplink = $('.gotoGroup li a').click(function () {
//     $grouplink.removeClass('current');
//     $(this).addClass('current');
//   });
// });

// $('.gotoGroup li a').on('click', function () {

//   var scrollAnchor = $(this).attr('data-scroll'),
//     scrollPoint = $('.all-matches .group-list[data-anchor="' + scrollAnchor + '"]').offset().top - 100;

//   $('body,html').animate({
//     scrollTop: scrollPoint
//   }, 500);

//   return false;

// })


// $(window).scroll(function () {
//   var windscroll = $(window).scrollTop();
//   if (windscroll >= 235) {

//     $('.all-matches .group-list').each(function (i) {
//       if ($(this).position().top <= windscroll + 100) {
//         $('.gotoGroup li a.current').removeClass('current');
//         $('.gotoGroup li a').eq(i).addClass('current');
//       }
//     });

//   } else {

//     $('.gotoGroup li a.current').removeClass('current');
//     $('.gotoGroup li a:first').addClass('current');
//   }

// }).scroll();

$('body').scrollspy({ target: '#group-name' });

