const raw = window.RUMBLE_DATA;
const guide = window.RANGER_GUIDE;
const guideVersion = document.querySelector('meta[name="app-version"]')?.content || 'dev';
const $ = s => document.querySelector(s);
const base = 'images';
const assetVersion = guideVersion;
const assetUrl = path => `${base}/${path}?v=${encodeURIComponent(assetVersion)}`;
const seasonAssetUrl = path => assetUrl(`season_pass/${path}`);
const files = {
  weapons: ['BlackholeStorm','Blaster','Blitzgun','Buzzblades','ColdSnap','Cryoshot','Headhunter','LavaGun','PlasmaStriker','Pyrocitor','ScorpionFlail','Shatterbomb','SuckCannon','TeslaClaw','TheEnforcer','ToxicSplatter','Warmonger'],
  gadgets: ['AmoeboidLauncher','Bombardier','Cryoslider','DrillDash','GloveOfDoom','HoloshieldGlove','HoverBoots','MineLauncher','VoidRepulser','VoltageDrop','WhirlingBlades','WrenchThrow'],
  melee: ['AnnMelee','CelesteMelee','ChipMelee','FuseMelee','GrimshotMelee','LumpMelee','MarkusMelee','MopzMelee','RatchetMelee','SprocketMelee','WidgetMelee','ZedMelee'],
  ultimates: ['BigBoom','BigBoomRemote','Cannonball','Evolution','Hoverboard','MegaStrike','Negatron','Ryno','Sheepinator','SmokeScreen','TankFormation','VortexWallop']
};
const heroClasses = Object.fromEntries(Object.entries(guide.heroes).map(([name, hero]) => [name, hero.className]));
const heroProfiles = Object.fromEntries(Object.entries(guide.heroes).map(([name, hero]) => [name, {speed: hero.speed, rarity: hero.rarity, color: hero.color, eventOnly: hero.eventOnly===true}]));
const loadouts = Object.fromEntries(Object.entries(guide.heroes).map(([name, hero]) => [name, hero.loadout]));
const norm = value => String(value).replace(/[^a-z0-9]/gi,'').toLowerCase();
const safe = value => { const e=document.createElement('span'); e.textContent=value; return e.innerHTML; };
const displayHeroName = value => value==="Lil'Ann"?"Lil' Ann":value;
const descriptionAliases = guide.descriptionAliases;
function descriptionEntry(category,name,hero='') { const source=window.RUMBLE_DESCRIPTIONS?.[category]||{}, lookup=category==='melee'?hero:(descriptionAliases[category]?.[name]||name), key=Object.keys(source).find(entry=>norm(entry)===norm(lookup)); return key?source[key]:null; }
let heroDescriptionHeight=0;
function showDescription(category,name,hero='',full=false) { const panel=$('#profile-description'); if(!panel)return; const label={heroes:'Hero',weapons:'Weapon',gadgets:'Gadget',melee:'Melee',ultimates:'Ultimate'}[category]||category,entry=descriptionEntry(category,name,hero),displayName=category==='heroes'?displayHeroName(name):name; panel.dataset.category=category;panel.dataset.name=name;panel.dataset.hero=hero;panel.dataset.full=String(full); const copy=(entry?(full&&entry.full?entry.full:entry.short):'No description is available yet.').replace(/<br\s*\/?\s*>/gi,'').trim(); const toggle=entry?.full&&entry.full!==entry.short?`<button class="description-toggle" type="button" data-full="${full?'false':'true'}">${full?'Show short description':'Read full description'}</button>`:''; panel.innerHTML=`<span class="type">${safe(label)}</span><h3>${safe(displayName)}</h3><p>${safe(copy)}</p>${toggle}`; panel.style.minHeight='0';panel.style.height=full?`${measureDescriptionHeight(panel)}px`:heroDescriptionHeight?`${heroDescriptionHeight}px`:'auto';panel.style.overflow=full?'visible':'auto'; }
let pinnedDescription=null;
let hoverRestoreTimer=null;
let pinnedSkin=null;
let currentHeroKey=null;
function rememberDescription(){const panel=$('#profile-description');if(panel)pinnedDescription={category:panel.dataset.category,name:panel.dataset.name,hero:panel.dataset.hero,full:panel.dataset.full==='true'};}
function previewDescription(category,name,hero){showDescription(category,name,hero);}
function measureDescriptionHeight(panel){const clone=panel.cloneNode(true),width=panel.getBoundingClientRect().width;clone.removeAttribute('id');Object.assign(clone.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',width:`${width}px`,height:'auto',minHeight:'0',overflow:'visible'});panel.parentElement.append(clone);const height=Math.ceil(clone.scrollHeight+2);clone.remove();return height;}
const trim = item => ({...item, levels:item.levels.filter(level => level.Level <= 10)});
const meleeSizeBySpeed = {Fast:'Small', Medium:'Medium', Slow:'Large'};
function trimHero(item) {
  const trimmed=trim(item),profile=heroProfiles[item.name],size=meleeSizeBySpeed[profile?.speed],values=guide.meleeDamage?.[size]?.[profile?.rarity];
  const widget=item.name==='Ratchet'?raw.characters.find(hero=>hero.name==='Widget'):null;
  const levels=trimmed.levels.map(level=>({...level,...(widget?{'Ult Damage':widget.levels.find(row=>row.Level===level.Level)?.['Ult Damage']}:{}),...(values?{'Melee Damage':values[level.Level-1]}:{})}));
  return {...trimmed,columns:values?[...(trimmed.columns||[]).filter(column=>column!=='Melee Damage'),'Melee Damage']:trimmed.columns,levels};
}
const data = {characters:[...raw.characters.filter(x=>x.name!=='Avatar').map(trimHero),{name:'FreezePoint',levels:[]}], weapons:[...raw.weapons.map(trim),{name:'Cryoshot',levels:[]},{name:'Toxic Splatter',levels:[]}], gadgets:raw.gadgets.map(trim)};
function icon(key, folder) { const found=files[folder]?.find(x=>norm(x)===norm(key)); return found ? assetUrl(`${folder}/${found}.png`) : null; }
function skinSource(file) { return assetUrl(`skins/${file.split('/').map(encodeURIComponent).join('/')}`); }
function heroDefaultSkin(key) { const folderSkins=(window.RANGER_SKINS||[]).filter(file=>file.startsWith(`${key}/`)&&!file.includes('/icons/')); return folderSkins.find(file=>file===`${key}/${key}.png`)||folderSkins[0]||`${key}/${key}.png`; }
function heroImage(key) { return skinSource(heroDefaultSkin(key)); }
const skinFrames=new Map(),skinFramePromises=new Map();
function loadSkinSize(file) { return new Promise(resolve=>{const image=new Image();image.onload=()=>resolve({file,width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>resolve({file,width:1,height:1});image.src=skinSource(file);}); }
function prepareSkinFrame(hero) {
  if (skinFrames.has(hero)) return Promise.resolve(skinFrames.get(hero));
  if (skinFramePromises.has(hero)) return skinFramePromises.get(hero);
  const skins = heroSkins(hero);
  if (!skins.length) {
    const emptyFrame = {scale: 1, sizes: new Map()};
    skinFrames.set(hero, emptyFrame);
    return Promise.resolve(emptyFrame);
  }
  const promise = Promise.all(skins.map(loadSkinSize)).then(sizes => {
    const validSizes = sizes.filter(size => size.width > 1 && size.height > 1);
    if (!validSizes.length) return {scale: 1, sizes: new Map()};
    const maxWidth = Math.max(...validSizes.map(size => size.width));
    const maxHeight = Math.max(...validSizes.map(size => size.height));
    const frame = {
      scale: Math.min(186 / maxWidth, 200 / maxHeight),
      sizes: new Map(validSizes.map(size => [size.file, size]))
    };
    skinFrames.set(hero, frame);
    return frame;
  }).finally(() => skinFramePromises.delete(hero));
  skinFramePromises.set(hero, promise);
  return promise;
}
function applySkinFrame(file,preview) { const hero=file.split('/')[0],apply=frame=>{if(preview.dataset.file!==file)return;const size=frame.sizes.get(file);if(!size)return;preview.style.width=`${size.width*frame.scale}px`;preview.style.height=`${size.height*frame.scale}px`;preview.style.visibility='visible';};const frame=skinFrames.get(hero);if(frame)apply(frame);else{preview.style.visibility='hidden';prepareSkinFrame(hero).then(apply);} }
function setSkinPreview(file,name) { const previews=document.querySelectorAll('[data-skin-preview]'); if(!previews.length)return; previews.forEach(preview=>{preview.dataset.file=file;preview.src=skinSource(file);applySkinFrame(file,preview);}); document.querySelectorAll('[data-selected-skin-name]').forEach(label=>label.textContent=name); }
function setActiveSkinButton(file) { document.querySelectorAll('.skin').forEach(button=>{const active=button.dataset.file===file;button.classList.toggle('is-selected',active);button.setAttribute('aria-pressed',String(active));}); }
function heroRender(key) { const file=key==="Lil'Ann"?'LilAnn':key; return assetUrl(`renders/${file}.png`); }
const renderPreloads=new Map();
function preloadHeroRender(key) { if(guide.heroes[key]?.render===false)return; const src=heroRender(key); if(renderPreloads.has(src))return; const image=new Image(); image.src=src; renderPreloads.set(src,image); }
function preloadAdjacentHeroRenders(key) { const index=heroOrder.indexOf(key); if(index<0)return; preloadHeroRender(heroOrder[(index-1+heroOrder.length)%heroOrder.length]); preloadHeroRender(heroOrder[(index+1)%heroOrder.length]); }
function heroPortrait(key) { if(guide.heroes[key]?.portrait===false)return heroImage(key); const internal={Tempest:'Markus',Zed:'ZedOne',"Lil'Ann":'LilAnn'}[key]||key; return assetUrl(`skins/icons/ico_miniPortrait_${internal}.png`); }
function find(items,key) { return items.find(item=>norm(item.name)===norm(key)); }
function card(key) {
  const l=loadouts[key], title=displayHeroName(key),profile=heroProfiles[key];
  const image=heroImage(key);
  const gadgetName=l?.[2];
  const subtitle=`${l[0]}, ${gadgetName}`;
  return `<button class="card rarity-${norm(profile.rarity)}${profile.eventOnly?' event-card':''}" type="button" style="--rarity:${profile.color}" data-key="${safe(key)}">${profile.eventOnly?'<span class="event-flag">Event only</span>':''}<span class="portrait"><img src="${image}" alt="${safe(title)}"></span><span class="card-body"><span class="card-meta"><span class="rarity-badge"><span class="rarity-label">${profile.rarity}</span></span><span class="type">${safe(heroClasses[key])}</span></span><span class="card-title">${safe(title)}</span><span class="card-subtitle">${safe(subtitle)}</span></span></button>`;
}
const heroOrder=guide.heroOrder;
function render() { $('#character-grid').innerHTML=heroOrder.map(key=>card(key)).join(''); }
function seasonRewardIcon(reward) {
  if (/Reebo \(Epic\)/i.test(reward)) return 'gadgetron_body_epic.png';
  if (/Reebo \(Rare\)/i.test(reward)) return 'gadgetron_body_rare.png';
  if (/Reebo \(Common\)/i.test(reward)) return 'gadgetron_body.png';
  if (/Hero Lorbs \(Common\)/i.test(reward)) return 'ico_Lorb_common.png';
  if (/Hero Lorbs \(Rare\)/i.test(reward)) return 'ico_Lorb_rare.png';
  if (/Hero Lorbs \(Epic\)/i.test(reward)) return 'ico_Lorb_epic.png';
  if (/Qredits/i.test(reward)) return 'ico_credit02.png';
  if (/Cores/i.test(reward)) return 'ico_core.png';
  if (/Skin: Raritanium Chip/i.test(reward)) return '../skins/Chip/Raritanium%20Chip.png';
  if (/Raritanium/i.test(reward)) return 'ico_Raritanium.png';
  if (/Fashionium/i.test(reward)) return 'ico_Fashionium.png';
  return null;
}
function seasonReward(reward) { const iconFile=seasonRewardIcon(reward),iconMarkup=iconFile?`<img src="${iconFile.startsWith('../')?assetUrl(iconFile.slice(3)):seasonAssetUrl(iconFile)}" alt="">`:''; return `<span class="season-reward${iconFile?'':' text-only'}">${iconMarkup}<span>${safe(reward)}</span></span>`; }
function renderSeasonPass() {
  const season=window.RANGER_SEASON,container=$('#season-pass-content');
  if (!season || !container) return;
  const rows=season.rewards.map(([tier,free,premium,xp])=>`<tr><th scope="row">${tier}</th><td>${seasonReward(free)}</td><td>${seasonReward(premium)}</td><td>${xp.toLocaleString()}</td></tr>`).join('');
  container.innerHTML=`<div class="season-intro"><div><span class="season-number">Season ${season.number}</span><p>Earn rewards on the Free track or unlock the Premium track for additional rewards.</p></div><div class="season-infinite"><img src="${seasonAssetUrl('gadgetron_body.png')}" alt=""><div><strong>Infinite Reebos</strong><span>Every tier after 60 rewards ${safe(season.infiniteReward)}.</span></div></div></div><details class="season-rewards"><summary>Show all 61 tier rewards</summary><div class="season-table-wrap"><table class="season-table"><caption>Season ${season.number} rewards for tiers 0–60</caption><thead><tr><th scope="col">Tier</th><th scope="col">Free reward</th><th scope="col">Premium reward</th><th scope="col">XP</th></tr></thead><tbody>${rows}</tbody></table></div></details>`;
}
function statLabel(column,mode) { let text=column.replace(/^\d+_/,'').replace(/_/g,' ').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/Aoe/gi,'AOE'); if(mode==='ultimate')text=text.replace(/^Ult\b/i,'Ultimate'); return text.split(/\s+/).map((word,index)=>/^(HP|AOE|RYNO)$/i.test(word)?word.toUpperCase():index?word.toLowerCase():word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(' '); }
function displayStatLabel(column,mode,itemName='',displayName='') {
  const item=norm(itemName),display=norm(displayName);
  if(column==='ReloadTime')return'Reload';
  if(item==='drilldash'){if(column==='Aoe Damage')return'Drill hit damage';if(column==='LastHitAoe Damage')return'Finisher damage';}
  if(item==='electricgrenade'&&/ElectricZone Damage/i.test(column))return'Zone damage';
  if(item==='electricgrenade'&&/ElectricZone Duration/i.test(column))return'Duration';
  if(item==='littlespin'){if(column==='AoeA Damage')return'First hit damage';if(column==='AoeB Damage')return'Second hit damage';}
  if((item==='buzzblades'||item==='bombardier')&&column==='Damage')return'Damage per hit';
  if(mode==='ultimate'&&display==='ryno'&&column==='Ult Damage')return'Missile damage';
  if(mode==='ultimate'&&display==='ryno'&&column==='Projectile Time')return'Fire rate';
  return column==='Agent Explosion Damage'?'Damage':statLabel(column,mode);
}
function statHeader(label,heroName) { return label==='Overhealth'&&heroName==='Lump'?'Over-<br>health':safe(label); }
function statValue(column,value,itemName='') { const formatted=Number.isInteger(value)?value.toLocaleString():safe(value); if(norm(itemName)==='ratchetburstpistol'&&column==='Damage')return`${formatted} × 2`; return /Agent Lifetime|Reload\s*Time|Cooldown/i.test(column)?`${formatted}s`:formatted; }
function statIcon(label) { const text=label.toLowerCase(); let file='',ext='png'; if(/ricochet/.test(text)){file='ricochet';ext='svg'}else if(/missiles|(?:drones|discs) per use/.test(text)){file='payload';ext='svg'}else if(/lifetime|duration/.test(text)){file='duration';ext='svg'}else if(/max ammo|\bammo\b/.test(text)){file='ammo';ext='svg'}else if(/\brange\b/.test(text)){file='range';ext='svg'}else if(/fire rate/.test(text)){file='fire-rate';ext='svg'}else if(/\bhp\b|health/.test(text))file='health';else if(/damage/.test(text))file='damage';else if(/reload|cooldown/.test(text))file='cooldown';else if(/speed/.test(text))file='speed'; return file?`<img class="stat-ui-icon" src="${assetUrl(`UI%20icons/ico_stats_${file}.${ext}`)}" alt="">`:''; }
function statCandidates(item,mode='normal') {
  if(!item?.levels?.length || item.name==='Amoeboid Launcher') return [];
  const all=[...new Set(item.levels.flatMap(level=>Object.keys(level)))].filter(column=>column!=='Level'&&!/Power/i.test(column)&&!/Mod\s*Damage/i.test(column));
  if(mode==='hero') return all.filter(column=>!/^Ult /i.test(column)&&!/^Tank /i.test(column)&&!/^(Projectile Time|Missiles)$/i.test(column));
  if(mode==='ultimate') {
    if(item.name==='Zed') return all.filter(column=>/^Tank /i.test(column));
    if(item.name==='Widget'||item.name==='Ratchet') return all.filter(column=>/^(Ult |Projectile Time|Missiles)/i.test(column)&&!/Fire Rate/i.test(column));
    return all.filter(column=>/^Ult /i.test(column)&&!/Fire Rate/i.test(column));
  }
  return all;
}
function combinedStatsTable(hero,weapon,gadget,loadout) {
  const groups=[{label:'Hero',displayName:hero.name,item:hero,mode:'hero'},{label:'Weapon',displayName:loadout[0],item:weapon,mode:'normal'},{label:'Gadget',displayName:loadout[2],item:gadget,mode:'normal'},{label:'Ultimate',displayName:loadout[7],item:hero,mode:'ultimate'}].map(group=>{
    const hidden={gloveofdoom:/^More Agent Drones$/i,amoeboidlauncher:/^(AcidZone Damage|AcidZone Duration)$/i,ratchetburstpistol:/^Projectiles$/i}[norm(group.item?.name)];
    const candidates=statCandidates(group.item,group.mode).filter(column=>!(group.label==='Gadget'&&/^Charges$/i.test(column))&&!hidden?.test(column)),fixed=candidates.filter(column=>group.item.levels.every(row=>row[column]===group.item.levels[0][column])),id=`stats-${norm(group.label)}`;
    return {...group,id,fixed,columns:candidates.filter(column=>!fixed.includes(column)).map((key,index)=>({key,id:`${id}-${index}`}))};
  });
  const fixedGroups=groups.filter(group=>group.fixed.length),visible=groups.filter(group=>group.columns.length);
  const stackedFixed=hero.name==='Ratchet'&&fixedGroups.map(group=>group.label).join(',')==='Weapon,Gadget,Ultimate';
  const fixedMarkup=fixedGroups.length?`<div class="combined-fixed${stackedFixed?' fixed-stacked':''}">${fixedGroups.map(group=>{const amoeboid=norm(group.item?.name)==='amoeboidlauncher',isBlackholeStorm=group.label==='Weapon'&&norm(group.item?.name)==='blackholestorm',lifetimeColumns=['Small Lifetime','Medium Lifetime','Large Lifetime'],columns=amoeboid?group.fixed.filter(column=>!lifetimeColumns.includes(column)):group.fixed,lifetime=amoeboid?`<div class="fixed-stat lifetime-stat"><dt>${statIcon('Lifetime')}<span>Lifetime</span></dt><dd>${lifetimeColumns.map((column,index)=>`<span><b>${['Small','Medium','Large'][index]}</b><strong>${group.item.levels[0][column]}s</strong></span>`).join('')}</dd></div>`:'',stagedFireRate=isBlackholeStorm?`<div class="fixed-stat staged-fire-rate"><dt>${statIcon('Fire rate')}<span>Fire rate</span></dt><dd><span>1×</span><i>→</i><span>3× <small>at 1.3s</small></span><i>→</i><span>5× <small>at 3s</small></span></dd></div>`:'';return`<dl class="fixed-group${isBlackholeStorm?' blackhole-storm':''}"><div class="fixed-group-title">${safe(group.label)}: ${safe(group.displayName)}</div>${columns.map(column=>{const label=displayStatLabel(column,group.mode,group.item?.name,group.displayName);return`<div class="fixed-stat"><dt>${statIcon(label)}<span>${safe(label)}</span></dt><dd>${statValue(column,group.item.levels[0][column],group.item?.name)}</dd></div>`}).join('')}${stagedFireRate}${lifetime}</dl>`}).join('')}</div>`:'';
  const isAmoeboid=group=>norm(group.item?.name)==='amoeboidlauncher';
  const headGroups=visible.map(group=>`<th id="${group.id}" scope="colgroup" colspan="${isAmoeboid(group)?3:group.columns.length}">${safe(group.label)}: ${safe(group.displayName)}${isAmoeboid(group)?'<span class="stats-gadget-toggle" role="group" aria-label="Show Amoeboid Launcher statistic"><button type="button" class="is-active" data-gadget-stat="damage" aria-pressed="true">Damage</button><button type="button" data-gadget-stat="hp" aria-pressed="false">HP</button></span>':''}</th>`).join('');
  const nested=false;
  const headColumns=visible.map(group=>{if(isAmoeboid(group))return['Small','Medium','Large'].map((label,index)=>`<th id="${group.id}-${label.toLowerCase()}" class="${index===0?'group-start':''}" scope="col"><span class="column-label">${label}</span></th>`).join('');return group.columns.map((column,index)=>{const label=displayStatLabel(column.key,group.mode,group.item?.name,group.displayName).replace(new RegExp(`^${group.label} `,'i'),'').replace(/^Tank /i,'');return`<th id="${column.id}" class="${index===0?'group-start':''}" scope="col"><span class="column-label">${statHeader(label,hero.name)}</span></th>`}).join('')}).join('');
  const rows=hero.levels.map(row=>{const rowId=`stats-level-${row.Level}`,cells=visible.flatMap(group=>{const matchingLevel=group.item.levels.find(level=>level.Level===row.Level);if(isAmoeboid(group))return [0,1,2].map(index=>{const damage=group.columns[index],hp=group.columns[index+3],damageValue=matchingLevel?.[damage.key]??'—',hpValue=matchingLevel?.[hp.key]??'—';return`<td class="gadget-pair" headers="${rowId} ${group.id} ${group.id}-${['small','medium','large'][index]}"><span class="gadget-stat gadget-damage">${statValue(damage.key,damageValue,group.item?.name)}</span><span class="gadget-stat gadget-hp">${statValue(hp.key,hpValue,group.item?.name)}</span></td>`});return group.columns.map(column=>{const value=matchingLevel?.[column.key]??'—';return`<td headers="${rowId} ${group.id} ${column.id}">${statValue(column.key,value,group.item?.name)}</td>`})}).join('');return`<tr><th id="${rowId}" scope="row">LV ${row.Level}</th>${cells}</tr>`}).join('');
  return `<section class="combined-stats" id="combat-stats"><h3>Combat stats</h3>${fixedMarkup}<div class="combined-table"><table class="stats gadget-stat-damage"><caption>Level 1–10 combat statistics for ${safe(hero.name)}</caption><thead><tr><th rowspan="2" scope="col">Level</th>${headGroups}</tr><tr>${headColumns}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
}
function modTable(mod) {
  if(!mod.columns?.length || !mod.levels?.length)return '';
  const headers=mod.columns.map(column=>`<th scope="col">${safe(column)}</th>`).join('');
  const rows=mod.levels.map((values,index)=>`<tr><th scope="row">LV ${index+1}</th>${values.map(value=>`<td>${safe(value)}</td>`).join('')}</tr>`).join('');
  return `<div class="mod-table-wrap"><table class="mod-table"><caption>Level 1–10 statistics for ${safe(mod.name)}</caption><thead><tr><th scope="col">Level</th>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
function modsSection(heroKey) {
  const mods=window.RANGER_MODS?.[heroKey]||[];
  if(!mods.length)return '';
  const requirements=[{level:3,cores:1},{level:6,cores:3}];
  const cards=mods.map((mod,index)=>{const requirement=requirements[index]||requirements.at(-1),prerequisite=index?'<span class="talent-prerequisite">Requires previous talent</span>':'';return`<article class="mod-card"><header><img src="${assetUrl(`talents/${encodeURIComponent(mod.icon)}`)}" alt=""><div><span>Hero talent</span><h4>${safe(mod.name)}</h4></div></header><div class="talent-requirements"><span>Unlocks at Lv ${requirement.level}</span><span>${requirement.cores} ${requirement.cores===1?'core':'cores'}</span>${prerequisite}</div><p class="mod-menu">${safe(mod.menu)}</p><p class="mod-effect">${safe(mod.effect)}</p>${mod.note?`<p class="mod-note">${safe(mod.note)}</p>`:''}${modTable(mod)}</article>`}).join('');
  return `<section class="mods-section" id="talents"><h3>Talents</h3><div class="mod-grid">${cards}</div></section>`;
}
function combatIcon(type,name,key,folder,hero,extraKey=null) { const source=key&&icon(key,folder),extra=extraKey&&icon(extraKey,folder),category=type.toLowerCase()==='weapon'?'weapons':type.toLowerCase()==='gadget'?'gadgets':type.toLowerCase()==='melee'?'melee':'ultimates'; return `<button class="combat-icon ${extra?'dual':''} ${source?'':'image-missing'}" data-description-category="${category}" data-description-name="${safe(name)}" data-description-hero="${safe(hero)}">${`<b class="icon-type">${safe(type)}</b>`}<span class="icon-art">${source?`<img src="${source}" alt="${safe(name)}">`:'<i aria-hidden="true">?</i>'}${extra?`<img src="${extra}" alt="${safe(name)} remote">`:''}</span><small>${safe(name)}</small></button>`; }
function heroSkins(key) { const def=`${key}/${key}.png`,used=(window.RANGER_USED_SKINS?.[key]||[]).map(norm); return (window.RANGER_SKINS||[]).filter(file=>file.startsWith(`${key}/`)&&used.includes(norm(file.split('/').at(-1).replace(/\.png$/i,'')))).sort((a,b)=>a===def?-1:b===def?1:a.localeCompare(b)); }
function skinRarity(file) { return window.RANGER_SKIN_RARITIES?.[file] || ''; }
function skinName(file,key) { const result=file.split('/').at(-1).replace(/\.png$/i,''); return result===key?'Default':result.replace(new RegExp(` ${key}$`),''); }
function navigateHero(direction){const index=heroOrder.indexOf(currentHeroKey),next=(index+direction+heroOrder.length)%heroOrder.length;showHero(heroOrder[next]);}
function positionHeroNavigation(){const dialog=$('#details-dialog');if(!dialog.open)return;const rect=dialog.getBoundingClientRect(),arrowWidth=44,narrow=innerWidth<=760;dialog.style.setProperty('--hero-nav-top',`${rect.top+rect.height/2}px`);dialog.style.setProperty('--hero-nav-left',`${narrow?rect.left+4:rect.left-arrowWidth+1}px`);dialog.style.setProperty('--hero-nav-right',`${narrow?innerWidth-rect.right+4:innerWidth-rect.right-arrowWidth+1}px`);dialog.style.setProperty('--detail-toc-top',`${rect.top+82}px`);dialog.style.setProperty('--detail-toc-right',`${Math.max(8,innerWidth-rect.right-158)}px`);dialog.style.setProperty('--detail-toc-mobile-left',`${rect.left+16}px`);dialog.style.setProperty('--detail-toc-mobile-bottom',`${innerHeight-rect.bottom+10}px`);dialog.style.setProperty('--detail-toc-mobile-width',`${rect.width-32}px`);}
function updateDetailToc(){const body=$('.detail-body');if(!body)return;const targets=[...document.querySelectorAll('[data-toc-target]')],bodyTop=body.getBoundingClientRect().top+80;let active=targets[0];for(const button of targets){const section=document.getElementById(button.dataset.tocTarget);if(section&&section.getBoundingClientRect().top<=bodyTop)active=button;}if(body.scrollTop+body.clientHeight>=body.scrollHeight-2)active=targets.at(-1);targets.forEach(button=>button.classList.toggle('is-active',button===active));}
function revealDescription(){if(!matchMedia('(max-width:760px)').matches)return;requestAnimationFrame(()=>{const panel=$('#profile-description'),scroller=panel?.closest('.hero-detail');if(!panel||!scroller)return;const delta=panel.getBoundingClientRect().top-scroller.getBoundingClientRect().top;scroller.scrollTo({top:Math.max(0,scroller.scrollTop+delta-12),behavior:'smooth'});});}
function showHero(key) {
  currentHeroKey=key;
  preloadAdjacentHeroRenders(key);
  prepareSkinFrame(key);
  const l=loadouts[key],config=guide.heroes[key],hero=find(data.characters,key),weapon=find(data.weapons,config.weaponStats||l[0]),profile=heroProfiles[key];
  const gadget=find(data.gadgets,l[4])||find(data.weapons,l[4]);
  const skinButtons=heroSkins(key).map(file=>{const rarity=skinRarity(file),name=skinName(file,key);return `<button class="skin${rarity?` rarity-${rarity.toLowerCase()}`:''}" data-file="${safe(file)}"><img src="${skinSource(file)}" alt="${safe(name)}${rarity?` (${rarity})`:''}"><span>${safe(name)}${rarity?` <em>(${rarity})</em>`:''}</span></button>`;}).join('');
  const hasSkinMenu=heroSkins(key).length>1,collapsed=matchMedia('(max-width:760px)').matches?' art-collapsed':'',renderMarkup=config.render===false?'':`<img id="hero-art" src="${heroRender(key)}" alt="${safe(displayHeroName(key))} render">`,skinToc=hasSkinMenu?'<button type="button" data-toc-target="skins">Skins</button>':'',skinMenu=hasSkinMenu?`<div class="skins" id="skins"><h3>Choose skin</h3><div class="mobile-skin-preview"><img data-skin-preview src="${heroImage(key)}" alt="${safe(displayHeroName(key))} selected skin"><span data-selected-skin-name>Default</span></div><div class="skin-row">${skinButtons}</div></div>`:'';
  $('#dialog-content').innerHTML=`<nav class="detail-toc" aria-label="Hero details sections"><span>On this page</span><button class="is-active" type="button" data-toc-target="overview">Overview</button><button type="button" data-toc-target="loadout">Loadout</button>${skinToc}<button type="button" data-toc-target="combat-stats">Combat stats</button><button type="button" data-toc-target="talents">Talents</button></nav><div class="hero-detail${collapsed}${config.render===false?' render-missing':''}" style="--rarity:${profile.color}"><div class="detail-art"><button class="art-toggle" type="button" aria-expanded="${collapsed?'false':'true'}">${collapsed?'Show artwork and selected skin':'Hide artwork and selected skin'}</button>${renderMarkup}<div class="selected-skin"><h3>Skin</h3><div class="selected-skin-stage"><img id="skin-preview-image" data-skin-preview src="${heroImage(key)}" alt="${safe(displayHeroName(key))} selected skin"></div><span id="selected-skin-name" data-selected-skin-name>Default</span></div></div><div class="detail-body"><button class="profile-title hero-summary" id="overview" type="button" data-hero="${safe(key)}"><img class="hero-portrait" src="${heroPortrait(key)}" alt=""><div><div class="profile-meta"><span class="rarity-badge"><span class="rarity-label">${profile.rarity}</span></span><span class="type">${safe(heroClasses[key])}</span><span class="speed-badge"><img src="${assetUrl('UI%20icons/ico_stats_speed.png')}" alt="">${profile.speed} speed</span></div><h2>${safe(displayHeroName(key))}</h2><small>Hero overview</small></div></button><div class="description-panel" id="profile-description"></div><div class="icon-row" id="loadout">${combatIcon('Weapon',l[0],l[1],'weapons',key)}${combatIcon('Gadget',l[2],l[3],'gadgets',key)}${combatIcon('Melee',l[5],l[6],'melee',key)}${combatIcon('Ultimate',l[7],l[8],'ultimates',key,key==='Sparky'?'BigBoomRemote':null)}</div>${skinMenu}${combinedStatsTable(hero,weapon,gadget,l)}${modsSection(key)}</div></div>`;
  const index=heroOrder.indexOf(key),previous=heroOrder[(index-1+heroOrder.length)%heroOrder.length],next=heroOrder[(index+1)%heroOrder.length];
  $('#dialog-content').insertAdjacentHTML('afterbegin',`<button class="hero-nav hero-nav-prev" type="button" data-hero-direction="-1" aria-label="Previous hero: ${safe(displayHeroName(previous))}" title="${safe(displayHeroName(previous))}"><span aria-hidden="true"></span></button><button class="hero-nav hero-nav-next" type="button" data-hero-direction="1" aria-label="Next hero: ${safe(displayHeroName(next))}" title="${safe(displayHeroName(next))}"><span aria-hidden="true"></span></button>`);
  pinnedSkin={file:heroDefaultSkin(key),name:'Default'};
  setSkinPreview(pinnedSkin.file,pinnedSkin.name);
  setActiveSkinButton(pinnedSkin.file);
  heroDescriptionHeight=0;
  showDescription('heroes',key,key);
  if(!$('#details-dialog').open)$('#details-dialog').showModal();
  requestAnimationFrame(positionHeroNavigation);
  document.body.classList.add('modal-open');
  heroDescriptionHeight=measureDescriptionHeight($('#profile-description'));
  if(config.descriptionHeightHero){
    showDescription('heroes',config.descriptionHeightHero,config.descriptionHeightHero);
    heroDescriptionHeight=Math.max(heroDescriptionHeight,measureDescriptionHeight($('#profile-description')));
    showDescription('heroes',key,key);
  }
  $('#profile-description').style.height=`${heroDescriptionHeight}px`;
  rememberDescription();
  $('.detail-body').addEventListener('scroll',updateDetailToc,{passive:true});
  updateDetailToc();
}
render();
renderSeasonPass();
document.addEventListener('click',event=>{ const gadgetStat=event.target.closest('[data-gadget-stat]'); if(gadgetStat){const table=gadgetStat.closest('.stats');if(table){const stat=gadgetStat.dataset.gadgetStat;table.classList.toggle('gadget-stat-damage',stat==='damage');table.classList.toggle('gadget-stat-hp',stat==='hp');gadgetStat.parentElement.querySelectorAll('[data-gadget-stat]').forEach(button=>{const active=button===gadgetStat;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});}return;} const cardTarget=event.target.closest('.card'); if(cardTarget)showHero(cardTarget.dataset.key); const toc=event.target.closest('[data-toc-target]');if(toc){document.getElementById(toc.dataset.tocTarget)?.scrollIntoView({behavior:'smooth',block:'start'});toc.focus();} const skin=event.target.closest('.skin'); if(skin){pinnedSkin={file:skin.dataset.file,name:skin.querySelector('span').textContent};setSkinPreview(pinnedSkin.file,pinnedSkin.name);setActiveSkinButton(skin.dataset.file);} const heroSummary=event.target.closest('.hero-summary'); if(heroSummary){showDescription('heroes',heroSummary.dataset.hero,heroSummary.dataset.hero);rememberDescription();revealDescription();} const combat=event.target.closest('.combat-icon'); if(combat){showDescription(combat.dataset.descriptionCategory,combat.dataset.descriptionName,combat.dataset.descriptionHero);rememberDescription();revealDescription();} const toggle=event.target.closest('.description-toggle'); if(toggle){const panel=$('#profile-description');showDescription(panel.dataset.category,panel.dataset.name,panel.dataset.hero,toggle.dataset.full==='true');rememberDescription();revealDescription();} const artToggle=event.target.closest('.art-toggle'); if(artToggle){const detail=artToggle.closest('.hero-detail'),collapsed=detail.classList.toggle('art-collapsed');artToggle.setAttribute('aria-expanded',String(!collapsed));artToggle.textContent=collapsed?'Show artwork and selected skin':'Hide artwork and selected skin';} if(event.target.matches('.close'))event.target.closest('dialog').close(); if(event.target.matches('dialog'))event.target.close(); });
document.addEventListener('mouseover',event=>{const combat=event.target.closest('.combat-icon');if(combat&&!combat.contains(event.relatedTarget)){clearTimeout(hoverRestoreTimer);hoverRestoreTimer=null;previewDescription(combat.dataset.descriptionCategory,combat.dataset.descriptionName,combat.dataset.descriptionHero);}});
document.addEventListener('mouseout',event=>{const combat=event.target.closest('.combat-icon');if(combat&&!combat.contains(event.relatedTarget)&&pinnedDescription){clearTimeout(hoverRestoreTimer);hoverRestoreTimer=setTimeout(()=>{showDescription(pinnedDescription.category,pinnedDescription.name,pinnedDescription.hero,pinnedDescription.full);hoverRestoreTimer=null;},350);}});
document.addEventListener('focusin',event=>{const combat=event.target.closest('.combat-icon');if(combat)previewDescription(combat.dataset.descriptionCategory,combat.dataset.descriptionName,combat.dataset.descriptionHero);});
document.addEventListener('focusout',event=>{const combat=event.target.closest('.combat-icon');if(combat&&pinnedDescription)showDescription(pinnedDescription.category,pinnedDescription.name,pinnedDescription.hero,pinnedDescription.full);});
document.addEventListener('mouseover',event=>{const skin=event.target.closest('.skin');if(skin&&!skin.contains(event.relatedTarget))setSkinPreview(skin.dataset.file,skin.querySelector('span').textContent);});
document.addEventListener('mouseout',event=>{const skin=event.target.closest('.skin');if(skin&&!skin.contains(event.relatedTarget)&&pinnedSkin)setSkinPreview(pinnedSkin.file,pinnedSkin.name);});
document.addEventListener('click',event=>{const nav=event.target.closest('[data-hero-direction]');if(nav)navigateHero(Number(nav.dataset.heroDirection));});
document.addEventListener('keydown',event=>{if(!$('#details-dialog').open)return;if(event.key==='ArrowLeft'){event.preventDefault();navigateHero(-1);}if(event.key==='ArrowRight'){event.preventDefault();navigateHero(1);}});
document.addEventListener('error',event=>{if(event.target instanceof HTMLImageElement){event.target.hidden=true;event.target.parentElement?.classList.add('image-missing');}},true);
const themeButton=$('#theme-toggle');
$('#details-dialog').addEventListener('close',()=>document.body.classList.remove('modal-open'));
addEventListener('resize',positionHeroNavigation);
function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('rangerRumbleTheme',theme);themeButton.textContent=theme==='dark'?'☀':'☾';themeButton.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');}
setTheme(localStorage.getItem('rangerRumbleTheme')||'dark');
themeButton.onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
