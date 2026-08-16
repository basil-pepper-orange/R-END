const $  = (id) => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const charById = (id) => CHARACTERS.find((c) => c.id === id);
const landById = (id) => LANDSCAPES.find((l) => l.id === id);
const enemyById = (id) => ENEMIES.find((e) => e.id === id);
const stars = (n, max = 4) =>
  `<span class="stars r${n}">${'★'.repeat(n)}${'☆'.repeat(max - n)}</span>`;

const comma = (n) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function toast(msg, ms) {
  const t = $('toast');
  t.classList.remove('is-hold');
  toastHeld = false;
  toastKey = '';
  t.textContent = msg;
  t.classList.remove('is-on');
  t.style.setProperty('--toast-ms', (ms || CONFIG.toastMs || 2200) + 'ms');
  void t.offsetWidth;
  t.classList.add('is-on');
}

let toastHeld = false;
let toastKey = '';
function toastHold(msg, key) {
  const t = $('toast');
  toastKey = (key == null ? '' : String(key));
  t.textContent = msg;
  t.classList.remove('is-on');
  void t.offsetWidth;
  t.classList.add('is-hold');
  toastHeld = true;
}
function toastHide() {
  const t = $('toast');
  if (!t) return;
  t.classList.remove('is-hold');
  t.classList.remove('is-on');
  toastHeld = false;
  toastKey = '';
}

['pointerup', 'pointercancel'].forEach((ev) => {
  document.addEventListener(ev, () => { if (toastHeld) toastHide(); }, true);
});

document.addEventListener('click', () => { if (toastHeld) toastHide(); }, false);

const SAVE_KEY = 'madaminu_save_v6';
const SAVE_BAK = 'madaminu_save_v6_bak';

let S = null;
let saveFailed = false;
let restoredFromBak = false;

function newSave() {
  const s = {
    v: 6,
    shards: CONFIG.startShards,
    chars: {},
    lands: {},
    party: [],
    reserve: null,
    playerName: '',
    records: [],
    cleared: {},
    met: {},
    taleSeen: [],
  };
  s.chars[CONFIG.startCharId] = { lv: 1, exp: 0, eq: null, rank: 1 };
  s.party = [CONFIG.startCharId];
  return s;
}

function readSave(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return (s && s.v === 6 && s.chars) ? s : null;
  } catch (e) {
    return null;
  }
}

function loadSave() {
  const main = readSave(SAVE_KEY);
  if (main) {

    try { localStorage.setItem(SAVE_BAK, localStorage.getItem(SAVE_KEY)); } catch (e) {}
    return main;
  }

  const bak = readSave(SAVE_BAK);
  if (bak) {
    restoredFromBak = true;
    console.warn('セーブが読めなかったので、ひかえから復帰しました');
    return bak;
  }
  return newSave();
}

function save() {
  try {

    const prev = localStorage.getItem(SAVE_KEY);
    S.savedAt = Date.now();
    const json = JSON.stringify(S);
    localStorage.setItem(SAVE_KEY, json);
    localStorage.setItem(SAVE_BAK, prev && prev.length > 20 ? prev : json);
    saveFailed = false;
  } catch (e) {

    if (!saveFailed) {
      saveFailed = true;
      toast('このブラウザでは進行を保存できません（プライベートモードかも）');
    }
  }
}

function askPersist() {
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persisted().then((ok) => { if (!ok) navigator.storage.persist().catch(() => {}); }).catch(() => {});
  }
}

const MEM_FMT = 2;

const MEM_FMT_MAX = 3;

function memRankBits(fmt) { return fmt >= 2 ? 5 : 4; }

const MEM_KANA = 'あいうえおかきくけこさしすせそたちつてとなにのはひふへほまみむめもやゆよらりるれんがぎぐげござじずぜぞだでどばびぶべぼぱぴぷぺぽ';
const MEM_MAX_SHARDS = 32767;

function BitOut() { this.bits = []; }
BitOut.prototype.put = function (v, n) {
  v = Math.max(0, Math.floor(v || 0));
  for (let i = n - 1; i >= 0; i--) this.bits.push((v >> i) & 1);
};
function BitIn(bits) { this.bits = bits; this.i = 0; }
BitIn.prototype.get = function (n) {
  let v = 0;
  for (let k = 0; k < n; k++) {
    if (this.i >= this.bits.length) throw new Error('合言葉が短すぎるようです');
    v = (v << 1) | this.bits[this.i++];
  }
  return v;
};

function memChecksum(bits) {
  let h = 0x811c;
  for (let i = 0; i < bits.length; i++) {
    h ^= (bits[i] << (i % 8));
    h = (h * 0x0193) & 0xffff;
  }
  return h & 0xfff;
}

function memNormalize(t) {
  let s = String(t || '');
  try { s = s.normalize('NFC'); } catch (e) {}
  s = s.replace(/[\s　ー－—\-_.,、。・|／/]/g, '');
  s = s.replace(/[ァ-ヶ]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60));
  const small = { 'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お', 'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ゎ': 'わ', 'ゕ': 'か', 'ゖ': 'け' };
  return s.replace(/[ぁぃぅぇぉっゃゅょゎゕゖ]/g, (m) => small[m]);
}

const MEM_REC_EPOCH = Date.UTC(2025, 0, 1);
const MEM_REC_MINUTES = (1 << 23) - 1;

function memPutRecord(o, rec) {
  if (!rec || !rec.p) { o.put(0, 1); return; }
  o.put(1, 1);
  const ei = ENEMIES_ALL.findIndex((e) => e.id === rec.e);
  o.put(ei < 0 ? 0 : ei, 4);
  o.put(clamp(rec.t | 0, 0, 255), 8);
  o.put(clamp(Math.round(((rec.d || 0) - MEM_REC_EPOCH) / 60000), 0, MEM_REC_MINUTES), 23);

  const slots = [rec.p[0], rec.p[1], rec.p[2], rec.r];
  slots.forEach((m) => {
    if (!m) { o.put(0, 1); return; }
    o.put(1, 1);
    const ci = CHARACTERS_ALL.findIndex((c) => c.id === m[0]);
    o.put(ci < 0 ? 0 : ci, 5);
    o.put(clamp((m[1] | 0) - 1, 0, 255), 8);
    o.put(clamp((m[2] | 0 || 1) - 1, 0, 31), 5);
    const li = m[3] ? LANDSCAPES.findIndex((l) => l.id === m[3]) : -1;
    o.put(li < 0 ? 0 : li + 1, 4);
    o.put(clamp(m[10] | 0, 0, 7), 3);
    o.put(clamp(m[4] | 0, 0, 262143), 18);
    o.put(clamp(m[9] | 0, 0, 131071), 17);
    o.put(clamp(m[5] | 0, 0, 63), 6);
    o.put(clamp(m[6] | 0, 0, 63), 6);
    o.put(clamp(m[7] | 0, 0, 63), 6);
    o.put(clamp(m[8] | 0, 0, 63), 6);
  });

  const lost = (rec.l || []).slice(0, 3);
  o.put(lost.length, 2);
  lost.forEach((cid) => {
    const ci = CHARACTERS_ALL.findIndex((c) => c.id === cid);
    o.put(ci < 0 ? 0 : ci, 5);
  });
}

function memGetRecord(r) {
  if (!r.get(1)) return null;
  const e = ENEMIES_ALL[r.get(4)];
  const t = r.get(8);
  const d = MEM_REC_EPOCH + r.get(23) * 60000;
  const take = () => {
    if (!r.get(1)) return null;
    const c = CHARACTERS_ALL[r.get(5)];
    const lv = r.get(8) + 1;
    const rk = r.get(5) + 1;
    const li = r.get(4);
    const lrk = r.get(3);
    const dmg = r.get(18);
    const taken = r.get(17);
    const a1 = r.get(6), a2 = r.get(6), a3 = r.get(6), a4 = r.get(6);
    if (!c) return null;
    const land = li > 0 && LANDSCAPES[li - 1] ? LANDSCAPES[li - 1].id : '';
    return [c.id, lv, rk, land, dmg, a1, a2, a3, a4, taken, lrk];
  };
  const slots = [take(), take(), take(), take()];
  const n = r.get(2);
  const lost = [];
  for (let i = 0; i < n; i++) {
    const c = CHARACTERS_ALL[r.get(5)];
    if (c) lost.push(c.id);
  }
  if (!e) return null;
  const p = slots.slice(0, 3).filter(Boolean);
  const rec = { v: 1, n: '', e: e.id, t, d, p, r: slots[3], l: lost };
  rec.s = memRecordTotals(rec);
  return rec;
}

function memRecordTotals(rec) {
  let hp = 0, atk = 0, def = 0;
  (rec.p || []).forEach((m) => {
    if (!m) return;
    const base = charById(m[0]);
    if (!base) return;
    const lv = m[1], rk = m[2] || 1;
    const rm = 1 + (CONFIG.charRankBonus || 0) * (rk - 1);
    hp  += Math.round((base.base.hp  + base.grow.hp  * (lv - 1)) * rm);
    atk += Math.round((base.base.atk + base.grow.atk * (lv - 1)) * rm);
    def += Math.round((base.base.def + base.grow.def * (lv - 1)) * rm);
    const l = m[3] ? landById(m[3]) : null;
    if (l) {
      const b = landBonus(l, m[10] || 1);
      hp += b.hp; atk += b.atk; def += b.def;
    }
  });
  return [hp, atk, def];
}

function encodeMemory(s) {
  const chars = CHARACTERS_ALL, lands = LANDSCAPES, foes = ENEMIES_ALL;
  const o = new BitOut();
  o.put(MEM_FMT, 4);
  o.put(chars.length, 5);
  o.put(lands.length, 4);
  o.put(foes.length, 4);
  o.put(clamp(s.shards | 0, 0, MEM_MAX_SHARDS), 15);

  const owned = chars.map((c) => !!(s.chars && s.chars[c.id]));
  owned.forEach((b) => o.put(b ? 1 : 0, 1));
  chars.forEach((c, i) => {
    if (!owned[i]) return;
    const own = s.chars[c.id] || {};
    o.put(clamp((own.lv | 0) - 1, 0, 255), 8);
    const rb = memRankBits(MEM_FMT);
    o.put(clamp((own.rank | 0 || 1) - 1, 0, (1 << rb) - 1), rb);
    const eqi = own.eq ? lands.findIndex((l) => l.id === own.eq) : -1;
    o.put(eqi < 0 ? 0 : eqi + 1, 4);
  });

  lands.forEach((l) => o.put(clamp(((s.lands && s.lands[l.id]) | 0), 0, CONFIG.maxLandRank), 3));
  for (let i = 0; i < CONFIG.partySize; i++) {
    const id = (s.party || [])[i];
    const ix = id ? chars.findIndex((c) => c.id === id) : -1;
    o.put(ix < 0 ? 0 : ix + 1, 5);
  }
  const rix = s.reserve ? chars.findIndex((c) => c.id === s.reserve) : -1;
  o.put(rix < 0 ? 0 : rix + 1, 5);
  foes.forEach((e) => o.put(s.cleared && s.cleared[e.id] ? 1 : 0, 1));

  o.put(memChecksum(o.bits), 12);

  const bits = o.bits;
  while (bits.length % 6) bits.push(0);
  let out = '';
  for (let i = 0; i < bits.length; i += 6) {
    let v = 0;
    for (let k = 0; k < 6; k++) v = (v << 1) | bits[i + k];
    out += MEM_KANA[v];
  }
  return out;
}

function decodeMemory(text) {
  const kana = memInputToKana(text);
  if (!kana) throw new Error('合言葉が入力されていません');
  const bits = [];
  for (const ch of kana) {
    const v = MEM_KANA.indexOf(ch);
    if (v < 0) throw new Error(`「${ch}」は記憶の文字ではありません`);
    for (let k = 5; k >= 0; k--) bits.push((v >> k) & 1);
  }
  const r = new BitIn(bits);
  const fmt = r.get(4);
  if (fmt < 1 || fmt > MEM_FMT_MAX) throw new Error('この合言葉は形式が違うようです');
  const rankBits = memRankBits(fmt);
  const nc = r.get(5), nl = r.get(4), ne = r.get(4);
  if (nc > CHARACTERS_ALL.length || nl > LANDSCAPES.length || ne > ENEMIES_ALL.length) {
    throw new Error('もっと新しいバージョンの合言葉のようです');
  }
  const s = {
    v: 6, shards: 0, chars: {}, lands: {}, party: [],
    reserve: null, playerName: '', records: [], cleared: {},
  };
  s.shards = r.get(15);

  const owned = [];
  for (let i = 0; i < nc; i++) owned.push(r.get(1));
  for (let i = 0; i < nc; i++) {
    if (!owned[i]) continue;
    const lv = r.get(8) + 1, rank = r.get(rankBits) + 1, eqi = r.get(4);
    const c = CHARACTERS_ALL[i];
    if (!c || !charById(c.id)) continue;
    const eq = eqi > 0 && LANDSCAPES[eqi - 1] ? LANDSCAPES[eqi - 1].id : null;
    s.chars[c.id] = {
      lv: clamp(lv, 1, CONFIG.maxLevel), exp: 0,
      rank: clamp(rank, 1, CONFIG.maxCharRank || 10), eq,
    };
  }
  for (let i = 0; i < nl; i++) {
    const n = r.get(3);
    const l = LANDSCAPES[i];
    if (l && n > 0) s.lands[l.id] = clamp(n, 0, CONFIG.maxLandRank);
  }
  for (let i = 0; i < CONFIG.partySize; i++) {
    const ix = r.get(5);
    const c = ix > 0 ? CHARACTERS_ALL[ix - 1] : null;
    if (c && s.chars[c.id] && s.party.indexOf(c.id) < 0) s.party.push(c.id);
  }
  const rix = r.get(5);
  const rc = rix > 0 ? CHARACTERS_ALL[rix - 1] : null;
  if (rc && s.chars[rc.id] && s.party.indexOf(rc.id) < 0) s.reserve = rc.id;
  for (let i = 0; i < ne; i++) {
    const hit = r.get(1);
    const e = ENEMIES_ALL[i];
    if (hit && e && enemyById(e.id)) s.cleared[e.id] = true;
  }

  if (fmt >= 3) {
    const rec = memGetRecord(r);
    if (rec) s.records = [rec];
  }

  const payload = bits.slice(0, r.i);
  if (r.get(12) !== memChecksum(payload)) throw new Error('合言葉のつづりが違うようです');
  while (r.i < bits.length) { if (r.get(1)) throw new Error('合言葉のつづりが違うようです'); }

  if (!Object.keys(s.chars).length) throw new Error('仲間がひとりもいない記憶です');
  if (!s.party.length) s.party = [Object.keys(s.chars)[0]];
  return s;
}

const POEM_TABLES = () => [POEM_A, POEM_B, POEM_C];

function poemFromKana(kana) {
  const T = POEM_TABLES();
  const lines = [];
  let cur = '';
  [...kana].forEach((ch, i) => {
    const v = MEM_KANA.indexOf(ch);
    cur += T[i % 3][v];
    if (i % 3 === 2) { lines.push(cur); cur = ''; }
  });
  if (cur) lines.push(cur);
  return lines.join('\n');
}

function kanaFromPoem(text) {
  const T = POEM_TABLES();
  let s = String(text || '');
  try { s = s.normalize('NFC'); } catch (e) {}
  s = s.replace(/[\s　、。，．・…「」『』（）()\-—_|/／]/g, '');

  const OLD = (typeof POEM_OLD !== 'undefined' && POEM_OLD) || [{}, {}, {}];
  let out = '', i = 0, pos = 0;
  while (i < s.length) {
    const tbl = T[pos % 3];
    const old = OLD[pos % 3] || {};
    let hit = -1, len = 0;
    for (let v = 0; v < tbl.length; v++) {
      const w = tbl[v];
      if (w.length > len && s.startsWith(w, i)) { hit = v; len = w.length; }
      const o = old[v];
      if (o && o.length > len && s.startsWith(o, i)) { hit = v; len = o.length; }
    }
    if (hit < 0) throw new Error(`「${s.slice(i, i + 5)}…」のあたりが読み取れません`);
    out += MEM_KANA[hit];
    i += len;
    pos++;
  }
  return out;
}

function memInputToKana(text) {
  const k = memNormalize(text);
  if (k && [...k].every((ch) => MEM_KANA.indexOf(ch) >= 0)) return k;
  return kanaFromPoem(text);
}

function memPretty(k) {
  const g = k.match(/.{1,5}/g) || [];
  const lines = [];
  for (let i = 0; i < g.length; i += 3) lines.push(g.slice(i, i + 3).join('　'));
  return lines.join('\n');
}

function saveBlobName() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `madaminu_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}.json`;
}

function exportSave() {
  const json = JSON.stringify(S);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = saveBlobName();
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('バックアップを書き出しました');
}

function copySave() {
  const json = JSON.stringify(S);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(json)
      .then(() => toast('データをコピーしました。メモ帳などに貼って保管してください'))
      .catch(() => prompt('この文字を全部コピーして保管してください', json));
  } else {
    prompt('この文字を全部コピーして保管してください', json);
  }
}

function importSave(text) {
  let s;
  try {
    s = JSON.parse(text);
  } catch (e) {
    toast('データの形が違うようです');
    return false;
  }
  if (!s || s.v !== 6 || !s.chars) { toast('このゲームのデータではないようです'); return false; }
  const n = Object.keys(s.chars).length;
  if (!confirm(`読み込むと、いまの進行は上書きされます。\n（仲間 ${n} 人 ／ 記憶の欠片 ${s.shards}）\nよろしいですか？`)) return false;
  S = s;
  save();
  toast('データを読み込みました');
  setTimeout(() => location.reload(), 600);
  return true;
}

function awakenMemory(text) {
  let s;
  try {
    s = decodeMemory(text);
  } catch (e) {
    toast(e.message || '合言葉を読み取れませんでした');
    return false;
  }
  const n = Object.keys(s.chars).length;
  const cl = Object.keys(s.cleared || {}).length;
  const rc = (s.records || []).length;
  if (!confirm(`この記憶を呼び覚ますと、いまの旅は消えて上書きされます。\n\n仲間 ${n} 人 ／ 記憶の欠片 ${s.shards} ／ 撃破 ${cl} 体${rc ? '\n記憶の碑：いちばん新しい1件' : ''}\n\nよろしいですか？`)) return false;

  s.playerName = S && S.playerName ? S.playerName : '';
  (s.records || []).forEach((r) => { if (!r.n) r.n = (s.playerName || '').slice(0, 12); });
  S = s;
  save();
  toast('記憶が呼び覚まされた');
  setTimeout(() => location.reload(), 700);
  return true;
}

let memView = 'poem';

function memViewText(kana) {
  return memView === 'poem' ? poemFromKana(kana) : memPretty(kana);
}

function renderMemView() {
  let kana = '';
  try { kana = encodeMemory(S); } catch (e) { return; }
  const poem = memView === 'poem';
  $('mem-box').textContent = memViewText(kana);
  $('mem-box').className = poem ? 'memo memo--poem' : 'memo';
  $('mem-note').innerHTML = poem
    ? `${poemFromKana(kana).split('\n').length} 行の詩。まるごと写しておけば、別の端末でもこの続きから旅を再開できます。`
    : `全 ${kana.length} 文字。書き写しておけば、別の端末でもこの続きから旅を再開できます。`;
  $('mem-copy').textContent = poem ? 'この詩をひかえる' : '合言葉をひかえる';
  const tg = $('mem-toggle');
  if (tg) tg.textContent = poem ? 'ひらがなで見る' : '詩で見る';
}

function copyMemory() {
  let t;
  try { t = memViewText(encodeMemory(S)); } catch (e) { toast('合言葉を作れませんでした'); return; }
  const done = memView === 'poem' ? '記憶の詩をコピーしました' : '合言葉をコピーしました';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t)
      .then(() => toast(done))
      .catch(() => prompt('これを書き写してください', t));
  } else {
    prompt('これを書き写してください', t);
  }
}

function openStorageModal(focus) {
  const at = S.savedAt ? new Date(S.savedAt) : null;
  const p = (n) => String(n).padStart(2, '0');
  const when = at ? `${at.getFullYear()}.${p(at.getMonth() + 1)}.${p(at.getDate())} ${p(at.getHours())}:${p(at.getMinutes())}` : 'まだ保存されていません';
  let ok = true;
  try { encodeMemory(S); } catch (e) { ok = false; }

  openModal(`
    <div class="md__title">旅の記憶</div>
    <div class="md__sub">いまの旅を、ひとつの詩に変えて持ち歩く</div>

    <div class="memo__head">
      <span class="md__label">記憶をつづる</span>
    </div>
    <div class="memo memo--poem" id="mem-box">${ok ? '' : '<span class="memo__err">合言葉を作れませんでした</span>'}</div>
    <div class="memo__note" id="mem-note"></div>
    <div class="md__row">
      <button type="button" class="btn btn--sub" id="mem-copy">この詩をひかえる</button>
    </div>

    <div class="md__label">記憶を呼び覚ます</div>
    <textarea class="memo__in" id="mem-in" rows="4" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="ひかえておいた詩を、ここに書き写す"></textarea>
    <div class="md__row">
      <button type="button" class="btn btn--sub btn--awaken" id="mem-load">記憶を呼び覚ます</button>
    </div>
    <div class="memo__note">ひかえておいた詩を、そのまま書き写してください。<br>空白や改行、句読点が混ざっていても大丈夫です。<br>呼び覚ますと、いま遊んでいる旅は上書きされます。</div>

    <details class="memo__more">
      <summary>この世界のデータは、どこに宿るのか</summary>
      <div class="md__desc">
        進行は<b>いま使っているブラウザの中</b>に自動で保存されます。<br>
        最後に保存できたのは <b>${when}</b>。<br>
        タブを閉じても、パソコンを再起動しても残ります。<br><br>
        ただし次の場合は<b>消えます</b>。そのときは合言葉から呼び覚ましてください。
        <ul class="md__ul">
          <li>ブラウザの「閲覧データの削除」でサイトデータを消したとき</li>
          <li>シークレット／プライベートウィンドウで遊んだとき</li>
          <li>別のブラウザ・別の端末で開いたとき</li>
          <li>iPhoneのSafariで、<b>7日間まったく開かなかった</b>とき</li>
        </ul>
        合言葉には<b>経験値の端数・刻んだ名前・自分の記録一覧</b>は入りません。<br>
        まるごと残したいときは、下からファイルに書き出せます。
      </div>
      <div class="md__row">
        <button type="button" class="btn btn--sub" id="md-export">ファイルに書き出す</button>
        <button type="button" class="btn btn--sub" id="md-import-file">ファイルから戻す</button>
      </div>
      <input type="file" id="md-file" accept="application/json,.json,.txt" hidden>
    </details>
  `);

  if (ok) renderMemView();
  $('mem-copy').onclick = copyMemory;
  $('mem-load').onclick = () => awakenMemory($('mem-in').value);
  $('md-export').onclick = exportSave;
  $('md-import-file').onclick = () => $('md-file').click();
  $('md-file').onchange = (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => importSave(String(r.result));
    r.readAsText(f);
  };
  if (focus === 'in') {
    const box = $('mem-in');
    box.scrollIntoView({ block: 'center' });
    setTimeout(() => box.focus(), 60);
  }
}

function resetSave() {
  S = newSave();
  save();
  location.reload();
}

const Sound = {
  on: true,
  ready: false,
  cache: {},
  bgmEl: null,
  bgmName: null,
  bgmSrcName: null,
  bgmMissing: {},
  bgmLv: CONFIG.defaultBgmLevel,
  sfxLv: CONFIG.defaultSfxLevel,

  get bgmVol() { return this.volFor(this.bgmName); },
  volFor(name) {
    const L = CONFIG.bgmLevels;
    const lv = clamp(this.bgmLv, 0, L.length - 1);

    const key = String(name || '').split('@')[0];
    const boost = (CONFIG.bgmBoost || {})[key] || 0;
    if (!boost) return L[lv];

    const ext = L.concat([1]);
    const x = clamp(lv + boost, 0, ext.length - 1);
    const i = Math.floor(x), f = x - i;
    return (f > 0 && i + 1 < ext.length) ? ext[i] + (ext[i + 1] - ext[i]) * f : ext[i];
  },
  get sfxVol() { return CONFIG.sfxLevels[clamp(this.sfxLv, 0, CONFIG.sfxLevels.length - 1)]; },

  init() {
    try {
      this.on = localStorage.getItem('madaminu_mute') !== '1';
      const b = localStorage.getItem('madaminu_bgmlv');
      const f = localStorage.getItem('madaminu_sfxlv');
      if (b !== null) this.bgmLv = +b;
      if (f !== null) this.sfxLv = +f;
    } catch (e) {}

    const list = ['common/tap', 'common/damage', 'common/heal', 'common/enemy_attack',
                  'common/victory', 'common/defeat', 'common/gacha'];
    CHARACTERS.forEach((c) => { list.push('attack/' + c.id, 'skill/' + c.id); });
    list.forEach((n) => this.load(n));
  },

  load(name) {
    if (this.cache[name]) return this.cache[name];
    const a = new Audio(CONFIG.sfxDir + name + '.mp3');
    a.preload = 'auto';
    a.volume = this.sfxVol;
    this.cache[name] = a;
    return a;
  },

  play(name, fallback) {
    if (!this.on || this._suspended) return;
    const base = this.cache[name] || this.load(name);
    const el = base.cloneNode();
    el.volume = this.sfxVol;
    el.play().catch(() => {
      if (fallback && fallback !== name) this.play(fallback);
    });
  },

  resolveBgm(name) {
    const back = CONFIG.bgmFallback || {};
    let n = name;
    for (let i = 0; i < 8 && n; i++) {
      if (CONFIG.bgm[n] && !this.bgmMissing[n]) return n;
      n = back[n];
    }
    return null;
  },

  playBgm(name) {
    const use = this.resolveBgm(name);
    if (!use) return;

    const want = CONFIG.bgm[use] ? CONFIG.bgmDir + CONFIG.bgm[use] : null;
    const now = this.bgmEl && this.bgmEl.src;
    if (this.bgmEl && !this.bgmEl.paused && want && now && now.endsWith(want)) {
      this.bgmName = name;
      this.bgmSrcName = use;
      return;
    }
    this.bgmName = name;
    this.bgmSrcName = use;
    if (!this.bgmEl) {
      this.bgmEl = new Audio();
      this.bgmEl.loop = true;

      this.bgmEl.addEventListener('error', () => this.bgmFailed());
    }
    const el = this.bgmEl;
    const src = CONFIG.bgmDir + CONFIG.bgm[use];

    if (!this.on || this._suspended) {
      if (!el.src.endsWith(src)) el.src = src;
      el.volume = 0;
      el.pause();
      return;
    }

    const token = ++this._bgmToken;
    const swap = () => {
      if (token !== this._bgmToken) return;
      if (!el.src.endsWith(src)) el.src = src;
      el.volume = 0;
      el.play().then(() => {
        if (token === this._bgmToken) this.fadeTo(this.bgmVol);
      }).catch(() => {});
    };
    const fade = CONFIG.bgmFadeMs || 0;
    if (fade > 0 && el.src && !el.paused && el.volume > 0.01) {
      this.fadeTo(0, fade);
      setTimeout(swap, fade);
    } else {
      swap();
    }
  },
  _bgmToken: 0,

  bgmFailed() {
    const bad = this.bgmSrcName;
    if (!bad) return;
    this.bgmMissing[bad] = true;
    const want = this.bgmName;
    this.bgmName = null;
    this.bgmSrcName = null;
    if (want && want !== bad) { this.playBgm(want); return; }
    const alt = (CONFIG.bgmFallback || {})[bad];
    if (alt) this.playBgm(alt);
  },

  _suspended: false,

  suspend() {
    if (this._suspended) return;
    this._suspended = true;
    clearInterval(this._fade);
    const el = this.bgmEl;
    if (el && !el.paused) el.pause();
  },

  resume() {
    if (!this._suspended) return;
    this._suspended = false;
    if (!this.on) return;
    const el = this.bgmEl;
    const ms = CONFIG.bgmResumeFadeMs == null ? 400 : CONFIG.bgmResumeFadeMs;
    if (el && el.src) {
      el.volume = 0;
      el.play().then(() => { if (this.on) this.fadeTo(this.bgmVol, ms); }).catch(() => {});
    } else if (this.bgmName) {
      this.playBgm(this.bgmName);
    }
  },

  fadeTo(target, ms = 900) {
    const el = this.bgmEl;
    if (!el) return;
    clearInterval(this._fade);
    const from = el.volume;
    const steps = Math.max(1, Math.round(ms / 50));
    let n = 0;
    this._fade = setInterval(() => {
      n++;
      el.volume = clamp(from + (target - from) * (n / steps), 0, 1);
      if (n >= steps) { el.volume = clamp(target, 0, 1); clearInterval(this._fade); }
    }, 50);
  },

  toggle() {
    this.on = !this.on;
    try { localStorage.setItem('madaminu_mute', this.on ? '0' : '1'); } catch (e) {}
    if (this.on) { this.playBgm(this.bgmName || 'home'); }
    else if (this.bgmEl) { this.bgmEl.pause(); }
    renderSoundBtn();
    return this.on;
  },

  setBgmLevel(i) {
    this.bgmLv = clamp(i, 0, CONFIG.bgmLevels.length - 1);
    try { localStorage.setItem('madaminu_bgmlv', String(this.bgmLv)); } catch (e) {}
    if (this.bgmEl && this.on) this.fadeTo(this.bgmVol, 260);
    renderSoundPanel();
  },

  setSfxLevel(i) {
    this.sfxLv = clamp(i, 0, CONFIG.sfxLevels.length - 1);
    try { localStorage.setItem('madaminu_sfxlv', String(this.sfxLv)); } catch (e) {}
    renderSoundPanel();
    this.play('common/tap');
  },
};

if (CONFIG.bgmPauseOnHide !== false) {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) Sound.suspend(); else Sound.resume();
  });
  window.addEventListener('pagehide', () => Sound.suspend());
  window.addEventListener('pageshow', () => { if (!document.hidden) Sound.resume(); });
}

function renderSoundBtn() {
  const b = $('btn-sound');
  if (!b) return;
  b.classList.toggle('is-off', !Sound.on);
  b.setAttribute('aria-label', '音の設定');
}

function renderSoundPanel() {
  const p = $('sound-panel');
  if (!p) return;
  const row = (label, lv, max, kind) =>
    `<div class="snd__row">
       <span class="snd__label">${label}</span>
       <div class="snd__steps" data-kind="${kind}">
         ${Array.from({ length: max }, (_, i) =>
           `<button type="button" class="snd__step ${i <= lv ? 'is-on' : ''}" data-i="${i}"
                    aria-label="${label} ${i + 1}"><i style="height:${28 + i * 11}%"></i></button>`).join('')}
       </div>
       <span class="snd__num">${lv + 1}</span>
     </div>`;
  p.innerHTML =
    row('BGM', Sound.bgmLv, CONFIG.bgmLevels.length, 'bgm') +
    row('効果音', Sound.sfxLv, CONFIG.sfxLevels.length, 'sfx') +
    `<button type="button" class="snd__mute ${Sound.on ? '' : 'is-off'}" id="snd-mute">
       ${Sound.on ? 'すべての音を消す' : '音を出す'}
     </button>`;
  $('snd-mute').onclick = () => { Sound.toggle(); renderSoundPanel(); };
  p.querySelectorAll('.snd__steps').forEach((wrap) => {
    wrap.onclick = (e) => {
      const b = e.target.closest('.snd__step');
      if (!b) return;
      const i = +b.dataset.i;
      if (wrap.dataset.kind === 'bgm') Sound.setBgmLevel(i);
      else Sound.setSfxLevel(i);
    };
  });
}

function toggleSoundPanel(force) {
  const p = $('sound-panel');
  const show = force !== undefined ? force : p.hidden;
  if (show) renderSoundPanel();
  p.hidden = !show;
}

function expToNext(lv) {
  return BALANCE.expBase + (lv - 1) * BALANCE.expStep;
}

function rewardExp(e) {
  return Math.round(e.reward.exp * (BALANCE.expRate == null ? 1 : BALANCE.expRate));
}
function rewardShards(e) {
  return Math.round(e.reward.shards * (BALANCE.shardRate == null ? 1 : BALANCE.shardRate));
}

function charRank(cid) {
  const own = S.chars[cid];
  if (!own) return 0;
  return Math.min(CONFIG.maxCharRank || 10, Math.max(1, own.rank || 1));
}

function charRankMul(cid) {
  return 1 + (charRank(cid) - 1) * (CONFIG.charRankBonus || 0);
}

function statsOf(cid) {
  const base = charById(cid);
  const own = S.chars[cid];
  if (!base || !own) return null;
  const lv = own.lv;
  const rm = charRankMul(cid);
  const st = {
    hp:  Math.round((base.base.hp  + base.grow.hp  * (lv - 1)) * rm),
    atk: Math.round((base.base.atk + base.grow.atk * (lv - 1)) * rm),
    def: Math.round((base.base.def + base.grow.def * (lv - 1)) * rm),
  };
  st.rank = charRank(cid);
  st.rankMul = rm;
  const eq = own.eq ? landById(own.eq) : null;
  if (eq) {
    const rank = landRank(eq.id) || 1;
    const b = landBonus(eq, rank);
    st.hp += b.hp; st.atk += b.atk; st.def += b.def;
    st.eqName = eq.name;
    st.eqRank = rank;
    st.eqBonus = b;
  }
  return st;
}

function landRank(lid) {
  const n = S.lands[lid] || 0;
  return n <= 0 ? 0 : Math.min(CONFIG.maxLandRank, n);
}

function landBonus(l, rank) {
  const mul = CONFIG.landRankMul[clamp(rank, 1, CONFIG.maxLandRank) - 1] || 1;
  return {
    hp:  Math.round(l.bonus.hp * mul),
    atk: Math.round(l.bonus.atk * mul),
    def: Math.round(l.bonus.def * mul),
  };
}

function skillUsesOf(cid) {
  const own = S.chars[cid];
  if (!own || !own.eq) return CONFIG.skillUses || 0;
  return landRank(own.eq) || (CONFIG.skillUses || 0);
}

function landEffOf(cid) {
  const own = S.chars[cid];
  if (!own || !own.eq) return null;
  const l = landById(own.eq);
  if (!l || !l.eff || !LAND_EFFECTS[l.eff.type]) return null;
  const mul = CONFIG.landRankMul[clamp(landRank(l.id), 1, CONFIG.maxLandRank) - 1] || 1;
  return { type: l.eff.type, value: l.eff.value * mul, name: LAND_EFFECTS[l.eff.type].name, land: l };
}

function effOf(u, type) {
  return u && u.eff && u.eff.type === type ? u.eff.value : 0;
}

function effName(type) {
  const e = (typeof LAND_EFFECTS !== 'undefined' && LAND_EFFECTS[type]) || null;
  return (e && e.name) || '';
}

function landEffText(l, rank) {
  if (!l.eff || !LAND_EFFECTS[l.eff.type]) return '';
  const mul = CONFIG.landRankMul[clamp(rank || 1, 1, CONFIG.maxLandRank) - 1] || 1;
  const e = LAND_EFFECTS[l.eff.type];
  return `<b class="eff">${e.name}</b>　${e.text(l.eff.value * mul)}`;
}

function charRankMarks(r) {
  const max = CONFIG.maxCharRank || 10;
  const from = CONFIG.charRankStarFrom || (max + 1);
  if (r < from) {
    const span = from - 1;
    return { on: '◆', off: '◇', n: r, max: span };
  }
  const span = max - from + 1;
  return { on: '★', off: '☆', n: r - (from - 1), max: span };
}

function charRankStars(cid) {
  const m = charRankMarks(charRank(cid));
  const n = clamp(m.n, 0, m.max);
  return `<span class="crank${m.on === '★' ? ' crank--star' : ''}">${m.on.repeat(n)}${m.off.repeat(Math.max(0, m.max - n))}</span>`;
}

function charRankTag(cid) {
  const r = charRank(cid);
  if (r <= 1) return '';
  const m = charRankMarks(r);
  return `<span class="crank${m.on === '★' ? ' crank--star' : ''}">${m.on}${m.n}</span>`;
}

function rankStars(rank) {
  const max = CONFIG.maxLandRank;
  return `<span class="rank">${'◆'.repeat(rank)}${'◇'.repeat(Math.max(0, max - rank))}</span>`;
}

function ownedChars() { return CHARACTERS.filter((c) => S.chars[c.id]); }
function ownedLands() { return LANDSCAPES.filter((l) => S.lands[l.id]); }

function equippedBy(lid) {
  for (const cid in S.chars) if (S.chars[cid].eq === lid) return cid;
  return null;
}

const SCREENS = {
  home:   { el: 'screen-home',   title: null,          back: false, dock: true  },
  gacha:  { el: 'screen-gacha',  title: '記憶の呼び声', back: true,  dock: false },
  party:  { el: 'screen-party',  title: 'パーティ編成', back: true,  dock: true  },
  book:   { el: 'screen-book',   title: '記憶の図鑑',   back: true,  dock: true  },
  records:{ el: 'screen-records', title: '記憶の碑',    back: true,  dock: false },
  stage:  { el: 'screen-stage',  title: '探索',         back: true,  dock: false },
  tale:   { el: 'screen-tale',   title: '物語',         back: true,  dock: false },

  after:  { el: 'screen-tale',   title: '物語',         back: false, dock: false },
  battle: { el: 'screen-battle', title: '戦闘',         back: false, dock: false },
  result: { el: 'screen-result', title: '戦闘結果',     back: false, dock: false },

  ending: { el: 'screen-ending', title: '旅の終わり',   back: false, dock: false },
  credits:{ el: 'screen-credits', title: '',            back: false, dock: false },
};

let current = 'home';

function setUiBg(elId, file) {
  const el = $(elId);
  if (!el) return;
  el.style.backgroundImage = file ? `url(${CONFIG.uiDir}${file})` : 'none';
  el.hidden = !file;
}

let lastResultWin = true;

function enemyIsHalf() {
  if (!B || !B.ehpMax) return false;
  const ratio = CONFIG.bgmPinchRatio == null ? 0.5 : CONFIG.bgmPinchRatio;
  return B.ehp / B.ehpMax < ratio;
}

function currentEnemyId() {
  if (B && B.e && B.e.id) return B.e.id;
  return taleEid || null;
}

function bgmFor(kind) {
  const eid = currentEnemyId();
  if (!eid) return kind;
  const key = kind + '@' + eid;
  return (CONFIG.bgm && CONFIG.bgm[key]) ? key : kind;
}

function titleAfterOn() {
  const t = CONFIG.titleAfter;
  if (!t || !t.after) return null;
  return (S && S.cleared && S.cleared[t.after]) ? t : null;
}

function homeBgFile() {
  const t = titleAfterOn();
  return (t && t.bg) ? t.bg : CONFIG.bgTitle;
}

function setHomeBg() {
  const base = CONFIG.bgTitle;
  const file = homeBgFile();
  setUiBg('home-bg', base);
  if (file === base || !file) return;
  const im = new Image();
  im.onload = () => { if (titleAfterOn()) setUiBg('home-bg', file); };
  im.src = CONFIG.uiDir + file;
}

function homeBgmName() {
  const t = titleAfterOn();
  return (t && t.bgm) ? 'home_after' : 'home';
}

function registerTitleAfterBgm() {
  const t = CONFIG.titleAfter;
  if (!t || !t.bgm) return;
  CONFIG.bgm = CONFIG.bgm || {};
  CONFIG.bgm.home_after = t.bgm;
  CONFIG.bgmFallback = CONFIG.bgmFallback || {};
  CONFIG.bgmFallback.home_after = 'home';
}

function registerEnemyBgm() {
  const list = (typeof ENEMIES_ALL !== 'undefined' ? ENEMIES_ALL : ENEMIES) || [];
  CONFIG.bgmFallback = CONFIG.bgmFallback || {};
  list.forEach((e) => {
    if (!e || !e.bgm) return;
    Object.keys(e.bgm).forEach((kind) => {
      const file = e.bgm[kind];
      if (!file) return;
      const key = kind + '@' + e.id;
      CONFIG.bgm[key] = file;

      CONFIG.bgmFallback[key] = kind;
    });
  });
}

function battleBgmName() {
  if (!B || !B.ehpMax) return bgmFor('battle');
  if (enemyIsHalf()) { if (B.halfDone || !CONFIG.halfBreak) B.pinch = true; }
  else if (!CONFIG.bgmPinchLatch) B.pinch = false;
  return bgmFor(B.pinch ? 'battle_pinch' : 'battle');
}

function bgmForScreen(name) {
  if (name === 'battle') return battleBgmName();
  if (name === 'tale')   return bgmFor('tale');

  if (name === 'after')  return bgmFor('result');
  if (name === 'gacha')  return 'gacha';
  if (name === 'result') return lastResultWin ? bgmFor('result') : bgmFor('lose');

  if (name === 'ending')  return 'ending';
  if (name === 'credits') return 'credits';

  return homeBgmName();
}

function go(name) {
  const def = SCREENS[name];
  if (!def) return;
  toastHide();
  if (name !== 'battle') clearEnemyLine();
  if (name !== 'credits') stopCredits();
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('is-active'));
  $(def.el).classList.add('is-active');
  $('hud-title').textContent = def.title == null ? (CONFIG.title || '') : def.title;
  $('btn-back').hidden = !def.back;
  $('dock').classList.toggle('is-hidden', !def.dock);
  $(def.el).scrollTop = 0;
  current = name;
  Sound.playBgm(bgmForScreen(name));
  renderHud();
}

function applyTitle() {

  const af = titleAfterOn() || {};
  const t = af.title || CONFIG.title || '';
  const sub = af.sub || CONFIG.titleSub || '';

  const subPlain = sub.replace(/^[\s―—-]+|[\s―—-]+$/g, '');
  document.title = subPlain ? `${t} ― ${subPlain}` : t;
  const h = document.querySelector('.home__title');
  const s = document.querySelector('.home__sub');

  if (h) {
    const small = CONFIG.titleSmall || '';
    const at = small ? t.indexOf(small) : -1;
    if (at >= 0) {

      const before = t.slice(0, at);
      const after = t.slice(at + small.length);
      const bCut = before.replace(/[ \t]+$/, '');
      const aCut = after.replace(/^[ \t]+/, '');
      const inner = (bCut === before ? '' : ' ') + small + (aCut === after ? '' : ' ');
      h.innerHTML = escapeHtml(bCut)
        + `<span class="home__title__sm">${escapeHtml(inner)}</span>`
        + escapeHtml(aCut);
    } else {
      h.textContent = t;
    }
  }
  if (s) s.textContent = sub;

  if (h) h.classList.toggle('home__title--latin', !/[ぁ-んァ-ヶ一-龠]/.test(t));
}

function renderHud() {
  $('hud-shards').textContent = S.shards;

  const hs = document.querySelector('.hud__shards');
  if (hs) hs.hidden = (current === 'ending' || current === 'credits');
  $('dock-char-cost').textContent = CONFIG.costCharGacha;
  $('dock-land-cost').textContent = CONFIG.costLandGacha;
  $('dock-char').classList.toggle('is-ready', S.shards >= CONFIG.costCharGacha);
  $('dock-land').classList.toggle('is-ready', S.shards >= CONFIG.costLandGacha);
}

function storyText() {

  for (let i = ENEMIES.length - 1; i >= 0; i--) {
    const e = ENEMIES[i];
    if (S.cleared[e.id] && e.story) {
      return i === ENEMIES.length - 1
        ? e.story + '<br>それでも、まだ見ぬ景色はどこかにある。'
        : e.story;
    }
  }
  return 'すべてが灰に還った世界。<br>あなたが集めた景色だけが、まだ色を持っている。';
}

function renderHome() {

  $('home-story').innerHTML = storyText();

  setHomeBg();
  applyTitle();

  const cp = $('home-copy');
  if (cp) {
    cp.textContent = CONFIG.copyright || '';
    cp.hidden = !CONFIG.copyright;
  }

  const eb = $('btn-go-ending');
  if (eb) eb.hidden = !endingCleared();
}

function endingEnemy() {
  return (typeof ENEMIES !== 'undefined' ? ENEMIES : []).find((e) => e && e.ending) || null;
}

function endingCleared() {
  const e = endingEnemy();
  return !!(e && S && S.cleared && S.cleared[e.id]);
}

let gachaType = 'char';

function pickEven(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function charStars(c) {
  return CONFIG.showCharStars ? stars(c.rarity) : '';
}

function charStarText(c) {
  return CONFIG.showCharStars ? `　${'★'.repeat(c.rarity)}` : '';
}

function pickByRarity(pool, rates) {

  const groups = {};
  pool.forEach((x) => { (groups[x.rarity] = groups[x.rarity] || []).push(x); });
  const entries = Object.keys(groups).map((r) => [r, rates[r] || 0]);
  const total = entries.reduce((a, [, w]) => a + w, 0);
  let t = Math.random() * total;
  for (const [r, w] of entries) {
    t -= w;
    if (t <= 0) {
      const g = groups[r];
      return g[Math.floor(Math.random() * g.length)];
    }
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function openGacha(type) {
  gachaType = type;
  const isChar = type === 'char';
  $('gacha-name').textContent = isChar ? '記憶の呼び声' : '失われた景色';
  $('gacha-desc').textContent = isChar
    ? '灰の中から、まだ名を持つ者を呼び戻す。'
    : '世界がまだ美しかった頃の断片を引き上げる。';
  $('gacha-card').classList.toggle('is-land', !isChar);
  $('gacha-img').classList.remove('is-shown');
  $('gacha-img').removeAttribute('src');
  if ($('gacha-say')) $('gacha-say').innerHTML = '';
  $('gacha-idle').style.display = '';
  $('gacha-caption').innerHTML = '';
  $('gacha-note').textContent = '';
  $('pull-cost').textContent = `−${isChar ? CONFIG.costCharGacha : CONFIG.costLandGacha}`;
  hideMulti();
  updatePullBtn();
  go('gacha');
}

function updatePullBtn() {
  const cost = gachaType === 'char' ? CONFIG.costCharGacha : CONFIG.costLandGacha;
  $('btn-pull').disabled = pulling || S.shards < cost;
  $('btn-pull').firstChild.nodeValue = S.shards < cost ? '欠片が足りない' : '引く';

  const b10 = $('btn-pull10');
  if (b10) {
    const n = CONFIG.multiPull || 10;
    const c10 = multiCost();
    b10.hidden = !(CONFIG.multiPull > 1);
    b10.disabled = pulling || S.shards < c10;
    b10.firstChild.nodeValue = `${n}連`;
    $('pull10-cost').textContent = `−${comma(c10)}`;
  }
}

let pulling = false;

function pullOnce(isChar) {
  let result, isNew;
  let dupeInfo = null;
  if (isChar) {

    const pool = CONFIG.gachaSkipStartChar
      ? CHARACTERS.filter((c) => c.id !== CONFIG.startCharId)
      : CHARACTERS;
    const src = pool.length ? pool : CHARACTERS;

    result = CONFIG.charGachaEven === false ? pickByRarity(src, GACHA_RATE.char) : pickEven(src);
    isNew = !S.chars[result.id];
    if (isNew) {
      S.chars[result.id] = { lv: 1, exp: 0, eq: null, rank: 1 };
      if (S.party.length < CONFIG.partySize) S.party.push(result.id);
    } else {
      const own = S.chars[result.id];

      const rBefore = charRank(result.id);
      let rAfter = rBefore;
      if (rBefore < (CONFIG.maxCharRank || 10)) {
        own.rank = rBefore + 1;
        rAfter = own.rank;
      }
      if (own.lv < CONFIG.maxLevel) {
        const before = own.lv;
        own.lv = Math.min(CONFIG.maxLevel, own.lv + CONFIG.dupeCharLevelUp);
        own.exp = 0;
        dupeInfo = { kind: 'levelup', before, after: own.lv, rBefore, rAfter };
      } else if (rAfter > rBefore) {
        dupeInfo = { kind: 'rankonly', rBefore, rAfter };
      } else {
        S.shards += CONFIG.dupeCharShards;
        dupeInfo = { kind: 'shards', amount: CONFIG.dupeCharShards };
      }
    }
  } else {
    result = pickByRarity(LANDSCAPES, GACHA_RATE.land);
    isNew = !S.lands[result.id];
    const before = landRank(result.id);
    if (before >= CONFIG.maxLandRank) {
      S.shards += CONFIG.dupeLandShards;
      dupeInfo = { kind: 'shards', amount: CONFIG.dupeLandShards };
    } else {
      S.lands[result.id] = (S.lands[result.id] || 0) + 1;
      if (!isNew) dupeInfo = { kind: 'rankup', before, after: landRank(result.id) };
    }
  }
  return { result, isNew, dupeInfo };
}

function pull() {
  if (pulling) return;
  const isChar = gachaType === 'char';
  const cost = isChar ? CONFIG.costCharGacha : CONFIG.costLandGacha;
  if (S.shards < cost) return;
  pulling = true;
  $('btn-pull').disabled = true;
  S.shards -= cost;

  const { result, isNew, dupeInfo } = pullOnce(isChar);

  save();
  renderHud();
  hideMulti();

  const show = () => showGachaResult(result, isNew, isChar, dupeInfo);
  if (isNew && CONFIG.revealNew) {
    Sound.play('common/gacha');
    playReveal(show);
  } else {
    show();

    setTimeout(() => { pulling = false; updatePullBtn(); }, 350);
  }
}

function multiCost() {
  const n = CONFIG.multiPull || 10;
  const one = gachaType === 'char' ? CONFIG.costCharGacha : CONFIG.costLandGacha;
  return Math.round(one * n * (CONFIG.multiPullCostMul == null ? 1 : CONFIG.multiPullCostMul));
}

function hideMulti() {
  const m = $('gacha-multi');
  if (m) { m.hidden = true; m.innerHTML = ''; }
  const c = $('gacha-card');
  if (c) c.hidden = false;
  const say = $('gacha-say');
  if (say) say.hidden = false;
}

function pullMulti() {
  if (pulling) return;
  const isChar = gachaType === 'char';
  const n = CONFIG.multiPull || 10;
  const cost = multiCost();
  if (S.shards < cost) return;
  pulling = true;
  updatePullBtn();
  S.shards -= cost;

  const got = [];
  let anyNew = false;
  const shardBack = { start: S.shards };
  for (let i = 0; i < n; i++) {
    const one = pullOnce(isChar);
    got.push(one);
    if (one.isNew) anyNew = true;
  }

  shardBack.total = S.shards - shardBack.start;

  save();
  renderHud();

  const show = () => showMultiResult(got, isChar, shardBack.total);

  if (anyNew && CONFIG.revealNew) {
    Sound.play('common/gacha');
    playReveal(show);
  } else {
    Sound.play('common/gacha');
    show();
    setTimeout(() => { pulling = false; updatePullBtn(); }, 350);
  }
}

function multiSummary(got, isChar) {
  const order = [];
  const map = {};
  got.forEach(({ result, isNew, dupeInfo }) => {
    const id = result.id;
    if (!map[id]) {
      map[id] = { id, name: result.name, obj: result, count: 0, isNew: false,
                  lvFrom: null, lvTo: null, rkFrom: null, rkTo: null, shards: 0 };
      order.push(id);
    }
    const m = map[id];
    m.count++;
    if (isNew) m.isNew = true;
    if (!dupeInfo) return;
    if (dupeInfo.kind === 'levelup') {
      if (m.lvFrom == null) m.lvFrom = dupeInfo.before;
      m.lvTo = dupeInfo.after;
      if (dupeInfo.rAfter > dupeInfo.rBefore) {
        if (m.rkFrom == null) m.rkFrom = dupeInfo.rBefore;
        m.rkTo = dupeInfo.rAfter;
      }
    } else if (dupeInfo.kind === 'rankonly') {
      if (m.rkFrom == null) m.rkFrom = dupeInfo.rBefore;
      m.rkTo = dupeInfo.rAfter;
    } else if (dupeInfo.kind === 'rankup') {
      if (m.rkFrom == null) m.rkFrom = dupeInfo.before;
      m.rkTo = dupeInfo.after;
    } else if (dupeInfo.kind === 'shards') {
      m.shards += dupeInfo.amount;
    }
  });
  return order.map((id) => map[id]);
}

function showMultiResult(got, isChar, shardBack) {
  hideMulti();
  const card = $('gacha-card');
  const say = $('gacha-say');
  const host = $('gacha-multi');
  if (!host) return;
  if (card) card.hidden = true;
  if (say) { say.hidden = true; say.innerHTML = ''; }
  $('gacha-note').innerHTML = '';

  const cards = got.map(({ result, isNew }) => `
    <div class="gm__card${isNew ? ' is-new' : ''}${isChar ? '' : ' gm__card--land'}">
      <img src="${isChar ? CONFIG.charDir + result.id + '.jpg' : CONFIG.landDir + result.file}" alt="">
      <span class="gm__name">${escapeHtml(result.name)}</span>
      ${isNew ? '<span class="gm__new">初</span>' : ''}
    </div>`).join('');

  const sum = multiSummary(got, isChar);
  const rows = sum.map((m) => {
    const bits = [];
    if (m.isNew) bits.push('<span class="up">仲間になった</span>'.replace('仲間になった', isChar ? '仲間になった' : '思い出した'));
    if (m.lvFrom != null) bits.push(`Lv.${m.lvFrom} → <span class="up">Lv.${m.lvTo}</span>`);
    if (m.rkFrom != null) bits.push(`ランク ${m.rkFrom} → <span class="up">${m.rkTo}</span>`);
    if (m.shards > 0) bits.push(`<span class="up">欠片 +${comma(m.shards)}</span>`);
    if (!bits.length) bits.push('<span class="dim">変化なし</span>');
    return `<div class="gm__row">
      <b class="gm__rowname">${escapeHtml(m.name)}</b>
      <span class="gm__rowcnt">×${m.count}</span>
      <span class="gm__rowup">${bits.join('　')}</span>
    </div>`;
  }).join('');

  host.innerHTML = `
    <div class="gm__grid">${cards}</div>
    <div class="gm__sum">${rows}</div>
    ${shardBack > 0 ? `<div class="gm__back">もう極まっていたぶん　記憶の欠片 <b class="up">+${comma(shardBack)}</b></div>` : ''}
  `;
  host.hidden = false;

  host.querySelectorAll('.gm__card').forEach((el, i) => {
    const r = got[i].result;
    el.onclick = () => openViewer(
      isChar ? CONFIG.charDir + r.id + '.jpg' : CONFIG.landDir + r.file,
      r.name, isChar ? `${r.title}${charStarText(r)}` : '★'.repeat(r.rarity));
  });

  renderHud();
  updatePullBtn();
}

function showGachaResult(result, isNew, isChar, dupeInfo) {
  hideMulti();
  const img = $('gacha-img');
  img.src = (isChar ? CONFIG.charDir + result.id + '.jpg'
                    : CONFIG.landDir + result.file);
  $('gacha-idle').style.display = 'none';
  img.classList.remove('is-shown');
  void img.offsetWidth;
  img.classList.add('is-shown');

  $('gacha-caption').innerHTML = isChar
    ? `${charStars(result) ? charStars(result) + '<br>' : ''}${elemBadge(result.elem, 'elem--sm')} <b>${result.name}</b> <small>${result.title}</small>${S.chars[result.id] ? ` ${charRankTag(result.id)}` : ''}`
    : `${rankStars(landRank(result.id))}<br><b>${result.name}</b>`;

  let note;
  if (isNew) {
    note = isChar ? `${result.name} が仲間になった。` : `「${result.name}」を思い出した。`;
  } else if (isChar && dupeInfo && dupeInfo.kind === 'levelup') {
    note = `${result.name} と再び出会った。<span class="up">Lv.${dupeInfo.before} → Lv.${dupeInfo.after}</span>`
         + (dupeInfo.rAfter > dupeInfo.rBefore
            ? `<br><small>絆が深まった <span class="up">ランク ${dupeInfo.rBefore} → ${dupeInfo.rAfter}</span>（基礎ステータス +${Math.round((CONFIG.charRankBonus || 0) * 100)}%）</small>` : '');
    Sound.play('common/victory');
  } else if (isChar && dupeInfo && dupeInfo.kind === 'rankonly') {
    note = `${result.name} と再び出会った。<span class="up">ランク ${dupeInfo.rBefore} → ${dupeInfo.rAfter}</span>`
         + `<br><small>基礎ステータスが +${Math.round((CONFIG.charRankBonus || 0) * 100)}% 上がった</small>`;
    Sound.play('common/victory');
  } else if (isChar) {
    note = `${result.name} はもう極まっている。記憶の欠片 +${CONFIG.dupeCharShards}`;
  } else if (dupeInfo && dupeInfo.kind === 'rankup') {
    note = `「${result.name}」の記憶が深まった。<span class="up">ランク ${dupeInfo.before} → ${dupeInfo.after}</span><br>
            <small>スキルを ${dupeInfo.after} 回使えるようになりました</small>`;
    Sound.play('common/victory');
  } else {
    note = `「${result.name}」はもう極まっている。記憶の欠片 +${CONFIG.dupeLandShards}`;
  }
  $('gacha-note').innerHTML = note;

  if (isChar) gachaSpeak(result.id);

  $('gacha-card').onclick = () => {
    if (!img.getAttribute('src')) return;
    openViewer(img.src, result.name,
      isChar ? `${result.title}${charStarText(result)}` : '★'.repeat(result.rarity));
  };
  $('gacha-card').style.cursor = 'zoom-in';

  renderHud();
  updatePullBtn();
}

function gachaSpeak(cid) {
  const cfg = CONFIG.bubble || {};
  const host = $('gacha-say');
  if (!host) return;
  host.innerHTML = '';
  if (cfg.on === false) return;

  const set = (typeof BUBBLE_LINES !== 'undefined' && BUBBLE_LINES[cid]) || null;
  const scenes = set ? Object.keys(set) : [];
  const kind = scenes.length ? scenes[Math.floor(Math.random() * scenes.length)] : 'start';
  const text = bubbleLine(cid, kind);
  if (!text) return;

  const el = document.createElement('div');
  el.className = 'gbubble' + (BUBBLE_TONE[kind] ? ' gbubble--' + BUBBLE_TONE[kind] : '');
  el.textContent = text;
  host.appendChild(el);

  clearTimeout(gachaSpeak._t);
  gachaSpeak._t = setTimeout(() => { el.classList.add('is-on'); }, 620);
}

function renderParty() {

  const slots = $('party-slots');
  slots.innerHTML = '';
  for (let i = 0; i < CONFIG.partySize; i++) {
    const cid = S.party[i];
    const div = document.createElement('button');
    div.type = 'button';
    div.className = 'pslot' + (cid ? ' is-filled' : '');
    div.dataset.i = i;
    if (cid) div.dataset.cid = cid;
    if (cid) {
      const c = charById(cid), own = S.chars[cid];
      const eq = own.eq ? landById(own.eq) : null;
      div.innerHTML = `
        <img class="pslot__img" src="${CONFIG.charDir}${cid}.jpg" alt="">
        ${elemBadge(c.elem, 'elem--corner')}
        ${eq ? `<span class="pslot__eq"><img src="${CONFIG.landDir}${eq.file}" alt=""><i>${landRank(eq.id)}</i></span>`
             : '<span class="pslot__noeq">技×</span>'}
        <span class="pslot__cap">${c.name}<br><span class="pslot__lv">Lv.${own.lv}</span>${charRankTag(cid)}</span>`;
      div.onclick = () => openCharModal(cid);
    } else {
      div.innerHTML = `<span class="pslot__empty">＋</span>`;
      div.onclick = () => toast('下の仲間をタップして加えてください');
    }
    slots.appendChild(div);
  }

  const rw = $('party-reserve');
  rw.innerHTML = '';
  {
    const cid = S.reserve;
    const div = document.createElement('button');
    div.type = 'button';
    div.className = 'pslot pslot--sub' + (cid ? ' is-filled' : '');
    div.dataset.i = 0;
    if (cid) div.dataset.cid = cid;
    if (cid && S.chars[cid]) {
      const c = charById(cid), own = S.chars[cid];
      const eq = own.eq ? landById(own.eq) : null;
      div.innerHTML = `
        <img class="pslot__img" src="${CONFIG.charDir}${cid}.jpg" alt="">
        ${elemBadge(c.elem, 'elem--corner')}
        ${eq ? `<span class="pslot__eq"><img src="${CONFIG.landDir}${eq.file}" alt=""><i>${landRank(eq.id)}</i></span>`
             : '<span class="pslot__noeq">技×</span>'}
        <span class="pslot__cap">${c.name}<br><span class="pslot__lv">Lv.${own.lv}</span>${charRankTag(cid)}</span>`;
      div.onclick = () => openCharModal(cid);
    } else {
      div.innerHTML = `<span class="pslot__empty">＋</span><span class="pslot__cap">控え なし</span>`;
      div.onclick = () => toast('下の仲間をタップして「控えにする」を選んでください');
    }
    rw.appendChild(div);
  }

  let hp = 0, atk = 0, def = 0;
  S.party.forEach((cid) => {
    const st = statsOf(cid);
    if (st) { hp += st.hp; atk += st.atk; def += st.def; }
  });
  $('party-total').innerHTML =
    `<span>合計HP <b>${comma(hp)}</b></span><span>攻撃 <b>${comma(atk)}</b></span><span>防御 <b>${comma(def)}</b></span>`;

  const list = $('charlist');
  list.innerHTML = '';
  CHARACTERS.forEach((c) => {
    const own = S.chars[c.id];
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'ccard' + (own ? '' : ' is-locked')
      + (S.party.includes(c.id) ? ' is-inparty' : '')
      + (S.reserve === c.id ? ' is-reserve' : '');
    card.dataset.cid = c.id;
    card.innerHTML = own
      ? `<img src="${CONFIG.charDir}${c.id}.jpg" alt="">
         ${elemBadge(c.elem, 'elem--corner')}
         ${charStars(c) ? `<span class="ccard__badge">${charStars(c)}</span>` : ''}
         <span class="ccard__cap">${c.name}<br><span class="ccard__lv">Lv.${own.lv}</span>${charRankTag(c.id)}</span>`
      : `<span class="ccard__cap">？？？</span>`;
    card.onclick = own ? () => openCharModal(c.id) : () => toast('まだ出会っていません');
    list.appendChild(card);
  });
}

const DRAG = { on: false, pending: null, src: null, ghost: null, hover: null,
               timer: null, sx: 0, sy: 0, x: 0, y: 0, moved: 0, touch: false,
               raf: null, justDropped: false, picked: null, id: null };

function dragSpotOf(el) {
  if (!el || !el.closest) return null;
  const ps = el.closest('.pslot');
  if (ps) {
    const kind = ps.parentElement && ps.parentElement.id === 'party-reserve' ? 'reserve' : 'party';
    return { kind, index: +(ps.dataset.i || 0), cid: ps.dataset.cid || null, el: ps };
  }
  const cc = el.closest('.ccard');
  if (cc && !cc.classList.contains('is-locked')) {
    return { kind: 'list', index: -1, cid: cc.dataset.cid || null, el: cc };
  }
  if (el.closest('#charlist')) return { kind: 'listarea', index: -1, cid: null, el: $('charlist') };
  return null;
}

function partyArr() {
  const a = [];
  for (let i = 0; i < CONFIG.partySize; i++) a.push(S.party[i] || null);
  return a;
}

function applyDrop(src, dst) {
  if (!src || !dst || !src.cid) return false;
  const arr = partyArr();
  const cidAt = (t) => (t.kind === 'party' ? arr[t.index] : t.kind === 'reserve' ? (S.reserve || null) : null);
  const put = (t, cid) => {
    if (t.kind === 'party') arr[t.index] = cid || null;
    else if (t.kind === 'reserve') S.reserve = cid || null;
  };
  const same = (a, b) => a && b && a.kind === b.kind && (a.kind !== 'party' || a.index === b.index);

  if (dst.kind === 'list' || dst.kind === 'listarea') {
    if (src.kind === 'list') return false;
    put(src, null);
    S.party = arr.filter(Boolean);
    return true;
  }
  if (same(src, dst)) return false;

  const moving = src.cid;
  const other = cidAt(dst);

  if (src.kind === 'list') {

    let from = null;
    const pi = arr.indexOf(moving);
    if (pi >= 0) from = { kind: 'party', index: pi };
    else if (S.reserve === moving) from = { kind: 'reserve' };
    put(dst, moving);
    if (from && !same(from, dst)) put(from, other);
  } else {
    put(dst, moving);
    put(src, other);
  }
  S.party = arr.filter(Boolean);
  return true;
}

function ghostMove(x, y) {
  if (DRAG.ghost) DRAG.ghost.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
}

function dropTargetAt(x, y) {
  if (DRAG.ghost) DRAG.ghost.style.visibility = 'hidden';
  const el = document.elementFromPoint(x, y);
  if (DRAG.ghost) DRAG.ghost.style.visibility = '';
  return dragSpotOf(el);
}

function updateDragHover() {
  if (!DRAG.on) return;
  const t = dropTargetAt(DRAG.x, DRAG.y);
  const el = t && DRAG.src && t.el !== DRAG.src.el ? t.el : null;
  if (DRAG.hover !== el) {
    if (DRAG.hover) DRAG.hover.classList.remove('is-drop');
    if (el) el.classList.add('is-drop');
    DRAG.hover = el;
  }
}

function dragAutoScroll() {
  if (!DRAG.on) { DRAG.raf = null; return; }
  const sc = $('screen-party');
  const rect = sc.getBoundingClientRect();
  const y = DRAG.y - rect.top;
  const zone = 80, max = 26;
  let d = 0;
  if (y < zone) d = -max * (1 - Math.max(0, y) / zone);
  else if (y > rect.height - zone) d = max * (1 - Math.max(0, rect.height - y) / zone);
  if (d) {
    const before = sc.scrollTop;
    sc.scrollTop = clamp(sc.scrollTop + d, 0, sc.scrollHeight - sc.clientHeight);
    if (sc.scrollTop !== before) updateDragHover();
  }
  DRAG.raf = requestAnimationFrame(dragAutoScroll);
}

function startDrag(x, y) {
  const info = DRAG.pending;
  if (!info || !info.cid || DRAG.on) return;
  DRAG.on = true;
  DRAG.src = info;
  DRAG.x = x; DRAG.y = y;
  clearPicked();
  info.el.classList.add('is-dragsrc');
  const g = document.createElement('div');
  g.className = 'dragghost';
  g.innerHTML = `<img src="${CONFIG.charDir}${info.cid}.jpg" alt="">`;
  document.body.appendChild(g);
  DRAG.ghost = g;
  ghostMove(x, y);
  document.body.classList.add('is-dragging');
  Sound.play('common/tap');

  try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) {}
  if (!DRAG.raf) DRAG.raf = requestAnimationFrame(dragAutoScroll);
}

function setPicked(info) {
  clearPicked();
  DRAG.picked = { kind: info.kind, index: info.index, cid: info.cid };
  const el = pickedEl();
  if (el) el.classList.add('is-picked');
  toast('入れたい場所をタップしてください（もう一度タップでやめる）', CONFIG.toastSkillMs);
}

function pickedEl() {
  const p = DRAG.picked;
  if (!p) return null;
  if (p.kind === 'party') return document.querySelector(`#party-slots .pslot[data-i="${p.index}"]`);
  if (p.kind === 'reserve') return document.querySelector('#party-reserve .pslot');
  return document.querySelector(`#charlist .ccard[data-cid="${p.cid}"]`);
}

function clearPicked() {
  if (!DRAG.picked) return;
  document.querySelectorAll('.is-picked').forEach((e) => e.classList.remove('is-picked'));
  DRAG.picked = null;
}

function commitSwap(src, dst) {
  if (!applyDrop(src, dst)) return false;
  save();
  renderParty();
  Sound.play('common/heal');
  toast(dst.kind === 'list' || dst.kind === 'listarea' ? '編成から外した' : '入れ替えた');
  return true;
}

function endDrag(commit, x, y) {
  clearTimeout(DRAG.timer);
  if (DRAG.raf) { cancelAnimationFrame(DRAG.raf); DRAG.raf = null; }
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', onDragUp);

  if (DRAG.on) {
    const src = DRAG.src;

    const stay = commit && DRAG.moved < 12;
    const dst = commit && !stay ? dropTargetAt(x, y) : null;
    if (DRAG.ghost) DRAG.ghost.remove();
    if (DRAG.hover) DRAG.hover.classList.remove('is-drop');
    if (src && src.el) src.el.classList.remove('is-dragsrc');
    document.body.classList.remove('is-dragging');
    DRAG.on = false; DRAG.ghost = null; DRAG.hover = null; DRAG.src = null;
    DRAG.justDropped = true;
    setTimeout(() => { DRAG.justDropped = false; }, 400);
    if (stay && src) setPicked(src);
    else if (dst) commitSwap(src, dst);
  }
  DRAG.pending = null;
  DRAG.id = null;
}

function onDragMove(ev) {
  const dx = ev.clientX - DRAG.sx, dy = ev.clientY - DRAG.sy;
  DRAG.moved = Math.max(DRAG.moved, Math.hypot(dx, dy));
  if (!DRAG.on) {
    if (DRAG.moved > 6) startDrag(ev.clientX, ev.clientY);
    if (!DRAG.on) return;
  }
  ev.preventDefault();
  DRAG.x = ev.clientX; DRAG.y = ev.clientY;
  ghostMove(DRAG.x, DRAG.y);
  updateDragHover();
}

function onDragUp(ev) { endDrag(true, ev.clientX, ev.clientY); }

$('screen-party').addEventListener('pointerdown', (ev) => {
  if (ev.pointerType && ev.pointerType !== 'mouse') return;
  if (ev.button != null && ev.button > 0) return;
  const info = dragSpotOf(ev.target);
  if (!info || !info.cid) return;
  DRAG.pending = info;
  DRAG.sx = ev.clientX; DRAG.sy = ev.clientY;
  DRAG.moved = 0;
  DRAG.touch = false;
  window.addEventListener('pointermove', onDragMove, { passive: false });
  window.addEventListener('pointerup', onDragUp);
});

function touchOf(ev) {
  if (DRAG.id == null) return ev.changedTouches[0];
  for (const t of ev.changedTouches) if (t.identifier === DRAG.id) return t;
  return null;
}

$('screen-party').addEventListener('touchstart', (ev) => {
  if (DRAG.on || ev.touches.length > 1) return;
  const info = dragSpotOf(ev.target);
  if (!info || !info.cid) return;
  const t = ev.changedTouches[0];
  DRAG.id = t.identifier;
  DRAG.pending = info;
  DRAG.sx = t.clientX; DRAG.sy = t.clientY;
  DRAG.moved = 0;
  DRAG.touch = true;
  clearTimeout(DRAG.timer);

  DRAG.timer = setTimeout(() => startDrag(DRAG.sx, DRAG.sy), CONFIG.dragHoldMs || 260);
}, { passive: true });

document.addEventListener('touchmove', (ev) => {
  if (!DRAG.pending && !DRAG.on) return;
  const t = touchOf(ev);
  if (!t) return;
  const dx = t.clientX - DRAG.sx, dy = t.clientY - DRAG.sy;
  DRAG.moved = Math.max(DRAG.moved, Math.hypot(dx, dy));
  if (!DRAG.on) {
    if (DRAG.pending && DRAG.pending.kind === 'list') {

      if (DRAG.moved > (CONFIG.dragSlopPx || 18)) { clearTimeout(DRAG.timer); DRAG.pending = null; DRAG.id = null; }
      return;
    }

    if (DRAG.moved > 8) startDrag(t.clientX, t.clientY);
    if (!DRAG.on) return;
  }
  if (ev.cancelable) ev.preventDefault();
  DRAG.x = t.clientX; DRAG.y = t.clientY;
  ghostMove(DRAG.x, DRAG.y);
  updateDragHover();
}, { passive: false });

document.addEventListener('touchend', (ev) => {
  if (!DRAG.pending && !DRAG.on) return;
  const t = touchOf(ev);
  clearTimeout(DRAG.timer);
  if (DRAG.on) {
    endDrag(true, t ? t.clientX : DRAG.x, t ? t.clientY : DRAG.y);
  } else {

    DRAG.pending = null; DRAG.id = null;
  }
}, { passive: true });

document.addEventListener('touchcancel', () => {
  clearTimeout(DRAG.timer);
  if (DRAG.on) endDrag(false);
  DRAG.pending = null; DRAG.id = null;
}, { passive: true });

document.addEventListener('dragstart', (ev) => ev.preventDefault());
document.addEventListener('contextmenu', (ev) => {
  if (ev.target && ev.target.closest && ev.target.closest('#screen-party')) ev.preventDefault();
});

$('screen-party').addEventListener('click', (ev) => {
  if (DRAG.justDropped) {
    DRAG.justDropped = false;
    ev.stopPropagation();
    ev.preventDefault();
    return;
  }
  if (DRAG.picked) {
    const dst = dragSpotOf(ev.target);
    ev.stopPropagation();
    ev.preventDefault();
    const src = DRAG.picked;
    const el = pickedEl();
    clearPicked();
    if (!dst) return;

    const same = dst.el === el;
    if (same) { toast('やめました'); return; }
    commitSwap(src, dst);
  }
}, true);

function openCharModal(cid) {
  const c = charById(cid), own = S.chars[cid], st = statsOf(cid);
  const eq = own.eq ? landById(own.eq) : null;
  const inParty = S.party.includes(cid);
  const need = expToNext(own.lv);
  const maxed = own.lv >= CONFIG.maxLevel;

  openModal(`
    <div class="md__head">
      <div class="md__face" id="md-zoom"><img src="${CONFIG.charDir}${cid}.jpg" alt=""></div>
      <div>
        <div class="md__title">${c.name} ${charStars(c)}</div>
        <div class="md__sub">${elemBadge(c.elem, 'elem--sm')} ${c.title} ／ Lv.${own.lv}${maxed ? '（最大）' : ''}
          ／ <b class="crank">ランク ${charRank(cid)}</b> / ${CONFIG.maxCharRank}</div>
        <div class="md__rank">
          ${charRankStars(cid)}
          <small>基礎ステータス <b class="up">+${Math.round((charRankMul(cid) - 1) * 100)}%</b>
          ${charRank(cid) < CONFIG.maxCharRank
            ? `／ 同じ仲間を引くとランクが上がる（喪失スキルでは下がらない）`
            : '／ これ以上は深まらない'}</small>
        </div>
        <div class="md__desc">${c.desc}</div>
      </div>
    </div>

    ${c.skill ? `<div class="md__skill${skillUsesOf(cid) <= 0 ? ' is-locked' : ''}">
      <b>${c.skill.name}</b>
      <small>${c.skill.desc}<br>${skillUsesOf(cid) > 0
        ? `1戦闘で <b class="up">${skillUsesOf(cid)}</b> 回まで使える。`
        : '風景の記憶を装備すると使えるようになる。'}</small>
    </div>` : ''}

    ${c.lost ? `<div class="md__skill md__skill--lost${canLost(cid) ? '' : ' is-locked'}">
      <b>${c.lost.name}<span class="md__lostmark">喪失スキル</span></b>
      <small>${c.lost.desc}<br>${canLost(cid)
        ? `<b class="lost">HPが半分を下回ると</b>撃てる。撃つと <b class="lost">レベルが ${CONFIG.lostLevelCost} 下がる</b>（Lv.${own.lv} → Lv.${Math.max(1, own.lv - CONFIG.lostLevelCost)}）。装備がなくても使える。`
        : `Lv.${CONFIG.lostMinLevel} 以上で使えるようになる。`}</small>
    </div>` : ''}

    <div class="md__exp">
      <div class="bar"><span style="width:${maxed ? 100 : (own.exp / need * 100)}%"></span></div>
      <small>${maxed ? 'これ以上は成長しない' : `次のレベルまで ${need - own.exp} EXP`}</small>
    </div>

    <div class="md__stats">
      <div class="md__stat"><span>HP</span><b>${st.hp}</b>${eq ? `<i>+${eq.bonus.hp}</i>` : ''}</div>
      <div class="md__stat"><span>こうげき</span><b>${st.atk}</b>${eq ? `<i>+${eq.bonus.atk}</i>` : ''}</div>
      <div class="md__stat"><span>ぼうぎょ</span><b>${st.def}</b>${eq ? `<i>+${eq.bonus.def}</i>` : ''}</div>
    </div>

    <div class="md__label">装備している景色</div>
    ${eq ? `<div class="md__eq">
              <img src="${CONFIG.landDir}${eq.file}" alt="">
              <div>
                <b>${eq.name}</b> ${rankStars(landRank(eq.id))}
                <small>HP +${st.eqBonus.hp}／こうげき +${st.eqBonus.atk}／ぼうぎょ +${st.eqBonus.def}<br>
                スキルを <b class="up">${landRank(eq.id)}</b> 回使える<br>
                ${landEffText(eq, landRank(eq.id))}</small>
              </div>
            </div>`
          : `<div class="md__warn">風景の記憶を装備していないため、<b>スキルが使えません</b>。</div>`}
    <div class="md__row">
      <button type="button" class="btn btn--sub" id="md-equip">
        ${eq ? '別の景色にする' : '景色を装備する'}
      </button>
      ${eq ? `<button type="button" class="btn btn--sub" id="md-unequip">はずす</button>` : ''}
    </div>

    <div class="md__label">パーティ</div>
    <div class="md__row">
      <button type="button" class="btn btn--sub" id="md-party">
        ${inParty ? 'パーティから外す' : 'パーティに加える'}
      </button>
      <button type="button" class="btn btn--sub" id="md-reserve">
        ${S.reserve === cid ? '控えから外す' : '控えにする'}
      </button>
      <button type="button" class="btn btn--sub" id="md-zoom-btn">拡大して見る</button>
    </div>
  `);

  const zoomChar = () => openViewer(CONFIG.charDir + cid + '.jpg', c.name, `${c.title}${charStarText(c)}`);
  $('md-zoom').onclick = zoomChar;
  $('md-zoom-btn').onclick = zoomChar;
  $('md-equip').onclick = () => openEquipModal(cid);
  if ($('md-unequip')) $('md-unequip').onclick = () => {
    S.chars[cid].eq = null; save(); closeModal(); renderParty(); toast('装備を外した');
  };
  $('md-party').onclick = () => {
    if (inParty) {
      S.party = S.party.filter((x) => x !== cid);
    } else {
      if (S.party.length >= CONFIG.partySize) { toast(`パーティは${CONFIG.partySize}人までです`); return; }
      if (S.reserve === cid) S.reserve = null;
      S.party.push(cid);
    }
    save(); closeModal(); renderParty();
  };
  $('md-reserve').onclick = () => {
    if (S.reserve === cid) {
      S.reserve = null;
    } else {
      S.party = S.party.filter((x) => x !== cid);
      S.reserve = cid;
    }
    save(); closeModal(); renderParty();
  };
}

function openEquipModal(cid) {
  const owned = ownedLands();
  if (!owned.length) {
    toast('まだ景色を持っていません');
    return;
  }
  openModal(`
    <div class="md__title">装備する景色をえらぶ</div>
    <div class="md__sub">1枚の景色を装備できるのは1人だけ。<br>
      ランクの数だけスキルが使えます（同じ景色を引くとランクが上がります）</div>
    <div class="md__label">所持している景色 ${owned.length} / ${LANDSCAPES.length}</div>
    <div class="eqpick" id="eqpick"></div>
  `);
  const wrap = $('eqpick');
  owned.forEach((l) => {
    const holder = equippedBy(l.id);
    const used = holder && holder !== cid;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'bcard is-got' + (used ? ' is-used' : '');
    const rk = landRank(l.id);
    const bn = landBonus(l, rk);
    b.innerHTML = `<img src="${CONFIG.landDir}${l.file}" alt="">
      <span class="bcard__rank">技${rk}回</span>
      <span class="bcard__cap">${l.name}<br>HP+${bn.hp} 攻+${bn.atk} 防+${bn.def}
        ${l.eff && LAND_EFFECTS[l.eff.type] ? `<br><i class="bcard__eff">${LAND_EFFECTS[l.eff.type].name}</i>` : ''}</span>`;
    b.onclick = () => {
      if (used) {
        const holderName = charById(holder).name;
        if (!confirm(`「${l.name}」は ${holderName} が装備しています。付け替えますか？`)) return;
        S.chars[holder].eq = null;
      }
      S.chars[cid].eq = l.id;
      save(); closeModal(); renderParty();
      toast(`「${l.name}」を装備した`);
    };
    wrap.appendChild(b);
  });
}

function renderBook() {
  const got = ownedLands().length;
  $('book-count').textContent = `${got} / ${LANDSCAPES.length}`;
  const list = $('booklist');
  list.innerHTML = '';
  LANDSCAPES.forEach((l, i) => {
    const has = !!S.lands[l.id];
    const holder = equippedBy(l.id);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'bcard' + (has ? ' is-got' : '');
    card.innerHTML = has
      ? `<img src="${CONFIG.landDir}${l.file}" alt="">
         ${holder ? `<span class="bcard__eq">装備</span>` : ''}
         <span class="bcard__rank">技${landRank(l.id)}回</span>
         <span class="bcard__cap">${l.name}<br>${rankStars(landRank(l.id))}</span>`
      : `<span class="bcard__num">${String(i + 1).padStart(2, '0')}</span>`;
    card.onclick = has ? () => openLandModal(l) : () => toast('まだ見ぬ景色');
    list.appendChild(card);
  });

  const ochars = ownedChars().length;
  $('book-char-count').textContent = `${ochars} / ${CHARACTERS.length}`;
  const clist = $('bookchars');
  clist.innerHTML = '';
  CHARACTERS.forEach((c) => {
    const has = !!S.chars[c.id];
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'bcard' + (has ? ' is-got' : '');
    card.innerHTML = has
      ? `<img src="${CONFIG.charDir}${c.id}.jpg" alt="">
         <span class="bcard__cap">${c.name}${charStars(c) ? '<br>' + charStars(c) : ''}</span>`
      : `<span class="bcard__num">？</span>`;
    card.onclick = has ? () => openCharModal(c.id) : () => toast('まだ出会っていません');
    clist.appendChild(card);
  });
}

function openLandModal(l) {
  const holder = equippedBy(l.id);
  openModal(`
    <div class="md__head">
      <div class="md__face" id="md-zoom" style="aspect-ratio:var(--land-ratio);width:96px">
        <img src="${CONFIG.landDir}${l.file}" alt="">
      </div>
      <div>
        <div class="md__title">${l.name}</div>
        <div class="md__sub">${rankStars(landRank(l.id))} ランク ${landRank(l.id)} / ${CONFIG.maxLandRank}</div>
        <div class="md__desc">
          HP +${landBonus(l, landRank(l.id)).hp}／こうげき +${landBonus(l, landRank(l.id)).atk}／ぼうぎょ +${landBonus(l, landRank(l.id)).def}<br>
          装備した子は<b class="up">スキルを ${landRank(l.id)} 回</b>使えます<br>
          ${landEffText(l, landRank(l.id))}<br>
          ${landRank(l.id) < CONFIG.maxLandRank
            ? `<span class="dim">次のランクなら HP +${landBonus(l, landRank(l.id) + 1).hp}／攻 +${landBonus(l, landRank(l.id) + 1).atk}／防 +${landBonus(l, landRank(l.id) + 1).def}、技 ${landRank(l.id) + 1} 回</span>`
            : '<span class="up">これ以上は深まらない</span>'}<br>
          ${holder ? `${charById(holder).name} が装備中` : '誰も装備していない'}
        </div>
      </div>
    </div>
    <div class="md__row">
      <button type="button" class="btn btn--sub" id="md-zoom-btn">拡大して見る</button>
    </div>
  `);
  const open = () => openViewer(CONFIG.landDir + l.file, l.name, `${'★'.repeat(l.rarity)}　HP+${l.bonus.hp} 攻+${l.bonus.atk} 防+${l.bonus.def}`);
  $('md-zoom').onclick = open;
  $('md-zoom-btn').onclick = open;
}

function stageUnlocked(i) {
  if (i === 0) return true;
  return !!S.cleared[ENEMIES[i - 1].id];
}

function metEnemy(eid) {
  if (!S) return false;
  if (S.cleared && S.cleared[eid]) return true;
  return !!(S.met && S.met[eid]);
}
function markMet(eid) {
  if (!S) return;
  if (!S.met) S.met = {};
  if (S.met[eid]) return;
  S.met[eid] = 1;
  save();
}

function ultNote(e) {
  if (!e.ult) return '';
  if (e.forget) {
    const at = (e.forget.ultAt || []).join('・');
    return ` ／ <b>経過${e.forget.cap}年で敗北</b>${at ? ` ／ 経過${at}年を越えると <b>${e.ult.name}</b>` : ''}`;
  }
  return ` ／ 崩壊100%で <b>${e.ult.name}</b>`;
}

function renderStages() {
  const wrap = $('stages');
  wrap.innerHTML = '';
  ENEMIES.forEach((e, i) => {
    const open = stageUnlocked(i);
    const cleared = !!S.cleared[e.id];

    const met = metEnemy(e.id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'stage' + (open && e.image ? ' has-art' : '') + (open && !met ? ' is-unmet' : '');
    b.disabled = !open;
    b.innerHTML = `
      ${open && e.image ? `<span class="stage__art" style="background-image:url(${e.image})"></span>` : ''}
      ${cleared ? '<span class="stage__clear">討伐済</span>'
                : (!open ? '<span class="stage__lock">未到達</span>' : '')}
      <div class="stage__label">${e.label}</div>
      <div class="stage__name">${open ? `${elemBadge(e.elem, 'elem--sm')} ${e.name}` : '？？？'}</div>
      ${!open ? '<div class="stage__desc">ひとつ前の敵を倒すと道が開ける。</div>' : ''}
      ${open && met ? `<div class="stage__desc">${e.desc}</div>
                <div class="stage__stats">HP ${e.hp} ／ こうげき ${e.atk} ／ ぼうぎょ ${e.def}${e.aoeEvery ? ` ／ ${e.aoeEvery}ターンごとに全体攻撃` : ''}${ultNote(e)}</div>
                <div class="stage__skills">技：${(e.skills || (e.skill ? [e.skill] : [])).map((k) => k.name).join('・')}</div>
                <div class="stage__reward">報酬 EXP ${rewardExp(e)} ／ 記憶の欠片 ${rewardShards(e)}</div>` : ''}
    `;
    if (open) {
      const nw = document.createElement('span');
      nw.className = 'stage__tale' + (taleSeen(e.id) ? '' : ' is-new');
      nw.textContent = taleSeen(e.id) ? '物語' : 'まだ見ぬ物語';
      b.appendChild(nw);
    }
    b.onclick = () => {
      if (!S.party.length) { toast('パーティに誰もいません'); return; }
      openTale(e.id);
    };
    wrap.appendChild(b);
  });
}

let taleEid = null;
let afterOut = null;

function taleHash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
  return h >>> 0;
}

function pairKeyOf(a, b) {
  const order = CHARACTERS_ALL.map((c) => c.id);
  return order.indexOf(a) < order.indexOf(b) ? `${a}|${b}` : `${b}|${a}`;
}

function taleParty() {
  return (S.party || []).filter((id) => S.chars[id] && charById(id)).slice(0, CONFIG.partySize);
}

function taleCode(eid) {
  const ei = ENEMIES_ALL.findIndex((e) => e.id === eid);
  let mask = 0;
  taleParty().forEach((id) => {
    const i = CHARACTERS_ALL.findIndex((c) => c.id === id);
    if (i >= 0) mask |= (1 << i);
  });
  return ei * 4096 + mask;
}
function taleSeen(eid) { return (S.taleSeen || []).indexOf(taleCode(eid)) >= 0; }
function markTaleSeen(eid) {
  if (!S.taleSeen) S.taleSeen = [];
  const c = taleCode(eid);
  if (S.taleSeen.indexOf(c) >= 0) return;
  S.taleSeen.push(c);
  if (S.taleSeen.length > 400) S.taleSeen = S.taleSeen.slice(-400);
  save();
}

function buildTale(eid) {
  const e = enemyById(eid);
  const t = TALE_ENEMY[eid] || { chapter: '', place: '', lead: [], ask: '' };
  const party = taleParty();
  const seed = taleHash(eid + '#' + party.slice().sort().join(','));

  const voices = party.map((cid) => {
    const c = charById(cid);
    const v = (CHAR_TALE[cid] || {})[eid];
    return {
      cid, name: c.name, elem: c.elem,
      act: v ? v.act : `${c.name}は何も言わず、その景色を見ていた。`,
      line: v ? v.line : '……行こう',
    };
  });

  let pair = null;
  const keys = [];
  for (let i = 0; i < party.length; i++) {
    for (let j = i + 1; j < party.length; j++) {
      const k = pairKeyOf(party[i], party[j]);
      if (PAIR_TALE[k]) keys.push(k);
    }
  }
  if (keys.length) {
    const k = keys[seed % keys.length];
    const ab = k.split('|');
    pair = [
      { name: charById(ab[0]).name, line: PAIR_TALE[k][0] },
      { name: charById(ab[1]).name, line: PAIR_TALE[k][1] },
    ];
  }

  const els = party.map((id) => charById(id).elem);
  const weak = els.filter((x) => isStrong(x, e.elem)).length;
  const resist = els.filter((x) => isStrong(e.elem, x)).length;
  const uniq = new Set(els).size;
  let ck;
  if (party.length <= 1) ck = 'solo';
  else if (party.length === 2) ck = 'duo';
  else if (weak === party.length) ck = 'allWeak';
  else if (uniq === 3) ck = 'triElem';
  else if (uniq === 1) ck = 'allSame';
  else if (resist === party.length) ck = 'allResist';
  else if (weak > 0) ck = 'someWeak';
  else ck = 'mixed';

  const pAtk = party.reduce((n, id) => n + statsOf(id).atk, 0);
  const turns = e.hp / Math.max(1, pAtk - e.def * Math.max(1, party.length));
  const pk = turns > 14 ? 'under' : (turns < 5 ? 'over' : 'even');

  const rid = S.reserve && S.chars[S.reserve] && charById(S.reserve) ? S.reserve : null;
  const rv = rid ? (CHAR_TALE[rid] || {})[eid] : null;
  const reserve = rid ? { name: charById(rid).name, line: rv ? rv.line : '……先に行っていて' } : null;

  return {
    e, chapter: t.chapter, place: t.place, lead: t.lead || [], ask: t.ask || '',
    voices, pair, reserve,
    close: TALE_CLOSE[ck] || '', power: TALE_POWER[pk] || '',
    isNew: !taleSeen(eid),
  };
}

function renderTale(eid) {
  resetTaleButtons();
  renderTaleBody(buildTale(eid));
}

function taleParas(v) {
  if (v == null) return '';
  const arr = Array.isArray(v) ? v : [v];
  const out = [];
  arr.forEach((t) => {
    String(t == null ? '' : t).split('\n').forEach((line) => out.push(line.trim()));
  });

  while (out.length && !out[0]) out.shift();
  while (out.length && !out[out.length - 1]) out.pop();
  return out.map((t) => (t ? `<p>${escapeHtml(t)}</p>` : '<p class="tale__gap"></p>')).join('');
}

function renderTaleBody(d) {
  const e = d.e;
  const say = (name, line, cls) =>
    `<div class="tale__say ${cls || ''}"><b>${escapeHtml(name)}</b><span>「${escapeHtml(line)}」</span></div>`;

  $('tale-body').innerHTML = `
    ${e.image ? `<div class="tale__art"><img src="${e.image}" alt=""></div>` : ''}
    <div class="tale__head">
      <div class="tale__chapter">${escapeHtml(d.chapter)}${d.isNew ? '<span class="tale__new">はじめて見る物語</span>' : ''}</div>
      <div class="tale__place">${escapeHtml(d.place)}</div>
      <div class="tale__enemy">${elemBadge(e.elem, 'elem--sm')} ${escapeHtml(e.name)}<small>${escapeHtml(e.label || '')}</small></div>
    </div>

    <div class="tale__lead">${taleParas(d.lead)}</div>
    <div class="tale__ask">${taleParas(d.ask)}</div>

    <div class="tale__voices">
      ${d.voices.map((v) => `
        <div class="tale__voice">
          <div class="tale__face"><img src="${CONFIG.charDir}${v.cid}.jpg" alt=""></div>
          <div class="tale__words">
            <div class="tale__act">${escapeHtml(v.act)}</div>
            ${say(v.name, v.line)}
          </div>
        </div>`).join('')}
    </div>

    ${d.pair ? `<div class="tale__pair">
      ${say(d.pair[0].name, d.pair[0].line, 'is-a')}
      ${say(d.pair[1].name, d.pair[1].line, 'is-b')}
    </div>` : ''}

    ${d.reserve ? `<div class="tale__reserve">${d.after ? '後方から ' + escapeHtml(d.reserve.name) + ' が歩いてくる。' : '後方には ' + escapeHtml(d.reserve.name) + ' が控えている。'}<span>「${escapeHtml(d.reserve.line)}」</span></div>` : ''}

    <div class="tale__close">
      <p>${escapeHtml(d.close)}</p>
      <p>${escapeHtml(d.power)}</p>
    </div>
  `;
}

function openTale(eid) {
  taleEid = eid;
  renderTale(eid);
  go('tale');
  $('screen-tale').scrollTop = 0;
}

function battleOutcome() {
  if (!B) return { key: 'normal', turn: 0, first: false };
  const fell = B.units.some((u) => u.hp <= 0) || !!B._anyDown;
  let key = 'normal';
  if (B.oathUsed) key = 'oath';
  else if (B.ultUsed) key = 'ult';
  else if (B.reserveIn) key = 'swapped';
  else if (fell) key = 'fell';
  else if (B.turn <= (CONFIG.afterQuickTurn || 3)) key = 'quick';
  else if (B.turn >= (CONFIG.afterLongTurn || 15)) key = 'long';
  else if (!fell) key = 'noLoss';
  return { key, turn: B.turn, first: !S.cleared[B.e.id] };
}

function buildAfterTale(eid, out) {
  const e = enemyById(eid);
  const t = (typeof TALE_AFTER !== 'undefined' && TALE_AFTER[eid]) || { chapter: '', place: '', lead: [], ask: '' };
  const party = taleParty();
  const seed = taleHash(eid + '@after#' + party.slice().sort().join(','));

  const voices = party.map((cid) => {
    const c = charById(cid);
    const v = (typeof CHAR_AFTER !== 'undefined' && (CHAR_AFTER[cid] || {})[eid]) || null;
    return {
      cid, name: c.name, elem: c.elem,
      act: v ? v.act : `${c.name}は何も言わず、その景色を見ていた。`,
      line: v ? v.line : '……行こう',
    };
  });

  let pair = null;
  const keys = [];
  for (let i = 0; i < party.length; i++) {
    for (let j = i + 1; j < party.length; j++) {
      const k = pairKeyOf(party[i], party[j]);
      if (typeof PAIR_AFTER !== 'undefined' && PAIR_AFTER[k]) keys.push(k);
    }
  }
  if (keys.length) {
    const k = keys[seed % keys.length];
    const ab = k.split('|');
    pair = [
      { name: charById(ab[0]).name, line: PAIR_AFTER[k][0] },
      { name: charById(ab[1]).name, line: PAIR_AFTER[k][1] },
    ];
  }

  const rid = S.reserve && S.chars[S.reserve] && charById(S.reserve) ? S.reserve : null;
  const rv = rid && typeof CHAR_AFTER !== 'undefined' ? (CHAR_AFTER[rid] || {})[eid] : null;
  const reserve = rid ? { name: charById(rid).name, line: rv ? rv.line : '……無事でなにより' } : null;

  const close = (typeof AFTER_CLOSE !== 'undefined' && AFTER_CLOSE[out.key]) || '';
  const gain = (typeof AFTER_GAIN !== 'undefined' && AFTER_GAIN[out.first ? 'first' : 'again']) || '';

  return {
    e, chapter: t.chapter, place: t.place, lead: t.lead || [], ask: t.ask || '',
    voices, pair, reserve, close, power: gain, isNew: false, after: true,
  };
}

function openAfterTale(eid, out) {
  afterOut = out;
  taleEid = eid;
  renderTaleBody(buildAfterTale(eid, out));
  $('btn-tale-go').textContent = '結果を見る';
  $('btn-tale-skip').hidden = true;
  go('after');
  $('screen-tale').scrollTop = 0;
}

let endingPending = false;

function renderEnding() {
  const d = (typeof ENDING !== 'undefined' && ENDING) || {};
  setUiBg('ending-bg', d.bg || '');
  const party = (S.party || []).filter((cid) => cid && S.chars[cid] && charById(cid));
  const rid = S.reserve && S.chars[S.reserve] && charById(S.reserve) ? S.reserve : null;
  const all = rid && !party.includes(rid) ? party.concat([rid]) : party;
  const names = all.map((cid) => charById(cid).name).join('・');

  const partyBlock = (d.party && all.length)
    ? `<p>${escapeHtml(d.party.replace('{names}', names))}</p>
       <div class="ending__party">${all.map((cid) =>
         `<div class="ending__face"><img src="${CONFIG.charDir}${cid}.jpg" alt=""></div>`).join('')}</div>`
    : '';

  $('ending-body').innerHTML = `
    <div class="ending__chapter">${escapeHtml(d.chapter || '')}</div>
    <div class="ending__place">${escapeHtml(d.place || '')}</div>
    <div class="ending__lead">
      ${(d.lead || []).map((t) => `<p>${escapeHtml(t)}</p>`).join('')}
      ${partyBlock}
    </div>
    <div class="ending__close">${(d.close || []).map((t) => `<p>${escapeHtml(t)}</p>`).join('')}</div>
    <div class="ending__last">${escapeHtml(d.last || '')}</div>
  `;
  $('btn-ending-go').textContent = d.btn || 'スタッフロールへ';
  $('btn-ending-back').textContent = d.btnBack || '拠点へもどる';

  $('btn-ending-back').hidden = endingPending;
}

function openEnding(fromBattle) {
  endingPending = !!fromBattle;
  renderEnding();
  go('ending');
  $('screen-ending').scrollTop = 0;
}

let creditsT = null;

function creditsPoem() {
  try { return poemFromKana(encodeMemory(S)); } catch (e) { return ''; }
}

function renderCredits() {
  const d = (typeof CREDITS !== 'undefined' && CREDITS) || {};
  setUiBg('credits-bg', d.bg || '');
  const item = (it) => {
    if (!it) return '';
    if (it.kind === 'space') return `<div style="height:${Number(it.value) || 40}px"></div>`;
    const cls = { title: 'credits__title', sub: 'credits__sub', role: 'credits__role',
                  name: 'credits__name', text: 'credits__text' }[it.kind] || 'credits__text';
    return `<div class="credits__item ${cls}">${escapeHtml(String(it.value == null ? '' : it.value))}</div>`;
  };
  const poem = creditsPoem();
  $('credits-roll').innerHTML = `
    ${(d.roll || []).map(item).join('')}
    <div class="credits__last">
      ${(d.last || []).map((t) => `<p class="credits__lastline">${escapeHtml(t)}</p>`).join('')}
      ${poem ? `<div class="credits__poem">
        <div class="credits__poemhead">${escapeHtml(d.poemHead || '')}</div>
        <div class="credits__poembox">${escapeHtml(poem)}</div>
        <div class="credits__poemnote">${escapeHtml(d.poemNote || '')}</div>
      </div>` : ''}
    </div>
  `;
  $('btn-credits-skip').textContent = d.btnSkip || '最後まで送る';
  $('btn-credits-ok').textContent = d.btnEnd || 'おわり';
}

function startCredits() {
  const d = (typeof CREDITS !== 'undefined' && CREDITS) || {};
  const stage = $('credits-stage');
  const roll = $('credits-roll');
  const h = stage.clientHeight;

  stage.style.setProperty('--credits-stage-h', h + 'px');

  $('btn-credits-skip').hidden = false;
  $('btn-credits-ok').hidden = true;

  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) { creditsDone(); return; }

  roll.style.transition = 'none';
  roll.style.transform = `translateY(${h}px)`;
  void roll.offsetWidth;

  const dist = Math.max(0, roll.scrollHeight - h);
  const speed = Math.max(10, d.speed || 60);
  const ms = Math.round((h + dist) / speed * 1000);
  roll.style.transition = `transform ${ms}ms linear`;
  roll.style.transform = `translateY(${-dist}px)`;
  clearTimeout(creditsT);
  creditsT = setTimeout(creditsDone, ms + 60);
}

function creditsDone() {
  clearTimeout(creditsT); creditsT = null;
  const stage = $('credits-stage');
  const roll = $('credits-roll');
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm) {
    const dist = Math.max(0, roll.scrollHeight - stage.clientHeight);

    let now = 0;
    const t = getComputedStyle(roll).transform;
    if (t && t !== 'none') {
      const m = t.match(/matrix(3d)?\(([^)]+)\)/);
      if (m) {
        const v = m[2].split(',').map(Number);
        now = m[1] ? v[13] : v[5];
      }
    }
    roll.style.transition = 'none';
    roll.style.transform = `translateY(${now}px)`;
    void roll.offsetWidth;
    roll.style.transition = 'transform .5s ease-out';
    roll.style.transform = `translateY(${-dist}px)`;
  }
  $('btn-credits-skip').hidden = true;
  $('btn-credits-ok').hidden = false;
}

function stopCredits() {
  clearTimeout(creditsT); creditsT = null;
  const roll = $('credits-roll');
  if (roll) { roll.style.transition = 'none'; roll.style.transform = 'translateY(0)'; }
}

function openCredits() {
  renderCredits();
  go('credits');

  requestAnimationFrame(() => requestAnimationFrame(startCredits));
}

function resetTaleButtons() {
  $('btn-tale-go').textContent = 'この景色へ進む';
  $('btn-tale-skip').hidden = false;
}

let B = null;

function makeUnit(cid) {
  if (!cid || !S.chars[cid]) return null;
  const st = statsOf(cid);
  const uses = skillUsesOf(cid);
  const eff = landEffOf(cid);
  const u = { cid, name: charById(cid).name, elem: charById(cid).elem,
              hp: st.hp, max: st.hp,
              atk: st.atk, def: st.def, action: 'attack',
              skillLeft: uses, skillMax: uses, eff, shield: 0, seal: 0,
              charge: 0, chant: 0,
              revivePick: null,

              st: { dmg: 0, taken: 0, act: { attack: 0, own: 0, skill: 0, lost: 0 } } };
  if (eff && eff.type === 'shield') u.shield = Math.round(st.hp * eff.value);
  return u;
}

function landTurnEffects() {
  if (!B || B.over) return;
  const notes = [];

  B.units.forEach((u, i) => {
    if (u.hp <= 0) return;
    const rg = effOf(u, 'regen');
    if (rg > 0) {
      const got = healUnit(u, i, Math.round(rg), true);
      if (got > 0) notes.push(`<span class="eff">${effName('regen')}</span> ${u.name} <span class="heal">+${got}</span>`);
    }
    const hp = effOf(u, 'healParty');
    if (hp > 0) {
      let total = 0;
      B.units.forEach((t, ti) => { if (t.hp > 0) total += healUnit(t, ti, Math.round(t.max * hp), true); });
      if (total > 0) notes.push(`<span class="eff">${effName('healParty')}</span> 味方全員 <span class="heal">+${total}</span>`);
    }
    const rc = effOf(u, 'recall');
    if (rc > 0 && u.skillMax > 0 && u.skillLeft < u.skillMax && Math.random() < rc) {
      u.skillLeft++;
      notes.push(`<span class="eff">${effName('recall')}</span> ${u.name} の技が1回もどった`);
    }
  });

  if (notes.length) pushLog(notes.join('　／　'));
  flushPops();
}

function applyGuardOthers() {
  if (!B) return;
  B.units.forEach((u) => { u.def = u.defBase != null ? u.defBase : (u.defBase = u.def); });
  B.units.forEach((giver, gi) => {
    const v = effOf(giver, 'guardOthers');
    if (!v) return;
    B.units.forEach((t, ti) => { if (ti !== gi) t.def = Math.round(t.def * (1 + v)); });
  });
}

function canSwap() {
  return !!(B && B.reserve && !B.over && B.units.some((u) => u.hp <= 0));
}

function bringReserve() {

  if (!B || !B.reserve || B.reserve.hp <= 0) return false;
  const center = Math.min(1, B.units.length - 1);
  pushLog('<b>——まだ終わっていない</b>');
  return swapReserve(center, true);
}

function swapReserve(i, forced) {
  if (!B || !B.reserve) return false;

  if (B.reserve.hp <= 0) { toast(`${B.reserve.name} も倒れている`); return false; }
  const u = B.units[i];
  if (!forced && (!u || u.hp > 0)) { toast('倒れた仲間とだけ交代できます'); return false; }

  const gone = u ? u.name : '';

  const nu = B.reserve;
  B.units[i] = nu;
  B.reserve = (u && u.hp <= 0) ? u : null;
  B.reserveIn = true;
  nu.action = 'attack';
  applyGuardOthers();
  Sound.play('common/heal');
  pushLog(`<b>${nu.name}</b> が ${gone} と交代して前に出た`);
  renderBattle();

  speakUnit(i, 'join', true);
  flushPops();
  const card = document.querySelectorAll('#units .unit')[i];
  if (card) { card.classList.remove('is-swapin'); void card.offsetWidth; card.classList.add('is-swapin'); }
  toast(`${nu.name} が加わった`);
  return true;
}

function stealLostSkills(e) {
  const st = e && e.steal;
  if (!st || typeof STOLEN_SKILLS === 'undefined' || !S || !S.chars) return null;
  const out = [];
  const used = {};
  (S.party || []).forEach((cid) => { if (cid) used[cid] = 1; });
  if (S.reserve) used[S.reserve] = 1;

  const pool = Object.keys(S.chars).filter((cid) => !used[cid] && STOLEN_SKILLS[cid] && charById(cid));
  if (!pool.length) return null;

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
  }
  const n = Math.max(1, st.count || 2);
  pool.slice(0, n).forEach((cid, i) => {
    const sk = Object.assign({}, STOLEN_SKILLS[cid]);
    sk.every = (st.every || 4) + i;
    sk.stolenFrom = cid;
    out.push(sk);
  });
  return out.length ? out : null;
}

function startBattle(eid) {
  markMet(eid);
  clearEnemyLine();
  clearWinFade();
  let e = enemyById(eid);

  const stolen = stealLostSkills(e);
  if (stolen) {
    e = Object.assign({}, e);
    e.skills = (e.skills || []).concat(stolen);
  }
  B = {
    e,
    stolen: stolen ? stolen.map((s) => s.stolenFrom) : [],
    ehp: e.hp,
    ehpMax: e.hp,
    pinch: false,
    halfDone: false,
    skipEnemyTurn: false,
    rageShown: null,

    years: 0,
    yearsShown: null,
    yearsOver: false,
    ultAtDone: {},
    cover: null,
    parry: null,
    recording: null,
    recorded: {},
    ultUsed: false,
    oathUsed: false,
    _anyDown: false,
    spoke: false,
    lostFree: false,
    lostFlash: false,
    turn: 1,
    busy: false,
    over: false,
    units: S.party.map(makeUnit),
    reserve: makeUnit(S.reserve),
    reserveIn: false,
    swapUsed: false,
    swapPick: false,

    pickRevive: null,

    fallen: [],
    atkUp: 0,
    atkUpRate: 0,
    critUp: 0,
    critUpMul: 1,
    burn: 0,
    burnRate: 0,
    defDown: 0,
    defDownRate: 0,
    atkDown: 0,
    atkDownRate: 0,
    eAtkUp: 0,
    eAtkUpRate: 0,
    eSilence: 0,
    pAtkDown: 0,
    pAtkDownRate: 0,
    guardAll: 0,
    rageBack: 0,
    lostUsed: [],
    log: [],
    history: [],
  };

  applyGuardOthers();

  const leadEq = S.chars[S.party[0]] && S.chars[S.party[0]].eq;
  const owned = ownedLands();
  const bgLand = leadEq ? landById(leadEq) : (owned.length ? owned[0] : null);
  $('battle-bg').style.backgroundImage = bgLand ? `url(${CONFIG.landDir}${bgLand.file})` : 'none';

  const oldPop = $('enemy').querySelector('.enemy__pop');
  if (oldPop) oldPop.remove();
  $('enemyfx').innerHTML = '';
  $('unitfx').innerHTML = '';
  pendingPops = [];
  pendingHits = [];
  clearBubbles();
  $('screen-battle').classList.remove('is-shake', 'is-shake-hard');
  clearTimeout(rageFlashTimer);
  clearGrandEntry();
  $('enemy-rageline').classList.remove('is-rise', 'is-full');

  $('enemy-label').textContent = e.label;
  $('enemy-name').textContent = e.name;
  const be = $('enemy-elem');
  be.className = 'elem elem--sm' + (e.elem ? ' elem--' + e.elem : '');
  be.textContent = ELEMENTS[e.elem] ? ELEMENTS[e.elem].name : '';
  be.hidden = !e.elem;
  const body = $('enemy-body');
  body.className = 'enemy__body' + (e.image ? ' has-img' : '');
  body.style.color = e.color;
  body.style.background = e.image
    ? `#0b0d12 center/cover no-repeat url(${e.image})`
    : `radial-gradient(circle at 38% 32%, ${e.color}, #0b0d12 78%)`;
  body.style.setProperty('--enemy-color', e.color);

  playGrandEntry(e);

  pushLog(`<b>${e.name}</b> が立ちはだかった`);

  if (e.forget) {

    const f = e.forget;
    const fill = (t) => String(t || '')
      .replace(/\{cap\}/g, f.cap).replace(/\{own\}/g, f.ownBack)
      .replace(/\{skill\}/g, f.skillBack).replace(/\{lost\}/g, f.lostBack);
    if (f.note || f.noteHow) {
      pushLog(`<span class="ult">経過ゲージ</span>　${escapeHtml(fill(f.note))}　`
            + `<span class="eff">${escapeHtml(fill(f.noteHow))}</span>`);
    }
    if (f.noteToast) toast(fill(f.noteToast), 4200);
  }
  renderBattle();
  go('battle');
  playEnemyEntry();

  setTimeout(() => {
    if (!B || B.over || current !== 'battle') return;
    speakUnit(someAliveUnit(), 'start', true);
    flushPops();
  }, (CONFIG.skillCutMs || 0) + 700);
}

let grandEntryT = null;
let grandEntryT2 = null;
function clearGrandEntryArt() {
  clearTimeout(grandEntryT); grandEntryT = null;
  const body = $('enemy-body');
  if (body) {
    body.classList.remove('is-entering');
    body.style.removeProperty('--entry-ms');
    body.style.removeProperty('--entry-scale');
  }
}
function clearGrandEntry() {
  clearGrandEntryArt();
  clearTimeout(grandEntryT2); grandEntryT2 = null;
  const wrap = $('enemy');
  if (wrap) {
    wrap.classList.remove('is-entry');
    wrap.style.removeProperty('--entry-wait-ms');
    wrap.style.removeProperty('--entry-text-ms');
  }
}
function grandEntryMs(e) {
  return (e && e.grandEntry) ? (CONFIG.grandEntryMs == null ? 0 : CONFIG.grandEntryMs) : 0;
}

function grandEntryTextWait(e) {
  if (grandEntryMs(e) <= 0) return 0;
  return CONFIG.grandEntryTextWaitMs == null ? 0 : CONFIG.grandEntryTextWaitMs;
}

function grandEntryTextMs(e) {
  if (grandEntryMs(e) <= 0) return 0;
  return CONFIG.grandEntryTextMs == null ? 0 : CONFIG.grandEntryTextMs;
}

function grandEntryTotal(e) {
  return Math.max(grandEntryMs(e), grandEntryTextWait(e) + grandEntryTextMs(e));
}

function playGrandEntry(e) {
  clearGrandEntry();
  const ms = grandEntryMs(e);
  if (ms <= 0) return;
  const tms = grandEntryTextMs(e);
  const body = $('enemy-body');
  const wrap = $('enemy');
  if (!body) return;
  body.style.setProperty('--entry-ms', ms + 'ms');
  body.style.setProperty('--entry-scale', String(CONFIG.grandEntryScale || 2.4));
  void body.offsetWidth;
  body.classList.add('is-entering');

  if (wrap && tms > 0) {
    wrap.style.setProperty('--entry-wait-ms', grandEntryTextWait(e) + 'ms');
    wrap.style.setProperty('--entry-text-ms', tms + 'ms');
    void wrap.offsetWidth;
    wrap.classList.add('is-entry');
  }

  grandEntryT  = setTimeout(clearGrandEntryArt, ms + 40);
  grandEntryT2 = setTimeout(clearGrandEntry, grandEntryTotal(e) + 80);
}

function playEnemyEntry() {
  const e = B.e;
  const lines = (e.entryLines && e.entryLines.length ? e.entryLines
                : (e.skill && e.skill.lines) || []);
  if (!lines.length || !(CONFIG.skillCutMs > 0)) return;

  B.busy = true;
  renderBattle();

  setTimeout(() => {
    if (!B || B.over) return;
    Sound.play('common/enemy_skill', 'common/enemy_attack');
    playCutIn({ img: e.image || '', name: e.name, lines, foe: true }, () => {
      if (!B || B.over) return;
      B.busy = false;
      renderBattle();
    });
  }, 260 + grandEntryTotal(e));
}

function pushLog(html) {
  B.history.push({ turn: B.turn, html });
  B.log.push(html);
  if (B.log.length > 4) B.log.shift();
  const el = $('log');
  el.innerHTML = B.log.map((l) => `<p>${l}</p>`).join('');
}

let rageFlashTimer = null;
function flashRage(rl) {
  rl.classList.remove('is-rise');
  void rl.offsetWidth;
  rl.classList.add('is-rise');
  clearTimeout(rageFlashTimer);
  rageFlashTimer = setTimeout(() => rl.classList.remove('is-rise'), 780);
}

function renderBattle() {

  if (!B) return;

  if (current === 'battle' && !B.over) Sound.playBgm(battleBgmName());

  $('enemy-hpfill').style.width = clamp(B.ehp / B.ehpMax * 100, 0, 100) + '%';
  $('enemy-hpnum').textContent = `${Math.max(0, B.ehp)} / ${B.ehpMax}`;

  $('enemy-body').classList.toggle(
    'is-danger',
    !B.over && B.ehp > 0 && B.ehp / B.ehpMax <= (CONFIG.dangerRate == null ? 0.5 : CONFIG.dangerRate)
  );
  $('turn-label').textContent = `ターン ${B.turn}`;
  $('btn-history').hidden = false;
  $('btn-flee').disabled = B.busy || B.over;

  const fg = forgetOf();
  const rage = Math.round(rageNow() * 100);
  const rl = $('enemy-rageline');
  rl.hidden = !B.e.rage && !fg;
  rl.classList.toggle('ragebar--years', !!fg);
  if (fg) {

    $('enemy-ragelabel').textContent = '経過';
    $('enemy-ragefill').style.width = clamp(B.years / fg.cap * 100, 0, 100) + '%';
    $('enemy-ragenum').textContent = `${B.years} / ${fg.cap}年`;
    rl.classList.toggle('is-full', B.years >= fg.cap * 0.8);
    if (B.yearsShown != null && B.years > B.yearsShown) flashRage(rl);
    B.yearsShown = B.years;
  } else if (B.e.rage) {
    $('enemy-ragelabel').textContent = '崩壊';
    $('enemy-ragefill').style.width = rage + '%';
    $('enemy-ragenum').textContent = rage + '%';
    rl.classList.toggle('is-full', rage >= 100);

    if (B.rageShown != null && rage > B.rageShown) flashRage(rl);
    B.rageShown = rage;
  }

  const foe = [];
  const ally = [];
  const up = (t) => `<span class="mk mk--up">${t}</span>`;
  const dn = (t) => `<span class="mk mk--dn">${t}</span>`;

  if (B.pinch) {
    const g = CONFIG.halfBoost || {};
    foe.push(`<b class="boost">昂ぶり</b>${up(`技+${Math.round(((g.power || 1) - 1) * 100)}%`)}`);
  }
  if (rage > 0) foe.push(up(`攻+${Math.round(rage * (CONFIG.rageAtkMax || 0))}%`));

  if (fg) foe.push(dn(`このターン +${yearsPerTurn(B.turn)}年`));
  if (B.eAtkUp > 0) foe.push(up(`攻+${Math.round(B.eAtkUpRate * 100)}% 残${B.eAtkUp}`));
  if (B.defDown > 0) foe.push(dn(`防−${Math.round(B.defDownRate * 100)}% 残${B.defDown}`));
  if (B.atkDown > 0) foe.push(dn(`攻−${Math.round(B.atkDownRate * 100)}% 残${B.atkDown}`));
  if (B.eSilence > 0) foe.push(dn(`技封じ 残${B.eSilence}`));
  if (B.burn > 0) foe.push(dn(`延焼 残${B.burn}`));

  if (B.atkUp > 0) ally.push(up(`攻+${Math.round(B.atkUpRate * 100)}% 残${B.atkUp}`));
  if (B.critUp > 0) ally.push(up(`会心×${B.critUpMul} 残${B.critUp}`));
  if (B.pAtkDown > 0) ally.push(dn(`攻−${Math.round(B.pAtkDownRate * 100)}% 残${B.pAtkDown}`));

  const mkRow = (who, list) => list.length
    ? `<div class="mkrow"><b class="mkrow__who">${who}</b>${list.join('　')}</div>`
    : '';

  $('enemy-rage').innerHTML = mkRow('敵', foe) + mkRow('自', ally);

  const wrap = $('units');
  wrap.innerHTML = '';
  B.units.forEach((u, i) => {
    const dead = u.hp <= 0;
    const sk = charById(u.cid).skill;
    const lost = charById(u.cid).lost;
    const own = charById(u.cid).own;
    const div = document.createElement('div');

    const danger = !dead && u.hp <= u.max * (CONFIG.dangerRate == null ? 0.5 : CONFIG.dangerRate);
    div.className = 'unit' + (dead ? ' is-dead' : '') + (u.seal > 0 ? ' is-sealed' : '')
                  + (danger ? ' is-danger' : '')
                  + (B.swapPick && canSwapOut(i) ? ' is-swapable' : '')

                  + (B.pickRevive != null && dead ? ' is-revivable' : '');
    div.dataset.i = i;
    div.innerHTML = `
      <div class="unit__face">
        <img src="${CONFIG.charDir}${u.cid}.jpg" alt="">
        ${elemBadge(u.elem, 'elem--corner')}
        ${u.seal > 0 ? `<span class="unit__seal">封 残${u.seal}ターン</span>` : ''}
        ${u.shield > 0 ? `<span class="unit__shield">◇ ${u.shield}</span>` : ''}
        ${u.charge ? '<span class="unit__mark">溜</span>' : ''}
        ${u.chant ? '<span class="unit__mark unit__mark--chant">唱</span>' : ''}
        <div class="unit__info">
          <div class="unit__name">${u.name}<span class="unit__lv">Lv.${S.chars[u.cid] ? S.chars[u.cid].lv : '-'}</span></div>
          <div class="bar"><span style="width:${clamp(u.hp / u.max * 100, 0, 100)}%;background:${u.hp < u.max * 0.3 ? 'var(--hp-low)' : 'var(--hp)'}"></span></div>
          <div class="unit__hp${u.hp < u.max * 0.3 ? ' is-low' : ''}">${Math.max(0, u.hp)} / ${u.max}</div>
        </div>
      </div>
      ${dead && B.reserve && B.reserve.hp > 0 ? `<button type="button" class="unit__swap" data-a="swap">${B.reserve.name} と交代</button>` : `
      <div class="unit__cmds">
        <button type="button" class="unit__cmd ${u.action === 'attack' ? 'is-on' : ''}" data-a="attack" ${dead || u.seal > 0 ? 'disabled' : ''}>戦う</button>
        ${own
          ? `<button type="button" class="unit__cmd unit__cmd--own ${u.action === 'own' ? 'is-on' : ''}" data-a="own" ${dead || u.seal > 0 ? 'disabled' : ''}>${own.name}</button>`
          : ''}
      </div>`}
      <button type="button" class="unit__skill ${u.action === 'skill' ? 'is-on' : ''} ${u.skillMax <= 0 ? 'is-locked' : ''}" data-a="skill"
              ${dead || u.seal > 0 || u.skillLeft <= 0 ? 'disabled' : ''}>
        ${u.skillMax <= 0 ? '装備なし' : (sk ? sk.name : '技なし')}<small>${'●'.repeat(u.skillLeft)}${'○'.repeat(Math.max(0, u.skillMax - u.skillLeft))}</small>
      </button>
      ${lost ? `<button type="button" class="unit__lost ${u.action === 'lost' ? 'is-on' : ''} ${lostReady(u) ? 'is-ready' : ''} ${B.lostFlash && lostReady(u) ? 'is-freed' : ''}" data-a="lost"
              ${lostReady(u) && u.seal <= 0 ? '' : 'disabled'}>
        ${lost.name}<small>Lv−${CONFIG.lostLevelCost || 5}</small>
      </button>` : ''}
`;
    wrap.appendChild(div);
  });

  $('btn-exec').disabled = B.busy || B.over || !B.units.some((u) => u.hp > 0);

  $('btn-exec').textContent = B.pickRevive != null ? 'やめる' : '実行';
  renderSwapBtn();
}

function canSwapOut(i) {
  const u = B && B.units[i];
  if (!(B && B.reserve && !B.busy && !B.over
        && u && u.hp > 0 && u.seal <= 0 && B.reserve.seal <= 0)) return false;

  if (B.reserve.hp <= 0 && !B.units.some((t, k) => k !== i && t.hp > 0)) return false;
  return true;
}

function renderSwapBtn() {
  const b = $('btn-swap');
  if (!b) return;
  const canAny = B && B.reserve && !B.busy && !B.over
                 && B.units.some((u, i) => canSwapOut(i));
  b.hidden = !(B && B.reserve);
  b.disabled = !canAny;
  b.classList.toggle('is-on', !!(B && B.swapPick));

  b.textContent = B && B.swapPick ? 'やめる' : '交代';
}

function swapLive(i) {
  if (!B || B.busy || B.over || !B.reserve) return false;
  const u = B.units[i];
  if (!u || u.hp <= 0) { toast('倒れた仲間は、カードの「交代」から'); return false; }
  if (u.seal > 0) { toast(`${u.name} は縫い止められていて交代できない`); return false; }
  if (B.reserve.seal > 0) { toast(`${B.reserve.name} はまだ動けない`); return false; }

  if (B.reserve.hp <= 0 && !B.units.some((t, k) => k !== i && t.hp > 0)) {
    toast('前に出られる仲間がいなくなります'); return false;
  }

  const nu = B.reserve;
  B.units[i] = nu;
  B.reserve = u;
  nu.action = 'attack';
  u.action = 'attack';
  B.swapUsed = true;
  B.swapPick = false;
  B.reserveIn = true;

  if (B.cover && B.cover.i === i) B.cover = null;
  if (B.parry && B.parry.i === i) B.parry = null;
  applyGuardOthers();
  Sound.play('common/heal');
  pushLog(`<b>${nu.name}</b> が ${u.name} と交代して前に出た`);
  renderBattle();
  if (nu.hp > 0) speakUnit(i, 'join', true);
  flushPops();
  const card = document.querySelectorAll('#units .unit')[i];
  if (card) { card.classList.remove('is-swapin'); void card.offsetWidth; card.classList.add('is-swapin'); }
  toast(`${nu.name} と ${u.name} を入れ替えた`);
  return true;
}

function fallenOnField() {
  const out = [];
  if (B) B.units.forEach((t, k) => { if (t.hp <= 0) out.push(k); });
  return out;
}

function needReviveTarget() {
  if (!B || fallenOnField().length < 2) return -1;
  for (let i = 0; i < B.units.length; i++) {
    const u = B.units[i];
    if (!u || u.hp <= 0 || u.seal > 0) continue;
    if (u.action !== 'skill' || u.skillLeft <= 0) continue;
    const sk = charById(u.cid).skill;
    if (!sk || sk.type !== 'revive') continue;

    const p = u.revivePick;
    if (p != null && B.units[p] && B.units[p].hp <= 0) continue;
    return i;
  }
  return -1;
}

$('units').addEventListener('click', (ev) => {
  if (!B || B.busy || B.over) return;

  if (B.pickRevive != null) {
    const card = ev.target.closest('.unit');
    if (!card) return;
    const k = Number(card.dataset.i);
    if (!B.units[k] || B.units[k].hp > 0) { toast('倒れている仲間を選んでください'); return; }
    const who = B.units[B.pickRevive];
    if (who) who.revivePick = k;
    B.pickRevive = null;
    toast(`${B.units[k].name} を起こす`);
    renderBattle();
    execute();
    return;
  }

  if (B.swapPick) {
    const card = ev.target.closest('.unit');
    if (!card) return;
    const k = Number(card.dataset.i);
    if (canSwapOut(k)) swapLive(k);
    else { B.swapPick = false; toast('その仲間は交代できません'); renderBattle(); }
    return;
  }
  const btn = ev.target.closest('.unit__cmd, .unit__skill, .unit__lost, .unit__swap');
  if (!btn) return;
  const i = Number(btn.closest('.unit').dataset.i);
  const a = btn.dataset.a;
  if (a === 'swap') { swapReserve(i); return; }
  if (a === 'lost') {
    const u = B.units[i];
    const lost = charById(u.cid).lost;
    if (!lost) return;
    if (!canLost(u.cid)) {
      toast(`${lost.name} は Lv.${CONFIG.lostMinLevel || 6} 以上で使えます`);
      return;
    }
    if (!lostReady(u)) {
      toast(`${lost.name} は HPが半分を下回ってから撃てます`);
      return;
    }

    Sound.play('common/lost', 'common/crit');
  }
  if (a === 'skill') {
    const u = B.units[i];
    const sk = charById(u.cid).skill;
    if (u.skillMax <= 0) { toast('風景の記憶を装備すると、この子の技が使えます'); return; }
    if (!sk || u.skillLeft <= 0) return;

    Sound.play('common/tap');
  }

  if (a === 'attack' || a === 'own') Sound.play('common/tap');

  B.units[i].action = a;

  if (a !== 'skill') B.units[i].revivePick = null;
  renderBattle();

  if (a === 'lost') {
    const card = document.querySelectorAll('#units .unit')[i];
    const lb = card && card.querySelector('.unit__lost');
    if (lb) { lb.classList.remove('is-flash'); void lb.offsetWidth; lb.classList.add('is-flash'); }
  }
});

function unitDescOf(btn) {
  if (!B || !btn) return '';
  const card = btn.closest('.unit');
  if (!card) return '';
  const i = Number(card.dataset.i);
  const u = B.units[i];
  if (!u) return '';
  const c = charById(u.cid);
  const a = btn.dataset.a;
  if (a === 'own')   return c.own ? `${c.own.name}：${c.own.desc}` : '';
  if (a === 'skill') return (c.skill && u.skillMax > 0) ? `${c.skill.name}：${c.skill.desc}` : '';
  if (a === 'lost')  return c.lost
    ? `${c.lost.name}：${c.lost.desc}（撃つと Lv−${CONFIG.lostLevelCost || 5}）` : '';
  return '';
}

$('units').addEventListener('pointerdown', (ev) => {
  if (!B || B.busy || B.over || B.swapPick || B.pickRevive != null) return;
  const btn = ev.target.closest && ev.target.closest('.unit__cmd--own, .unit__skill, .unit__lost');
  if (!btn) return;
  const txt = unitDescOf(btn);
  if (txt) toastHold(txt);
});

$('btn-swap').addEventListener('click', () => {
  if (!B || B.busy || B.over || !B.reserve) return;
  if (B.pickRevive != null) { toast('先に、起こす仲間をえらんでください'); return; }
  if (B.swapPick) { B.swapPick = false; renderBattle(); return; }
  if (B.reserve.seal > 0) { toast(`${B.reserve.name} はまだ動けない`); return; }
  B.swapPick = true;
  renderBattle();
  toast(B.reserve.hp > 0
    ? `${B.reserve.name} と入れ替える仲間をタップしてください`
    : `${B.reserve.name}（倒れている）と入れ替える仲間をタップしてください`);
});

let worldCache = null;

function fmtDate(ms) {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function recordCard(rec, mine) {
  const e = enemyById(rec.e);

  const rankTag = (r) => {
    if (!(r > 1)) return '';
    const m = charRankMarks(r);
    return `<span class="crank${m.on === '★' ? ' crank--star' : ''}">${m.on}${m.n}</span>`;
  };

  const slot = (m, sub) => {
    if (!m) return sub ? '<div class="pslot pslot--sub"><span class="pslot__empty">＋</span></div>' : '';
    const [cid, lv, rk, eq, , , , , , , lrk] = m;
    const c = charById(cid);
    if (!c) return '';
    const l = eq ? landById(eq) : null;
    return `<div class="pslot pslot--rec is-filled${sub ? ' pslot--sub' : ''}">
        <img class="pslot__img" src="${CONFIG.charDir}${cid}.jpg" alt="">
        ${elemBadge(c.elem, 'elem--corner')}
        ${l ? `<span class="pslot__eq"><img src="${CONFIG.landDir}${l.file}" alt="">${lrk ? `<i>${lrk}</i>` : ''}</span>`
            : '<span class="pslot__noeq">技×</span>'}
        <span class="pslot__cap">${c.name}<br><span class="pslot__lv">Lv.${lv}</span>${rankTag(rk)}</span>
      </div>`;
  };

  const feat = (m) => {
    if (!m) return '<div class="rec__st"></div>';
    const [cid, , , , dmg, aAtk, aOwn, aSkill, aLost, taken] = m;
    const c = charById(cid);
    if (!c || dmg == null) return '<div class="rec__st"></div>';
    const acts = [];
    if (aAtk)   acts.push(`<span>戦う <i>${aAtk}</i></span>`);
    if (aOwn)   acts.push(`<span>${c.own ? c.own.name : '固有'} <i>${aOwn}</i></span>`);
    if (aSkill) acts.push(`<span>${c.skill ? c.skill.name : '技'} <i>${aSkill}</i></span>`);
    if (aLost)  acts.push(`<span class="is-lost">奥義 <i>${aLost}</i></span>`);
    return `<div class="rec__st">
        <span class="rec__dmg">与ダメ <b>${comma(dmg || 0)}</b></span>
        <span class="rec__taken">被ダメ <b>${comma(taken || 0)}</b></span>
        <span class="rec__acts">${acts.length ? acts.join('') : '<span>—</span>'}</span>
      </div>`;
  };

  const all = (rec.p || []).map((m) => [m, false]).concat([[rec.r, true]]);
  const slots = all.map(([m, sub]) => slot(m, sub)).join('');
  const feats = all.map(([m]) => feat(m)).join('');
  const hasStats = all.some(([m]) => m && m[4] != null);

  const lost = (rec.l || []).map((cid) => charById(cid) && charById(cid).lost.name).filter(Boolean);
  const total = all.reduce((a, [m]) => a + (m && m[4] ? m[4] : 0), 0);
  const st = rec.s || null;

  return `<div class="rec">
    <div class="rec__top">
      <span class="rec__name">${escapeHtml(rec.n || '名もなき者')}</span>
      <span class="rec__date">${fmtDate(rec.d)}</span>
    </div>
    <div class="rec__enemy">
      ${e && e.image ? `<img src="${e.image}" alt="">` : ''}
      <div>
        <b>${e ? e.name : '？？？'}</b> を倒した
        <small>${rec.t}ターン${total ? ` ／ 与ダメ 合計 ${comma(total)}` : ''}</small>
        ${lost.length ? `<small class="rec__lost">${lost.join('・')} を使用した</small>` : ''}
      </div>
    </div>

    <div class="rec__slots">${slots}</div>
    ${st ? `<div class="party__total rec__total">
      <span>合計HP <b>${comma(st[0])}</b></span><span>攻撃 <b>${comma(st[1])}</b></span><span>防御 <b>${comma(st[2])}</b></span>
    </div>` : ''}

    ${hasStats ? `<div class="rec__feats">${feats}</div>` : ''}
  </div>`;
}

function escapeHtml(t) {
  return String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderRecords() {
  $('stone-name').textContent = playerName();
  const wrap = $('stone-list');
  const note = $('stone-note');

  const list = S.records || [];
  wrap.innerHTML = list.length
    ? list.map((r) => recordCard(r, true)).join('')
    : '<p class="stone__empty">まだ何も刻まれていない。<br>敵を倒したあとに「戦いの記憶を残す」を選ぶと、ここに残ります。</p>';

  note.innerHTML = '';
}

function showSharedRecord() {
  const m = /[?&]rec=([^&]+)/.exec(location.search);
  if (!m) return;
  const rec = decodeRecord(m[1]);
  if (!rec) return;
  setTimeout(() => {
    openModal(`
      <div class="md__title">誰かの記憶</div>
      <div class="md__sub">この碑文が、あなたに届いた</div>
      <div class="stone__list stone__list--one">${recordCard(rec, false)}</div>
      <div class="md__row"><button type="button" class="btn btn--sub" id="md-rec-close">わたしも旅に出る</button></div>
    `);
    $('md-rec-close').onclick = () => {
      closeModal();
      history.replaceState(null, '', location.pathname);
    };
  }, 600);
}

function shareText(rec) {
  const e = enemyById(rec.e);
  const names = (rec.p || []).map(([cid]) => (charById(cid) || {}).name).filter(Boolean).join('・');
  return `「${e ? e.name : '？？？'}」を倒した。\n${names}／${rec.t}ターン\n― ${CONFIG.title || ''} ―`;
}

function recordUrl(rec) {
  const base = CONFIG.shareUrl || (location.origin + location.pathname);
  return `${base}?rec=${encodeRecord(rec)}`;
}

function shareToX(rec) {
  const url = CONFIG.shareUrl ? recordUrl(rec) : '';
  const t = `${shareText(rec)}\n${CONFIG.shareTag || ''}`;
  const u = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(t)
          + (url ? '&url=' + encodeURIComponent(url) : '');
  window.open(u, '_blank', 'noopener');
}

function makeShareCard(rec) {
  return new Promise((resolve) => {
    const W = 1200, H = 630;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    const e = enemyById(rec.e);

    const load = (src) => new Promise((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => res(null);
      im.src = src;
    });

    const srcs = [e && e.image ? e.image : null]
      .concat((rec.p || []).map(([cid]) => CONFIG.charDir + cid + '.jpg'));

    Promise.all(srcs.map((x) => (x ? load(x) : Promise.resolve(null)))).then((imgs) => {
      const [enemyImg, ...faces] = imgs;

      g.fillStyle = '#0b0d12'; g.fillRect(0, 0, W, H);
      if (enemyImg) {
        const s = Math.max(W / enemyImg.width, H / enemyImg.height) * 1.15;
        g.globalAlpha = 0.42;
        g.drawImage(enemyImg, W * 0.62 - enemyImg.width * s / 2, H / 2 - enemyImg.height * s / 2,
                    enemyImg.width * s, enemyImg.height * s);
        g.globalAlpha = 1;
      }
      const grd = g.createLinearGradient(0, 0, W, 0);
      grd.addColorStop(0, 'rgba(8,10,14,.97)');
      grd.addColorStop(0.55, 'rgba(8,10,14,.75)');
      grd.addColorStop(1, 'rgba(8,10,14,.35)');
      g.fillStyle = grd; g.fillRect(0, 0, W, H);

      const serif = '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif';
      const sans = '"Hiragino Sans","Noto Sans JP","Yu Gothic",sans-serif';

      g.fillStyle = '#d8c48a'; g.font = `500 26px ${sans}`;
      g.fillText(`${CONFIG.title || ''} ${CONFIG.titleSub || ''}`, 62, 74);

      g.fillStyle = '#eef1f6'; g.font = `600 62px ${serif}`;
      g.fillText(`${e ? e.name : '？？？'} を倒した`, 62, 168);

      g.fillStyle = '#96a0b1'; g.font = `400 28px ${sans}`;
      g.fillText(`${rec.n || '名もなき者'}　／　${rec.t}ターン　／　${fmtDate(rec.d).split(' ')[0]}`, 64, 214);

      const cardW = 176, cardH = 264, gap = 26, x0 = 62, y0 = 262;
      faces.forEach((im, i) => {
        const x = x0 + i * (cardW + gap);
        g.save();
        g.beginPath();
        const r = 14;
        g.moveTo(x + r, y0); g.arcTo(x + cardW, y0, x + cardW, y0 + cardH, r);
        g.arcTo(x + cardW, y0 + cardH, x, y0 + cardH, r);
        g.arcTo(x, y0 + cardH, x, y0, r); g.arcTo(x, y0, x + cardW, y0, r);
        g.closePath(); g.clip();
        g.fillStyle = '#12161f'; g.fillRect(x, y0, cardW, cardH);
        if (im) {
          const s = Math.min(cardW / im.width, cardH / im.height);
          g.drawImage(im, x + (cardW - im.width * s) / 2, y0 + (cardH - im.height * s) / 2,
                      im.width * s, im.height * s);
        }
        const gg = g.createLinearGradient(0, y0 + cardH * 0.55, 0, y0 + cardH);
        gg.addColorStop(0, 'rgba(6,8,12,0)'); gg.addColorStop(1, 'rgba(6,8,12,.92)');
        g.fillStyle = gg; g.fillRect(x, y0, cardW, cardH);
        g.restore();
        g.strokeStyle = 'rgba(120,132,155,.5)'; g.lineWidth = 1.5;
        g.strokeRect(x + .5, y0 + .5, cardW - 1, cardH - 1);

        const m = rec.p[i];
        const c = charById(m[0]);
        g.textAlign = 'center';
        g.fillStyle = '#eef1f6'; g.font = `500 24px ${sans}`;
        g.fillText(c ? c.name : '', x + cardW / 2, y0 + cardH - 40);
        g.fillStyle = '#d8c48a'; g.font = `500 20px ${sans}`;
        g.fillText(`Lv.${m[1]}${m[2] > 1 ? ` ◆${m[2]}` : ''}`, x + cardW / 2, y0 + cardH - 14);
        g.textAlign = 'left';
      });

      const lands = (rec.p || []).map(([, , , eq]) => (eq && landById(eq) ? landById(eq).name : null))
                                 .filter(Boolean);
      if (lands.length) {
        g.fillStyle = '#8fd8c9'; g.font = `400 24px ${sans}`;
        g.fillText(`携えた景色：${lands.join('・')}`, 62, y0 + cardH + 52);
      }
      const lost = (rec.l || []).map((cid) => charById(cid) && charById(cid).lost.name).filter(Boolean);
      if (lost.length) {
        g.fillStyle = '#ff9db4'; g.font = `400 24px ${sans}`;
        g.fillText(`使用した喪失スキル：${lost.join('・')}`, 62, y0 + cardH + 88);
      }

      if (CONFIG.shareUrl) {
        g.fillStyle = '#6f7a8b'; g.font = `400 20px ${sans}`;
        g.fillText(CONFIG.shareUrl, 62, H - 30);
      }
      resolve(cv);
    });
  });
}

async function shareImage(rec) {
  toast('碑文の画像を作っています…');
  const cv = await makeShareCard(rec);
  const blob = await new Promise((res) => cv.toBlob(res, 'image/png'));
  if (!blob) { toast('画像を作れませんでした'); return; }
  const file = new File([blob], 'madaminu.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: shareText(rec) });
      return;
    } catch (err) {  return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `madaminu_${rec.e}_${rec.d}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('画像を保存しました');
}

function copyRecordUrl(rec) {
  const u = recordUrl(rec);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(u).then(() => toast('URLをコピーしました'), () => prompt('このURLを共有できます', u));
  } else {
    prompt('このURLを共有できます', u);
  }
}

function askPlayerName(then) {
  const cur = S.playerName || '';
  const v = prompt('記憶の碑に刻む名前を決めてください（12文字まで）', cur || '');
  if (v === null) return;
  S.playerName = v.replace(/[<>]/g, '').trim().slice(0, 12);
  save();
  if (then) then();
}

function doLeave(rec, btn) {
  rec.n = playerName().slice(0, 12);
  saveRecord(rec);
  if (btn) { btn.disabled = true; btn.textContent = '記憶を残した'; }
  Sound.play('common/victory');
  toast('戦いの記憶を残した');
  setTimeout(() => { renderRecords(); go('records'); }, 500);
}

function playerName() {
  return (S.playerName || '').trim() || '名もなき者';
}

function unitStatsOf(cid) {
  if (!B) return null;
  const all = (B.units || []).concat(B.reserve ? [B.reserve] : [], B.fallen || []);
  const u = all.find((x) => x && x.cid === cid);
  return (u && u.st) ? u.st : null;
}

function makeRecord(win) {
  const pack = (cid) => {
    const own = S.chars[cid];
    if (!own) return null;

    const st = unitStatsOf(cid);
    const a = st ? st.act : null;
    return [cid, own.lv, charRank(cid), own.eq || '',
            st ? st.dmg : 0,
            a ? a.attack : 0, a ? a.own : 0, a ? a.skill : 0, a ? a.lost : 0,
            st ? st.taken : 0,
            own.eq ? landRank(own.eq) : 0];
  };

  let thp = 0, tatk = 0, tdef = 0;
  S.party.forEach((cid) => {
    const st = statsOf(cid);
    if (st) { thp += st.hp; tatk += st.atk; tdef += st.def; }
  });
  return {
    v: 1,
    n: playerName().slice(0, 12),
    e: B.e.id,
    t: B.turn,
    d: Date.now(),
    p: S.party.map(pack).filter(Boolean),
    r: S.reserve ? pack(S.reserve) : null,
    s: [thp, tatk, tdef],
    l: (B.lostUsed || []).slice(0, 3),
  };
}

function encodeRecord(rec) {
  const json = JSON.stringify(rec);
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeRecord(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const rec = JSON.parse(new TextDecoder().decode(bytes));
    return rec && rec.e ? rec : null;
  } catch (err) { return null; }
}

function saveRecord(rec) {
  S.records = S.records || [];
  S.records.unshift(rec);
  if (S.records.length > (CONFIG.recordMax || 30)) S.records.length = CONFIG.recordMax || 30;
  save();
  postRecord(rec);
}

function postRecord(rec) {
  if (!CONFIG.recordApi) return Promise.resolve(false);
  return fetch(CONFIG.recordApi, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(rec),
  }).then(() => true).catch(() => false);
}

function fetchRecords() {
  if (!CONFIG.recordApi) return Promise.resolve(null);
  return fetch(CONFIG.recordApi + (CONFIG.recordApi.includes('?') ? '&' : '?') + 'limit=50')
    .then((r) => r.json())
    .then((list) => (Array.isArray(list) ? list : null))
    .catch(() => null);
}

function canLost(cid) {
  const c = charById(cid), own = S.chars[cid];
  return !!(c && c.lost && own && own.lv >= (CONFIG.lostMinLevel || 6));
}

function lostReady(u) {
  if (!u || u.hp <= 0 || !canLost(u.cid)) return false;
  if (B && B.lostFree) return true;
  return u.hp <= u.max * (CONFIG.lostHpRate != null ? CONFIG.lostHpRate : 0.5);
}

function payLostCost(u, i) {
  const own = S.chars[u.cid];
  const cut = Math.floor(effOf(u, 'oathCost'));
  const cost = Math.max(1, (CONFIG.lostLevelCost || 5) - cut);
  own.lv = Math.max(1, own.lv - cost);
  own.exp = 0;
  save();

  const st = statsOf(u.cid);
  const ratio = u.max > 0 ? u.hp / u.max : 1;
  u.max = st.hp;
  u.hp = Math.min(u.hp, st.hp);
  if (u.hp <= 0 && ratio > 0) u.hp = 1;
  u.atk = st.atk;
  u.def = st.def;
  u.lostUsed = true;
  if (B.lostUsed && !B.lostUsed.includes(u.cid)) B.lostUsed.push(u.cid);
  pushLog(`<b>${u.name}</b> は記憶を手放した <span class="lost">Lv.${own.lv + cost} → Lv.${own.lv}</span>`);
}

function isStrong(a, b) {
  const e = ELEMENTS[a];
  if (!e || !b) return false;
  const s = e.strongAgainst;
  return Array.isArray(s) ? s.indexOf(b) >= 0 : s === b;
}
function elemMul(atkElem, defElem) {
  return isStrong(atkElem, defElem) ? (CONFIG.elemWeakMul || 1.5) : 1;
}

function elemBadge(key, extra = '') {
  const e = ELEMENTS[key];
  if (!e) return '';
  return `<span class="elem elem--${key} ${extra}">${e.name}</span>`;
}

let fxTail = 0;

function hitBeat(k) {
  const gap = CONFIG.hitGapMs == null ? 150 : CONFIG.hitGapMs;
  const d = Math.max(0, k || 0) * gap;
  if (d > fxTail) fxTail = d;
  return d;
}

function takeFxTail() { const t = fxTail; fxTail = 0; return t; }

function slashFxAt(k, kind, tint) {
  const d = hitBeat(k);
  if (d > 0) setTimeout(() => { if (B) slashFx(kind, tint); }, d);
  else slashFx(kind, tint);
}

function rollRead() {
  const r = B.e && B.e.read;
  if (!r) return 1;
  const rate = r.rate == null ? 0.30 : r.rate;
  return Math.random() < rate ? (r.same == null ? 0.10 : r.same) : 1;
}

function strikeEnemy(u, power, readable, k) {
  let mul = elemMul(u.elem, B.e.elem);
  if (mul > 1) mul += effOf(u, 'elemBoost');
  const rm = readable ? rollRead() : 1;
  critScale = (B.critUp > 0 ? (B.critUpMul || 2) : 1);
  critAdd = effOf(u, 'critRate');
  const d = damage(Math.round(unitAtk(u) * power * mul * rm), enemyDef());
  critScale = 1;
  critAdd = 0;
  const crit = lastCrit;
  B.ehp -= d;
  if (u && u.st) u.st.dmg += d;

  if (B.ehp > 0) {
    const cf = CONFIG.enemySay || {};
    const mx = B.ehpMax || B.e.hp || 1;
    if (B.ehp <= mx * (cf.lowRate == null ? 0.20 : cf.lowRate)) enemySay('low');
    else if (crit) enemySay('crit');
    else if (d >= mx * (cf.hurtRate == null ? 0.05 : cf.hurtRate)) enemySay('hurt');
  }

  const show = () => {
    popEnemy(String(d), crit ? 'crit' : (mul > 1 ? 'weak' : ''), k);
    if (crit) Sound.play('common/crit', 'common/enemy_attack');
  };
  const dly = hitBeat(k);
  if (dly > 0) setTimeout(show, dly); else show();

  const tag = (mul > 1 ? '　<span class="weak">弱点!</span>' : '')
            + (crit ? '　<span class="crit">会心!</span>' : '')
            + (rm < 1 ? '　<span class="seal">見切られた</span>' : '');
  return { d, weak: mul > 1, crit, read: rm, tag };
}

let enemyHoldT = null;
let enemyOutT = null;

function clearEnemyLine() {
  clearTimeout(enemyHoldT); enemyHoldT = null;
  clearTimeout(enemyOutT);  enemyOutT = null;
  const el = $('enemyline');
  if (el) { el.className = 'enemyline'; el.innerHTML = ''; el.style.removeProperty('--esay-fade'); }
}

function showEnemyLine(text) {
  const el = $('enemyline');
  if (!el || !text) return;
  const cf = CONFIG.enemySay || {};
  const fade = cf.fadeMs == null ? 180 : cf.fadeMs;
  const hold = cf.holdMs == null ? 1800 : cf.holdMs;
  clearTimeout(enemyHoldT); clearTimeout(enemyOutT);

  el.style.setProperty('--esay-fade', fade + 'ms');

  el.innerHTML = `<span class="enemyline__b">${escapeHtml(String(text))}</span>`;
  el.className = 'enemyline';
  void el.offsetWidth;
  el.classList.add('is-on');

  enemyHoldT = setTimeout(() => {
    el.classList.add('is-out');
    enemyOutT = setTimeout(() => { clearEnemyLine(); }, fade + 40);
  }, fade + hold);
}

function enemySay(kind) {
  if (!B || !B.e) return;
  const cf = CONFIG.enemySay || {};
  if (cf.on === false) return;
  if (typeof ENEMY_LINES === 'undefined') return;
  const set = ENEMY_LINES[B.e.id];
  const list = set && set[kind];
  if (!list || !list.length) return;

  B.saidE = B.saidE || {};
  const cap = (cf.max && cf.max[kind] != null) ? cf.max[kind] : 1;
  if ((B.saidE[kind] || 0) >= cap) return;

  const always = (kind === 'win' || kind === 'lose');
  const gap = cf.gapTurns == null ? 2 : cf.gapTurns;
  if (!always && B.eSaidTurn != null && (B.turn - B.eSaidTurn) < gap) return;

  B.saidE[kind] = (B.saidE[kind] || 0) + 1;
  B.eSaidTurn = B.turn;

  B.saidLine = B.saidLine || {};
  let idx = Math.floor(Math.random() * list.length);
  if (list.length > 1 && B.saidLine[kind] === idx) idx = (idx + 1) % list.length;
  B.saidLine[kind] = idx;
  showEnemyLine(list[idx]);
}

function enemyDef() {
  return Math.round(B.e.def * (B.defDown > 0 ? (1 - B.defDownRate) : 1));
}

function unitAtk(u) {
  let a = u.atk;
  if (B.atkUp > 0) a *= (1 + B.atkUpRate);
  if (B.pAtkDown > 0) a *= (1 - B.pAtkDownRate);
  const ls = effOf(u, 'lastStand');
  if (ls && u.hp <= u.max / 2) a *= (1 + ls);
  return Math.round(a);
}

function forgetOf() { return (B && B.e && B.e.forget) || null; }

function yearsPerTurn(t) {
  const f = forgetOf();
  if (!f) return 0;
  const base = (f.perTurn || 0) + (f.accel || 0) * (t - 1);
  const mul = (B && B.pinch && f.pinchMul > 0) ? f.pinchMul : 1;
  return Math.max(0, Math.round(base * mul));
}

function addYears(n, label) {
  const f = forgetOf();
  if (!f || !n || B.over) return false;
  B.years = Math.min(f.cap, B.years + n);
  pushLog(`<span class="ult">${label}　年月が ${n}年 進んだ</span>　<b>${B.years}年</b>`);
  popEnemy(`+${n}年`, 'seal');
  return B.years >= f.cap;
}

function cutYears(kind, sk) {
  const f = forgetOf();
  if (!f || B.over) return;
  let n = kind === 'lost' ? (f.lostBack || 0)
        : kind === 'skill' ? (f.skillBack || 0)
        : (f.ownBack || 0);

  const extra = (sk && sk.back > 0)
    ? Math.min(f.backYearMax || 0, Math.round(sk.back * (f.backYear || 0))) : 0;
  n += extra;
  if (n <= 0) return;
  const before = B.years;
  B.years = Math.max(0, B.years - n);
  const got = before - B.years;
  if (got <= 0) return;

  const why = extra > 0
    ? `<span class="eff">（${escapeHtml(sk.name || '')} の巻き戻しで ＋${extra}年）</span>` : '';
  pushLog(`<span class="eff">年月が ${got}年 戻った</span>${why}　<b>${B.years}年</b>`);
  popEnemy(`−${got}年`, 'heal');
}

function tickYears() {
  const f = forgetOf();
  if (!f) return false;
  if (addYears(yearsPerTurn(B.turn), '')) { loseByYears(); return true; }
  return false;
}

function loseByYears() {
  if (!B || B.over) return;
  B.yearsOver = true;
  pushLog(`<span class="ult">${forgetOf().cap}年が過ぎた。……戦っていたことも、忘れた</span>`);
  endBattle(false);
}

function yearsUltDue() {
  const f = forgetOf();
  if (!f || !f.ultAt || !f.ultAt.length) return false;
  for (const at of f.ultAt) {
    if (B.years >= at && !B.ultAtDone[at]) { B.ultAtDone[at] = 1; return true; }
  }
  return false;
}

function rageNow() {
  if (!B || !B.e.rage) return 0;
  const t = Math.max(0, (B.turn - 1) - B.rageBack);
  return Math.min(1, B.e.rage * t);
}

function enemyAtk() {
  let base = B.e.atk * (1 + rageNow() * (CONFIG.rageAtkMax || 0));
  if (B.eAtkUp > 0) base *= (1 + B.eAtkUpRate);
  return base * (B.atkDown > 0 ? (1 - B.atkDownRate) : 1);
}

let lastCrit = false;

let critScale = 1;

let critFixed = null;

let critAdd = 0;

function damage(atk, def) {
  const v = BALANCE.damageVariance;
  let d = Math.max(BALANCE.minDamage, Math.round(atk * 100 / (100 + def) * rnd(1 - v, 1 + v)));
  const base = critFixed == null ? (CONFIG.critRate || 0) : critFixed;
  lastCrit = Math.random() < Math.min(1, base * critScale + critAdd);
  if (lastCrit) d = Math.round(d * (CONFIG.critMul || 1.5));
  return d;
}

function healUnit(u, i, amount, quiet) {
  Sound.play('common/heal');
  const before = u.hp;
  u.hp = Math.min(u.max, u.hp + amount);
  const got = u.hp - before;
  if (got > 0) {
    popUnit(i, `+${got}`, 'heal');

    if (!quiet && got >= u.max * (CONFIG.bubble && CONFIG.bubble.healMin != null ? CONFIG.bubble.healMin : 0.08)) {
      speakUnit(i, 'heal');
    }
  }
  return got;
}

function playCutIn({ img, name, from, lines, foe, lost, hold }, done) {

  const base = (lost ? (CONFIG.lostCutMs || CONFIG.skillCutMs) : CONFIG.skillCutMs) || 0;
  const ms = (hold > 0 && CONFIG.skillCutMs > 0) ? hold : base;
  if (ms <= 0) { done(); return; }

  const cut = $('skillcut');
  $('toast').classList.remove('is-on');
  clearBubbles();
  const ls = lines && lines.length ? lines : [''];
  $('skillcut-img').src = img;

  $('skillcut-name').innerHTML = from
    ? `<span class="skillcut__from">${escapeHtml(from)}の喪失スキル</span>${escapeHtml(name)}`
    : escapeHtml(name);
  $('skillcut-line').textContent = ls[Math.floor(Math.random() * ls.length)];

  cut.classList.toggle('is-foe', !!foe);
  cut.classList.remove('is-out');
  cut.hidden = false;
  void cut.offsetWidth;

  setTimeout(() => { cut.classList.add('is-out'); }, Math.max(0, ms - 300));
  setTimeout(() => { cut.hidden = true; cut.classList.remove('is-out'); done(); }, ms);
}

function playSkillCut(u, done, sk) {
  const c = charById(u.cid);
  const use = sk || c.skill;
  Sound.play('skill/' + u.cid, 'common/heal');
  const cut = $('skillcut');
  if (sk) cut.classList.add('is-lost');

  playCutIn({ img: CONFIG.charDir + u.cid + '.jpg', name: use.name,
              lines: use.lines, foe: false, lost: !!sk },
            () => { cut.classList.remove('is-lost'); done(); });
}

function pickEnemySkill() {
  if (B.eSilence > 0) return null;
  const list = B.e.skills || (B.e.skill ? [B.e.skill] : []);
  const hit = list.filter((sk) => sk.every > 0 && B.turn % sk.every === 0);
  if (!hit.length) return null;
  return hit[Math.floor(Math.random() * hit.length)];
}

function playEnemyUlt(done) {
  const ult = B.e.ult;
  B.ultUsed = true;
  Sound.play('common/enemy_skill', 'common/enemy_attack');
  const cut = $('skillcut');
  cut.classList.add('is-ult');
  shakeScreen(true);
  playCutIn({ img: B.e.image || '', name: ult.name, lines: ult.lines, foe: true }, () => {
    cut.classList.remove('is-ult');
    done();
  });
}

function playEnemyCut(sk, done) {
  Sound.play('common/enemy_skill', 'common/enemy_attack');
  const hold = sk.stolenFrom ? (CONFIG.stolenCutMs || 0) : 0;

  const owner = sk.stolenFrom && charById(sk.stolenFrom);
  playCutIn({ img: B.e.image || '', name: sk.name, from: owner ? owner.name : '',
              lines: sk.lines, foe: true, hold }, done);
}

function halfBreakDue() {
  return !!(B && !B.over && !B.halfDone && B.ehp > 0 && CONFIG.halfBreak && enemyIsHalf());
}

function boostedSkill(sk) {
  if (!sk || !B || !B.pinch) return sk;
  const g = CONFIG.halfBoost || {};
  const s = Object.assign({}, sk);
  if (s.power) s.power = s.power * (g.power || 1);
  if (s.selfHeal) s.selfHeal = s.selfHeal * (g.heal || 1);
  if (s.rageUp) s.rageUp = s.rageUp + (g.rageUp || 0);
  if (s.seal) s.seal = { turns: s.seal.turns + (g.turns || 0) };
  if (s.atkDown) s.atkDown = { rate: Math.min(0.9, s.atkDown.rate * (g.rate || 1)),
                               turns: s.atkDown.turns + (g.turns || 0) };
  if (s.selfAtkUp) s.selfAtkUp = { rate: s.selfAtkUp.rate * (g.rate || 1),
                                   turns: s.selfAtkUp.turns + (g.turns || 0) };
  s.boosted = true;
  return s;
}

function boostTag() {
  return (B && B.pinch) ? ' <span class="boost">昂ぶり</span>' : '';
}

function forcedEnemySkill() {
  if (B.eSilence > 0) return null;
  const list = (B.e.skills || (B.e.skill ? [B.e.skill] : [])).filter((sk) => sk && sk.name);
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function playHalfBreak(done) {
  B.halfDone = true;
  B.pinch = true;

  Sound.playBgm(bgmFor('battle_pinch'));
  if (CONFIG.halfBreakSkipTurn) B.skipEnemyTurn = true;

  const e = B.e;
  const def = CONFIG.halfBreakDefault || {};
  const cut = (e.half && e.half.name) ? e.half : def;
  pushLog(`<b>${e.name}</b>　<span class="ult">${cut.name || '崩れはじめる'}</span>`);

  Sound.play('common/enemy_skill', 'common/enemy_attack');
  shakeScreen(true);
  const el = $('skillcut');
  el.classList.add('is-ult');

  playCutIn({ img: e.image || '', name: cut.name || '崩れはじめる',
              lines: cut.lines || def.lines || [''], foe: true,
              hold: CONFIG.halfCutMs || 0 }, () => {
    el.classList.remove('is-ult');
    halfBreakExtra(cut);

    playHalfVoices(() => {
      if (!B || B.over) return;

      playHalfHeal(cut, () => {
        if (!B || B.over) return;

        playHalfGrant(cut, () => {
          if (!B || B.over) return;
          speakUnit(someAliveUnit(), 'enemyHalf', true);
          flushPops();
          done(forcedEnemySkill());
        });
      });
    });
  });
}

function playHalfVoices(done) {
  const table = (typeof HALF_VOICE !== 'undefined' && HALF_VOICE) || null;
  const eid = B && B.e && B.e.id;
  if (!table || !B || !eid) { done(); return; }
  const list = B.units
    .map((u, i) => ({ u, i }))
    .filter((x) => x.u.hp > 0 && (table[x.u.cid] || {})[eid]);
  if (!list.length) { done(); return; }

  let n = 0;
  const next = () => {
    if (!B || B.over || n >= list.length) { done(); return; }
    const u = list[n++].u;
    const v = (table[u.cid] || {})[eid];
    Sound.play('skill/' + u.cid, 'common/tap');

    playCutIn({ img: CONFIG.charDir + u.cid + '.jpg', name: u.name,
                lines: Array.isArray(v) ? v : [v], foe: false,
                hold: CONFIG.halfVoiceMs || 0 }, next);
  };
  next();
}

function halfBreakExtra(cut) {
  if (!cut || !B || B.over) return;

  if (cut.years && forgetOf()) {
    if (addYears(cut.years, `<b>${cut.name}</b>`)) { loseByYears(); return; }
  }

  const fg = forgetOf();
  if (fg && fg.pinchMul > 1) {
    pushLog(`<span class="ult">年月の進みが ${fg.pinchMul}倍 になった</span>`
          + `　<span class="eff">このターン +${yearsPerTurn(B.turn)}年</span>`);
    toast(`ここから年月の進みが ${fg.pinchMul}倍 になります`, 3600);
  }

  const n = cut.stealSkill || 0;
  if (n > 0) {
    let took = 0;
    B.units.forEach((u, i) => {
      if (u.hp <= 0 || u.skillLeft <= 0) return;
      const d = Math.min(n, u.skillLeft);
      u.skillLeft -= d; took += d;
      popUnit(i, `技 −${d}`, 'seal');
    });

    if (B.reserve && B.reserve.skillLeft > 0) {
      B.reserve.skillLeft = Math.max(0, B.reserve.skillLeft - n);
    }
    pushLog(took > 0
      ? `<span class="seal">技を ${took} 回ぶん奪われた</span>　（味方全員 −${n}）`
      : '<span class="seal">奪う技が残っていなかった</span>');
  }

  renderBattle();
}

function playHalfGrant(cut, done) {
  if (!B || B.over || !cut) { done(); return; }
  const any = cut.healParty || cut.refillSkill || (cut.freeLost && !B.lostFree);
  if (!any) { done(); return; }

  if (cut.healParty) {
    const names = [], woke = [];
    B.units.forEach((u) => {
      if (u.hp >= u.max) return;
      const down = u.hp <= 0;
      const got = u.max - u.hp;
      u.hp = u.max;
      u.seal = 0;
      u._downLogged = false;
      u._lowSaid = false;
      u._landRevived = false;
      if (u.action !== 'attack') u.action = 'attack';
      if (u.st) u.st.healed = (u.st.healed || 0) + got;
      (down ? woke : names).push(u.name);
    });

    if (B.reserve && B.reserve.hp < B.reserve.max) {
      const down = B.reserve.hp <= 0;
      B.reserve.hp = B.reserve.max;
      B.reserve.seal = 0;
      B.reserve._downLogged = false;
      B.reserve._lowSaid = false;
      if (down) woke.push(B.reserve.name);
    }
    const all = names.concat(woke);
    pushLog(`<span class="heal">受けた傷も、無かったことになった</span>`
          + `${all.length ? `　（${all.join('・')} が全回復）` : ''}`
          + `${woke.length ? `　<span class="eff">${woke.join('・')} が立ち上がった</span>` : ''}`);
  }

  if (cut.refillSkill) {
    const names = [];
    B.units.forEach((u) => {
      if (u.hp <= 0 || u.skillMax <= 0 || u.skillLeft >= u.skillMax) return;
      u.skillLeft = u.skillMax;
      names.push(u.name);
    });
    if (B.reserve && B.reserve.skillMax > 0) B.reserve.skillLeft = B.reserve.skillMax;
    pushLog(names.length
      ? `<span class="eff">使った技も、無かったことになった</span>　（${names.join('・')} の技が戻った）`
      : '<span class="eff">使った技も、無かったことになった</span>');
  }

  const freeing = !!cut.freeLost && !B.lostFree;
  if (freeing) {
    B.lostFree = true;
    const names = B.units.filter((u) => u.hp > 0 && canLost(u.cid)).map((u) => u.name);
    pushLog(`<span class="lost">喪失スキルが解き放たれた</span>`
          + `　<span class="eff">HPに関わらず撃てる</span>${names.length ? `　（${names.join('・')}）` : ''}`);
    toast('HP・技が全回復し、喪失スキルが解き放たれました', 4200);
    Sound.play('common/lost', 'common/heal');
  } else {
    Sound.play('common/heal');
  }

  const ms = CONFIG.lostFreeFlashMs == null ? 1800 : CONFIG.lostFreeFlashMs;
  if (!freeing || ms <= 0) { renderBattle(); flushPops(); done(); return; }
  B.lostFlash = true;
  renderBattle();
  flushPops();
  setTimeout(() => {
    if (!B) { done(); return; }
    B.lostFlash = false;
    if (!B.over) renderBattle();
    done();
  }, ms);
}

function playHalfHeal(cut, done) {
  const h = (cut && cut.selfHeal) || 0;

  const rise = (cut && cut.maxHp > 0 && cut.maxHp > B.ehpMax) ? cut.maxHp : 0;
  if (!B || B.over || (h <= 0 && !rise) || (B.ehp >= B.ehpMax && !rise)) { done(); return; }
  const fx = CONFIG.halfHealFx || {};
  const blink = fx.blinkMs == null ? 1000 : fx.blinkMs;
  const fill  = fx.fillMs  == null ? 1300 : fx.fillMs;
  const bar = document.querySelector('.bar--enemy');
  const num = $('enemy-hpnum');

  const heal = () => {
    if (!B || B.over) { done(); return; }
    const before = B.ehp;

    B.ehp = Math.min(B.ehpMax, B.ehp + Math.round(B.ehpMax * h));
    const got = B.ehp - before;
    if (got > 0) {
      popEnemy(`+${got}`, 'heal');
      pushLog(`<b>${B.e.name}</b> は <span class="heal">${got}</span> 回復した`);
    }
    renderBattle();
    flushPops();
    setTimeout(() => {
      if (bar) bar.classList.remove('is-refill');
      if (num) num.classList.remove('is-refill');
      if (rise) { raiseMax(rise, done); return; }
      done();
    }, fill + 120);
  };

  if (blink <= 0 && fill <= 0) { heal(); return; }

  if (bar) {
    bar.style.setProperty('--refill-ms', fill + 'ms');
    bar.classList.add('is-refill');
  }
  if (num) num.classList.add('is-refill');
  Sound.play('common/heal');
  setTimeout(heal, blink);
}

function raiseMax(to, done) {
  if (!B || B.over || !(to > B.ehpMax)) { done(); return; }
  const fx = CONFIG.halfHealFx || {};
  const step = Math.max(1, fx.maxStep || 0) || (to - B.ehpMax);
  const ms   = fx.maxStepMs == null ? 260 : fx.maxStepMs;
  const from = fx.maxGrowScale == null ? 1.6 : fx.maxGrowScale;
  const num  = $('enemy-hpnum');

  const list = [];
  for (let v = B.ehpMax + step; v < to; v += step) list.push(v);
  list.push(to);

  pushLog(`<span class="ult">${B.e.name} の器そのものが深くなっていく</span>`);
  Sound.play('common/enemy_skill', 'common/enemy_attack');

  const clear = () => {
    if (!num) return;
    num.classList.remove('is-grow');
    num.style.removeProperty('--grow-from');
    num.style.removeProperty('--grow-ms');
  };

  let k = 0;
  const tick = () => {
    if (!B || B.over) { clear(); done(); return; }
    B.ehpMax = list[k];
    B.ehp = B.ehpMax;
    renderBattle();
    if (num && ms > 0) {

      const scale = 1 + (from - 1) * (1 - k / list.length);
      num.classList.remove('is-grow');
      void num.offsetWidth;
      num.style.setProperty('--grow-from', scale.toFixed(3));
      num.style.setProperty('--grow-ms', ms + 'ms');
      num.classList.add('is-grow');
    }
    k++;
    if (k < list.length) { setTimeout(tick, ms); return; }
    setTimeout(() => {
      clear();
      pushLog(`<b>${B.e.name}</b>　<span class="ult">最大HP ${to}</span>`);
      done();
    }, Math.max(ms, 340));
  };
  tick();
}

function useLost(u, i) {
  const sk = charById(u.cid).lost;
  B.oathUsed = true;
  pushLog(`<b>${u.name}</b>　<span class="lost">${sk.name}</span>`);

  if (sk.gamble > 0 && Math.random() >= sk.gamble) {
    screenFlash('lost');
    pushLog('<span class="seal">……外した。何も起こらない</span>');
    toast(`${sk.name} は外れた`);
    payLostCost(u, i);
    return;
  }

  if (sk.power > 0) {
    const n = Math.max(1, sk.hits || 1);
    let total = 0, tag = '';
    for (let k = 0; k < n; k++) {
      const r = strikeEnemy(u, sk.power, false, k);
      total += r.d;
      tag = r.tag;
      if (n > 1) slashFxAt(k, 'burst', 'lost');
    }

    screenFlash('lost');
    if (n <= 1) {
      slashFx('burst', 'lost');
      setTimeout(() => slashFx('burst', 'lost'), 170);
    }
    shakeScreen(true);
    let line = n > 1 ? `${n}連撃　<span class="dmg">${total}</span>${tag}`
                     : `<span class="dmg">${total}</span> のダメージ${tag}`;
    if (sk.drain > 0) {
      const got = healUnit(u, i, Math.round(total * sk.drain));
      line += `　<span class="heal">+${got}</span> 取り戻した`;
    }
    pushLog(line);
  }
  if (!(sk.power > 0)) { screenFlash('lost'); shakeScreen(true); }
  payLostCost(u, i);

  if (sk.healAll > 0) {
    let total = 0, back = [];
    B.units.forEach((t, ti) => {
      const down = t.hp <= 0;
      if (down && !sk.reviveAll) return;
      if (down) {

        const rr = sk.reviveRate != null ? sk.reviveRate : sk.healAll;
        t.hp = Math.max(1, Math.round(t.max * rr));
        t._downLogged = false;
        popUnit(ti, `+${t.hp}`, 'heal');
        back.push(t.name);
      } else {
        total += healUnit(t, ti, Math.round(t.max * sk.healAll));
      }
    });
    if (back.length) pushLog(`<b>${back.join('と')}</b> が立ち上がった`);
    if (total > 0) pushLog(`味方が <span class="heal">+${total}</span> 回復した`);

    if (sk.reviveAll) reviveFallen(sk.reviveRate != null ? sk.reviveRate : (sk.healAll || 0.6));
  }

  if (sk.healSelf > 0) {
    const got = healUnit(u, i, Math.round(u.max * sk.healSelf));
    if (got > 0) pushLog(`<b>${u.name}</b> が <span class="heal">+${got}</span> 取り戻した`);
  }

  if (sk.healReserve > 0 && B.reserve) {
    const r = B.reserve;
    const was = r.hp;
    r.hp = Math.max(1, Math.min(r.max, Math.round(r.max * sk.healReserve)));
    r.seal = 0;
    r._downLogged = false;
    r._lowSaid = false;
    if (was <= 0) {
      r.action = 'attack';
      pushLog(`控えの <b>${r.name}</b> が <span class="heal">息を吹き返した</span>`);
    } else if (r.hp > was) {
      pushLog(`控えの <b>${r.name}</b> が <span class="heal">+${r.hp - was}</span> 回復した`);
    }
  }

  if (sk.cut > 0) {
    B.guardAll = sk.cut;
    pushLog(sk.cut >= 1 ? 'このターン、味方はどんな攻撃も受けつけない'
                        : `味方全員が身をかためた（このターンの被害 ${Math.round(sk.cut * 100)}%減）`);
  }
  if (sk.up > 0) {
    B.atkUp = sk.turns || 3;
    B.atkUpRate = sk.up;
    pushLog(`味方全員の攻撃力が ${Math.round(sk.up * 100)}% 上がった`);
  }
  if (sk.down > 0) {
    B.defDown = sk.turns || 3;
    B.defDownRate = sk.down;
    pushLog(`${B.e.name} の守りが大きく緩んだ（防御−${Math.round(sk.down * 100)}%）`);
  }
  if (sk.atkDown > 0) {
    B.atkDown = sk.turns || 3;
    B.atkDownRate = sk.atkDown;
    pushLog(`${B.e.name} の力が削がれた（攻撃−${Math.round(sk.atkDown * 100)}%）`);
  }
  if (sk.back > 0) {
    B.rageBack += sk.back;

    if (!forgetOf()) {
      pushLog(rageNow() <= 0 ? '崩壊が完全に鎮まった' : `崩壊が ${sk.back} ターンぶん巻き戻った`);
    }
  }
  if (sk.silence > 0) {
    B.eSilence = Math.max(B.eSilence || 0, sk.silence);
    pushLog(`<span class="seal">${B.e.name} は技を思い出せない（${B.eSilence}ターン）</span>`);
  }

  if (sk.burn && sk.burn.turns > 0) {
    B.burn = Math.max(B.burn || 0, sk.burn.turns);
    B.burnRate = Math.max(B.burnRate || 0, sk.burn.rate || 0);
    pushLog(`<span class="eff">${B.e.name} が燃えつづけている</span>（毎ターン 最大HPの${Math.round(B.burnRate * 100)}% ／ ${B.burn}ターン）`);
  }

  if (sk.critUp && sk.critUp.turns > 0) {
    B.critUp = Math.max(B.critUp || 0, sk.critUp.turns);
    B.critUpMul = Math.max(B.critUpMul || 1, sk.critUp.mul || 2);
    pushLog(`味方全員の会心率が <span class="up">${B.critUpMul}倍</span> になった（${B.critUp}ターン）`);
  }

  if (sk.selfSeal > 0) {
    u.seal = (sk.selfSeal | 0) + 1;
    pushLog(`<b>${u.name}</b> は動力を使い切った（<span class="seal">${sk.selfSeal}ターン 動けない</span>）`);
  }
  if (sk.refillAll > 0) {
    const names = [];
    B.units.forEach((t) => {
      if (t.hp <= 0 || t.skillMax <= 0) return;
      const before = t.skillLeft;
      t.skillLeft = Math.min(t.skillMax, t.skillLeft + sk.refillAll);
      if (t.skillLeft > before) names.push(t.name);
    });
    if (names.length) pushLog(`${names.join('と')} が技を取り戻した`);
  }
}

function enemyBurnTick() {
  if (!B || B.over || !(B.burn > 0)) return false;
  const d = Math.max(1, Math.round((B.ehpMax || B.e.hp || 1) * (B.burnRate || 0)));
  B.ehp -= d;
  B.burn--;
  if (B.burn <= 0) B.burnRate = 0;
  popEnemy(String(d), 'weak');
  pushLog(`<span class="eff">炎天の理</span>　${B.e.name} に <span class="dmg">${d}</span>（残${B.burn}ターン）`);
  renderBattle();
  if (B.ehp <= 0) { endBattle(true); return true; }
  return false;
}

function weakestUnit(exceptIdx) {
  let best = -1, ratio = 2;
  B.units.forEach((u, i) => {
    if (u.hp <= 0 || i === exceptIdx) return;
    const r = u.hp / u.max;
    if (r < ratio) { ratio = r; best = i; }
  });
  return best;
}

function useOwn(u, i, done) {
  const c = charById(u.cid);
  const o = c.own;
  if (!o) { done(); return; }
  pushLog(`<b>${u.name}</b>　<span class="own">${o.name}</span>`);

  const cfgB = CONFIG.bubble || {};
  if (cfgB.on !== false && o.lines && o.lines.length) {
    pendingBubbles.push({ i, kind: 'own', text: o.lines[Math.floor(Math.random() * o.lines.length)] });
  }

  switch (o.type) {

    case 'cover':
      B.cover = { i, cut: o.value || 0.4 };
      pushLog('仲間の前に立った');
      break;

    case 'parry':
      B.parry = { i, power: o.power || 2.0, used: false };
      pushLog('間合いを計っている');
      break;

    case 'charge':
      u.charge = o.power || 2.4;

      if (o.back) {
        B.rageBack += o.back;
        if (!forgetOf()) pushLog(`<span class="eff">崩壊が ${o.back} ターンぶん戻った</span>`);
      }
      pushLog('次の一撃をためている');
      break;

    case 'rush': {
      const weak = elemMul(u.elem, B.e.elem) > 1;
      const n = weak ? (o.weakHits || 3) : (o.hits || 2);
      let total = 0, tag = '';
      for (let k = 0; k < n; k++) {
        const r = strikeEnemy(u, o.power || 0.45, false, k);
        total += r.d; if (r.tag) tag = r.tag;
        slashFxAt(k, weak ? 'heavy' : 'slash');
      }
      pushLog(`${n}連打　<span class="dmg">${total}</span>${tag}`);
      break;
    }

    case 'readAhead': {
      const rate = o.rate || 0.25, turns = o.turns || 3;
      if (B.atkUpRate <= rate) { B.atkUp = turns; B.atkUpRate = rate; }
      else B.atkUp = Math.max(B.atkUp, turns);
      pushLog(`<span class="eff">味方全員の攻撃が ${Math.round(rate * 100)}% 上がった</span>`);
      break;
    }

    case 'aim': {
      const rate = o.rate || 0.35, turns = o.turns || 2;
      if (B.defDownRate <= rate) { B.defDown = turns; B.defDownRate = rate; }
      else B.defDown = Math.max(B.defDown, turns);
      const r = strikeEnemy(u, o.power || 0.6);
      slashFx('slash');
      pushLog(`<span class="dmg">${r.d}</span>${r.tag}　<span class="eff">敵の守りが ${Math.round(rate * 100)}% 崩れた</span>`);
      break;
    }

    case 'chant':
      u.chant = o.power || 1.5;
      pushLog('<span class="eff">次の技に言葉を編みこんだ</span>');
      break;

    case 'pour': {
      const got = healUnit(u, i, Math.round(u.max * (o.value || 0.15)));
      let note = `<span class="heal">+${got}</span>`;
      const t = weakestUnit(i);
      if (t >= 0 && o.sub) {
        const g2 = healUnit(B.units[t], t, Math.round(B.units[t].max * o.sub));
        if (g2 > 0) note += `　${B.units[t].name} <span class="heal">+${g2}</span>`;
      }
      pushLog(note);
      break;
    }

    case 'record': {
      B.recording = { cut: o.value || 0.35 };
      const r = strikeEnemy(u, o.power || 0.5);
      slashFx('slash');
      pushLog(`<span class="dmg">${r.d}</span>${r.tag}　<span class="eff">この目で見た技を書き留める</span>`);
      break;
    }

    case 'bet': {
      const rate = o.rate == null ? 0.55 : o.rate;
      if (Math.random() < rate) {
        const run = u.betRun || 0;
        const mul = Math.min(o.cap || 4.0, (o.power || 2.0) + run * (o.step || 1.0));
        u.betRun = run + 1;
        const r = strikeEnemy(u, mul);
        slashFx(run > 0 ? 'heavy' : 'slash', 'sky');
        pushLog(`<span class="eff">当たり</span>（${mul.toFixed(1)}倍）　<span class="dmg">${r.d}</span>${r.tag}`
              + (u.betRun > 1 ? `　<span class="eff">${u.betRun}連勝</span>` : ''));
      } else {
        u.betRun = 0;
        const lose = Math.max(1, Math.round(u.max * (o.hurt || 0.10)));
        u.hp = Math.max(1, u.hp - lose);
        popUnit(i, `-${lose}`, '');
        pushLog(`<span class="seal">外れ</span>　${u.name} は <span class="dmg">${lose}</span> を失った`);
      }
      break;
    }

    case 'salvage': {
      const max = o.max == null ? Infinity : o.max;
      const used = u.salvaged || 0;
      const canPick = used < max && u.skillMax > 0 && u.skillLeft < u.skillMax;
      if (canPick) {
        u.salvaged = used + 1;
        const before = u.skillLeft;
        u.skillLeft = Math.min(u.skillMax, u.skillLeft + (o.value || 1));
        const got = u.skillLeft - before;
        const rest = max === Infinity ? '' : `／残り ${max - u.salvaged} 回`;
        pushLog(`<span class="eff">矢を拾い直した（技 +${got}${rest}）</span>`);
      } else {
        const r = strikeEnemy(u, o.power || 0.8);
        slashFx('slash');
        pushLog(`<span class="dmg">${r.d}</span>${r.tag}　<span class="eff">拾える矢は、もうない</span>`);
      }
      break;
    }

    case 'cure': {
      let t = weakestUnit(i);
      if (t < 0) t = i;
      const tu = B.units[t];
      const got = healUnit(tu, t, Math.round(tu.max * (o.value || 0.2)));
      let note = `${tu.name} <span class="heal">+${got}</span>`;
      if (tu.seal > 0) { tu.seal = 0; note += `　<span class="eff">動けるようになった</span>`; }
      pushLog(note);
      break;
    }

    default:
      pushLog('……何も起きなかった');
  }
  done();
}

function chantedSkill(u, sk) {
  if (!u.chant || !sk) return sk;
  const m = u.chant;
  const c = Object.assign({}, sk);
  if (c.power) c.power *= m;
  if (c.heal) c.heal = Math.min(1, c.heal * m);
  if (c.cut) c.cut = Math.min(1, c.cut * m);
  if (c.rate) c.rate *= m;
  if (c.back) c.back = Math.round(c.back * m);
  if (c.hits) c.hits = Math.max(1, Math.round(c.hits * m));
  if (c.turns) c.turns = Math.round(c.turns * m);
  if (c.times) c.times = Math.round(c.times * m);
  c.chanted = true;
  return c;
}

function useSkill(u, i) {
  const sk = chantedSkill(u, charById(u.cid).skill);
  u.skillLeft--;
  if (u.chant) { pushLog('<span class="eff">編んだ言葉が乗った</span>'); u.chant = 0; }
  pushLog(`<b>${u.name}</b>　<span class="sk">${sk.name}</span>`);

  critFixed = (sk.critRate == null ? null : sk.critRate);

  switch (sk.type) {
    case 'strike': {
      const r = strikeEnemy(u, sk.power);
      slashFx('heavy', 'sky');
      pushLog(`<span class="dmg">${r.d}</span> のダメージ${r.tag}`);
      break;
    }
    case 'multi': {
      const n = Math.max(1, sk.hits || 2);
      let total = 0, weak = '', crits = 0;
      for (let k = 0; k < n; k++) {
        const r = strikeEnemy(u, sk.power, false, k);
        total += r.d;
        if (r.crit) crits++;

        weak = r.tag.replace(/　<span class="crit">会心!<\/span>/, '');
        slashFxAt(k, 'heavy', 'sky');
      }
      const critTag = crits > 0 ? `　<span class="crit">会心${crits}回!</span>` : '';
      pushLog(`${n}連撃　<span class="dmg">${total}</span>${weak}${critTag}`);
      break;
    }
    case 'silence': {
      const r = strikeEnemy(u, sk.power);
      slashFx('heavy', 'sky');
      B.eSilence = Math.max(B.eSilence || 0, sk.turns || 2);
      pushLog(`<span class="dmg">${r.d}</span>${r.tag}　<span class="seal">${B.e.name} は技を思い出せない（${B.eSilence}ターン）</span>`);
      break;
    }
    case 'drain': {
      const r = strikeEnemy(u, sk.power);
      slashFx('heavy', 'sky');
      const got = healUnit(u, i, Math.round(r.d * sk.heal));
      pushLog(`<span class="dmg">${r.d}</span> を奪い <span class="heal">+${got}</span> 取り戻した${r.tag}`);
      break;
    }
    case 'break': {
      const r = strikeEnemy(u, sk.power);
      slashFx('heavy', 'sky');
      B.defDown = sk.turns;
      B.defDownRate = sk.down;
      pushLog(`<span class="dmg">${r.d}</span>　${B.e.name} の守りが緩んだ${r.tag}`);
      break;
    }
    case 'foresee': {
      const r = strikeEnemy(u, sk.power);
      slashFx('heavy', 'sky');
      B.rageBack += sk.back;

      pushLog(`<span class="dmg">${r.d}</span>`
            + (forgetOf() ? '' : `　崩壊が ${sk.back} ターンぶん巻き戻った`) + r.tag);
      break;
    }
    case 'weaken': {
      const r = strikeEnemy(u, sk.power);
      slashFx('heavy', 'sky');
      B.atkDown = sk.turns;
      B.atkDownRate = sk.down;
      pushLog(`<span class="dmg">${r.d}</span>　${B.e.name} の力が削がれた（攻撃−${Math.round(sk.down * 100)}%）${r.tag}`);
      break;
    }
    case 'refill': {
      const names = [];
      B.units.forEach((t, k) => {
        if (k === i || t.hp <= 0) return;
        const before = t.skillLeft;
        if (t.skillMax <= 0) return;
        t.skillLeft = Math.min(t.skillMax, t.skillLeft + (sk.amount || 1));
        if (t.skillLeft > before) names.push(t.name);
      });
      pushLog(names.length
        ? `${names.join('と')} が技を思い出した <span class="sk">+${sk.amount || 1}</span>`
        : '仲間はまだ技を忘れていない');
      break;
    }
    case 'healAll': {
      let total = 0;
      B.units.forEach((t, ti) => {
        if (t.hp <= 0) return;
        total += healUnit(t, ti, Math.round(t.max * sk.heal));
      });
      pushLog(`味方全員が <span class="heal">+${total}</span> 回復した`);
      break;
    }
    case 'healOne': {
      let target = null, ti = -1, worst = 1;
      B.units.forEach((t, k) => {
        if (t.hp <= 0) return;
        const r = t.hp / t.max;
        if (r < worst) { worst = r; target = t; ti = k; }
      });
      if (target) {
        const got = healUnit(target, ti, Math.round(target.max * sk.heal));
        pushLog(got > 0 ? `${target.name} が <span class="heal">+${got}</span> 回復した`
                        : `${target.name} は傷ひとつない`);
      }
      break;
    }
    case 'guardAll': {
      B.guardAll = sk.cut;
      pushLog(`味方全員が身をかためた（このターンの被害 ${Math.round(sk.cut * 100)}%減）`);
      break;
    }
    case 'buffAtk': {
      B.atkUp = sk.turns;
      B.atkUpRate = sk.up;
      pushLog(`味方全員の攻撃力が ${Math.round(sk.up * 100)}% 上がった`);
      break;
    }
    case 'revive': {

      let ti = -1;
      const pick = u.revivePick;
      if (pick != null && B.units[pick] && B.units[pick].hp <= 0) ti = pick;
      if (ti < 0) B.units.forEach((t, k) => { if (t.hp <= 0 && ti < 0) ti = k; });
      u.revivePick = null;
      const target = ti >= 0 ? B.units[ti] : null;
      if (target) {
        target.hp = Math.round(target.max * sk.hp);
        target._downLogged = false;
        popUnit(ti, `+${target.hp}`, 'heal');
        pushLog(`<b>${target.name}</b> が立ち上がった`);
        enemySay('revive');
      } else if (reviveFallen(sk.hp)) {

      } else {
        let total = 0;
        B.units.forEach((t, k) => { if (t.hp > 0) total += healUnit(t, k, Math.round(t.max * sk.heal)); });
        pushLog(total > 0 ? `誰も倒れていない。味方全員が <span class="heal">+${total}</span> 回復した`
                          : '誰も倒れていない。今はその必要がない');
      }
      break;
    }
    default:
      pushLog('しかし何も起こらなかった');
  }

  critFixed = null;
}

function landRevive(u, i) {
  const v = effOf(u, 'revive');
  if (!(v > 0) || u._landRevived) return false;
  u._landRevived = true;
  u.hp = Math.max(1, Math.round(u.max * Math.min(1, v)));
  u.seal = 0;
  u._downLogged = false;
  u._lowSaid = false;
  u.action = 'attack';
  popUnit(i, `+${u.hp}`, 'heal');
  Sound.play('common/heal');
  pushLog(`<span class="eff">${effName('revive')}</span>　<b>${u.name}</b> が立ち上がった`);
  enemySay('revive');
  return true;
}

function reviveFallen(hpRate) {
  if (!B) return false;

  let u = null;
  if (B.reserve && B.reserve.hp <= 0) {
    u = B.reserve;
  } else if (!B.reserve && B.fallen && B.fallen.length) {
    u = B.fallen.shift();
    B.reserve = u;
  }
  if (!u) return false;
  u.hp = Math.max(1, Math.round(u.max * (hpRate == null ? 1 : hpRate)));
  u.seal = 0;
  u.action = 'attack';
  u._downLogged = false;
  u._lowSaid = false;
  Sound.play('common/heal');

  pushLog(`控えの <b>${u.name}</b> が <span class="heal">息を吹き返した</span>`);
  toast(`控えの${u.name} が息を吹き返した`);
  enemySay('revive');
  return true;
}

let pendingPops = [];

let pendingHits = [];

function popUnit(i, text, cls, d) {
  pendingPops.push({ i, text, cls, d: d || 0 });
}

function hitUnit(i, kind = 'slash', d) {
  pendingHits.push({ i, kind, d: d || 0 });
}

function unitBox(i) {
  const host = $('unitfx');
  const card = document.querySelectorAll('#units .unit')[i];
  if (!host || !card) return null;
  const h = host.getBoundingClientRect();
  const r = card.getBoundingClientRect();
  const f = (card.querySelector('.unit__face') || card).getBoundingClientRect();

  const cards = document.querySelectorAll('#units .unit');
  let pitch = r.width + 8;
  if (cards.length > 1) {
    const a = cards[0].getBoundingClientRect(), b2 = cards[1].getBoundingClientRect();
    pitch = Math.round(b2.left - a.left);
  }
  return {
    left: r.left - h.left, top: r.top - h.top, w: r.width, h: r.height, card, pitch,
    face: { left: f.left - h.left, top: f.top - h.top, w: f.width, h: f.height },
  };
}

let pendingBubbles = [];
let bubbleEls = {};

const BUBBLE_TONE = { hurt: 'weak', low: 'weak', allyDown: 'hot',
                      enemyHalf: 'hot', weak: 'hit', win: 'win', join: 'hot' };

function bubbleLine(cid, kind) {
  const set = (typeof BUBBLE_LINES !== 'undefined' && BUBBLE_LINES[cid]) || null;
  let list = set && set[kind];
  if (!list || !list.length) list = (typeof BUBBLE_ANY !== 'undefined' && BUBBLE_ANY[kind]) || null;
  if (!list || !list.length) return '';
  return list[Math.floor(Math.random() * list.length)];
}

function someAliveUnit() {
  if (!B) return -1;
  const list = B.units.map((u, i) => ({ u, i })).filter((x) => x.u.hp > 0);
  if (!list.length) return -1;
  return list[Math.floor(Math.random() * list.length)].i;
}

const PAIR_SCENES = ['start', 'win', 'enemyHalf', 'allyDown', 'low', 'weak'];
let pairTimer = null;

function pickPairLine(v) {
  if (!v || !v.length) return null;
  if (Array.isArray(v[0])) return v[Math.floor(Math.random() * v.length)];
  return v;
}

function tryPair(i, force) {
  const cfg = CONFIG.bubble || {};
  if (typeof BUBBLE_PAIR === 'undefined') return false;
  if (!force && (!(cfg.pairChance > 0) || Math.random() >= cfg.pairChance)) return false;
  const me = B.units[i].cid;
  const cands = [];
  B.units.forEach((u, k) => {
    if (k === i || u.hp <= 0) return;
    const key = pairKeyOf(me, u.cid);
    if (BUBBLE_PAIR[key]) cands.push({ k, key, first: key.split('|')[0] === me });
  });
  if (!cands.length) return false;

  const c = cands[Math.floor(Math.random() * cands.length)];

  const line = pickPairLine(BUBBLE_PAIR[c.key]);
  if (!line) return false;

  const firstIdx = c.first ? i : c.k;
  const lastIdx  = c.first ? c.k : i;
  pendingBubbles.push({ i: firstIdx, kind: 'pair', text: line[0] });
  if (B) B.spoke = true;

  clearTimeout(pairTimer);
  pairTimer = setTimeout(() => {
    if (!B || B.over || current !== 'battle') return;
    const mate = B.units[lastIdx];
    if (!mate || mate.hp <= 0) return;
    pendingBubbles.push({ i: lastIdx, kind: 'pair', text: line[1] });
    flushPops();
  }, cfg.pairDelay || 850);
  return true;
}

function speakUnit(i, kind, force) {
  const cfg = CONFIG.bubble || {};
  if (cfg.on === false || i < 0) return;
  if (!B || B.over || !B.units[i] || B.units[i].hp <= 0) return;
  if (!force) {
    const c = (cfg.chance || {})[kind];
    if (c != null && Math.random() >= c) return;
  }

  if (PAIR_SCENES.indexOf(kind) >= 0 && tryPair(i)) return;
  const text = bubbleLine(B.units[i].cid, kind);
  if (!text) return;
  pendingBubbles.push({ i, kind, text });
  B.spoke = true;
}

function idleChat() {
  const cfg = CONFIG.bubble || {};
  if (cfg.on === false || !B || B.over || B.spoke) return;
  if (!(cfg.idleChance > 0) || Math.random() >= cfg.idleChance) return;
  const i = someAliveUnit();
  if (i < 0) return;
  tryPair(i, true);
}

function spawnBubbles(host) {
  const cfg = CONFIG.bubble || {};
  pendingBubbles.forEach(({ i, kind, text }) => {
    const box = unitBox(i);
    if (!box) return;
    if (bubbleEls[i]) { clearTimeout(bubbleEls[i]._t); bubbleEls[i].remove(); }
    const el = document.createElement('div');
    el.className = 'bubble' + (BUBBLE_TONE[kind] ? ' bubble--' + BUBBLE_TONE[kind] : '');
    el.textContent = text;
    el.style.left = `${box.face.left + box.face.w / 2}px`;

    const pitch = box.pitch || Math.round(box.face.w * 1.15);
    const maxW = Math.max(58, Math.min(160, pitch - 6));
    el.style.maxWidth = `${maxW}px`;
    host.appendChild(el);

    if (el.scrollWidth > maxW + 1) {
      const base = parseFloat(getComputedStyle(el).fontSize) || 12;
      const fit = Math.max(9, Math.floor(base * (maxW / el.scrollWidth) * 10) / 10);
      el.style.fontSize = `${fit}px`;
    }

    const gap = cfg.gap == null ? 4 : cfg.gap;
    el.style.top = `${Math.round(box.top - el.offsetHeight - gap)}px`;

    const halfW = el.offsetWidth / 2;
    const left = clamp(box.face.left + box.face.w / 2, halfW + 4, host.clientWidth - halfW - 4);
    el.style.left = `${left}px`;

    const tail = clamp(((box.face.left + box.face.w / 2) - (left - halfW)) / (halfW * 2), 0.12, 0.82);
    el.style.setProperty('--tail', `${Math.round(tail * 100)}%`);
    bubbleEls[i] = el;
    el._t = setTimeout(() => {
      el.remove();
      if (bubbleEls[i] === el) delete bubbleEls[i];
    }, cfg.ms || 1700);
  });
  pendingBubbles = [];
}

function clearBubbles() {
  clearTimeout(pairTimer);
  Object.keys(bubbleEls).forEach((k) => {
    if (bubbleEls[k]) { clearTimeout(bubbleEls[k]._t); bubbleEls[k].remove(); }
  });
  bubbleEls = {};
  pendingBubbles = [];
}

function flushPops() {
  const host = $('unitfx');
  if (!host) { pendingPops = []; pendingHits = []; pendingBubbles = []; return; }
  spawnBubbles(host);

  if (pendingHits.length) {

    pendingHits.forEach(({ i, kind, d }) => {
      if (d > 0) setTimeout(() => { if (B) spawnHitFx(host, i, kind); }, d);
      else spawnHitFx(host, i, kind);
    });
    shakeScreen(pendingHits.some((h) => h.kind === 'heavy'));
    pendingHits = [];
  }

  const cols = Math.max(1, B ? B.units.length : 3);
  const gap = CONFIG.hitGapMs == null ? 150 : CONFIG.hitGapMs;
  const hostW = host.clientWidth || 360;
  const put = ({ i, text, cls, d }) => {
    const sp = document.createElement('span');
    sp.className = `pop--${cls}`;
    sp.textContent = text;
    const box = unitBox(i);
    let cx = box ? box.left + box.w / 2 : ((i + 0.5) / cols) * hostW;

    const k = d > 0 && gap > 0 ? Math.round(d / gap) : 0;
    const step = (CONFIG.hitPopStep && CONFIG.hitPopStep.ally != null) ? CONFIG.hitPopStep.ally : 48;
    if (k) cx += (k % 2 ? 1 : -1) * step;

    cx = Math.min(Math.max(cx, 32), hostW - 32);
    sp.style.left = `${Math.round(cx)}px`;
    host.appendChild(sp);
    setTimeout(() => sp.remove(), 1900);
  };
  pendingPops.forEach((o) => { if (o.d > 0) setTimeout(() => put(o), o.d); else put(o); });
  pendingPops = [];
}

function spawnHitFx(host, i, kind) {
  const box = unitBox(i);
  if (!box) return;

  const wrap = document.createElement('div');
  wrap.className = 'hitfx';
  wrap.style.left = `${box.face.left}px`;
  wrap.style.top = `${box.face.top}px`;
  wrap.style.width = `${box.face.w}px`;
  wrap.style.height = `${box.face.h}px`;

  wrap.appendChild(buildFx(kind, 'hit'));

  host.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1000);

  box.card.classList.remove('is-hurt', 'is-hurt-heavy');
  void box.card.offsetWidth;
  box.card.classList.add('is-hurt');
  if (kind === 'heavy') box.card.classList.add('is-hurt-heavy');
}

function screenFlash(tint = 'lost', ms = 620) {
  const host = $('screen-battle');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'bigflash bigflash--' + tint;
  host.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function shakeScreen(hard) {
  const screen = $('screen-battle');
  if (!screen) return;
  screen.classList.remove('is-shake', 'is-shake-hard');
  void screen.offsetWidth;
  screen.classList.add(hard ? 'is-shake-hard' : 'is-shake');
}

function buildFx(kind = 'slash', tint) {
  const small = tint === 'hit';
  const wrap = document.createElement('div');
  wrap.className = 'fx fx--' + kind + (tint ? ' fx--' + tint : '');

  const lines = kind === 'burst' ? 7 : (kind === 'heavy' ? 4 : 3);
  for (let i = 0; i < lines; i++) {
    const sl = document.createElement('span');
    sl.className = 'fx__slash';
    sl.style.setProperty('--rot', `${rnd(-46, -14) + (i % 2 ? 62 : 0)}deg`);
    sl.style.setProperty('--off', `${rnd(-26, 26)}%`);
    sl.style.setProperty('--w', `${rnd(3, 7)}px`);
    sl.style.animationDelay = `${i * 0.055}s`;
    wrap.appendChild(sl);
  }
  const ring = document.createElement('span'); ring.className = 'fx__ring'; wrap.appendChild(ring);
  const flash = document.createElement('span'); flash.className = 'fx__flash'; wrap.appendChild(flash);

  const shards = kind === 'burst' ? 30 : (kind === 'heavy' ? 16 : 10);
  for (let i = 0; i < shards; i++) {
    const sp = document.createElement('span');
    sp.className = 'fx__shard';
    sp.style.setProperty('--a', `${(360 / shards) * i + rnd(-14, 14)}deg`);
    sp.style.setProperty('--d', `${small ? rnd(34, 80) : rnd(60, kind === 'burst' ? 230 : 150)}px`);
    sp.style.setProperty('--s', `${small ? rnd(3, 6) : rnd(3, kind === 'burst' ? 11 : 8)}px`);
    sp.style.animationDelay = `${rnd(0, 0.08)}s`;
    wrap.appendChild(sp);
  }
  return wrap;
}

function slashFx(kind = 'slash', tint) {
  const host = $('enemyfx');
  if (!host) return;
  const wrap = buildFx(kind, tint);
  host.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1100);

  shakeScreen(kind === 'heavy');
}

function popEnemy(text, kind, k) {
  const host = $('enemy');
  let p = host.querySelector('.enemy__pop');
  if (!p) { p = document.createElement('div'); p.className = 'enemy__pop'; host.appendChild(p); }

  const step = (CONFIG.hitPopStep && CONFIG.hitPopStep.foe != null) ? CONFIG.hitPopStep.foe : 84;
  p.style.left = k ? `calc(50% + ${(k % 2 ? 1 : -1) * step}px)` : '50%';
  p.textContent = text;
  p.className = 'enemy__pop' + (kind === 'heal' ? ' is-heal'
                              : kind === 'crit' ? ' is-crit'
                              : kind === 'weak' ? ' is-weak' : '');
  void p.offsetWidth;
  p.classList.add('is-on');
  clearTimeout(p._t);
  p._t = setTimeout(() => p.remove(), 1600);
  const body = $('enemy-body');
  body.classList.remove('is-hit');
  void body.offsetWidth;
  body.classList.add('is-hit');
}

function execute() {
  if (!B || B.busy || B.over) return;

  const ask = needReviveTarget();
  if (ask >= 0) {
    B.pickRevive = ask;
    B.swapPick = false;
    toast(`${B.units[ask].name}：起こす仲間をえらんでください`);
    renderBattle();
    return;
  }
  B.pickRevive = null;
  B.busy = true;
  renderBattle();

  const steps = [];
  B.units.forEach((u, i) => { if (u.hp > 0) steps.push({ kind: 'unit', i }); });
  steps.push({ kind: 'enemy' });

  let n = 0;
  const next = () => {
    if (!B || B.over) return;
    if (n >= steps.length) {

      landTurnEffects();
      if (enemyBurnTick()) return;
      if (tickYears()) return;

      B.turn++;
      B.swapUsed = false;
      B.swapPick = false;
      B.guardAll = 0;
      B.cover = null;
      B.parry = null;
      B.recording = null;
      if (B.atkUp > 0) B.atkUp--;
      if (B.critUp > 0) B.critUp--;
      if (B.defDown > 0) B.defDown--;
      if (B.atkDown > 0) B.atkDown--;
      if (B.pAtkDown > 0) B.pAtkDown--;
      if (B.eAtkUp > 0) B.eAtkUp--;
      if (B.eSilence > 0) B.eSilence--;
      B.pickRevive = null;

      const ev = (CONFIG.enemySay || {}).turnEvery;
      if (ev > 0 && B.turn % ev === 0) enemySay('turn');
      B.units.forEach((u) => {
        if (u.seal > 0) u.seal--;
        if (u.hp > 0) u.action = 'attack';
        u.revivePick = null;
      });

      if (B.reserve && B.reserve.seal > 0) B.reserve.seal--;

      idleChat();
      B.spoke = false;
      B.busy = false;
      renderBattle();
      flushPops();
      return;
    }
    const s = steps[n++];

    if (s.kind === 'unit') {
      const u = B.units[s.i];
      if (u.hp <= 0) { next(); return; }
      if (u.seal > 0) {
        pushLog(`<b>${u.name}</b> は動けない（<span class="seal">残${u.seal}ターン</span>）`);
        renderBattle();
        setTimeout(next, Math.max(180, CONFIG.battleSpeed * 0.55));
        return;
      }
      document.querySelectorAll('.unit')[s.i].classList.add('is-acting');

      if (u.st && u.st.act[u.action] != null) u.st.act[u.action]++;

      const finish = () => {
        renderBattle();
        flushPops();

        const tail = takeFxTail();
        if (B.ehp <= 0) { setTimeout(() => { if (B && !B.over) endBattle(true); }, tail); return; }

        if (halfBreakDue()) steps.splice(n, 0, { kind: 'half' });
        setTimeout(() => {
          document.querySelectorAll('.unit').forEach((e) => e.classList.remove('is-acting'));
          next();
        }, CONFIG.battleSpeed + tail);
      };

      const withPursuit = () => {
        const pv = effOf(u, 'pursuit');
        if (!pv || u.hp <= 0 || B.ehp <= 0) { finish(); return; }
        renderBattle();
        flushPops();
        setTimeout(() => {
          if (!B || B.over) return;
          const r = strikeEnemy(u, pv);
          slashFx('slash');
          pushLog(`<span class="eff">${effName('pursuit')}</span>　<span class="dmg">${r.d}</span>${r.tag}`);
          finish();
        }, Math.max(160, CONFIG.battleSpeed * 0.45));
      };

      if (u.action === 'lost') {
        if (lostReady(u)) {
          const lost = charById(u.cid).lost;

          playSkillCut(u, () => { useLost(u, s.i); cutYears('lost', lost); withPursuit(); }, lost);
          return;
        }

        u.action = 'attack';
      }

      if (u.action === 'skill' && u.skillLeft > 0 && charById(u.cid).skill) {
        playSkillCut(u, () => { useSkill(u, s.i); cutYears('skill', charById(u.cid).skill); withPursuit(); });
        return;
      }

      if (u.action === 'own' && charById(u.cid).own) {
        Sound.play('skill/' + u.cid, 'common/tap');
        useOwn(u, s.i, () => {
          cutYears('own', charById(u.cid).own);
          renderBattle(); flushPops(); finish();
        });
        return;
      }

      Sound.play('attack/' + u.cid, 'common/tap');

      const mul = u.charge || 1;
      if (u.charge) u.charge = 0;
      const r = strikeEnemy(u, mul, true);
      slashFx(r.weak || mul > 1 ? 'heavy' : 'slash');
      speakUnit(s.i, r.weak ? 'weak' : 'attack');
      pushLog(`<b>${u.name}</b> の攻撃${mul > 1 ? '<span class="eff">（ためた一撃）</span>' : ''}　<span class="dmg">${r.d}</span>${r.tag}`);
      withPursuit();
      return;

    } else if (s.kind === 'half') {

      if (!B.units.some((u) => u.hp > 0) && !bringReserve()) { endBattle(false); return; }
      playHalfBreak((esk) => {
        if (!B || B.over) return;
        if (!esk) Sound.play('common/enemy_attack');
        enemyStrike(esk);
      });
      return;

    } else {

      if (!B.units.some((u) => u.hp > 0) && !bringReserve()) { endBattle(false); return; }
      const alive0 = B.units.map((u, i) => ({ u, i })).filter((x) => x.u.hp > 0);
      if (!alive0.length) { endBattle(false); return; }

      if (B.skipEnemyTurn) { B.skipEnemyTurn = false; next(); return; }

      const useUlt = !!B.e.ult && (forgetOf() ? yearsUltDue() : rageNow() >= 1);
      const esk = useUlt ? null : pickEnemySkill();
      if (useUlt) {
        playEnemyUlt(() => { enemyStrike(null, true); });
        return;
      }
      if (esk) {
        playEnemyCut(esk, () => { enemyStrike(esk); });
        return;
      }
      Sound.play('common/enemy_attack');
      enemyStrike(null);
      return;
    }

    function enemyStrike(esk, isUlt) {
      esk = boostedSkill(esk);
      const atk = enemyAtk();
      const alive = B.units.map((u, i) => ({ u, i })).filter((x) => x.u.hp > 0);
      if (!alive.length) { endBattle(false); return; }

      let heavyHit = !!esk || !!isUlt;

      const hitOne = (t, rate, single, k) => {
        const bd = hitBeat(k);

        if (single && B.parry && !B.parry.used && B.parry.i === t.i && t.u.hp > 0) {
          B.parry.used = true;
          popUnit(t.i, '見切り', 'heal');
          pushLog(`<b>${t.u.name}</b> は攻撃を見切った`);
          const r = strikeEnemy(t.u, B.parry.power);
          slashFx('heavy');
          pushLog(`斬り返し　<span class="dmg">${r.d}</span>${r.tag}`);
          return 0;
        }

        let covered = false;
        if (single && B.cover && B.cover.i !== t.i) {
          const cu = B.units[B.cover.i];
          if (cu && cu.hp > 0) {
            pushLog(`<b>${cu.name}</b> が ${t.u.name} をかばった`);
            t = { u: cu, i: B.cover.i };
            covered = true;
          }
        }
        const mul = elemMul(B.e.elem, t.u.elem);
        let d = damage(Math.round(atk * rate * mul), t.u.def);
        const crit = lastCrit;
        if (covered) d = Math.round(d * (1 - B.cover.cut));

        if (esk && esk.name && B.recorded[esk.name]) d = Math.round(d * (1 - B.recorded[esk.name]));
        if (B.guardAll > 0) d = Math.round(d * (1 - B.guardAll));
        d = Math.max(BALANCE.minDamage, d);

        if (t.u.shield > 0) {
          const absorb = Math.min(t.u.shield, d);
          t.u.shield -= absorb;
          d -= absorb;

          if (absorb > 0) popUnit(t.i, `◇${absorb}`, 'shield');
        }

        t.u.hp = Math.max(0, t.u.hp - d);
        if (t.u.st) t.u.st.taken += d;

        if (t.u.hp > 0) {
          if (t.u.hp < t.u.max / 3 && !t.u._lowSaid) { t.u._lowSaid = true; speakUnit(t.i, 'low', true); }
          else if (d >= t.u.max * 0.22) speakUnit(t.i, 'hurt');
        }

        const critShown = crit && d > 0;
        popUnit(t.i, `-${d}`, critShown ? 'crit' : (mul > 1 ? 'weak' : 'dmg'), bd);
        hitUnit(t.i, heavyHit || critShown || mul > 1 ? 'heavy' : 'slash', bd);
        t._weak = mul > 1;
        t._crit = critShown;
        if (critShown) Sound.play('common/crit', 'common/enemy_attack');

        const th = effOf(t.u, 'thorns');
        if (th > 0 && d > 0 && B.ehp > 0) {
          const back = Math.max(1, Math.round(d * th));
          B.ehp -= back;
          if (t.u.st) t.u.st.dmg += back;
          B.pendingThorns = (B.pendingThorns || 0) + back;
        }
        return d;
      };

      const wtag = (t) => !t.u ? ''
        : (t._weak ? '<span class="weak">弱点!</span>' : '')
        + (t._crit ? '<span class="crit">会心!</span>' : '');

      if (isUlt) {
        const ult = B.e.ult;
        const ultPow = ult.power * (B.pinch ? ((CONFIG.halfBoost || {}).ult || 1) : 1);
        pushLog(`<b>${B.e.name}</b>　<span class="ult">${ult.name}</span>${boostTag()}`);
        const hits = alive.map((t) => `${t.u.name} <span class="dmg">${hitOne(t, ultPow)}</span>${wtag(t)}`);
        pushLog(hits.join('　／　'));
        if (forgetOf()) {

          if (addYears(ult.years || 0, `<b>${ult.name}</b>`)) { loseByYears(); return; }
        } else {
          B.rageBack = B.turn - 1;
          pushLog('崩壊が鎮まった');
        }
      } else if (esk) {

        const from = esk.stolenFrom && charById(esk.stolenFrom);
        pushLog(`<b>${B.e.name}</b>　<span class="sk">${esk.name}</span>${boostTag()}`
              + (from ? `　<span class="lost">${from.name}の技</span>` : ''));

        if (B.recording && esk.name && !B.recorded[esk.name]) {
          B.recorded[esk.name] = B.recording.cut;
          pushLog(`<span class="eff">「${esk.name}」を書き留めた</span>`);
        }

        let target = null;
        if (esk.kind === 'aoe') {
          const hits = alive.map((t) => `${t.u.name} <span class="dmg">${hitOne(t, esk.power)}</span>${wtag(t)}`);
          pushLog(hits.join('　／　'));
        } else if (esk.kind !== 'none' && esk.power > 0) {
          target = alive[Math.floor(Math.random() * alive.length)];
          pushLog(`${target.u.name} に <span class="dmg">${hitOne(target, esk.power, true)}</span>${wtag(target)}`);
        }

        if (esk.seal) {
          const pool = B.units.map((u, i) => ({ u, i })).filter((x) => x.u.hp > 0 && x.u.seal <= 0);
          const t = target && target.u.hp > 0 && target.u.seal <= 0
                  ? target : (pool.length ? pool[Math.floor(Math.random() * pool.length)] : null);
          if (t) {

            const g = effOf(t.u, 'sealGuard');
            if (g > 0 && Math.random() < Math.min(1, g)) {
              popUnit(t.i, 'すり抜けた', 'shield');
              pushLog(`<b>${t.u.name}</b> は縫い止められなかった`
                    + `（<span class="eff">${effName('sealGuard')}</span>）`);
            } else {
              t.u.seal = esk.seal.turns;
              t.u.action = 'attack';
              popUnit(t.i, '封', 'seal');
              pushLog(`<b>${t.u.name}</b> は縫い止められた（<span class="seal">${esk.seal.turns}ターン 行動できない</span>）`);
            }
          }
        }

        if (esk.selfHeal) {
          const before = B.ehp;
          B.ehp = Math.min(B.ehpMax, B.ehp + Math.round(B.ehpMax * esk.selfHeal));
          if (B.ehp > before) {
            popEnemy(`+${B.ehp - before}`, 'heal');
            pushLog(`${B.e.name} は <span class="heal">${B.ehp - before}</span> 回復した`);
          }
        }

        if (esk.atkDown) {
          B.pAtkDown = esk.atkDown.turns;
          B.pAtkDownRate = esk.atkDown.rate;
          pushLog(`味方の力が鈍った（攻撃−${Math.round(esk.atkDown.rate * 100)}%）`);
        }

        if (esk.selfAtkUp) {
          B.eAtkUp = esk.selfAtkUp.turns;
          B.eAtkUpRate = esk.selfAtkUp.rate;
          pushLog(`<b>${B.e.name}</b> の力が高まった（攻撃+${Math.round(esk.selfAtkUp.rate * 100)}%）`);
        }

        if (esk.years && forgetOf()) {
          if (addYears(esk.years, `<b>${esk.name}</b>`)) { loseByYears(); return; }
        }

        if (esk.rageUp) {
          B.rageBack -= esk.rageUp;
          pushLog(`<span class="ult">崩壊が ${esk.rageUp} ターンぶん進んだ</span>`);
        }

        if (esk.twice) {
          const alive2 = B.units.map((u, i) => ({ u, i })).filter((x) => x.u.hp > 0);
          if (alive2.length) {
            const t2 = alive2[Math.floor(Math.random() * alive2.length)];
            pushLog(`<b>${B.e.name}</b> は続けて動いた　${t2.u.name} に <span class="dmg">${hitOne(t2, 1, true, 1)}</span>${wtag(t2)}`);
          }
        }
      } else {
        const isAoe = B.e.aoeEvery > 0 && B.turn % B.e.aoeEvery === 0;
        if (isAoe) {
          heavyHit = true;
          const aoeRate = BALANCE.aoeRate * (B.pinch ? ((CONFIG.halfBoost || {}).aoe || 1) : 1);
          pushLog(`<b>${B.e.name}</b> の全体攻撃${boostTag()}`);
          const hits = alive.map((t) => `${t.u.name} <span class="dmg">${hitOne(t, aoeRate)}</span>${wtag(t)}`);
          pushLog(hits.join('　／　'));
        } else {

          const times = Math.max(1, B.e.atkTimes || 1);
          for (let k = 0; k < times; k++) {
            const rest = B.units.map((u, i) => ({ u, i })).filter((x) => x.u.hp > 0);
            if (!rest.length) break;
            const t = rest[Math.floor(Math.random() * rest.length)];
            const head = times > 1
              ? (k === 0 ? `<b>${B.e.name}</b> の攻撃` : `<b>${B.e.name}</b> は続けて撃った`)
              : `<b>${B.e.name}</b> の攻撃`;
            pushLog(`${head}　${t.u.name} に <span class="dmg">${hitOne(t, 1, true, k)}</span>${wtag(t)}`);
          }
        }
      }

      if (B.pendingThorns > 0) {
        popEnemy(String(B.pendingThorns));
        pushLog(`<span class="eff">${effName('thorns')}</span>　${B.e.name} に <span class="dmg">${B.pendingThorns}</span>`);
        B.pendingThorns = 0;
      }

      B.units.forEach((u, ui) => {
        if (u.hp > 0 || u._downLogged) return;
        if (landRevive(u, ui)) return;
        u._downLogged = true; B._anyDown = true;
        pushLog(`${u.name} は倒れた`);
        speakUnit(someAliveUnit(), 'allyDown', true);
        enemySay('kill');
      });

      renderBattle();
      flushPops();
      const tail = takeFxTail();
      if (B.ehp <= 0) { endBattle(true); return; }
      if (!B.units.some((u) => u.hp > 0) && !bringReserve()) { endBattle(false); return; }

      if (halfBreakDue()) steps.splice(n, 0, { kind: 'half' });
      setTimeout(next, CONFIG.battleSpeed + tail);
    }
  };

  setTimeout(next, 180);
}

function fleeBattle() {
  if (!B || B.over) return;
  if (B.busy) { toast('行動中は離脱できません'); return; }
  if (!confirm('この戦いから離脱します。\n記憶の欠片も経験値も手に入りません。よろしいですか？')) return;

  B.over = true;
  B.busy = false;
  $('skillcut').hidden = true;
  pendingPops = [];
  pendingHits = [];
  Sound.play('common/defeat');
  pushLog('<b>離脱した</b>　何も得られなかった');
  toast('戦いから離脱した');
  setTimeout(() => { renderStages(); go('stage'); }, 420);
}

function endBattle(win) {
  B.over = true;
  B.busy = false;
  $('skillcut').hidden = true;
  Sound.play(win ? 'common/victory' : 'common/defeat');

  enemySay(win ? 'lose' : 'win');
  if (win) {
    $('enemy-body').classList.add('is-dead');
    pushLog(`<b>${B.e.name}</b> は消えていった`);
    speakUnit(someAliveUnit(), 'win', true);
    flushPops();
  }

  if (win && CONFIG.afterTale) {
    const out = battleOutcome();
    const eid = B.e.id;
    playWinFade(() => openAfterTale(eid, out));
    return;
  }
  if (win) { playWinFade(() => showResult(true)); return; }
  setTimeout(() => showResult(false), 800);
}

let winFadeT = [];

function clearWinFade() {
  winFadeT.forEach(clearTimeout);
  winFadeT = [];
  const bo = $('blackout');
  if (bo) { bo.classList.remove('is-on'); bo.style.removeProperty('--blackout-ms'); }
  const body = $('enemy-body');
  if (body) body.classList.remove('is-farewell');
}

function playWinFade(next) {
  const cf = CONFIG.winFade || {};
  const farewell = cf.farewellMs == null ? 1500 : cf.farewellMs;
  const fade = cf.fadeMs == null ? 800 : cf.fadeMs;
  const hold = cf.holdMs == null ? 200 : cf.holdMs;
  const out = cf.outMs == null ? 700 : cf.outMs;
  const bo = $('blackout');
  if (!bo) { setTimeout(next, 1200); return; }

  clearWinFade();
  const body = $('enemy-body');
  if (body && farewell > 0) {
    body.style.setProperty('--farewell-ms', farewell + 'ms');
    body.classList.add('is-farewell');
  }

  winFadeT.push(setTimeout(() => {
    bo.style.setProperty('--blackout-ms', fade + 'ms');
    void bo.offsetWidth;
    bo.classList.add('is-on');
  }, farewell));

  winFadeT.push(setTimeout(() => {
    next();
    bo.style.setProperty('--blackout-ms', out + 'ms');
    void bo.offsetWidth;
    bo.classList.remove('is-on');
    winFadeT.push(setTimeout(clearWinFade, out + 60));
  }, farewell + fade + hold));
}

function showResult(win) {

  if (!B) return;
  lastResultWin = win;
  const e = B.e;
  const rate = win ? 1 : BALANCE.loseRate;
  const exp = Math.round(rewardExp(e) * rate);
  const shards = Math.round(rewardShards(e) * rate);

  const firstClear = win && !S.cleared[e.id];
  const bonus = firstClear ? (CONFIG.firstClearBonus || 0) : 0;
  S.shards += shards + bonus;
  if (win) S.cleared[e.id] = true;

  const ups = [];
  const gainers = S.party.concat(S.reserve && !S.party.includes(S.reserve) ? [S.reserve] : []);
  gainers.forEach((cid) => {
    const own = S.chars[cid];
    if (!own) return;
    const before = own.lv;
    own.exp += exp;
    while (own.lv < CONFIG.maxLevel && own.exp >= expToNext(own.lv)) {
      own.exp -= expToNext(own.lv);
      own.lv++;
    }
    if (own.lv >= CONFIG.maxLevel) own.exp = 0;
    if (own.lv > before) ups.push(`${charById(cid).name} が Lv.${before} → <span class="up">Lv.${own.lv}</span>`);
  });

  save();

  $('result-h').textContent = win ? '勝利' : '敗北';
  $('result-h').className = 'result__h ' + (win ? 'win' : 'lose');
  $('result-body').innerHTML = `
    ${win ? '' : (B.yearsOver
      ? '<div>——戦っていたことも、忘れた。それでも、灰の上には足あとが残っている。</div>'
      : '<div>力及ばず退いた。それでも得たものはある。</div>')}
    <div>経験値 <b>${exp}</b></div>
    <div>記憶の欠片 <b>+${shards}</b></div>
    ${bonus ? `<div class="up">初撃破ボーナス 記憶の欠片 +${bonus}</div>` : ''}
    ${ups.length ? '<div>' + ups.join('<br>') + '</div>' : ''}
    ${firstClear && ENEMIES[ENEMIES.length - 1].id !== e.id ? '<div class="up">新しい道が開けた</div>' : ''}
    ${firstClear && ENEMIES[ENEMIES.length - 1].id === e.id
      ? `<div class="up">${e.forget ? '——忘れるまでは、覚えている。' : '世界は、思い出した。'}</div>` : ''}
  `;
  setUiBg('result-bg', win ? CONFIG.bgResultWin : CONFIG.bgResultLose);
  $('btn-result-history').hidden = false;

  const rb = $('btn-result-record');
  rb.hidden = !win;
  rb.disabled = false;
  rb.textContent = '戦いの記憶を残す';
  if (win) {
    const rec = makeRecord(true);
    rb.onclick = () => {
      if (!S.playerName) { askPlayerName(() => doLeave(rec, rb)); return; }
      doLeave(rec, rb);
    };
  }
  go('result');
}

const V = { scale: 1, x: 0, y: 0, pointers: new Map(), startDist: 0, startScale: 1,
            dragging: false, lastX: 0, lastY: 0, lastTap: 0 };

function applyViewer() {
  $('viewer-img').style.transform =
    `translate(${V.x}px, ${V.y}px) scale(${V.scale})`;
}

function openViewer(src, title, sub) {
  $('viewer-img').src = src;
  $('viewer-cap').innerHTML = sub ? `${title}<small>${sub}</small>` : title;
  V.scale = 1; V.x = 0; V.y = 0; V.pointers.clear();
  applyViewer();
  $('viewer').hidden = false;
}

function closeViewer() { $('viewer').hidden = true; }

function zoomAt(factor) {
  V.scale = clamp(V.scale * factor, 1, 5);
  if (V.scale === 1) { V.x = 0; V.y = 0; }
  applyViewer();
}

(function setupViewer() {
  const stage = $('viewer-stage');

  stage.addEventListener('pointerdown', (e) => {
    stage.setPointerCapture(e.pointerId);
    V.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (V.pointers.size === 2) {
      const [a, b] = [...V.pointers.values()];
      V.startDist = Math.hypot(a.x - b.x, a.y - b.y);
      V.startScale = V.scale;
    } else {
      V.dragging = true;
      V.lastX = e.clientX; V.lastY = e.clientY;
      stage.classList.add('is-grabbing');
    }
  });

  stage.addEventListener('pointermove', (e) => {
    if (!V.pointers.has(e.pointerId)) return;
    V.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (V.pointers.size === 2) {
      const [a, b] = [...V.pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (V.startDist > 0) {
        V.scale = clamp(V.startScale * (dist / V.startDist), 1, 5);
        if (V.scale === 1) { V.x = 0; V.y = 0; }
        applyViewer();
      }
    } else if (V.dragging && V.scale > 1) {
      V.x += e.clientX - V.lastX;
      V.y += e.clientY - V.lastY;
      V.lastX = e.clientX; V.lastY = e.clientY;
      applyViewer();
    }
  });

  const up = (e) => {
    V.pointers.delete(e.pointerId);
    if (V.pointers.size < 2) V.startDist = 0;
    if (V.pointers.size === 0) {
      V.dragging = false;
      stage.classList.remove('is-grabbing');
    }
  };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);

  stage.addEventListener('click', () => {
    const now = performance.now();
    if (now - V.lastTap < 320) {
      V.scale > 1 ? zoomAt(1 / V.scale) : zoomAt(2.4);
      V.lastTap = 0;
    } else {
      V.lastTap = now;
    }
  });

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });

  $('viewer-close').onclick = closeViewer;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('viewer').hidden) closeViewer();
  });
})();

function openHistory() {
  if (!B || !B.history.length) { toast('まだ記録がありません'); return; }
  let html = `<div class="md__title">戦闘の記録</div>
              <div class="md__sub">${B.e.name}</div>
              <div class="hist" id="hist">`;
  let lastTurn = -1;
  B.history.forEach((h) => {
    if (h.turn !== lastTurn) {
      lastTurn = h.turn;
      html += `<div class="hist__turn">ターン ${h.turn}</div>`;
    }
    html += `<p class="hist__line">${h.html}</p>`;
  });
  html += '</div>';
  openModal(html);
  const el = $('hist');
  el.scrollTop = el.scrollHeight;
}

function openModal(html) {
  $('modal-panel').innerHTML =
    '<button type="button" class="md__close" id="md-close" aria-label="閉じる">×</button>' + html;
  $('modal').hidden = false;
  $('md-close').onclick = closeModal;
}
function closeModal() { $('modal').hidden = true; }

function openHelp() {
  const h = (typeof HELP !== 'undefined' && HELP) || null;
  if (!h) return;
  const bold = (t) => escapeHtml(String(t || ''))
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  openModal(
    `<div class="md__label">${escapeHtml(h.title || '')}</div>`
    + `<p class="help__lead">${bold(h.lead)}</p>`
    + `<ol class="help__list">`
    + (h.items || []).map((it) =>
        `<li><b class="help__h">${bold(it.h)}</b><span>${bold(it.t)}</span></li>`).join('')
    + `</ol>`
    + `<p class="help__close">${bold(h.close)}</p>`
    + (h.credit ? `<div class="help__credit">`
        + `<b>${escapeHtml(h.credit.h || '')}</b>`
        + `<span>${bold(h.credit.t)}</span></div>` : ''));
}
$('modal').addEventListener('click', (e) => { if (e.target === $('modal')) closeModal(); });

const REVEAL_BASE = () => (CONFIG.revealText ? 1780 : 500);
const TIMELINE = () => ({
  doorOpen: REVEAL_BASE() + 320,
  end:      REVEAL_BASE() + 1350,
});
let revealTimers = [];
let revealDone = null;

function buildSparks(count = 30) {
  const wrap = $('reveal-sparks');
  wrap.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.style.setProperty('--a', `${(360 / count) * i + rnd(-5, 5)}deg`);
    s.style.setProperty('--d', `${rnd(28, 74)}vmax`);
    s.style.setProperty('--s', `${rnd(3, 8)}px`);
    s.style.setProperty('--dur', `${rnd(0.9, 1.5)}s`);
    s.style.setProperty('--delay', `${rnd(0.10, 0.24)}s`);
    wrap.appendChild(s);
  }
}

function playReveal(onOpen) {
  const t = TIMELINE();
  $('reveal-text').textContent = CONFIG.revealText || '';
  revealDone = onOpen;
  const r = $('reveal');
  r.classList.toggle('has-text', !!CONFIG.revealText);
  r.classList.remove('is-playing');
  void r.offsetWidth;
  r.classList.add('is-playing');
  revealTimers.push(setTimeout(() => { if (revealDone) { revealDone(); revealDone = null; } }, t.doorOpen));
  revealTimers.push(setTimeout(finishReveal, t.end));
}

function finishReveal() {
  revealTimers.forEach(clearTimeout);
  revealTimers = [];
  if (revealDone) { revealDone(); revealDone = null; }
  $('reveal').classList.remove('is-playing');
  pulling = false;
  updatePullBtn();
}

$('reveal').addEventListener('click', () => { if (CONFIG.revealSkippable) finishReveal(); });

$('btn-back').onclick = () => go(current === 'tale' ? 'stage' : 'home');
$('btn-tale-go').onclick = () => {
  if (current === 'after') {
    resetTaleButtons();

    if (B && B.e && B.e.ending && !(S.cleared && S.cleared[B.e.id])) { openEnding(true); return; }
    showResult(true);
    return;
  }
  if (!taleEid) return;
  markTaleSeen(taleEid);
  startBattle(taleEid);
};
$('btn-tale-skip').onclick = () => { if (taleEid) startBattle(taleEid); };
$('btn-go-stage').onclick = () => { renderStages(); go('stage'); };
if ($('btn-help')) $('btn-help').onclick = openHelp;

if ($('btn-go-ending')) $('btn-go-ending').onclick = () => openEnding(false);
$('btn-ending-go').onclick = () => openCredits();
$('btn-ending-back').onclick = () => { renderHome(); go('home'); };
$('btn-credits-skip').onclick = creditsDone;
$('btn-credits-ok').onclick = () => {
  if (endingPending) { endingPending = false; showResult(true); return; }
  renderHome(); go('home');
};
$('btn-go-party').onclick = () => { renderParty(); go('party'); };
$('btn-go-book').onclick  = () => { renderBook(); go('book'); };

if ($('btn-go-records')) {
  $('btn-go-records').onclick = () => { renderRecords(); go('records'); };
}
$('btn-storage').onclick = () => openStorageModal('out');
$('btn-awaken').onclick = () => openStorageModal('in');
$('stone-name').onclick = () => askPlayerName(renderRecords);

$('dock-char').onclick = () => openGacha('char');
$('dock-land').onclick = () => openGacha('land');
$('btn-pull').onclick = pull;
if ($('btn-pull10')) $('btn-pull10').onclick = pullMulti;

$('btn-exec').onclick = () => {
  if (B && !B.busy && !B.over && B.pickRevive != null) {
    B.pickRevive = null;
    toast('選ぶのをやめました');
    renderBattle();
    return;
  }
  execute();
};
$('btn-history').onclick = openHistory;
$('btn-flee').onclick = fleeBattle;
$('btn-result-history').onclick = openHistory;
$('btn-result-ok').onclick = () => { renderHome(); go('home'); };

$('btn-reset').onclick = () => {
  const got = ownedChars().length;
  if (!confirm(`集めた仲間 ${got} 人と風景 ${ownedLands().length} 枚、レベルや進行がすべて消えます。\n本当にはじめからやり直しますか？`)) return;
  if (!confirm('元に戻せません。よろしいですか？')) return;
  resetSave();
};

function preload() {
  ownedChars().forEach((c) => { new Image().src = CONFIG.charDir + c.id + '.jpg'; });
  ownedLands().forEach((l) => { new Image().src = CONFIG.landDir + l.file; });

  const af = CONFIG.titleAfter;
  if (af && af.bg) new Image().src = CONFIG.uiDir + af.bg;
}

function init() {
  S = loadSave();
  askPersist();
  Sound.init();

(function startAudioOnFirstTap() {
  const kick = () => {
    Sound.playBgm(bgmForScreen(current));
    document.removeEventListener('pointerdown', kick);
    document.removeEventListener('keydown', kick);
  };
  document.addEventListener('pointerdown', kick);
  document.addEventListener('keydown', kick);
})();

$('btn-sound').onclick = (e) => { e.stopPropagation(); toggleSoundPanel(); };
document.addEventListener('pointerdown', (e) => {
  if (!$('sound-panel').hidden && !e.target.closest('#sound-panel, #btn-sound')) {
    toggleSoundPanel(false);
  }
});
  applyTitle();
  registerEnemyBgm();
  registerTitleAfterBgm();
  renderSoundBtn();
  buildSparks();
  document.documentElement.style.setProperty('--ui-bg-opacity', String(CONFIG.bgUiOpacity ?? 0.38));

  document.documentElement.style.setProperty('--title-bg-opacity', String(CONFIG.bgTitleOpacity ?? 1));
  setHomeBg();
  setUiBg('result-bg', CONFIG.bgResultWin);
  renderHud();
  renderHome();
  go('home');
  preload();
  showSharedRecord();

  if (CONFIG.helpOnFirst && typeof HELP !== 'undefined') {
    let seen = null;
    try { seen = localStorage.getItem('remains_help_seen'); } catch (e) {}
    if (!seen) {
      try { localStorage.setItem('remains_help_seen', '1'); } catch (e) {}
      setTimeout(openHelp, 700);
    }
  }
  if (restoredFromBak) {
    setTimeout(() => toast('セーブが読めなかったので、ひとつ前のデータから戻しました'), 900);
  }
}

init();

(function startAudioOnFirstTap() {
  const kick = () => {
    Sound.playBgm(bgmForScreen(current));
    document.removeEventListener('pointerdown', kick);
    document.removeEventListener('keydown', kick);
  };
  document.addEventListener('pointerdown', kick);
  document.addEventListener('keydown', kick);
})();

$('btn-sound').onclick = (e) => { e.stopPropagation(); toggleSoundPanel(); };
document.addEventListener('pointerdown', (e) => {
  if (!$('sound-panel').hidden && !e.target.closest('#sound-panel, #btn-sound')) {
    toggleSoundPanel(false);
  }
});

window.resetSave = resetSave;
window.__S = () => S;
