window.RANGER_GUIDE = {
  heroOrder: ['Widget', 'Sprocket', 'Chip', 'Mopz', "Lil'Ann", 'Tempest', 'Sparky', 'Celeste', 'Zed', 'Lump', 'Grimshot', 'Ratchet'],
  heroes: {
    Ratchet: {className: 'Allrounder', speed: 'Medium', rarity: 'Epic', color: '#F38A0E', eventOnly: true, render: false, descriptionHeightHero: 'Widget', weaponStats: 'Ratchet Burst Pistol', loadout: ['Burst Pistol', 'Blaster', 'Throwable Wrench', 'WrenchThrow', 'WrenchThrow', 'Omniwrench', 'RatchetMelee', 'RYNO', 'Ryno']},
    Widget: {className: 'Allrounder', speed: 'Medium', rarity: 'Common', color: '#3C6FFA', loadout: ['Burst Pistol', 'Blaster', 'Drill Thruster', 'DrillDash', 'DrillDash', 'Turbo Drill', 'WidgetMelee', 'RYNO', 'Ryno']},
    Sprocket: {className: 'Allrounder', speed: 'Medium', rarity: 'Common', color: '#3C6FFA', loadout: ['Shatterbomb', 'Shatterbomb', 'Hoverboots', 'HoverBoots', 'Hoverboots', 'Omnimagnet', 'SprocketMelee', 'Mega Strike', 'MegaStrike']},
    Chip: {className: 'Disruptor', speed: 'Medium', rarity: 'Common', color: '#3C6FFA', loadout: ['Tesla Claw', 'TeslaClaw', 'Glove of Doom', 'GloveOfDoom', 'Glove of Doom', 'Brainstorm', 'ChipMelee', 'Sheep-o-Bomb', 'Sheepinator']},
    Mopz: {className: 'Allrounder', speed: 'Medium', rarity: 'Rare', color: '#ED00EE', loadout: ['Blackhole Storm', 'BlackholeStorm', 'Voltage Drop', 'VoltageDrop', 'ElectricGrenade', 'SEV3R', 'MopzMelee', 'Negatron Collider', 'Negatron']},
    "Lil'Ann": {className: 'Stalker', speed: 'Medium', rarity: 'Rare', color: '#ED00EE', loadout: ['Blitz Gun', 'Blitzgun', 'Whirling Blades', 'WhirlingBlades', 'LittleSpin', 'Storm Cutlass', 'AnnMelee', 'Vortex Wallop', 'VortexWallop']},
    Tempest: {className: 'Juggernaut', speed: 'Slow', rarity: 'Rare', color: '#ED00EE', loadout: ['Cold Snap', 'ColdSnap', 'Void Repulser', 'VoidRepulser', 'Void Repulser', 'Typhoon', 'MarkusMelee', "Good Ol' Shot", 'Cannonball']},
    Sparky: {className: 'Cannoneer', speed: 'Fast', rarity: 'Rare', color: '#ED00EE', loadout: ['Pyrocitor', 'Pyrocitor', 'Hunter Mine Launcher', 'MineLauncher', 'MineLauncher', 'Crackaxe', 'FuseMelee', 'Big Boom', 'BigBoom']},
    Celeste: {className: 'Runner', speed: 'Medium', rarity: 'Epic', color: '#F38A0E', loadout: ['Buzz Blades', 'Buzzblades', 'Cryo Slider', 'Cryoslider', 'Cryo Slider', 'Slapshot', 'CelesteMelee', 'Hoverboard', 'Hoverboard']},
    Zed: {className: 'Cannoneer', speed: 'Fast', rarity: 'Epic', color: '#F38A0E', loadout: ['Warmonger', 'Warmonger', 'Bombardier', 'Bombardier', 'Bombardier', 'Stick of Order', 'ZedMelee', 'Tank Formation', 'TankFormation']},
    Lump: {className: 'Juggernaut', speed: 'Slow', rarity: 'Rare', color: '#ED00EE', loadout: ['Lava Gun', 'LavaGun', 'Amoeboid Launcher', 'AmoeboidLauncher', 'Amoeboid Launcher', 'Glo-Bash', 'LumpMelee', 'Mutagenic Burst', 'Evolution']},
    Grimshot: {className: 'Deadeye', speed: 'Medium', rarity: 'Epic', color: '#F38A0E', loadout: ['Headhunter', 'Headhunter', 'Holoshield Glove', 'HoloshieldGlove', 'Holoshield Glove', 'X60 Cleaver', 'GrimshotMelee', 'Smoke Leap', 'SmokeScreen']}
  },
  meleeDamage: {
    Small: {
      Common: [20, 26, 32, 38, 44, 50, 56, 62, 68, 74],
      Rare: [26, 32, 37, 43, 49, 54, 60, 66, 71, 77],
      Epic: [32, 37, 43, 48, 53, 59, 64, 69, 75, 80]
    },
    Medium: {
      Common: [25, 33, 40, 48, 55, 63, 70, 78, 85, 93],
      Rare: [33, 40, 47, 54, 61, 68, 75, 82, 89, 96],
      Epic: [40, 47, 53, 60, 67, 73, 80, 87, 93, 100]
    },
    Large: {
      Common: [30, 39, 48, 57, 66, 75, 84, 93, 102, 111],
      Rare: [39, 48, 56, 65, 73, 82, 90, 99, 107, 116],
      Epic: [48, 56, 64, 72, 80, 88, 96, 104, 112, 120]
    }
  },
  descriptionAliases: {
    heroes: {Tempest: 'Markus'},
    weapons: {'Burst Pistol': 'Blaster', 'Blackhole Storm': 'Blackhole', Pyrocitor: 'Pyro'},
    gadgets: {'Cryo Slider': 'Cryoslider'},
    ultimates: {},
    melee: {}
  }
};
