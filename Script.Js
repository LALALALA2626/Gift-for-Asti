document.addEventListener('DOMContentLoaded', () => {
    // ===== Fade-to-Love controller =====
    window.fadeToLove = function(opts = {}) {
        const {
            image = './Assets/gallery/fade-love.jpg', // GANTI ke fotomu
            duration = 1200,   // durasi fade-in (ms)
            hold = 1600,       // waktu menahan gambar sebelum lanjut (ms)
            next = 'letter'    // 'letter' | 'gallery' | null
        } = opts;

        const node = document.getElementById('love-fade');
        if (!node) {
            console.warn('#love-fade not found');
            return;
        };

        // set background image via CSS var
        node.style.setProperty('--love-bg', `url('${image}')`);
        document.body.classList.add('no-scroll'); // kunci scroll
        node.classList.add('show');

        // setelah hold, hilangkan overlay & lanjut
        setTimeout(() => {
            node.classList.add('hide');
            setTimeout(() => {
                node.classList.remove('show', 'hide');
                document.body.classList.remove('no-scroll');

                if (next === 'letter') {
                    // lanjut ke overlay surat (punya kamu)
                    if (typeof openLetter === 'function') openLetter();
                } else if (next === 'gallery') {
                    window.location.href = 'gallery.html';
                }
            }, 700); // waktu fade-out
        }, duration + hold);
    }
    // --- PENTING: Kustomisasi di sini ---
    const anniversaryDate = new Date("Aug 16, 2025 00:00:00").getTime();
    const floatingPhotoUrls = [
        "./Assets/gallery/IMG-20250707-WA0022.jpg",
        "./Assets/gallery/IMG-20250707-WA0023.jpg",
        "./Assets/gallery/1.jpg",
        "./Assets/gallery/12.jpg",
        "./Assets/gallery/IMG-20250707-WA0025.jpg",
        "./Assets/gallery/IMG-20250707-WA0026.jpg",
        "./Assets/gallery/IMG-20250707-WA0027.jpg",
        "./Assets/gallery/IMG-20250707-WA0028.jpg",
        "./Assets/gallery/IMG-20250707-WA0029.jpg",
        "./Assets/gallery/IMG-20250707-WA0030.jpg",
        "./Assets/gallery/IMG-20250707-WA0031.jpg",
    ];

    const letterOverlay = document.getElementById('letter-overlay');
    const letterContent = document.querySelector('.letter-content');
    const birthdaySurprise = document.getElementById('birthday-surprise');
    const music = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const sunflowerContainer = document.getElementById('sunflower-container');
    let isMusicPlaying = false;
    let isOverlayOpening = false;

    // Countdown Timer
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = anniversaryDate - now;
        if (distance > 0) {
            document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000);

        } else {
            clearInterval(countdownInterval);
            // daripada mengubah teks, kita trigger Fade-to-Love
            fadeToLove({
                image: './assets/img/fade-love.jpg', // GANTI path ke fotomu
                duration: 1200,
                hold: 1800,
                next: 'letter' // atau 'gallery' kalau mau langsung ke galeri
            });
        };
    }, 1000);

// Music Player Control
musicControl.addEventListener('click', () => {
    if (isMusicPlaying) {
        music.pause();
        playIcon.style.display = 'block'; pauseIcon.style.display = 'none';
    } else {
        music.play();
        playIcon.style.display = 'none'; pauseIcon.style.display = 'block';
    }
    isMusicPlaying = !isMusicPlaying;
});

// --- FUNGSI GLOBAL ---
window.openLetter = function () {
    if (isOverlayOpening) return; // Mencegah klik ganda
    isOverlayOpening = true;

    // 1. Animasikan bunga matahari
    sunflowerContainer.classList.add('blooming');

    // 2. Setelah animasi bunga, mulai proses overlay
    setTimeout(() => {
        document.body.classList.add('no-scroll');
        if (!isMusicPlaying) {
            music.play().then(() => {
                isMusicPlaying = true;
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }).catch(e => console.error("Autoplay musik gagal, interaksi pengguna diperlukan.", e));
        }
        letterContent.classList.remove('hidden');
        birthdaySurprise.classList.remove('visible');

        const oldElements = letterOverlay.querySelectorAll('.floating-photo, .sakura-petal');
        oldElements.forEach(el => el.remove());

        // 3. Tampilkan overlay
        letterOverlay.classList.add('visible');

        // 4. Lepaskan foto-foto dari tengah
        const movers = []; // simpan state tiap foto (posisi, velocity, dll)
        const MAX_TRY = 100; // maksimal percobaan untuk menghindari area surat
        letterOverlay.style.setProperty('--photo-count', floatingPhotoUrls.length);

        function avoidLetterArea(x, y, size) {
            const rect = document.querySelector('.letter-content').getBoundingClientRect();
            const pad = 12; // padding aman
            // hit test overlap
            const overlaps = !(x + size / 2 < rect.left - pad ||
                x - size / 2 > rect.right + pad ||
                y + size / 2 < rect.top - pad ||
                y - size / 2 > rect.bottom + pad);
            return overlaps;
        }

        function randomStartPos(size) {
            let x, y, tries = 0;
            do {
                x = Math.random() * window.innerWidth;
                y = Math.random() * window.innerHeight;
                tries++;
            } while (avoidLetterArea(x, y, size) && tries < MAX_TRY);
            return { x, y };
        }

        floatingPhotoUrls.forEach((url, index) => {
            const img = document.createElement('img');
            img.src = url;
            img.className = 'floating-photo';
            letterOverlay.insertBefore(img, letterOverlay.firstChild);

            // ukuran random biar natural
            const size = Math.floor(180 + Math.random() * 100); // 180..280
            img.style.setProperty('--size', size + 'px');

            // rotasi dasar & delay bob
            const rot = Math.random() * 40 - 20;
            img.style.setProperty('--base-rot', rot + 'deg');
            img.style.animationDelay = (Math.random() * 1.2) + 's';

            // posisi awal (hindari area surat)
            const start = randomStartPos(size);
            // taruh di tengah dulu (untuk anim in), lalu animasikan ke posisi start
            setTimeout(() => {
                img.style.top = `${start.y}px`;
                img.style.left = `${start.x}px`;
                img.style.transform = `translate(-50%, -50%) scale(1) rotate(${rot}deg)`;
                img.style.opacity = '1';
            }, 60 * index);

            // velocity awal (arah acak)
            const speed = 0.25 + Math.random() * 0.5; // px per frame
            const angle = Math.random() * Math.PI * 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            movers.push({
                el: img,
                x: start.x, y: start.y,
                vx, vy,
                size,
                dragging: false,
                lastMouse: null
            });

            // DRAG handlers
            const startDrag = (e) => {
                e.preventDefault();
                const p = ('touches' in e) ? e.touches[0] : e;
                const m = movers.find(m => m.el === img);
                m.dragging = true;
                m.lastMouse = { x: p.clientX, y: p.clientY };
                img.style.transition = 'none'; // matikan transisi saat drag
            };
            const duringDrag = (e) => {
                const m = movers.find(m => m.el === img);
                if (!m || !m.dragging) return;
                const p = ('touches' in e) ? e.touches[0] : e;
                const dx = p.clientX - m.lastMouse.x;
                const dy = p.clientY - m.lastMouse.y;
                m.x += dx; m.y += dy;
                m.lastMouse = { x: p.clientX, y: p.clientY };
                // update posisi realtime
                m.el.style.left = m.x + 'px';
                m.el.style.top = m.y + 'px';
            };
            const endDrag = (e) => {
                const m = movers.find(m => m.el === img);
                if (!m) return;
                if (m.dragging && m.lastMouse) {
                    // estimasi velocity dari gerakan terakhir
                    m.vx = (Math.random() * 0.4 - 0.2) + (Math.random() * 0.3);
                    m.vy = (Math.random() * 0.4 - 0.2) + (Math.random() * 0.3);
                }
                m.dragging = false;
                m.lastMouse = null;
                img.style.transition = ''; // pulihkan transisi bawaan
            };

            img.addEventListener('mousedown', startDrag);
            window.addEventListener('mousemove', duringDrag);
            window.addEventListener('mouseup', endDrag);

            img.addEventListener('touchstart', startDrag, { passive: false });
            window.addEventListener('touchmove', duringDrag, { passive: false });
            window.addEventListener('touchend', endDrag);
        });

        // LOOP animasi drift: bebas, bounce di tepi, hindari area surat
        let driftTick = 0;
        function drift() {
            requestAnimationFrame(drift);
            driftTick++;

            const W = window.innerWidth, H = window.innerHeight;
            const letterRect = document.querySelector('.letter-content').getBoundingClientRect();

            movers.forEach(m => {
                if (m.dragging) return;

                // sedikit “jitter” agar jalur tak statis
                const jitter = 0.02;
                m.vx += (Math.random() - 0.5) * jitter;
                m.vy += (Math.random() - 0.5) * jitter;
                // clamp speed biar halus
                const max = 0.9;
                m.vx = Math.max(Math.min(m.vx, max), -max);
                m.vy = Math.max(Math.min(m.vy, max), -max);

                m.x += m.vx;
                m.y += m.vy;

                // bounce ke tepi viewport
                if (m.x - m.size / 2 < 0) { m.x = m.size / 2; m.vx *= -1; }
                if (m.x + m.size / 2 > W) { m.x = W - m.size / 2; m.vx *= -1; }
                if (m.y - m.size / 2 < 0) { m.y = m.size / 2; m.vy *= -1; }
                if (m.y + m.size / 2 > H) { m.y = H - m.size / 2; m.vy *= -1; }

                // hindari area surat: kalau overlap → “mental” dari kotak surat
                const overlaps = !(m.x + m.size / 2 < letterRect.left ||
                    m.x - m.size / 2 > letterRect.right ||
                    m.y + m.size / 2 < letterRect.top ||
                    m.y - m.size / 2 > letterRect.bottom);

                if (overlaps) {
                    // vector dari pusat surat ke foto → dorong keluar
                    const cx = (letterRect.left + letterRect.right) / 2;
                    const cy = (letterRect.top + letterRect.bottom) / 2;
                    const dx = m.x - cx, dy = m.y - cy;
                    const len = Math.max(1, Math.hypot(dx, dy));
                    m.vx = (dx / len) * 0.8;
                    m.vy = (dy / len) * 0.8;
                    m.x += m.vx * 4;
                    m.y += m.vy * 4;
                }

                m.el.style.left = m.x + 'px';
                m.el.style.top = m.y + 'px';
            });
        }
        drift();

        // Update saat resize: cegah nyangkut di luar
        window.addEventListener('resize', () => {
            const W = window.innerWidth, H = window.innerHeight;
            movers.forEach(m => {
                m.x = Math.min(Math.max(m.x, m.size / 2), W - m.size / 2);
                m.y = Math.min(Math.max(m.y, m.size / 2), H - m.size / 2);
            });
        });

        // 5. Buat Efek Bunga Sakura Gugur
        for (let i = 0; i < 50; i++) {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal';
            petal.innerHTML = '🌸';
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.animationDuration = `${Math.random() * 3 + 5}s`;
            petal.style.animationDelay = `${Math.random() * 5}s`;
            petal.style.fontSize = `${Math.random() * 10 + 10}px`;
            letterOverlay.insertBefore(petal, letterOverlay.firstChild);
        }

    }, 800); // Tunggu 0.8 detik (sesuai durasi transisi bunga)
}

window.triggerBirthdaySurprise = function () {
    letterContent.classList.add('hidden');
    birthdaySurprise.classList.add('visible');
    const colors = ['#800000', '#ffb3b3', '#ffffff', '#ffdada', '#E8D5C4'];

    const oldConfetti = birthdaySurprise.querySelectorAll('.confetti');
    oldConfetti.forEach(c => c.remove());

    for (let i = 0; i < 200; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${-20 + Math.random() * 20}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `scale(${Math.random() + 0.5}) rotate(${Math.random() * 360}deg)`;
        confetti.style.animationDelay = `${Math.random() * 0.2}s`;
        birthdaySurprise.appendChild(confetti);
        setTimeout(() => { confetti.remove(); }, 4000);
    }
}

window.closeLetterOverlay = function () {
    document.body.classList.remove('no-scroll');
    letterOverlay.classList.remove('visible');
    sunflowerContainer.classList.remove('blooming'); // Reset bunga
    isOverlayOpening = false; // Reset status
}
});