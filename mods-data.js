// Generated from data/hero_talent_stats_export.txt.
window.RANGER_MODS = {
  "Ratchet": [
    {
      "name": "Express Recovery",
      "icon": "Express Recovery.png",
      "menu": "Ratchet regenerates faster than other heroes.",
      "effect": "Regeneration delay reduced to 4s; full-regeneration time remains 3s."
    },
    {
      "name": "Triple Barrel",
      "icon": "Triple Barrel.png",
      "menu": "Each shot now fires three projectiles instead of two.",
      "effect": "Projectile count: 3. No additional shot is consumed."
    }
  ],
  "Widget": [
    {
      "name": "Express Recovery",
      "icon": "Express Recovery.png",
      "menu": "Widget regenerates faster than other heroes.",
      "effect": "Regeneration delay reduced from 6s to 4s; full-regeneration time remains 3s."
    },
    {
      "name": "Double Barrel",
      "icon": "Double Barrel.png",
      "menu": "Each shot now fires two projectiles instead of one.",
      "effect": "Projectile count: 2. No additional shot is consumed."
    }
  ],
  "Sprocket": [
    {
      "name": "Rocket Legs",
      "icon": "Rocket Legs.png",
      "menu": "Sprocket jumps higher from the ground.",
      "effect": "Base jump multiplier: 1.5 (+50%)."
    },
    {
      "name": "Cluster Bombs",
      "icon": "Cluster Bombs.png",
      "menu": "Grenades release two bomblets after exploding.",
      "effect": "2 bomblets; 2.5 AOE radius; 7 horizontal push; 1 upward push.",
      "columns": [
        "Damage"
      ],
      "levels": [
        [
          25
        ],
        [
          33
        ],
        [
          40
        ],
        [
          48
        ],
        [
          55
        ],
        [
          63
        ],
        [
          70
        ],
        [
          78
        ],
        [
          85
        ],
        [
          93
        ]
      ]
    }
  ],
  "Chip": [
    {
      "name": "Extra Agent",
      "icon": "Extra Agent.png",
      "menu": "The gadget now generates one additional Agent of Doom.",
      "effect": "3 Agents deployed instead of 2; consumes one gadget charge."
    },
    {
      "name": "Dual Arc Emitter",
      "icon": "Dual Arc Emitter.png",
      "menu": "The Tesla Claw can now hit two enemies at the same time.",
      "effect": "1 additional beam; 50% secondary-beam health multiplier; 16 Electric buildup.",
      "columns": [
        "Damage spec",
        "Health damage"
      ],
      "levels": [
        [
          20,
          10
        ],
        [
          26,
          13
        ],
        [
          32,
          16
        ],
        [
          38,
          19
        ],
        [
          44,
          22
        ],
        [
          50,
          25
        ],
        [
          56,
          28
        ],
        [
          62,
          31
        ],
        [
          68,
          34
        ],
        [
          74,
          37
        ]
      ]
    }
  ],
  "Lil'Ann": [
    {
      "name": "Adrenaline Spike",
      "icon": "Adrenaline Spike.png",
      "menu": "Knocking out another ranger grants Lil' Ann a temporary speed bonus.",
      "effect": "Move-speed modifier: +15% for 4s; triggered by a player elimination."
    },
    {
      "name": "Impact Chamber",
      "icon": "Impact Chamber.png",
      "menu": "Firing shortly after a dash delivers a more powerful shot.",
      "effect": "Enhanced-shot damage: +25%; activation window: 3s.",
      "columns": [
        "Normal damage",
        "Enhanced damage"
      ],
      "levels": [
        [
          104,
          130
        ],
        [
          127,
          159
        ],
        [
          149,
          186
        ],
        [
          172,
          215
        ],
        [
          195,
          244
        ],
        [
          217,
          271
        ],
        [
          240,
          300
        ],
        [
          263,
          329
        ],
        [
          285,
          356
        ],
        [
          308,
          385
        ]
      ],
      "note": "The activation window appears to be controlled by game code."
    }
  ],
  "Tempest": [
    {
      "name": "Pulse Core",
      "icon": "Pulse Core.png",
      "menu": "When the shield breaks, it deals damage in an area in front of it.",
      "effect": "Forward AOE; push force increases with level.",
      "columns": [
        "Damage",
        "Push force"
      ],
      "levels": [
        [
          59,
          25
        ],
        [
          71,
          45
        ],
        [
          84,
          65
        ],
        [
          97,
          85
        ],
        [
          110,
          105
        ],
        [
          122,
          125
        ],
        [
          135,
          145
        ],
        [
          148,
          165
        ],
        [
          161,
          185
        ],
        [
          173,
          205
        ]
      ]
    },
    {
      "name": "Cryo Shards",
      "icon": "Cryo Shards.png",
      "menu": "Projectiles leave ice shards on the ground after exploding.",
      "effect": "Approximately 2.5 effective AOE radius; 4 Ice buildup per application.",
      "columns": [
        "Damage"
      ],
      "levels": [
        [
          5
        ],
        [
          6
        ],
        [
          7
        ],
        [
          9
        ],
        [
          10
        ],
        [
          11
        ],
        [
          12
        ],
        [
          13
        ],
        [
          14
        ],
        [
          15
        ]
      ]
    }
  ],
  "Sparky": [
    {
      "name": "Azur Igniter",
      "icon": "Azur Igniter.png",
      "menu": "After holding fire for a sufficient duration, the flame turns blue and inflicts more damage.",
      "effect": "Activates after 1.5s of continuous fire; approximately +50% damage.",
      "columns": [
        "Normal damage",
        "Blue-fire damage"
      ],
      "levels": [
        [
          33,
          50
        ],
        [
          40,
          60
        ],
        [
          47,
          71
        ],
        [
          54,
          81
        ],
        [
          61,
          92
        ],
        [
          68,
          102
        ],
        [
          75,
          113
        ],
        [
          82,
          123
        ],
        [
          89,
          134
        ],
        [
          96,
          144
        ]
      ]
    }
  ],
  "Mopz": [
    {
      "name": "Spin-Up Rotor",
      "icon": "Spin-Up Rotor.png",
      "menu": "The rate of fire can increase even further.",
      "effect": "Adds stage 3 after 5s of spin-up with an 8x stored fire-rate multiplier.",
      "note": "Base stages are approximately 1.3s/3x and 3s/5x."
    },
    {
      "name": "Quick Reload",
      "icon": "Spin-Up Rotor.png",
      "menu": "The weapon recovers ammo after using a gadget."
    }
  ],
  "Celeste": [
    {
      "name": "Turbo Dash",
      "icon": "Turbo Dash.png",
      "menu": "Celeste's dash recharges faster.",
      "effect": "Dash cooldown reduction: 50%."
    },
    {
      "name": "Ricochet Blades",
      "icon": "Ricochet Blades.png",
      "menu": "Increases the maximum hit count from three to four.",
      "effect": "Ricochet count: 4 instead of 3; maximum hit count: 7 instead of 6; ricochet radius: 8."
    }
  ],
  "Zed": [
    {
      "name": "Artillery Ace",
      "icon": "Artillery Ace.png",
      "menu": "Zed One is no longer slowed down when firing his weapon.",
      "effect": "Weapon movement-speed modifier is overridden to 0; Ultimates are excluded."
    },
    {
      "name": "Rocket Cluster",
      "icon": "Rocket Cluster.png",
      "menu": "Fires two minirockets in addition to the usual one.",
      "effect": "2 additional minirockets; projectile speed: 24; blast radius: 1.",
      "columns": [
        "Minirocket damage"
      ],
      "levels": [
        [
          10
        ],
        [
          11
        ],
        [
          13
        ],
        [
          14
        ],
        [
          16
        ],
        [
          18
        ],
        [
          19
        ],
        [
          21
        ],
        [
          22
        ],
        [
          24
        ]
      ]
    }
  ],
  "Lump": [
    {
      "name": "Acid Core",
      "icon": "Acid Core.png",
      "menu": "Small allied Amoeboids now spawn an acid puddle on death.",
      "effect": "Acid-zone damage: 10; duration: 1s; triggered by Small Amoeboid death."
    },
    {
      "name": "Magma Nozzle",
      "icon": "Magma Nozzle.png",
      "menu": "Firing leaves lava on the ground, burning enemies standing on it.",
      "effect": "Pool radius: 2; lifetime: 2s; movement-speed modifier: -25%.",
      "columns": [
        "Damage per application"
      ],
      "levels": [
        [
          4
        ],
        [
          5
        ],
        [
          6
        ],
        [
          6
        ],
        [
          7
        ],
        [
          8
        ],
        [
          9
        ],
        [
          10
        ],
        [
          11
        ],
        [
          12
        ]
      ]
    }
  ],
  "Grimshot": [
    {
      "name": "Healing Field",
      "icon": "Healing Field.png",
      "menu": "Shields now heal allies directly behind them.",
      "effect": "2.3 radius; 8s duration; heals 5% of maximum HP per second."
    },
    {
      "name": "Thermal Scope",
      "icon": "Thermal Scope.png",
      "menu": "Rivals are displayed through walls at the center of the reticle.",
      "effect": "Through-wall detection enabled; normalized central-screen radius: 0.5."
    }
  ]
};
