// Generated from data/active-hero-loadouts.txt and data/melee_damage_stats.txt.
window.RANGER_GUIDE = {
  heroOrder: ['Widget', 'Sprocket', 'Chip', 'Mopz', "Lil'Ann", 'Tempest', 'Sparky', 'Celeste', 'Zed', 'Lump', 'Grimshot', 'Ratchet'],
  heroes: {
    Widget: {className: 'Allrounder', speed: 'Medium', rarity: 'Common', color: '#3C6FFA', loadout: ['Burst Pistol', 'Blaster', 'Drill Thruster', 'DrillDash', 'DrillDash', 'Turbo Drill', 'WidgetMelee', 'RYNO', 'Ryno']},
    Sprocket: {className: 'Allrounder', speed: 'Medium', rarity: 'Common', color: '#3C6FFA', loadout: ['Shatterbomb', 'Shatterbomb', 'Hoverboots', 'HoverBoots', 'Hoverboots', 'Omnimagnet', 'SprocketMelee', 'Mega Strike', 'MegaStrike']},
    Chip: {className: 'Disruptor', speed: 'Medium', rarity: 'Common', color: '#3C6FFA', loadout: ['Tesla Claw', 'TeslaClaw', 'Glove of Doom', 'GloveOfDoom', 'Glove of Doom', 'Brainstorm', 'ChipMelee', 'Sheep-o-Bomb', 'Sheepinator']},
    Mopz: {className: 'Allrounder', speed: 'Medium', rarity: 'Rare', color: '#ED00EE', loadout: ['Blackhole Storm', 'BlackholeStorm', 'Voltage Drop', 'VoltageDrop', 'ElectricGrenade', 'SEV3R', 'MopzMelee', 'Negatron Collider', 'Negatron']},
    "Lil'Ann": {className: 'Stalker', speed: 'Fast', rarity: 'Rare', color: '#ED00EE', loadout: ['Blitz Gun', 'Blitzgun', 'Whirling Blades', 'WhirlingBlades', 'LittleSpin', 'Storm Cutlass', 'AnnMelee', 'Vortex Wallop', 'VortexWallop']},
    Tempest: {className: 'Juggernaut', speed: 'Medium', rarity: 'Rare', color: '#ED00EE', loadout: ['Cold Snap', 'ColdSnap', 'Void Repulser', 'VoidRepulser', 'Void Repulser', 'Typhoon', 'MarkusMelee', "Good Ol' Shot", 'Cannonball']},
    Sparky: {className: 'Cannoneer', speed: 'Medium', rarity: 'Rare', color: '#ED00EE', loadout: ['Pyrocitor', 'Pyrocitor', 'Hunter Mine Launcher', 'MineLauncher', 'MineLauncher', 'Crackaxe', 'FuseMelee', 'Big Boom', 'BigBoom']},
    Celeste: {className: 'Runner', speed: 'Fast', rarity: 'Epic', color: '#F38A0E', loadout: ['Buzz Blades', 'Buzzblades', 'Cryo Slider', 'Cryoslider', 'Cryo Slider', 'Slapshot', 'CelesteMelee', 'Hoverboard', 'Hoverboard']},
    Zed: {className: 'Cannoneer', speed: 'Medium', rarity: 'Epic', color: '#F38A0E', loadout: ['Warmonger', 'Warmonger', 'Bombardier', 'Bombardier', 'Bombardier', 'Stick of Order', 'ZedMelee', 'Tank Formation', 'TankFormation']},
    Lump: {className: 'Juggernaut', speed: 'Medium', rarity: 'Rare', color: '#ED00EE', loadout: ['Lava Gun', 'LavaGun', 'Amoeboid Launcher', 'AmoeboidLauncher', 'Amoeboid Launcher', 'Glo-Bash', 'LumpMelee', 'Mutagenic Burst', 'Evolution']},
    Grimshot: {className: 'Deadeye', speed: 'Medium', rarity: 'Epic', color: '#F38A0E', loadout: ['Headhunter', 'Headhunter', 'Holoshield Glove', 'HoloshieldGlove', 'Holoshield Glove', 'X60 Cleaver', 'GrimshotMelee', 'Smoke Leap', 'SmokeScreen']},
    Ratchet: {className: 'Allrounder', speed: 'Medium', rarity: 'Legendary', color: '#BF0303', eventOnly: true, descriptionHeightHero: 'Widget', weaponStats: 'Ratchet Burst Pistol', loadout: ['Burst Pistol', 'Blaster', 'Throwable Wrench', 'WrenchThrow', 'WrenchThrow', 'Omniwrench', 'RatchetMelee', 'RYNO', 'Ryno']},
  },
  meleeDamage: {
    Small: {
      Common: [30, 39, 48, 57, 66, 75, 84, 93, 102, 111],
      Rare: [39, 48, 56, 65, 73, 82, 90, 99, 107, 116],
      Epic: [48, 56, 64, 72, 80, 88, 96, 104, 112, 120],
    },
    Medium: {
      Common: [30, 39, 48, 57, 66, 75, 84, 93, 102, 111],
      Rare: [39, 48, 56, 65, 73, 82, 90, 99, 107, 116],
      Epic: [48, 56, 64, 72, 80, 88, 96, 104, 112, 120],
      Legendary: [48, 56, 64, 72, 80, 88, 96, 104, 112, 120],
    },
    Large: {
      Common: [40, 52, 64, 76, 88, 100, 112, 124, 136, 148],
      Rare: [52, 63, 75, 86, 97, 109, 120, 131, 143, 154],
      Epic: [64, 75, 85, 96, 107, 117, 128, 139, 149, 160],
    },
  },
  descriptionAliases: {
    heroes: {Tempest: 'Markus'},
    weapons: {'Burst Pistol': 'Blaster', 'Blackhole Storm': 'Blackhole', Pyrocitor: 'Pyro'},
    gadgets: {'Cryo Slider': 'Cryoslider'},
    ultimates: {},
    melee: {}
  }
};
