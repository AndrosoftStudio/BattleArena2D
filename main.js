// Main game controller and initialization
import { auth, onAuthStateChanged } from './firebase-config.js';
import AuthManager from './auth.js';
import FriendsManager from './friends.js';
import UIManager from './ui-manager.js';
import MobileControls from './mobile-controls.js';
import NetworkManager from './network.js';
import GameEngine from './game-engine.js';
import CharacterManager, { CHARACTERS } from './characters.js';

class GameManager {
  constructor() {
    this.currentUser = null;
    this.gameState = 'loading';
    this.selectedCharacter = null;
    this.returnTo = 'menu';
    this.isHost = false;
    this.roomCode = '';
    this.gameSettings = {
      soundEffects: true,
      music: true,
      graphicsQuality: 'high',
      cameraShake: true
    };
    
    // Initialize managers
    this.authManager = new AuthManager();
    this.friendsManager = new FriendsManager();
    this.uiManager = new UIManager();
    this.mobileControls = new MobileControls();
    this.networkManager = new NetworkManager();
    this.gameEngine = new GameEngine();
    
    this.init();
  }
  
  async init() {
    try {
      console.log('Initializing Battle Arena 2D...');
      
      // Setup authentication listener
      onAuthStateChanged(auth, (user) => {
        this.handleAuthStateChange(user);
      });
      
      // Initialize mobile controls if needed
      if (this.isMobile()) {
        this.mobileControls.init();
      }
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Initialize UI
      this.uiManager.init();
      
      // Load settings from memory
      this.loadSettings();
      
      console.log('Game initialized successfully!');
      
    } catch (error) {
      console.error('Error initializing game:', error);
      this.showError('Erro ao inicializar o jogo');
    }
  }
  
  async handleAuthStateChange(user) {
    if (user) {
      console.log('User signed in:', user.displayName);
      this.currentUser = user;
      
      // Initialize user profile
      await this.authManager.initializeUser(user);
      
      // Initialize friends manager
      await this.friendsManager.init(user.uid);
      
      // Update UI with user data
      this.updateUserProfile(user);
      
      // Show main menu
      this.gameState = 'menu';
      this.showMainMenu();
      
    } else {
      console.log('User signed out');
      this.currentUser = null;
      this.gameState = 'login';
      this.showLogin();
    }
  }
  
  updateUserProfile(user) {
    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('userName');
    const email = document.getElementById('userEmail');
    
    if (avatar) avatar.src = user.photoURL || 'https://via.placeholder.com/48';
    if (name) name.textContent = user.displayName || 'Player';
    if (email) email.textContent = user.email || '';
  }
  
  setupGlobalEventListeners() {
    // Handle escape key for game menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.gameState === 'playing') {
          this.showGameMenu();
        } else if (this.gameState === 'gameMenu') {
          this.resumeGame();
        }
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.gameState === 'playing') {
        this.gameEngine.handleResize();
      }
    });
    
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.gameState === 'playing') {
        this.showGameMenu();
      }
    });
    
    // Handle beforeunload for cleanup
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
  
  // Navigation methods
  showLogin() {
    this.hideAllScreens();
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    
    // Setup Google login button
    document.getElementById('googleLoginBtn').onclick = () => {
      this.authManager.signInWithGoogle();
    };
  }
  
  showMainMenu() {
    this.gameState = 'menu';
    this.hideAllScreens();
    document.getElementById('mainMenu').classList.remove('hidden');
    
    // Setup logout button
    document.getElementById('logoutBtn').onclick = () => {
      this.authManager.signOut();
    };
  }
  
  showCharacterSelection(returnTo = 'menu') {
    this.hideAllScreens();
    document.getElementById('characterSelection').classList.remove('hidden');
    this.returnTo = returnTo;
    this.renderCharacterGrid();
  }
  
  renderCharacterGrid() {
    const grid = document.getElementById('characterGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.values(CHARACTERS).forEach(character => {
      const card = document.createElement('div');
      card.className = 'character-card';
      if (this.selectedCharacter && this.selectedCharacter.id === character.id) {
        card.classList.add('selected');
      }
      
      card.innerHTML = `
        <div class="character-avatar" style="background-color: ${character.color}">
          ${character.avatar}
        </div>
        <div class="character-name">${character.name}</div>
        <div class="character-type">${character.weapon.type}</div>
      `;
      
      card.addEventListener('click', () => {
        this.selectCharacter(character);
      });
      
      grid.appendChild(card);
    });
    
    this.updateCharacterInfo();
  }
  
  selectCharacter(character) {
    this.selectedCharacter = character;
    this.renderCharacterGrid();
    document.getElementById('confirmCharacterBtn').disabled = false;
  }
  
  updateCharacterInfo() {
    const infoDiv = document.getElementById('characterInfo');
    if (!infoDiv) return;
    
    if (!this.selectedCharacter) {
      infoDiv.innerHTML = '<p>Selecione um personagem para ver suas características</p>';
      return;
    }
    
    const char = this.selectedCharacter;
    infoDiv.innerHTML = `
      <div class="character-details">
        <h4>${char.name}</h4>
        <p class="character-description">${char.description}</p>
        
        <div class="character-weapon">
          <h5>Arma: ${char.weapon.name}</h5>
          <p>Dano: ${char.weapon.damage} | Alcance: ${char.weapon.range} | Cadência: ${char.weapon.fireRate}ms</p>
        </div>
        
        <div class="character-special">
          <h5>Especial: ${char.special.name}</h5>
          <p>${char.special.description}</p>
          <p>Cooldown: ${char.special.cooldown / 1000}s</p>
        </div>
        
        <div class="character-stats">
          <div class="stat-item">
            <span class="stat-label">Vida</span>
            <span class="stat-value">${char.health}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Velocidade</span>
            <span class="stat-value">${char.speed}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Mobilidade</span>
            <span class="stat-value">${char.stats.mobility}/10</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Dano</span>
            <span class="stat-value">${char.stats.damage}/10</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Alcance</span>
            <span class="stat-value">${char.stats.range}/10</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Defesa</span>
            <span class="stat-value">${char.stats.defense}/10</span>
          </div>
        </div>
      </div>
    `;
  }
  
  confirmCharacter() {
    if (!this.selectedCharacter) return;
    
    switch (this.returnTo) {
      case 'host':
        this.showHostMenu();
        break;
      case 'join':
        this.showJoinMenu();
        break;
      default:
        this.showMainMenu();
        break;
    }
  }
  
  showHostMenu() {
    if (!this.selectedCharacter) {
      this.showCharacterSelection('host');
      return;
    }
    
    this.hideAllScreens();
    document.getElementById('hostMenu').classList.remove('hidden');
    this.createHost();
  }
  
  showJoinMenu() {
    if (!this.selectedCharacter) {
      this.showCharacterSelection('join');
      return;
    }
    
    this.hideAllScreens();
    document.getElementById('joinMenu').classList.remove('hidden');
  }
  
  showFriends() {
    this.hideAllScreens();
    document.getElementById('friendsMenu').classList.remove('hidden');
    this.friendsManager.refreshFriends();
  }
  
  showSettings() {
    this.hideAllScreens();
    document.getElementById('settingsMenu').classList.remove('hidden');
    this.loadSettingsUI();
  }
  
  showInstructions() {
    this.hideAllScreens();
    document.getElementById('instructionsMenu').classList.remove('hidden');
  }
  
  showLobby() {
    this.gameState = 'lobby';
    this.hideAllScreens();
    document.getElementById('lobbyMenu').classList.remove('hidden');
    
    if (this.roomCode) {
      document.getElementById('lobbyRoomCode').textContent = this.roomCode;
    }
    
    if (this.isHost) {
      document.getElementById('hostControls').classList.remove('hidden');
    }
    
    this.updateLobbyUI();
  }
  
  showGameMenu() {
    if (this.gameState !== 'playing') return;
    
    this.gameState = 'gameMenu';
    document.getElementById('gameMenu').classList.remove('hidden');
    
    // Update game menu info
    document.getElementById('gameMenuScore').textContent = this.gameEngine.localPlayer.score || '0';
    document.getElementById('gameMenuCharacter').textContent = this.selectedCharacter ? this.selectedCharacter.name : '--';
    
    // Pause the game engine
    this.gameEngine.pause();
  }
  
  resumeGame() {
    if (this.gameState !== 'gameMenu') return;
    
    this.gameState = 'playing';
    document.getElementById('gameMenu').classList.add('hidden');
    
    // Resume the game engine
    this.gameEngine.resume();
  }
  
  // Network methods
  async createHost() {
    try {
      this.isHost = true;
      this.roomCode = this.generateRoomCode();
      
      document.getElementById('hostStatus').textContent = 'Criando sala...';
      document.getElementById('hostStatus').className = 'status status-info';
      
      const success = await this.networkManager.createHost(this.roomCode);
      
      if (success) {
        document.getElementById('hostStatus').textContent = 'Sala criada com sucesso!';
        document.getElementById('hostStatus').className = 'status status-success';
        document.getElementById('roomCodeDisplay').textContent = this.roomCode;
        document.getElementById('roomCodeContainer').classList.remove('hidden');
        document.getElementById('waitingMessage').classList.remove('hidden');
        
        // Setup connection handler
        this.networkManager.onPlayerJoin = (playerData) => {
          this.handlePlayerJoin(playerData);
        };
        
      } else {
        throw new Error('Falha ao criar sala');
      }
    } catch (error) {
      console.error('Error creating host:', error);
      document.getElementById('hostStatus').textContent = 'Erro: ' + error.message;
      document.getElementById('hostStatus').className = 'status status-error';
    }
  }
  
  async joinRoom() {
    try {
      const code = document.getElementById('roomCodeInput').value.trim().toUpperCase();
      if (!code) {
        this.showError('Digite o código da sala');
        return;
      }
      
      this.isHost = false;
      this.roomCode = code;
      
      document.getElementById('joinStatus').classList.remove('hidden');
      document.getElementById('joinStatus').textContent = 'Conectando...';
      document.getElementById('joinStatus').className = 'status status-info';
      
      const success = await this.networkManager.joinRoom(code, {
        name: this.currentUser.displayName,
        character: this.selectedCharacter,
        uid: this.currentUser.uid
      });
      
      if (success) {
        document.getElementById('joinStatus').textContent = 'Conectado! Entrando no lobby...';
        document.getElementById('joinStatus').className = 'status status-success';
        
        setTimeout(() => {
          this.showLobby();
        }, 1500);
        
      } else {
        throw new Error('Falha ao conectar na sala');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      document.getElementById('joinStatus').textContent = 'Erro: ' + error.message;
      document.getElementById('joinStatus').className = 'status status-error';
    }
  }
  
  handlePlayerJoin(playerData) {
    this.showNotification(`${playerData.name} entrou na sala!`, 'success');
    
    setTimeout(() => {
      this.showLobby();
    }, 2000);
  }
  
  // Utility methods
  generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  async copyRoomCode() {
    try {
      await navigator.clipboard.writeText(this.roomCode);
      this.showNotification('Código copiado para a área de transferência!', 'success');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.roomCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('Código copiado!', 'success');
    }
  }
  
  async pasteRoomCode() {
    try {
      const text = await navigator.clipboard.readText();
      document.getElementById('roomCodeInput').value = text.trim().toUpperCase();
    } catch (err) {
      this.showNotification('Por favor, cole o código manualmente.', 'warning');
    }
  }
  
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  showNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notifications.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
  
  showError(message) {
    this.showNotification(message, 'error');
  }
  
  hideAllScreens() {
    const screens = [
      'loadingScreen', 'loginScreen', 'mainMenu', 'characterSelection',
      'hostMenu', 'joinMenu', 'friendsMenu', 'settingsMenu', 'instructionsMenu',
      'lobbyMenu', 'gameContainer', 'gameMenu', 'gameOverMenu'
    ];
    
    screens.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.add('hidden');
      }
    });
  }
  
  loadSettings() {
    // Settings are stored in memory for the session
    const settingsElements = {
      soundEffectsToggle: this.gameSettings.soundEffects.toString(),
      musicToggle: this.gameSettings.music.toString(),
      graphicsQuality: this.gameSettings.graphicsQuality,
      cameraShake: this.gameSettings.cameraShake.toString()
    };
    
    Object.entries(settingsElements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.value = value;
      }
    });
  }
  
  loadSettingsUI() {
    this.loadSettings();
  }
  
  saveSettings() {
    const settings = {
      soundEffects: document.getElementById('soundEffectsToggle').value === 'true',
      music: document.getElementById('musicToggle').value === 'true',
      graphicsQuality: document.getElementById('graphicsQuality').value,
      cameraShake: document.getElementById('cameraShake').value === 'true'
    };
    
    this.gameSettings = { ...settings };
    
    // Apply settings to game engine
    if (this.gameEngine) {
      this.gameEngine.applySettings(settings);
    }
    
    this.showNotification('Configurações salvas!', 'success');
    this.showMainMenu();
  }
  
  updateLobbyUI() {
    // This will be implemented with the network manager
    const playerList = document.getElementById('playerList');
    if (playerList) {
      // Add local player
      playerList.innerHTML = `
        <div class="player-item">
          <div class="character-avatar" style="background-color: ${this.selectedCharacter ? this.selectedCharacter.color : '#666'}">
            ${this.selectedCharacter ? this.selectedCharacter.avatar : '?'}
          </div>
          <div class="player-info">
            <div class="player-name">${this.currentUser.displayName} ${this.isHost ? '(Host)' : ''}</div>
            <div class="player-character">${this.selectedCharacter ? this.selectedCharacter.name : 'Selecionando...'}</div>
          </div>
        </div>
      `;
    }
  }
  
  sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
      this.networkManager.sendChatMessage({
        sender: this.currentUser.displayName,
        message: message,
        timestamp: Date.now()
      });
      
      input.value = '';
    }
  }
  
  startMatchFromLobby() {
    if (!this.isHost) return;
    
    const gameMode = document.getElementById('gameModeSelect').value;
    const map = document.getElementById('mapSelect').value;
    const maxScore = parseInt(document.getElementById('maxScoreSelect').value);
    
    this.networkManager.startMatch({ gameMode, map, maxScore });
    this.startGame({ gameMode, map, maxScore });
  }
  
  startGame(settings = {}) {
    this.gameState = 'playing';
    this.hideAllScreens();
    document.getElementById('gameContainer').classList.remove('hidden');
    
    // Initialize game engine
    this.gameEngine.init({
      canvas: document.getElementById('gameCanvas'),
      character: this.selectedCharacter,
      player: {
        name: this.currentUser.displayName,
        uid: this.currentUser.uid
      },
      settings: this.gameSettings,
      gameSettings: settings
    });
    
    // Enable mobile controls if needed
    if (this.isMobile()) {
      this.mobileControls.show();
    }
    
    this.gameEngine.start();
  }
  
  leaveGame() {
    this.gameEngine.stop();
    this.networkManager.leaveRoom();
    this.showMainMenu();
  }
  
  leaveLobby() {
    this.networkManager.leaveRoom();
    this.showMainMenu();
  }
  
  endMatch() {
    if (!this.isHost) return;
    
    this.networkManager.endMatch();
    this.returnToLobby();
  }
  
  returnToLobby() {
    this.gameEngine.stop();
    this.showLobby();
  }
  
  requestFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    document.getElementById('fullscreenPrompt').classList.add('hidden');
  }
  
  showAddFriendDialog() {
    // This would show a dialog to add the opponent as friend
    // Implementation depends on game over context
  }
  
  cleanup() {
    if (this.networkManager) {
      this.networkManager.cleanup();
    }
    if (this.gameEngine) {
      this.gameEngine.cleanup();
    }
    if (this.currentUser && this.authManager) {
      this.authManager.updateUserStatus('offline');
    }
  }
}

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
  });
} else {
  window.gameManager = new GameManager();
}

// Export for global access
export default GameManager;