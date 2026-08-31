#!/usr/bin/env python3
"""Validate or regenerate Ranger Rumble's text-exported website data.

The command is preview-only unless ``--write`` is supplied.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import date, timedelta
from pathlib import Path


DATA_DIR = Path(__file__).resolve().parent
ROOT = DATA_DIR.parent

RARITY_COLOURS = {"Common": "#3C6FFA", "Rare": "#ED00EE", "Epic": "#F38A0E", "Legendary": "#BF0303"}
HERO_ORDER = ["Widget", "Sprocket", "Chip", "Mopz", "Lil'Ann", "Tempest", "Sparky", "Celeste", "Zed", "Lump", "Grimshot", "Ratchet"]
# The current export omits class information for heroes other than Ratchet.
HERO_CLASS_FALLBACKS = {"Widget": "Allrounder", "Sprocket": "Allrounder", "Chip": "Disruptor", "Mopz": "Allrounder", "Lil'Ann": "Stalker", "Tempest": "Juggernaut", "Sparky": "Cannoneer", "Celeste": "Runner", "Zed": "Cannoneer", "Lump": "Juggernaut", "Grimshot": "Deadeye"}
LOADOUT_INTERNALS = {
    "Ratchet": ["Blaster", "WrenchThrow", "WrenchThrow", "RatchetMelee", "Ryno"], "Widget": ["Blaster", "DrillDash", "DrillDash", "WidgetMelee", "Ryno"],
    "Sprocket": ["Shatterbomb", "HoverBoots", "Hoverboots", "SprocketMelee", "MegaStrike"], "Chip": ["TeslaClaw", "GloveOfDoom", "Glove of Doom", "ChipMelee", "Sheepinator"],
    "Mopz": ["BlackholeStorm", "VoltageDrop", "ElectricGrenade", "MopzMelee", "Negatron"], "Lil'Ann": ["Blitzgun", "WhirlingBlades", "LittleSpin", "AnnMelee", "VortexWallop"],
    "Tempest": ["ColdSnap", "VoidRepulser", "Void Repulser", "MarkusMelee", "Cannonball"], "Sparky": ["Pyrocitor", "MineLauncher", "MineLauncher", "FuseMelee", "BigBoom"],
    "Celeste": ["Buzzblades", "Cryoslider", "Cryo Slider", "CelesteMelee", "Hoverboard"], "Zed": ["Warmonger", "Bombardier", "Bombardier", "ZedMelee", "TankFormation"],
    "Lump": ["LavaGun", "AmoeboidLauncher", "Amoeboid Launcher", "LumpMelee", "Evolution"], "Grimshot": ["Headhunter", "HoloshieldGlove", "Holoshield Glove", "GrimshotMelee", "SmokeScreen"],
}
SEASON_TWO_START = date(2025, 12, 2)
SEASON_ONE_START = date(2025, 11, 12)
WEAPON_DAMAGE_OVERRIDES = {
    "Bombardier": [112, 131, 149, 168, 187, 205, 224, 243, 261, 280],
    "Cryo Slider": [88, 103, 117, 132, 147, 161, 176, 191, 205, 220],
}
GADGET_STAT_OVERRIDES = {
    "Cryo Slider": {"Discs Per Use": 2},
}
MOD_PRESENTATION_OVERRIDES = {
    "Celeste": {
        "Turbo Dash": {"effect": "Dash cooldown reduction: 50%."},
        "Ricochet Blades": {"effect": "Maximum hit count: 7 instead of 6; ricochet radius: 8."},
    },
    "Chip": {
        "Extra Agent": {"effect": "3 Agents deployed instead of 2; consumes one gadget charge."},
        "Dual Arc Emitter": {"effect": "1 additional beam; 50% secondary-beam health multiplier; 16 Electric buildup."},
    },
    "Grimshot": {
        "Healing Field": {"effect": "2.3 radius; 8s duration; heals 5% of maximum HP per second."},
        "Thermal Scope": {"effect": "Through-wall detection enabled; normalized central-screen radius: 0.5."},
    },
    "Lil'Ann": {
        "Adrenaline Spike": {"menu": "Knocking out another ranger grants Lil' Ann a temporary speed bonus.", "effect": "Move-speed modifier: +15% for 4s; triggered by a player elimination."},
        "Impact Chamber": {"effect": "Enhanced-shot damage: +25%; activation window: 3s.", "note": "The activation window appears to be controlled by game code."},
    },
    "Lump": {
        "Acid Core (localized asset name; former wiki name: Acid Spill)": {"name": "Acid Core", "icon": "Acid Core.png", "effect": "Acid-zone damage: 10; duration: 1s; triggered by Small Amoeboid death."},
        "Magma Nozzle": {"effect": "Pool radius: 2; lifetime: 2s; movement-speed modifier: -25%."},
    },
    "Mopz": {
        "Spin-Up Rotor": {"effect": "Adds stage 3 after 5s of spin-up with an 8x stored fire-rate multiplier.", "note": "Base stages are approximately 1.3s/3x and 3s/5x."},
        "Quick Reload": {"icon": "Spin-Up Rotor.png"},
    },
    "Ratchet": {"Triple Barrel": {"effect": "Projectile count: 3. No additional shot is consumed."}},
    "Sparky": {"Azur Igniter": {"effect": "Activates after 1.5s of continuous fire; approximately +50% damage."}},
    "Sprocket": {
        "Rocket Legs": {"effect": "Base jump multiplier: 1.5 (+50%)."},
        "Cluster Bombs": {"effect": "2 bomblets; 2.5 AOE radius; 7 horizontal push; 1 upward push."},
    },
    "Tempest": {
        "Pulse Core": {"effect": "Forward AOE; push force increases with level."},
        "Cryo Shards": {"effect": "Approximately 2.5 effective AOE radius; 4 Ice buildup per application."},
    },
    "Widget": {"Double Barrel": {"effect": "Projectile count: 2. No additional shot is consumed."}},
    "Zed": {
        "Artillery Ace": {"effect": "Weapon movement-speed modifier is overridden to 0; Ultimates are excluded."},
        "Rocket Cluster": {"effect": "2 additional minirockets; projectile speed: 24; blast radius: 1."},
    },
}


def read(name: str) -> str:
    path = DATA_DIR / name
    if not path.is_file():
        raise ValueError(f"Required export is missing: data/{name}")
    return path.read_text(encoding="utf-8-sig")


def number(value: str) -> int | float:
    result = float(value.replace(",", ""))
    return int(result) if result.is_integer() else result


def clean_number_text(value: str) -> str:
    return re.sub(r"(?<!\d)(-?\d+)\.0+(?!\d)", r"\1", value)


def canonical_hero_name(name: str) -> str:
    return "Lil'Ann" if name == "Lil' Ann" else name


def normalized(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.lower())


def parse_stat_export(filename: str, labels: tuple[str, ...]) -> list[dict]:
    source = read(filename)
    header = re.compile(rf"^({'|'.join(labels)}):\s*(.+)$", re.MULTILINE)
    matches = list(header.finditer(source))
    entries = []
    for index, match in enumerate(matches):
        block = source[match.end():matches[index + 1].start() if index + 1 < len(matches) else len(source)]
        name = match.group(2).strip()
        if labels[0] == "HERO":
            ultimate = re.search(r"^ULTIMATE:\s*(.+)$", block, re.MULTILINE)
            if not ultimate:
                raise ValueError(f"{filename}: HERO {name} has no ULTIMATE line")
        else:
            ultimate = None
        table = re.search(r"^Level\s*\|\s*(.+)$\r?\n^[-|\s]+$\r?\n((?:^\s*\d+\s*\|.*$\r?\n?)+)", block, re.MULTILINE)
        if not table:
            raise ValueError(f"{filename}: {name} has no level table")
        columns = [cell.strip() for cell in table.group(1).split("|")]
        levels = []
        for row in table.group(2).splitlines():
            values = [cell.strip() for cell in row.split("|")]
            if len(values) != len(columns) + 1:
                raise ValueError(f"{filename}: malformed level row for {name}: {row}")
            levels.append({"Level": int(values[0]), **dict(zip(columns, (number(value) for value in values[1:])) )})
        if filename == "weapon_stats_export.txt" and name in WEAPON_DAMAGE_OVERRIDES:
            for level, damage in zip(levels, WEAPON_DAMAGE_OVERRIDES[name], strict=True):
                level["Damage"] = damage
        if filename == "gadget_stats_export.txt" and name in GADGET_STAT_OVERRIDES:
            for column, value in GADGET_STAT_OVERRIDES[name].items():
                columns.append(column)
                for level in levels:
                    level[column] = value
        entry = {"name": name, "columns": columns, "levels": levels}
        if ultimate:
            entry["ultimate"] = ultimate.group(1).strip()
        if labels[0] == "GADGET":
            internal = re.search(r"^INTERNAL ID:\s*(.+)$", block, re.MULTILINE)
            hero = re.search(r"^HERO:\s*(.+)$", block, re.MULTILINE)
            if internal:
                entry["internalId"] = internal.group(1).strip()
                if entry["internalId"] == "AmoeboidLauncher":
                    entry["columns"] = [column for column in entry["columns"] if column != "AcidZone Duration"]
            if hero:
                entry["hero"] = hero.group(1).strip()
        entries.append(entry)
    if not entries:
        raise ValueError(f"{filename}: no entries found")
    return entries


def parse_descriptions(filename: str, has_full: bool) -> dict[str, dict[str, str]]:
    entries = {}
    for block in re.split(r"\r?\n\s*\r?\n", read(f"descriptions/{filename}")):
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if len(lines) < 2:
            continue
        name, paragraphs = lines[0], lines[1:]
        entries[name] = {"short": paragraphs[0], "full": " ".join(paragraphs[1:]) if has_full else ""}
    if not entries:
        raise ValueError(f"data/descriptions/{filename}: no descriptions found")
    return entries


def parse_mods() -> dict[str, list[dict]]:
    source = read("hero_talent_stats_export.txt")
    blocks = re.split(r"^={20,}\s*$", source, flags=re.MULTILINE)
    result: dict[str, list[dict]] = {}
    for block in blocks:
        hero = re.search(r"^HERO:\s*(.+?)(?:\s+\(internal:.*\))?$", block, re.MULTILINE)
        if not hero:
            continue
        hero_name = canonical_hero_name(hero.group(1).strip())
        talents = re.split(r"(?=^TALENT:\s*)", block, flags=re.MULTILINE)[1:]
        for talent_block in talents:
            talent = re.search(r"^TALENT:\s*(.+)$", talent_block, re.MULTILINE)
            menu = re.search(r"^MENU:\s*(.+)$", talent_block, re.MULTILINE)
            effect = re.search(r"^EFFECT:\s*(.+)$", talent_block, re.MULTILINE)
            if not (talent and menu):
                raise ValueError(f"hero_talent_stats_export.txt: malformed talent for {hero_name}")
            entry = {"name": talent.group(1).strip(), "icon": f"{talent.group(1).strip()}.png", "menu": menu.group(1).strip()}
            if effect:
                entry["effect"] = clean_number_text(effect.group(1).strip())
            table = re.search(r"^Level\s*\|\s*(.+)$\r?\n((?:^\s*\d+\s*\|.*$\r?\n?)+)", talent_block, re.MULTILINE)
            if table:
                entry["columns"] = [cell.strip() for cell in table.group(1).split("|")]
                entry["levels"] = [[number(cell.strip()) for cell in row.split("|")[1:]] for row in table.group(2).splitlines()]
            entry.update(MOD_PRESENTATION_OVERRIDES.get(hero_name, {}).get(entry["name"], {}))
            result.setdefault(hero_name, []).append(entry)
    if not result:
        raise ValueError("hero_talent_stats_export.txt: no hero talents found")
    return result


def parse_melee() -> dict[str, dict[str, list[int]]]:
    source = read("melee_damage_stats.txt")
    table = re.search(r"^Level\s*\|\s*(.+)$\r?\n^[-|\s]+$\r?\n((?:^\s*\d+\s*\|.*$\r?\n?)+)", source, re.MULTILINE)
    if not table:
        raise ValueError("melee_damage_stats.txt: level table not found")
    result: dict[str, dict[str, list[int]]] = {}
    for heading in (cell.strip() for cell in table.group(1).split("|")):
        match = re.fullmatch(r"(Small|Medium|Large)\s+(Common|Rare|Epic)", heading)
        if not match:
            raise ValueError(f"melee_damage_stats.txt: unrecognised column {heading!r}")
        result.setdefault(match.group(1), {})[match.group(2)] = []
    headings = [cell.strip() for cell in table.group(1).split("|")]
    for row in table.group(2).splitlines():
        values = [cell.strip() for cell in row.split("|")]
        for heading, value in zip(headings, values[1:]):
            size, rarity = re.fullmatch(r"(Small|Medium|Large)\s+(Common|Rare|Epic)", heading).groups()
            result[size][rarity].append(int(number(value)))
    result["Medium"]["Legendary"] = result["Medium"]["Epic"].copy()
    return result


def parse_active_loadouts() -> dict[str, dict[str, str]]:
    result = {}
    for block in re.split(r"\r?\n\s*\r?\n", read("active-hero-loadouts.txt")):
        hero = re.search(r"^Hero:\s*(.+?)(?:\s+\([^\n]*\))?$", block, re.MULTILINE)
        if not hero:
            continue
        values = {"name": canonical_hero_name(hero.group(1).strip())}
        for field in ("Class", "Speed", "Rarity", "Weapon", "Gadget", "Melee", "Ultimate"):
            match = re.search(rf"^{field}:\s*(.+?)(?:\s+\([^\n]*\))?$", block, re.MULTILINE)
            if match:
                values[field.lower()] = match.group(1).strip()
        required = ("weapon", "gadget", "melee", "ultimate")
        if any(field not in values for field in required):
            raise ValueError(f"active-hero-loadouts.txt: incomplete loadout for {values['name']}")
        result[values["name"]] = values
    if not result:
        raise ValueError("active-hero-loadouts.txt: no hero loadouts found")
    return result


def parse_melee_hero_profiles() -> dict[str, tuple[str, str]]:
    profiles = {}
    for match in re.finditer(r"^(.+?):\s*(Small|Medium|Large),\s*(Common|Rare|Epic|Legendary)", read("melee_damage_stats.txt"), re.MULTILINE):
        profiles[match.group(1).strip()] = (match.group(2), match.group(3))
    return profiles


def parse_season() -> tuple[int, list[list[int | str]]]:
    source = read("SeasonPassContent.txt")
    season = re.search(r"^\s*Season\s+(\d+)\s*$", source, re.MULTILINE | re.IGNORECASE)
    if not season:
        raise ValueError("SeasonPassContent.txt: first line must be a season label such as 'Season 11'")
    rewards = []
    for line in source.splitlines():
        match = re.match(r"^\s*(\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*([\d,]+)\s*$", line)
        if match:
            rewards.append([int(match.group(1)), match.group(2), match.group(3), int(match.group(4).replace(",", ""))])
    if not rewards:
        raise ValueError("SeasonPassContent.txt: no reward rows found")
    return int(season.group(1)), rewards


def parse_used_skins() -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    current = None
    used = False
    for line in read("hero-skins-status.txt").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("="):
            continue
        if stripped == "Used:":
            used = True
        elif stripped == "Unused:":
            used = False
        elif stripped.startswith("- ") and used and current:
            name = stripped[2:].strip()
            if name.lower() != "none":
                result[current].append(name)
        elif not stripped.startswith("-"):
            if stripped.upper() == "ACTIVE HERO SKINS":
                continue
            current, used = canonical_hero_name(stripped), False
            result[current] = []
    if not result:
        raise ValueError("hero-skins-status.txt: no heroes found")
    return result


def json_js(variable: str, value: object, comment: str = "") -> str:
    prefix = f"// Generated from {comment}.\n" if comment else ""
    return f"{prefix}window.{variable} = {json.dumps(value, ensure_ascii=False, indent=2)};\n"


def replace_section(source: str, pattern: str, replacement: str, filename: str) -> str:
    updated, count = re.subn(pattern, replacement, source, flags=re.DOTALL)
    if count != 1:
        raise ValueError(f"{filename}: expected one replaceable section, found {count}")
    return updated


def season_date_label(start: str, end: str) -> str:
    start_date, end_date = date.fromisoformat(start), date.fromisoformat(end)
    start_label = f"{start_date.strftime('%B')} {start_date.day}"
    end_label = f"{end_date.strftime('%B')} {end_date.day}"
    return f"{start_label} – {end_label}, {end_date.year}" if start_date.year == end_date.year else f"{start_label}, {start_date.year} – {end_label}, {end_date.year}"


def update_index(source: str, game_version: str, site_version: str, season_start: str, season_end: str) -> str:
    source = replace_section(source, r'(<meta name="app-version" content=")[^"]+("/?>)', rf'\g<1>{site_version}\g<2>', "index.html")
    source = replace_section(source, r'(Game version\s+)[^<]+', rf'\g<1>{game_version}', "index.html")
    source = replace_section(source, r'(<p class="season-dates">)[^<]+(</p>)', rf'\g<1>{season_date_label(season_start, season_end)}\g<2>', "index.html")
    return re.sub(r'([?&]v=)[^"\'&\s>]+', rf'\g<1>{site_version}', source)


def render_guide_melee(melee: dict[str, dict[str, list[int]]]) -> str:
    lines = ["  meleeDamage: {"]
    for size, rarities in melee.items():
        lines.append(f"    {size}: {{")
        for rarity, values in rarities.items():
            lines.append(f"      {rarity}: {json.dumps(values)},")
        lines.append("    },")
    lines.append("  },")
    return "\n".join(lines)


def js_string(value: str) -> str:
    if "'" in value:
        return json.dumps(value, ensure_ascii=False)
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


def render_guide(guide: dict) -> str:
    lines = ["// Generated from data/active-hero-loadouts.txt and data/melee_damage_stats.txt.", "window.RANGER_GUIDE = {", f"  heroOrder: [{', '.join(js_string(name) for name in guide['heroOrder'])}],", "  heroes: {"]
    for name in guide["heroOrder"]:
        hero = guide["heroes"][name]
        fields = [f"className: {js_string(hero['className'])}", f"speed: {js_string(hero['speed'])}", f"rarity: {js_string(hero['rarity'])}", f"color: {js_string(hero['color'])}"]
        for key in ("eventOnly", "descriptionHeightHero", "weaponStats"):
            if key in hero:
                value = "true" if hero[key] is True else js_string(hero[key])
                fields.append(f"{key}: {value}")
        fields.append(f"loadout: [{', '.join(js_string(value) for value in hero['loadout'])}]")
        lines.append(f"    {js_string(name) if not re.fullmatch(r'[A-Za-z_$][A-Za-z0-9_$]*', name) else name}: {{{', '.join(fields)}}},")
    lines.extend(["  },", render_guide_melee(guide["meleeDamage"]), "  descriptionAliases: {", "    heroes: {Tempest: 'Markus'},", "    weapons: {'Burst Pistol': 'Blaster', 'Blackhole Storm': 'Blackhole', Pyrocitor: 'Pyro'},", "    gadgets: {'Cryo Slider': 'Cryoslider'},", "    ultimates: {},", "    melee: {}", "  }", "};", ""])
    return "\n".join(lines)


def build_guide() -> str:
    melee = parse_melee()
    heroes = {}
    profiles = parse_melee_hero_profiles()
    for name, source in parse_active_loadouts().items():
        profile_size, profile_rarity = profiles.get(name, (None, None))
        profile_speed = {"Small": "Fast", "Medium": "Medium", "Large": "Slow"}.get(profile_size)
        speed = source.get("speed") or profile_speed
        rarity = source.get("rarity") or profile_rarity
        class_name = source.get("class") or HERO_CLASS_FALLBACKS.get(name)
        if not (speed and rarity and class_name):
            raise ValueError(f"active-hero-loadouts.txt: {name} needs Class, Speed, and Rarity")
        internals = LOADOUT_INTERNALS.get(name)
        if internals is None:
            compact = lambda value: re.sub(r"[^A-Za-z0-9]", "", value)
            internals = [compact(source["weapon"]), compact(source["gadget"]), source["gadget"], f"{compact(name)}Melee", compact(source["ultimate"])]
        hero = {"className": class_name, "speed": speed, "rarity": rarity, "color": RARITY_COLOURS[rarity], "loadout": [source["weapon"], internals[0], source["gadget"], internals[1], internals[2], source["melee"], internals[3], source["ultimate"], internals[4]]}
        if name == "Ratchet":
            hero.update({"eventOnly": True, "descriptionHeightHero": "Widget", "weaponStats": "Ratchet Burst Pistol"})
        heroes[name] = hero
    hero_order = [name for name in HERO_ORDER if name in heroes] + [name for name in heroes if name not in HERO_ORDER]
    guide = {"heroOrder": hero_order, "heroes": heroes, "meleeDamage": melee}
    return render_guide(guide)


def season_infinite_reward() -> str:
    path = ROOT / "season-data.js"
    if not path.is_file():
        return "Reebo (Common) x1"
    source = path.read_text(encoding="utf-8-sig")
    infinite_match = re.search(r"\binfiniteReward:\s*'([^']+)'", source)
    return infinite_match.group(1) if infinite_match else "Reebo (Common) x1"


def season_dates(number: int) -> tuple[str, str]:
    if number < 1:
        raise ValueError("SeasonPassContent.txt: season number must be at least 1")
    start = SEASON_ONE_START if number == 1 else SEASON_TWO_START + timedelta(days=(number - 2) * 28)
    return start.isoformat(), (start + timedelta(days=20 if number == 1 else 28)).isoformat()


def build_outputs(game_version: str, site_version: str) -> dict[Path, str]:
    weapons = parse_stat_export("weapon_stats_export.txt", ("WEAPON",))
    gadget_exports = parse_stat_export("gadget_stats_export.txt", ("GADGET",))
    gadgets = [
        {"name": item.get("internalId", item["name"]), "columns": item["columns"], "levels": item["levels"]}
        for item in gadget_exports
    ]
    data = {
        "characters": parse_stat_export("character_stats_export.txt", ("HERO",)),
        "weapons": weapons,
        "gadgets": gadgets,
    }
    descriptions = {
        "heroes": parse_descriptions("heroes.txt", True),
        "weapons": parse_descriptions("wpn.txt", False),
        "gadgets": parse_descriptions("gadget.txt", False),
        "melee": parse_descriptions("melee.txt", False),
        "ultimates": parse_descriptions("ult.txt", False),
    }
    season_number, rewards = parse_season()
    season_start, season_end = season_dates(season_number)
    season = json_js("RANGER_SEASON", {"number": season_number, "starts": season_start, "ends": season_end, "rewards": rewards, "infiniteReward": season_infinite_reward()}, "data/SeasonPassContent.txt")
    return {
        ROOT / "data.json": json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        ROOT / "data.js": json_js("RUMBLE_DATA", data, "data.json by data/update_site_data.py"),
        ROOT / "descriptions.js": json_js("RUMBLE_DESCRIPTIONS", descriptions, "data/descriptions/*.txt"),
        ROOT / "mods-data.js": json_js("RANGER_MODS", parse_mods(), "data/hero_talent_stats_export.txt"),
        ROOT / "guide-data.js": build_guide(),
        ROOT / "season-data.js": season,
        DATA_DIR / "skin-status.js": json_js("RANGER_USED_SKINS", parse_used_skins(), "data/hero-skins-status.txt"),
        ROOT / "index.html": update_index((ROOT / "index.html").read_text(encoding="utf-8-sig"), game_version, site_version, season_start, season_end),
    }


def current_site_version() -> str:
    source = (ROOT / "index.html").read_text(encoding="utf-8-sig")
    match = re.search(r'<meta name="app-version" content="([^"]+)"', source)
    if not match:
        raise ValueError("index.html: app-version meta tag not found")
    return match.group(1)


def next_site_version(version: str) -> str:
    parts = version.split(".")
    if not parts or not all(part.isdigit() for part in parts):
        raise ValueError(f"Cannot increment site version {version!r}")
    parts[-1] = str(int(parts[-1]) + 1)
    return ".".join(parts)


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate or regenerate website data from data/*.txt exports.")
    parser.add_argument("--game-version", "--version", dest="game_version", help="Game version displayed in the footer (for example 1.9.3).")
    parser.add_argument("--site-version", help="Cache-busting site version; defaults to the current app-version.")
    parser.add_argument("--bump-site-version", action="store_true", help="Increment the final part of the current site version.")
    parser.add_argument("--write", action="store_true", help="Write changed generated files. Without this flag, only a preview is performed.")
    args = parser.parse_args()
    game_version = args.game_version or input("Game version (for example 1.9.3): ").strip()
    if not re.fullmatch(r"\d+(?:\.\d+){1,3}(?:[-+][0-9A-Za-z.-]+)?", game_version):
        raise SystemExit("Game version must look like 1.9.3.")
    if args.site_version and args.bump_site_version:
        raise SystemExit("Use either --site-version or --bump-site-version, not both.")
    try:
        existing_site_version = current_site_version()
        site_version = args.site_version or (next_site_version(existing_site_version) if args.bump_site_version else existing_site_version)
        if not re.fullmatch(r"\d+(?:\.\d+){1,3}", site_version):
            raise ValueError("Site version must look like 0.14.48")
        outputs = build_outputs(game_version, site_version)
    except ValueError as error:
        raise SystemExit(f"Update stopped: {error}") from error
    changed = {path: content for path, content in outputs.items() if not path.is_file() or path.read_text(encoding="utf-8-sig") != content}
    if not changed:
        print("Validated exports; generated files are already current.")
        return
    action = "Updating" if args.write else "Preview only; would update"
    print(f"{action} {len(changed)} file(s) for game {game_version}, site {site_version}:")
    for path in changed:
        print(f"  {path.relative_to(ROOT)}")
    if not args.write:
        print("Run again with --write after reviewing the preview.")
        return
    for path, content in changed.items():
        path.write_text(content, encoding="utf-8", newline="\n")
    print(f"Updated {len(changed)} file(s). Run data/validate-data.js and review the Git diff before committing.")


if __name__ == "__main__":
    main()
