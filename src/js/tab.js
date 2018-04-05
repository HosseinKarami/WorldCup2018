/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';
  
    // AFFIX CLASS DEFINITION
    // ======================
  
    var Affix = function (element, options) {
      this.options = $.extend({}, Affix.DEFAULTS, options)
  
      this.$target = $(this.options.target)
        .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
        .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))
  
      this.$element     = $(element)
      this.affixed      = null
      this.unpin        = null
      this.pinnedOffset = null
  
      this.checkPosition()
    }
  
    Affix.VERSION  = '3.3.7'
  
    Affix.RESET    = 'affix affix-top affix-bottom'
  
    Affix.DEFAULTS = {
      offset: 0,
      target: window
    }
  
    Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
      var scrollTop    = this.$target.scrollTop()
      var position     = this.$element.offset()
      var targetHeight = this.$target.height()
  
      if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false
  
      if (this.affixed == 'bottom') {
        if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
        return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
      }
  
      var initializing   = this.affixed == null
      var colliderTop    = initializing ? scrollTop : position.top
      var colliderHeight = initializing ? targetHeight : height
  
      if (offsetTop != null && scrollTop <= offsetTop) return 'top'
      if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'
  
      return false
    }
  
    Affix.prototype.getPinnedOffset = function () {
      if (this.pinnedOffset) return this.pinnedOffset
      this.$element.removeClass(Affix.RESET).addClass('affix')
      var scrollTop = this.$target.scrollTop()
      var position  = this.$element.offset()
      return (this.pinnedOffset = position.top - scrollTop)
    }
  
    Affix.prototype.checkPositionWithEventLoop = function () {
      setTimeout($.proxy(this.checkPosition, this), 1)
    }
  
    Affix.prototype.checkPosition = function () {
      if (!this.$element.is(':visible')) return
  
      var height       = this.$element.height()
      var offset       = this.options.offset
      var offsetTop    = offset.top
      var offsetBottom = offset.bottom
      var scrollHeight = Math.max($(document).height(), $(document.body).height())
  
      if (typeof offset != 'object')         offsetBottom = offsetTop = offset
      if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
      if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)
  
      var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)
  
      if (this.affixed != affix) {
        if (this.unpin != null) this.$element.css('top', '')
  
        var affixType = 'affix' + (affix ? '-' + affix : '')
        var e         = $.Event(affixType + '.bs.affix')
  
        this.$element.trigger(e)
  
        if (e.isDefaultPrevented()) return
  
        this.affixed = affix
        this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null
  
        this.$element
          .removeClass(Affix.RESET)
          .addClass(affixType)
          .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
      }
  
      if (affix == 'bottom') {
        this.$element.offset({
          top: scrollHeight - height - offsetBottom
        })
      }
    }
  
  
    // AFFIX PLUGIN DEFINITION
    // =======================
  
    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.affix')
        var options = typeof option == 'object' && option
  
        if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }
  
    var old = $.fn.affix
  
    $.fn.affix             = Plugin
    $.fn.affix.Constructor = Affix
  
  
    // AFFIX NO CONFLICT
    // =================
  
    $.fn.affix.noConflict = function () {
      $.fn.affix = old
      return this
    }
  
  
    // AFFIX DATA-API
    // ==============
  
    $(window).on('load', function () {
      $('[data-spy="affix"]').each(function () {
        var $spy = $(this)
        var data = $spy.data()
  
        data.offset = data.offset || {}
  
        if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
        if (data.offsetTop    != null) data.offset.top    = data.offsetTop
  
        Plugin.call($spy, data)
      })
    })
  
  }(jQuery);
  
/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';
  
    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================
  
    function transitionEnd() {
      var el = document.createElement('bootstrap')
  
      var transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        transition       : 'transitionend'
      }
  
      for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
          return { end: transEndEventNames[name] }
        }
      }
  
      return false // explicit for ie8 (  ._.)
    }
  
    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
      var called = false
      var $el = this
      $(this).one('bsTransitionEnd', function () { called = true })
      var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
      setTimeout(callback, duration)
      return this
    }
  
    $(function () {
      $.support.transition = transitionEnd()
  
      if (!$.support.transition) return
  
      $.event.special.bsTransitionEnd = {
        bindType: $.support.transition.end,
        delegateType: $.support.transition.end,
        handle: function (e) {
          if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
        }
      }
    })
  
  }(jQuery);
  

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';
  
    // TAB CLASS DEFINITION
    // ====================
  
    var Tab = function (element) {
      // jscs:disable requireDollarBeforejQueryAssignment
      this.element = $(element)
      // jscs:enable requireDollarBeforejQueryAssignment
    }
  
    Tab.VERSION = '3.3.7'
  
    Tab.TRANSITION_DURATION = 150
  
    Tab.prototype.show = function () {
      var $this    = this.element
      var $ul      = $this.closest('ul:not(.dropdown-menu)')
      var selector = $this.data('target')
  
      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }
  
      if ($this.parent('li').hasClass('actives')) return
  
      var $previous = $ul.find('.actives:last a')
      var hideEvent = $.Event('hide.bs.tab', {
        relatedTarget: $this[0]
      })
      var showEvent = $.Event('show.bs.tab', {
        relatedTarget: $previous[0]
      })
  
      $previous.trigger(hideEvent)
      $this.trigger(showEvent)
  
      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return
  
      var $target = $(selector)
  
      this.activate($this.closest('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $previous.trigger({
          type: 'hidden.bs.tab',
          relatedTarget: $this[0]
        })
        $this.trigger({
          type: 'shown.bs.tab',
          relatedTarget: $previous[0]
        })
      })
    }
  
    Tab.prototype.activate = function (element, container, callback) {
      var $active    = container.find('> .actives')
      var transition = callback
        && $.support.transition
        && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)
  
      function next() {
        $active
          .removeClass('actives')
          .find('> .dropdown-menu > .actives')
            .removeClass('actives')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', false)
  
        element
          .addClass('actives')
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
  
        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }
  
        if (element.parent('.dropdown-menu').length) {
          element
            .closest('li.dropdown')
              .addClass('actives')
            .end()
            .find('[data-toggle="tab"]')
              .attr('aria-expanded', true)
        }
  
        callback && callback()
      }
  
      $active.length && transition ?
        $active
          .one('bsTransitionEnd', next)
          .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
        next()
  
      $active.removeClass('in')
    }
  
  
    // TAB PLUGIN DEFINITION
    // =====================
  
    function Plugin(option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('bs.tab')
  
        if (!data) $this.data('bs.tab', (data = new Tab(this)))
        if (typeof option == 'string') data[option]()
      })
    }
  
    var old = $.fn.tab
  
    $.fn.tab             = Plugin
    $.fn.tab.Constructor = Tab
  
  
    // TAB NO CONFLICT
    // ===============
  
    $.fn.tab.noConflict = function () {
      $.fn.tab = old
      return this
    }
  
  
    // TAB DATA-API
    // ============
  
    var clickHandler = function (e) {
      e.preventDefault()
      Plugin.call($(this), 'show')
    }
  
    $(document)
      .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
      .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)
  
  }(jQuery);
  
  /* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);
