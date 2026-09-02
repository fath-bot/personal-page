/* =============================================================
   Pals Dental — interaksi halaman
   - mode terang/gelap (tersimpan di localStorage)
   - menu navigasi mobile
   - bayangan header saat di-scroll
   - animasi fade-in halus setiap section
   - penanganan formulir janji temu (demo)
   ============================================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Tandai bahwa JS aktif, sehingga elemen .reveal baru disembunyikan (anti-flash). */
  root.classList.add('js');

  /* ---------- Mode terang / gelap ---------- */
  var themeBtn = document.getElementById('theme-toggle');

  function setTheme(theme) {
    if (theme === 'dark') { root.dataset.theme = 'dark'; } else { delete root.dataset.theme; }
    try { localStorage.setItem('palsdental-theme', theme); } catch (e) {}
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
    // Sinkronkan label ikon awal
    setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  }

  /* ---------- Menu navigasi mobile ---------- */
  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');

  function closeNav() {
    if (!header || !navToggle) return;
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Buka menu navigasi');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Tutup menu saat salah satu tautan diklik
  header.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Tutup menu dengan tombol Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  // Tutup menu bila klik terjadi di luar header
  document.addEventListener('click', function (e) {
    if (header.classList.contains('nav-open') && !header.contains(e.target)) closeNav();
  });

  /* ---------- Bayangan header saat di-scroll ---------- */
  function onScroll() {
    if (window.scrollY > 8) { header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Animasi fade-in halus (IntersectionObserver) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    // Fallback: tampilkan semua konten tanpa animasi
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Formulir janji temu (demo, tanpa pengiriman data) ---------- */
  var form = document.getElementById('booking-form');
  var success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validasi ringan berdasar atribut required
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      form.hidden = true;
      if (success) success.hidden = false;
    });
  }

  /* ---------- Tahun berjalan pada footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* =============================================================
     Modal profil dokter (klik kartu / "Lihat Profil Lengkap")
     ============================================================= */
  var DOCTORS = [
    {
      photo: 'doc-1',
      spec: 'Spesialis Ortodonti',
      name: 'drg. Andini Prameswari',
      rating: '4.9',
      ratingPct: '98%',
      about: 'Dengan lebih dari 12 tahun praktik, drg. Andini menangani perawatan ortodonti untuk anak dan dewasa. Ia dikenal komunikatif dan sabar, sehingga proses pemasangan kawat gigi terasa jauh lebih ringan.',
      exp: '12 tahun praktik; lebih dari 1.200 kasus behel dan perapian gigi, termasuk maloklusi kompleks.',
      edu: 'Spesialis Ortodonti (Sp.Ort) &mdash; Fakultas Kedokteran Gigi Universitas Indonesia; drg. &mdash; FKG Universitas Airlangga.',
      skills: [
        'Kawat gigi konvensional &amp; self-ligating (bebras)',
        'Perawatan perapi gigi transparan (aligner)',
        'Ortodonti anak &amp; penanganan kebiasaan buruk',
        'Koreksi gigi berjejal dan gangguan gigitan'
      ],
      schedule: [
        ['Senin &ndash; Rabu', '09.00 &ndash; 17.00'],
        ['Jumat', '09.00 &ndash; 15.00'],
        ['Sabtu (per janji)', '08.00 &ndash; 12.00']
      ]
    },
    {
      photo: 'doc-2',
      spec: 'Spesialis Bedah Mulut',
      name: 'drg. Reza Maulana',
      rating: '4.8',
      ratingPct: '96%',
      about: 'Berpengalaman 14 tahun di bidang bedah mulut, drg. Reza menangani mulai dari pencabutan gigi bungsu impaksi hingga pemasangan implant. Ia mengutamakan prosedur yang minim trauma dan kenyamanan pasien selama tindakan.',
      exp: '14 tahun praktik; lebih dari 1.000 prosedur implant gigi dan odontektomi gigi bungsu.',
      edu: 'Spesialis Bedah Mulut dan Maksilofasial (Sp.BM) &mdash; FKG Universitas Gadjah Mada; drg. &mdash; FKG Universitas Indonesia.',
      skills: [
        'Cabut gigi bungsu / odontektomi',
        'Pemasangan implant gigi',
        'Bedah jaringan lunak dan keras rongga mulut',
        'Penanganan trauma &amp; infeksi rongga mulut'
      ],
      schedule: [
        ['Selasa &ndash; Kamis', '10.00 &ndash; 18.00'],
        ['Jumat', '09.00 &ndash; 15.00'],
        ['Sabtu', '08.00 &ndash; 15.00']
      ]
    },
    {
      photo: 'doc-3',
      spec: 'Spesialis Konservasi Gigi',
      name: 'drg. Sarah Wijaya',
      rating: '4.9',
      ratingPct: '98%',
      about: 'Spesialis konservasi gigi dengan 9 tahun pengalaman, drg. Sarah berfokus pada tambal estetik dan perawatan saluran akar berbantuan mikroskop untuk hasil yang presisi dengan rasa nyeri minimal.',
      exp: '9 tahun praktik; lebih dari 800 perawatan saluran akar yang sukses.',
      edu: 'Spesialis Konservasi Gigi (Sp.KG) &mdash; FKG Universitas Indonesia; drg. &mdash; FKG Universitas Padjadjaran.',
      skills: [
        'Tambal estetik komposit (bebas merkuri)',
        'Perawatan saluran akar / endodontik dengan mikroskop',
        'Veneer dan pemutihan gigi',
        'Perawatan gigi retak dan sensitif'
      ],
      schedule: [
        ['Senin &ndash; Jumat', '09.00 &ndash; 17.00'],
        ['Sabtu (per janji)', '08.00 &ndash; 13.00']
      ]
    }
  ];

  var modal = document.getElementById('doctor-modal');
  var modalBody = document.getElementById('doctor-modal-body');
  var modalMedia = document.getElementById('doctor-modal-media');
  var lastTrigger = null;

  function starRow() {
    return '<span class="stars-row"><i data-s="1"></i><i data-s="2"></i><i data-s="3"></i><i data-s="4"></i><i data-s="5"></i></span>';
  }

  function buildDoctorModal(i) {
    var d = DOCTORS[i];
    if (!d) return '';

    var skillsHtml = d.skills.map(function (s) {
      return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>' + s + '</span></li>';
    }).join('');

    var schedHtml = d.schedule.map(function (row) {
      return '<li><span class="sched-day">' + row[0] + '</span><span class="sched-time">' + row[1] + '</span></li>';
    }).join('');

    return '' +
      '<div class="doc-modal-chip"><span class="chip">' + d.spec + '</span></div>' +
      '<h3 class="doc-modal-name" id="doctor-modal-title">' + d.name + '</h3>' +
      '<div class="doc-modal-rating">' +
        '<span class="stars" role="img" aria-label="Rating ' + d.rating + ' dari 5" style="--rating:' + d.ratingPct + '">' +
          starRow() + starRow().replace('stars-row"', 'stars-row stars-fill"') +
        '</span>' +
        '<span class="stars-num">' + d.rating + '</span>' +
        '<span class="doc-modal-rating-note">kepuasan pasien ' + d.ratingPct + '</span>' +
      '</div>' +
      '<p class="doc-modal-about">' + d.about + '</p>' +
      '<div class="doc-facts">' +
        '<div class="doc-fact"><span class="fact-k">Pengalaman</span><span class="fact-v">' + d.exp + '</span></div>' +
        '<div class="doc-fact"><span class="fact-k">Pendidikan</span><span class="fact-v">' + d.edu + '</span></div>' +
      '</div>' +
      '<h4 class="doc-modal-sub">Bidang keahlian</h4>' +
      '<ul class="doc-check-list">' + skillsHtml + '</ul>' +
      '<h4 class="doc-modal-sub">Jadwal praktik</h4>' +
      '<ul class="doc-schedule-list">' + schedHtml + '</ul>' +
      '<div class="doc-modal-cta">' +
        '<a class="btn btn-primary" href="#kontak" data-doc-book>Buat Janji Temu</a>' +
        '<p class="doc-modal-hint">Atau hubungi <a href="tel:+622155501234">(021) 5550-1234</a> pada jam kerja.</p>' +
      '</div>';
  }

  function openDoctorModal(i, trigger) {
    if (!modal || !DOCTORS[i]) return;
    lastTrigger = trigger || null;
    if (modalMedia) modalMedia.className = 'doc-modal-media ' + DOCTORS[i].photo;
    if (modalBody) modalBody.innerHTML = buildDoctorModal(i);
    modal.hidden = false;
    requestAnimationFrame(function () { document.body.classList.add('modal-open'); });
    if (lastTrigger) lastTrigger.setAttribute('aria-expanded', 'true');
    var closeBtn = modal.querySelector('.doc-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeDoctorModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastTrigger) {
      lastTrigger.setAttribute('aria-expanded', 'false');
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  var docTriggers = document.querySelectorAll('.doc-trigger');
  docTriggers.forEach(function (card) {
    card.addEventListener('click', function () {
      openDoctorModal(parseInt(card.getAttribute('data-doctor'), 10), card);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDoctorModal(parseInt(card.getAttribute('data-doctor'), 10), card);
      }
    });
  });

  if (modal) {
    // Tutup lewat tombol X / latar belakang
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-doc-close]') || e.target === modal.querySelector('.doc-modal-backdrop')) {
        closeDoctorModal();
      }
    });

    // Tombol "Buat Janji Temu" di dalam modal
    modal.addEventListener('click', function (e) {
      var book = e.target.closest('[data-doc-book]');
      if (!book) return;
      e.preventDefault();
      closeDoctorModal();
      location.hash = '#kontak';
    });

    // Escape untuk menutup + jebakan fokus (Tab) di dalam dialog
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDoctorModal(); return; }
      if (e.key !== 'Tab') return;
      var focusables = modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
