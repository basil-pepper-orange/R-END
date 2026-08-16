const ELEMENTS = {
  sea:    { key: 'sea',    name: '海', color: '#5aa6d8', strongAgainst: 'flame'  },
  forest: { key: 'forest', name: '森', color: '#6cbf7a', strongAgainst: 'sea'    },
  flame:  { key: 'flame',  name: '炎', color: '#e08a5a', strongAgainst: 'forest' },

  void:   { key: 'void',   name: '無', color: '#aeb4c2',
            strongAgainst: ['flame', 'sea', 'forest'] },
};

const CONFIG = {

  title:    'REMAINS at the END',

  titleSmall: 'at the',
  titleSub: '― 世界の記憶を繋ぎとめる物語 ―',

  charDir: 'images/characters/',
  landDir: 'images/landscapes/',
  uiDir:   'images/ui/',

  bgTitle:      'title.jpg',
  bgResultWin:  'win.jpg',
  bgResultLose: 'lose.jpg',
  bgUiOpacity:  0.38,

  bgTitleOpacity: 1,

  titleAfter: {
    after: 'e7',
    bg:    '2title.jpg',
    bgm:   'home_after.mp3',
    title: '',
    sub:   '',
  },

  helpOnFirst: true,

  copyright: '© 2026 バジルペッパー・オレンジ',

  startShards: 1500,
  startCharId: 'baldo',

  gachaSkipStartChar: false,

  charGachaEven: true,

  showCharStars: false,

  costCharGacha: 100,
  costLandGacha: 100,

  multiPull: 10,
  multiPullCostMul: 1,

  firstClearBonus: 500,

  dupeCharLevelUp: 3,
  dupeCharShards: 80,
  dupeLandShards: 80,

  elemWeakMul: 1.5,

  critRate: 0.15,
  critMul:  1.5,

  rageAtkMax: 0.8,

  partySize: 3,

  lostMinLevel: 6,
  lostLevelCost: 5,
  lostHpRate: 0.5,

  maxLevel: 150,

  maxCharRank: 20,
  charRankBonus: 0.05,
  charRankStarFrom: 11,

  revealNew: true,
  revealSkippable: true,
  revealText: '',

  battleSpeed: 620,

  hitGapMs: 300,

  hitPopStep: { ally: 48, foe: 84 },

  maxLandRank: 5,
  landRankMul: [1.0, 1.5, 2.1, 2.8, 3.6],

  skillUses: 0,

  dragHoldMs: 300,
  dragSlopPx: 18,

  grandEntryMs: 1500,
  grandEntryScale: 2.4,

  grandEntryTextWaitMs: 0,
  grandEntryTextMs: 3000,

  skillCutMs: 2000,

  lostCutMs: 2600,

  stolenCutMs: 3300,

  dangerRate: 0.5,

  bubble: {
    on: true,
    ms: 1700,
    gap: 4,

    healMin: 0.08,

    pairChance: 0.45,
    pairDelay: 850,

    idleChance: 0.25,
    chance: {
      start: 1, attack: 0.22, weak: 0.5, hurt: 0.35, low: 1,
      heal: 0.35, allyDown: 1, enemyHalf: 1, win: 1, join: 1,
    },
  },

  sfxDir: 'sfx/',
  bgmDir: 'bgm/',

  recordApi: '',
  recordMax: 10,
  shareUrl: '',
  shareTag: '#RemainsAtTheEnd',

  bgmLevels: [0.08, 0.18, 0.32, 0.50, 0.72],
  sfxLevels: [0.15, 0.30, 0.50, 0.72, 1.00],
  defaultBgmLevel: 2,
  defaultSfxLevel: 2,

  bgm: {
    home:         'home.mp3',
    gacha:        'gacha.mp3',
    tale:         'tale.mp3',
    battle:       'battle.mp3',
    battle_pinch: 'battle_pinch.mp3',
    result:       'result.mp3',
    lose:         'lose.mp3',

    ending:       'e8_result.mp3',
    credits:      'e8_result.mp3',
  },

  bgmBoost: {
    battle_pinch: 1,
  },

  bgmFallback: {
    gacha:        'home',
    tale:         'home',
    battle_pinch: 'battle',
    result:       'home',
    lose:         'home',
    ending:       'home',
    credits:      'home',
  },

  winFade: { farewellMs: 1500, fadeMs: 1300, holdMs: 250, outMs: 900 },

  bgmFadeMs: 260,

  bgmPauseOnHide: true,

  bgmResumeFadeMs: 400,

  bgmPinchRatio: 0.5,

  bgmPinchLatch: true,

  afterTale: true,
  afterQuickTurn: 3,
  afterLongTurn: 15,

  halfBoost: {
    power: 1.35, ult: 1.25, aoe: 1.20,
    rate: 1.30, turns: 1, heal: 1.60, rageUp: 1,
  },

  halfHealFx: { blinkMs: 1000, fillMs: 1300,
                maxStep: 10000, maxStepMs: 260, maxGrowScale: 1.6 },

  halfCutMs: 3500,

  halfVoiceMs: 2500,

  lostFreeFlashMs: 1800,

  halfBreak: true,
  halfBreakSkipTurn: true,

  halfBreakDefault: {
    name: '崩れはじめる',
    lines: ['——まだ、消えない', '壊れながら、まだ立っている'],
  },

  enemySay: {
    on: true,
    fadeMs: 420,
    holdMs: 3600,
    gapTurns: 1,
    hurtRate: 0.05,
    lowRate: 0.20,
    turnEvery: 3,
    max: { hurt: 4, kill: 3, low: 2, win: 1, lose: 1, turn: 4, crit: 2, revive: 2 },
  },

  toastMs: 2200,
  toastSkillMs: 4950,
};

const CHARACTERS_ALL = [
  { id: 'baldo', elem: 'flame', name: 'バルド', title: '酔いどれの古強者', rarity: 3,
    desc: '崩壊の前も後も戦い続けた老兵。義手の重さより、覚えている名前の数のほうが重いと笑う。',
    base: { hp: 219, atk: 31, def: 21 }, grow: { hp: 19, atk: 2.72, def: 2.01 },

    own: { name: '注ぐ', type: 'pour', value: 0.20, sub: 0.15,
           desc: '欠けた杯をあおる。自分のHPを20%、いちばん弱っている仲間を15%回復する。',
           lines: ['まだやれるさ', 'ほれ、一杯やるか'] },
    skill: { name: '祝杯', type: 'healAll', heal: 0.60,
             desc: '欠けた杯を掲げる。味方全員のHPを最大値の60%回復する。',
             lines: ['まだ飲み足りん。付き合え', '乾杯だ。生きてる奴だけな'] },

    lost: { name: '酒断連撃', type: 'oath', power: 10.0, healAll: 1.00, reviveAll: true, reviveRate: 0.40,
            desc: '酒を断ち、かつての強者の顔つきに戻る。攻撃力の10倍のダメージ。味方全員のHPが全回復し、倒れた仲間もHP40%で立ち上がる。',
            lines: ['俺が酒を断つと、こんなもんよ', 'いい酒のために、酒を断つ！'] },
  },

  { id: 'alvis', elem: 'sea', name: 'アルヴィス', title: '白鎧の機械兵', rarity: 3,
    desc: '面の下に、顔はない。守れと命じた声はとうに絶えたのに、その一行だけが正しく残っている。',
    base: { hp: 329, atk: 28, def: 29 }, grow: { hp: 29, atk: 2.24, def: 2.74 },

    own: { name: 'かばう', type: 'cover', value: 0.40,
           desc: '前へ出て、仲間への単体攻撃を肩代わりする。自分が受ける被害は40%減る。',
           lines: ['前に出る', '下がっていろ'] },
    skill: { name: '城壁の誓い', type: 'guardAll', cut: 0.85,
             desc: '前へ出て盾を構える。そのターン、味方全員の被ダメージを85%カットする。',
             lines: ['防壁、展開。下がっていろ', 'この位置は、譲らない'] },

    lost: { name: '強撃の盾', type: 'oath', power: 10.0, atkDown: 0.50, turns: 3,
            desc: '守るためだけに持っていた盾を、はじめて振り抜く。攻撃力の10倍のダメージ。3ターンのあいだ敵の攻撃力を50%下げる。',
            lines: ['もう守るだけでは、守れない', '——命令を、こちらで書き換える'] },
  },

  { id: 'rita', elem: 'flame', name: 'リタ', title: '素手の闘士', rarity: 2,
    desc: '武器は持たない。拳のほうが、壊すものを選べるから。',
    base: { hp: 216, atk: 31, def: 18 }, grow: { hp: 16, atk: 2.72, def: 1.84 },

    own: { name: '連打', type: 'rush', power: 0.45, hits: 2, weakHits: 3,
           desc: '軽い拳を2回。属性で有利な相手には3回入る。',
           lines: ['ほら、畳みかける！', 'まだまだ！いくよ！'] },
    skill: { name: '体幹を砕く', type: 'break', power: 5, down: 0.50, turns: 3,
             desc: '急所を的確に打ち抜く。攻撃力の5倍のダメージ。3ターンのあいだ敵の防御を50%下げる。',
             lines: ['そこ、がら空き', 'ほら、よろめいてる！'] },

    lost: { name: '粉砕爆拳', type: 'oath', power: 9.0, hits: 2, down: 0.60, turns: 2,
            desc: '拳が砕けるのを承知で踏み込む。攻撃力の9倍のダメージを2回。2ターンのあいだ敵の防御を60%下げる。',
            lines: ['あんたも一緒に砕けちまいな！', '両方で殴る。それで足りる'] },
  },

  { id: 'gold', elem: 'flame', name: 'ゴルド', title: '砂の鉄巨人', rarity: 3,
    desc: '砂に埋もれていた守護機。誰の命令を待っているのか、本人も忘れている。',
    base: { hp: 323, atk: 43, def: 19 }, grow: { hp: 23, atk: 3.61, def: 1.83 },

    own: { name: '構える', type: 'charge', power: 2.4, back: 1,
           desc: 'このターンは動かない。次の通常攻撃が2.4倍になり、敵の崩壊を1ターン戻す。',
           lines: ['ためる', '次で、砕く'] },
    skill: { name: '鉄槌', type: 'strike', power: 7.8,
             desc: '全重量を乗せて振り下ろす。攻撃力の7.8倍のダメージ。',
             lines: ['……排除、開始', '命令を、実行する'] },

    lost: { name: '炉心開放', type: 'oath', power: 22.0, selfSeal: 1,
            desc: '動力炉に残った最後の熱を、すべて右腕へ送り込む。攻撃力の22倍のダメージ。次のターン、自分は動けない。',
            lines: ['命令は、要らん。これは自分で決めた', '……次に動けるかは、計算していない'] },
  },

  { id: 'shion', elem: 'forest', name: 'シオン', title: '風の斥候', rarity: 4,
    desc: '誰よりも先に地平の向こうを見てくる。帰ってくるなり、見たものを声いっぱいに話してくれる。',
    base: { hp: 213, atk: 29, def: 18 }, grow: { hp: 13, atk: 2.26, def: 1.64 },

    own: { name: '先読み', type: 'readAhead', rate: 0.50, turns: 2,
           desc: '先の動きを読んで伝える。味方全員の攻撃力が2ターンのあいだ50%上がる。',
           lines: ['見えた、そっちだよ！', 'よし、私が見てくる'] },
    skill: { name: '先を読む', type: 'foresee', power: 7, back: 5,
             desc: '次の一手を読み切る。攻撃力の7倍のダメージ。敵の「崩壊」を5ターンぶん巻き戻す。',
             lines: ['次の動き、見えた！', 'そっちじゃないよ、こっち！'] },

    lost: { name: '心身統一', type: 'oath', power: 0, healSelf: 1.00, healReserve: 1.00, back: 99,
            desc: '走るのをやめて、息をととのえる。自分と控えの仲間ひとりのHPが全回復し、敵の崩壊が0%に戻る。',
            lines: ['一回だけ、止まる', '……いま、ぜんぶ整えた'] },
  },

  { id: 'hazuki', elem: 'forest', name: 'ハズキ', title: '花隠れの剣', rarity: 2,
    desc: '花を髪に挿すのは、抜いた刀を納める場所を忘れないため。',
    base: { hp: 216, atk: 37, def: 15 }, grow: { hp: 16, atk: 3.16, def: 1.36 },

    own: { name: '見切る', type: 'parry', power: 2.0,
           desc: 'このターンは抜かない。敵の単体攻撃を1度だけ完全に見切り、そのまま2倍で斬り返す。',
           lines: ['……見えました', 'そのままお返します'] },
    skill: { name: '斬り結ぶ', type: 'drain', power: 4.8, heal: 0.45,
             desc: '踏み込んで刃を合わせる。攻撃力の4.8倍のダメージ。その45%ぶん自分のHPが戻る。',
             lines: ['花が散る前に', '一撃で決める'] },

    lost: { name: '蓮華斬刹', type: 'oath', power: 15.0, critUp: { mul: 1.5, turns: 2 },
            desc: '大事な花を投げ捨てて、はじめて本気で抜く。攻撃力の15倍のダメージ。2ターンのあいだ味方全員の会心率が1.5倍になる。',
            lines: ['この花の命の重み、容赦はなしです', '——ひと息で、断ち斬ります'] },
  },

  { id: 'reia', elem: 'sea', name: 'レイア', title: '流れ者の早撃ち', rarity: 2,
    desc: '帽子の下でいつも次の町を考えている。それでも、まだこの隊にいる。',
    base: { hp: 213, atk: 26, def: 14 }, grow: { hp: 13, atk: 2.44, def: 1.37 },

    own: { name: '狙う', type: 'aim', rate: 0.35, turns: 2,
           desc: '急所を指し示す。2ターンのあいだ、味方全員の攻撃が敵の防御を35%無視する。',
           lines: ['そこ、崩した！狙って', '見えた！行って！'] },
    skill: { name: '号砲', type: 'buffAtk', up: 0.70, turns: 3,
             desc: '空へ一発撃ち上げる。3ターンのあいだ味方全員の攻撃力が70%上がる。',
             lines: ['ほら、顔を上げて、今よ！', '合図はあたしが出す'] },

    lost: { name: '近接連弾', type: 'oath', power: 10.0, up: 1.00, turns: 3,
            desc: '逃げ足を捨て、至近から撃ち込む。攻撃力の10倍のダメージ。3ターンのあいだ味方全員の攻撃力が100%上がる。',
            lines: ['逃げ足は、過去に置いてきた', '私が前に出て、逃げ場所を守る'] },
  },

  { id: 'erna', elem: 'flame', name: 'エルナ', title: '灰読みの魔女', rarity: 4,
    desc: '灰の積もり方から、そこに何があったかを言い当てる。帽子のレンズは世界の裏側を覗くためのもの。',
    base: { hp: 218, atk: 41, def: 14 }, grow: { hp: 18, atk: 3.63, def: 1.37 },

    own: { name: '唱える', type: 'chant', power: 1.5,
           desc: '灰に言葉を混ぜる。次に使うスキルの効果が1.5倍になる（1回ぶん）。',
           lines: ['いま編んでる', 'よく燃えて'] },
    skill: { name: '呪詞をつむぐ', type: 'weaken', power: 3.6, down: 0.55, turns: 3,
             desc: '敵の力を編み直す。攻撃力の3.6倍のダメージ。3ターンのあいだ敵の攻撃力を55%下げる。',
             lines: ['見せてもらうわ、あなたの中身', '灰は嘘をつかない'] },

    lost: { name: '炎天の理', type: 'oath', power: 10.0, burn: { rate: 0.05, turns: 3 },
            desc: '周囲の灰をすべて炎に変えて撒く。攻撃力の10倍のダメージ。3ターンのあいだ、毎ターン敵の最大HPの5%を焼く。',
            lines: ['これが灰の最後、見せてあげるわ', '炎に抱かれなさい。運命が言っている'] },
  },

  { id: 'owen', elem: 'forest', name: 'オーウェン', title: '最後の司書', rarity: 3,
    desc: '誰も来なくなった図書館で、ひとり頁をめくり続けた。彼が読み終えるまで、その本の中の世界は消えない。',
    base: { hp: 220, atk: 27, def: 21 }, grow: { hp: 20, atk: 2.25, def: 2.01 },

    own: { name: '記す', type: 'record', power: 0.5, value: 0.35,
           desc: '敵がこのターン使った技を書き留める。以後、その技から受ける被害が35%減る。',
           lines: ['書き留める', '記録する'] },
    skill: { name: '頁をめくる', type: 'refill', amount: 2,
             desc: '忘れかけた技を思い出させる。自分以外の味方のスキル使用回数が2回ぶん戻る。',
             lines: ['物語には、続きがある', '思い出すさ。君の手が覚えている'] },

    lost: { name: '書の魔獣', type: 'oath', power: 10.0, refillAll: 99,
            desc: '二冊とない召喚書を破り、獣を呼ぶ。攻撃力の10倍のダメージ。味方全員のスキル使用回数が全快する。',
            lines: ['貴重な本だ、代償は払ってもらう', '——さあ出でよ。書の力見せてやろう'] },
  },

  { id: 'muse', elem: 'sea', name: 'ミュゼ', title: '旅の薬師', rarity: 4,
    desc: '腰に下げた瓶の中身を、本人以外は誰も知らない。効くことだけは全員が知っている。',
    base: { hp: 222, atk: 26, def: 24 }, grow: { hp: 22, atk: 2.26, def: 2.28 },

    own: { name: '診る', type: 'cure', value: 0.20,
           desc: 'いちばん弱っている仲間を20%回復し、動けない状態を解く。',
           lines: ['じっとして', 'もう平気ね'] },
    skill: { name: '息を吹き返せ', type: 'revive', hp: 1.00, heal: 0.36,
             desc: '倒れた仲間の口に瓶をあてる。HP全快で立ち上がる。誰も倒れていなければ全員を36%回復。',
             lines: ['ほら、まだ終わっていない', '口を開けて。よく効くから'] },

    lost: { name: '在庫一掃', type: 'oath', power: 0, healAll: 0.80, reviveAll: true, reviveRate: 0.60, refillAll: 1,
            desc: '瓶を残らず空ける。倒れた仲間も含めて味方全員がHP80%まで戻り、技も1回ぶん戻る。',
            lines: ['これで今日は、閉店よ', '……全部あげる。持っていって'] },
  },

  { id: 'raizu', elem: 'sea', name: 'ライズ', title: '一擲の賭博師', rarity: 4,
    desc: '沈みかけた船の賭場で、最後まで札を伏せなかった女。指の指輪はぜんぶ勝ち取ったもので、ひとつも売る気はないらしい。',
    base: { hp: 218, atk: 29, def: 17 }, grow: { hp: 18, atk: 2.64, def: 1.65 },

    own: { name: '賭ける', type: 'bet', rate: 0.50, power: 6.0, step: 0.5, cap: 10, hurt: 0.12,
           desc: '運に任せて張る。6割の確率で攻撃力の5倍のダメージ。当て続けるほど0.5倍ずつ上がる（最大10倍）。外すと最大HPの12%を失い、積み上げは0に戻る。',
           lines: ['さあ、張った', '乗るわよ'] },
    skill: { name: '札をすり替える', type: 'silence', power: 6, turns: 2,
             desc: '攻撃力の6倍のダメージ。2ターンのあいだ敵は固有技を使えなくなる。',
             lines: ['あなたの手札、見せてもらったわ', 'あら、そっちの札はもう無いの'] },

    lost: { name: '大勝負', type: 'oath', gamble: 0.50, power: 35.0, silence: 5, healSelf: 1.00,
            desc: '指輪も有り金も卓に置く。50%で「攻撃力の35倍のダメージ＋5ターン敵の固有技を封じる＋自分のHPが全回復」。外れると何も起きない。',
            lines: ['降りないわよ。降り方を知らないの', '——このひと張りに、全部乗せる'] },
  },

  { id: 'kain', elem: 'forest', name: 'カイン', title: '拾い矢の狩人', rarity: 3,
    desc: '射った矢は、かならず拾いに行く。「同じ矢で足りるなら、それでいい」が口ぐせで、折れた矢羽根も一晩で直してしまう。',
    base: { hp: 217, atk: 31, def: 17 }, grow: { hp: 17, atk: 2.72, def: 1.75 },

    own: { name: '拾う', type: 'salvage', value: 3, power: 0.8,
           desc: '射った矢を拾って束ね直す。自分のスキル使用回数が3回ぶんもどる（回数制限なし）。もどせないときは攻撃力の0.8倍で射る。',
           lines: ['まだ使える', '拾ってくる'] },

    skill: { name: '継ぎ矢', type: 'multi', power: 1.3, hits: 3, critRate: 0.80,
             desc: '攻撃力の1.3倍で3回続けて射る。1本ごとに80%で会心する。',
             lines: ['当てますから、三本で足ります', '三度続けても、外さない'] },

    lost: { name: '掃討の矢', type: 'oath', power: 3.0, hits: 8, critUp: { mul: 2, turns: 3 },
            desc: '拾わないと決めた矢を、続けざまに放つ。攻撃力の3倍のダメージを8回。3ターンのあいだ味方全員の会心率が2倍になる。',
            lines: ['この八本は、拾いません', '——射線は、通しました'] },
  },

];

const CHARACTERS = CHARACTERS_ALL.filter((c) => !c.wip);

const LANDSCAPES = [
  { id: 'l01', file: '01.jpg', name: '苔むす小川',     rarity: 1, bonus: { hp: 25, atk: 3,  def: 2 },
    eff: { type: 'regen',       value: 40   } },
  { id: 'l02', file: '02.jpg', name: '椰子と白い渚',   rarity: 1, bonus: { hp: 25, atk: 4,  def: 1 },
    eff: { type: 'recall',      value: 0.10 } },
  { id: 'l03', file: '03.jpg', name: '木洩れ日の浅瀬', rarity: 1, bonus: { hp: 30, atk: 3,  def: 2 },
    eff: { type: 'healParty',   value: 0.04 } },
  { id: 'l04', file: '04.jpg', name: '丘の上の家',     rarity: 2, bonus: { hp: 55, atk: 6,  def: 4 },
    eff: { type: 'guardOthers', value: 0.08 } },
  { id: 'l05', file: '05.jpg', name: '岩山の巨獣',     rarity: 3, bonus: { hp: 70, atk: 12, def: 6 },
    eff: { type: 'pursuit',     value: 0.35 } },
  { id: 'l06', file: '06.jpg', name: '遠浅の海',       rarity: 2, bonus: { hp: 60, atk: 5,  def: 5 },
    eff: { type: 'shield',      value: 0.08 } },
  { id: 'l07', file: '07.jpg', name: '岩間の清水',     rarity: 1, bonus: { hp: 28, atk: 3,  def: 3 },
    eff: { type: 'revive',      value: 0.20 } },

  { id: 'l08', file: '08.jpg', name: '翠の滝',         rarity: 3, bonus: { hp: 85, atk: 9,  def: 9 },
    eff: { type: 'thorns',      value: 0.10 } },
  { id: 'l09', file: '09.jpg', name: '夏日のテラス',   rarity: 2, bonus: { hp: 50, atk: 7,  def: 4 },
    eff: { type: 'elemBoost',   value: 0.10 } },
  { id: 'l10', file: '10.jpg', name: '谷あいの長椅子', rarity: 2, bonus: { hp: 58, atk: 6,  def: 4 },
    eff: { type: 'lastStand',   value: 0.12 } },

  { id: 'l11', file: '11.jpg', name: '星月夜の尖塔',   rarity: 3, bonus: { hp: 65, atk: 11, def: 5 },
    eff: { type: 'critRate',    value: 0.05 } },
  { id: 'l12', file: '12.jpg', name: '揚羽の谷',       rarity: 2, bonus: { hp: 54, atk: 5,  def: 6 },
    eff: { type: 'sealGuard',   value: 0.20 } },
];

const LAND_EFFECTS = {
  regen:       { name: '小川の癒し',   text: (v) => `毎ターン、自分のHPが <b>${Math.round(v)}</b> 回復する` },
  recall:      { name: '潮風のひと息', text: (v) => `毎ターン <b>${Math.round(v * 100)}%</b> の確率で、自分のスキル使用回数が1回もどる` },
  healParty:   { name: '木洩れ日',     text: (v) => `毎ターン、味方全員が最大HPの <b>${Math.round(v * 100)}%</b> 回復する` },
  guardOthers: { name: '家の守り',     text: (v) => `<b>自分以外</b>の味方の防御が <b>${Math.round(v * 100)}%</b> 上がる` },
  pursuit:     { name: '追撃',         text: (v) => `攻撃・スキルのあと、攻撃力の <b>${v.toFixed(2)}倍</b> で追撃する` },
  shield:      { name: '遠浅の守り',   text: (v) => `戦闘開始時、最大HPの <b>${Math.round(v * 100)}%</b> ぶんのバリアを張る` },

  oathCost:    { name: '誓いの軽さ',   text: (v) => `喪失スキルで下がるレベルが <b>${Math.floor(v)}</b> 減る` },
  revive:      { name: '清水の記憶',   text: (v) => `倒れたとき、<b>1戦に1度だけ</b>最大HPの <b>${Math.round(v * 100)}%</b> で立ち上がる` },
  thorns:      { name: '滝の返し',     text: (v) => `攻撃を受けたとき、そのダメージの <b>${Math.round(v * 100)}%</b> を敵に返す` },
  elemBoost:   { name: '夏の陽',       text: (v) => `属性で有利なときの倍率が <b>+${v.toFixed(2)}</b> される` },
  lastStand:   { name: '帰る場所',     text: (v) => `自分のHPが半分以下のあいだ、攻撃力が <b>${Math.round(v * 100)}%</b> 上がる` },

  critRate:    { name: '流れ星',       text: (v) => `自分の会心率が <b>+${Math.round(v * 100)}%</b> される` },
  sealGuard:   { name: '翅の軽さ',     text: (v) => `<b>${Math.round(v * 100)}%</b> の確率で、縫い止められない` },
};

const GACHA_RATE = {
  char: { 4: 8,  3: 27, 2: 65 },
  land: { 3: 12, 2: 33, 1: 55 },
};

const ENEMIES_ALL = [
  {
    id: 'e1', elem: 'forest', name: '角の亡骸', label: '彷徨うもの',
    story: '降り積もる灰の中に細い道が見えた。その先には忘れられた森の大きな門が見えた。',
    desc: '記憶を失った者が枯れ枝の角を拾って身にまとった姿。足元の花の意味も、もう分からない。',
    hp: 1000, atk: 24, def: 8, aoeEvery: 0, rage: 0,
    reward: { exp: 50, shards: 1000 },
    color: '#8a7d63', image: 'images/enemies/e1.jpg',
    entryLines: ['……誰だ？返してくれ、……俺の記憶を', '何を失ったのかを、……思い出せない'],

    half: { name: '崩壊に取り込まれる', lines: ['俺にはもう、……何もない', 'お前たちも、こちらへ来るんだ'] },
    skills: [
      { name: '角を振るう', kind: 'single', power: 1.7, every: 3,
        lines: ['……奪ったのは、誰だ', '……こちらへ、来るんだ'] },
      { name: '枯れ枝を撒く', kind: 'aoe', power: 0.75, every: 5,
        lines: ['俺の失くしたものを教えてくれ', 'もう、……思い出せない'] },
    ],
  },
  {
    id: 'e2', elem: 'sea', name: '白獣の番人', label: '番人',
    story: '番人は沈黙し、白い獣は森へ帰っていった。<br>道は開いている。',
    desc: '忘れられた森の門を、白い獣とともに守り続けている。名を呼ばれることを何より嫌う。',
    hp: 5000, atk: 62, def: 24, aoeEvery: 4, rage: 0.12,
    reward: { exp: 200, shards: 1200 },
    color: '#9aa78c', image: 'images/enemies/e2.jpg',
    entryLines: ['その名を、呼ぶな', 'ここから先は、通さない'],

    half: { name: '鎖が軋む', lines: ['門が、軋んでいる', '退けと、言った'] },
    skills: [
      { name: '白獣を放つ', kind: 'aoe', power: 0.95, every: 5,
        lines: ['この先は、もう眠っている', '——退け'] },
      { name: '牙で縫い止める', kind: 'single', power: 1.25, every: 3,
        seal: { turns: 1 },
        lines: ['お前たちはそこで見ていろ', 'ほら、動くな'] },
      { name: '獣を奮い立たせる', kind: 'none', power: 0, every: 4,
        selfAtkUp: { rate: 0.35, turns: 3 },
        lines: ['さあ起きろ、白よ、仕事だ', 'まだだ、まだ足りん'] },
    ],
    ult: { name: '白獣を解き放つ', power: 2.0,
           lines: ['食い尽くせ、白よ', 'ここまでだ、門は開かれない'] },
  },
  {
    id: 'e3', elem: 'flame', name: '無貌の司祭', label: '司祭',
    story: '祈りは途切れた。だが、思い出されることを厭う者がまだいる。',
    desc: '世界の終わりを見届ける役目を負った者。祈りの言葉だけが、その顔の代わりをしている。',
    hp: 7000, atk: 100, def: 38, aoeEvery: 3, rage: 0.13,
    reward: { exp: 400, shards: 1500 },
    color: '#8f86c4', image: 'images/enemies/e3.jpg',
    entryLines: ['長い道をよく来た。もう休んでよい', '思い出すには、時が経ち過ぎた'],

    half: { name: '祈りが信じる', lines: ['祈りだけが、我らを導く', '……ならば、こちらから往こう'] },
    skills: [
      { name: '終焉の祈り', kind: 'aoe', power: 0.80, every: 4,
        atkDown: { rate: 0.15, turns: 2 },
        lines: ['安らかに、すべて忘れなさい', '祈りは、忘れない'] },
      { name: '黙祷を強いる', kind: 'single', power: 0.60, every: 5,
        seal: { turns: 2 },
        lines: ['さあ、口を閉じなさい', '祈りの時間です'] },
      { name: '終末を早める', kind: 'none', power: 0, every: 3,
        rageUp: 3,
        lines: ['早く、終わりましょう', '待つ理由が、ありますか？'] },
    ],
    ult: { name: '終焉の合唱', power: 2.1,
           lines: ['さあ、皆で眠りましょう！', '終焉の時間です、さあ祈りを！'] },
  },
  {
    id: 'e4', elem: 'sea', name: '白冠の聖者', label: '白冠',
    story: '白冠は落ちた。その先で、骸の獣が世界の終わりを守っている。',
    desc: 'かつて世界を導いた者。灰にのまれ、目に映る景色をひとつずつ塗り潰していく。',
    hp: 8000, atk: 200, def: 60, aoeEvery: 3, rage: 0.13,
    reward: { exp: 700, shards: 2000 },
    color: '#d8cfae', image: 'images/enemies/e4.jpg',
    entryLines: ['また、色が増えたね', 'それは持ち出してはいけないものだ'],

    half: { name: '白が乱れる', lines: ['色が、混ざる。やめて', 'お前たちは、少し眩しすぎる'] },
    skills: [
      { name: '白の祝福', kind: 'single', power: 1.9, every: 4, selfHeal: 0.03,
        lines: ['全てを白にして、忘れましょう', '眠りなさい。白がすべてを覚えている'] },
      { name: '白の再生', kind: 'none', power: 0, every: 5, selfHeal: 0.10,
        lines: ['傷も、塗り潰せばいい', '白から、やり直そう'] },
      { name: '二度の裁き', kind: 'single', power: 1.10, every: 3, twice: true,
        lines: ['一度では、わからないようね', '白に、塗ってあげる'] },
    ],
    ult: { name: '白に還す', power: 2.2,
           lines: ['この色も間違い、白を塗るわ', 'さあ、お還り。白が歓迎するわ'] },
  },
  {
    id: 'e5', elem: 'flame', name: '骸を継ぐ者', label: '継ぐ者',
    story: '巨骸は崩れた。風が通り、地平の向こうが少しだけ見えた。',
    desc: '崩壊の時、最後まで戦い続けた兵。いまは巨大な骸を連れ、世界の終わりの姿を守っている。',
    hp: 12000, atk: 380, def: 84, aoeEvery: 2, rage: 0.14,
    reward: { exp: 1500, shards: 2200 },
    color: '#c8b48e', image: 'images/enemies/e5.jpg',
    entryLines: ['ここが最後だ。引き返せ', '骸は、まだ眠らない'],

    half: { name: '骸が軋む', lines: ['骸が、起きた。もう引き返せんぞ', '……ならば。もっと来い'] },
    skills: [
      { name: '巨骸の顎', kind: 'aoe', power: 1.10, every: 4,
        lines: ['喰い千切れ、お前たちも沈め！', 'そうだ、ここが世界の果てだ！'] },
      { name: '骸を奮わせる', kind: 'none', power: 0, every: 3,
        selfAtkUp: { rate: 0.40, turns: 3 }, rageUp: 2,
        lines: ['餌の時間だ。さあ起きろ', '世界の果てを見せてやれ'] },
      { name: '二連の骨槍', kind: 'single', power: 1.00, every: 5, twice: true,
        seal: { turns: 1 },
        lines: ['避けられまい。これが世界の意思だ', '崩れ去れ！'] },
    ],
    ult: { name: '世界の果ての一撃', power: 2.3,
           lines: ['ここですべてを終わらそう', '骸よ、残さず喰らえ！'] },
  },

  {
    id: 'e6', elem: 'forest', name: '忘れざる王', label: '戴冠',
    story: '果ての国の名を、彼らは聞いた。もう誰も呼ばない名を、ひとつ覚えて帰ってきた。',
    desc: '崩壊のとき、ただひとり何ひとつ忘れなかった王。臣も城も灰に還ったのに、戴冠だけが終わらない。覚えているという一点で、この世界のだれよりも重い。',
    hp: 20000, atk: 1725, def: 235, aoeEvery: 3, rage: 0.11,
    reward: { exp: 4000, shards: 3000 },
    color: '#8a9a72', image: 'images/enemies/e6.jpg',

    bgm: { battle: 'e6_battle.mp3', battle_pinch: 'e6_battle_pinch.mp3' },
    entryLines: ['余は、忘れておらぬ', '名を名乗れ。覚えておいてやる'],

    read: { rate: 0.30, same: 0.10 },

    half: { name: '国の名を呼ぶ', lines: ['ほら、まだ名がある、記憶がある', '余が覚えている限り、国は在る'] },
    skills: [
      { name: '戴冠の重み', kind: 'aoe', power: 1.15, every: 4,
        atkDown: { rate: 0.40, turns: 2 },
        lines: ['重かろう。余は六十年これを載せている', 'お前たちとは、重みが違う'] },
      { name: '臣従を命ずる', kind: 'single', power: 1.50, every: 5, twice: true,
        seal: { turns: 2 },
        lines: ['さあ膝をつけ。二度は言わぬ', '余は許す。頭を地に伏せよ'] },
      { name: '王の記憶', kind: 'none', power: 0, every: 7,
        selfAtkUp: { rate: 0.30, turns: 4 }, rageUp: 2, selfHeal: 0.04,
        lines: ['あの日の民の声を、まだ覚えている', '臣の名を、忘れるものか'] },
    ],
    ult: { name: '余の国よ、還れ', power: 2.5,
           lines: ['還れ。余の国よ、いまここへ！', 'あの日の情景よ、もう一度！'] },
  },

  {
    id: 'e7', elem: 'void', name: '崩壊の元凶', label: '白紙',
    grandEntry: true,
    story: '元凶は、最後まで自分の名は書かなかった。<br>消せなかったのは、彼を止めた者たちの名前だった。<br>——ただし、灰はまだ降っている。',
    desc: '世界の記憶を白紙に戻す「崩壊」を生み出した男。忘れるのが苦しいなら、はじめから無かったことにすればいい——崩壊は、その一行から始まった。……ただし、世界は忘れることを止めなかった。',
    hp: 30000, atk: 1900, def: 235, aoeEvery: 3, rage: 0.10,

    atkTimes: 2,

    steal: { count: 2, every: 4 },
    reward: { exp: 10000, shards: 5000 },
    color: '#9fa6b6', image: 'images/enemies/e7.jpg',

    bgm: {
      tale:         'e7_tale.mp3',
      battle:       'e7_battle.mp3',
      battle_pinch: 'e7_battle_pinch.mp3',
      result:       'e7_result.mp3',
      lose:         'e7_lose.mp3',
    },
    entryLines: ['……お前たちは、まだ、覚えているのか', '私が白紙にしよう。何も、恐れることはない'],

    half: { name: '頁を破り捨てる', lines: ['読むな。それは消すべき頁だ', 'まだ、要らない頁が残っている'],
            stealSkill: 1, selfHeal: 0.20 },
    skills: [
      { name: '白紙に戻す', kind: 'aoe', power: 1.10, every: 3,
        atkDown: { rate: 0.35, turns: 2 },
        lines: ['ここは、書かれなかったことにしよう', '空白のほうが、よほど美しい'] },
      { name: '頁を消す', kind: 'single', power: 1.60, every: 4, twice: true,
        seal: { turns: 2 },
        lines: ['お前の頁は、ここで消える', '名前も、仲間も、私が消す'] },
      { name: '読み返す', kind: 'none', power: 0, every: 5,
        selfAtkUp: { rate: 0.30, turns: 3 }, rageUp: 2, selfHeal: 0.05,
        lines: ['……よく書けている。私が消してやろう', 'お前たちの物語、最後に読んでおこう'] },
    ],
    ult: { name: '連鎖する崩壊', power: 2.60,
           lines: ['消し尽くそう、初めから無かったように', '忘れる心配もないぞ、何も無かった'] },
  },

  {
    id: 'e8', elem: 'void', name: '記憶の灰', label: '風化',
    grandEntry: true,

    ending: true,
    story: '灰の降る速さが、人の歩く速さに戻った。<br>過ぎてしまった年月は返ってこない。<br>ただ、これから忘れるまでには、ちゃんと時間がかかる。',
    desc: '世界が忘れるまでの時間を、この世界だけ何十倍にも早めていたもの。花の名も、街の名も、隣にいた人の顔も、覚えておくより先に薄れていく——世界が灰になったのは、これが降りつづけていたからである。誰の敵でもなく、憎んでもいない。ただ、速い。この相手とだけは、HPと同時に「過ぎていく年月」とも戦うことになる。',

    hp: 60000, atk: 3800, def: 500, aoeEvery: 3, rage: 0,
    reward: { exp: 20000, shards: 8000 },
    color: '#8d8a86', image: 'images/enemies/e8.jpg',

    forget: {
      cap: 300,

      perTurn: 25, accel: 0.4,

      pinchMul: 2.5,
      ownBack: 5, skillBack: 10, lostBack: 20,
      backYear: 3, backYearMax: 40,
      ultAt: [120, 240],

      note:      '記憶の時間軸が、{cap}年過ぎた時点で敗北',
      noteHow:   '固有 −{own}年／スキル −{skill}年／喪失スキル −{lost}年 で押し返せる',
      noteToast: '記憶の時間軸が {cap}年 過ぎたら敗北です。固有 −{own}年／スキル −{skill}年／喪失スキル −{lost}年 で押し返せます',
    },

    bgm: {
      tale:         'e8_tale.mp3',
      battle:       'e8_battle.mp3',
      battle_pinch: 'e8_battle_pinch.mp3',
      result:       'e8_result.mp3',
      lose:         'e8_lose.mp3',
    },
    entryLines: ['ほら、そうして忘れてしまう', 'お前たちの物語も、いずれ誰もが忘れる'],

    half: { name: '灰が深くなる',
            lines: ['その傷も、無かったことに', 'ここからは、私の速さだ'],
            selfHeal: 1, years: 15,

            maxHp: 100000,

            healParty: true, refillSkill: true, freeLost: true },
    skills: [
      { name: '風化', kind: 'aoe', power: 1.15, every: 3, years: 5,
        lines: ['ほら、うすくなっていく', 'かたちから先に、忘れてしまう'] },
      { name: '名を薄める', kind: 'single', power: 1.70, every: 4, seal: { turns: 2 },
        lines: ['その名も、じきに誰も呼ばなくなる', '呼ばれない名から、消えていく'] },
      { name: '降り積もる', kind: 'none', power: 0, every: 5, years: 12,
        lines: ['急ぐ必要はない。私は積もるだけだ', '待てばいい。人は必ず忘れる'] },
    ],
    ult: { name: '誰もが忘れる', power: 2.40, years: 20,
           lines: ['ここに何かがあったことも、忘れる', 'お前たちの物語も、こうして終わる'] },
  },

  {
    id: 'e9', wip: true, elem: 'forest', name: '（未定・9体目）', label: '（肩書き）',
    story: '（この敵を倒したあとに拠点で出る一文）',
    desc: '（説明文。2文くらい）',
    hp: 17500, atk: 2000, def: 132, aoeEvery: 2, rage: 0.11,
    reward: { exp: 10290, shards: 5660 },
    color: '#8a9c74', image: null,
    entryLines: ['（登場の台詞1）', '（登場の台詞2）'],

    half: { name: '（未定・崩れはじめ）', lines: ['（半分を切ったときの台詞1）', '（半分を切ったときの台詞2）'] },
    skills: [
      { name: '（技1）', kind: 'aoe', power: 1.23, every: 4,
        lines: ['（台詞1）', '（台詞2）'] },
      { name: '（技2）', kind: 'single', power: 1.96, every: 3,
        seal: { turns: 1 },
        lines: ['（台詞1）', '（台詞2）'] },
      { name: '（技3）', kind: 'none', power: 0, every: 5,
        selfAtkUp: { rate: 0.35, turns: 3 },
        lines: ['（台詞1）', '（台詞2）'] },
    ],
    ult: { name: '（超必殺技）', power: 2.4,
           lines: ['（台詞1）', '（台詞2）'] },
  },

  {
    id: 'e10', wip: true, elem: 'flame', name: '（未定・10体目）', label: '（果て）',
    story: '（この敵を倒したあとに拠点で出る一文）',
    desc: '（説明文。2文くらい）',
    hp: 20000, atk: 2900, def: 145, aoeEvery: 3, rage: 0.10,
    reward: { exp: 6940, shards: 3820 },
    color: '#b06a6a', image: null,
    entryLines: ['（登場の台詞1）', '（登場の台詞2）'],

    half: { name: '（未定・崩れはじめ）', lines: ['（半分を切ったときの台詞1）', '（半分を切ったときの台詞2）'] },
    skills: [
      { name: '（技1）', kind: 'aoe', power: 1.25, every: 4,
        lines: ['（台詞1）', '（台詞2）'] },
      { name: '（技2）', kind: 'single', power: 2.00, every: 3,
        seal: { turns: 1 },
        lines: ['（台詞1）', '（台詞2）'] },
      { name: '（技3）', kind: 'none', power: 0, every: 5,
        selfAtkUp: { rate: 0.35, turns: 3 },
        lines: ['（台詞1）', '（台詞2）'] },
    ],
    ult: { name: '（超必殺技）', power: 2.5,
           lines: ['（台詞1）', '（台詞2）'] },
  },

];

const ENEMIES = ENEMIES_ALL.filter((e) => !e.wip);

const ENEMY_LINES = {

  e1: {
    hurt: ['いたい', 'やめて……', 'こわい'],
    kill: ['ねむった', 'しずかに、なった', 'うごかない'],
    low:  ['きえちゃう', 'まだ、いたいよ', 'ぼく、どこ'],
    win:  ['……かえって', 'ここに、いて', 'ひとりは、やだ'],
    lose: ['はな、が', '……おかあ、さん', 'ぼくの、なまえ'],
    turn: ['……だれ', 'かえして', 'つの、おもい'],
    crit: ['あ', 'こわれる'],
    revive: ['また、うごいた', 'おきちゃった'],
  },

  e2: {
    hurt: ['……ほう', '効くな', '悪くない'],
    kill: ['ひとり、減った', '通さぬと言った', '門は遠い'],
    low:  ['まだ、門は閉じぬ', '倒れるのは、あとだ', '白よ、まだ立て'],
    win:  ['引き返せ。次は無い', '……ここまでだ', '門は、閉じたままだ'],
    lose: ['門は、開いた', '行け。白よ、追うな', '……名は、呼ぶな'],
    turn: ['退け', 'ここから先は、通さない', '白よ、伏せていろ'],
    crit: ['……深いな', '骨まで来たか'],
    revive: ['立つのか', 'まだ、来るか'],
  },

  e3: {
    hurt: ['よい痛みです', 'まだ、目が覚めていますね', '祈りが乱れます'],
    kill: ['ひとり、安らぎました', 'おやすみなさい', 'これで、楽になれます'],
    low:  ['祈りが、細くなる', '……まだ、終われません', '灯が、ひとつ消えました'],
    win:  ['よく眠りなさい', 'これで、静かになりました', '祈りは、届きました'],
    lose: ['ああ、思い出してしまった', '祈りは、あなたに移ります', '……顔が、ほしかった'],
    turn: ['祈りましょう', '思い出すには、遅すぎた', 'もう休んでよいのです'],
    crit: ['……声が出ました', '痛みも、祈りのうちです'],
    revive: ['眠らせたはずです', 'なぜ、戻るのですか'],
  },

  e4: {
    hurt: ['痛いな。久しぶりだ', '色が、こちらまで来る', '君は、乱暴だね'],
    kill: ['ひとつ、白に戻った', '眠ったね。よかった', '塗り終わった'],
    low:  ['白が、剥がれていく', 'まだ、塗り終わっていない', '目を、開けたくない'],
    win:  ['ほら、静かだろう', '思い出さないほうが幸せだ', 'これで、白のままだ'],
    lose: ['……君の色は、消せなかった', '覚えていて。私のぶんまで', '目を、開けてもいいのかな'],
    turn: ['また、色が増えたね', 'それは持ち出してはいけない', '眠りなさい。私が覚えている'],
    crit: ['……ああ、鮮やかだ', '白が、割れた'],
    revive: ['塗ったところだよ', 'また色をつけたのかい'],
  },

  e5: {
    hurt: ['いい一撃だ', '骨に、響いた', 'もっと来い'],
    kill: ['ひとり倒れた。次だ', '弔いは、あとでする', '果てまで持たなかったな'],
    low:  ['まだ立てる', '骸は、まだ眠らん', '膝はつかん'],
    win:  ['ここが果てだ。言ったろう', '……よく戦った', '骸に、名を刻んでおく'],
    lose: ['……先へ、行け', '骸は、ここに置いていく', 'ようやく、眠れる'],
    turn: ['引き返せ', '骸は、まだ眠らない', 'ここが、世界の果てだ'],
    crit: ['……効いたぞ', '骨が鳴った'],
    revive: ['まだ立つか', 'しぶといな。好きだぞ'],
  },

  e6: {
    hurt: ['よい。覚えておく', '痛みも、余の記憶だ', '手加減は要らぬ'],
    kill: ['名を、聞いておこう', 'ひとり、余が覚えた', '臣がひとり増えた'],
    low:  ['冠は、まだ落ちぬ', '余が忘れねば、国は在る', '……重い。だが下ろさぬ'],
    win:  ['臣が増えた。悪くない', '覚えていてやる。褒美だ', '国は、まだ在る'],
    lose: ['国の名を、言うておこう', '……覚えたか。ならば、よい', '冠を、置く'],
    turn: ['余は、忘れておらぬ', '名を名乗れ。覚えておいてやる', '朝市の声を、まだ覚えている'],
    crit: ['……見事', '冠が鳴ったぞ'],
    revive: ['ほう、戻ったか', '死んでも忘れぬ、か'],
  },

  e7: {
    hurt: ['……書き損じた', 'その頁は、消したはずだ', 'インクが滲む'],
    kill: ['一行、消えた', '楽になったろう', 'これで、白紙に近づいた'],
    low:  ['まだ、書き終えていない', '白紙が、汚れていく', '手が、震える'],
    win:  ['これでいい。何も無い', '覚えている者が、いなくなった', '静かだ。ようやく'],
    lose: ['……名を、書き忘れた', '灰は、止められまい', '書き直せると、思っていた'],
    turn: ['……まだ、覚えているのか', '書き直そう。今度こそ、白紙から', 'その頁は、閉じたはずだ'],
    crit: ['……そこは、消せない', '深く書かれている'],
    revive: ['消したはずの行だ', 'まだ、残っていたのか'],
  },

  e8: {
    hurt: ['それも忘れられる', '痛みは、残らない', 'いずれ、消える'],
    kill: ['ひとつ、忘れられた', 'もう誰も呼ばない', 'これで、軽くなった'],
    low:  ['私は消えはしない', '灰はまだ降っている', '忘れる者がいる限り'],
    win:  ['何も無かった', 'ほら、忘れた'],
    lose: ['……人の、速さに', 'では、ゆっくりと'],
    turn: ['ほら、忘れてしまう', 'お前たちの物語もだ', 'お前たちには、速すぎる', '覚えていられるのか'],
    crit: ['よく覚えているな', 'その手つきも忘れる'],
    revive: ['まだ名前があるのか', '呼び戻したところで'],
  },
};

const STOLEN_SKILLS = {
  baldo:  { name: '酒断連撃', kind: 'single', power: 1.30, selfHeal: 0.04,
            lines: ['捨てられた酒だ。まだ濡れている', 'この男の頁は、酒でにじんでいた'] },
  alvis:  { name: '強撃の盾', kind: 'single', power: 1.55, atkDown: { rate: 0.30, turns: 2 },
            lines: ['守るのをやめた鉄は、よく効く', '盾は置かれていた。だから拾った'] },
  rita:   { name: '粉砕爆拳', kind: 'single', power: 1.45, twice: true,
            lines: ['砕けることを恐れぬ拳だ', 'この娘は、痛みを書き残さなかった'] },
  gold:   { name: '炉心開放', kind: 'single', power: 2.10,
            lines: ['鉄の男の最後の熱だ。まだ温かい', '命令を待たぬ火だ。ならば、わたしが焚こう'] },
  shion:  { name: '心身統一', kind: 'none', power: 0, rageUp: 3, selfAtkUp: { rate: 0.25, turns: 3 },
            lines: ['先を見るのをやめた足だ', 'この子の駆けた道は、まだ消えていない'] },
  hazuki: { name: '蓮華斬刹', kind: 'single', power: 1.50, selfHeal: 0.05,
            lines: ['捨てられた花だ。栞にした', '挿さぬと決めた手の、速さだけ借りる'] },
  reia:   { name: '近接連弾', kind: 'none', power: 0, selfAtkUp: { rate: 0.40, turns: 3 },
            lines: ['置いていったものは、拾ってよいのだろう', '逃げ道をふさいだ者の、撃ち方だ'] },
  erna:   { name: '炎天の理', kind: 'aoe', power: 1.05, atkDown: { rate: 0.40, turns: 3 },
            lines: ['読むのをやめた灰だ。撒こう', 'この魔女は、終わりを読むのをやめた'] },
  owen:   { name: '書の魔獣', kind: 'none', power: 0, selfAtkUp: { rate: 0.30, turns: 3 }, rageUp: 2,
            lines: ['破った頁だ。拾うのは、わたしの仕事だ', '書き手を失った文字は、わたしのものだ'] },
  muse:   { name: '在庫一掃', kind: 'none', power: 0, selfHeal: 0.09,
            lines: ['自分の分を残さなかった薬だ', '最後の一本まで空けた手つきを、覚えている'] },
  raizu:  { name: '大勝負', kind: 'single', power: 1.35, seal: { turns: 2 },
            lines: ['卓に置かれたままだった。もらっていく', '降り方を知らぬ者の、張り方だ'] },
  kain:   { name: '掃討の矢', kind: 'single', power: 0.95, twice: true,
            lines: ['拾わぬというなら、わたしが拾う', '置いていかれた矢だ。まだ飛ぶ'] },
};

const BALANCE = {

  damageVariance: 0.10,
  minDamage: 1,

  aoeRate: 0.70,

  expBase: 30,
  expStep: 14,

  expRate: 1,
  shardRate: 1,

  loseRate: 0.25,
};

const POEM_A = [
  '明日は', '命が', '歌声が', '枝先が', '遠雷が',
  '面影が', '影が', '記憶が', '草原が', '傷あとが',
  '雲間が', '光が', '湖面が', '木漏れ日が', '心が',
  '木霊が', 'ささやきが', '潮風が', '静けさが', '素足が',
  '星屑が', '空は', '誰かが', '小さな手が', '月あかりが',
  '手のひらが', '遠い日が', '灯りが', '涙が', '名前が',
  '波音が', '匂いが', '願いが', 'まどろみが', '残り火が',
  '花びらが', '道標が', '火の粉が', 'ひび割れが', '船跡が',
  '冬の日が', '帆が', '微笑みが', '瞼が', '幻が',
  '水面が', '道が', '港が', '昔の声が', '芽吹きが',
  '巡りが', '物語が', '約束が', '夕暮れが', '雪が',
  '指先が', '夜明けが', '世界が', '呼び声が', '故郷が',
  '螺旋が', '落葉が', 'わたしが', '忘れられた歌が',
];

const POEM_B = [
  '明け方に', 'いつまでも', 'うつむいて', 'うれしくて', '追いかけて',
  'おそるおそる', '音もなく', 'かすかに', '風のように', '形を変えて',
  'きらめいて', '繰り返し', '暮れゆく空に', 'ここではないどこかで', 'こらえきれずに',
  '逆さまに', 'ささやくように', '寂しくて', '静かに', '忍びやかに',
  '少しずつ', 'すべてを抱いて', 'そっと', '空のむこうで', '確かめるように',
  '立ちどまって', '誰にも知られず', '遠くで', '途切れ途切れに', '灯をかかげて',
  '懐かしく', '名もなく', '何度でも', '賑やかに', '眠るように',
  '覗きこんで', '果てしなく', '初めてのように', '遥かに', '光をあつめて',
  '一息に', 'ひそやかに', 'ふいに', '振り向かずに', 'まっすぐに',
  '眩しくて', '幻のように', '満ち足りて', '見渡すかぎり', '無造作に',
  '巡り巡って', 'もう一度', '優しく', 'やがて', '柔らかに',
  'ゆっくりと', 'ゆらめいて', '夜ふけに', '世界のはしで', 'わけもなく',
  '忘れたころに', 'わずかに', '笑いながら', '割れた鏡に',
];

const POEM_C = [
  '溢れた', '息をのむ', '歌う', '生まれる', '選ぶ',
  '教えてくれる', 'おめでとう', '輝く', '帰ってくる', '数えている',
  '消えた', '聞こえる', 'きらめく', '崩れてゆく', '応える',
  '言葉になる', '咲いた', 'ささやく', '覚めてゆく', '沈む',
  '知っている', '過ぎてゆく', '進む', 'ずっとここにいる', '染まる',
  '空へのぼる', 'たしかにあった', '訪ねる', '立ち上がる', '小さくうなずく',
  '散っていく', '続いてゆく', '遠ざかる', '届く', '灯る',
  '泣いていた', '名を呼ぶ', 'にじむ', '眠る', '残された',
  '始まる', '走り出す', '光る', '開く', '震える',
  'ほどける', '微笑む', '待っている', '回り続ける', '見つけた',
  '満ちる', '迎えに来た', '目覚める', '戻ってくる', '安らいでいる',
  '闇に溶ける', '許される', '蘇る', '忘れない', '笑っている',
  '溶けていった', '息づいている', '手を振った', '巡りあう',
];

const POEM_OLD = [
  { 1: 'いのちが', 2: 'うたごえが', 15: 'こだまが', 34: 'のこり火が', 36: 'しるべが', 42: 'ほほえみが', 43: 'まぶたが', 44: 'まぼろしが', 48: 'むかしの声が', 49: '芽ぶきが', 50: 'めぐりが', 59: 'ふるさとが' },
  { 9: 'かたちを変えて', 11: 'くりかえし', 15: 'さかさまに', 17: 'さみしくて', 20: 'すこしずつ', 24: 'たしかめるように', 28: 'とぎれとぎれに', 30: 'なつかしく', 33: 'にぎやかに', 35: 'のぞきこんで', 37: 'はじめてのように', 38: 'はるかに', 43: 'ふりむかずに', 45: 'まぶしくて', 46: 'まぼろしのように', 47: 'みちたりて', 48: '見わたすかぎり', 49: 'むぞうさに', 50: 'めぐりめぐって', 51: 'もういちど', 52: 'やさしく', 54: 'やわらかに' },
  { 0: 'あふれた', 2: 'うたう', 3: 'うまれる', 4: 'えらぶ', 5: 'おしえてくれる', 7: 'かがやく', 8: 'かえってくる', 11: 'きこえる', 13: 'くずれてゆく', 14: 'こたえる', 15: 'ことばになる', 18: 'さめてゆく', 19: 'しずむ', 22: 'すすむ', 27: 'たずねる', 28: '立ちあがる', 29: 'ちいさくうなずく', 31: 'つづいてゆく', 33: 'とどく', 34: 'ともる', 38: 'ねむる', 39: 'のこされた', 40: 'はじまる', 41: '走りだす', 43: 'ひらく', 44: 'ふるえる', 46: 'ほほえむ', 47: 'まっている', 48: 'まわりつづける', 50: 'みちる', 51: 'むかえにきた', 52: 'めざめる', 53: 'もどってくる', 54: 'やすらいでいる', 55: 'やみに溶ける', 56: 'ゆるされる', 57: 'よみがえる', 58: 'わすれない', 59: 'わらっている', 60: 'とけていった', 62: '手をふった', 63: 'めぐりあう' },
];

const TALE_ENEMY = {
  e1: {
    chapter: '第一景', place: '灰の細道',
    lead: [
      '灰をかき分けて進むと、道の先に立ち尽くす影があった。',
      '枯れ枝の角。その足元に、名を忘れられた花がひとつだけ咲いている。',
    ],
    ask: '——かえして。かえして。何を返せばいいのかは、影自身も、もう覚えていない。',
  },
  e2: {
    chapter: '第二景', place: '忘れられた森の門',
    lead: [
      '門は苔に覆われ、蝶番はとうに錆びていた。それでも、閉じている。',
      '白い獣が身を起こす。その背に手を置いた者が、静かにこちらを見た。',
    ],
    ask: '——その名を、呼ぶな。呼ばれた名は、思い出されてしまうから。',
  },
  e3: {
    chapter: '第三景', place: '祈りの残る堂',
    lead: [
      '崩れた天井から灰が降り、それが香のように堂の中を漂っていた。',
      '顔のない者が、こちらを向く。向いた、と分かってしまうのが不思議だった。',
    ],
    ask: '——よく来た。もう休んでよい。その声は、疲れた者の耳ほど深く届く。',
  },
  e4: {
    chapter: '第四景', place: '塗り潰された高台',
    lead: [
      '高台からは、取り戻したはずの景色が見えるはずだった。',
      '見えたのは白だけだった。丁寧に、ひとつずつ塗り重ねられた白。',
    ],
    ask: '——また、色が増えたね。目を閉じたまま、その人は嬉しそうに笑った。',
  },
  e5: {
    chapter: '第五景', place: '世界の果ての骨野',
    lead: [
      '地平線のかたちが、生きものの背骨に似ていると気づいてしまった。',
      'それは本当に背骨だった。その根元に、ひとりの兵が立っている。',
    ],
    ask: '——ここが最後だ。引き返せ。それは脅しではなく、忠告に聞こえた。',
  },

  e6: {
    chapter: '第六景', place: '草に還った王城',
    lead: [
      '草が高い。膝を越え、腰を越え、やがて柱のかたちをした草の列になった。',
      'その奥に、玉座がひとつ残っている。座っているものは、まだ王冠を下ろしていない。',
    ],
    ask: '——余は、忘れておらぬ。それは誇りではなく、降ろせない荷物の話に聞こえた。',
  },
  e7: {
    chapter: '第七景', place: '窓だけが残った書斎',
    lead: [
      '壁も床も天井もない。ただ白い窓枠がひとつ、空の真ん中に立っている。',
      'その手前に、机だったはずの高さで男が座っていた。膝の上に、白紙の束を抱えている。',
    ],
    ask: '——覚えているのが、そんなに大事か。男は眼鏡に指をかけ、こちらを一度だけ見た。',
  },
  e8: {
    chapter: '第八景', place: '灰の底',
    lead: [
      '道はもうない。膝まで、腰まで、灰が積もっている。踏むたびに、足の下で何かが崩れる音がした。',
      'その中心に、立っているものは無い。ただ灰が、ひとところだけ人のかたちに盛り上がっていた。',
      'ここでは、灰といっしょに時間も降っている。ひと呼吸のあいだに何年も過ぎ、過ぎたぶんだけ何かが薄くなる。——世界じゅうで起きていたことが、この底では剥き出しになっているだけだった。三百年ぶん降り積もれば、ここで戦ったことも、誰も知らないことになる。',
      'それでも、押し返す手はある。その人にしかできない手つき、景色から借りた技、そして大事なものを手放す一撃。——覚えていると体で示しているあいだだけ、年月は少しだけ戻る。',
    ],
    ask: '——ほら、そうして忘れてしまう。その声はどこからでもなく、自分で思いついたことのように聞こえた。',
  },
  e9:  { chapter: '第九景', place: '（場所）', lead: ['（情景1）', '（情景2）'], ask: '（敵が投げかける一文）' },
  e10: { chapter: '第十景', place: '（場所）', lead: ['（情景1）', '（情景2）'], ask: '（敵が投げかける一文）' },
};

const CHAR_TALE = {
  baldo: {
    e1: { act: '酒の栓を抜き、ひとくち含んでから足元の花を見た。', line: '名前を忘れるってのは、ああなることか。……覚えててやるよ、そっちの分も' },
    e2: { act: '門の錆に指を這わせ、懐かしむように鼻を鳴らした。', line: '昔はこの近くに朝市が立ってた。番人さんよ、あんたも並んでたクチだろ' },
    e3: { act: '祈りの声を聞いて、めずらしく酒を仕舞った。', line: '休めってのは優しい言葉だ。だからタチが悪い。俺はまだ飲み足りん' },
    e4: { act: '白く塗られた地平を見て、義手の指をゆっくり握った。', line: '色を消すのが導きかい。俺の知ってる導き手は、もっと不器用だったがな' },
    e5: { act: '兵の立ち姿を見て、笑うのをやめた。', line: '……知ってる立ち方だ。おい、そこをどけ。残るのは俺で足りる' },
    e6: { act: '玉座の前で立ち止まり、酒の栓を抜かずに握っていた。', line: 'あんた、六十年も一人で覚えててくれたのか。……悪いな。俺は、飲んで忘れた口だ' },
    e7: { act: '白紙の束を見て、酒の栓を抜くのをやめた。', line: '書いて消したのか。……酒で忘れるほうが、まだ正直だぜ' },
    e8: { act: '灰を手ですくって、風にもどした。',
          line: '多くの記憶が、この中にあるのか。……悪いが、俺はまだ手放せねえ' },
  },
  alvis: {
    e1: { act: '盾を前に出し、仲間の視線をふさぐように半歩前へ出た。', line: 'あれはもう、戦うものじゃない。……それでも、こちらへは通せない' },
    e2: { act: '門の前で立ち止まり、剣を抜かずに一礼した。', line: '守る側の気持ちは分かる。分かるから、こちらも退けない' },
    e3: { act: '祈りの声から仲間を庇うように、面頬を伏せた。', line: 'その言葉は聞かない。聞けば、立っていられなくなる' },
    e4: { act: '白い高台を見上げ、盾の縁を握りなおした。', line: 'あなたが守っているのは世界か。それとも、目を閉じた理由のほうか' },
    e5: { act: '巨骸の影に踏み込み、仲間の前に立った。', line: '最後まで立っているつもりか。……交代の時間だ' },
    e6: { act: '王の前で、はじめて盾を斜めに下げた。', line: '守るべき国が無くなっても、命令だけが残る。……その苦しさは、こちらも知っている' },
    e7: { act: '窓枠の下で足を止め、盾を正面に構え直した。', line: '守るものを、自分で消したのか。……それは任を捨てたと言うんだ' },
    e8: { act: '膝まで灰に沈んだまま、動かなかった。',
          line: 'この灰の中に、守れなかった者がいる。私たちはまだ、その名を呼べる' },
  },
  rita: {
    e1: { act: '拳を鳴らしかけて、途中でやめた。', line: '……壊しても、返ってくるものがない。ちょっと、やりにくいな' },
    e2: { act: '白い獣と目を合わせ、にやりと笑った。', line: 'あんたじゃなくて、その子が本気なんだね。いいよ、受けて立つ' },
    e3: { act: '祈りの言葉に、耳をふさがず正面から向き合った。', line: '祈り？そんなもの殴られたら終わりでしょ？' },
    e4: { act: '塗り潰された景色に手をかざした。', line: '白ってさ。なんにも壊してないみたいな顔してるのが、一番むかつく' },
    e5: { act: '骨の地平を見渡し、深く息を吸った。', line: '骨は硬い。硬いぶん、折れる場所もはっきりしてる' },
    e6: { act: '王冠を見上げて、拳を握るのをやめた。', line: 'そんな重いもん被って、よく立ってられるね。……降ろせば楽になるって、誰も言わなかったんだ' },
    e7: { act: '白紙を一枚つかんで、握りつぶしてから放した。', line: '真っ白じゃん。こんなの、あたしの名前だって書けるよ' },
    e8: { act: '灰を蹴り上げて、すぐに顔をしかめた。',
          line: '殴れないんだけど、これ。……でも、殴らないと終わらないんでしょ' },
  },
  gold: {
    e1: { act: '足を止め、亡骸の足元をしばらく見ていた。', line: '……対象、識別不能。分類、（元・人）。……処理を、保留する' },
    e2: { act: '門扉の構造をなぞるように腕を伸ばした。', line: 'この門は、守るために造られていない。……閉じ込めるためだ' },
    e3: { act: '祈りの声を受けて、胸部の光が明滅した。', line: '休止命令を、受信。……発信元、不明。よって、棄却する' },
    e4: { act: '白冠の姿を認識し、動作が一拍だけ遅れた。', line: '……登録済。優先度、最上位。……命令を、待っている' },
    e5: { act: '巨骸に向かって、まっすぐ歩き出した。', line: '……あれも、命令を待ち続けたのか' },
    e6: { act: '玉座の前まで進み、直立したまま停止した。', line: '命令主を、確認。……いや、違う。あなたは、待っているほうだ' },
    e7: { act: '男の前で停止し、眼の光をひとつ落とした。', line: '命令の出どころを、確認。……ここが、始まりの座標だ' },
    e8: { act: '灰の深さを、腕を差し込んで測った。',
          line: '記録、消失。……だが、消失したという記録は、残っている' },
  },
  shion: {
    e1: { act: '先に走って戻ってきて、息を整えながら言った。', line: '花、まだ咲いてた。足元だけ、灰が積もってないんだ' },
    e2: { act: '木の上から降りてきて、埃を払った。', line: '門の向こう、見てきた。……森だよ。ちゃんと、緑のままの森' },
    e3: { act: '堂の外を一周してから、めずらしく声を落とした。', line: '逃げ道、探したんだけど。……ここ、外に出る道がひとつもない' },
    e4: { act: '高台のふちに立ち、地平線を指さした。', line: '白いのは手前だけ。奥はまだ色がある。あたし、ちゃんと見たよ' },
    e5: { act: '骨の稜線を目でたどり、はじめて言葉に詰まった。', line: '……この先は、まだ誰も見てない。だからあたしが、先に見てくる' },
    e6: { act: '草の柱のあいだを駆け抜けて、玉座の手前で急に止まった。', line: 'ここ、まだ道になってる。……誰かがずっと、草を踏んで歩いてたんだ' },
    e7: { act: '窓枠をくぐって、すぐに戻ってきた。', line: 'ここ、道が一本もないんだ。……ぜんぶ消しちゃったんだね' },
    e8: { act: '灰の上を走ろうとして、足が沈んで止まった。',
          line: 'ここ、道がないんじゃない。……道が、忘れられたんだ' },
  },
  hazuki: {
    e1: { act: '足元の花を一輪だけ摘み、髪に挿した。', line: 'これで、あなたの咲いた場所を覚えていられます' },
    e2: { act: '白い獣に向かって、静かに鯉口を切った。', line: '名を呼ばれたくないのなら、呼ばずに終わらせます' },
    e3: { act: '祈りの合間に、そっと目を伏せた。', line: '眠りなさい、と言われて眠れる人は、たぶん幸せです' },
    e4: { act: '白い景色の中で、髪の花だけが色を持っていた。', line: 'これも塗り潰しますか。……それは阻止します' },
    e5: { act: '骨の野に足を踏み入れ、柄に手を添えた。', line: '花の咲かない土は、はじめてです。……散り際すら、ないなんて' },
    e6: { act: '草に埋もれた石段を見つけ、そこで一礼した。', line: '花が一輪も咲いていません。……手入れをする人が、まだいるからですね' },
    e7: { act: '足元の白紙をそろえて、机だった高さに置いた。', line: '花の名前も、消してしまわれたのですか。……それは、さみしい' },
    e8: { act: '灰の中から、花の茎だけを一本抜き出した。',
          line: '花は残りませんでした。挿していた、ということだけ覚えています' },
  },
  reia: {
    e1: { act: '帽子のつばを上げ、目を細めた。', line: 'あーあ。あんなふうになるくらいなら、あたしは走って逃げるけどね' },
    e2: { act: '銃把を指で叩きながら、門を見上げた。', line: '通行料はいくら？　……ああ、お金じゃ足りないタイプか' },
    e3: { act: 'めずらしく銃を下ろしたまま、司祭を見ていた。', line: '眠くなるような声。……こういうのが一番、撃ちにくいんだけど' },
    e4: { act: '白い地平に向けて、一度だけ空撃ちの構えをとった。', line: '次の町、あっちにあるはずなんだ。塗り潰されてたら、承知しないよ' },
    e5: { act: '弾倉を確かめ、帽子を目深にかぶりなおした。', line: '嫌な感じね、……逃げ道を確保しておこうかな' },
    e6: { act: '帽子を取って、めずらしく最後までかぶらなかった。', line: '流れ者のあたしには、覚えておく国がないんだ。……ちょっと、うらやましいかも' },
    e7: { act: '帽子を目深にかぶり直して、男を正面から見た。', line: '身軽が一番だけどさ。……何も持たないのは、身軽とは言わないよ' },
    e8: { act: '帽子を押さえて、来たほうを振り返った。',
          line: '逃げ道、灰で埋まってる。……はじめてよ、こんなの' },
  },
  erna: {
    e1: { act: '足元の灰をひとつまみ、指先ですりつぶした。', line: '多くの人がいたのね。……みんな、忘れてしまったのよ' },
    e2: { act: '門柱に積もった灰を、レンズ越しに覗きこんだ。', line: 'この門ね、内側から閉められてる。守ってるんじゃないの。閉じこもってるの' },
    e3: { act: '祈りの声に、レンズをはずして耳を澄ませた。', line: '祈りって、灰が一番よく残るのよ。……この人、何百年ぶん祈ってるの' },
    e4: { act: '白く塗られた壁を指でなぞり、その粉を嗅いだ。', line: 'ただの塗料じゃないわ。これ、あなた灰を混ぜたのね' },
    e5: { act: '骨の上の灰を読んで、しばらく黙っていた。', line: '……この骸、ぜんぶ別々の人。そしてぜんぶ、あの人が看取ってる' },
    e6: { act: '灰を探して草をかき分け、見つからずに顔を上げた。', line: '灰が少ないわ。……焼けなかったんじゃない、忘れられなかったのよ' },
    e7: { act: '灰を探して指を伸ばし、白紙しか掴めずに手を下ろした。', line: '灰すら残ってない。……燃やしたんじゃない。無かったことにしたのね' },
    e8: { act: '灰をひとつまみ取って、はじめて指を離せなかった。',
          line: 'これだけ多くの灰。……ここにいる私達以外、誰か残っているのかしら' },
  },
  owen: {
    e1: { act: '手帳を開き、亡骸の姿を書き留めはじめた。', line: '名前が要る。無名のままでは、この頁は閉じられない' },
    e2: { act: '門の彫刻を指でなぞり、小さくうなずいた。', line: 'この紋章は、どこで見たか。ここはただの門ではないな' },
    e3: { act: '祈祷文を聞きながら、頁をめくる手を止めた。', line: 'その祈りには続きがある。あなたは、途中で読むのをやめている' },
    e4: { act: '白い高台で、持っていた本をそっと閉じた。', line: '塗り潰せば、間違いは消える。……だが、物語も消える' },
    e5: { act: '骨の地平を前に、ゆっくりと頁を開いた。', line: '結びの章が近いか。……案ずるな。結びのあとにも、余白はある' },
    e6: { act: '草の柱に手を触れ、その並びを数えはじめた。', line: '柱が十二本。……あなたの国は、確かにあった' },
    e7: { act: '頁をめくる手を止めて、そっと本を閉じた。', line: '同じことをしていたな、私とあなたは。……違うのは、消したかどうかだ' },
    e8: { act: '本を開いて、ため息とともに閉じた。',
          line: '頁が白くなっていく。……いま、この手の中ですら、忘れられていくのか' },
  },
  muse: {
    e1: { act: '亡骸のほうへ一歩踏み出し、仲間に止められた。', line: '……治せるかも、って思っちゃった。ごめん、いまのは薬師の悪い癖' },
    e2: { act: '白い獣の呼吸を、遠くから聞いていた。', line: 'あの子、痛みを我慢してる。番人さん、気づいてる？' },
    e3: { act: '瓶を握りしめ、司祭の声から耳をそらさなかった。', line: '眠らせるのは得意よ。でもね、起こすほうがずっと難しいの' },
    e4: { act: '白い世界の中で、腰の瓶の色だけが鮮やかだった。', line: '色を返して。……その人たち、まだ痛がってるでしょう' },
    e5: { act: '骸の兵を見て、静かに瓶の栓を抜いた。', line: 'あなたにも効くわ。……ずっと、休んでないでしょう' },
    e6: { act: '王の指先が震えているのを見て、瓶を握りしめた。', line: 'ずっと起きているでしょう。……六十年も。それは、もう病気よ' },
    e7: { act: '男の手の震えを見て、薬の瓶を握りしめた。', line: 'その手、ずっと書いていた手ね。……治らないわよ、それは' },
    e8: { act: '瓶の中身を一滴だけ、灰に落とした。',
          line: '効かないわ。傷じゃないもの。……これは、時間そのものね' },
  },
  raizu: {
    e1: { act: '指輪を一つ外して、足元の花のそばに置いた。', line: '手ぶらで場を立つのは趣味じゃないの。……これ、あなたの取り分よ' },
    e2: { act: '門の錠前を覗きこみ、指先で軽く弾いた。', line: '掛け金の重さでだいたい分かる。番人さん、あなた相当な額を守ってるわね' },
    e3: { act: '祈りの声に、わざとらしく肩をすくめた。', line: '休めば楽になる？ 楽になったら、賭ける理由がなくなるじゃない' },
    e4: { act: '白い地平にレンズをかざし、色の残りを探した。', line: 'イカサマは嫌いよ。……盤ごと白く塗るなんて、いちばん質が悪い' },
    e5: { act: '骸の兵を見て、はじめて指輪を全部外して仕舞った。', line: 'ここは配当が読めない。……いいわ。読めない卓も、悪くない' },
    e6: { act: '指輪を一つ外して、玉座の脚もとに置いた。', line: '掛け金は場に置くのが礼儀でしょ。……あなたの卓、まだ降りてないんだから' },
    e7: { act: '指輪を外して、白紙の上にコトリと置いた。', line: '全部賭けて白紙？　それ、いちばん高くつく賭けでしょ' },
    e8: { act: '指輪をはずして、灰の上に置いてみた。',
          line: '沈まない。……へえ。まだ誰かが覚えてる、ってことね' },
  },
  kain: {
    e1: { act: '弓を構える前に、足元の花を踏まない位置へ半歩ずれた。', line: '角は枯れ枝だ。……射れば、たぶん一本で足ります' },
    e2: { act: '門の高さを目で測り、矢の本数を数え直した。', line: '獣は速い。三本、要りますね。……使ったぶんは、あとで拾います' },
    e3: { act: '祈りの声を聞きながら、弦の張りを確かめていた。', line: '眠っていいと言われて、眠れる人はもう眠っています' },
    e4: { act: '白い高台を見上げ、風の向きに指を立てた。', line: '塗り潰された景色には、風の道も残っていない。……射ちにくい相手だ' },
    e5: { act: '巨骸の骨の継ぎ目を、じっと見ていた。', line: '骨と骨のあいだ。あそこなら、一本で通ります。……たぶん、一本では済まないけど' },
    e6: { act: '弦を張りかけて、途中で手を止めた。', line: '……射てば終わります。終わらせていいのか、いま考えています' },
    e7: { act: '矢をつがえずに、弦だけを指で鳴らした。', line: '……的が、無い。あなた自身も、消したんですね' },
    e8: { act: '矢を一本、灰に立てた。',
          line: '目印です。ここまでは僕らが来た、と分かるように' },
  },
};

const PAIR_TALE = {
  'baldo|alvis':  ['面頬、まだ上げねえのか。酒がまずくなる', '上げたら、退きたくなるかもしれない'],
  'baldo|rita':   ['拳一本ってのは効率が悪いぞ', '効率で殴ると、余計なものまで壊れるんだよ'],
  'baldo|gold':   ['おい鉄。お前の命令主は、もう死んでるぞ', '……了解。では、次の命令を、待つ'],
  'baldo|shion':  ['悪い報せから言え。酒の量が変わる', 'じゃあ……最後まで、いい報せはないかも'],
  'baldo|hazuki': ['その花、戦の前に挿すもんじゃねえだろ', '挿さないと、刀を納める場所を忘れてしまうので'],
  'baldo|reia':   ['若いの。逃げ足だけは達者だな', '逃げ足がないと、次の町に行けないでしょ'],
  'baldo|erna':   ['灰なんぞ読んで、面白いか', 'あなたの分も読んであげましょうか。……ずいぶん重たいわね'],
  'baldo|owen':   ['その本に、俺の名前は載ってるか', '載っている。三度、死んだことになっているがな'],
  'baldo|muse':   ['その瓶、中身はなんだ。俺のと交換するか', 'やめておいて。あなたのは、たぶん効きすぎる'],
  'alvis|rita':   ['前に出るな。こちらが受ける', '受けてるうちは、いつまでも終わらないんだよ'],
  'alvis|gold':   ['お前も、誰かを守るために造られたのか', '……記録、消失。だが、前に出る動作だけ、残っている'],
  'alvis|shion':  ['先に行くな。見えない場所は守れない', 'じゃあ、見える場所までちゃんと戻ってくるよ'],
  'alvis|hazuki': ['一撃で決めると聞いた。無理はするな', '無理をしないための、一撃です'],
  'alvis|reia':   ['後ろから撃つのは構わない。合図だけくれ', '合図はあたしが出す。あんたは動かないで'],
  'alvis|erna':   ['この機体の灰は、どう見える', 'まだ一片も積もってないわ。……珍しいのよ、それ'],
  'alvis|owen':   ['守れなかった名を、覚えているか', '全員ぶんだ。……あなたが忘れても、こちらに残る'],
  'alvis|muse':   ['修理は、最後でいい', 'その台詞を言う人から先に診るの。経験則'],
  'rita|gold':    ['あんた、殴られたら痛い？', '……痛覚、非搭載。ただし、へこむ'],
  'rita|shion':   ['どこがガラ空きか教えて', '右。……いま言ったから、もう左になってる'],
  'rita|hazuki':  ['刀って、重くない？', '拳より軽いですよ。振り切ったあとが'],
  'rita|reia':    ['近づく前に撃たないでよ', '撃たないって。あんたが避けるとこ、見たいし'],
  'rita|erna':    ['あたしの灰は？', '熱いわ。まだ燃えてる最中の灰なんて、はじめて見た'],
  'rita|owen':    ['本読んでも強くなんないでしょ', 'なるとも。壊す場所が、正確になる'],
  'rita|muse':    ['折れたら治る？', '治すけど。次からは折る前に呼んで'],
  'gold|shion':   ['斥候。前方の情報を、要求する', 'はいはい。……ねえ、たまには「ありがとう」も入れてよ'],
  'gold|hazuki':  ['対象を、排除する', 'では、わたしは見送りを。……それくらいは、してあげたい'],
  'gold|reia':    ['射線上に、立たないでもらいたい', 'あんたがデカすぎるんだよ'],
  'gold|erna':    ['解析を、要請する', 'あなた、砂の下で三百年。……ずいぶん待たされたわね'],
  'gold|owen':    ['命令を、待っている', 'では読もう。——「行け」。ここに、そう書いてある'],
  'gold|muse':    ['損傷、軽微。処置は、不要', '不要かどうかは、わたしが決めます'],
  'shion|hazuki': ['その花、どこで摘んだの', '灰の下です。……まだ、下には土があるんですよ'],
  'shion|reia':   ['次の町、どっちだと思う？', 'あんたが見てきた方角。あたしは、それを信じる係'],
  'shion|erna':   ['あたしの灰、読める？', '軽すぎて掴めないわ。……ずっと走ってるからよ'],
  'shion|owen':   ['見てきたこと、全部書ける？', '書ける。だから、遠慮なく見てこい'],
  'shion|muse':   ['あたし、休んだほうがいい？', 'もう三日走ってるでしょう。……座って。話は聞くから'],
  'hazuki|reia':  ['引き金は、迷わないのですか', '迷うよ。でも、迷ってる間に撃つ'],
  'hazuki|erna':  ['わたしの散り際は、見えますか', '見えないわ。……見えるようになっても、教えない'],
  'hazuki|owen':  ['花の名前を、ご存じですか', '三百二十七種までな。……あなたが挿しているのは、まだ載っていない'],
  'hazuki|muse':  ['痛みは、隠すものでしょう', '隠されると、こっちが困るの。……見せて'],
  'reia|erna':    ['占いみたいなこと、するんだ', '占いじゃないわ。あったことしか読めないの。未来のほうが、よっぽど楽よ'],
  'reia|owen':    ['あたし、いつか黙って出ていくよ', 'では、行き先の頁を空けておこう'],
  'reia|muse':    ['この傷、平気だって', '平気な人は、帽子をそんなに深くかぶらないの'],
  'erna|owen':    ['灰と本、どっちが正しいと思う？', '灰だ。本には、書いた者の願いが混じる'],
  'erna|muse':    ['その瓶、中身を読んでもいい？', 'だめ。読まれたら、効かなくなる気がするから'],
  'owen|muse':    ['あなたの処方を、記録してもいいか', 'いいけど。……分量、わたしも毎回ちがうの'],

  'baldo|raizu':  ['命を賭けるのは感心しねえな', '賭けてないわよ。……賭けたのは、勝つほうの目だけ'],
  'baldo|kain':   ['矢は足りてるのか、若いの', '足ります。射ったぶんは、拾いに行きますから'],
  'alvis|raizu':  ['勝算を聞かせてもらいたい', '五分よ。……あら、いい顔。五分で足りる人は好きよ'],
  'alvis|kain':   ['射線は空けておく。合図をくれ', '合図は要りません。あなたが動かない人だと、もう知っています'],
  'rita|raizu':   ['そのじゃらじゃら、邪魔じゃない？', '重さで手癖が直るの。……あなたも一つ着けてみる？'],
  'rita|kain':    ['あたしが前で暴れるから、好きに撃ちなよ', '当てませんよ。……あなたに当てたら、矢を返してもらえない'],
  'gold|raizu':   ['勝率の、提示を要求する', '教えないわ。数えたら、張れなくなるでしょう'],
  'gold|kain':    ['射点を確保する。位置を、指定しろ', 'あなたの右肩の上を。……借りますね、台として'],
  'shion|raizu':  ['ねえ、あたしたち勝てる？', '勝てる方に張ってるの。……あたし、まだ負けてないのよ'],
  'shion|kain':   ['右にすきま！ 見えた！', '見えました。……三つ数えたら、そこに一本'],
  'hazuki|raizu': ['刀と賭け事、どちらが速いですか', '賭けよ。抜く前に終わってるもの'],
  'hazuki|kain':  ['先に一射、いただけますか', 'どうぞ。……あなたが踏み込む場所は、空けておきます'],
  'reia|raizu':   ['また指輪増えてない？', '増えたわ。……あなたの帽子と交換してもいいのよ'],
  'reia|kain':    ['あんたと撃ち合ったら、どっちが速い', 'あなたです。わたしは、外さないだけなので'],
  'erna|raizu':   ['その指輪、ずいぶん灰をかぶってるわね', '拾った場所を聞かないでくれる？ ……勝って取ったのは本当よ'],
  'erna|kain':    ['矢に火を移してあげましょうか', '遠慮します。……焦げた矢は、二度と使えないので'],
  'owen|raizu':   ['勝敗を記録しても構わないか', '勝ちだけ書いて。負けは、わたしが覚えてるから'],
  'owen|kain':    ['矢の本数を数えておく', '助かります。……わたし、射ってる最中は数を忘れるので'],
  'muse|raizu':   ['無茶な張り方は、体に障るのよ', '無茶が本業なの。……壊れたら、あなたが直してくれるでしょ'],
  'muse|kain':    ['指、また切れてるじゃない', '弦を張り替えたので。……このくらいは、自分で直せます'],
  'raizu|kain':   ['ねえ、その一本、賭けない？', '矢は賭けません。……拾えなくなるので'],
};

const TALE_CLOSE = {
  solo:      'ひとりきりで、この景色の前に立っている。',
  duo:       'ふたり。欠けた一人ぶんの隙間を、埋めきれるだろうか。',
  allWeak:   '三人ぶんの相性が、そのまま追い風になっている。無茶が、通るかもしれない。',
  allSame:   '同じ色に染まった三人。押し切れなければ、代わりがいない。',
  triElem:   '海と森と炎。ばらばらの三人が、いま同じ景色を見に来ている。',
  someWeak:  'ひとりだけ、相性がいい。その一人に、どこまで背負わせるか。',
  allResist: '相性は、悪い。それでも誰ひとり、引き返そうとは言わなかった。',
  mixed:     '三人。それぞれの理由を抱えて、同じ扉の前に立っている。',
};

const TALE_POWER = {
  under: '力は、まだ足りない。それでも扉は、押せば開く。',
  even:  '力は、ちょうど拮抗している。あとは、選び方だけだ。',
  over:  'この相手の呼吸は、もう覚えてしまった。……それでも、油断はしない。',
};

const TALE_AFTER = {
  e1: {
    chapter: '第一景 ― おわり', place: '灰の細道のあと',
    lead: [
      '角が砕けて、ただの枯れ枝に戻った。拾い集めても、もう角のかたちにはならない。',
      '',
      '灰が薄く舞い上がって、それから、ゆっくり降りた。',
      '細道の先が、はじめて見通せた。',
    ],
    ask: '——最後に聞こえたのは「ありがとう」ではなかった。言葉になるだけの記憶が、もう残っていなかった。',
  },
  e2: {
    chapter: '第二景 ― おわり', place: '開かれた森の門',
    lead: [
      '白い獣は森のほうへ帰っていった。一度も、振り返らなかった。',
      '錆びた蝶番が、古びた音を立てて回る。何十年ぶりかの音に聞こえた。',
    ],
    ask: '——通れ。名は、呼ばなくていい。番人はそれだけ言って、目を閉じた。',
  },
  e3: {
    chapter: '第三景 ― おわり', place: '祈りの絶えた堂',
    lead: [
      '祈りの声がやんだ。やんでから、あれがずっと歌だったのだと気づいた。',
      '正体のわからぬ者の輪郭が、灰になってほどけていく。',
      '組まれた手だけが、最後まで残った。',
    ],
    ask: '——そうか、休まないのだね。その声には、少しだけ、羨むような響きがあった。',
  },
  e4: {
    chapter: '第四景 ― おわり', place: '塗り直された高台',
    lead: [
      '白が剥がれて、下から街の色が出てきた。',
      '錆も、汚れも、全部そのまま残っていた。',
      '聖者は目を開けて、遠い景色を思い出すかのように、まぶしそうに顔をそむけた。',
    ],
    ask: '——こんなに、うるさかったか。世界は。それは、悪口には聞こえなかった。',
  },
  e5: {
    chapter: '第五景 ― おわり', place: '骨野を越えて',
    lead: [
      '巨骸が沈み、地平線がただの地平線に戻った。その線の向こうに、青がある。',
      '継ぐ者は骨の根元に座り込み、もう立たなかった。武器だけ、こちらへ投げてよこした。',
    ],
    ask: '——行け。おれの番は、終わりだ。その声は、はじめて兵のものではなかった。',
  },

  e6: {
    chapter: '第六景 ― おわり', place: '名を取り戻した王城',
    lead: [
      '王冠が転がって灰と共に草の中で止まった。その重さだけは、最後まで本物だった。',
      '玉座は空になり、代わりに静かな風が座った。',
    ],
    ask: '——最後に王が言ったのは、命令ではなく、忘れられた国の名だった。彼らはそれを、受け取るように聞き取った。',
  },
  e7: {
    chapter: '第七景 ― おわり', place: '名前の残った一枚',
    lead: [
      '白紙の束が、風でひとつずつ捲れていった。どの頁にも、もう何も書かれていない。',
      '',
      '一番下の一枚にだけ、震えた字が残っている。',
      '消し損ねたのではなく、消せなかったのだと分かる字だった。',
      'そこにあったのは、彼の名ではなく、彼を止めた者たちの名だった。',
      '',
      '男は消え際に、遠くの空を見ていた。今も記憶の灰が降っている。',
      '彼が白紙にすることを決めたあの頃からずっと同じ速さで降り続けている灰だった。',
    ],
    ask: '——わたしが始めたのではない。世界はもう、人が忘れるより速く忘れていた。書き写すことすら、わたしにはできなかった。……あれは、お前たちが抗っても止められないだろう。',
  },
  e8: {
    chapter: '第八景 ― おわり', place: '灰の上の足あと',
    lead: [
      '人のかたちが崩れて、ただの灰に戻った。',
      '',
      '記憶の時間軸に降り続いた灰は、降りやんだように思えた。',
      'ひと呼吸で何日も過ぎていた記憶の時間が、ひと呼吸ぶんの時間に戻っていた。',
      '',
      '世界はこれから、人が生きる時間と同じ速さで忘れていく。',
      '過ぎてしまった年月は返ってこない。忘れた名前も、消えた街も、そのままだ。',
      'それでも、いま踏んだところには足あとが残っていた。',
      '',
      '積もるより先に、誰かが覚えている——そういう速さに、戻ったということだった。',
      '',
    ],

    ask: '——いつか、彼らもこの旅を忘れる。それでも、忘れるまでは覚えている。灰の上の足あとは、たぶんそういうものだった。',
  },
  e9:  { chapter: '第九景 ― おわり', place: '（場所）', lead: ['（倒したあとの情景1）', '（情景2）'], ask: '（敵が最後に残した一文）' },
  e10: { chapter: '第十景 ― おわり', place: '（場所）', lead: ['（倒したあとの情景1）', '（情景2）'], ask: '（敵が最後に残した一文）' },
};

const CHAR_AFTER = {
  baldo: {
    e1: { act: '枯れ枝をひとつ拾い、腰の酒に結わえた。', line: '名前は聞けなかったな。まあいい、枝のほうを覚えとく' },
    e2: { act: '開いた門を通らず、番人のそばにしゃがみ込んだ。', line: '朝市の話、まだ途中だったろ。……いいさ、また今度で' },
    e3: { act: '酒の栓を抜き、堂の床に少しだけこぼした。', line: '眠っちまった連中のぶんだ。俺は、もう少し起きてるよ' },
    e4: { act: '色の戻った街並みを、目を細めて眺めた。', line: 'ひでえ街だ。錆だらけで、汚れてて。……ああ、こういうのだよ' },
    e5: { act: '投げてよこされた武器を拾い、重さを確かめてから置いた。', line: '重いな。これを何年振ってた。……よく立ってたよ、あんた' },
    e6: { act: '転がった王冠を拾い、埃を払ってから草の上に戻した。', line: '国の名、聞いたぞ。忘れねえよ。……酒が入っても、これだけは' },
    e7: { act: '最後の一枚を拾い上げ、日にかざしてから懐に入れた。', line: '名前が書いてあったぞ。……ほら、あんたも忘れられなかったんだ' },
    e8: { act: '灰の上に、酒を少しだけこぼした。',
          line: '覚えててやるよ。俺が忘れる日まではな。……それでいいだろ' },
  },
  alvis: {
    e1: { act: '盾を下ろし、砕けた枯れ枝の位置を目で測った。', line: '記録した。この座標に、名を忘れた者がひとり居た' },
    e2: { act: '門をくぐる前に、閉じた目の番人へ一礼した。', line: '守る側の任は、これで終わりだ。……交代を、受け取る' },
    e3: { act: '灰になった祈りの手が消えるまで、面頬を伏せていた。', line: '休めという命令には、従わなかった。それだけだ' },
    e4: { act: '剥がれ落ちた白の下から出た街を、しばらく見ていた。', line: '塗り潰す前の記録が残っていた。……消える前に、間に合った' },
    e5: { act: '座り込んだ継ぐ者の前で、はじめて盾を地に置いた。', line: '同じ命令で立っていたのだろう。……こちらは、まだ立つ' },
    e6: { act: '空になった玉座の前で、盾を地に置いて敬礼した。', line: '任を解く。……あなたの命令は、たしかに最後まで果たされた' },
    e7: { act: '倒れた男の前に盾を置き、はじめて自分から膝をついた。', line: '任は果たした。……次は、消さずに守る番だ' },
    e8: { act: '面頬を上げて、灰の降る空を見上げた。',
          line: '命令は無い。それでも私はここに立っていた。……記録する' },
  },
  rita: {
    e1: { act: '拳の埃を払い、足元の花を踏まないように大きく跨いだ。', line: '殴った感触が軽すぎた。中身、ほとんど残ってなかったんだ' },
    e2: { act: '門の柱に軽く拳を当てて、その硬さに感心した。', line: 'あの人、獣より先に自分が壊れる殴られ方してたよ。わざとだ' },
    e3: { act: '耳をふさいでいた手をようやく下ろした。', line: '歌ってのは殴れないから困る。……終わってくれて助かった' },
    e4: { act: '白の剥がれた壁を手のひらでこすった。', line: 'ざらざらしてる。塗る前のほうが、ちゃんと触れる' },
    e5: { act: '拳を開いて、皮の裂けた指を見てから握り直した。', line: '骨相手に素手は最悪。……でも、砕けたのはこっちじゃなかった' },
    e6: { act: '王冠を持ち上げてみて、その重さに顔をしかめた。', line: '重っ……。こんなの被って六十年？　あたしなら三日で投げてる' },
    e7: { act: '白紙の束を空へ放り投げて、降ってくるのを見上げた。', line: 'よし、ぜんぶあたしが書き直す！　字はへたっぴだけどね' },
    e8: { act: '灰まみれの拳を、服で拭いた。',
          line: 'なんにも壊してないのに、勝ったんだ。……変な感じ' },
  },
  gold: {
    e1: { act: '枯れ枝の残骸を大きな手で拾い、道の端へ寄せた。', line: '処理、完了。……いや。片づけた、と言うべきか' },
    e2: { act: '開いた門の幅と自分の肩幅を、しばらく見比べていた。', line: '通れる。……通れるように、造られていたのだな。この門は' },
    e3: { act: '祈りの手が灰になった場所に、動かず立ち続けた。', line: '命令主のいない祈り。……知っている。よく、知っている' },
    e4: { act: '色の戻った高台で、視界の走査を何度もやり直した。', line: '記録の更新。世界は、白ではない。……上書き、完了' },
    e5: { act: '巨骸の沈んだ地面に片膝をつき、そこを手で撫でた。', line: '大きい者は、倒れると道になる。……私も、いずれ' },
    e6: { act: '玉座のかたわらに立ち、しばらく動かなかった。', line: '……待つのを、やめてよいのか。あなたは、やめたのだな' },
    e7: { act: '散った頁を一枚ずつ拾い、順に重ねていった。', line: '復元、開始。……失われた記録は、まだ拾える' },
    e8: { act: '灰から腕を引き抜き、深さの数値を口にした。',
          line: '積もる速度、低下を確認。……理由は、不明でよい' },
  },
  shion: {
    e1: { act: '真っ先に駆け寄って、花の周りの灰をそっと払った。', line: '見て、根っこ生きてる！ ここ、また咲くよ。ぜったい咲く' },
    e2: { act: '門の向こうへ飛び出して、すぐ戻ってきた。', line: '森、まだ緑だった！ ほら言ったでしょ、あたし見てきたんだから' },
    e3: { act: '堂の扉を思いきり押し開けて、外の空気を吸い込んだ。', line: '道、できてる！ さっきまで無かったのに。……閉じてたのは扉じゃなかったんだ' },
    e4: { act: '高台のふちで両手を広げ、色の戻った街を指さした。', line: 'ぜんぶ見える！ 屋根も、看板も、洗濯物も！ 生きてる街の匂いがする' },
    e5: { act: '骨の稜線を越えて走り、地平線の手前で立ち止まった。', line: '……青い。ねえ、その先まだあるよ。まだ、見てない景色がある' },
    e6: { act: '草の柱のあいだを最後まで走り抜けて、振り返った。', line: 'ねえ、道がちゃんと続いてた！　……この人、毎日ここを歩いてたんだよ' },
    e7: { act: '窓枠の向こうまで走って、大きく手を振った。', line: 'ねえ、道ができてるよ！　こっち、ちゃんと続いてる！' },
    e8: { act: '灰の上に残った足あとを、しゃがんで見ていた。',
          line: 'あたしの足あと、消えてない！ ……ねえ、消えてないよ！' },
  },
  hazuki: {
    e1: { act: '刀を納めてから、髪の花を抜いて枯れ枝のそばに置いた。', line: '名前の代わりにはなりませんが。……せめて、目印に' },
    e2: { act: '門の苔に指を触れ、その柔らかさを確かめた。', line: '守り続けた場所は、苔まで柔らかいのですね。……いい門です' },
    e3: { act: '一撃で納めた刀の鍔を、まだ握ったままでいた。', line: '斬った手応えがありませんでした。……祈りは、斬れないから' },
    e4: { act: '剥がれた白を一片つまみ、風に乗せて飛ばした。', line: '塗るのも、剥がすのも、人の手ですね。……どちらも、疲れる' },
    e5: { act: '骨の上に落ちた花びらを、一枚ずつ拾い集めた。', line: '花は、こんな場所でも散ります。散る場所を選べないのは、同じ' },
    e6: { act: '倒れた王のそばに、持っていた花を一輪だけ置いた。', line: '手入れをする人がいなくなったので、わたしが。……一輪でも、咲いていたほうがいい' },
    e7: { act: '白紙を一枚だけ折って、小さな花のかたちにした。', line: '名前がなくても、咲きます。……ここから、また覚えていきましょう' },
    e8: { act: '抜いた茎を、髪に挿し直した。',
          line: '花はもうありません。それでも、挿す場所は覚えています' },
  },
  reia: {
    e1: { act: '銃を回して腰に納め、帽子のつばを上げた。', line: '撃った相手が薄すぎて、後味がよくないな。……次の町、行こ' },
    e2: { act: '弾倉を確かめてから、開いた門の先へ口笛を吹いた。', line: '門番のいない道って、こんなに広いんだ。……ちょっと、こわいくらい' },
    e3: { act: '堂の高いところを撃ち抜いた穴から差す光を見上げた。', line: '天井に穴が空いたら、ただの明るい部屋になった。それだけのことだった' },
    e4: { act: '色の戻った街の看板を、一枚ずつ読み上げていった。', line: '「宿」「酒」「鍛冶」。……ぜんぶ読める。読める町は、まだ死んでない' },
    e5: { act: '最後の一発を撃たずに残したまま、銃を下ろした。', line: '一発余った。持っとくよ。……次に会う誰かのぶんじゃなく、お守りに' },
    e6: { act: '帽子をかぶり直して、玉座に背を向けた。', line: '覚えとく国、あたしにもできたかも。……いま聞いた名前が、そうだ' },
    e7: { act: '帽子を取って、風に流れていく頁を目で追った。', line: '全部は拾えないね。……でも、拾えるぶんは持っていくよ' },
    e8: { act: '帽子を脱いで、灰を払い落とした。',
          line: '逃げなかったの、はじめてかも。……次はどうかな' },
  },
  erna: {
    e1: { act: '舞い上がった灰をひとつまみ取り、指の間で潰した。', line: '読めるものが何も残ってない。……これがいちばん、こわい死に方よ' },
    e2: { act: '門の敷居に落ちた灰を見て、めずらしく黙り込んだ。', line: '獣のぶんと、人のぶん。……重なって、どっちがどっちか分からないわ' },
    e3: { act: '灰の降る堂の中で、両手を広げて受け止めた。', line: 'ぜんぶ祈りの灰。よく燃えるの、こういうのは。……よく燃えて、よく消える' },
    e4: { act: '剥がれた白を灰の代わりに指へ乗せ、読もうとしてやめた。', line: '白は読めない。何も書いてないんだもの。……だから塗ったのね、あの人' },
    e5: { act: '骨野に積もった灰の厚さを、杖の先で測った。', line: 'ここの灰は、いちばん古い。世界が最初に焼けた場所よ、ここ' },
    e6: { act: 'はじめて積もった灰を指ですくい、しばらく見ていた。', line: 'やっと灰になった。……六十年ぶんの重さ。読むのに、少し時間がいるわ' },
    e7: { act: 'ようやく積もった灰を、ひとつまみ紙に包んだ。', line: '灰になったわ。よかった。……無かったことよりは、ずっといい' },
    e8: { act: '灰をもう一度つまんで、今度は読み切った。',
          line: '……読めた。一行だけ。「まだ、いる」って書いてある' },
  },
  owen: {
    e1: { act: '本を開き、白紙のままだった一行に何かを書き足した。', line: '名前の欄は空けておく。……いつか、思い出した者が埋められるように' },
    e2: { act: '門の銘を書き写してから、そっと本を閉じた。', line: '「開かずの門」と記録されていた。……訂正する。開いた' },
    e3: { act: '灰になった祈りの手の位置まで、歩数を数えて記した。', line: '祈った者がいたことは、残しておく。届いたかどうかは、別として' },
    e4: { act: '白の下から出てきた街の名を、震える手で書き取った。', line: '……この街の名前、私の本からも消えかけていた。間に合ったな' },
    e5: { act: '地平線の向こうに広がる青を、言葉にしようとして詰まった。', line: 'まだ、書けん。……見たものに追いつく言葉を、これから探す' },
    e6: { act: 'その場で頁を開き、聞き取った名を最初の行に書きつけた。', line: '書いた。もう一人で覚えなくていい。……これからは、こちらが覚える' },
    e7: { act: 'その場に膝をつき、まっさらな頁の一行目に何かを書いた。', line: '書き出しは決まっている。……「世界は、思い出した」だ' },
    e8: { act: '白紙になった頁に、はじめて自分で字を書いた。',
          line: '書き写すのは、やめだ。ここからは、書く' },
  },
  muse: {
    e1: { act: '倒れた枯れ枝のそばに膝をつき、脈を探すしぐさをした。', line: '習慣なの。……もういないと分かっていても、手が先に動くのよ' },
    e2: { act: '番人の閉じた目を確かめてから、瓶の栓を戻した。', line: '治せる傷じゃなかった。ずっと前から、そういう傷だった' },
    e3: { act: '堂の中で眠ったままの者たちに、順に毛布をかけていった。', line: '起こさないであげて。……歌がやんだいまなら、ただの眠りだから' },
    e4: { act: '目を細める聖者のために、日陰になる位置へ黙って立った。', line: '急に光を見ると、目が痛むの。……ゆっくりでいいのよ、慣れるまで' },
    e5: { act: '座り込んだ継ぐ者の傷に、最後の一滴を落とした。', line: '効きはしない。でも、痛みは少し引く。……それだけで、じゅうぶんでしょう' },
    e6: { act: '倒れた王のまぶたに手を当てて、静かに閉じさせた。', line: 'やっと眠れるわね。……六十年ぶりの、いちばん深いやつ' },
    e7: { act: '男のまぶたに手を当てて、静かに閉じさせた。', line: 'もう書かなくていいわ。……あとは、わたしたちが覚えておく' },
    e8: { act: '瓶の栓を閉め直して、腰に戻した。',
          line: '治せはしなかったけれど、間に合わせることはできた。……上等よ' },
  },
  raizu: {
    e1: { act: '置いていった指輪を、拾わずにそのままにした。', line: '取り返さないわ。……はじめて、賭けずに置いてきたもの' },
    e2: { act: '開いた門の錠前を外して、手の中で重さを量った。', line: 'ずっしり来る。この人、ほんとうに全額を守ってたのね' },
    e3: { act: '灰になった祈りの手を、レンズ越しに最後まで見ていた。', line: '降りたのね。……責めないわ。降り時を間違えないのは、才能よ' },
    e4: { act: '色の戻った街を見渡して、レンズを額に押し上げた。', line: '派手じゃない。汚いし、うるさい。……こういう卓のほうが、儲かるの' },
    e5: { act: '仕舞っていた指輪を、一つずつ指に戻した。', line: '配当は最悪。でも降りなかった。……それだけで、じゅうぶん勝ちよ' },
    e6: { act: '置いた指輪を拾わずに、そのまま立ち上がった。', line: '降りたわね。……いい降り方だった。あたしにも、いつかできるかしら' },
    e7: { act: '置いた指輪を拾い、指に戻してから笑った。', line: '大勝ちね。掛け金は世界まるごと。……こんな卓、二度とないわ' },
    e8: { act: '灰の上から指輪を拾って、指に戻した。',
          line: '張ったのは、忘れないほうよ。……ほら、勝った' },
  },
  kain: {
    e1: { act: '射った矢を一本ずつ抜いて、羽根の汚れを払った。', line: '三本とも無事だ。……よかった。花のほうも、折れていない' },
    e2: { act: '門柱に刺さった矢を、根本から丁寧に回して抜いた。', line: '折らずに抜けました。……この矢は、まだ十回は使えます' },
    e3: { act: '堂の床に落ちた矢をそろえて、矢筒に戻した。', line: '眠らせるための歌でした。……起きている人のほうが、少なかったんだ' },
    e4: { act: '色の戻った壁に立てかけて、弓の弦をゆるめた。', line: '風の道が戻ってきた。……ここなら、目をつぶっても射てます' },
    e5: { act: '骨の隙間に残った矢を、諦めて置いてきた。', line: '一本、置いてきました。拾えない矢もあるって、はじめて知った' },
    e6: { act: '王の胸から矢を抜かずに、そのまま手を合わせた。', line: 'この一本は、拾いません。……ここに置いていくぶんです' },
    e7: { act: '放った矢を抜かずに、白紙を一枚だけ拾った。', line: '……一枚、いただきます。ここに、名前を書くので' },
    e8: { act: '立てておいた矢を抜いて、束に戻した。',
          line: 'この一本は、拾えました。……ぜんぶ、持って帰れます' },
  },
};

const PAIR_AFTER = {
  'baldo|alvis':  ['勝ったんだ。面くらい上げろよ', '……上げたら、次に構えるのが遅くなる'],
  'baldo|rita':   ['拳、裂けてるぞ', '殴った証拠。放っておけば、そのうち固くなる'],
  'baldo|gold':   ['おい。今日のは、命令じゃなかったろ', '……ああ。自分で、前に出た。妙な気分だ'],
  'baldo|shion':  ['で、いい報せは', 'あった！一個だけ、ちゃんとあったよ'],
  'baldo|hazuki': ['花、置いてきたな', '納める場所は、まだ覚えていますから'],
  'baldo|reia':   ['逃げ足、使わずに済んだな', '使う準備はしていたよ。……次も、するけど'],
  'baldo|erna':   ['で、俺の灰はどうなった', 'まだ一片も。……しぶといのよ、あなたは'],
  'baldo|owen':   ['四度目は書くなよ', '書かん。……生きている者の欄に、移しておく'],
  'baldo|muse':   ['一杯やるか。祝いだ', '手当てが先。……一口だけなら、付き合うわ'],
  'alvis|rita':   ['受けきった。無理はさせていない', '受けきられると、こっちが物足りないんだよ'],
  'alvis|gold':   ['お前も、まだ立っているな', '立つ動作は忘れない。……お前と、同じだ'],
  'alvis|shion':  ['見える場所に、戻ってきたな', 'ちゃんと戻ったでしょ。約束したもん'],
  'alvis|hazuki': ['見事な太刀筋だった', 'はい。……斬れる相手で、よかった'],
  'alvis|reia':   ['合図、正確だった', 'あんたが動かないでいてくれたからね。助かった'],
  'alvis|erna':   ['私の灰は、積もったか', 'まだ。……いつか積もったら、ちゃんと読んであげる'],
  'alvis|owen':   ['また一つ、守れなかった名が増えた', '増えていない。……守れた名のほうに、書き足した'],
  'alvis|muse':   ['整備は、まだ後でいい', 'その台詞、二度目。……次は聞かないから'],
  'rita|gold':    ['あんたの一撃、ズルいくらい重い', 'それが役目だ。……お前のは速い'],
  'rita|shion':   ['ガラ空き、当たってたよ', 'でしょ！ ……三回に一回は当たるんだから'],
  'rita|hazuki':  ['刀振り回すの、重そうね', '軽くはないですが、速さなら負けませんよ'],
  'rita|reia':    ['近づく前に終わらせるの、やめてくれる？', '近づかせない係だからね、あたし'],
  'rita|erna':    ['あたしも灰、溜まっているのか？', '読めるわよ。……全部あざの形をしてる'],
  'rita|owen':    ['今日のは、書かなくていいから', '書いたよ。いつもながら勇敢な戦いぶりだった'],
  'rita|muse':    ['平気だって', 'その言葉、拳はそうは言ってないの。……座って'],
  'gold|shion':   ['偵察。……感謝する', '「それが、私の役目だ」……どう？あなたの真似、似てた？'],
  'gold|hazuki':  ['刃が、こぼれている', 'ええ。……次に研ぐときまでの、覚え書きです'],
  'gold|reia':    ['弾、随分当てたな', '外したら逃げきれないもの。……必死なのよ'],
  'gold|erna':    ['私からも、灰は出るのか', '出るわ。鉄の灰。……一番、真っすぐに立ち昇るの'],
  'gold|owen':    ['記録を、頼む', '既に書いている。……技の威力も書き留めた'],
  'gold|muse':    ['損傷は、軽微だ', '油差すくらいはさせて。……無茶ばかり、軋む音が聞こえてるのよ'],
  'shion|hazuki': ['花、置いてきちゃったの？', '灰の下には、まだ土がありましたから'],
  'shion|reia':   ['次の町、あっちだと思う', 'なら、あっちね。私、……信じる係だからね'],
  'shion|erna':   ['あたしの灰、まだ軽い？', '軽いわ。……もっと走り回りなさい'],
  'shion|owen':   ['見てきたこと、全部話していい？', '話せ。……ゆっくりでいい、書き残そう'],
  'shion|muse':   ['ぜんぜん平気だよ！', '三日走ったあとの人が言うことじゃないの。……はい、座る'],
  'hazuki|reia':  ['あんなに遠くから当てるの、凄いですね', '近くで一撃の方が凄いって。……怖いよ、近くは'],
  'hazuki|erna':  ['この花、灰の下で咲いていました', '知ってる。……そういう花のほうが、よく残るのよ'],
  'hazuki|owen':  ['書き残すのですか。こんな戦いでも', 'こんな戦いだからだ。……忘れられやすいものから書く'],
  'hazuki|muse':  ['かすり傷です', 'かすり傷の人は、そんなに浅く息をしないの'],
  'reia|erna':    ['ちょっと、燃やしすぎじゃない？', '燃やさないと読めないの。……ちゃんと、燃やす順番は選んでる'],
  'reia|owen':    ['あたしの名前、載ってる？', '今日は載っている。……以前は「逃げた」と残しておいた'],
  'reia|muse':    ['先に若い子から診てあげてよ', 'あなたも十分に若いのよ。……座って'],
  'erna|owen':    ['あなたの本、燃やしたら読めるかしら', '冗談でも止めてくれ。……二冊とない貴重なものばかりだ'],
  'erna|muse':    ['治せない傷ばかりね、この世界は', 'それでも、痛みは減らせる。……減らすほうが、私の仕事'],
  'owen|muse':    ['この手当ての手順、書き留めておく', 'どうぞ。……いつか、私がいない時のために'],

  'baldo|raizu':  ['ほら見ろ、勝った', '当然でしょ。……そっちに張ってたんだから'],
  'baldo|kain':   ['矢、全部拾えたか', '一本だけ、まだです。……夜が明けたら探しに行きます'],
  'alvis|raizu':  ['五分だと言っていたな', '言ったわね。……次は六分って言ってあげる'],
  'alvis|kain':   ['射線を空けていた甲斐があった', 'ええ。……あなたが動かない人で、本当に助かりました'],
  'rita|raizu':   ['で、あたしの取り分は？', '無いわよ。……代わりに一つ、私の運を分けてあげる'],
  'rita|kain':    ['一本もこっちに来なかったね', '当てませんって言ったでしょう。……信じてなかったんですか'],
  'gold|raizu':   ['勝率の、事後報告を求める', '勝負は勝ちか負け、それだけよ。で、今日は勝ち'],
  'gold|kain':    ['肩を、貸した記録が残っている', '削れてませんか。……あとで拭いておきます'],
  'shion|raizu':  ['勝った！ ほんとに勝った！', 'だから言ったでしょ。……騒がないの、みっともない'],
  'shion|kain':   ['あそこ、ちゃんと入ってたね！', '入りました。……見つけたのは、あなたですよ'],
  'hazuki|raizu': ['やはり、賭けのほうが速かった', 'でしょう？ ……でも、あなたのほうが綺麗だったわ'],
  'hazuki|kain':  ['踏み込む場所が、空いていました', '空けました。……刀は、わたしより速いので'],
  'reia|raizu':   ['お金じゃ、逃げ足は買えないわよ？', 'あはは、私だって降りることはあるわよ。判断は早いわ'],
  'reia|kain':    ['やっぱり、外さなかったね', '外さないだけです。……速いのは、やっぱりあなただ'],
  'erna|raizu':   ['あら、あなたも、色々と失くしてきたのね', '灰でも読んだの？……勝負は時には負けるものよ'],
  'erna|kain':    ['火は、要らなかったみたいね', '私には必要ありません。……矢がダメになりますから'],
  'owen|raizu':   ['今日は勝ちの方に、書いておいた', '今後は、勝ちばかりよ。……負けの頁は、早く捨てなさい'],
  'owen|kain':    ['十七本、すべて回収を確認した', '十八本です。……一本、置いてきました'],
  'muse|raizu':   ['ほら、やっぱり切れてる', '勝ったんだから、いいでしょ。……痛いけど'],
  'muse|kain':    ['ちゃんと巻いておいたわよ', 'すみません。……次は、切る前に気付きます'],
  'raizu|kain':   ['ねえ、あの一本。賭けてたら勝ってたわよ', 'そう思いますか？……あれは、当たりませんでしたよ'],
};

const AFTER_CLOSE = {
  noLoss:  '誰も欠けなかった。当たり前のことのようでいて、この世界では、めったにないことだった。',
  fell:    '倒れた者の膝の土を、誰かが黙って払った。次はもう少しうまくやろう、とは誰も言わなかった。',
  swapped: '控えていた者が、いつのまにか最前線に立っている。誰も、そのことを口にしなかった。',
  ult:     'あの一撃を受けてなお、全員が立っている。それがどれほどのことか、当人たちがいちばん分かっていない。',
  oath:    '手放した景色のぶんだけ、身体が軽くなった気がした。軽くなった、という言い方は、たぶん正しくない。',
  quick:   '短かった。短すぎて、勝ったという実感が追いついてこない。',
  long:    '長い戦いだった。終わってみれば、いつ日が傾いたのかも覚えていない。',
  normal:  '息を整えて、それぞれが立ち上がる。ここで座り込めるほど、この道は優しくない。',
};

const AFTER_GAIN = {
  first: '世界がひとつ思い出した。取り戻した景色は、もう誰にも塗り潰せない。',
  again: 'この景色は、もう覚えている。覚えているものを、もう一度確かめに来ただけだ。',
};

const BUBBLE_LINES = {
  baldo: {
    start:     ['さて、やるか', '酒はあるぞ'],
    attack:    ['ほらよ', 'まだ飲める'],
    weak:      ['飲みすぎか？', '効いたな'],
    hurt:      ['効くねえ', 'いてえな'],
    low:       ['酒が切れたか', '頭が回らん'],
    heal:      ['目が覚める', '生き返るね'],
    allyDown:  ['先に寝るなよ', '朝までいくぞ'],
    enemyHalf: ['ここからだ', '飲み足りないね'],
    win:       ['乾杯といくか', '名前は覚えた'],
    join:      ['乾杯だ', '休憩は終いだ'],
  },
  alvis: {
    start:     ['防壁、展開', '前に出る'],
    attack:    ['退け', '通さない'],
    weak:      ['弱点、確認', 'そこだ'],
    hurt:      ['装甲、損傷', '問題ない'],
    low:       ['機体、限界', 'まだ立てる'],
    heal:      ['修復を確認', '感謝する'],
    allyDown:  ['守れなかった', '前に出る'],
    enemyHalf: ['出力を上げる', '命令は生きる'],
    win:       ['任務、完了', '交代の時間だ'],
    join:      ['配置に着く', '代わろう'],
  },
  rita: {
    start:     ['やっと殴れる', '相手に不足なし'],
    attack:    ['おらおら', 'まだまだ！'],
    weak:      ['いま効いたろ？', '手応えあり！'],
    hurt:      ['やば', '痛って！'],
    low:       ['骨折れたかも', 'まだ握れる'],
    heal:      ['拳は生きてる！', 'よし、いける'],
    allyDown:  ['頭にきた', 'よくもやったな'],
    enemyHalf: ['もう終わり？', '面白くなった'],
    win:       ['負け知らず！', '拳は裏切らない'],
    join:      ['あたしの番', '壊す係、登場'],
  },
  gold: {
    start:     ['起動', '前へ'],
    attack:    ['砕く', '重い一撃を'],
    weak:      ['有効', 'そこを砕く'],
    hurt:      ['損傷、軽微', 'まだ動く'],
    low:       ['駆動系、限界', '倒れられん'],
    heal:      ['修復、感謝', '再稼働'],
    allyDown:  ['守れなかった', '許容できない'],
    enemyHalf: ['出力、最大へ', '砕く。それだけ'],
    win:       ['完了', '次の命令を待つ'],
    join:      ['起動する', '命令を受領'],
  },
  shion: {
    start:     ['ぜんぶ見えた！', '強そう…！'],
    attack:    ['そこっ！', 'こっちだよ！'],
    weak:      ['当たった！', 'ほらね！'],
    hurt:      ['わっ', 'いった〜！'],
    low:       ['あ、死にそう', 'おわった！'],
    heal:      ['ありがと！', '元気でた！'],
    allyDown:  ['起きてってば！', 'ゆるさない'],
    enemyHalf: ['あと少しかな！', 'まだ半分？！'],
    win:       ['やった！', '言ったでしょ'],
    join:      ['いっくよー！', 'あたしが行く'],
  },
  hazuki: {
    start:     ['一撃で', '参ります'],
    attack:    ['斬り捨てます', 'そこです'],
    weak:      ['私の間合いです', '通りました'],
    hurt:      ['浅い', 'かすり傷です'],
    low:       ['引けません', 'ここまでとは'],
    heal:      ['まだ行けます', '助かりました'],
    allyDown:  ['散らせません', 'あとは、私が'],
    enemyHalf: ['ここからです', '本気でいきます'],
    win:       ['勝ちました', '花は散らず'],
    join:      ['参ります', '斬ります'],
  },
  reia: {
    start:     ['早く済ませよ', '逃げ準備OK'],
    attack:    ['射程圏内', '数で押し切る'],
    weak:      ['ど真ん中！', 'もらった'],
    hurt:      ['あー逃げたい！', 'ちょっと！'],
    low:       ['逃げ遅れた', '弾はまだある'],
    heal:      ['助かった！', '逃げ足を確保'],
    allyDown:  ['嘘でしょ', '理由が増えた'],
    enemyHalf: ['逃げ時かな', '降参しなさい'],
    win:       ['逃げなかった', '次の町行こ'],
    join:      ['行くしかないか', 'たまにはやるよ'],
  },
  erna: {
    start:     ['よく燃えそう', '重たい相手'],
    attack:    ['燃えなさい', 'ほら'],
    weak:      ['よく通るわ', 'そこが弱い'],
    hurt:      ['あら、そう', '効くのね'],
    low:       ['灰になりそう', 'まだ灰は早い'],
    heal:      ['ありがとう', '助かるわ'],
    allyDown:  ['灰が増えた', '許さないわ'],
    enemyHalf: ['本気を出すわ', 'あと半分よ'],
    win:       ['読めていたわ', 'もう眠りなさい'],
    join:      ['安心なさい', '燃やしてあげる'],
  },
  owen: {
    start:     ['記録しよう', '強敵だな'],
    attack:    ['書物のために', '書き留めよう'],
    weak:      ['弱点は記録済み', 'これが効く'],
    hurt:      ['書物を汚すな', '想定内だ'],
    low:       ['書物を頼む', '最後まで書こう'],
    heal:      ['助かった', '感謝する'],
    allyDown:  ['物語は途中', '名を残そう'],
    enemyHalf: ['結末は近い', 'ここから面白い'],
    win:       ['書き終えた', 'この頁は残る'],
    join:      ['続きは私が', '頁を継ごう'],
  },
  muse: {
    start:     ['無茶しないで', '治療は任せて'],
    attack:    ['ゴメンね', '殴るのは苦手'],
    weak:      ['そこね', '効き過ぎた？'],
    hurt:      ['あら大変', '後で診るわ'],
    low:       ['私は残らなきゃ', '最後まで診る'],
    heal:      ['これで安心', 'もう平気ね'],
    allyDown:  ['まだ間に合う', '起きて、お願い'],
    enemyHalf: ['本気出すわね', '薬はまだあるわ'],
    win:       ['お疲れさま', '全員生きて帰る'],
    join:      ['怪我人はいる？', '診察の時間よ'],
  },
  raizu: {
    start:     ['乗るわよ', '配って'],
    attack:    ['はい、一枚', 'まだ張れる'],
    weak:      ['大当たり', '読み勝ち'],
    hurt:      ['痛いじゃない', '手が滑った'],
    low:       ['負けが込んだ', 'まだ降りない'],
    heal:      ['助かるわ', '借りは返す'],
    allyDown:  ['起きて、損よ', 'まだ場は続く'],
    enemyHalf: ['ここから倍', '本命が来た'],
    win:       ['総取りね', '勝ち逃げよ'],
    join:      ['場に着いたわ', '勝ちに行くわよ'],
  },
  kain: {
    start:     ['狙います', '無駄はなし'],
    attack:    ['一本', 'そこですね'],
    weak:      ['当たりです', '芯を捉えた'],
    hurt:      ['まだ持ちます', '効きました'],
    low:       ['矢は残ってる', 'まだ引けます'],
    heal:      ['助かります', 'ありがとう'],
    allyDown:  ['拾いに行く', '起きてください'],
    enemyHalf: ['ここからです', '数えました'],
    win:       ['矢を拾います', '終わりました'],
    join:      ['代わります', '無駄にはしない'],
  },
};

const BUBBLE_ANY = {
  start:     ['行こう', '強そう…'],
  attack:    ['はっ', 'そこ'],
  weak:      ['効いてる', 'そこだ'],
  hurt:      ['やば', 'くっ'],
  low:       ['あ、死にそう', 'まだいける'],
  heal:      ['ありがとう', '助かった'],
  allyDown:  ['頭にきた', '起きて'],
  enemyHalf: ['本気出す', 'ここからだ'],
  win:       ['終わった', 'ふう'],
  join:      ['交代だ', 'ここからは私が'],
};

const BUBBLE_PAIR = {
  'baldo|alvis': [['援護しろ', '承知した'], ['盾はまだ持つか', '問題ない'], ['酒は飲むか？', '壊れる']],
  'baldo|rita': [['前に出すぎだ', '出るってば'], ['拳が裂けるぞ', '固くなるだけ'], ['酒は飲むか？', '体に悪い']],
  'baldo|gold': [['前が見えん', '隠れてろ'], ['錆びてないな', '磨いてある'], ['酒は飲むか？', '油がいい']],
  'baldo|shion': [['どこが甘い', '右後ろ！'], ['走りすぎだ', '止まれないの'], ['酒は飲むか？', '苦いのはヤダ']],
  'baldo|hazuki': [['まだ抜くな', 'もう遅いです'], ['花は無事か', '胸にあります'], ['酒は飲むか？', '私強いですよ？']],
  'baldo|reia': [['弾は足りるか', '数えてない'], ['逃げるなよ', '逃げ足は温存'], ['酒は飲むか？', '逃げるのが先！']],
  'baldo|erna': [['灰は読めたか', '重たいわね'], ['何が見える', '終わりの形が'], ['酒は飲むか？', 'あなた飲みすぎ']],
  'baldo|owen': [['書くのか？', '当然だ'], ['俺の名は？', '三度目だ'], ['酒は飲むか？', '書けなくなる']],
  'baldo|muse': [['俺は後でいい', '一番最後よ'], ['まだ飲める', 'もう座って'], ['酒は飲むか？', '飲みすぎは毒よ']],
  'baldo|raizu': [['賭けるなら？', '勝つ方に張る'], ['指輪が光るな', '高いのよコレ'], ['酒は飲むか？', '朝まで行く？']],
  'baldo|kain': [['矢は足りるか', '拾えば足ります'], ['惜しむなよ', '惜しみません'], ['酒は飲むか？', '僕は水がいい']],

  'alvis|rita': [['下がっていろ', 'やなこった'], ['受け持つ', '私が壊す'], ['無茶は許さん', '許可はいらない']],
  'alvis|gold': [['並べ', '並ぶ'], ['前を頼む', '前は得意だ'], ['同型か', 'たぶん、違う']],
  'alvis|shion': [['見えるか', 'ばっちり！'], ['退路は', 'ちゃんとある'], ['じっとしろ', '無理、無理']],
  'alvis|hazuki': [['受ける', 'では斬ります'], ['盾の陰へ', 'では、後ろから'], ['守れたか', '助かります']],
  'alvis|reia': [['合図を', '三、二……'], ['射線を空ける', 'ありがと'], ['狙えるか', '外さないよ']],
  'alvis|erna': [['焼けるか', '焼けるわ'], ['灰は嫌いだ', '君はまだ大丈夫'], ['記録が消える', 'なら覚えとく']],
  'alvis|owen': [['あれは敵か', '書物にはない'], ['私も書かれるか', '当然だ'], ['守ろう', '書物も頼む']],
  'alvis|muse': [['まだ動ける', '機械は専門外'], ['修理は不要', '油くらい差す'], ['痛覚はない', '私は感じる']],
  'alvis|raizu': [['確率は', '五分と五分よ'], ['賭けは苦手だ', '計算得意でしょ'], ['退けないぞ', '降りないわよ']],
  'alvis|kain': [['射線を空ける', '通します'], ['盾の上から', 'お借りします'], ['合図で射て', 'いつでもどうぞ']],

  'rita|gold': [['重いの頼む', '任された'], ['殴っていい？', '練習か？'], ['固いね', '鉄だからな']],
  'rita|shion': [['どこ狙う？', '真ん中！'], ['道は開ける！', 'ありがと！'], ['早いね！', 'まだまだ！']],
  'rita|hazuki': [['先行くよ', 'お気をつけて'], ['刀重そう', '抜くのは一瞬'], ['綺麗な花ね', '散るまでは']],
  'rita|reia': [['当てなよ', '当然'], ['私は避けてよ', 'どいてどいて'], ['援護して', '逃げるかも']],
  'rita|erna': [['燃えるわね', '燃やすのよ'], ['熱くない？', '慣れなさい'], ['やっぱり拳よ', '手は大事よ']],
  'rita|owen': [['数えてる？', '三十七発だ'], ['本、重い？', '命よりは軽い'], ['字は読めない', '語ろうか？']],
  'rita|muse': [['まだ行ける', '嘘つき'], ['かすり傷！', '見せなさい'], ['治して', 'じっとして']],
  'rita|raizu': [['当たる？', '当てるの'], ['じゃらじゃら', 'いい音でしょ'], ['勝つよ！', '乗った！']],
  'rita|kain': [['前出るよ', 'いつも通り'], ['遠いって！', '射程圏内'], ['よく狙えるね', '見えますから']],

  'gold|shion': [['前方、報告', '道はあるよ！'], ['進路を、指示', 'まっすぐ！'], ['速度、超過', 'ついてきて！']],
  'gold|hazuki': [['先に出る', 'お先にどうぞ'], ['盾に、なる', '助かります'], ['花は、邪魔か', '守るものです']],
  'gold|reia': [['援護、頼む', '任せといて'], ['射角を、空ける', '助かる'], ['命中率は', '聞かないでよ']],
  'gold|erna': [['熱を、寄こせ', 'ありったけを'], ['解析、不能', '私も同じ'], ['勝てるか', '勝つのよ']],
  'gold|owen': [['記録、頼む', '取っている'], ['私の型番は', '載っていない'], ['戦法、探す', '指示しよう']],
  'gold|muse': [['損傷、軽微', '油を差すわ'], ['痛覚、なし', 'だから困るの'], ['整備、不要', '便利な身体ね']],
  'gold|raizu': [['勝率、要求', '教えない'], ['計算、不能', 'それが賭けよ'], ['乱数、嫌い', 'あたしは好き']],
  'gold|kain': [['射点、確保', '助かります'], ['肩を、貸す', 'お借りします'], ['矢を、拾う', '僕に任せて']],

  'shion|hazuki': [['花、あった！', 'あとで摘む'], ['前、開けた', '行きましょう'], ['早く！', '転びますよ']],
  'shion|reia': [['そっち行った', '来ないで！'], ['あたし先！', '待ちなって'], ['風、変わった', 'じゃあ今だね']],
  'shion|erna': [['焦げ臭い', 'いい匂いよ'], ['熱っ！', '近付き過ぎ'], ['喉乾かない？', 'あとでね']],
  'shion|owen': [['頭良いね', '長く生きただけ'], ['見てきた！', '聞こうか'], ['字、きれい', '手が覚えてる']],
  'shion|muse': [['まだ走れる！', '座りなさい'], ['元気だよ！', '知っているわ'], ['痛い！', 'じっとしなさい']],
  'shion|raizu': [['ねえ、勝てる？', '勝つ側にいる'], ['指輪くれる？', '働いたらね'], ['賭けよう！', 'あなたには早い']],
  'shion|kain': [['右行ける！', '右、了解'], ['あそこ！', '見えました'], ['早く！', '狙ってます']],

  'hazuki|reia': [['一撃で決める', '数で勝負よ'], ['間合いです', '銃が勝つわ'], ['お先に', 'どうぞどうぞ']],
  'hazuki|erna': [['灰が舞います', '花より軽い'], ['焼けますか', '斬るのが先ね'], ['熱は苦手です', '慣れておいて']],
  'hazuki|owen': [['お茶します？', '勝利後だ'], ['この一太刀を', '書き留めよう'], ['名は要りません', 'では「花」と']],
  'hazuki|muse': [['浅い傷です', '無理しないの'], ['血は止めます', '私の仕事'], ['まだ立てます', '立たせないわ']],
  'hazuki|raizu': [['お行儀が悪い', '勝てば同じよ'], ['作法があります', '勝ちが作法よ'], ['一撃で', '一勝負で']],
  'hazuki|kain': [['先に一射を', '弦、鳴らします'], ['踏み込みます', '合わせます'], ['音が静か', '弓ですから']],

  'reia|erna': [['やっぱ遠距離', 'それは同感'], ['逃げるのは私', '言いつけるわよ'], ['前見えない', '煙は好き？']],
  'reia|owen': [['名前、書いて', 'もう書いた'], ['何発目？', '十二発だ'], ['後で読ませて', '歓迎しよう']],
  'reia|muse': [['先に若い子', 'あなたもよ'], ['平気だって', '帽子を取って'], ['逃げ遅れた', '私が診るわ']],
  'reia|raizu': [['また賭けた？', '今日は勝ってる'], ['奢ってよ', '勝ったらね'], ['逃げないの？', '賭けの最中']],
  'reia|kain': [['どっちが速い', 'あなたです'], ['弾ある？', '矢なら'], ['拾い癖ね', '節約です']],

  'erna|owen': [['燃やす？', '止めてくれ'], ['私も書物は好き', '沢山あるぞ'], ['灰の頁ね', '写しがある']],
  'erna|muse': [['治せる？', '痛みだけね'], ['火傷した', 'だから言った'], ['効くのそれ', '効かせるのよ']],
  'erna|raizu': [['指輪、重い？', '軽いわけない'], ['運は読めない', 'だから面白い'], ['燃やそうか？', '賭けようか？']],
  'erna|kain': [['矢が燃えた', 'また作ります'], ['よく直すのね', '生活です'], ['手伝おうか？', '自分でできます']],

  'owen|muse': [['手順を残そう', '良い事ね'], ['分量は', '毎回違うの'], ['材料は何だ？', '動植物たち']],
  'owen|raizu': [['勝敗を記録', '勝ちだけ書いて'], ['負けも記録に', '消しといて'], ['何度目だ', '数えないわ']],
  'owen|kain': [['矢数は足りるか', '十七本です'], ['折れた本数は', '二本、直せます'], ['お茶はどうだ', '無事帰れたら']],

  'muse|raizu': [['無茶しないの', '無茶が本業'], ['賭け過ぎよ', '勝負どころ！'], ['座りなさい', '勝ってからね']],
  'muse|kain': [['指、切れてる', 'かすり傷です'], ['弦は替えた？', '昨夜のうちに'], ['休みなさい', '矢がある限り']],

  'raizu|kain': [['一本、賭ける？', '矢は賭けません'], ['つまんない', '十分です'], ['当てたら奢る', 'では当てます']],
};

const HELP = {
  title: 'はじめての方へ',
  lead: '覚えることは多くありません。この6つだけ先に知っておくと、迷わずに進めます。',
  items: [
    { h: '「風景の記憶」を装備するとスキルが撃てます',
      t: '「パーティ編成」で、仲間ひとりに1枚ずつ。装備していないキャラはスキルを使えません。'
       + '同じ風景をもう一度引くとランクが上がり、ランクの数だけ1戦でスキルを撃てます。' },
    { h: 'キャラが育つのは、戦いよりガチャのダブりです',
      t: '同じ仲間をもう一度引くと、レベルが3上がってランクも1つ上がります。'
       + '欠片は敵を倒すと手に入ります。強くなりたいときは、まず引いてください。' },
    { h: '交代は、1ターンに何度でもできます',
      t: '控えキャラとの入れ替えが戦略の鍵です。並べ替えのつもりで使えます。'
       + '倒れたキャラを控えに下げて、スキル等で復活させることもできます。' },
    { h: '喪失スキルは、レベルを5つ払って撃つ強力な一撃です',
      t: 'Lv6以上で、HPが半分以下で撃てます。撃つとレベルが5下がりますが、'
       + '戦闘やガチャのダブりでまた上がります。**取り返しはつきます。**' },
    { h: '敵の崩壊ゲージが満ちると、超必殺技が来ます',
      t: '敵の名前の下にあるゲージです。満ちる前に倒しきるか、'
       + 'シオン等の技で巻き戻すか、受けきる覚悟をするか——考えどころです。' },
    { h: '「旅の記憶を残す」で、合言葉を控えられます',
      t: '進み具合はブラウザに自動で保存されますが、ブラウザの記憶から消えることがあります。'
       + '合言葉を控えておけば、別の端末でも続きから遊べます。' },
  ],
  close: '——あとは、遊びながらで大丈夫です。',

  credit: {
    h: 'この作品について',
    t: '画像は **Midjourney v8.2**、音楽と効果音は **Suno v5.5（PremierPlan）** を中心に作っています。'
     + '文章やゲームの仕組みは バジルペッパー・オレンジ（https://x.com/Basil_Pepper） がAIと一緒に作りました。',
  },
};

const ENDING = {
  bg: 'title.jpg',
  chapter: '終景',
  place: '灰のあとの世界',

  lead: [
    '灰は、それからも降った。降るのをやめてはいない。',
    '変わったのは速さのほうだった。朝に聞いた花の名前を、夕方まで覚えていられるようになった。それだけのことが、この世界では百年ぶりだった。',
    '半年たって、南の街の井戸に名札が戻った。誰かが思い出したのではない。忘れきる前に、書いておくだけの時間があったというだけのことだった。',
    '一年たって、子どもが親の顔を覚えたまま大人になれるようになった。取り戻したものではない。はじめから人にあったはずの速さが、戻ってきただけだった。',
    '灰の底で何があったのかは、どこにも記録されていない。過ぎてしまった三百年ぶんの年月も、返ってはこなかった。消えた街は消えたままで、忘れた名前は忘れたままだ。',
    '戻ってきたのは、これから先の時間だけだった。あの日あそこで勝ち取れたものは、それでぜんぶで——たぶん、それがいちばん大きかった。',
  ],

  party: 'そのあと、あなたたちがどこへ向かったのかは書かれていない。ただ、{names}は、まだ一緒にいた。',

  close: [
    'いつか、あなたもこの旅を忘れる。記憶の灰の言ったことは、最後まで正しかった。誰も、忘れずにはいられない。',
    'それでも——忘れるまでには、これだけの時間がある。',
  ],
  last: '——忘れるまでは、覚えている。',

  btn: 'スタッフロールへ',
  btnBack: '拠点へもどる',
};

const CREDITS = {
  bg: 'title.jpg',

  roll: [
    { kind: 'space', value: 40 },
    { kind: 'title', value: 'REMAINS at the END' },
    { kind: 'sub',   value: '― 世界の記憶を繋ぎとめる物語 ―' },
    { kind: 'space', value: 120 },
    { kind: 'role',  value: '制作' },
    { kind: 'name',  value: 'バジルペッパー・オレンジ' },
    { kind: 'space', value: 90 },

    { kind: 'role',  value: '画像' },
    { kind: 'name',  value: 'Midjourney v8.2' },
    { kind: 'space', value: 40 },
    { kind: 'role',  value: '音楽・効果音' },
    { kind: 'name',  value: 'Suno v5.5（Premier Plan）' },
    { kind: 'space', value: 160 },
    { kind: 'text',  value: 'この物語のなかで、あなたは十二人の名前を覚えました。' },
    { kind: 'text',  value: '十二枚の景色と、八つの相手の顔を覚えました。' },
    { kind: 'text',  value: 'そのうちのいくつかは、もう思い出せないかもしれません。' },
    { kind: 'space', value: 120 },
    { kind: 'text',  value: 'それでいいのだと思います。' },
    { kind: 'text',  value: '忘れるまでのあいだ、たしかに覚えていました。' },
    { kind: 'space', value: 80 },
  ],

  last: [
    'この物語も、いつか忘れます。',
    '忘れたら、詩を思い出してまた来てください。灰の上には、まだ足あとが残っています。',
  ],
  poemHead: 'あなたの旅の記憶',
  poemNote: 'この詩を写しておけば、忘れたころに、ここから続きを始められます。',

  speed: 62,

  btnSkip: '最後まで送る',
  btnEnd: 'おわり',
};

const HALF_VOICE = {
  baldo: {
    e7: ['破れた頁は、俺が読む', '消したものの名前、覚えてるぜ'],
    e8: ['積もる前に、飲み干してやる', 'まだ手放さねえって言ったろ'],
  },
  alvis: {
    e7: ['消された者の名は、私が預かる', 'その頁を、これ以上破らせない'],
    e8: ['薄れても、私はここに立つ', '守る順番は、変わらない'],
  },
  rita: {
    e7: ['紙のくせに、よく喋る', '破れるなら、あたしが破る'],
    e8: ['殴れないなら、殴れるまで殴る', '灰なんて、蹴散らすだけ'],
  },
  gold: {
    e7: ['破損、確認。……修復は、私が', '記録、継続。……まだ、終わらない'],
    e8: ['堆積、増大。……それでも、動く', '時間、超過。……問題は、ない'],
  },
  shion: {
    e7: ['あたしが見てきた道、消させない', '先に行く！ 追いついて！'],
    e8: ['まだ走れる！ 灰になんか負けない', '道は覚えてる。ぜんぶ覚えてる'],
  },
  hazuki: {
    e7: ['白紙にはさせません。一輪あります', '消された頁に、栞を挟みます'],
    e8: ['挿していた場所は、覚えています', '灰の下には、まだ土があります'],
  },
  reia: {
    e7: ['逃げ道がないなら、正面から抜ける', 'その頁、あたしが撃ち抜く'],
    e8: ['逃げるのはやめた。今日だけね', '速さなら、負けるつもりはない'],
  },
  erna: {
    e7: ['白紙は読めない。だから燃やす', '消した頁の灰も、読んであげる'],
    e8: ['読み切ってみせる。全部の灰を', '燃やせば、少しは軽くなるはず'],
  },
  owen: {
    e7: ['書き手が消えても、写しは残る', '私が最後の一冊だ。焼かせない'],
    e8: ['積もる前に、書き終える', 'この頁は、まだ白くない'],
  },
  muse: {
    e7: ['痛みは治せる。忘却は治せない', '消えた人のぶんまで、診るわ'],
    e8: ['治せないなら、間に合わせるわ', 'まだ看取る気は、ないの'],
  },
  raizu: {
    e7: ['白紙に賭けるほど、落ちてない', 'その頁、あたしが張り返す'],
    e8: ['勝率は悪い。だから面白いのよ', '忘れないほうに、全部張るわ'],
  },
  kain: {
    e7: ['消された頁も、僕が拾います', '一本ずつ、返してもらいます'],
    e8: ['灰の中からでも、拾えます', 'まだ、矢は残っています'],
  },
};
