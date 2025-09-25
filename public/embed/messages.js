(function () {
  try {
    var script = document.currentScript || (function() {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

    if (!script) return;

    var src = script.getAttribute('src') || '';
    var base = src.split('/embed/messages.js')[0];
    var width = script.getAttribute('data-width') || '100%';
    var heightAttr = script.getAttribute('data-height') || '420';
    var border = script.getAttribute('data-border') || '0';
    var interval = script.getAttribute('data-interval');

    var iframe = document.createElement('iframe');
    iframe.src = base + '/embed/messages' + (interval ? ('?interval=' + encodeURIComponent(interval)) : '');
    iframe.allow = 'clipboard-write;';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.style.border = String(border);
    iframe.style.width = String(width);
    iframe.style.height = /px$|%$/.test(String(heightAttr)) ? String(heightAttr) : String(heightAttr) + 'px';
    iframe.style.background = 'transparent';
    iframe.style.overflow = 'hidden';

    script.parentNode && script.parentNode.insertBefore(iframe, script);
    script.parentNode && script.parentNode.removeChild(script);
  } catch (e) {
    console.error('[embed] init error:', e);
  }
})();


