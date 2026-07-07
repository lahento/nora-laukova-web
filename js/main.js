document.addEventListener('DOMContentLoaded', function () {

  /* ---------- sticky header ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- active nav link ---------- */
  var here = window.location.pathname.split('/').pop() || 'index.html';
  var anchorLinks = [];
  document.querySelectorAll('.nav-list a:not(.btn-primary)').forEach(function (link) {
    var href = link.getAttribute('href');
    var hashIndex = href.indexOf('#');
    var path = hashIndex === -1 ? href : href.slice(0, hashIndex);
    if (path) {
      if (path === here) link.classList.add('is-active');
    } else {
      anchorLinks.push({ link: link, id: href.slice(hashIndex + 1) });
    }
  });

  if (anchorLinks.length && 'IntersectionObserver' in window) {
    var spySections = anchorLinks
      .map(function (a) { return { link: a.link, el: document.getElementById(a.id) }; })
      .filter(function (s) { return s.el; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var match = spySections.find(function (s) { return s.el === entry.target; });
        if (!match) return;
        spySections.forEach(function (s) { s.link.classList.remove('is-active'); });
        match.link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    spySections.forEach(function (s) { spy.observe(s.el); });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq-answer').style.maxHeight = null;
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- cart ---------- */
  var CART_KEY = 'nl_cart_v1';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    renderCart();
  }

  function addToCart(item) {
    var items = getCart();
    if (items.some(function (i) { return i.id === item.id; })) return false;
    items.push(item);
    saveCart(items);
    return true;
  }

  function removeFromCart(id) {
    saveCart(getCart().filter(function (i) { return i.id !== id; }));
  }

  function formatEUR(n) {
    return n.toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function renderCart() {
    var items = getCart();

    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = items.length;
      el.classList.toggle('is-visible', items.length > 0);
    });

    var listEl = document.querySelector('[data-cart-items]');
    var totalEl = document.querySelector('[data-cart-total]');
    if (!listEl) return;

    if (!items.length) {
      listEl.innerHTML =
        '<div class="cart-empty"><svg class="mark"><use href="#mark-bag"></use></svg>' +
        '<p>Košík je zatiaľ prázdny. Pridajte si kurzy alebo knihu, ktoré vás zaujímajú.</p></div>';
    } else {
      listEl.innerHTML = items.map(function (item) {
        var priceLabel = item.price ? formatEUR(item.price) : 'cena na vyžiadanie';
        return (
          '<div class="cart-item">' +
            '<div>' +
              '<span class="cart-item-kicker">' + item.kicker + '</span>' +
              '<div class="cart-item-name">' + item.name + '</div>' +
              '<div class="cart-item-price">' + priceLabel + '</div>' +
            '</div>' +
            '<button type="button" class="cart-item-remove" data-cart-remove="' + item.id + '" aria-label="Odstrániť z košíka">' +
              '<svg><use href="#mark-close"></use></svg>' +
            '</button>' +
          '</div>'
        );
      }).join('');
    }

    if (totalEl) {
      var total = items.reduce(function (sum, i) { return sum + (i.price || 0); }, 0);
      var hasPOA = items.some(function (i) { return !i.price; });
      totalEl.textContent = formatEUR(total) + (hasPOA ? ' +' : '');
    }
  }

  var cartPanel = document.querySelector('[data-cart-panel]');
  var cartOverlay = document.querySelector('[data-cart-overlay]');

  function openCart() {
    if (cartPanel) cartPanel.classList.add('is-open');
    if (cartOverlay) cartOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    if (cartPanel) cartPanel.classList.remove('is-open');
    if (cartOverlay) cartOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.cart-trigger').forEach(function (btn) {
    btn.addEventListener('click', openCart);
  });
  var cartCloseBtn = document.querySelector('[data-cart-close]');
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCart();
  });

  var cartItemsEl = document.querySelector('[data-cart-items]');
  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) removeFromCart(removeBtn.getAttribute('data-cart-remove'));
    });
  }

  document.querySelectorAll('.cart-add').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var priceRaw = btn.getAttribute('data-price');
      var added = addToCart({
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: priceRaw ? parseFloat(priceRaw) : null,
        kicker: btn.getAttribute('data-kicker') || ''
      });
      if (added) {
        var original = btn.innerHTML;
        btn.classList.add('is-added');
        btn.innerHTML = 'Pridané do košíka <svg><use href="#mark-plus"></use></svg>';
        setTimeout(function () {
          btn.classList.remove('is-added');
          btn.innerHTML = original;
        }, 1600);
      } else {
        openCart();
      }
    });
  });

  /* ---------- prefill contact form from cart ---------- */
  function prefillContactForm() {
    var messageField = document.getElementById('sprava');
    if (!messageField) return;
    var cartItems = getCart();
    if (!cartItems.length || messageField.value.trim()) return;
    var names = cartItems.map(function (i) { return '- ' + i.name; }).join('\n');
    messageField.value = 'Mám záujem o:\n' + names + '\n\nDoplňujúca správa:\n';
  }

  var cartCheckoutBtn = document.querySelector('[data-cart-checkout]');
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', function () {
      closeCart();
      prefillContactForm();
    });
  }

  renderCart();
  prefillContactForm();

  /* ---------- newsletter form (static, no backend wired yet) ---------- */
  var newsletterForm = document.querySelector('[data-newsletter-form]');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = newsletterForm.querySelector('[data-newsletter-status]');
      if (status) {
        status.textContent = 'Ďakujem za prihlásenie! Knihu Vzťahy bez slov vám čoskoro pošleme na e-mail.';
        status.classList.add('is-visible');
      }
      newsletterForm.reset();
    });
  }

  /* ---------- contact form (static, no backend wired yet) ---------- */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Ďakujem za správu. Ozvem sa vám čo najskôr na uvedený e-mail.';
        status.classList.add('is-visible');
      }
      form.reset();
      localStorage.removeItem(CART_KEY);
      renderCart();
    });
  }

});
