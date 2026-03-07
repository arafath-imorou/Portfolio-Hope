const supabaseUrl = 'https://vrpgdacebchpxfjeowzm.supabase.co';
const supabaseKey = 'sb_publishable_IHm_8q7bkmUV23QHSA4ztw_Zel0K6wS';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const messagesContainer = document.getElementById('messages-container');
const logoutBtn = document.getElementById('logout-btn');

// --- Tab Switching ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(content => {
            content.style.display = content.id === `${target}-section` ? 'block' : 'none';
        });

        if (target === 'editor') loadEditorData();
        if (target === 'messages') fetchMessages();
    });
});

// --- Auth Check ---
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    // Default load messages
    fetchMessages();
}

// --- Fetch Messages (Same as before) ---
async function fetchMessages() {
    const messagesContainer = document.getElementById('messages-container');
    const { data, error } = await supabaseClient
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        messagesContainer.innerHTML = `<div class="loading-state">Erreur: ${error.message}</div>`;
        return;
    }

    if (data.length === 0) {
        messagesContainer.innerHTML = `<div class="loading-state">Aucun message pour le moment.</div>`;
        return;
    }

    renderMessages(data, messagesContainer);
}

function renderMessages(messages, container) {
    container.innerHTML = messages.map(msg => {
        const date = new Date(msg.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        return `
            <div class="message-card">
                <div class="msg-meta">
                    <span>${date}</span>
                    <i class="ph ph-envelope"></i>
                </div>
                <div class="msg-name">${msg.name}</div>
                <div class="msg-email">${msg.email}</div>
                <hr style="margin: 1rem 0; border: 0; border-top: 1px solid #eee;">
                <div class="msg-subject">${msg.subject || 'Sans objet'}</div>
                <div class="msg-body">${msg.message}</div>
            </div>
        `;
    }).join('');
}

// --- EDITOR LOGIC ---

async function loadEditorData() {
    // 1. General Content
    const { data: generalData } = await supabaseClient.from('site_content').select('*');
    const generalInputs = document.getElementById('general-inputs');
    if (generalData) {
        generalInputs.innerHTML = generalData.map(item => `
            <div class="input-group">
                <label>${item.id}</label>
                <textarea class="admin-input" data-id="${item.id}" rows="3">${item.content}</textarea>
            </div>
        `).join('');
    }

    // 2. Experiences
    const { data: expData } = await supabaseClient.from('experiences').select('*').order('sort_order');
    const expList = document.getElementById('experiences-list');
    if (expData) {
        expList.innerHTML = expData.map(exp => `
            <div class="item-editor" data-id="${exp.id}" data-table="experiences">
                <span class="delete-btn" onclick="deleteItem('${exp.id}', 'experiences')"><i class="ph ph-trash"></i></span>
                <input type="text" class="admin-input" placeholder="Rôle" value="${exp.role}" data-field="role">
                <input type="text" class="admin-input" placeholder="Entreprise" value="${exp.company}" data-field="company">
                <input type="text" class="admin-input" placeholder="Période" value="${exp.period}" data-field="period">
                <button class="save-btn" style="margin-top: 0.5rem;" onclick="saveItem(this)">Enregistrer</button>
            </div>
        `).join('');
    }
}

// --- Basic CRUD Helpers ---

async function saveGeneralContent(e) {
    e.preventDefault();
    const textareas = document.querySelectorAll('#general-inputs textarea');
    const updates = Array.from(textareas).map(ta => ({
        id: ta.dataset.id,
        content: ta.value
    }));

    const { error } = await supabaseClient.from('site_content').upsert(updates);
    if (error) alert('Erreur: ' + error.message);
    else alert('Contenu général mis à jour !');
}

window.saveItem = async function (btn) {
    const card = btn.closest('.item-editor');
    const id = card.dataset.id;
    const table = card.dataset.table;
    const inputs = card.querySelectorAll('input[data-field]');
    const update = {};
    inputs.forEach(input => update[input.dataset.field] = input.value);

    const { error } = await supabaseClient.from(table).update(update).eq('id', id);
    if (error) alert('Erreur: ' + error.message);
    else alert('Mis à jour !');
};

window.deleteItem = async function (id, table) {
    if (!confirm('Supprimer cet élément ?')) return;
    const { error } = await supabaseClient.from(table).delete().eq('id', id);
    if (error) alert(error.message);
    else loadEditorData();
};

// Event Listeners
document.getElementById('general-editor').addEventListener('submit', saveGeneralContent);

// --- Logout ---
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
});

// Run
checkAuth();
