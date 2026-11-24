/* 콕콕 노노그램: 퍼즐 데이터, 힌트 숫자 계산, 풀이 검증기, 퍼즐 생성기.
   브라우저에서는 window.Nono, node에서는 require('./core.js').Nono 로 써요. */
(function (root) {
  /* 퍼즐마다 k는 저장 기록에 쓰는 고정 번호예요. 순서를 바꿔도 k는 그대로 둬요.
     보통·어려움은 풀이 검증기로 잰 난이도가 낮은 것부터 늘어놓았어요. */
  const PACKS = [
    {
      id: 'easy', name: '쉬움', size: 5, desc: '5×5 · 처음이라면 여기부터',
      puzzles: [
        { k: 0, name: '하트', rows: ['.R.R.', 'RPRRR', 'RRRRR', '.RRR.', '..R..'] },
        { k: 1, name: '집', rows: ['..R..', '.RRR.', 'RRRRR', '.Y.Y.', '.YWY.'] },
        { k: 2, name: '우산', rows: ['.PVP.', 'VPVPV', '..W..', 'W.W..', '.WW..'] },
        { k: 3, name: '나무', rows: ['.GGG.', 'DDDDD', '.GGG.', '..W..', '.WWW.'] },
        { k: 4, name: '물고기', rows: ['.....', 'R.OOO', 'ROOOO', 'R.OOO', '.....'] },
        { k: 5, name: '별', rows: ['..Y..', 'YYYYY', '.YYY.', '.Y.Y.', 'Y...Y'] },
        { k: 6, name: '돛단배', rows: ['..R..', '.RR..', '.RRR.', 'NNNNN', '.WWW.'] },
        { k: 7, name: '고양이', rows: ['O...O', 'OOOOO', 'O.O.O', 'OCCCO', '.CCC.'] },
        { k: 8, name: '음표', rows: ['.VVVV', '.V..V', '.V..V', 'NN.NN', 'NN.NN'] },
      ],
    },
    {
      id: 'normal', name: '보통', size: 10, desc: '10×10 · 가장 인기 있는 크기',
      puzzles: [
        { k: 29, name: '산', rows: ['....II....', '...IIII...', '...SSSS...', '..SSSSSS..', '.SSSSSSSII', 'SSSSSSSSSS', 'SSSSSSSSSS', 'GGGGGGGGGG', 'GGDGGGDGGG', 'GGGGGGGGGG'] },
        { k: 14, name: '왕관', rows: ['..........', 'Y...YY...Y', 'Y...YY...Y', 'YY.YYYY.YY', 'YY.YYYY.YY', 'YYYYYYYYYY', 'YRYYBBYYRY', 'YYYYYYYYYY', 'OOOOOOOOOO', '..........'] },
        { k: 28, name: '수박', rows: ['..........', '..........', 'GGGGGGGGGG', 'GRRRRRRRRG', 'GRRKRRKRRG', '.GRRRRRRG.', '.GRRRKRRG.', '..GRRRRG..', '...GGGG...', '..........'] },
        { k: 9, name: '물고기', rows: ['..........', '..BBBB...T', '.BBBBBB.TT', 'BB.BBBBBTT', 'BBBBBBBBTT', 'BBBBBBBBTT', '.BBBBBB.TT', '..BBBB...T', '..........', '..........'] },
        { k: 21, name: '자동차', rows: ['..........', '..RRRRRRR.', '..RIIRIIR.', '..RIIRIIR.', 'RRRRRRRRRR', 'RRRRRRRRRY', 'RRRRRRRRRR', '.KKK..KKK.', '.KSK..KSK.', '.KKK..KKK.'] },
        { k: 22, name: '나비', rows: ['V...KK...V', 'VV..KK..VV', 'VVV.KK.VVV', 'VPVVKKVVPV', 'VVVVKKVVVV', '.VVVKKVVV.', '.PPPKKPPP.', 'PPPPKKPPPP', 'PPP.KK.PPP', '.P..KK..P.'] },
        { k: 17, name: '선물', rows: ['..RR..RR..', '.R..RR..R.', '..RRRRRR..', 'BBBBRRBBBB', 'BBBBRRBBBB', '.BBBRRBBB.', '.BBBRRBBB.', '.BBBRRBBB.', '.BBBRRBBB.', '.BBBRRBBB.'] },
        { k: 5, name: '커피', rows: ['..S..S....', '...S..S...', '..S..S....', '..........', 'WWWWWWW...', 'BBBBBBBBB.', 'BBBBBBB.BB', 'BBBBBBB.BB', 'BBBBBBBBB.', '.BBBBB....'] },
        { k: 27, name: '양초', rows: ['....OO....', '...OYYO...', '...OYYO...', '....OO....', '....KK....', '..IIIIII..', '..IIIIII..', '..IIIIII..', '.LLLLLLLL.', 'LLLLLLLLLL'] },
        { k: 31, name: '유령', rows: ['...IIII...', '..IIIIII..', '.IIIIIIII.', '.IKKIIKKI.', '.IKKIIKKI.', '.IIIIIIII.', '.IIIPPIII.', 'IIIIIIIIII', 'II.IIII.II', 'I..I..I..I'] },
        { k: 32, name: '게', rows: ['RR......RR', 'R.R....R.R', 'RR......RR', '.R.K..K.R.', '.RRRRRRRR.', 'RRRRRRRRRR', 'RRRRRRRRRR', '.RRRRRRRR.', 'R.R.RR.R.R', 'R.R....R.R'] },
        { k: 4, name: '고양이', rows: ['SS......SS', 'SSS....SSS', 'SSSSSSSSSS', 'SSSSSSSSSS', 'SS.SSSS.SS', 'SPSSSSSSPS', 'SSSS..SSSS', 'SSSSSSSSSS', '.CCCCCCCC.', '..CCCCCC..'] },
        { k: 2, name: '버섯', rows: ['...RRRR...', '.RRRRRRRR.', 'RRR.RR.RRR', 'RRRRRRRRRR', 'RRRRRRRRRR', '...LLLL...', '...L..L...', '...L..L...', '..LL..LL..', '..LLLLLL..'] },
        { k: 16, name: '꽃', rows: ['..PP..PP..', '.PPPPPPPP.', '.PPPYYPPP.', '..PYYYYP..', '.PPPYYPPP.', '.PPPPPPPP.', '..PPGGPP..', '....GG....', '.GG.GG.GG.', '..GGGGGG..'] },
        { k: 11, name: '사과', rows: ['....W.GG..', '....WGG...', '..RRWRRR..', '.RRRRRRRR.', '.RPRRRRRR.', '.RPRRRRRR.', '.RRRRRRRR.', '.RRRRRRRR.', '..RRRRRR..', '...RR.RR..'] },
        { k: 8, name: '우산', rows: ['....RR....', '..YYRRYY..', '.RYYRRYYR.', 'RRYYRRYYRR', '....W.....', '....W.....', '....W.....', '....W..W..', '....W..W..', '....WWWW..'] },
        { k: 10, name: '튤립', rows: ['....RR....', '.R.RRRR.R.', '.PPPPPPPP.', '.PPPPPPPP.', '..PPPPPP..', '...PPPP...', '....GG....', '.GG.GG.GG.', '..GGGGGG..', '....GG....'] },
        { k: 0, name: '하트', rows: ['.RRR..RRR.', 'RPPRRRRRRR', 'RPRRRRRRRR', 'RRRRRRRRRR', 'RRRRRRRRRR', '.RRRRRRRR.', '..RRRRRR..', '...RRRR...', '....RR....', '..........'] },
        { k: 24, name: '강아지', rows: ['.WW....WW.', 'WWWLLLLWWW', 'WWLLLLLLWW', 'WWLKLLKLWW', '.WLLLLLLW.', '..LLCCLL..', '..LCKKCL..', '..LCCCCL..', '...CRRC...', '....CC....'] },
        { k: 26, name: '로봇', rows: ['....YY....', '..SSSSSS..', '..SBSSBS..', '..SSSSSS..', '..SKKKKS..', '...SSSS...', 'N.SSSSSS.N', 'N.SRSSYS.N', '..SSSSSS..', '..NN..NN..'] },
        { k: 7, name: '집', rows: ['....RR....', '...RRRR.WW', '..RRRRRRRR', '.RRRRRRRRR', 'RRRRRRRRRR', '.YYYYYYYY.', '.YY.YYYYY.', '.YYYYYYYY.', '.YYYYY..Y.', '.YYYYY..Y.'] },
        { k: 20, name: '펭귄', rows: ['...NNNN...', '..NNNNNN..', '..NCNNCN..', '..NNOONN..', '.NNCCCCNN.', 'NNCCCCCCNN', 'NNCCCCCCNN', '.NCCCCCCN.', '..NCCCCN..', '.OO....OO.'] },
        { k: 3, name: '로켓', rows: ['....RR....', '...RRRR...', '...RRRR...', '..SS..SS..', '..SS..SS..', '..SSSSSS..', '.SSSSSSSS.', 'RR.SSSS.RR', 'R..SSSS..R', 'R..O..O..R'] },
        { k: 23, name: '고래', rows: ['...B.B....', '....B.....', '....B.....', '..BBBBB..B', '.BBBBBBB.B', 'BBKBBBBBBB', 'BBBBBBBBB.', 'IIIIIIII..', '.IIIIII...', '..........'] },
        { k: 30, name: '거북이', rows: ['..........', '...DDDD...', '..DGDDGD..', '.DDDDDDDD.', '.DDGDDGDDG', '.DDDDDDDDG', '..DDDDDD..', '.GG....GG.', '.GG....GG.', '..........'] },
        { k: 12, name: '체리', rows: ['....GGG...', '...GGGW...', '....WWWW..', '...WW..W..', '..WW...WW.', '.RRR..RRR.', 'RRRRR.RRRR', 'RPRRR.RPRR', 'RRRRR.RRRR', '.RRR...RR.'] },
        { k: 19, name: '아이스크림', rows: ['...PPPP...', '..PPPPPP..', '.PPPPPPPP.', '.PPRPPPPP.', '.PPPPPPPP.', '..LLLLLL..', '..LLLLLL..', '...LLLL...', '...LLLL...', '....LL....'] },
        { k: 6, name: '전나무', rows: ['....YY....', '...GGGG...', '..GGGGGG..', '...DDDD...', '..GGGGGG..', '.GGGGGGGG.', '..DDDDDD..', '.GGGGGGGG.', 'GGGGGGGGGG', '....WW....'] },
        { k: 13, name: '선인장', rows: ['....GG....', '...GGGG...', '...GGGG.G.', '.G.GGGG.G.', '.G.GGGGGG.', '.GGGGGG...', '...GGGG...', '...GGGG...', '..OOOOOO..', '...OOOO...'] },
        { k: 1, name: '오리', rows: ['...YYYY...', '..YYYYYY..', '..YYY.OOOO', '..YYYYYY..', '...YYYY...', 'Y..YYYY...', 'YY.YYYYY..', 'YYYYYYYYY.', '.YYYYYYYY.', '..YYYYYY..'] },
        { k: 18, name: '열쇠', rows: ['..YYYY....', '.YY..YY...', '.Y....Y...', '.YY..YY...', '..YYYY....', '...YY.....', '...YY.....', '...YYYY...', '...YY.....', '...YYYY...'] },
        { k: 25, name: '닻', rows: ['...NNNN...', '...N..N...', '...NNNN...', '....NN....', '..NNNNNN..', '....NN....', 'N...NN...N', 'N...NN...N', 'NN..NN..NN', '.NNNNNNNN.'] },
        { k: 15, name: '달', rows: ['....YYYY..', '..YYYY....', '.YYYY.....', '.YYY....Y.', 'YYYY...YYY', 'YYYY....Y.', '.YYYY.....', '.YYYYY....', '..YYYYYYY.', '....YYYYY.'] },
      ],
    },
    {
      id: 'hard', name: '어려움', size: 15, desc: '15×15 · 천천히 추리하는 큰 그림',
      puzzles: [
        { k: 1, name: '성', rows: ['N.N.N.....N.N.N', 'SSSSS.....SSSSS', 'SSSSS.....SSSSS', 'S.SSS.....SSS.S', 'SSSSS.N.N.SSSSS', 'SSSSSNNNNNSSSSS', 'SSSSSNNNNNSSSSS', 'SSSS.NNNNN.SSSS', 'SSSS.NNNNN.SSSS', 'SSSSSNNNNNSSSSS', 'SSSSSN...NSSSSS', 'SSSSS.....SSSSS', 'SSSSS.....SSSSS', 'SSSSS.....SSSSS', 'SSSSS.....SSSSS'] },
        { k: 7, name: '케이크', rows: ['.......O.......', '.......Y.......', '.......R.......', '....PPPPPPP....', '...PPPPPPPPP...', '...LLLLLLLLL...', '...LLLLLLLLL...', '.PPPPPPPPPPPPP.', '.PPCPPCPPCPPCP.', '.LLLLLLLLLLLLL.', '.LLRLLRLLRLLRL.', '.LLLLLLLLLLLLL.', 'BBBBBBBBBBBBBBB', '.BBBBBBBBBBBBB.', '...............'] },
        { k: 3, name: '곰', rows: ['.WW.........WW.', 'WWWW.WWWWW.WWWW', 'WWWWWWWWWWWWWWW', '.WWWWWWWWWWWWW.', '.WWWWWWWWWWWWW.', 'WWW..WWWWW..WWW', 'WWW..WWWWW..WWW', 'WWWWWWWWWWWWWWW', 'WWWWW.LLL.WWWWW', 'WWWW.LLLLL.WWWW', 'WWWW.LL.LL.WWWW', 'WWWW.LLLLL.WWWW', '.WWWW.....WWWW.', '..WWWWWWWWWWW..', '....WWWWWWW....'] },
        { k: 4, name: '버섯 집', rows: ['....RRRRRRR....', '..RRRRRRRRRRR..', '.RRCCRRRRRCCRR.', 'RRRCCRRRRRCCRRR', 'RRRRRRRCCRRRRRR', 'RRRRRRRCCRRRRRR', 'RCCRRRRRRRRRCCR', '.RRRRRRRRRRRRR.', '....LLLLLLL....', '....LKLLLKL....', '....LLLLLLL....', '....LLPPPLL....', '....LLLLLLL....', '...LLLLLLLLL...', '..GGGGGGGGGGG..'] },
        { k: 10, name: '등대', rows: ['......YYY......', '.....YYYYY.....', '......RRR......', '.....RRRRR.....', '.....IYYYI.....', '.....IYYYI.....', '....RRRRRRR....', '.....IIIII.....', '.....RRRRR.....', '....IIIIIII....', '....RRRRRRR....', '....IIKKKII....', '...RRRKKKRRR...', '..SSSSSSSSSSS..', '.SSSSSSSSSSSSS.'] },
        { k: 11, name: '기차', rows: ['...............', '.........SS....', '........SSSS...', '.........KK....', '..RRRRR..KK....', '..RIIIR.BBBBBB.', '..RIIIR.BBBBBB.', '..RRRRRBBBBBBBB', '.RRRRRRBBBBBBBB', '.RRRRRRBBYBBBBB', 'KKKKKKKKKKKKKKK', '.KKK.KKK.KKKK..', '.KSK.KSK.KSSK..', '.KKK.KKK.KKKK..', '...............'] },
        { k: 2, name: '돛단배', rows: ['.......R.......', '......RR.......', '.....RRR.Y.....', '....RRRR.YY....', '...RRRRR.YYY...', '..RRRRRR.YYYY..', '.RRRRRRR.YYYYY.', '.......W.......', '.......W.......', 'NNNNNNNNNNNNNNN', '.WWWWWWWWWWWWW.', '..WWWWWWWWWWW..', '...WWWWWWWWW...', '...............', '...............'] },
        { k: 5, name: '부엉이', rows: ['..WW.......WW..', '..WWW.....WWW..', '..WWWWWWWWWWW..', '.WWCCCWWWCCCWW.', '.WCCKCCWCCKCCW.', '.WCCKCCWCCKCCW.', '.WWCCCWOWCCCWW.', '.WWWWWWOWWWWWW.', '.WWLLLLLLLLLWW.', '.WWLLWLLLWLLWW.', '.WWLLLLLLLLLWW.', '.WWLWLLLLLWLWW.', '..WWLLLLLLLWW..', '...WWWWWWWWW...', '....OO...OO....'] },
        { k: 0, name: '눈사람', rows: ['.....IIIII.....', '....IIIIIII....', '....II.I.II....', '....IIIIIII....', '.....IIIII.....', '...RRRRRRRRR...', '..IIIIIIIIIII..', '.IIIIII.IIIIII.', '.IIIIIIIIIIIII.', '.IIIIII.IIIIII.', '.IIIIIIIIIIIII.', '..IIIIIIIIIII..', '...IIIIIIIII...', '....IIIIIII....', '...............'] },
        { k: 9, name: '여우', rows: ['OO...........OO', 'OOO.........OOO', 'OKOO.......OOKO', 'OKKOOOOOOOOOKKO', 'OOOOOOOOOOOOOOO', '.OOOOOOOOOOOOO.', '.OOKKOOOOOKKOO.', '.OOKKOOOOOKKOO.', '.CCOOOOOOOOOCC.', '.CCCCOOOOOCCCC.', '..CCCCCOCCCCC..', '...CCCCKCCCC...', '....CCCCCCC....', '......CCC......', '...............'] },
        { k: 8, name: '열기구', rows: ['.....RRRRR.....', '...RRYRRRYRR...', '..RRYYRRRYYRR..', '.RRYYRRRRRYYRR.', '.RRYYRRRRRYYRR.', '.RRYYRRRRRYYRR.', '..RRYYRRRYYRR..', '..RRYYRRRYYRR..', '...RRYRRRYRR...', '....RRRRRRR....', '.....W...W.....', '.....W...W.....', '.....LLLLL.....', '.....LLLLL.....', '.....LLLLL.....'] },
        { k: 6, name: '문어', rows: ['....VVVVVVV....', '...VVVVVVVVV...', '..VVVVVVVVVVV..', '..VVCKVVVCKVV..', '..VVCKVVVCKVV..', '..VVVVVVVVVVV..', '..VVVVPPPVVVV..', '...VVVVVVVVV...', '..VVVVVVVVVVV..', '.VV.VV.V.VV.VV.', 'VV..VV.V.VV..VV', 'V...V..V..V...V', 'V..VV..V..VV..V', '...V...V...V...', '...............'] },
      ],
    },
  ];

  function parse(rows) {
    return rows.map((r) => Array.from(r, (ch) => (ch === '.' ? 0 : 1)));
  }

  /* 그림 색. 퍼즐 그림은 글자 하나가 한 칸의 색이고 '.'은 빈칸이에요. */
  const PAL = {
    R: '#F0625A', O: '#F59A3C', Y: '#FFCB47', G: '#5DBB6A', D: '#3C9A5F', B: '#56AEE8', N: '#5E6E94', P: '#F79AB0',
    V: '#A78BE8', W: '#A9744F', K: '#4A3B36', S: '#B4BCCB', C: '#FFFFFF', T: '#3CC4B4', L: '#E2B27A', I: '#CDEBFA',
  };
  function colorsOf(rows) {
    return rows.flatMap((r) => Array.from(r, (ch) => (ch === '.' ? null : PAL[ch])));
  }

  function cluesOf(line) {
    const out = [];
    let run = 0;
    for (const v of line) {
      if (v) run++;
      else if (run) { out.push(run); run = 0; }
    }
    if (run) out.push(run);
    return out;
  }

  function allClues(grid) {
    return {
      rows: grid.map(cluesOf),
      cols: grid[0].map((_, c) => cluesOf(grid.map((r) => r[c]))),
    };
  }

  /* 한 줄 풀이. line: 0 모름 / 1 채움 / 2 빈칸. 확정되는 칸을 채워 넣고, 바뀐 게 있으면 true.
     모순이면 null. */
  function solveLine(line, clues) {
    const n = line.length, k = clues.length;
    const canFill = new Array(n).fill(false), canEmpty = new Array(n).fill(false);
    const memo = new Map();
    function rec(pos, ci) {
      if (pos >= n) return ci === k;
      const key = pos * 32 + ci;
      if (memo.has(key)) return memo.get(key);
      let ok = false;
      if (line[pos] !== 1 && rec(pos + 1, ci)) { canEmpty[pos] = true; ok = true; }
      if (ci < k) {
        const L = clues[ci];
        let fits = pos + L <= n;
        for (let i = pos; fits && i < pos + L; i++) if (line[i] === 2) fits = false;
        if (fits && pos + L < n && line[pos + L] === 1) fits = false;
        if (fits && rec(pos + L + 1, ci + 1)) {
          for (let i = pos; i < pos + L; i++) canFill[i] = true;
          if (pos + L < n) canEmpty[pos + L] = true;
          ok = true;
        }
      }
      memo.set(key, ok);
      return ok;
    }
    if (!rec(0, 0)) return null;
    let changed = false;
    for (let i = 0; i < n; i++) {
      if (line[i] !== 0) continue;
      if (canFill[i] && !canEmpty[i]) { line[i] = 1; changed = true; }
      else if (!canFill[i] && canEmpty[i]) { line[i] = 2; changed = true; }
    }
    return changed;
  }

  /* 찍기 없이 줄 단위 추리만으로 끝까지 풀리는지. */
  function solvable(grid) {
    const n = grid.length, m = grid[0].length;
    const { rows, cols } = allClues(grid);
    const st = grid.map((r) => r.map(() => 0));
    let changed = true;
    while (changed) {
      changed = false;
      for (let r = 0; r < n; r++) {
        const res = solveLine(st[r], rows[r]);
        if (res === null) return false;
        if (res) changed = true;
      }
      for (let c = 0; c < m; c++) {
        const line = st.map((row) => row[c]);
        const res = solveLine(line, cols[c]);
        if (res === null) return false;
        if (res) { changed = true; for (let r = 0; r < n; r++) st[r][c] = line[r]; }
      }
    }
    return st.every((row) => row.every((v) => v !== 0));
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* 씨앗 하나로 늘 같은 퍼즐을 만들어요. 덩어리진 무늬를 만들고, 추리만으로 풀리는 것만 골라요. */
  function generate(size, seed) {
    const rng = mulberry32(seed);
    let last = null;
    for (let attempt = 0; attempt < 400; attempt++) {
      const mirror = rng() < 0.6;
      const density = 0.5 + rng() * 0.15;
      let g = [];
      for (let r = 0; r < size; r++) {
        g.push([]);
        for (let c = 0; c < size; c++) g[r].push(rng() < density ? 1 : 0);
      }
      const sm = g.map((row, r) => row.map((v, c) => {
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < size && cc >= 0 && cc < size && g[rr][cc]) cnt++;
        }
        return cnt >= 5 || (v && cnt >= 4) ? 1 : 0;
      }));
      g = sm;
      if (mirror) for (let r = 0; r < size; r++) for (let c = 0; c < size >> 1; c++) g[r][size - 1 - c] = g[r][c];
      let filled = 0;
      for (const row of g) for (const v of row) filled += v;
      const ratio = filled / (size * size);
      if (ratio < 0.4 || ratio > 0.75) continue;
      last = g;
      if (solvable(g)) return g;
    }
    return last;
  }

  root.Nono = { PACKS, PAL, parse, colorsOf, cluesOf, allClues, solveLine, solvable, generate };
})(typeof module !== 'undefined' ? module.exports : window);
