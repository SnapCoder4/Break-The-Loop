/* ============================================================
   script.js — BREAK The Loop
   Kelompok 8 · Universitas Bunda Mulia · Cyberpsychology
   Vanilla JS, ringan. Blok: navbar, menu, tema, reveal,
   kuis self-check, carousel artikel.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Tahun footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Menu mobile ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.classList.contains("nav__link")) {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3. Navbar scrolled ---------- */
  var navbar = document.getElementById("navbar");
  var lastScrolled = false;
  function onScroll() {
    var s = window.scrollY > 20;
    if (s !== lastScrolled && navbar) {
      navbar.classList.toggle("is-scrolled", s);
      lastScrolled = s;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Dark mode ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark";
      if (dark) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "dark");
      try {
        localStorage.setItem("btl-theme", dark ? "light" : "dark");
      } catch (e) {}
    });
  }

  /* ---------- 5. Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var el = en.target;
            var d = el.getAttribute("data-delay");
            if (d) el.style.transitionDelay = d + "ms";
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 6. Active nav link on scroll ---------- */
  var navLinks = document.querySelectorAll(".nav__link");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var s = document.querySelector(id);
      if (s) sections.push({ link: link, sec: s });
    }
  });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            navLinks.forEach(function (l) {
              l.classList.remove("is-active");
            });
            var m = sections.find(function (s) {
              return s.sec === en.target;
            });
            if (m) m.link.classList.add("is-active");
          }
        });
      },
      { threshold: 0.5 },
    );
    sections.forEach(function (s) {
      spy.observe(s.sec);
    });
  }

  /* ---------- 7. Self Check (Kuis) ----------
     10 pertanyaan berbasis kriteria gaming disorder (WHO/ICD-11):
     kontrol diri, prioritas, dampak fungsi, gejala, dan eskalasi.
     Skor tiap opsi 0–3, makin tinggi makin berisiko. */
  var QUESTIONS = [
    {
      q: "Seberapa sering kamu bermain game lebih lama dari yang kamu rencanakan?",
      options: [
        ["Hampir tidak pernah", 0],
        ["Kadang-kadang", 1],
        ["Cukup sering", 2],
        ["Hampir setiap kali", 3],
      ],
    },
    {
      q: "Seberapa sulit bagimu untuk berhenti bermain saat sudah waktunya berhenti?",
      options: [
        ["Mudah berhenti", 0],
        ["Kadang sulit", 1],
        ["Sering sulit", 2],
        ["Hampir tidak bisa berhenti", 3],
      ],
    },
    {
      q: "Apakah bermain game pernah mengganggu tugas, kuliah, atau pekerjaanmu?",
      options: [
        ["Tidak pernah", 0],
        ["Jarang", 1],
        ["Beberapa kali", 2],
        ["Sering sekali", 3],
      ],
    },
    {
      q: "Bagaimana waktu tidurmu karena bermain game?",
      options: [
        ["Teratur dan cukup", 0],
        ["Sesekali begadang", 1],
        ["Sering kurang tidur", 2],
        ["Pola tidur berantakan", 3],
      ],
    },
    {
      q: "Seberapa sering kamu merasa gelisah, cemas, atau marah saat tidak bisa bermain game?",
      options: [
        ["Tidak pernah", 0],
        ["Jarang", 1],
        ["Kadang-kadang", 2],
        ["Sering", 3],
      ],
    },
    {
      q: "Apakah kamu memilih bermain game daripada bertemu teman atau keluarga?",
      options: [
        ["Tidak pernah", 0],
        ["Sesekali", 1],
        ["Cukup sering", 2],
        ["Hampir selalu", 3],
      ],
    },
    {
      q: "Apakah kamu bermain game untuk menghindari masalah atau melarikan diri dari perasaan tidak enak?",
      options: [
        ["Tidak pernah", 0],
        ["Jarang", 1],
        ["Kadang-kadang", 2],
        ["Sering", 3],
      ],
    },
    {
      q: "Apakah orang terdekat pernah menegur soal waktu bermainmu?",
      options: [
        ["Tidak pernah", 0],
        ["Sekali-dua kali", 1],
        ["Beberapa kali", 2],
        ["Sering", 3],
      ],
    },
    {
      q: "Apakah kamu pernah berbohong atau menyembunyikan berapa lama kamu bermain game?",
      options: [
        ["Tidak pernah", 0],
        ["Pernah sekali", 1],
        ["Beberapa kali", 2],
        ["Sering", 3],
      ],
    },
    {
      q: "Apakah kamu terus bermain meski tahu game sudah berdampak buruk bagimu (nilai, kesehatan, hubungan)?",
      options: [
        ["Tidak, langsung kurangi", 0],
        ["Sempat berhenti sebentar", 1],
        ["Sulit mengurangi", 2],
        ["Tetap lanjut bermain", 3],
      ],
    },
  ];

  var quiz = document.getElementById("quiz");
  if (quiz) {
    var quizBody = document.getElementById("quizBody");
    var quizBar = document.getElementById("quizBar");
    var quizCounter = document.getElementById("quizCounter");
    var quizNav = document.getElementById("quizNav");
    var btnPrev = document.getElementById("quizPrev");
    var btnNext = document.getElementById("quizNext");
    var quizResult = document.getElementById("quizResult");
    var KEYS = ["A", "B", "C", "D"];

    var current = 0;
    var answers = new Array(QUESTIONS.length).fill(null);
    var answersIdx = new Array(QUESTIONS.length).fill(null);

    function render() {
      var item = QUESTIONS[current];
      var html =
        '<p class="quiz__question">' +
        item.q +
        '</p><div class="quiz__options">';
      item.options.forEach(function (opt, i) {
        var sel = answersIdx[current] === i ? " is-selected" : "";
        html +=
          '<button type="button" class="quiz__option' +
          sel +
          '" data-score="' +
          opt[1] +
          '" data-idx="' +
          i +
          '"><span class="quiz__option-key">' +
          KEYS[i] +
          "</span><span>" +
          opt[0] +
          "</span></button>";
      });
      html += "</div>";
      quizBody.innerHTML = html;
      quizCounter.textContent =
        "Pertanyaan " + (current + 1) + " dari " + QUESTIONS.length;
      quizBar.style.width = (current / QUESTIONS.length) * 100 + "%";
      btnPrev.style.visibility = current === 0 ? "hidden" : "visible";
      btnNext.textContent =
        current === QUESTIONS.length - 1 ? "Lihat Hasil" : "Selanjutnya";
      // re-add icon to next button
      btnNext.innerHTML =
        (current === QUESTIONS.length - 1 ? "Lihat Hasil" : "Selanjutnya") +
        ' <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      btnNext.disabled = answersIdx[current] === null;
    }

    quizBody.addEventListener("click", function (e) {
      var opt = e.target.closest(".quiz__option");
      if (!opt) return;
      answers[current] = parseInt(opt.getAttribute("data-score"), 10);
      answersIdx[current] = parseInt(opt.getAttribute("data-idx"), 10);
      quizBody.querySelectorAll(".quiz__option").forEach(function (o) {
        o.classList.remove("is-selected");
      });
      opt.classList.add("is-selected");
      btnNext.disabled = false;
    });

    btnNext.addEventListener("click", function () {
      if (answersIdx[current] === null) return;
      if (current < QUESTIONS.length - 1) {
        current++;
        render();
      } else showResult();
    });
    btnPrev.addEventListener("click", function () {
      if (current > 0) {
        current--;
        render();
      }
    });

    function showResult() {
      var total = answers.reduce(function (a, b) {
        return a + (b || 0);
      }, 0);
      var maxScore = QUESTIONS.length * 3;
      var pct = Math.round((total / maxScore) * 100);

      var level, desc, reco;
      if (pct <= 30) {
        level = "Rendah";
        desc =
          "Pola bermainmu tampak terkendali. Pertahankan keseimbangan yang sudah baik ini!";
        reco = [
          "Pertahankan batas waktu bermainmu",
          "Tetap jaga kualitas tidur",
          "Lanjutkan aktivitas di dunia nyata",
        ];
      } else if (pct <= 60) {
        level = "Sedang";
        desc =
          "Kamu memiliki risiko sedang terhadap kecanduan game. Yuk, mulai terapkan kebiasaan bermain yang lebih sehat.";
        reco = [
          "Atur waktu bermain dengan timer",
          "Istirahat yang cukup",
          "Lakukan aktivitas di dunia nyata",
          "Jaga kesehatan mental",
        ];
      } else if (pct <= 80) {
        level = "Tinggi";
        desc =
          "Pola bermainmu cukup berisiko. Pertimbangkan untuk mengevaluasi dan mengatur ulang jadwalmu.";
        reco = [
          "Batasi durasi bermain secara tegas",
          "Beri jeda teratur setiap sesi",
          "Prioritaskan tugas & tanggung jawab",
          "Bicara dengan orang yang dipercaya",
        ];
      } else {
        level = "Sangat Tinggi";
        desc =
          "Banyak tanda kuat terlihat. Akan sangat baik bila kamu mulai mencari dukungan dan mengevaluasi kebiasaan ini.";
        reco = [
          "Cari dukungan dari keluarga/teman",
          "Susun jadwal harian yang seimbang",
          "Kurangi waktu bermain bertahap",
          "Pertimbangkan konsultasi profesional",
        ];
      }

      // hitung distribusi jawaban
      var low = 0,
        mid = 0,
        high = 0;
      answers.forEach(function (s) {
        if (s <= 1) low++;
        else if (s === 2) mid++;
        else high++;
      });

      document.getElementById("gaugeLevel").textContent = level;
      document.getElementById("gaugeDesc").textContent = desc;
      document.getElementById("summaryList").innerHTML =
        "<li>Total Jawaban <strong>" +
        QUESTIONS.length +
        "</strong></li>" +
        "<li>Jawaban Risiko Rendah <strong>" +
        low +
        "</strong></li>" +
        "<li>Jawaban Risiko Sedang <strong>" +
        mid +
        "</strong></li>" +
        "<li>Jawaban Risiko Tinggi <strong>" +
        high +
        "</strong></li>";
      document.getElementById("recoList").innerHTML = reco
        .map(function (r) {
          return "<li>" + r + "</li>";
        })
        .join("");

      // ===== Kirim hasil ke email via EmailJS =====
      kirimHasil({
        level: level,
        pct: pct,
        low: low,
        mid: mid,
        high: high,
        reco: reco.join(", "),
        waktu: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      });

      // ===== Animasi gauge =====
      var arc = document.getElementById("gaugeArc");
      var levelEl = document.getElementById("gaugeLevel");
      var needle = document.getElementById("gaugeNeedle");
      arc.style.strokeDashoffset = "264";

      quizBody.hidden = true;
      quizNav.hidden = true;
      quizBar.style.width = "100%";
      quizCounter.textContent = "Selesai";
      quizResult.hidden = false;

      // siapkan teks level dalam keadaan tersembunyi dulu (untuk efek pop)
      levelEl.classList.remove("is-pop");
      levelEl.textContent = "0%";

      // 1) Arc terisi (smooth via transition CSS)
      setTimeout(function () {
        arc.style.strokeDashoffset = String(264 - (264 * pct) / 100);
        // 2) Jarum berputar mengikuti persentase: -90deg (kiri) → +90deg (kanan)
        if (needle) {
          var deg = -90 + (pct / 100) * 180;
          needle.style.transform = "translateX(-50%) rotate(" + deg + "deg)";
        }
      }, 150);

      // 3) Count-up persentase 0 → pct, lalu ganti jadi label level dengan efek pop
      var dur = 1100,
        t0 = null;
      function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        levelEl.textContent = Math.round(eased * pct) + "%";
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          levelEl.textContent = level;
          levelEl.classList.add("is-pop");
        }
      }
      requestAnimationFrame(tick);
    }

    document
      .getElementById("quizRestart")
      .addEventListener("click", function () {
        current = 0;
        answers = new Array(QUESTIONS.length).fill(null);
        answersIdx = new Array(QUESTIONS.length).fill(null);
        quizResult.hidden = true;
        quizBody.hidden = false;
        quizNav.hidden = false;
        render();
      });

    render();
  }

  /* ---------- 8. Carousel Artikel ---------- */
  var track = document.getElementById("artTrack");
  if (track) {
    var prevBtn = document.getElementById("artPrev");
    var nextBtn = document.getElementById("artNext");
    var dotsWrap = document.getElementById("artDots");
    var cards = track.children;
    var index = 0;

    function perView() {
      var w = window.innerWidth;
      if (w <= 720) return 1;
      if (w <= 980) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, cards.length - perView());
    }

    function update() {
      if (index > maxIndex()) index = maxIndex();
      var card = cards[0];
      var gap = 22;
      var step = card.getBoundingClientRect().width + gap;
      track.style.transform = "translateX(" + -step * index + "px)";
      // tombol
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= maxIndex();
      // dots
      buildDots();
    }

    function buildDots() {
      var pages = maxIndex() + 1;
      dotsWrap.innerHTML = "";
      for (var i = 0; i < pages; i++) {
        var b = document.createElement("button");
        if (i === index) b.className = "is-active";
        b.setAttribute("aria-label", "Slide " + (i + 1));
        (function (n) {
          b.addEventListener("click", function () {
            index = n;
            update();
          });
        })(i);
        dotsWrap.appendChild(b);
      }
    }

    prevBtn.addEventListener("click", function () {
      if (index > 0) {
        index--;
        update();
      }
    });
    nextBtn.addEventListener("click", function () {
      if (index < maxIndex()) {
        index++;
        update();
      }
    });

    // swipe / drag (touch + mouse)
    var startX = 0,
      dragging = false,
      moved = false;
    function down(x) {
      dragging = true;
      moved = false;
      startX = x;
    }
    function up(x) {
      if (!dragging) return;
      dragging = false;
      var dx = x - startX;
      if (Math.abs(dx) > 8) moved = true;
      if (dx < -50 && index < maxIndex()) {
        index++;
        update();
      } else if (dx > 50 && index > 0) {
        index--;
        update();
      }
    }
    track.addEventListener(
      "touchstart",
      function (e) {
        down(e.touches[0].clientX);
      },
      { passive: true },
    );
    track.addEventListener("touchend", function (e) {
      up(e.changedTouches[0].clientX);
    });
    track.addEventListener("mousedown", function (e) {
      down(e.clientX);
    });
    window.addEventListener("mouseup", function (e) {
      if (dragging) up(e.clientX);
    });
    // Cegah klik link bila baru saja menggeser (drag), bukan klik biasa
    track.addEventListener("click", function (e) {
      if (moved) {
        e.preventDefault();
        moved = false;
      }
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(update, 150);
    });

    update();
  }

  /* ============================================================
     Kirim hasil kuis ke email via EmailJS
     Cara setup (5 menit):
     1. Daftar gratis di https://www.emailjs.com
     2. Dashboard → Email Services → Add Service → pilih Gmail
     3. Dashboard → Email Templates → Create Template
        Isi template dengan variabel: {{level}}, {{pct}}, {{low}},
        {{mid}}, {{high}}, {{reco}}, {{waktu}}
     4. Salin: Public Key, Service ID, Template ID
     5. Ganti ketiga nilai di bawah ini
  ============================================================ */
  function kirimHasil(data) {
    // ⬇ Ganti tiga nilai ini dengan milikmu
    var SERVICE_ID = "service_etqy4wu";
    var TEMPLATE_ID = "template_4ixap2n";
    // Public Key sudah diisi di <head> index.html

    if (SERVICE_ID === "YOUR_SERVICE_ID") {
      // Belum disetup — log saja ke console supaya tidak error
      console.log("[BREAK The Loop] Hasil kuis (EmailJS belum disetup):", data);
      return;
    }

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, {
        level: data.level,
        pct: data.pct + "%",
        low: data.low,
        mid: data.mid,
        high: data.high,
        reco: data.reco,
        waktu: data.waktu,
      })
      .then(function () {
        console.log("[BREAK The Loop] Hasil kuis terkirim ke email ✓");
      })
      .catch(function (err) {
        console.warn("[BREAK The Loop] Gagal kirim email:", err);
      });
  }
})();
