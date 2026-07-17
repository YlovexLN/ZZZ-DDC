import './style.css';
import {
    Achance, Bchance, ENTRY_NAMES, MAIN_ENTRY_CONFIG, MAIN_PROB_WEIGHTS, MAIN_ATTR_TO_SUB, CHARACTER_DATA
} from './data.js';
import { parseNumber, calculateCore } from './calculator.js';

let gameSelectedChar = null;

// ─── Tab Switching ──────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    b.classList.add('active');
    document.getElementById(`${b.dataset.mode}-panel`).classList.add('active');
    document.getElementById('result-area').style.display = 'none';
}));

// ─── Faction / Character rendering ──────────────────────────────
function renderFactionTabs() {
    const ct = document.getElementById('game-faction-tabs'); ct.innerHTML = '';
    CHARACTER_DATA.forEach((f, i) => {
        const tb = document.createElement('div'); tb.className = `faction-tab ${i===0?'active':''}`; tb.textContent = f.faction;
        tb.onclick = () => { ct.querySelectorAll('.faction-tab').forEach(x => x.classList.remove('active')); tb.classList.add('active'); renderCharacterGrid(i); };
        ct.appendChild(tb);
    });
}

function renderCharacterGrid(fi = 0) {
    const g = document.getElementById('game-character-grid'); g.innerHTML = '';
    CHARACTER_DATA[fi].roles.forEach(ch => {
        const cd = document.createElement('div'); cd.className = 'character-card';
        cd.innerHTML = `<img src="./${ch.image}" alt="${ch.name}" class="character-avatar" onerror="this.style.display='none'"><div class="character-name">${ch.name}</div>`;
        cd.onclick = () => {
            g.querySelectorAll('.character-card').forEach(c => c.classList.remove('active')); cd.classList.add('active');
            gameSelectedChar = ch;
            document.getElementById('game-alice-c6-option').style.display = ch.special === 'alice' ? 'flex' : 'none';
            document.getElementById('game-vivian-c4-option').style.display = ch.special === 'vivian' ? 'flex' : 'none';
            updateGameWeights(); onPositionChange();
        };
        g.appendChild(cd);
    });
}

// ─── Custom Stepper ────────────────────────────────────────────
window.stepperChange = function(btn, delta) {
    const input = btn.parentElement.querySelector('input');
    const min = parseInt(input.getAttribute('min') || '0');
    const max = parseInt(input.getAttribute('max') || '99');
    let val = parseInt(input.value) || 0;
    val = Math.max(min, Math.min(max, val + delta));
    input.value = val;
    const handler = input.getAttribute('onchange');
    if (handler) (new Function(handler)).call(input);
};

// ─── Game Mode ───────────────────────────────────────────────────
function getCurrentPositions() {
    return Array.from(document.querySelectorAll('#game-position-checkboxes input:checked')).map(cb => parseInt(cb.value));
}

function getSelectedMainForPos(pos) {
    const container = document.getElementById(`main-${pos}`);
    if (!container) return [];
    return Array.from(container.querySelectorAll('input:checked')).map(c => c.value);
}

function getBlockedSubIdxForPos(pos) {
    if (pos <= 3) return -1;
    const selected = getSelectedMainForPos(pos);
    if (selected.length === 1 && MAIN_ATTR_TO_SUB[selected[0]] !== undefined) return MAIN_ATTR_TO_SUB[selected[0]];
    return -1;
}

function getMaxScoreForPos(pos) {
    const weightInputs = document.querySelectorAll('.game-weight');
    const blockedIdx = getBlockedSubIdxForPos(pos);
    const weights = [];
    for (let i = 0; i < 10; i++) {
        if (i === blockedIdx) continue;
        const w = parseNumber(weightInputs[i]?.value) || 0;
        if (w > 0) weights.push(w);
    }
    weights.sort((a,b)=>b-a);
    if (weights.length === 0) return 0;
    const top4 = weights.slice(0,4);
    return top4[0]*6 + (top4[1]||0) + (top4[2]||0) + (top4[3]||0);
}

function updatePosScale(pos) {
    const input = document.getElementById(`scale-${pos}`); if (!input) return;
    if (pos <= 3) { input.value = (1/6).toFixed(15); return; }
    const selected = getSelectedMainForPos(pos);
    const probWeights = MAIN_PROB_WEIGHTS[pos];
    const totalWeight = Object.values(probWeights).reduce((a,b)=>a+b,0);
    let selectedWeight = selected.length === 0 ? totalWeight : selected.reduce((sum,name)=> sum + (probWeights[name]||0), 0);
    const scale = (1/6) * (selectedWeight / totalWeight);
    input.value = scale.toFixed(15);
}

window.calcPosScore = function calcPosScore(pos) {
    const checks = document.querySelectorAll(`.enhance-check-${pos}:checked`);
    const weightInputs = document.querySelectorAll('.game-weight');
    let score = 0;
    checks.forEach(cb => {
        const idx = parseInt(cb.dataset.idx);
        const w = parseNumber(weightInputs[idx]?.value);
        if (isNaN(w)) return;
        const times = parseInt(document.querySelector(`.enhance-times-${pos}[data-idx="${idx}"]`)?.value || 0);
        score += (times + 1) * w;
    });
    const maxScore = getMaxScoreForPos(pos);
    const percent = maxScore > 0 ? (score / maxScore * 100).toFixed(1) : 0;
    const el = document.getElementById(`score-percent-${pos}`);
    if (el) { el.textContent = percent + '分'; el.dataset.internalScore = score; }
};

function getPosGoal(pos) {
    const el = document.getElementById(`score-percent-${pos}`);
    return el && el.dataset.internalScore ? parseFloat(el.dataset.internalScore) : 0;
}

window.toggleGameDirect = function toggleGameDirect(pos) {
    const area = document.getElementById(`game-direct-area-${pos}`);
    area.style.display = document.getElementById(`game-direct-toggle-${pos}`).checked ? 'block' : 'none';
    if (document.getElementById(`game-direct-toggle-${pos}`).checked) buildGameDirectOptions(pos);
}

function buildGameDirectOptions(pos) {
    const container = document.getElementById(`game-direct-options-${pos}`);
    if (!container) return;
    const weightInputs = document.querySelectorAll('.game-weight');
    const blockedIdx = getBlockedSubIdxForPos(pos);
    container.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        if (i === blockedIdx) continue;
        const w = parseNumber(weightInputs[i]?.value) || 0;
        if (w > 0) {
            const label = document.createElement('label');
            label.className = 'main-entry-item';
            label.innerHTML = `<input type="checkbox" class="game-direct-check-${pos}" value="${i}" onchange="limitGameDirect(${pos}, this)"> ${ENTRY_NAMES[i]}`;
            container.appendChild(label);
        }
    }
}

window.limitGameDirect = function limitGameDirect(pos, cb) {
    const checked = document.querySelectorAll(`.game-direct-check-${pos}:checked`);
    if (checked.length > 2) cb.checked = false;
};

function getGameDirectTypes(pos) {
    if (!document.getElementById(`game-direct-toggle-${pos}`) || !document.getElementById(`game-direct-toggle-${pos}`).checked) return [];
    return Array.from(document.querySelectorAll(`.game-direct-check-${pos}:checked`)).map(cb => parseInt(cb.value));
}

function renderMainEntriesForPos(pos) {
    const ct = document.getElementById(`main-${pos}`); if (!ct) return;
    ct.innerHTML = '';
    (MAIN_ENTRY_CONFIG[pos] || []).forEach(n => {
        const it = document.createElement('label'); it.className = 'main-entry-item';
        it.innerHTML = `<input type="checkbox" value="${n}" onchange="onMainEntryChange(${pos})"> ${n}`;
        ct.appendChild(it);
    });
}

window.onMainEntryChange = function onMainEntryChange(pos) { updatePosScale(pos); buildPosEnhance(pos); buildGameDirectOptions(pos); };

function buildPosEnhance(pos) {
    const area = document.getElementById(`enhance-${pos}`); if (!area) return;
    const weightInputs = document.querySelectorAll('.game-weight');
    const blockedIdx = getBlockedSubIdxForPos(pos);
    area.innerHTML = '';
    for (let i = 0; i < weightInputs.length; i++) {
        if (i === blockedIdx) continue;
        const w = parseNumber(weightInputs[i].value);
        if (isNaN(w) || w <= 0) continue;
        const div = document.createElement('div'); div.className = 'enhance-row';
        div.innerHTML = `<label><input type="checkbox" class="enhance-check-${pos}" data-idx="${i}" onchange="calcPosScore(${pos})"> ${ENTRY_NAMES[i]}</label><span class="weight-label">权重:</span><span class="weight-value">${w}</span><div class="stepper"><button type="button" class="stepper-btn" onclick="stepperChange(this,-1)">-</button><input type="number" class="stepper-input enhance-times-${pos}" data-idx="${i}" min="0" max="5" value="0" onchange="calcPosScore(${pos})"><button type="button" class="stepper-btn" onclick="stepperChange(this,1)">+</button></div>`;
        area.appendChild(div);
    }
    calcPosScore(pos);
}

function collectEntryListForSingleMain(pos, mainName) {
    const rests = document.querySelectorAll('.game-rest');
    const weights = document.querySelectorAll('.game-weight');
    const list = [];
    const blockedIdx = (pos >= 4 && mainName && MAIN_ATTR_TO_SUB[mainName] !== undefined) ? MAIN_ATTR_TO_SUB[mainName] : -1;
    for (let i = 0; i < 10; i++) {
        let r = parseInt(rests[i].value) || 0;
        const w = parseNumber(weights[i].value) || 0;
        if (i === blockedIdx) r = 0;
        for (let j = 0; j < r; j++) list.push({ rest: 1, score: w, typeIndex: i });
    }
    return list;
}

window.updateGameWeights = function updateGameWeights() {
    const wi = document.querySelectorAll('.game-weight');
    const ri = document.querySelectorAll('.game-rest');
    let baseWeights = gameSelectedChar ? [...gameSelectedChar.weights] : new Array(10).fill(0);
    if (gameSelectedChar?.special === 'alice' && document.getElementById('game-alice-c6').checked) baseWeights[7] += 0.3;
    if (gameSelectedChar?.special === 'vivian' && document.getElementById('game-vivian-c4').checked) baseWeights[7] = 0.6;
    for (let i = 0; i < 10; i++) {
        if (wi[i]) { wi[i].value = baseWeights[i] === 0 ? '' : baseWeights[i]; wi[i].disabled = false; }
        if (ri[i]) { if (ri[i].disabled) { ri[i].disabled = false; ri[i].value = 1; } }
    }
    getCurrentPositions().forEach(pos => { updatePosScale(pos); buildGameDirectOptions(pos); });
};

window.onPositionChange = function onPositionChange() {
    const positions = getCurrentPositions();
    const configsDiv = document.getElementById('position-configs'); configsDiv.innerHTML = '';
    positions.forEach(pos => {
        const div = document.createElement('div'); div.className = 'pos-config';
        div.innerHTML = `<h4>${pos}号位配置</h4>`;
        if (pos >= 4) div.innerHTML += `<label>主词条选择：</label><div class="main-entry-grid" id="main-${pos}"></div>`;
        div.innerHTML += `<div class="special-option" style="margin:10px 0;padding:8px 10px;"><label style="position:relative;display:flex;align-items:center;cursor:pointer;padding-left:26px;user-select:none;"><input type="checkbox" id="game-direct-toggle-${pos}" onchange="toggleGameDirect(${pos})" style="position:absolute;opacity:0;width:0;height:0;"> 定向副词条</label></div>`;
        div.innerHTML += `<div id="game-direct-area-${pos}" style="display:none; margin-bottom:10px; padding:10px; background:#0a0a0a; border:1px solid #333; border-radius:8px;"><label style="display:block;margin-bottom:6px;font-size:0.85rem;color:#aaa;">选择定向副词条（最多2个）</label><div id="game-direct-options-${pos}" class="main-entry-grid"></div></div>`;
        div.innerHTML += `<label>当前驱动盘强化次数：</label><div id="enhance-${pos}"></div>`;
        div.innerHTML += `<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;margin-top:8px;background:rgba(255,69,0,0.06);border:1px solid rgba(255,69,0,0.15);border-radius:6px;"><span style="font-size:0.85rem;color:#aaa;">当前驱动盘分数</span><span style="font-size:1.1rem;font-weight:700;color:#FF4500;" id="score-percent-${pos}">0分</span></div>`;
        div.innerHTML += `<small style="color:#666;display:block;margin-top:4px;">满分100分，为100倍当前驱动盘权重分数与驱动盘最大权重分数之比</small>`;
        div.innerHTML += `<label>缩放系数：<input type="text" id="scale-${pos}" readonly></label><small style="color:#888;">示例：随机抽得该位置概率1/6；4/6号位主词条仅1种可用输入1/36</small>`;
        configsDiv.appendChild(div);
    });
    positions.forEach(pos => { if (pos >= 4) renderMainEntriesForPos(pos); updatePosScale(pos); buildGameDirectOptions(pos); });
    updateGameWeights();
    positions.forEach(pos => buildPosEnhance(pos));
};

window.calculateGame = function calculateGame() {
    const positions = getCurrentPositions();
    if (positions.length === 0) { alert('请至少选择一个号位'); return; }
    let totalRandom = 0;
    const perPosResults = [];
    let sumA = 0, sumB = 0, countResults = 0;

    positions.forEach(pos => {
        const goal = getPosGoal(pos);
        let mainList = [];
        if (pos <= 3) mainList = [null];
        else {
            const selected = getSelectedMainForPos(pos);
            mainList = selected.length > 0 ? selected : [...MAIN_ENTRY_CONFIG[pos]];
        }
        const probWeights = pos >= 4 ? MAIN_PROB_WEIGHTS[pos] : null;
        const totalWeight = probWeights ? Object.values(probWeights).reduce((a,b)=>a+b,0) : 1;
        let posRandom = 0, posDirected = 0;
        const directedTypes = getGameDirectTypes(pos);
        mainList.forEach(main => {
            const entryList = collectEntryListForSingleMain(pos, main);
            if (entryList.length < 4) {
                alert(`${pos}号位（主词条：${main||'无'}）词条库存不足4`);
                return;
            }
            let scaleFactor;
            if (pos <= 3) scaleFactor = 1/6;
            else {
                const weight = probWeights[main] || 0;
                scaleFactor = (1/6) * (weight / totalWeight);
            }
            const result = calculateCore(entryList, goal, scaleFactor, directedTypes);
            const directedContrib = pos >= 4 ? result.chance / 6 : result.chance;
            posRandom += result.scaledChance;
            posDirected += directedContrib;
            sumA += result.mchanceA;
            sumB += result.mchanceB;
            countResults++;
        });
        let directedMain = null;
        if (pos >= 4 && mainList.length > 0 && mainList[0] !== null) {
            const generic46 = ["攻击力百分比","生命值百分比","防御力百分比","暴击率","暴击伤害"];
            const generic5 = ["攻击力百分比","生命值百分比","防御力百分比"];
            const selectedMains = mainList;
            if (pos === 4 || pos === 6) {
                if (selectedMains.length === 1 || !selectedMains.some(m => generic46.includes(m))) {
                    directedMain = posDirected * 6 / selectedMains.length;
                }
            } else if (pos === 5) {
                if (selectedMains.length === 1 || !selectedMains.some(m => generic5.includes(m))) {
                    directedMain = posDirected * 10 / selectedMains.length;
                }
            }
        }
        let gradeText = null, gradeColor = 'white';
        if (pos <= 3) {
            if (posDirected <= 0.003) { gradeText = '完美毕业'; gradeColor = 'red'; }
            else if (posDirected <= 0.033) { gradeText = '大毕业'; gradeColor = 'gold'; }
            else if (posDirected < 0.064) { gradeText = '小毕业'; gradeColor = 'purple'; }
            else if (posDirected < 0.12) { gradeText = '能用'; gradeColor = 'blue'; }
            else { gradeText = '可提升空间极大'; gradeColor = 'white'; }
        } else if (directedMain !== null) {
            if (directedMain <= 0.08) { gradeText = '完美毕业'; gradeColor = 'red'; }
            else if (directedMain <= 0.17) { gradeText = '大毕业'; gradeColor = 'gold'; }
            else if (directedMain < 0.24) { gradeText = '小毕业'; gradeColor = 'purple'; }
            else if (directedMain < 0.48) { gradeText = '能用'; gradeColor = 'blue'; }
            else { gradeText = '可提升空间极大'; gradeColor = 'white'; }
        }
        perPosResults.push({ pos, random: posRandom, directed: posDirected, directedMain, gradeText, gradeColor });
        totalRandom += posRandom;
    });

    const avgA = countResults > 0 ? sumA / countResults : null;
    const avgB = countResults > 0 ? sumB / countResults : null;

    document.getElementById('per-position-results').innerHTML = perPosResults.map(r => {
        let line = `${r.pos}号位：随机 ${(r.random*100).toFixed(4)}% 定向位置 ${(r.directed*100).toFixed(4)}%`;
        if (r.directedMain !== null) line += ` 定向主词条 ${(r.directedMain*100).toFixed(4)}%`;
        if (r.gradeText) line += ` 当前驱动盘练度评价：<span style="color:${r.gradeColor};font-weight:bold;">${r.gradeText}</span>`;
        return `<div>${line}</div>`;
    }).join('');
    document.getElementById('res-a').textContent = `初始四词条驱动盘强化后练度提升概率：${avgA !== null ? (avgA*100).toFixed(15) : '--'}%`;
    document.getElementById('res-b').textContent = `初始三词条驱动盘强化后练度提升概率：${avgB !== null ? (avgB*100).toFixed(15) : '--'}%`;
    document.getElementById('res-random').textContent = `随机抽取综合练度提升概率：${(totalRandom*100).toFixed(15)}%`;
    document.getElementById('result-area').style.display = 'block';
};

// ─── Advanced Custom Mode ────────────────────────────────────────
window.generateAdvancedEntries = function generateAdvancedEntries() {
    const cnt = parseInt(document.getElementById('entry-count').value) || 10;
    const ct = document.getElementById('advanced-entries'); ct.innerHTML = '';
    for (let i = 0; i < cnt; i++) {
        const d = document.createElement('div'); d.className = 'entry-grid';
        d.innerHTML = `<div class="entry-item"><label>词条${i+1}名称</label><div class="entry-name-container"><input type="text" class="adv-name" value="词条${i+1}"></div></div><div class="entry-item"><label>库存</label><div class="stepper"><button type="button" class="stepper-btn" onclick="stepperChange(this,-1)">-</button><input type="number" class="stepper-input adv-rest" min="1" value="1"><button type="button" class="stepper-btn" onclick="stepperChange(this,1)">+</button></div></div><div class="entry-item"><label>权重</label><input type="text" class="game-weight adv-score" placeholder="整数/小数/分数"></div>`;
        ct.appendChild(d);
    }
    buildCustomDirectOptions();
};

window.toggleCustomDirect = function toggleCustomDirect() {
    document.getElementById('custom-direct-area').style.display = document.getElementById('custom-direct-toggle').checked ? 'block' : 'none';
    if (document.getElementById('custom-direct-toggle').checked) buildCustomDirectOptions();
};

function buildCustomDirectOptions() {
    const container = document.getElementById('custom-direct-options');
    if (!container) return;
    const names = document.querySelectorAll('.adv-name');
    container.innerHTML = '';
    names.forEach((inp, idx) => {
        const label = document.createElement('label');
        label.className = 'main-entry-item';
        label.innerHTML = `<input type="checkbox" value="${idx}"> ${inp.value}`;
        container.appendChild(label);
    });
}

window.calculateAdvanced = function calculateAdvanced() {
    const ns = document.querySelectorAll('.adv-name'), rs = document.querySelectorAll('.adv-rest'), ss = document.querySelectorAll('.adv-score');
    if (ns.length === 0) { alert('请先生成词条输入'); return; }
    const el = []; let tr = 0;
    for (let i = 0; i < ns.length; i++) {
        const r = parseInt(rs[i].value), s = parseNumber(ss[i].value);
        if (isNaN(r) || r < 1) { alert(`词条${i+1}库存必须是正整数`); return; }
        if (isNaN(s)) { alert(`词条${i+1}权重格式不正确`); return; }
        el.push({ rest: r, score: s }); tr += r;
    }
    if (tr < 4) { alert('总词条库存不足4'); return; }
    const g = parseNumber(document.getElementById('advanced-goal').value);
    const sc = parseNumber(document.getElementById('advanced-scale').value);
    if (isNaN(g)) { alert('目标分数格式不正确'); return; }
    if (isNaN(sc)) { alert('缩放系数格式不正确'); return; }
    let directedTypes = [];
    if (document.getElementById('custom-direct-toggle').checked) {
        directedTypes = Array.from(document.querySelectorAll('#custom-direct-options input:checked')).map(cb => parseInt(cb.value));
    }
    showResult(calculateCore(el, g, sc, directedTypes));
};

// ─── Shared result display ──────────────────────────────────────
function showResult(r) {
    document.getElementById('res-a').textContent = `初始四词条驱动盘强化后练度提升概率：${(r.mchanceA*100).toFixed(15)}%`;
    document.getElementById('res-b').textContent = `初始三词条驱动盘强化后练度提升概率：${(r.mchanceB*100).toFixed(15)}%`;
    document.getElementById('res-random').textContent = `乘以缩放系数后提升率：${(r.scaledChance*100).toFixed(15)}%`;
    document.getElementById('result-area').style.display = 'block';
}

// ─── Initialize Game entries ────────────────────────────────────
function initGameEntries() {
    const ct = document.getElementById('game-entries'); ct.innerHTML = '';
    ENTRY_NAMES.forEach(n => {
        const d = document.createElement('div'); d.className = 'entry-grid';
        d.innerHTML = `<div class="entry-item"><label>词条名称</label><div class="entry-name-container"><input type="text" value="${n}" disabled></div></div><div class="entry-item"><label>库存</label><div class="stepper"><button type="button" class="stepper-btn" onclick="stepperChange(this,-1)">-</button><input type="number" class="stepper-input game-rest" min="0" value="1"><button type="button" class="stepper-btn" onclick="stepperChange(this,1)">+</button></div></div><div class="entry-item"><label>权重</label><input type="text" class="game-weight" placeholder="整数/小数/分数"></div>`;
        ct.appendChild(d);
    });
    document.querySelectorAll('.game-weight').forEach(inp => inp.addEventListener('input', () => { getCurrentPositions().forEach(pos => { buildPosEnhance(pos); buildGameDirectOptions(pos); }); }));
}

// ─── Boot ────────────────────────────────────────────────────────
window.onload = () => {
    generateAdvancedEntries();
    renderFactionTabs();
    renderCharacterGrid(0);
    initGameEntries();
    onPositionChange();
};
