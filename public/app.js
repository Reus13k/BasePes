const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return null;
    }
    return token;
}

// API calls
const api = {
    async get(endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    },
    
    async post(endpoint, data) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    },
    
    async delete(endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    }
};

// Initialize app
let allPlayers = [];
let filteredPlayers = [];
let squad = [];
let currentPlayer = null;

const state = {
    search: '',
    position: '',
    nation: '',
    club: '',
    rarity: ''
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const positionFilter = document.getElementById('positionFilter');
const nationFilter = document.getElementById('nationFilter');
const clubFilter = document.getElementById('clubFilter');
const rarityFilter = document.getElementById('rarityFilter');
const resetFilters = document.getElementById('resetFilters');
const playersGrid = document.getElementById('playersGrid');
const playerModal = document.getElementById('playerModal');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item[data-page]');

// Load initial data
async function init() {
    try {
        // Load user info
        const user = JSON.parse(localStorage.getItem('user'));
        document.getElementById('userDisplay').textContent = user.username;
        document.getElementById('userCoins').textContent = `💰 ${user.coins.toLocaleString()}`;
        
        // Load players
        allPlayers = await api.get('/players');
        
        // Load squad
        squad = await api.get('/squad');
        
        // Build filter options
        buildFilterOptions();
        
        // Render initial data
        filterPlayers();
        updateStats();
        
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Erro ao carregar dados');
    }
}

// Build filter options
function buildFilterOptions() {
    const nations = [...new Set(allPlayers.map(p => p.nation))].sort();
    const clubs = [...new Set(allPlayers.map(p => p.club))].sort();
    
    nationFilter.innerHTML = '<option value="">Todas</option>' + 
        nations.map(n => `<option value="${n}">${n}</option>`).join('');
    
    clubFilter.innerHTML = '<option value="">Todos</option>' + 
        clubs.map(c => `<option value="${c}">${c}</option>`).join('');
}

// Filter players
function filterPlayers() {
    filteredPlayers = allPlayers.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(state.search.toLowerCase());
        const matchesPosition = !state.position || player.position === state.position;
        const matchesNation = !state.nation || player.nation === state.nation;
        const matchesClub = !state.club || player.club === state.club;
        const matchesRarity = !state.rarity || player.rarity === state.rarity;
        
        return matchesSearch && matchesPosition && matchesNation && matchesClub && matchesRarity;
    });
    
    renderPlayers();
}

// Render players
function renderPlayers() {
    playersGrid.innerHTML = '';
    
    if (filteredPlayers.length === 0) {
        playersGrid.innerHTML = '<div class="empty-state"><h3>Nenhum jogador encontrado</h3></div>';
        return;
    }
    
    filteredPlayers.forEach(player => {
        const card = createPlayerCard(player);
        playersGrid.appendChild(card);
    });
    
    document.getElementById('resultCount').textContent = `${filteredPlayers.length} resultado${filteredPlayers.length === 1 ? '' : 's'}`;
}

// Create player card
function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
        <div class="card-top">
            <div class="badge rarity rarity-${player.rarity.toLowerCase()}">${player.rarity}</div>
            <div class="overall-pill">${player.overall}</div>
        </div>
        <div class="player-portrait">
            <div class="player-avatar"></div>
            <span class="player-role">${player.position}</span>
        </div>
        <div class="player-info">
            <h3 class="player-name">${player.name}</h3>
            <p class="player-meta">${player.club} • ${player.nation}</p>
        </div>
        <div class="stats-grid">
            <div><label>PAC</label><strong>${player.pace}</strong></div>
            <div><label>SHO</label><strong>${player.shooting}</strong></div>
            <div><label>PAS</label><strong>${player.passing}</strong></div>
            <div><label>DRI</label><strong>${player.dribbling}</strong></div>
            <div><label>DEF</label><strong>${player.defense}</strong></div>
            <div><label>PHY</label><strong>${player.physical}</strong></div>
        </div>
    `;
    
    card.addEventListener('click', () => showPlayerDetail(player));
    return card;
}

// Show player detail
function showPlayerDetail(player) {
    currentPlayer = player;
    document.getElementById('modalPlayerName').textContent = player.name;
    document.getElementById('modalPlayerMeta').textContent = `${player.club} • ${player.nation}`;
    
    document.getElementById('statPace').style.width = player.pace + '%';
    document.getElementById('statPaceValue').textContent = player.pace;
    document.getElementById('statShooting').style.width = player.shooting + '%';
    document.getElementById('statShootingValue').textContent = player.shooting;
    document.getElementById('statPassing').style.width = player.passing + '%';
    document.getElementById('statPassingValue').textContent = player.passing;
    document.getElementById('statDribbling').style.width = player.dribbling + '%';
    document.getElementById('statDribblingValue').textContent = player.dribbling;
    document.getElementById('statDefense').style.width = player.defense + '%';
    document.getElementById('statDefenseValue').textContent = player.defense;
    document.getElementById('statPhysical').style.width = player.physical + '%';
    document.getElementById('statPhysicalValue').textContent = player.physical;
    
    playerModal.style.display = 'flex';
}

// Update stats
function updateStats() {
    const avg = filteredPlayers.length > 0 ? 
        Math.round(filteredPlayers.reduce((sum, p) => sum + p.overall, 0) / filteredPlayers.length) : 0;
    
    const rarities = {};
    filteredPlayers.forEach(p => rarities[p.rarity] = (rarities[p.rarity] || 0) + 1);
    const topRarity = Object.entries(rarities).sort((a, b) => b[1] - a[1])[0];
    
    const clubs = {};
    filteredPlayers.forEach(p => clubs[p.club] = (clubs[p.club] || 0) + 1);
    const topClub = Object.entries(clubs).sort((a, b) => b[1] - a[1])[0];
    
    document.getElementById('totalPlayers').textContent = filteredPlayers.length;
    document.getElementById('avgOverall').textContent = avg;
    document.getElementById('topRarity').textContent = topRarity ? topRarity[0] : '-';
    document.getElementById('topClub').textContent = topClub ? topClub[0] : '-';
}

// Event listeners
searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    filterPlayers();
});

positionFilter.addEventListener('change', (e) => {
    state.position = e.target.value;
    filterPlayers();
});

nationFilter.addEventListener('change', (e) => {
    state.nation = e.target.value;
    filterPlayers();
});

clubFilter.addEventListener('change', (e) => {
    state.club = e.target.value;
    filterPlayers();
});

rarityFilter.addEventListener('change', (e) => {
    state.rarity = e.target.value;
    filterPlayers();
});

resetFilters.addEventListener('click', () => {
    state.search = '';
    state.position = '';
    state.nation = '';
    state.club = '';
    state.rarity = '';
    
    searchInput.value = '';
    positionFilter.value = '';
    nationFilter.value = '';
    clubFilter.value = '';
    rarityFilter.value = '';
    
    filterPlayers();
});

// Add to squad
document.getElementById('addToSquadBtn').addEventListener('click', async () => {
    try {
        await api.post(`/squad/${currentPlayer._id}`, {});
        alert('Jogador adicionado ao elenco!');
        squad = await api.get('/squad');
        playerModal.style.display = 'none';
    } catch (error) {
        alert('Erro ao adicionar ao elenco');
    }
});

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page + 'Page').classList.add('active');
        
        // Update header
        const titles = {
            players: 'Jogadores',
            squad: 'Meu Elenco',
            market: 'Mercado',
            admin: 'Painel Admin'
        };
        document.getElementById('pageTitle').textContent = titles[page];
    });
});

// Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
});

// Close modal
document.querySelector('.modal-close').addEventListener('click', () => {
    playerModal.style.display = 'none';
});

// Initialize
init();