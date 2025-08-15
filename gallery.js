document.addEventListener('DOMContentLoaded', () => {
    // Efek Card Stacking
    const cards = document.querySelectorAll('.gallery-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cardIndex = Array.from(cards).indexOf(entry.target);
                // Terapkan scaling pada kartu-kartu di belakangnya
                for (let i = 0; i < cardIndex; i++) {
                    const scaleValue = 1 - (cardIndex - i) * 0.05;
                    const translateValue = (cardIndex - i) * -15;
                    cards[i].style.transform = `scale(${Math.max(0.8, scaleValue)}) translateY(${translateValue}px)`;
                    cards[i].style.opacity = 1 - (cardIndex - i) * 0.1;
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.9 // Trigger saat 90% kartu terlihat
    });

    cards.forEach(card => {
        observer.observe(card);
    });

    // Efek Latar Belakang Partikel
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    const particleColors = ['#ffb3b3', '#E8D5C4', '#ffffff'];

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            let color = particleColors[Math.floor(Math.random() * particleColors.length)];
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
});
