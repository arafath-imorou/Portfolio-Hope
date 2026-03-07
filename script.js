/**
 * Portfolio Interaction Script
 * Dr. Hope AKOHOUVI AMOU
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- 2. Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    // Toggle menu
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Change icon
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    });

    // --- 3. Scroll Reveal Animation (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.fade-in');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            } else {
                // Optional: Remove class if you want them to animate out when scrolled past
                // entry.target.classList.remove('appear');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Active Navigation Link Update ---
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Adjust offset for sticky header
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    }, { passive: true });

    // --- 5. Count-Up Animation for Statistics ---
    const countUpElements = document.querySelectorAll('.count-up');

    function animateCountUp(el) {
        if (el.dataset.animated) return; // Prevent double-run
        el.dataset.animated = 'true';

        const target = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        const counter = setInterval(() => {
            frame++;
            const progress = easeOut(frame / totalFrames);
            const current = Math.round(progress * target);
            el.textContent = prefix + current + suffix;

            if (frame === totalFrames) {
                clearInterval(counter);
                el.textContent = prefix + target + suffix;
            }
        }, frameDuration);
    }

    const countUpObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCountUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    countUpElements.forEach(el => {
        countUpObserver.observe(el);
    });

    // Force trigger for elements already in the viewport at page load
    setTimeout(() => {
        countUpElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateCountUp(el);
            }
        });
    }, 500);

    // Initial trigger for elements already in viewport on load
    // --- 6. Supabase Integration ---
    const supabaseUrl = 'https://vrpgdacebchpxfjeowzm.supabase.co';
    const supabaseKey = 'sb_publishable_IHm_8q7bkmUV23QHSA4ztw_Zel0K6wS';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Get form data
            const name = contactForm.querySelector('input[placeholder="Nom"]').value;
            const email = contactForm.querySelector('input[placeholder="Email"]').value;
            const subject = contactForm.querySelector('input[placeholder="Sujet"]').value;
            const message = contactForm.querySelector('textarea[placeholder="Message"]').value;

            // UI State: Loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'ENVOI EN COURS...';

            try {
                const { data, error } = await supabase
                    .from('contacts')
                    .insert([
                        { name, email, subject, message }
                    ]);

                if (error) throw error;

                // Success feedback
                alert('Merci ! Votre message a été envoyé avec succès.');
                contactForm.reset();
            } catch (error) {
                console.error('Supabase error:', error.message);
                alert('Oups ! Une erreur est survenue lors de l\'envoi. Veuillez réessayer plus tard.');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
