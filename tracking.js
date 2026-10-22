(function () {
  'use strict';
  if (window.__pnpTrackingLoaded) return;
  window.__pnpTrackingLoaded = true;
  var config = window.PNP_TRACKING_CONFIG || {};
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
  var storageKey = 'pnp-attribution-v1';
  var originalLinks = new WeakMap();
  var started = false;
  var route = location.pathname.replace(/\/+$/, '') || '/';
  var products = {'/': 'pensando-como-empresario', '/bio': 'bio', '/pnp-base': 'pnp-base', '/pnp-especialista': 'pnp-especialista', '/mentoria': 'mentoria', '/consultoria': 'consultoria'};
  var product = location.hostname.indexOf('desafioagoraoununca') >= 0 ? 'desafio' : products[route] || 'institucional';
  function read(storage, key) { try { return JSON.parse(storage.getItem(key)); } catch (_) { return null; } }
  function save(storage, key, value) { try { storage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function clean(value) {
    // Campanhas usam identificadores; nunca encaminhar e-mail, telefone ou texto livre.
    if (!value || /@|%40/.test(value)) return '';
    return value.toLowerCase().replace(/[^a-z0-9._|{}-]/g, '-').slice(0, 120);
  }
  var incoming = new URLSearchParams(location.search);
  var attribution = {};
  if (incoming.get('utm_source')) {
    keys.forEach(function (key) { var value = clean(incoming.get(key)); if (value) attribution[key] = value; });
  } else {
    var previous = read(sessionStorage, storageKey);
    if (previous && previous.expires > Date.now()) attribution = previous.values;
    if (!attribution.utm_source) {
      var referrer;
      try { referrer = new URL(document.referrer); } catch (_) {}
      var internal = referrer && (config.domains || []).indexOf(referrer.hostname) >= 0;
      if (referrer && !internal) {
        var host = referrer.hostname;
        var social = /(^|\.)(instagram|facebook|tiktok)\.com$/.test(host);
        attribution = {utm_source: /instagram/.test(host) ? 'instagram' : /facebook/.test(host) ? 'facebook' : /tiktok/.test(host) ? 'tiktok' : /google\./.test(host) ? 'google' : clean(host), utm_medium: social ? 'organic-social' : /google\./.test(host) ? 'organic' : 'referral'};
      } else attribution = {utm_source: 'direct', utm_medium: 'none'};
    }
  }
  if (attribution.utm_source) save(sessionStorage, storageKey, {values: attribution, expires: Date.now() + 30 * 60 * 1000});
  function kind(url) {
    if (url.hostname === 'pay.hotmart.com' || url.hostname === 'go.hotmart.com') return 'hotmart';
    if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com' || url.hostname === 'chat.whatsapp.com' || url.hostname === 'web.whatsapp.com') return 'whatsapp';
    if (url.hostname === 'pag.ae' || url.hostname === 'pagamento.pagbank.com.br') return 'pagbank';
    if ((config.domains || []).indexOf(url.hostname) >= 0 || url.origin === location.origin) return 'internal';
    return 'external';
  }
  function decorate(anchor) {
    var raw = originalLinks.get(anchor) || anchor.getAttribute('href');
    if (!raw || /^(#|mailto:|tel:|javascript:)/i.test(raw)) return;
    var url;
    try { url = new URL(raw, location.href); } catch (_) { return; }
    if (!/^https?:$/.test(url.protocol)) return;
    var type = kind(url);
    if (type === 'internal' && url.pathname === location.pathname && url.hash && !url.search) return;
    originalLinks.set(anchor, raw);
    // Não acrescentar parâmetros a links curtos de pagamento nem a convites WhatsApp.
    if (type === 'internal' || type === 'hotmart') {
      keys.forEach(function (key) { if (attribution[key]) url.searchParams.set(key, attribution[key]); });
      if (type === 'hotmart' && !url.searchParams.has('sck')) {
        url.searchParams.set('sck', [attribution.utm_source, attribution.utm_medium, attribution.utm_campaign, attribution.utm_content].filter(Boolean).join('|').replace(/_/g, '-').slice(0, 240));
      }
      anchor.href = url.href;
    }
    return {url: url, type: type};
  }
  function script(src) { var element = document.createElement('script'); element.async = true; element.src = src; document.head.appendChild(element); }
  function start() {
    if (started || !config.enabled) return;
    started = true;
    if (/^\d+$/.test(config.metaPixelId || '')) {
      if (!window.fbq) {
        var fbq = window.fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
        window._fbq = fbq; fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
        script('https://connect.facebook.net/en_US/fbevents.js');
      }
      window.fbq('init', config.metaPixelId);
      window.fbq('trackSingle', config.metaPixelId, 'PageView');
      if (product !== 'bio') window.fbq('trackSingle', config.metaPixelId, 'ViewContent', {content_name: product, content_ids: [product], content_type: 'product'});
    }
    if (/^G-[A-Z0-9]+$/.test(config.ga4MeasurementId || '')) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      var settings = {send_page_view: true, page_location: location.origin + location.pathname, allow_google_signals: false, allow_ad_personalization_signals: false};
      ['source', 'medium', 'campaign', 'content', 'term', 'id'].forEach(function (name) { if (attribution['utm_' + name]) settings['campaign_' + (name === 'campaign' ? 'name' : name)] = attribution['utm_' + name]; });
      window.gtag('config', config.ga4MeasurementId, settings);
      script('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.ga4MeasurementId));
    }
    if (/^[A-Z0-9]{10,}$/.test(config.tiktokPixelId || '')) {
      window.TiktokAnalyticsObject = 'ttq';
      var ttq = window.ttq = window.ttq || [];
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
      ttq.setAndDefer = function (target, method) { target[method] = function () { target.push([method].concat(Array.prototype.slice.call(arguments))); }; };
      ttq.methods.forEach(function (method) { ttq.setAndDefer(ttq, method); });
      ttq.instance = function (id) { var instance = ttq._i[id] || []; ttq.methods.forEach(function (method) { ttq.setAndDefer(instance, method); }); return instance; };
      ttq._i = ttq._i || {}; ttq._i[config.tiktokPixelId] = []; ttq._i[config.tiktokPixelId]._u = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._t = ttq._t || {}; ttq._t[config.tiktokPixelId] = +new Date();
      ttq._o = ttq._o || {}; ttq._o[config.tiktokPixelId] = {};
      script('https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + config.tiktokPixelId + '&lib=ttq');
      ttq.page();
      if (product !== 'bio') ttq.track('ViewContent', {content_name: product});
    }
  }
  function event(name, type, anchor) {
    if (!started) return;
    var label = clean(anchor.id || anchor.getAttribute('data-tracking-label') || type);
    var data = {product: product, cta_id: label, destination: type};
    if (window.gtag && config.ga4MeasurementId) window.gtag('event', name, Object.assign({send_to: config.ga4MeasurementId, transport_type: 'beacon'}, data));
    if (window.fbq && config.metaPixelId) window.fbq(name === 'whatsapp_click' ? 'trackSingle' : 'trackSingleCustom', config.metaPixelId, name === 'whatsapp_click' ? 'Contact' : 'BuyClick', data);
    if (window.ttq && config.tiktokPixelId) window.ttq.track(name === 'whatsapp_click' ? 'Contact' : 'BuyClick', {content_name: product});
  }
  function init() {
    document.querySelectorAll('a[href]').forEach(decorate);
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest && e.target.closest('a[href]');
      if (!anchor) return;
      var result = decorate(anchor);
      if (!result) return;
      if (result.type === 'whatsapp') event('whatsapp_click', result.type, anchor);
      else if (result.type === 'hotmart' || result.type === 'pagbank') event('buy_click', result.type, anchor);
    }, true);
    document.addEventListener('auxclick', function (e) { var anchor = e.target.closest && e.target.closest('a[href]'); if (anchor) decorate(anchor); }, true);
    if (!config.enabled) return;
    start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
