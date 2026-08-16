const raw = window.RUMBLE_DATA;
const $ = s => document.querySelector(s);
const base = 'images';
const assetVersion = '20260817';
const files = {
  weapons: ['BlackholeStorm','Blaster','Blitzgun','Buzzblades','ColdSnap','Cryoshot','Headhunter','LavaGun','PlasmaStriker','Pyrocitor','ScorpionFlail','Shatterbomb','SuckCannon','TeslaClaw','TheEnforcer','ToxicSplatter','Warmonger'],
  gadgets: ['AmoeboidLauncher','Bombardier','Cryoslider','DrillDash','GloveOfDoom','HoloshieldGlove','HoverBoots','MineLauncher','VoidRepulser','VoltageDrop','WhirlingBlades'],
  melee: ['AnnMelee','CelesteMelee','ChipMelee','FuseMelee','GrimshotMelee','LumpMelee','MarkusMelee','MopzMelee','SprocketMelee','WidgetMelee','ZedMelee'],
  ultimates: ['BigBoom','BigBoomRemote','Cannonball','Evolution','Hoverboard','MegaStrike','Negatron','Ryno','Sheepinator','SmokeScreen','TankFormation','VortexWallop']
};
const heroClasses = {Widget:'Allrounder',Sprocket:'Allrounder',Mopz:'Allrounder',Tempest:'Juggernaut',Lump:'Juggernaut',Sparky:'Cannoneer',Zed:'Cannoneer',"Lil'Ann":'Stalker',Celeste:'Runner',Grimshot:'Deadeye',Chip:'Disruptor'};
const heroProfiles = {Widget:{speed:'Medium',rarity:'Common',color:'#3C6FFA'},Sprocket:{speed:'Medium',rarity:'Common',color:'#3C6FFA'},Chip:{speed:'Medium',rarity:'Common',color:'#3C6FFA'},Celeste:{speed:'Medium',rarity:'Epic',color:'#F38A0E'},Zed:{speed:'Fast',rarity:'Epic',color:'#F38A0E'},Grimshot:{speed:'Medium',rarity:'Epic',color:'#F38A0E'},Sparky:{speed:'Fast',rarity:'Rare',color:'#ED00EE'},Lump:{speed:'Slow',rarity:'Rare',color:'#ED00EE'},Tempest:{speed:'Slow',rarity:'Rare',color:'#ED00EE'},Mopz:{speed:'Medium',rarity:'Rare',color:'#ED00EE'},"Lil'Ann":{speed:'Medium',rarity:'Rare',color:'#ED00EE'}};
const loadouts = {
  Widget:['Burst Pistol','Blaster','Drill Thruster','DrillDash','DrillDash','Turbo Drill','WidgetMelee','RYNO','Ryno'],
  Celeste:['Buzz Blades','Buzzblades','Cryo Slider','Cryoslider','Cryo Slider','Slapshot','CelesteMelee','Hoverboard','Hoverboard'],
  Sprocket:['Shatterbomb','Shatterbomb','Hoverboots','HoverBoots','Hoverboots','Omnimagnet','SprocketMelee','Mega Strike','MegaStrike'],
  Sparky:['Pyrocitor','Pyrocitor','Hunter Mine Launcher','MineLauncher','MineLauncher','Crackaxe','FuseMelee','Big Boom','BigBoom'],
  "Lil'Ann":['Blitz Gun','Blitzgun','Whirling Blades','WhirlingBlades','LittleSpin','Storm Cutlass','AnnMelee','Vortex Wallop','VortexWallop'],
  Chip:['Tesla Claw','TeslaClaw','Glove of Doom','GloveOfDoom','Glove of Doom','Brainstorm','ChipMelee','Sheep-o-Bomb','Sheepinator'],
  Tempest:['Cold Snap','ColdSnap','Void Repulser','VoidRepulser','Void Repulser','Typhoon','MarkusMelee',"Good Ol' Shot",'Cannonball'],
  Zed:['Warmonger','Warmonger','Bombardier','Bombardier','Bombardier','Stick of Order','ZedMelee','Tank Formation','TankFormation'],
  Mopz:['Blackhole Storm','BlackholeStorm','Voltage Drop','VoltageDrop','ElectricGrenade','SEV3R','MopzMelee','Negatron Collider','Negatron'],
  Grimshot:['Headhunter','Headhunter','Holoshield Glove','HoloshieldGlove','Holoshield Glove','X60 Cleaver','GrimshotMelee','Smoke Leap','SmokeScreen'],
  Lump:['Lava Gun','LavaGun','Amoeboid Launcher','AmoeboidLauncher','Amoeboid Launcher','Glo-Bash','LumpMelee','Mutagenic Burst','Evolution']
};
const customImages = JSON.parse(localStorage.getItem('rangerRumbleImages') || '{}');
const norm = value => String(value).replace(/[^a-z0-9]/gi,'').toLowerCase();
const safe = value => { const e=document.createElement('span'); e.textContent=value; return e.innerHTML; };
const displayHeroName = value => value==="Lil'Ann"?"Lil' Ann":value;
const descriptionAliases = {heroes:{Tempest:'Markus'},weapons:{'Burst Pistol':'Blaster','Blackhole Storm':'Blackhole',Pyrocitor:'Pyro'},gadgets:{'Cryo Slider':'Cryoslider'},ultimates:{},melee:{}};
function descriptionEntry(category,name,hero='') { const source=window.RUMBLE_DESCRIPTIONS?.[category]||{}, lookup=category==='melee'?hero:(descriptionAliases[category]?.[name]||name), key=Object.keys(source).find(entry=>norm(entry)===norm(lookup)); return key?source[key]:null; }
function showDescription(category,name,hero='',full=false) { const panel=$('#profile-description'); if(!panel)return; const label={heroes:'Hero',weapons:'Weapon',gadgets:'Gadget',melee:'Melee',ultimates:'Ultimate'}[category]||category,entry=descriptionEntry(category,name,hero),displayName=category==='heroes'?displayHeroName(name):name; panel.dataset.category=category;panel.dataset.name=name;panel.dataset.hero=hero;panel.dataset.full=String(full); const copy=entry?(full&&entry.full?entry.full:entry.short):'No description is available yet.'; const toggle=entry?.full&&entry.full!==entry.short?`<button class="description-toggle" type="button" data-full="${full?'false':'true'}">${full?'Show short description':'Read full description'}</button>`:''; panel.innerHTML=`<span class="type">${safe(label)}</span><h3>${safe(displayName)}</h3><p>${safe(copy)}</p>${toggle}`; }
let pinnedDescription=null;
function rememberDescription(){const panel=$('#profile-description');if(panel)pinnedDescription={category:panel.dataset.category,name:panel.dataset.name,hero:panel.dataset.hero,full:panel.dataset.full==='true'};}
const trim = item => ({...item, levels:item.levels.filter(level => level.Level <= 10)});
const data = {characters:[...raw.characters.filter(x=>x.name!=='Avatar').map(trim),{name:'FreezePoint',levels:[]}], weapons:[...raw.weapons.map(trim),{name:'Cryoshot',levels:[]},{name:'Toxic Splatter',levels:[]}], gadgets:raw.gadgets.map(trim)};
function icon(key, folder) { const found=files[folder]?.find(x=>norm(x)===norm(key)); return found ? `${base}/${folder}/${found}.png?v=${assetVersion}` : null; }
function skinSource(file) { return `${base}/skins/${file.split('/').map(encodeURIComponent).join('/')}?v=${assetVersion}`; }
function heroImage(key) { const folderSkins=(window.RANGER_SKINS||[]).filter(file=>file.startsWith(`${key}/`)&&!file.includes('/icons/')),defaultSkin=folderSkins.find(file=>file===`${key}/${key}.png`)||folderSkins[0]; return skinSource(defaultSkin || `${key}/${key}.png`); }
function heroRender(key) { const file=key==="Lil'Ann"?'LilAnn':key; return `${base}/renders/${file}.png?v=${assetVersion}`; }
function heroPortrait(key) { const internal={Tempest:'Markus',Zed:'ZedOne',"Lil'Ann":'LilAnn'}[key]||key; return `${base}/skins/icons/ico_miniPortrait_${internal}.png?v=${assetVersion}`; }
function find(items,key) { return items.find(item=>norm(item.name)===norm(key)); }
function card(key, archived=false, type='hero') {
  const l=loadouts[key], title=displayHeroName(key),profile=heroProfiles[key];
  const image=archived?(type==='heroes'?heroImage(key):icon(key,type)):heroImage(key);
  const subtitle=archived?'':l[0];
  const category=type==='heroes'?'Hero':type==='weapons'?'Weapon':type==='gadgets'?'Gadget':heroClasses[key];
  return `<article class="card" style="${profile?`--rarity:${profile.color}`:''}" tabindex="0" role="button" data-type="${type}" data-key="${safe(key)}"><div class="portrait">${image?`<img src="${image}" alt="${safe(title)}" onerror="this.remove()">`:'<span class="type">Info coming soon</span>'}</div><div class="card-body">${profile?`<div class="card-meta"><span class="rarity-badge">${profile.rarity}</span><span class="type">${safe(category)}</span></div>`:`<span class="type">${safe(category)}</span>`}<h3>${safe(title)}</h3>${subtitle?`<p>${safe(subtitle)}</p>`:''}</div></article>`;
}
const heroOrder=['Widget','Sprocket','Chip','Mopz',"Lil'Ann",'Tempest','Sparky','Celeste','Zed','Lump','Grimshot'];
function render() { $('#character-grid').innerHTML=heroOrder.map(key=>card(key)).join(''); }
function statLabel(column,mode) { let text=column.replace(/^\d+_/,'').replace(/_/g,' ').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/Aoe/gi,'AOE'); if(mode==='ultimate')text=text.replace(/^Ult\b/i,'Ultimate'); return text.split(/\s+/).map((word,index)=>/^(HP|AOE|RYNO)$/i.test(word)?word.toUpperCase():index?word.toLowerCase():word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(' '); }
function statIcon(label) { const text=label.toLowerCase(); let file='',ext='png'; if(/max ammo|\bammo\b/.test(text)){file='ammo';ext='svg'}else if(/\brange\b/.test(text)){file='range';ext='svg'}else if(/fire rate/.test(text)){file='fire-rate';ext='svg'}else if(/\bhp\b|health/.test(text))file='health';else if(/damage/.test(text))file='damage';else if(/reload|cooldown/.test(text))file='cooldown';else if(/speed/.test(text))file='speed'; return file?`<img class="stat-ui-icon" src="images/UI%20icons/ico_stats_${file}.${ext}" alt="">`:''; }
function statCandidates(item,mode='normal') { if(!item?.levels?.length)return[]; const all=Object.keys(item.levels[0]).filter(column=>column!=='Level'&&!/Power/i.test(column)); return mode==='hero'?all.filter(column=>!/^Ult /i.test(column)&&!/^Tank /i.test(column)):mode==='ultimate'?(item.name==='Zed'?all.filter(column=>/^Tank /i.test(column)):all.filter(column=>/^Ult /i.test(column)&&!/Fire Rate/i.test(column))):all; }
function statsTable(title,item,mode='normal',showLevel=true) {
  if (!item) return `<section class="stat-section"><h3>${safe(title)}</h3><p class="sub">Stats have not been added yet.</p></section>`;
  const candidates=statCandidates(item,mode);
  if (!candidates.length) return '';
  const fixed=candidates.filter(column=>item.levels.every(row=>row[column]===item.levels[0][column]));
  const columns=candidates.filter(column=>!fixed.includes(column));
  const fixedStats=fixed.length?`<div class="fixed-stats">${fixed.map(column=>`<div><span>${safe(statLabel(column,mode))}</span><strong>${safe(item.levels[0][column])}</strong></div>`).join('')}</div>`:'';
  const table=columns.length?`<div class="table-scroll"><table class="stats ${showLevel?'':'no-level'}"><thead><tr>${showLevel?'<th>Level</th>':''}${columns.map(column=>`<th>${safe(statLabel(column,mode))}</th>`).join('')}</tr></thead><tbody>${item.levels.map(row=>`<tr>${showLevel?`<td>LV ${row.Level}</td>`:''}${columns.map(column=>`<td>${Number.isInteger(row[column])?row[column].toLocaleString():row[column]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
  return `<section class="stat-section"><h3>${safe(title)}</h3>${fixedStats}${table}</section>`;
}
function combinedStatsTable(hero,weapon,gadget,loadout) {
  const groups=[{label:'Hero',displayName:hero.name,item:hero,mode:'hero'},{label:'Weapon',displayName:loadout[0],item:weapon,mode:'normal'},{label:'Gadget',displayName:loadout[2],item:gadget,mode:'normal'},{label:'Ultimate',displayName:loadout[7],item:hero,mode:'ultimate'}].map(group=>{
    const candidates=statCandidates(group.item,group.mode),fixed=candidates.filter(column=>group.item.levels.every(row=>row[column]===group.item.levels[0][column])),id=`stats-${norm(group.label)}`;
    return {...group,id,fixed,columns:candidates.filter(column=>!fixed.includes(column)).map((key,index)=>({key,id:`${id}-${index}`}))};
  });
  const fixedGroups=groups.filter(group=>group.fixed.length),visible=groups.filter(group=>group.columns.length);
  const fixedMarkup=fixedGroups.length?`<div class="combined-fixed">${fixedGroups.map(group=>`<dl class="fixed-group"><div class="fixed-group-title">${safe(group.label)}: ${safe(group.displayName)}</div>${group.fixed.map(column=>{const label=statLabel(column,group.mode);return`<div class="fixed-stat"><dt>${statIcon(label)}<span>${safe(label)}</span></dt><dd>${safe(group.item.levels[0][column])}</dd></div>`}).join('')}</dl>`).join('')}</div>`:'';
  const headGroups=visible.map(group=>`<th id="${group.id}" scope="colgroup" colspan="${group.columns.length}">${safe(group.label)}: ${safe(group.displayName)}</th>`).join('');
  const headColumns=visible.flatMap(group=>group.columns.map((column,index)=>{const label=statLabel(column.key,group.mode).replace(new RegExp(`^${group.label} `,'i'),'').replace(/^Tank /i,'');return`<th id="${column.id}" class="${index===0?'group-start':''}" scope="col"><span class="column-label">${safe(label)}</span></th>`})).join('');
  const rows=hero.levels.map((row,index)=>{const rowId=`stats-level-${row.Level}`,cells=visible.flatMap(group=>group.columns.map(column=>{const value=group.item.levels[index]?.[column.key]??'—';return`<td headers="${rowId} ${group.id} ${column.id}">${Number.isInteger(value)?value.toLocaleString():safe(value)}</td>`})).join('');return`<tr><th id="${rowId}" scope="row">LV ${row.Level}</th>${cells}</tr>`}).join('');
  return `<section class="combined-stats"><h3>Combat stats</h3>${fixedMarkup}<div class="combined-table"><table class="stats"><caption>Level 1–10 combat statistics for ${safe(hero.name)}</caption><thead><tr><th rowspan="2" scope="col">Level</th>${headGroups}</tr><tr>${headColumns}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
}
function combatIcon(type,name,key,folder,hero,extraKey=null) { const id=`${hero}:${folder}:${key||name}`,source=customImages[id]||(key&&icon(key,folder)),extra=extraKey&&icon(extraKey,folder),category=type.toLowerCase()==='weapon'?'weapons':type.toLowerCase()==='gadget'?'gadgets':type.toLowerCase()==='melee'?'melee':'ultimates'; return `<button class="combat-icon ${extra?'dual':''} ${source?'':'assign-image'}" data-image-id="${safe(id)}" data-image-label="${safe(name)}" data-description-category="${category}" data-description-name="${safe(name)}" data-description-hero="${safe(hero)}">${`<b class="icon-type">${safe(type)}</b>`}<span class="icon-art">${source?`<img src="${source}" alt="${safe(name)}" onerror="this.remove()">`:'<i>+</i>'}${extra?`<img src="${extra}" alt="${safe(name)} remote" onerror="this.remove()">`:''}</span><small>${source?safe(name):`Add ${safe(name)} image`}</small></button>`; }
function heroSkins(key) { const def=`${key}/${key}.png`; return (window.RANGER_SKINS||[]).filter(file=>file.startsWith(`${key}/`)).sort((a,b)=>a===def?-1:b===def?1:a.localeCompare(b)); }
function skinName(file,key) { const result=file.split('/').at(-1).replace(/\.png$/i,''); return result===key?'Default':result.replace(new RegExp(` ${key}$`),''); }
function showHero(key) {
  const l=loadouts[key], hero=find(data.characters,key), weapon=find(data.weapons,l[0]),profile=heroProfiles[key];
  const gadget=find(data.gadgets,l[4])||find(data.weapons,l[4]);
  const skinButtons=heroSkins(key).map(file=>`<button class="skin" data-file="${safe(file)}"><img src="${skinSource(file)}" alt="${safe(skinName(file,key))}"><span>${safe(skinName(file,key))}</span></button>`).join('');
  const collapsed=matchMedia('(max-width:760px)').matches?' art-collapsed':'';
  $('#dialog-content').innerHTML=`<div class="hero-detail${collapsed}" style="--rarity:${profile.color}"><div class="detail-art"><button class="art-toggle" type="button" aria-expanded="${collapsed?'false':'true'}">${collapsed?'Show artwork and selected skin':'Hide artwork and selected skin'}</button><img id="hero-art" src="${heroRender(key)}" alt="${safe(displayHeroName(key))} render"><div class="selected-skin"><h3>Skins</h3><img id="skin-preview-image" src="${heroImage(key)}" alt="${safe(displayHeroName(key))} selected skin"><span id="selected-skin-name">Default</span></div></div><div class="detail-body"><button class="profile-title hero-summary" type="button" data-hero="${safe(key)}"><img class="hero-portrait" src="${heroPortrait(key)}" alt=""><div><div class="profile-meta"><span class="rarity-badge">${profile.rarity}</span><span class="type">${safe(heroClasses[key])}</span><span class="speed-badge"><img src="images/UI%20icons/ico_stats_speed.png" alt="">${profile.speed} speed</span></div><h2>${safe(displayHeroName(key))}</h2><small>Hero overview</small></div></button><div class="description-panel" id="profile-description"></div><div class="icon-row">${combatIcon('Weapon',l[0],l[1],'weapons',key)}${combatIcon('Gadget',l[2],l[3],'gadgets',key)}${combatIcon('Melee',l[5],l[6],'melee',key)}${combatIcon('Ultimate',l[7],l[8],'ultimates',key,key==='Sparky'?'BigBoomRemote':null)}</div><div class="skins"><h3>Choose skin</h3><div class="skin-row">${skinButtons}</div></div>${combinedStatsTable(hero,weapon,gadget,l)}</div></div>`;
  showDescription('heroes',key,key);
  rememberDescription();
  $('#details-dialog').showModal();
}
function showArchive(type) {
  const list=type==='heroes'?data.characters:data[type];
  const used=type==='heroes'?Object.keys(loadouts):Object.values(loadouts).flatMap(l=>type==='weapons'?[l[0],l[4]]:[l[4]]).filter(Boolean);
  $('#archive-grid').innerHTML=list.filter(item=>!used.map(norm).includes(norm(item.name))).map(item=>card(item.name,true,type)).join('')||'<p class="empty">Nothing archived here.</p>';
  document.querySelectorAll('[data-archive]').forEach(button=>button.classList.toggle('active',button.dataset.archive===type));
}
render();
let imageTarget;
document.addEventListener('click',event=>{ const cardTarget=event.target.closest('.card'); if(cardTarget&&cardTarget.dataset.type==='hero')showHero(cardTarget.dataset.key); const skin=event.target.closest('.skin'); if(skin){$('#skin-preview-image').src=skinSource(skin.dataset.file);$('#selected-skin-name').textContent=skin.querySelector('span').textContent;} const heroSummary=event.target.closest('.hero-summary'); if(heroSummary){showDescription('heroes',heroSummary.dataset.hero,heroSummary.dataset.hero);rememberDescription();} const combat=event.target.closest('.combat-icon'); if(combat){showDescription(combat.dataset.descriptionCategory,combat.dataset.descriptionName,combat.dataset.descriptionHero);rememberDescription();} const toggle=event.target.closest('.description-toggle'); if(toggle){const panel=$('#profile-description');showDescription(panel.dataset.category,panel.dataset.name,panel.dataset.hero,toggle.dataset.full==='true');rememberDescription();} const artToggle=event.target.closest('.art-toggle'); if(artToggle){const detail=artToggle.closest('.hero-detail'),collapsed=detail.classList.toggle('art-collapsed');artToggle.setAttribute('aria-expanded',String(!collapsed));artToggle.textContent=collapsed?'Show artwork and selected skin':'Hide artwork and selected skin';} const assign=event.target.closest('.assign-image'); if(assign){imageTarget=assign;$('#image-picker').click();} if(event.target.matches('.close'))event.target.closest('dialog').close(); if(event.target.matches('dialog'))event.target.close(); });
document.addEventListener('mouseover',event=>{const combat=event.target.closest('.combat-icon');if(combat&&matchMedia('(hover:hover)').matches&&!combat.contains(event.relatedTarget))showDescription(combat.dataset.descriptionCategory,combat.dataset.descriptionName,combat.dataset.descriptionHero);});
document.addEventListener('mouseout',event=>{const combat=event.target.closest('.combat-icon');if(combat&&matchMedia('(hover:hover)').matches&&!combat.contains(event.relatedTarget)&&pinnedDescription)showDescription(pinnedDescription.category,pinnedDescription.name,pinnedDescription.hero,pinnedDescription.full);});
document.addEventListener('keydown',event=>{const card=event.target.closest('.card');if(card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();card.click();}});
$('#image-picker').onchange=event=>{ const file=event.target.files[0]; if(!file||!imageTarget)return; const reader=new FileReader(); reader.onload=()=>{customImages[imageTarget.dataset.imageId]=reader.result;localStorage.setItem('rangerRumbleImages',JSON.stringify(customImages));imageTarget.classList.remove('assign-image');imageTarget.querySelector('.icon-art').innerHTML=`<img src="${reader.result}" alt="${safe(imageTarget.dataset.imageLabel)}">`};reader.readAsDataURL(file); };
const themeButton=$('#theme-toggle');
function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('rangerRumbleTheme',theme);themeButton.textContent=theme==='dark'?'☀':'☾';themeButton.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');}
setTheme(localStorage.getItem('rangerRumbleTheme')||'dark');
themeButton.onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
