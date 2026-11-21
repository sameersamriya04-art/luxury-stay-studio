/* =========================================================
   Luxury Stay Studio — website behaviour
   ---------------------------------------------------------
   1. Header style on scroll
   2. Mobile menu
   3. Active link highlighting
   4. Scroll reveal animations
   5. Portfolio video players + card "Watch Film" links
   6. Logo fallback
   7. Copy email button
   8. Contact form (prepares an email draft in the visitor's email app — free, no server)
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

  /* ---------- 5. Portfolio video players ---------- */
  // Every film uses the browser's own video controls (they also work without
  // JavaScript). This script adds the gold play overlay, keeps only one film
  // playing at a time, and shows a short notice only if a film truly fails to load.
  var allVideos = [];

  document.querySelectorAll("[data-video]").forEach(function (videoWrap) {
    var video = videoWrap.querySelector("video");
    var playBtn = videoWrap.querySelector(".video__play");
    var source = video.querySelector("source");
    var fileUrl = source ? source.getAttribute("src") : video.getAttribute("src");
    var failed = false;
    allVideos.push(video);

    function showLoadError() {
      if (failed) return;
      failed = true;
      if (playBtn) playBtn.hidden = true;
      var box = document.createElement("div");
      box.className = "video__placeholder";
      box.setAttribute("role", "status");
      box.innerHTML =
        '<p class="eyebrow">Film unavailable</p>' +
        "<p>This film could not be loaded right now. Please refresh the page or " +
        '<a href="' + fileUrl + '">open the film directly</a>.</p>';
      videoWrap.appendChild(box);
    }

    // Only treat it as missing when the browser has genuinely given up on the file
    video.addEventListener("error", showLoadError);
    if (source) {
      source.addEventListener("error", function () {
        if (video.networkState === 3 /* NETWORK_NO_SOURCE */) showLoadError();
      });
    }
    if (video.error || video.networkState === 3) showLoadError();

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        var attempt = video.play();
        if (attempt && attempt.catch) {
          attempt.catch(function () {
            // Playback was blocked: reveal the native controls so the visitor can press play.
            videoWrap.classList.add("is-playing");
          });
        }
      });
    }

    video.addEventListener("play", function () {
      videoWrap.classList.add("is-playing");
      // Only one film plays at a time
      allVideos.forEach(function (other) { if (other !== video && !other.paused) other.pause(); });
    });
    video.addEventListener("ended", function () {
      videoWrap.classList.remove("is-playing");
      video.load(); // return to the poster image
    });

    // Pause automatically when the visitor scrolls away
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting && !video.paused) video.pause();
      }, { threshold: 0.2 }).observe(videoWrap);
    }
  });

  // "Watch Film" buttons on the portfolio cards:
  // the link scrolls to the film, then the film starts once it's on screen.
  // (Only ever starts after a visitor taps — never autoplays on page load.)
  document.querySelectorAll("[data-play-target]").forEach(function (link) {
    link.addEventListener("click", function () {
      var target = document.getElementById(link.getAttribute("data-play-target"));
      if (!target) return;
      var btn = target.parentNode.querySelector(".video__play");
      var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setTimeout(function () {
        if (target.paused && btn && !btn.hidden) btn.click();
      }, reduced ? 100 : 900);
    });
  });

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
  // Free and serverless: the form prepares an email draft to EMAIL in the
  // visitor's own email app. Nothing is sent until they press Send there.
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");

  if (form) {
    var fallback = null;

    function copyText(text, btn) {
      var original = btn.textContent;
      function done(msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = original; }, 2200); }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done("Copied ✓"); }, function () { done("Select & copy manually"); });
      } else {
        var area = document.createElement("textarea");
        area.value = text; area.setAttribute("readonly", "");
        area.style.position = "absolute"; area.style.left = "-9999px";
        document.body.appendChild(area); area.select();
        try { document.execCommand("copy"); done("Copied ✓"); } catch (err) { done("Select & copy manually"); }
        document.body.removeChild(area);
      }
    }

    // Panel with the prepared message, for visitors whose email app doesn't open
    function showFallback(subject, body, mailto) {
      if (!fallback) {
        fallback = document.createElement("div");
        fallback.className = "form__fallback field--full";
        fallback.innerHTML =
          '<p class="form__fallback-title">Email app didn\'t open?</p>' +
          '<p>Copy your enquiry below and email it to <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> from any email account.</p>' +
          '<label class="form__fallback-label" for="cf-prepared">Your prepared enquiry</label>' +
          '<textarea id="cf-prepared" class="form__fallback-text" rows="8" readonly></textarea>' +
          '<div class="form__fallback-actions">' +
          '<button type="button" class="btn btn--gold btn--small" data-fallback-copy>Copy enquiry</button>' +
          '<a class="btn btn--ghost btn--small" data-fallback-retry>Try email app again</a>' +
          '</div>';
        form.appendChild(fallback);
        fallback.querySelector("[data-fallback-copy]").addEventListener("click", function () {
          copyText(fallback.querySelector("textarea").value, this);
        });
      }
      fallback.querySelector("textarea").value = "To: " + EMAIL + "\nSubject: " + subject + "\n\n" + body;
      fallback.querySelector("[data-fallback-retry]").setAttribute("href", mailto);
      fallback.hidden = false;
    }

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

      // Simple checks so visitors don't prepare an empty enquiry
      var errors = [];
      form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("has-error"); });

      if (!name) { errors.push("your name"); fields.name.parentNode.classList.add("has-error"); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.push("a valid email"); fields.email.parentNode.classList.add("has-error"); }
      if (!message) { errors.push("a project description"); fields.message.parentNode.classList.add("has-error"); }

      if (errors.length) {
        note.textContent = "Please add " + errors.join(", ") + ".";
        note.className = "form__note is-error";
        var firstBad = form.querySelector(".has-error input, .has-error textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var subject = "Project enquiry — " + type + (place ? " in " + place : "");
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Property type: " + type + "\n" +
        "Property location: " + (place || "Not specified") + "\n\n" +
        "Project description:\n" + message + "\n";
      var mailto =
        "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      // Detect whether an email app actually took over (page loses focus / is hidden)
      var appOpened = false;
      function markOpened() { appOpened = true; }
      window.addEventListener("blur", markOpened, { once: true });
      document.addEventListener("visibilitychange", markOpened, { once: true });
      window.addEventListener("pagehide", markOpened, { once: true });

      window.location.href = mailto;

      note.textContent = "Opening your email app…";
      note.className = "form__note";

      setTimeout(function () {
        window.removeEventListener("blur", markOpened);
        document.removeEventListener("visibilitychange", markOpened);
        window.removeEventListener("pagehide", markOpened);
        if (appOpened) {
          note.textContent = "Your email draft is ready. Please review it and press Send in your email app — your enquiry has not been sent until you do.";
          note.className = "form__note is-success";
          if (fallback) fallback.hidden = true;
          var manual = document.createElement("button");
          manual.type = "button";
          manual.className = "form__link";
          manual.textContent = "Email app didn't open? Copy the enquiry instead";
          manual.addEventListener("click", function () { showFallback(subject, body, mailto); manual.remove(); });
          note.appendChild(document.createTextNode(" "));
          note.appendChild(manual);
        } else {
          note.textContent = "We couldn't open an email app on this device. Your enquiry has not been sent — please copy it below and email us directly.";
          note.className = "form__note is-error";
          showFallback(subject, body, mailto);
        }
      }, 1800);
    });
  }

  /* ---------- 9. Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
