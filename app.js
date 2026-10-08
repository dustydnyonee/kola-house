/* Kola House — site behavior: header/footer, cart, and each page's content.
   Product data and store settings live in js/store-data.js. */
(function () {
  "use strict";

  var CART_KEY = "kolahouse_cart";

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: STORE.currency.toUpperCase() }).format(n);
  }
  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function media(p, extraClass) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">';
    return '<div class="' + esc(p.pattern || "weave") + (extraClass ? " " + extraClass : "") +
      '" style="width:100%;height:100%" role="img" aria-label="' + esc(p.name) + ' (photo coming soon)"></div>';
  }
  function categoryName(c) { return { clothing: "Clothing", shoes: "Shoes", herbs: "Herbs" }[c] || c; }

  /* ---------- cart storage ---------- */
  var Cart = {
    read: function () {
      try {
        var data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        // drop anything no longer in the catalog
        return Array.isArray(data) ? data.filter(function (i) { return findProduct(i.id); }) : [];
      } catch (e) { return []; }
    },
    write: function (items) {
      try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* storage blocked */ }
      updateCartCount();
    },
    add: function (id, option, qty) {
      var items = Cart.read();
      var existing = items.filter(function (i) { return i.id === id && i.option === option; })[0];
      if (existing) existing.qty = Math.min(20, existing.qty + qty);
      else items.push({ id: id, option: option, qty: qty });
      Cart.write(items);
    },
    setQty: function (index, qty) {
      var items = Cart.read();
      if (!items[index]) return;
      if (qty <= 0) items.splice(index, 1); else items[index].qty = Math.min(20, qty);
      Cart.write(items);
    },
    clear: function () { Cart.write([]); },
    count: function () { return Cart.read().reduce(function (n, i) { return n + i.qty; }, 0); },
    subtotal: function () {
      return Cart.read().reduce(function (sum, i) { return sum + findProduct(i.id).price * i.qty; }, 0);
    }
  };
  window.KolaCart = Cart;

  function shippingFor(subtotal) {
    if (subtotal === 0) return 0;
    return subtotal >= STORE.freeShippingOver ? 0 : STORE.flatShipping;
  }

  function updateCartCount() {
    var el = $("#cart-count");
    if (el) el.textContent = Cart.count();
  }

  /* ---------- shared header & footer ---------- */
  var ICONS = {
    bag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    truck: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    lock: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    ret: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4h4"/></svg>'
  };
  window.KOLA_ICONS = ICONS;

  function logoHTML() {
    // Splits the store name so the second word gets the accent color ("Kola" + "House").
    var parts = STORE.name.split(" ");
    if (parts.length < 2) return esc(STORE.name);
    return esc(parts[0]) + "<span>" + esc(parts.slice(1).join(" ")) + "</span>";
  }

  function renderHeader() {
    var mount = $("#site-header");
    if (!mount) return;
    var page = document.body.getAttribute("data-page");
    var cat = new URLSearchParams(location.search).get("category");
    function cur(match) { return match ? ' aria-current="page"' : ""; }
    mount.innerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<div class="stripe kente"></div>' +
      '<div class="announce">Free U.S. shipping on orders over ' + money(STORE.freeShippingOver) + '</div>' +
      '<header class="site-header"><div class="wrap header-row" style="position:relative">' +
        '<a class="logo" href="index.html">' + logoHTML() + '</a>' +
        '<nav class="main-nav" id="main-nav" aria-label="Main"><ul>' +
          '<li><a href="shop.html?category=clothing"' + cur(page === "shop" && cat === "clothing") + '>Clothing</a></li>' +
          '<li><a href="shop.html?category=shoes"' + cur(page === "shop" && cat === "shoes") + '>Shoes</a></li>' +
          '<li><a href="shop.html?category=herbs"' + cur(page === "shop" && cat === "herbs") + '>Herbs</a></li>' +
          '<li><a href="shop.html"' + cur(page === "shop" && !cat) + '>Shop all</a></li>' +
          '<li><a href="about.html"' + cur(page === "about") + '>Our story</a></li>' +
        '</ul></nav>' +
        '<div class="header-actions">' +
          '<a class="cart-link" href="cart.html" aria-label="Cart">' + ICONS.bag + '<span>Cart (<span id="cart-count">0</span>)</span></a>' +
          '<button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="Open menu">' + ICONS.menu + '</button>' +
        '</div>' +
      '</div></header>';
    var toggle = $(".menu-toggle", mount), nav = $("#main-nav", mount);
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    updateCartCount();
  }

  function renderFooter() {
    var mount = $("#site-footer");
    if (!mount) return;
    var year = new Date().getFullYear();
    mount.innerHTML =
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="footer-grid">' +
          '<div style="display:flex;flex-direction:column;gap:10px"><span class="footer-logo">' + logoHTML() + '</span>' +
            '<span class="footer-muted">' + esc(STORE.tagline) + '</span>' +
            '<a class="footer-muted" href="mailto:' + esc(STORE.email) + '">' + esc(STORE.email) + '</a></div>' +
          '<div><strong>Shop</strong><ul style="margin-top:12px">' +
            '<li><a href="shop.html?category=clothing">Clothing</a></li>' +
            '<li><a href="shop.html?category=shoes">Shoes</a></li>' +
            '<li><a href="shop.html?category=herbs">Herbs</a></li></ul></div>' +
          '<div><strong>Help</strong><ul style="margin-top:12px">' +
            '<li><a href="shipping.html">Shipping &amp; returns</a></li>' +
            '<li><a href="shipping.html#sizes">Size guide</a></li>' +
            '<li><a href="contact.html">Contact us</a></li>' +
            '<li><a href="privacy.html">Privacy policy</a></li></ul></div>' +
          '<div><strong>Follow</strong><ul style="margin-top:12px">' +
            '<li><a href="' + esc(STORE.social.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>' +
            '<li><a href="' + esc(STORE.social.facebook) + '" target="_blank" rel="noopener">Facebook</a></li>' +
            '<li><a href="' + esc(STORE.social.tiktok) + '" target="_blank" rel="noopener">TikTok</a></li></ul></div>' +
        '</div>' +
        '<div class="footer-bottom"><div class="stripe kente"></div>' +
          '<span class="footer-muted">© ' + year + ' ' + esc(STORE.name) + '. All rights reserved.</span></div>' +
      '</div></footer>';
  }

  /* ---------- product cards ---------- */
  function productCard(p) {
    var url = "product.html?id=" + encodeURIComponent(p.id);
    return '<article class="card">' +
      '<a class="card-media" href="' + url + '" tabindex="-1" aria-hidden="true">' + media(p) +
        '<span class="card-tag">' + esc(p.category === "herbs" ? "Herbs" : p.who) + '</span></a>' +
      '<div class="card-row"><h3><a href="' + url + '">' + esc(p.name) + '</a></h3>' +
        '<span class="price">' + money(p.price) + '</span></div>' +
      '<a class="btn" href="' + url + '">Choose ' + esc((p.optionLabel || "option").toLowerCase()) + '</a>' +
    '</article>';
  }

  function herbCard(p) {
    var url = "product.html?id=" + encodeURIComponent(p.id);
    return '<article class="herb-card">' +
      '<a class="card-media" href="' + url + '" tabindex="-1" aria-hidden="true">' + media(p) + '</a>' +
      '<div class="herb-body">' +
        '<div class="card-row"><h3><a href="' + url + '" style="text-decoration:none">' + esc(p.name) + '</a></h3>' +
          '<span class="price">from ' + money(p.price) + '</span></div>' +
        '<p>' + esc(p.description) + '</p>' +
        '<a class="btn btn-green" href="' + url + '">Choose package</a>' +
      '</div></article>';
  }

  /* ---------- pages ---------- */
  var pages = {};

  pages.home = function () {
    var featured = PRODUCTS.filter(function (p) { return p.featured && p.category !== "herbs"; });
    var herbs = PRODUCTS.filter(function (p) { return p.featured && p.category === "herbs"; });
    $("#featured-grid").innerHTML = featured.map(productCard).join("");
    $("#herb-grid").innerHTML = herbs.map(herbCard).join("");
    $("#ship-days").textContent = STORE.shippingDays;
    $("#return-days").textContent = STORE.returnDays;
    var perks = $("#perks");
    if (perks) perks.querySelectorAll("[data-icon]").forEach(function (el) { el.innerHTML = ICONS[el.getAttribute("data-icon")]; });
  };

  pages.shop = function () {
    var params = new URLSearchParams(location.search);
    var state = { category: params.get("category") || "all", who: params.get("who") || "All" };
    var cats = [["all", "Everything"], ["clothing", "Clothing"], ["shoes", "Shoes"], ["herbs", "Herbs"]];
    var whos = ["All", "Women", "Men", "Kids"];

    function chips(list, key, current) {
      return list.map(function (item) {
        var value = Array.isArray(item) ? item[0] : item, label = Array.isArray(item) ? item[1] : item;
        return '<button type="button" class="chip" data-key="' + key + '" data-value="' + esc(value) + '" aria-pressed="' + (value === current) + '">' + esc(label) + '</button>';
      }).join("");
    }

    function render() {
      $("#cat-filters").innerHTML = chips(cats, "category", state.category);
      var whoWrap = $("#who-wrap");
      whoWrap.hidden = state.category === "herbs";
      $("#who-filters").innerHTML = chips(whos, "who", state.who);

      var list = PRODUCTS.filter(function (p) {
        if (state.category !== "all" && p.category !== state.category) return false;
        if (state.category !== "herbs" && state.who !== "All" && p.category !== "herbs" && p.who !== state.who && p.who !== "All") return false;
        if (state.category === "all" && state.who !== "All" && p.category === "herbs") return false;
        return true;
      });
      var title = state.category === "all" ? "Shop all" : categoryName(state.category);
      $("#shop-title").textContent = title;
      document.title = title + " | " + STORE.name;
      $("#result-count").textContent = list.length + (list.length === 1 ? " item" : " items");
      $("#shop-grid").innerHTML = list.length
        ? list.map(function (p) { return p.category === "herbs" ? herbCard(p) : productCard(p); }).join("")
        : '<p class="empty">Nothing here yet — check back soon.</p>';
      $("#herb-note").hidden = !list.some(function (p) { return p.category === "herbs"; });
    }

    document.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      state[b.getAttribute("data-key")] = b.getAttribute("data-value");
      var q = new URLSearchParams();
      if (state.category !== "all") q.set("category", state.category);
      if (state.who !== "All" && state.category !== "herbs") q.set("who", state.who);
      history.replaceState(null, "", "shop.html" + (q.toString() ? "?" + q : ""));
      render();
    });
    render();
  };

  pages.product = function () {
    var id = new URLSearchParams(location.search).get("id");
    var p = findProduct(id);
    var mount = $("#product");
    if (!p) {
      mount.innerHTML = '<div class="page-hero"><h1>Product not found</h1><p class="lead">It may have sold out or moved.</p><a class="btn btn-dark" href="shop.html" style="align-self:flex-start">Back to the shop</a></div>';
      return;
    }
    document.title = p.name + " | " + STORE.name;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.description);

    var opts = p.options.map(function (o, i) {
      var oid = "opt-" + i;
      return '<input type="radio" name="option" id="' + oid + '" value="' + esc(o) + '"' + (p.options.length === 1 ? " checked" : "") + '>' +
        '<label for="' + oid + '">' + esc(o) + '</label>';
    }).join("");

    mount.innerHTML =
      '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> / ' +
        '<a href="shop.html?category=' + p.category + '">' + categoryName(p.category) + '</a> / ' + esc(p.name) + '</nav>' +
      '<div class="product">' +
        '<div class="product-media">' + media(p) + '</div>' +
        '<div class="product-info">' +
          '<span class="badge">' + esc(p.category === "herbs" ? "Herbs" : p.who) + '</span>' +
          '<h1>' + esc(p.name) + '</h1>' +
          '<span class="product-price">' + money(p.price) + '</span>' +
          '<p style="font-size:17px;color:var(--ink-soft)">' + esc(p.description) + '</p>' +
          '<form id="buy-form" novalidate>' +
            '<fieldset class="option-group"><legend>' + esc(p.optionLabel || "Option") + '</legend><div class="options">' + opts + '</div></fieldset>' +
            '<div class="buy-row" style="margin-top:20px">' +
              '<div class="qty"><button type="button" data-step="-1" aria-label="Decrease quantity">−</button>' +
                '<label for="qty" class="visually-hidden">Quantity</label><input id="qty" type="number" min="1" max="20" value="1" inputmode="numeric">' +
                '<button type="button" data-step="1" aria-label="Increase quantity">+</button></div>' +
              '<button class="btn btn-primary" type="submit">Add to cart</button>' +
            '</div>' +
            '<div id="buy-msg" role="status" aria-live="polite" style="margin-top:14px"></div>' +
          '</form>' +
          '<div><strong>Details</strong><ul class="details">' + p.details.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + '</ul></div>' +
          (p.category === "herbs"
            ? '<p class="small">Sold as a food and culinary product. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.</p>'
            : '<p class="small">Free returns within ' + STORE.returnDays + ' days on unworn items. <a href="shipping.html#sizes">Size guide</a></p>') +
        '</div>' +
      '</div>';

    var related = PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
    if (related.length) {
      $("#related").innerHTML = '<h2 class="section-title" style="margin-bottom:28px">You may also like</h2><div class="grid">' +
        related.map(function (x) { return x.category === "herbs" ? herbCard(x) : productCard(x); }).join("") + '</div>';
    }

    var qty = $("#qty"), msg = $("#buy-msg");
    mount.addEventListener("click", function (e) {
      var b = e.target.closest("[data-step]");
      if (!b) return;
      var v = (parseInt(qty.value, 10) || 1) + parseInt(b.getAttribute("data-step"), 10);
      qty.value = Math.max(1, Math.min(20, v));
    });
    $("#buy-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var chosen = mount.querySelector('input[name="option"]:checked');
      if (!chosen) {
        msg.innerHTML = '<div class="notice error">Please choose a ' + esc((p.optionLabel || "option").toLowerCase()) + '.</div>';
        return;
      }
      var n = Math.max(1, Math.min(20, parseInt(qty.value, 10) || 1));
      Cart.add(p.id, chosen.value, n);
      msg.innerHTML = '<div class="notice">Added to your cart. <a href="cart.html">View cart</a></div>';
    });
  };

  pages.cart = function () {
    var mount = $("#cart");

    function render() {
      var items = Cart.read();
      if (!items.length) {
        mount.innerHTML = '<div class="page-hero"><h1>Your cart is empty</h1><p class="lead">Find something you love in the shop.</p>' +
          '<a class="btn btn-primary" href="shop.html" style="align-self:flex-start">Start shopping</a></div>';
        return;
      }
      var subtotal = Cart.subtotal(), ship = shippingFor(subtotal);
      var toFree = STORE.freeShippingOver - subtotal;
      mount.innerHTML =
        '<div class="page-hero"><h1>Your cart</h1></div>' +
        '<div class="cart-layout">' +
          '<div class="cart-items">' + items.map(function (i, idx) {
            var p = findProduct(i.id);
            return '<div class="cart-item">' +
              '<a class="cart-thumb" href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' + media(p) + '</a>' +
              '<div><h3><a href="product.html?id=' + encodeURIComponent(p.id) + '" style="text-decoration:none">' + esc(p.name) + '</a></h3>' +
                '<div class="meta">' + esc(p.optionLabel || "Option") + ': ' + esc(i.option) + ' · ' + money(p.price) + ' each</div>' +
                '<div class="cart-controls"><div class="qty">' +
                  '<button type="button" data-idx="' + idx + '" data-step="-1" aria-label="Decrease quantity of ' + esc(p.name) + '">−</button>' +
                  '<input type="number" min="0" max="20" value="' + i.qty + '" data-idx="' + idx + '" aria-label="Quantity of ' + esc(p.name) + '">' +
                  '<button type="button" data-idx="' + idx + '" data-step="1" aria-label="Increase quantity of ' + esc(p.name) + '">+</button></div>' +
                  '<button type="button" class="link-btn" data-remove="' + idx + '">Remove</button></div></div>' +
              '<span class="price">' + money(p.price * i.qty) + '</span>' +
            '</div>';
          }).join("") + '</div>' +
          '<aside class="summary" aria-label="Order summary">' +
            '<h2 style="font-size:24px">Order summary</h2>' +
            '<div class="summary-row"><span>Subtotal</span><span>' + money(subtotal) + '</span></div>' +
            '<div class="summary-row"><span>Shipping (U.S.)</span><span>' + (ship === 0 ? "Free" : money(ship)) + '</span></div>' +
            (toFree > 0 ? '<p class="small">Add ' + money(toFree) + ' more for free shipping.</p>' : '') +
            '<div class="summary-row summary-total"><span>Estimated total</span><span>' + money(subtotal + ship) + '</span></div>' +
            '<p class="small">Sales tax, if any, is calculated at checkout.</p>' +
            '<button type="button" class="btn btn-primary btn-block" id="checkout">Check out securely</button>' +
            '<div id="checkout-msg" role="status" aria-live="polite"></div>' +
            '<a href="shop.html" class="small" style="text-align:center">Continue shopping</a>' +
          '</aside>' +
        '</div>';
    }

    mount.addEventListener("click", function (e) {
      var step = e.target.closest("[data-step]");
      if (step) {
        var idx = +step.getAttribute("data-idx"), item = Cart.read()[idx];
        if (item) Cart.setQty(idx, item.qty + parseInt(step.getAttribute("data-step"), 10));
        render(); return;
      }
      var rm = e.target.closest("[data-remove]");
      if (rm) { Cart.setQty(+rm.getAttribute("data-remove"), 0); render(); return; }
      if (e.target.closest("#checkout")) checkout(e.target.closest("#checkout"));
    });
    mount.addEventListener("change", function (e) {
      if (e.target.matches("input[data-idx]")) {
        Cart.setQty(+e.target.getAttribute("data-idx"), parseInt(e.target.value, 10) || 0);
        render();
      }
    });

    function checkout(btn) {
      var msg = $("#checkout-msg");
      btn.disabled = true;
      btn.textContent = "Opening secure checkout…";
      fetch("/.netlify/functions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: Cart.read() })
      })
        .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || "Checkout failed"); return d; }); })
        .then(function (d) { location.href = d.url; })
        .catch(function (err) {
          btn.disabled = false;
          btn.textContent = "Check out securely";
          msg.innerHTML = '<div class="notice error">Checkout isn’t available right now. ' +
            (location.protocol === "file:" ? "Checkout works once the site is deployed (see README)." : "Please try again or contact us at " + esc(STORE.email) + ".") + '</div>';
          if (window.console) console.error(err);
        });
    }

    render();
  };

  pages.success = function () {
    Cart.clear();
  };

  /* ---------- start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    document.querySelectorAll("[data-store-name]").forEach(function (el) { el.textContent = STORE.name; });
    document.querySelectorAll("[data-store-email]").forEach(function (el) {
      el.textContent = STORE.email;
      if (el.tagName === "A") el.href = "mailto:" + STORE.email;
    });
    var page = document.body.getAttribute("data-page");
    if (pages[page]) pages[page]();
  });
})();
