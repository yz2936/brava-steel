// ============== Mobile menu toggle ==============
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }

    // ============== FAQ accordion ==============
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            item.classList.toggle('open');
        });
    });

    // ============== Form handler (demo) ==============
    document.querySelectorAll('form.demo-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const successEl = form.querySelector('.form-success');
            if (successEl) {
                successEl.classList.add('show');
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            form.reset();
            setTimeout(() => {
                if (successEl) successEl.classList.remove('show');
            }, 7000);
        });
    });

    // ============== Animated counters ==============
    const counters = document.querySelectorAll('[data-count]');
    const animate = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const val = Math.floor(target * (1 - Math.pow(1 - p, 3)));
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animate(e.target);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(c => obs.observe(c));
    } else {
        counters.forEach(animate);
    }

    // ============== Highlight active nav ==============
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.main-nav a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href === path || (path === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });
});
