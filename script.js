/**
 * Portfolio Interaction Script
 * Dr. Hope AKOHOUVI AMOU
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Supabase Initialization ---
    const supabaseUrl = 'https://vrpgdacebchpxfjeowzm.supabase.co';
    const supabaseKey = 'sb_publishable_IHm_8q7bkmUV23QHSA4ztw_Zel0K6wS';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    // --- 0.1 Scroll Reveal Animation (Intersection Observer) ---
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, revealOptions);

    // Observe initial elements
    document.querySelectorAll('.fade-in').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 0.2 CMS Content Loading ---

    async function loadCMSContent() {
        try {
            // Load Site Content (Texts)
            const { data: contentData } = await supabaseClient.from('site_content').select('*');
            contentData?.forEach(item => {
                const el = document.getElementById(item.id);
                if (el) el.innerHTML = item.content;
            });

            // Load Expertise
            const { data: expertiseData } = await supabaseClient.from('expertise').select('*').order('sort_order');
            const expertiseGrid = document.getElementById('expertise-grid');
            if (expertiseGrid && expertiseData?.length > 0) {
                expertiseGrid.innerHTML = expertiseData.map(exp => `
                    <div class="expertise-card fade-in">
                        <div class="expertise-icon"><i class="ph ph-${exp.icon}"></i></div>
                        <h3 class="expertise-title">${exp.title}</h3>
                        <p class="expertise-desc">${exp.description}</p>
                    </div>
                `).join('');
            }

            // Load Experiences
            const { data: expData } = await supabaseClient.from('experiences').select('*').order('sort_order');
            const timeline = document.getElementById('experience-timeline');
            if (timeline && expData?.length > 0) {
                timeline.innerHTML = expData.map(exp => `
                    <div class="timeline-item fade-in">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <span class="timeline-date">${exp.period}</span>
                            <h3 class="timeline-role">${exp.role}</h3>
                            <h4 class="timeline-company">${exp.company}</h4>
                            <p class="timeline-desc">${exp.description}</p>
                            <ul class="timeline-list">
                                ${Array.isArray(exp.bullets) ? exp.bullets.map(b => `<li>${b}</li>`).join('') : ''}
                            </ul>
                        </div>
                    </div>
                `).join('');
            }

            // Load Formations
            const { data: formData } = await supabaseClient.from('formations').select('*').order('sort_order');
            if (formData) {
                const academicList = document.getElementById('academic-formations');
                const professionalList = document.getElementById('professional-formations');

                if (academicList) academicList.innerHTML = formData.filter(f => f.type === 'academic').map(f => `
                    <div class="formation-item">
                        <div class="formation-year-box">${f.year}</div>
                        <div class="formation-info">
                            <h4 class="formation-title">${f.title}</h4>
                            <p class="formation-detail">${f.detail}</p>
                        </div>
                    </div>
                `).join('');

                if (professionalList) professionalList.innerHTML = formData.filter(f => f.type === 'professional').map(f => `
                    <div class="formation-item">
                        <div class="formation-year-box">${f.year}</div>
                        <div class="formation-info">
                            <h4 class="formation-title">${f.title}</h4>
                            <p class="formation-detail">${f.detail}</p>
                        </div>
                    </div>
                `).join('');
            }

            // Load Skills
            const { data: skillData } = await supabaseClient.from('skills').select('*').order('sort_order');
            if (skillData) {
                const softwareList = document.getElementById('software-skills');
                const languageList = document.getElementById('language-skills');

                if (softwareList) softwareList.innerHTML = skillData.filter(s => s.category === 'software').map(s => `
                    <span class="skill-tag">${s.name}</span>
                `).join('');

                if (languageList) languageList.innerHTML = skillData.filter(s => s.category === 'language').map(s => `
                    <span class="skill-tag">${s.name}</span>
                `).join('');
            }

            // Re-trigger scroll animations for new elements
            revealObserver.disconnect(); // Use the existing revealObserver
            document.querySelectorAll('.fade-in').forEach((el) => { // Only target .fade-in as per original script
                revealObserver.observe(el);
            });

        } catch (err) {
            console.error('CMS Error:', err);
        }
    }

    loadCMSContent();

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

    // --- 4. Active Navigation Link Update ---

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
                const { data, error } = await supabaseClient
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

    // --- 7. Hidden Admin Access ---
    // Clicking "2026" in footer once opens the login page
    const adminTrigger = document.getElementById('admin-trigger');

    if (adminTrigger) {
        adminTrigger.style.cursor = 'default';
        adminTrigger.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});
