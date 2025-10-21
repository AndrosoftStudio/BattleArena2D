// Character definitions and management

export const CHARACTERS = {
  archer: {
    id: 'archer',
    name: 'Arqueiro',
    avatar: '🏹',
    description: 'Mestre do combate à distância com arco e flecha.',
    health: 80,
    speed: 160,
    weapon: {
      type: 'bow',
      name: 'Arco Élfico',
      damage: 35,
      range: 400,
      fireRate: 600, // ms between shots
      projectileSpeed: 500,
      projectileSize: 3,
      bulletCount: 1,
      spread: 0,
      piercing: false
    },
    special: {
      name: 'Chuva de Flechas',
      description: 'Dispara 10 flechas em área causando dano massivo',
      cooldown: 8000,
      damage: 25,
      range: 350,
      effect: 'rain_of_arrows',
      duration: 2000
    },
    stats: {
      mobility: 8,
      damage: 7,
      range: 10,
      defense: 4,
      special: 9
    },
    color: '#22c55e'
  },
  
  warrior: {
    id: 'warrior',
    name: 'Guerreiro',
    avatar: '⚔️',
    description: 'Combatente corpo a corpo com alta resistência.',
    health: 150,
    speed: 120,
    weapon: {
      type: 'sword',
      name: 'Espada de Aço',
      damage: 50,
      range: 80,
      fireRate: 400,
      projectileSpeed: 300,
      projectileSize: 4,
      bulletCount: 1,
      spread: 0,
      piercing: true
    },
    special: {
      name: 'Investida Brutal',
      description: 'Dash poderoso que atravessa inimigos',
      cooldown: 6000,
      damage: 60,
      range: 150,
      effect: 'dash_attack',
      duration: 500
    },
    stats: {
      mobility: 5,
      damage: 9,
      range: 3,
      defense: 9,
      special: 7
    },
    color: '#dc2626'
  },
  
  mage: {
    id: 'mage',
    name: 'Mago',
    avatar: '🔮',
    description: 'Manipulador de energia mágica com ataques explosivos.',
    health: 70,
    speed: 140,
    weapon: {
      type: 'staff',
      name: 'Cajado Arcano',
      damage: 40,
      range: 300,
      fireRate: 500,
      projectileSpeed: 400,
      projectileSize: 5,
      bulletCount: 1,
      spread: 0,
      piercing: false,
      explosive: true,
      explosionRadius: 50
    },
    special: {
      name: 'Bola de Fogo Explosiva',
      description: 'Grande explosão que causa dano em área',
      cooldown: 10000,
      damage: 80,
      range: 400,
      effect: 'fireball_explosion',
      duration: 1000,
      explosionRadius: 120
    },
    stats: {
      mobility: 6,
      damage: 10,
      range: 8,
      defense: 3,
      special: 10
    },
    color: '#7c3aed'
  },
  
  assassin: {
    id: 'assassin',
    name: 'Assassino',
    avatar: '🗡️',
    description: 'Rápido e letal, especialista em ataques furtivos.',
    health: 90,
    speed: 180,
    weapon: {
      type: 'daggers',
      name: 'Adagas Venenosas',
      damage: 30,
      range: 120,
      fireRate: 200,
      projectileSpeed: 600,
      projectileSize: 2,
      bulletCount: 2,
      spread: 0.2,
      piercing: false
    },
    special: {
      name: 'Invisibilidade',
      description: 'Fica invisível e ganha velocidade extra',
      cooldown: 12000,
      damage: 0,
      range: 0,
      effect: 'stealth',
      duration: 3000,
      speedBonus: 1.5
    },
    stats: {
      mobility: 10,
      damage: 6,
      range: 4,
      defense: 4,
      special: 8
    },
    color: '#374151'
  },
  
  tank: {
    id: 'tank',
    name: 'Tanque',
    avatar: '🛡️',
    description: 'Defensor pesado com armadura impenetrável.',
    health: 200,
    speed: 100,
    weapon: {
      type: 'cannon',
      name: 'Canhão Pesado',
      damage: 60,
      range: 250,
      fireRate: 800,
      projectileSpeed: 300,
      projectileSize: 6,
      bulletCount: 1,
      spread: 0,
      piercing: true,
      explosive: true,
      explosionRadius: 30
    },
    special: {
      name: 'Escudo de Energia',
      description: 'Fica imune a dano por alguns segundos',
      cooldown: 15000,
      damage: 0,
      range: 0,
      effect: 'shield',
      duration: 5000
    },
    stats: {
      mobility: 3,
      damage: 8,
      range: 6,
      defense: 10,
      special: 6
    },
    color: '#0891b2'
  },
  
  sniper: {
    id: 'sniper',
    name: 'Atirador',
    avatar: '🎯',
    description: 'Especialista em tiros de longa distância.',
    health: 85,
    speed: 130,
    weapon: {
      type: 'rifle',
      name: 'Rifle de Precisão',
      damage: 80,
      range: 500,
      fireRate: 1200,
      projectileSpeed: 800,
      projectileSize: 2,
      bulletCount: 1,
      spread: 0,
      piercing: true
    },
    special: {
      name: 'Tiro Perfurante',
      description: 'Tiro que atravessa todos os inimigos',
      cooldown: 8000,
      damage: 100,
      range: 600,
      effect: 'piercing_shot',
      duration: 100,
      pierceCount: 99
    },
    stats: {
      mobility: 6,
      damage: 10,
      range: 10,
      defense: 4,
      special: 8
    },
    color: '#ea580c'
  },
  
  pyromancer: {
    id: 'pyromancer',
    name: 'Piromaníaco',
    avatar: '🔥',
    description: 'Manipulador do fogo com ataques contínuos.',
    health: 110,
    speed: 140,
    weapon: {
      type: 'flamethrower',
      name: 'Lança-chamas',
      damage: 25,
      range: 150,
      fireRate: 100,
      projectileSpeed: 200,
      projectileSize: 4,
      bulletCount: 3,
      spread: 0.3,
      piercing: false,
      burnDamage: 5,
      burnDuration: 2000
    },
    special: {
      name: 'Explosão de Fogo',
      description: 'Círculo de fogo ao redor do jogador',
      cooldown: 7000,
      damage: 50,
      range: 180,
      effect: 'fire_explosion',
      duration: 1500,
      burnDamage: 10,
      burnDuration: 3000
    },
    stats: {
      mobility: 7,
      damage: 8,
      range: 5,
      defense: 5,
      special: 9
    },
    color: '#dc2626'
  },
  
  engineer: {
    id: 'engineer',
    name: 'Engenheiro',
    avatar: '🔧',
    description: 'Especialista em dispositivos e torretas.',
    health: 100,
    speed: 120,
    weapon: {
      type: 'launcher',
      name: 'Lançador de Granadas',
      damage: 45,
      range: 300,
      fireRate: 700,
      projectileSpeed: 250,
      projectileSize: 4,
      bulletCount: 1,
      spread: 0,
      piercing: false,
      explosive: true,
      explosionRadius: 60,
      bouncing: true,
      maxBounces: 2
    },
    special: {
      name: 'Torreta Automática',
      description: 'Coloca uma torreta que atira automaticamente',
      cooldown: 20000,
      damage: 20,
      range: 250,
      effect: 'turret',
      duration: 15000,
      turretHealth: 80,
      turretFireRate: 300
    },
    stats: {
      mobility: 5,
      damage: 7,
      range: 8,
      defense: 6,
      special: 10
    },
    color: '#f59e0b'
  },
  
  healer: {
    id: 'healer',
    name: 'Curandeiro',
    avatar: '💚',
    description: 'Suporte que cura aliados e enfraquece inimigos.',
    health: 95,
    speed: 150,
    weapon: {
      type: 'wand',
      name: 'Varinha de Luz',
      damage: 20,
      range: 200,
      fireRate: 300,
      projectileSpeed: 400,
      projectileSize: 3,
      bulletCount: 1,
      spread: 0,
      piercing: false,
      healing: true,
      healAmount: 15
    },
    special: {
      name: 'Cura em Área',
      description: 'Cura todos os aliados próximos',
      cooldown: 10000,
      damage: 0,
      range: 200,
      effect: 'area_heal',
      duration: 2000,
      healAmount: 50,
      healOverTime: 20
    },
    stats: {
      mobility: 7,
      damage: 4,
      range: 6,
      defense: 5,
      special: 10
    },
    color: '#10b981'
  },
  
  berserker: {
    id: 'berserker',
    name: 'Berserker',
    avatar: '🪓',
    description: 'Lutador selvagem que fica mais forte quando ferido.',
    health: 130,
    speed: 170,
    weapon: {
      type: 'axe',
      name: 'Machado Duplo',
      damage: 55,
      range: 100,
      fireRate: 350,
      projectileSpeed: 400,
      projectileSize: 5,
      bulletCount: 1,
      spread: 0,
      piercing: false,
      cleave: true,
      cleaveAngle: 0.5
    },
    special: {
      name: 'Fúria Berserker',
      description: 'Dobra velocidade e dano, mas perde vida',
      cooldown: 12000,
      damage: 0,
      range: 0,
      effect: 'berserker_rage',
      duration: 5000,
      damageMultiplier: 2,
      speedMultiplier: 1.8,
      healthDrain: 2 // HP per second
    },
    stats: {
      mobility: 8,
      damage: 9,
      range: 3,
      defense: 6,
      special: 8
    },
    color: '#991b1b'
  }
};

// Character utility functions
export class CharacterManager {
  static getCharacter(id) {
    return CHARACTERS[id] || null;
  }
  
  static getAllCharacters() {
    return Object.values(CHARACTERS);
  }
  
  static getCharactersByType(type) {
    return Object.values(CHARACTERS).filter(char => char.weapon.type === type);
  }
  
  static getBalancedCharacters() {
    // Return characters sorted by overall balance
    return Object.values(CHARACTERS).sort((a, b) => {
      const aTotal = Object.values(a.stats).reduce((sum, val) => sum + val, 0);
      const bTotal = Object.values(b.stats).reduce((sum, val) => sum + val, 0);
      return Math.abs(aTotal - 30) - Math.abs(bTotal - 30); // Target total of 30 for balance
    });
  }
  
  static getCharacterEffectiveness(characterId, enemyCharacterId) {
    const character = CHARACTERS[characterId];
    const enemy = CHARACTERS[enemyCharacterId];
    
    if (!character || !enemy) return 0.5;
    
    // Calculate effectiveness based on stats
    let effectiveness = 0.5;
    
    // Range advantage
    if (character.weapon.range > enemy.weapon.range) {
      effectiveness += 0.2;
    } else if (character.weapon.range < enemy.weapon.range) {
      effectiveness -= 0.2;
    }
    
    // Speed advantage
    if (character.speed > enemy.speed) {
      effectiveness += 0.1;
    } else if (character.speed < enemy.speed) {
      effectiveness -= 0.1;
    }
    
    // Damage vs Health ratio
    const damageRatio = character.weapon.damage / enemy.health;
    const enemyDamageRatio = enemy.weapon.damage / character.health;
    
    if (damageRatio > enemyDamageRatio) {
      effectiveness += 0.2;
    } else if (damageRatio < enemyDamageRatio) {
      effectiveness -= 0.2;
    }
    
    return Math.max(0, Math.min(1, effectiveness));
  }
  
  static getRecommendedCharacters(enemyCharacters = []) {
    if (enemyCharacters.length === 0) {
      return this.getBalancedCharacters().slice(0, 3);
    }
    
    // Calculate effectiveness against enemy team
    const characterScores = Object.values(CHARACTERS).map(character => {
      const avgEffectiveness = enemyCharacters.reduce((sum, enemy) => {
        return sum + this.getCharacterEffectiveness(character.id, enemy.id);
      }, 0) / enemyCharacters.length;
      
      return {
        character,
        effectiveness: avgEffectiveness
      };
    });
    
    return characterScores
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 3)
      .map(item => item.character);
  }
  
  static createCharacterInstance(characterId, playerId, x = 0, y = 0) {
    const baseCharacter = CHARACTERS[characterId];
    if (!baseCharacter) return null;
    
    return {
      id: playerId,
      characterId: characterId,
      ...baseCharacter,
      x,
      y,
      angle: 0,
      currentHealth: baseCharacter.health,
      maxHealth: baseCharacter.health,
      isAlive: true,
      lastShot: 0,
      lastSpecial: 0,
      specialActive: false,
      specialEndTime: 0,
      effects: [], // Status effects like burn, invisibility, etc.
      score: 0,
      kills: 0,
      deaths: 0
    };
  }
  
  static applyCharacterEffects(character, deltaTime) {
    if (!character || !character.effects) return;
    
    // Process status effects
    for (let i = character.effects.length - 1; i >= 0; i--) {
      const effect = character.effects[i];
      
      effect.duration -= deltaTime * 1000; // Convert to ms
      
      switch (effect.type) {
        case 'burn':
          if (effect.lastTick + effect.tickRate < Date.now()) {
            character.currentHealth -= effect.damage;
            effect.lastTick = Date.now();
            
            if (character.currentHealth <= 0) {
              character.isAlive = false;
            }
          }
          break;
          
        case 'heal_over_time':
          if (effect.lastTick + effect.tickRate < Date.now()) {
            character.currentHealth = Math.min(
              character.maxHealth,
              character.currentHealth + effect.healAmount
            );
            effect.lastTick = Date.now();
          }
          break;
          
        case 'speed_boost':
          // Speed boost is applied in movement calculations
          break;
          
        case 'damage_boost':
          // Damage boost is applied in weapon calculations
          break;
          
        case 'invisibility':
          // Invisibility is handled in rendering
          break;
          
        case 'shield':
          // Shield blocks all damage
          break;
      }
      
      // Remove expired effects
      if (effect.duration <= 0) {
        character.effects.splice(i, 1);
      }
    }
  }
  
  static hasEffect(character, effectType) {
    return character.effects && character.effects.some(effect => effect.type === effectType);
  }
  
  static addEffect(character, effectData) {
    if (!character.effects) character.effects = [];
    
    // Remove existing effect of same type if needed
    if (effectData.replace) {
      character.effects = character.effects.filter(e => e.type !== effectData.type);
    }
    
    character.effects.push({
      type: effectData.type,
      duration: effectData.duration,
      damage: effectData.damage || 0,
      healAmount: effectData.healAmount || 0,
      tickRate: effectData.tickRate || 1000,
      lastTick: Date.now(),
      ...effectData
    });
  }
  
  static getEffectiveSpeed(character) {
    let speed = character.speed;
    
    if (character.effects) {
      character.effects.forEach(effect => {
        if (effect.type === 'speed_boost') {
          speed *= effect.multiplier;
        } else if (effect.type === 'slow') {
          speed *= effect.multiplier;
        }
      });
    }
    
    return speed;
  }
  
  static getEffectiveDamage(character, baseDamage) {
    let damage = baseDamage;
    
    if (character.effects) {
      character.effects.forEach(effect => {
        if (effect.type === 'damage_boost') {
          damage *= effect.multiplier;
        }
      });
    }
    
    return Math.round(damage);
  }
  
  static canTakeDamage(character) {
    return !this.hasEffect(character, 'shield') && !this.hasEffect(character, 'invisibility');
  }
}

export default CharacterManager;