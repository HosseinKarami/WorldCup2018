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



// Date.parse('14 Jun 2018 18:00:00 GMT')



function timerGo(ele) {
  var round1start = new Date($(ele).attr("data-round1start"));
  var round1total = parseInt($(ele).attr("data-round1total"));

  //var round2startText = $(ele).attr("data-round2start");
  var round2start = new Date(round1start.getTime() + (round1total + 15) * 60 * 1000);
  var round2total = parseInt($(ele).attr("data-round2total"));

  var now = new Date();
  var round1end = new Date(round1start.getTime() + round1total * 60 * 1000);
  var round2end = new Date(round2start.getTime() + round2total * 60 * 1000);

  if ((round1start < now && now < round1end) || (round2start < now && now < round2end)) {

    leftMins = "";
    if (now < round1end) {
      leftMins = Math.round((now - round1start) / (1000 * 60));
      if (leftMins > 45) {
        leftMins = "45' (+" + (leftMins - 45) + ")";
      } else {
        leftMins = leftMins + "'";
      }
    } else {
      leftMins = Math.floor((now - round2start) / (1000 * 60));
      leftMins += 45;
      if (leftMins > 90) {
        leftMins = "90' (+" + (leftMins - 90) + ")";
      } else {
        leftMins = leftMins + "'";
      }
    }


    var persianNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    var chars = leftMins.split('');
    for (var i = 0; i < chars.length; i++) {
      if (/\d/.test(chars[i])) {
        chars[i] = persianNumbers[chars[i]];
      }
    }
    leftMins = chars.join('');

    $(ele).html(leftMins);
  } else {
    if (round1end < now && now < round2end) {
      $(ele).html("پایان نیمه اول");
    } else if (round2end < now) {
      $(ele).html("نتیجه نهایی");
    } else {
      $(ele).html("");
    }

  }
}

function iterateTimers() {
  $(".timer").each(function (i, ele) {
    timerGo(ele);
  });

  setTimeout(iterateTimers, 1000);
}
iterateTimers();

function scrollRecentGame() {
  var hasScrolled = false;
  $(".card-header.air").each(function (i, ele) {
    if (hasScrolled) return;
    var round1start = new Date($(ele).attr("data-round1start"));
    round1start.setTime(round1start.getTime() + (100 * 60 * 1000));


    if (round1start > new Date()) {
      hasScrolled = true;
      $('html, body').animate({
        scrollTop: $(ele).offset().top - 150
      }, 2000);
    }
  });
}
scrollRecentGame();

hashIt = function (str) {
  var FNV1_32A_INIT = 0x811c9dc5,
    hval = FNV1_32A_INIT;

  for (var i = 0; i < str.length; ++i) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  var hash = hval >>> 0;

  return hash.toString(32);
}

var latestCrc = -1;

function refreshDetector() {
  $.get("/?" + new Date().getTime(), function (data) {
    var newCrc = hashIt(data);
    if (latestCrc !== -1 && latestCrc !== newCrc) {
      // Updated, need refresh
      window.location = "/?" + new Date().getTime()
    } else {
      latestCrc = newCrc;
    }
  });
}
setInterval(refreshDetector, 30 * 1000);
refreshDetector();