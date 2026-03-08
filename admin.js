const supabaseUrl = 'https://vrpgdacebchpxfjeowzm.supabase.co';
const supabaseKey = 'sb_publishable_IHm_8q7bkmUV23QHSA4ztw_Zel0K6wS';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// --- Dom Elements ---
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const sectionTitle = document.getElementById('section-title');
const lastSyncSpan = document.getElementById('last-sync');

// --- Navigation ---
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.dataset.tab;

        // UI updates
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        sectionTitle.textContent = item.querySelector('span').textContent;

        tabContents.forEach(content => {
            content.style.display = content.id === `${target}-section` ? 'block' : 'none';
        });

        // Load data for the section
        loadSectionData(target);
    });
});

// --- Auth Check ---
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    // Load initial section
    loadSectionData('messages');
}

// --- Dynamic Loader ---
async function loadSectionData(section) {
    updateSyncTime();

    switch (section) {
        case 'messages': fetchMessages(); break;
        case 'hero': loadHeroData(); break;
        case 'career': loadCareerData(); break;
        case 'formations': loadFormationsData(); break;
        case 'skills': loadSkillsData(); break;
        case 'interests': loadInterestsData(); break;
        case 'social': loadSocialData(); break;
    }
}

function updateSyncTime() {
    lastSyncSpan.textContent = `Dernière synchro: ${new Date().toLocaleTimeString()}`;
}

// --- 1. Messages ---
async function fetchMessages() {
    const container = document.getElementById('messages-container');
    const { data, error } = await supabaseClient.from('contacts').select('*').order('created_at', { ascending: false });

    if (error) { container.innerHTML = `<div class="error">Erreur: ${error.message}</div>`; return; }
    if (data.length === 0) { container.innerHTML = `<div class="loading-state">Aucun message.</div>`; return; }

    container.innerHTML = data.map(msg => `
        <div class="message-card">
            <div class="msg-meta"><span>${new Date(msg.created_at).toLocaleDateString()}</span><i class="ph ph-envelope"></i></div>
            <div class="msg-name">${msg.name}</div>
            <div class="msg-email">${msg.email}</div>
            <hr style="margin: 1rem 0; border:0; border-top:1px solid #eee;">
            <div class="msg-subject">${msg.subject || 'Sans objet'}</div>
            <div class="msg-body">${msg.message}</div>
        </div>
    `).join('');
}

// --- 2. Hero & Stats ---
async function loadHeroData() {
    // Texts
    const heroIds = ['hero_badge', 'hero_title_prefix', 'hero_name', 'hero_suffix', 'hero_description'];
    const { data: heroData } = await supabaseClient.from('site_content').select('*').in('id', heroIds);
    const container = document.getElementById('hero-inputs');

    if (heroData) {
        container.innerHTML = heroData.map(item => `
            <div class="input-group">
                <label>${item.id.replace('hero_', '').replace('_', ' ')}</label>
                <textarea class="admin-input-hero" data-id="${item.id}" rows="2">${item.content}</textarea>
                <button class="save-btn" style="margin-top:0.5rem; padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="saveDirectContent(this)">Enregistrer</button>
            </div>
        `).join('');
    }

    // Stats
    const { data: statsData } = await supabaseClient.from('statistics').select('*').order('sort_order');
    const statsList = document.getElementById('stats-list');
    if (statsData) {
        statsList.innerHTML = statsData.map(s => renderItemEditor(s, 'statistics', [
            { field: 'target', label: 'Cible (Nombre)', type: 'number' },
            { field: 'label', label: 'Libellé', type: 'text' },
            { field: 'prefix', label: 'Préfixe', type: 'text' },
            { field: 'suffix', label: 'Suffixe', type: 'text' },
            { field: 'icon', label: 'Icon (Phosphor)', type: 'text' }
        ])).join('');
    }
}

// --- 3. Career (Expertise & Exp) ---
async function loadCareerData() {
    // Expertise
    const { data: expertiseData } = await supabaseClient.from('expertise').select('*').order('sort_order');
    const expertiseList = document.getElementById('expertise-list');
    if (expertiseData) {
        expertiseList.innerHTML = expertiseData.map(exp => renderItemEditor(exp, 'expertise', [
            { field: 'title', label: 'Titre', type: 'text' },
            { field: 'icon', label: 'Icon (Sans ph-)', type: 'text' },
            { field: 'description', label: 'Description', type: 'textarea' }
        ])).join('');
    }

    // Experiences
    const { data: expData } = await supabaseClient.from('experiences').select('*').order('sort_order');
    const expList = document.getElementById('experiences-list');
    if (expData) {
        expList.innerHTML = expData.map(exp => renderItemEditor(exp, 'experiences', [
            { field: 'role', label: 'Rôle', type: 'text' },
            { field: 'company', label: 'Entreprise', type: 'text' },
            { field: 'period', label: 'Période', type: 'text' },
            { field: 'description', label: 'Description courte', type: 'textarea' },
            { field: 'bullets', label: 'Points clés (un par ligne)', type: 'bullets' }
        ])).join('');
    }
}

// --- 4. Formations & Certs ---
async function loadFormationsData() {
    const { data: formData } = await supabaseClient.from('formations').select('*').order('sort_order');
    const fList = document.getElementById('formations-list');
    if (formData) {
        fList.innerHTML = formData.map(f => renderItemEditor(f, 'formations', [
            { field: 'type', label: 'Type', type: 'select', options: [{ v: 'academic', l: 'Académique' }, { v: 'professional', l: 'Professionnel' }] },
            { field: 'title', label: 'Diplôme / Titre', type: 'text' },
            { field: 'detail', label: 'Établissement / Lieu', type: 'text' },
            { field: 'year', label: 'Année', type: 'text' }
        ])).join('');
    }

    const { data: certData } = await supabaseClient.from('certifications').select('*').order('sort_order');
    const cList = document.getElementById('certifications-list');
    if (certData) {
        cList.innerHTML = certData.map(c => renderItemEditor(c, 'certifications', [
            { field: 'year', label: 'Année', type: 'text' },
            { field: 'title', label: 'Nom du Certificat', type: 'text' },
            { field: 'description', label: 'Détails', type: 'textarea' }
        ])).join('');
    }
}

// --- 5. Skills ---
async function loadSkillsData() {
    const { data: skillData } = await supabaseClient.from('skills').select('*').order('sort_order');
    const sList = document.getElementById('skills-list');
    if (skillData) {
        sList.innerHTML = skillData.map(s => renderItemEditor(s, 'skills', [
            { field: 'category', label: 'Catégorie', type: 'select', options: [{ v: 'software', l: 'Logiciel/Outil' }, { v: 'language', l: 'Langue' }] },
            { field: 'name', label: 'Nom', type: 'text' }
        ])).join('');
    }
}

// --- 6. Interests ---
async function loadInterestsData() {
    const { data: intData } = await supabaseClient.from('interests').select('*').order('sort_order');
    const iList = document.getElementById('interests-list');
    if (intData) {
        iList.innerHTML = intData.map(i => renderItemEditor(i, 'interests', [
            { field: 'label', label: 'Nom', type: 'text' },
            { field: 'icon', label: 'Icon (Phosphor)', type: 'text' }
        ])).join('');
    }
}

// --- 7. Social & Contact ---
async function loadSocialData() {
    const { data: socData } = await supabaseClient.from('social_links').select('*').order('sort_order');
    const sList = document.getElementById('social-list');
    if (socData) {
        sList.innerHTML = socData.map(s => renderItemEditor(s, 'social_links', [
            { field: 'platform', label: 'Réseau', type: 'text' },
            { field: 'url', label: 'URL', type: 'text' },
            { field: 'icon', label: 'Icon (Phosphor)', type: 'text' }
        ])).join('');
    }

    const contactIds = ['contact_address', 'contact_email', 'contact_phone_1', 'contact_phone_2'];
    const { data: contactData } = await supabaseClient.from('site_content').select('*').in('id', contactIds);
    const container = document.getElementById('contact-inputs');
    if (contactData) {
        container.innerHTML = contactData.map(item => `
            <div class="input-group">
                <label>${item.id.replace('contact_', '').replace('_', ' ')}</label>
                <input type="text" class="admin-input-hero" data-id="${item.id}" value="${item.content}">
                <button class="save-btn" style="margin-top:0.5rem; padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="saveDirectContent(this)">Enregistrer</button>
            </div>
        `).join('');
    }
}

// --- Generic Renderers & Helpers ---

function renderItemEditor(item, table, fields) {
    return `
        <div class="item-editor" data-id="${item.id}" data-table="${table}">
            <span class="delete-btn" onclick="deleteItem('${item.id}', '${table}')"><i class="ph ph-trash"></i></span>
            <div class="edit-cue"><i class="ph ph-pencil-simple"></i> Édition ${table}</div>
            <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                ${fields.map(f => {
        if (f.type === 'textarea') return `<div class="input-group"><label>${f.label}</label><textarea class="admin-input" data-field="${f.field}">${item[f.field] || ''}</textarea></div>`;
        if (f.type === 'bullets') return `<div class="input-group"><label>${f.label}</label><textarea class="admin-input" data-field="${f.field}" rows="4">${Array.isArray(item[f.field]) ? item[f.field].join('\n') : ''}</textarea></div>`;
        if (f.type === 'select') return `<div class="input-group"><label>${f.label}</label><select class="admin-input" data-field="${f.field}">${f.options.map(opt => `<option value="${opt.v}" ${item[f.field] === opt.v ? 'selected' : ''}>${opt.l}</option>`).join('')}</select></div>`;
        return `<div class="input-group"><label>${f.label}</label><input type="${f.type}" class="admin-input" data-field="${f.field}" value="${item[f.field] || ''}"></div>`;
    }).join('')}
            </div>
            <div style="margin-top: 1rem; border-top: 1px solid #f5f5f5; padding-top: 1rem;">
                <button class="save-btn" onclick="saveItem(this)">Mettre à jour</button>
            </div>
        </div>
    `;
}

window.saveDirectContent = async function (btn) {
    const input = btn.previousElementSibling;
    const { error } = await supabaseClient.from('site_content').update({ content: input.value }).eq('id', input.dataset.id);
    if (error) alert(error.message);
    else { btn.textContent = 'Enregistré !'; setTimeout(() => btn.textContent = 'Enregistrer', 2000); }
};

window.saveItem = async function (btn) {
    const card = btn.closest('.item-editor');
    const id = card.dataset.id;
    const table = card.dataset.table;
    const inputs = card.querySelectorAll('[data-field]');
    const update = {};

    inputs.forEach(input => {
        let value = input.value;
        if (input.dataset.field === 'bullets') {
            value = value.split('\n').map(b => b.trim()).filter(b => b !== '');
        }
        update[input.dataset.field] = value;
    });

    const { error } = await supabaseClient.from(table).update(update).eq('id', id);
    if (error) alert('Erreur: ' + error.message);
    else { btn.textContent = 'Mis à jour !'; setTimeout(() => btn.textContent = 'Mettre à jour', 2000); }
};

window.addItem = async function (table) {
    let newItem = { sort_order: 99 };
    // Defaults
    if (table === 'statistics') newItem = { ...newItem, target: 0, label: 'Nouveau', icon: 'star' };
    if (table === 'expertise') newItem = { ...newItem, title: 'Nouvelle expertise', icon: 'star', description: '...' };
    if (table === 'experiences') newItem = { ...newItem, role: 'Nouveau Rôle', company: '...', period: '...', description: '...', bullets: [] };
    if (table === 'formations') newItem = { ...newItem, type: 'academic', title: 'Nouvelle formation', detail: '...', year: '-' };
    if (table === 'certifications') newItem = { ...newItem, year: '2024', title: 'Nouveau Certificat', description: '...' };
    if (table === 'skills') newItem = { ...newItem, category: 'software', name: 'Nouveau' };
    if (table === 'interests') newItem = { ...newItem, label: 'Nouvel intérêt', icon: 'heart' };
    if (table === 'social_links') newItem = { ...newItem, platform: 'Nouveau', url: '#', icon: 'link' };

    const { error } = await supabaseClient.from(table).insert([newItem]);
    if (error) alert(error.message);
    else loadSectionData(document.querySelector('.nav-item.active').dataset.tab);
};

window.deleteItem = async function (id, table) {
    if (!confirm('Voulez-vous vraiment supprimer cet élément ?')) return;
    const { error } = await supabaseClient.from(table).delete().eq('id', id);
    if (error) alert(error.message);
    else loadSectionData(document.querySelector('.nav-item.active').dataset.tab);
};

// --- Logout ---
document.getElementById('logout-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
});

checkAuth();
