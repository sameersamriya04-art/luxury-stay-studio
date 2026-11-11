/* =========================================================
   Luxury Stay Studio — website behaviour
   ---------------------------------------------------------
   1. Header style on scroll
   2. Mobile menu
   3. Active link highlighting
   4. Scroll reveal animations
   5. Portfolio video player
   6. Logo fallback
   7. Copy email button
   8. Contact form (opens the visitor's email app — free, no server)
   9. Footer year
   ========================================================= */

(function () {
  "use strict";

  var EMAIL = "lss.propertymedia@gmail.com";

  document.documentElement.classList.add("js");

  /* ---------- 1. Header style on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu after tapping a link inside it
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  // Close with the Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // If the screen is resized to desktop, make sure the menu is reset
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860 && menu.classList.contains("is-open")) setMenu(false);
  });

  /* ---------- 3. Active link highlighting ---------- */
  var navLinks = document.querySelectorAll(".nav__link");
  var sections = Array.prototype.map.call(navLinks, function (link) {
    return document.querySelector(link.getAttribute("href"));
  });

  if ("IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { if (s) activeObserver.observe(s); });
  }

  /* ---------- 4. Scroll reveal animations ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(function (el, i) {
      // small stagger for items that sit side by side
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 5. Portfolio video player ---------- */
  var videoWrap = document.querySelector("[data-video]");
  if (videoWrap) {
    var video = videoWrap.querySelector("video");
    var playBtn = videoWrap.querySelector(".video__play");
    var placeholder = videoWrap.querySelector(".video__placeholder");
    var source = video.querySelector("source");

    function showPlaceholder() {
      placeholder.hidden = false;
      playBtn.hidden = true;
      video.hidden = true;
    }

    // If the video file is missing, show a tidy placeholder instead of an error
    if (source) source.addEventListener("error", showPlaceholder);
    video.addEventListener("error", showPlaceholder);

    playBtn.addEventListener("click", function () {
      video.controls = true;
      var attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(function () { /* user can press play in controls */ });
    });

    video.addEventListener("play", function () { videoWrap.classList.add("is-playing"); });
    video.addEventListener("ended", function () {
      videoWrap.classList.remove("is-playing");
      video.controls = false;
      video.load(); // return to the poster image
    });

    // Pause automatically when the visitor scrolls away
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting && !video.paused) video.pause();
      }, { threshold: 0.2 }).observe(videoWrap);
    }
  }

  /* ---------- 6. Logo fallback ---------- */
  // If the logo image can't load, show the brand name in text instead.
  document.querySelectorAll("[data-logo]").forEach(function (img) {
    function fallback() {
      img.hidden = true;
      var text = img.parentNode.querySelector(".logo-fallback");
      if (text) text.hidden = false;
    }
    if (img.complete && img.naturalWidth === 0) fallback();
    img.addEventListener("error", fallback);
  });

  /* ---------- 7. Copy email button ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var original = btn.textContent;

      function done(msg) {
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = original; }, 2000);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done("Copied ✓"); }, function () { done("Copy failed"); });
      } else {
        // Fallback for older browsers
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "absolute";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        try { document.execCommand("copy"); done("Copied ✓"); } catch (e) { done("Copy failed"); }
        document.body.removeChild(area);
      }
    });
  });

  /* ---------- 8. Contact form ---------- */
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = {
        name: document.getElementById("cf-name"),
        email: document.getElementById("cf-email"),
        type: document.getElementById("cf-type"),
        location: document.getElementById("cf-location"),
        message: document.getElementById("cf-message")
      };

      var name = fields.name.value.trim();
      var email = fields.email.value.trim();
      var type = fields.type.value;
      var place = fields.location.value.trim();
      var message = fields.message.value.trim();

      // Simple checks so visitors don't send an empty enquiry
      var errors = [];
      form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("has-error"); });

      if (!name) { errors.push("your name"); fields.name.parentNode.classList.add("has-error"); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.push("a valid email"); fields.email.parentNode.classList.add("has-error"); }
      if (!message) { errors.push("a short message"); fields.message.parentNode.classList.add("has-error"); }

      if (errors.length) {
        note.textContent = "Please add " + errors.join(", ") + ".";
        note.className = "form__note is-error";
        return;
      }

      var subject = "Project enquiry — " + type + (place ? " in " + place : "");
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Property type: " + type + "\n" +
        "Location: " + (place || "—") + "\n\n" +
        message;

      window.location.href =
        "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      note.textContent = "Your email app should open now. If it doesn't, write to " + EMAIL + ".";
      note.className = "form__note is-success";
    });
  }

  /* ---------- 9. Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
