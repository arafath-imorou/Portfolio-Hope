const supabaseUrl = 'https://vrpgdacebchpxfjeowzm.supabase.co';
const supabaseKey = 'sb_publishable_IHm_8q7bkmUV23QHSA4ztw_Zel0K6wS';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const messagesContainer = document.getElementById('messages-container');
const logoutBtn = document.getElementById('logout-btn');

// --- Auth Check ---
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    fetchMessages();
}

// --- Fetch Messages ---
async function fetchMessages() {
    const { data, error } = await supabase
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

    renderMessages(data);
}

// --- Render Messages ---
function renderMessages(messages) {
    messagesContainer.innerHTML = messages.map(msg => {
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

// --- Logout ---
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

// Run
checkAuth();
