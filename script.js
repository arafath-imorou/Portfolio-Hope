/**
 * Portfolio Interaction Script - v1.0.1
 * Dr. Hope AKOHOUVI AMOU
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Supabase Initialization ---
    const supabaseUrl = 'https://ampktfwcpopkomrsckjm.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcGt0ZndjcG9wa29tcnNja2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTI5NjgsImV4cCI6MjA5MjI4ODk2OH0.svDhF6SpoJ6v_mwK4Ep8q93CjA5R0sd59X3RcrgBjeo';
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
            // 1. Site Content (Hero, About, Contact)
            const { data: contentData } = await supabaseClient.from('site_content').select('*');
            contentData?.forEach(item => {
                const el = document.getElementById(item.id);
                if (el) {
                    if (item.id === 'contact_email') el.href = `mailto:${item.content}`;
                    el.innerHTML = item.content;
                }
            });

            // 2. Stats (Hero/Visual)
            const { data: statsData } = await supabaseClient.from('statistics').select('*').order('sort_order');
            const statsContainer = document.getElementById('stats-container');
            if (statsContainer && statsData?.length > 0) {
                statsContainer.innerHTML = statsData.map(s => `
                    <div class="stat-item">
                        <span class="stat-value count-up" data-target="${s.target}" data-prefix="${s.prefix || ''}" data-suffix="${s.suffix || ''}">0</span>
                        <span class="stat-label">${s.label}</span>
                    </div>
                `).join('');
                // Restart count-up observer for new stats
                statsContainer.querySelectorAll('.count-up').forEach(el => countUpObserver.observe(el));
            }

            // 3. Expertise
            const { data: expertiseData } = await supabaseClient.from('expertise').select('*').order('sort_order');
            const expertiseGrid = document.getElementById('expertise-grid');
            if (expertiseGrid && expertiseData?.length > 0) {
                expertiseGrid.innerHTML = expertiseData.map((exp, i) => `
                    <div class="expertise-card fade-in" style="animation-delay: ${0.1 * (i % 3)}s">
                        <div class="expertise-icon"><i class="ph ph-${exp.icon}"></i></div>
                        <h3 class="expertise-title">${exp.title}</h3>
                        <p class="expertise-desc">${exp.description}</p>
                    </div>
                `).join('');
            }

            // 4. Experiences
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

            // 5. Formations
            const { data: formData } = await supabaseClient.from('formations').select('*').order('sort_order');
            if (formData) {
                const academicList = document.getElementById('academic-formations');
                const professionalList = document.getElementById('professional-formations');
                const filterMap = (f) => `
                    <div class="formation-item">
                        <div class="formation-year-box">${f.year}</div>
                        <div class="formation-info">
                            <h4 class="formation-title">${f.title}</h4>
                            <p class="formation-detail">${f.detail}</p>
                        </div>
                    </div>
                `;
                if (academicList) academicList.innerHTML = formData.filter(f => f.type === 'academic').map(filterMap).join('');
                if (professionalList) professionalList.innerHTML = formData.filter(f => f.type === 'professional').map(filterMap).join('');
            }

            // 6. Certifications
            const { data: certData } = await supabaseClient.from('certifications').select('*').order('sort_order');
            const certList = document.getElementById('certifications-list');
            if (certList && certData) {
                certList.innerHTML = certData.map((c, i) => `
                    <div class="cert-timeline-item fade-in" style="animation-delay: ${0.1 * i}s">
                        <div class="cert-timeline-date">${c.year}</div>
                        <div class="cert-timeline-dot"></div>
                        <div class="cert-timeline-content-box">
                            <h3>${c.title}</h3>
                            <p>${c.description}</p>
                        </div>
                    </div>
                `).join('');
            }

            // 7. Skills
            const { data: skillData } = await supabaseClient.from('skills').select('*').order('sort_order');
            if (skillData) {
                const softwareList = document.getElementById('software-skills');
                const languageList = document.getElementById('language-skills');
                const tagMap = (s) => `<span class="skill-tag">${s.name}</span>`;
                if (softwareList) softwareList.innerHTML = skillData.filter(s => s.category === 'software').map(tagMap).join('');
                if (languageList) languageList.innerHTML = skillData.filter(s => s.category === 'language').map(tagMap).join('');
            }

            // 8. Interests
            const { data: intData } = await supabaseClient.from('interests').select('*').order('sort_order');
            const intList = document.getElementById('interests-list');
            if (intList && intData) {
                intList.innerHTML = intData.map((int, i) => `
                    <div class="interest-card fade-in" style="animation-delay: ${0.1 * i}s">
                        <div class="interest-icon-wrapper">
                            <i class="ph ph-${int.icon}"></i>
                        </div>
                        <p class="interest-label">${int.label}</p>
                    </div>
                `).join('');
            }

            // 9. Social Links
            const { data: socData } = await supabaseClient.from('social_links').select('*').order('sort_order');
            const socList = document.getElementById('social-links-list');
            if (socList && socData) {
                socList.innerHTML = socData.map(soc => `
                    <a href="${soc.url}" class="social-btn ${soc.platform.toLowerCase()}" aria-label="${soc.platform}" target="_blank">
                        <i class="ph ph-${soc.icon}"></i>
                    </a>
                `).join('');
            }

            // Re-trigger reveal observer for everything
            document.querySelectorAll('.fade-in').forEach((el) => {
                revealObserver.observe(el);
            });

        } catch (err) {
            console.error('CMS Load Error:', err);
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
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        let start = null;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const easedProgress = easeOut(progress);
            const current = Math.round(easedProgress * target);
            
            el.textContent = prefix + current + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = prefix + target + suffix;
            }
        };

        window.requestAnimationFrame(step);
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



    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Get form data using new IDs
            const name = document.getElementById('msg-name').value;
            const email = document.getElementById('msg-email').value;
            const subject = document.getElementById('msg-subject').value;
            const message = document.getElementById('msg-body').value;

            // UI State: Loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'ENVOI EN COURS...';

            try {
                const { error } = await supabaseClient
                    .from('contacts')
                    .insert([
                        { name, email, subject, message }
                    ]);

                if (error) throw error;

                // Create the recap card with WhatsApp forwarding
                const whatsappText = `Bonjour Dr. Hope, je viens de vous envoyer un message depuis votre Portfolio :\n\n👤 *Nom:* ${name}\n✉️ *Email:* ${email}\n📌 *Sujet:* ${subject}\n💬 *Message:* ${message}`;
                const whatsappUrl = `https://api.whatsapp.com/send?phone=2290190161549&text=${encodeURIComponent(whatsappText)}`;

                const originalFormHTML = contactForm.innerHTML;

                contactForm.innerHTML = `
                    <div class="recap-card fade-in">
                        <div class="recap-success-header">
                            <div class="recap-success-icon"><i class="ph-fill ph-check-circle"></i></div>
                            <h3>Message Envoyé avec Succès !</h3>
                            <p>Merci pour votre message. Voici votre récapitulatif :</p>
                        </div>
                        <div class="recap-details">
                            <p><strong>Nom :</strong> ${name}</p>
                            <p><strong>Email :</strong> ${email}</p>
                            <p><strong>Sujet :</strong> ${subject}</p>
                            <p><strong>Message :</strong></p>
                            <div class="recap-message-box">${message}</div>
                        </div>
                        <div class="recap-actions">
                            <a href="${whatsappUrl}" class="btn-whatsapp" target="_blank">
                                <i class="ph-fill ph-whatsapp-logo"></i> Envoyer aussi par WhatsApp
                            </a>
                            <button id="btn-reset-form" type="button" class="btn-text-only">Envoyer un autre message</button>
                        </div>
                    </div>
                `;

                document.getElementById('btn-reset-form').addEventListener('click', () => {
                    contactForm.innerHTML = originalFormHTML;
                });
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
