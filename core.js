/* 콕콕 노노그램: 퍼즐 데이터, 힌트 숫자 계산, 풀이 검증기, 퍼즐 생성기.
   브라우저에서는 window.Nono, node에서는 require('./core.js').Nono 로 써요. */
(function (root) {
  /* 퍼즐마다 k는 저장 기록에 쓰는 고정 번호예요. 순서를 바꿔도 k는 그대로 둬요.
     보통·어려움은 풀이 검증기로 잰 난이도가 낮은 것부터 늘어놓았어요.
     어려움은 2026-11-25에 다시 그렸어요(꽉 찬 실루엣 → 외곽선·무늬). 예전 어려움 k 0~11은 쓰지 않아요.
     기준: 가로·세로 한 번씩 훑어 정해지는 칸이 60% 아래, 다 풀릴 때까지 3바퀴 이상(예전 평균 77%·2.4바퀴). */
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
        { k: 12, name: '기차', rows: ['.S.SS..........', 'SSS.SS.........', '..SS...........', '...KK.....RRRRR', '...KK.....R...R', '..KKKK....R.B.R', '.BBBBBBBBBR...R', '.B..Y..Y.BRRRRR', '.BBBBBBBBBR...R', 'KB.......BR...R', '.BBBBBBBBBRRRRR', '..KKK..KKK.KKK.', '..KYK..KYK.KYK.', '..KKK..KKK.KKK.', 'S.S.S.S.S.S.S.S'] },
        { k: 13, name: '케이크', rows: ['.......Y.......', '......YOY......', '.......R.......', '.......R.......', '...PPPPPPPPP...', '..P..R...R..P..', '.P.P.P.P.P.P.P.', '.L...........L.', '.L..R..R..R..L.', '.LLLLLLLLLLLLL.', '.L...........L.', '.L.P..P..P..PL.', '.L...........L.', 'SSSSSSSSSSSSSSS', '...S.......S...'] },
        { k: 14, name: '성', rows: ['...R.......R...', '..RRR.....RRR..', '.RRRRR...RRRRR.', '..S.S.....S.S..', '..S.S.S.S.S.S..', '..SKS.SSS.SKS..', '..S.SSS.SSS.S..', '..S.S.....S.S..', '..S.S.K.K.S.S..', '..SKS.....SKS..', '..S.S.NNN.S.S..', '..S.S.N.N.S.S..', '..S.S.N.N.S.S..', '.SSSSSS.SSSSSS.', 'G.G..GG.GG..G.G'] },
        { k: 15, name: '등대', rows: ['Y.Y...YYY...Y.Y', '.Y...YYYYY...Y.', '..Y...KKK...Y..', '......RRR......', '.....R.S.R.....', '.....RRRRR.....', '.....S...S.....', '.....RRRRR.....', '....S..W..S....', '....RRRRRRR....', '....S..W..S....', '...RRRRRRRRR...', '..SSS.....SSS..', 'B.B.BB.B.BB.B.B', '.B.B..B.B..B.B.'] },
        { k: 16, name: '여우', rows: ['OO...........OO', 'OOO.........OOO', 'OKOO.......OOKO', 'OKKOOOOOOOOOKKO', 'OOO.........OOO', '.O.OO.....OO.O.', '.OOKKO...OKKOO.', '.OOKKO...OKKOO.', '.KKOO.....OOKK.', '.K.KKOO.OOKK.K.', '..K..KKOKK..K..', '...K..KKK..K...', '....KK.K.KK....', '......KKK......', '...............'] },
        { k: 17, name: '돛단배', rows: ['YY.......K.K...', 'YY........K....', '.......R.......', '......RR.Y.....', '.......R.YY....', '....R..R.Y.Y...', '...R...R.Y..Y..', '..RRRRRR.YYYYY.', '.......W.......', 'NNNNNNNNNNNNNNN', '.N...........N.', '..NNNNNNNNNNN..', 'B..B..B..B..B..', '.BB.BB.BB.BB.BB', 'B..B..B..B..B..'] },
        { k: 18, name: '곰', rows: ['.WWW.......WWW.', 'W.L.W.....W.L.W', 'W.LWWWWWWWWWL.W', '.WW.........WW.', '.W...........W.', 'W..K.......K..W', 'W..K.......K..W', 'W.....LLL.....W', 'W.P..LLKLL..P.W', 'W....LLKLL....W', '.W....K.K....W.', '.W.....K.....W.', '..W.........W..', '..WW.......WW..', '.....WWWWW.....'] },
        { k: 19, name: '부엉이', rows: ['.WW.........WW.', '.W.W.......W.W.', '.W..WWWWWWW..W.', 'W..YYY...YYY..W', 'W.Y.K.Y.Y.K.Y.W', 'W..YYY.O.YYY..W', 'W......O......W', 'W..L.L.L.L.L..W', 'WW..L.L.L.L..W.', '.W.L.L.L.L.L.W.', '.W..L.L.L.L.WW.', '..W.........W..', '...WWW...WWW...', '.KKKOOKKKOOKKK.', '..........K....'] },
        { k: 20, name: '버섯 집', rows: ['..........S.S..', '......RRRR.S...', '....RR.Y..RR...', '...R..YYY...R..', '..R.Y..Y..Y..R.', '.R.YYY...YYY.R.', '.R..Y..R..Y..R.', 'RRRRRRRRRRRRRRR', '...L.......L...', '...L.B.B...L...', '...L.B.B.WWL...', '...L.....W.L...', '...L..Y..WKL...', '.G.LLLLLLLLL.G.', 'GGG.G.G.G.G.GGG'] },
        { k: 21, name: '눈사람', rows: ['.....BBBBB.....', '....B.B.B.B....', '....BB.B.BB....', '....B.B.B.B....', '.....BBBBB.....', '...RRRRRRRRR...', '.BBBBBBBBBBBB..', '.B....B.B....B.', '.B.....B.....B.', '.B....B.B....B.', '.B.....B.....B.', '..B....B.......', '..BB.......B...', '....BBBBBBB....', '...............'] },
        { k: 22, name: '문어', rows: ['....VVVVVVV....', '...V.......V...', '..V.VV...VV.V..', '..VVKKV.VKKVV..', '..VVKKV.VKKVV..', '..V.VVVVVVV.V..', '..V..VPPPV..V..', '......VVV..V...', '..VV..V.V..VV..', '.VV.VV.V.VV.VV.', 'VV..VV.V.VV..VV', 'V...V..V..V...V', 'V..VV..V..VV..V', '...V...V.V.V...', '...............'] },
        { k: 23, name: '열기구', rows: ['.....RRRRR.....', '...RR.Y.Y.RR...', '.RR..Y...Y..R..', '.R..Y..R..Y..R.', '.R..Y..R..Y..R.', '.R..Y..R..Y.RR.', '..R..Y.R.Y..R..', '...RYY.R.Y.R...', '....R.YRY.R....', '.....RRRRR.....', '......K.K......', 'SS....K.K....SS', 'SSS..WWWWW..SSS', '.....W.W.W.....', '.....WWWWW.....'] },
      ],
    },
    {
      id: 'pro', name: '도전', size: 20, desc: '20×20 · 큰 그림에 도전',
      // Grok 흑백 원화 → 20칸 → 줄 추리만으로 풀리게 고침 → Grok 컬러판에서 칸 색을 뽑았어요(tools/to_grid.py · fix_grid.mjs · color_grid.py).
      puzzles: [
        { k: 0, name: '선인장', rows: [
          '........GGGG........',
          '.......GGGGGG.......',
          '.......GGGGGG.......',
          '.......GGGGGG.......',
          '.......GGGGGG.......',
          '.......GDDDDG.......',
          '.......GDDDDG.GGG...',
          '....G..GGGGGG.GGG...',
          '...GGG.GGGGGG.GGG...',
          '...GGG.GGGGGGGGGG...',
          '...GGG.GGGGGGGGG....',
          '....GGGGGGGGGGGG....',
          '.....GGGGGGGGGGG....',
          '....RRRRRRRRRRRRR...',
          '....R...........R...',
          '....RRRRRRRRRRRR....',
          '...............R....',
          '.....RRRRRRRRRRR....',
          '.....R..............',
          '.....RRRRRRRRRR.....',
        ] },
        { k: 1, name: '달팽이', rows: [
          '....................',
          '.........OOOOOO.....',
          '........OOOOOOOOO...',
          '.......OOOOOOOOOOO..',
          '......OOOOOOOOOOOOO.',
          '.....OOOOOOOOOOOOOO.',
          '.....OOOOOO..OO.OOOO',
          '.....OOOOOOOO.O.OOOO',
          '.....OOOO.OOO...OOOO',
          'D..D.OOOO.OOOOOOOOOO',
          '.G.G.OOOOO.OOOOOOOOO',
          '.G.G.OOOOO.OOOOOOOOO',
          '.GGG..OOOO.OOOOOOOO.',
          '.GGGGG.....OOOOOOOO.',
          '..GKGGG...OOOOOOOO..',
          '.GGGGGGGWOOOOOOOO...',
          '.GGGGGGGGGLOOOWL....',
          '..GGGGGGGGGGGGGGG...',
          '...GGGGGGGGGGGGGG...',
          '....................',
        ] },
        { k: 2, name: '찻주전자', rows: [
          '.........NN.........',
          '.........NU.........',
          '........UUU.........',
          '.......UUUUUU.......',
          '......UUUUUUUU......',
          '........UUU.........',
          '.UU..UUUUUUUUUUUUUU.',
          '.UUUUUUUUUUUUUUU..UU',
          '..UUUU..UUUUUUUU...U',
          '..UUUU..UUU..UUU...U',
          '..UUUUUUUUU...UUU..U',
          '..UUUUUUUUUUUUUUU..U',
          '...UUU..UUUUUUUUU.U.',
          '...UUU...UUUUUUUUUU.',
          '...UUU...UUUUUUUUU..',
          '....UUUUUUUU..UUU...',
          '....UUUUUUUUU.UU....',
          '.....UUUUUUUUUU.....',
          '......UUUUUUUUU.....',
          '.......UUUUUU.......',
        ] },
        { k: 3, name: '고래', rows: [
          '.....B.B............',
          '.....BBBBB..........',
          '....BBBBBB..........',
          '......BB............',
          '.....UBB............',
          '...UUUUUUUU.........',
          '..UUUUUUUUUU..UU..UU',
          '.UUUUUUUUUUUUU.UUUUU',
          '.UU...UUUUUUUUU.UUU.',
          'UUUU..UUUUUUUUUUUU..',
          'UUUU.UUUUUUUUUUUUU..',
          'UUUUU.UUUUUUUUUUUU..',
          '.....UUUUUUUUUU..UU.',
          'UUUUUUUUUUUUU...UUU.',
          '.U.............UUUU.',
          '.UU.....UU....UU..UU',
          '.UUU....UUU.UUUU....',
          '..UUUUUUUUUUUUU.....',
          '...UUUUUUUUUUU......',
          '.....UUUUU.UU.......',
        ] },
        { k: 4, name: '토끼', rows: [
          '.....LLL.LLL........',
          '.....LLL.LWL........',
          '....LLL.LPPL........',
          '....LLLLWPPL........',
          '....LLLLPPL.........',
          '....LLLLPP..........',
          '....LLLLPL..........',
          '..LLLLLLL...........',
          '..LWWLLLL...........',
          '.LL..WLLLLLL........',
          'LLLWWLLLLLLLLL......',
          'LLLLLLLLLLLLLLL.....',
          '.LLLLLLLLLLLLLLL....',
          '..LLLLLLL.LLLLLL....',
          '...LLLL.LL.LLLLLLLL.',
          '...LLL.LL..LLLLLLLLL',
          '...LL.LL..LLLLLLLLLL',
          '....LLLL...LLLLLLLL.',
          '...LLLL...LLLLLL....',
          '...LLL...LLLLLL.....',
        ] },
        { k: 5, name: '로켓', rows: [
          '.........RR.........',
          '........RRRR........',
          '........RRRR........',
          '.......RRRRRR.......',
          '.......RRRRRR.......',
          '......RRR..RRR......',
          '......RR....RR......',
          '......RR....RR......',
          '......RRRRRRRR......',
          '.....RRRRRRRRRR.....',
          '....RRRRRRRRRRRR....',
          '...RRR........RRR...',
          '..RRRRRRRRRRRRRRRR..',
          '.RRRRRRRRRRRRRRRRRR.',
          '.RRRRRRRRRRRRRRRRRR.',
          '.RRRR..........RRRR.',
          '.RRR...O....O...RRR.',
          '.RR...OOY..YOO...RR.',
          '.......OOYYOO.......',
          '.......O.OO.........',
        ] },
        { k: 6, name: '달', rows: [
          '.......YYYYYY.......',
          '.....YYYYYYYYYY.....',
          '...YYYYYYYYY........',
          '..YYYYYYYYY.....YY..',
          '..YYYYYYYY..........',
          '.YYYYYYYYY..........',
          '.YYYYYYYY...........',
          'YYYYYYYYY...........',
          'YYYOYYYOY.........YY',
          'YYYYYYYYY.........Y.',
          'YYYYYYYYY...........',
          'YYYYYYYYYY..........',
          'YYYYYYYYYY..........',
          '.YYYYYYYYYY......Y..',
          '.YYYYYYYYYYY.....Y..',
          '..YYYYYYYYYYY.......',
          '...YYYYYYYYYYYYYYY..',
          '....YYYYYYYYYYYYY...',
          '.....YYYYYYYYYYY....',
          '........YYYYYY......',
        ] },
        { k: 7, name: '자전거', rows: [
          '....................',
          '....................',
          '..............K.....',
          '......KKK....K......',
          '......KK....RR......',
          '.......K.RRRRRR.....',
          '.......RR...RR......',
          '..KKKKHR....RHRKKK..',
          '.K....R.R..R.KR...K.',
          'K....RHKR.R.KK.H...K',
          'K...HR.K.R..K..R...K',
          'K..KH..K.H..K..RK..K',
          'KKKKKRRRHKK.KKKHKKKK',
          'K......K.K..K......K',
          'K.....KK....K......K',
          '.K....K......K....K.',
          '.KKKKKK.....KKKKKKK.',
          '...KK..........KK...',
          '....................',
          '....................',
        ] },
      ],
    },
    {
      id: 'expert', name: '고수', size: 30, desc: '30×30 · 고수의 큰 그림',
      // Grok 흑백 원화 → 30칸 → 줄 추리만으로 풀리게 고침 → Grok 컬러판에서 칸 색을 뽑았어요(tools/to_grid.py · fix_grid.mjs · color_grid.py).
      puzzles: [
        { k: 0, name: '기타', rows: [
          '.......HHHHHHH................',
          '.......HHHHHH.................',
          '.....HHHHHHHHH................',
          '.......HHHHHH.................',
          '.....HHHHHHHHH................',
          '........HHHH..................',
          '........HHHH..................',
          '........HHH............NN.....',
          '........HHHH...........NNN....',
          '........HHH............NNNN...',
          '........HHHH...........NNNNN..',
          '........H.HH...........NNNNNN.',
          '........H.H............NN..NNN',
          '........HHHH...........NN...NN',
          '........HHH............NN....N',
          '....WWWWH.HHWWWW.......NN....N',
          '..WWWWWWH.HHWWWWW......NN....N',
          '..WWWWWWHHHHWWWWWW.....NN.....',
          '.WWWWWWWWHHWWWWWWWW....NN.....',
          '.WWWWWWWW..WWWWWWWW....NN.....',
          'WWWWWWWW....WWWWWWW....NN.....',
          'WWWWWWW......WWWWWW....NN.....',
          'WWWWWWW......WWWWWW....NN.....',
          'WWWWWWWW....WWWWWW.NNNNNN.....',
          'WWWWWWWWW..WWWWWW.NNNNNNN.....',
          '.WWWWWWWWWWWWWWW.NNNNNNNN.....',
          '.WWWWWWWWWWWWWWW.NNNNNNN......',
          '..WWWWWWWWWWWWWW.NNNNNNN......',
          '...WWWWWWWWWWWWW.NNNNNN.......',
          '.....WWWWWWWWWW....NN.........',
        ] },
        { k: 1, name: '풍차', rows: [
          '..............................',
          '.......HHH..........HHH.......',
          '......HH..H........HH.HH......',
          '......H..HHH....K..HH..HH.....',
          '.....HH....HH...........H.....',
          '..........HHH....H....HH......',
          '........HHHHHH..HH..HHH.......',
          '.........HHHH....HH.HH.H......',
          '..........HH....H.HH..........',
          '..............HHH.............',
          '..............HHH.............',
          '.........HHH.HHHH..H..........',
          '........HH.HHRRRRHHHH.........',
          '.......H.H..HRRRRHHHHHH.......',
          '.....HHH..HHHRRRRHHHHHHH......',
          '.....H..H.HHRRRRRRHHHHHHH.....',
          '.....HH.HHH.RRRRRR.HHHHHH.....',
          '......HHHH..RRRRRR..HHHH......',
          '.......HH...RRRRRR...HH.......',
          '............RRRRRR...H........',
          '............RR..RRR...........',
          '............RR..RRR...........',
          '........GGGWRR..RRRGG.........',
          '.......GGGGWRRHHRRRGGGG.......',
          '.....GGGGGGGGGGGGGGGGGGGG.....',
          '....GGGGGGGGGGGGGGGGGGGGGG....',
          '..GGGGGGGGGGGGGGGGGGGGGGGGGG..',
          '..GGGGGGGGGGGGGGGGGGG..GGGGG..',
          '.GGGGGG..GGGGGGGGGGGGG..GGGGG.',
          'GGGGGGGGGGGGGGGGGGGGGGG..GGGGG',
        ] },
        { k: 2, name: '잠자는 고양이', rows: [
          '............MM................',
          '...........M.P................',
          '........MMMM..MSSSSSS.........',
          '......MMMMM...MSSSSSSSS.......',
          'MMMMMMMMMMMMM.MSSSSSSSSSS.....',
          '....MMMMMMMMMMMMSSSSSSSSSS....',
          '....MMMMMMMMMMMMSSSSSSSSSSS...',
          '..PPMMM..MMMMMM..SSSSSSSSSSS..',
          '..MMMMM...M......SSSSMMMMSSS..',
          '...MMMM.........SSSMMMMMMMMSS.',
          '...MM...........SSMM.....MMMS.',
          '...M..KK.......SSSSSSS.....MS.',
          '..SM.....P...SSSSMMMMMSS....M.',
          '..SSSMM..P....SMMMMMMMMMS....S',
          '.SSS....SS....MMMMMMMMMMMSS..S',
          '.SSS..........M.....MMMMMMMS.S',
          '.SSSS...S....SM.......MMMMMSSS',
          '.SSSSSSSSS..SMMMMM.....MMMMMS.',
          '.SSSSSSSSSSSSMMMMMMM.....MMMM.',
          '.SS..SSSSSSM...MMMMMMM....MMM.',
          '.SSSSSSSSSMM.....MMMMMM....MM.',
          '.SSSSSSSSMMMMM....MMMMMM...M..',
          '..SSSSSS..MMMMM....MMMMMM.MM..',
          '..SSSSSS...MMMMM.....MMMMMM...',
          '...SSSSS....MMMMM....MMMMMM...',
          '....SSSSS...MMMMMM....MMMM....',
          '.....SSSSS...MMMMMM...MMM.....',
          '.......SSS....MMMMMM.MM.......',
          '.........SS....MMMMMMM........',
          '............SSSMMMM...........',
        ] },
        { k: 3, name: '공룡', rows: [
          '..................GD....DGD...',
          '...............DDGGDG..GG.....',
          '..............DDDDGGGDGG......',
          '..................DGGGGGGGGGG.',
          '......GG........GGGGGGGGGGGGG.',
          '.....GGDG......GGDGGGGGGGG...G',
          '....GGGGGGG...GGD..GGGGGGGG...',
          '...GGGGGGGG...GG..GGG.DH.GGG..',
          '...GG.........G...GG...H..GG..',
          '...GG.............GG...H...G..',
          '...G..............G....HH.....',
          '...G.G.................HH.....',
          '...G.G...................H....',
          '...G.G.....GGGGGGG......HH....',
          '...G.GG..GGGGGGGGGGG.....H....',
          '...G..GGGGGGGGGGGGGGG...HH....',
          '......GGGGGGGGGGGGGGGG..H.....',
          '....G..GGGGGGGGGGGGGGGG.HHH...',
          '........GGGGGGGGGGGGGGGGH.H...',
          '........GGGGGGGGGGGGGGGGGHH...',
          '......G..GGGGGGGGGGGGGGGGG....',
          '......GGG.GGG....GGGG...GGG...',
          '......GGG.GGG..GGGGGG....GGG..',
          '..D...GGG.GGG..GG..GG.....GG..',
          '.DDD..GG..GGG..GG...GG....GG..',
          '..DDD.GG..GGG..GG..GGG.DD.GG..',
          '.DDDD.....GG.D.....GG.DDDGG.D.',
          '.DDDDD..D....DD..DD...DGGG.DD.',
          '.DD.DDDDDD..DDDD.DDD......DDD.',
          '.DD..DDDDD..DDDD.DDDD....DDDD.',
        ] },
        { k: 4, name: '거북이', rows: [
          '..............................',
          '.........HHHHHHH..............',
          '.......HHHH...HHHH............',
          '......HHHHH....HHHH...........',
          '..K..H...H.....HHHHH..........',
          '....HH....H....H....H.........',
          '...HH.....HH..HH....HH........',
          '...HH.....HHHHHH....HH........',
          '...HHH...HHHHHHH....HHH.......',
          '..HHHHHHHHHHHHHHHHHHHHH.......',
          '..HH...HHH...HHH..HHHHH.......',
          '..H.....H.....H....HHHH.GGGG..',
          '..H.....H.....HH....HH.GGGGGG.',
          '..H.....H.....H.....H.GGG...GG',
          '..HH...HHH...HHH...HH.GGG.KDGG',
          '..HHHHHH.HHHHHHHHHHHH.GGG..GGG',
          '.HHHHHH...HHHHHHHHHH.GGGGGGGGG',
          '.HHHHHH....HHHHHHHH.GGGGGGGDG.',
          '..HHHHH...HHHHHHHH..GGGGGGGG..',
          '....HHHH..HHHHHH....GGGG......',
          '.GG....HHHHHH........G.G......',
          '.G.GGG...........GG...GG......',
          '...GGG.G........GGGG.GGGG.....',
          '..GGGG..GGGGGGGGGGGG.GGGG.....',
          '.GGGGG..GGG.....GGGG..GGGG....',
          '.GGGG..GGGG.....GGG...G.GGG...',
          '.GGGGG..GGGG...GGGGG...GGGGG..',
          '..G.GG.GGGG....GGGGGG..G.GG...',
          '................GG.GG.........',
          '..............................',
        ] },
      ],
    },
    {
      id: 'master', name: '마스터', size: 55, desc: '55×55 · 끝판왕 그림',
      // Grok 흑백 원화 → 55칸 → 줄 추리만으로 풀리게 고침 → Grok 컬러판에서 칸 색을 뽑았어요(tools/to_grid.py · fix_grid.mjs · color_grid.py).
      puzzles: [
        { k: 0, name: '창가 고양이', rows: [
          '..UUUUUUUUUUUUUUU.....................UUUUUUUUUUUUUUU..',
          '..UUUUUUUUUUUUUUU.....................UUUUUUUUUUUUUUU..',
          '..UUUUUUUUUUUUUU.NNNNNNNNNNNNNNNNNNNN.UUUUUUUUUUUUUUU..',
          '..UUUUUUUUUUUUUU.NNNNNNNNNNNNNNNNNNNNN.UUUUUUUUUUUUUU..',
          '..UUUUUUUUUUUUUU.NNNNKNNNNNNNNNNNKNNNN.UUUUUUUUUUUUUU..',
          '..UUUUUUUUUUUUUU.NNN..NNNNNNNNNNK.KNNN.UUUUUUUUUUUUUU..',
          '..UUUUUU.UUUUUUU.NNNNKNNNNNNNNNNN.NNNN.UUUUUUUUUUUUUU..',
          '..UUUUUU.UUUUUU.NNNNNNNNNKHKNNNNNNNNNNNUUUUUUUUUUUUUU..',
          '..UUUUUU.UUUUUU.NNNNNNNN.....KNNNNNNNNN.UUU.UUU.UUUUU..',
          '..UUUUU.UUUUUUU.NNNNNNN.......NNNNNNNNN.UUU.UUU.UUUUU..',
          '..UUUUU.UUU.UUU.NNNNNNN.......KNNNNNNNN.UUU.UUUU.UUUU..',
          '..UUUUU.UUU.UU.NNNNNNNM.......WNNNNNNNNN.UUU.UUU.UUUU..',
          '..UUUU..UU.UUU.NNNKNNNN.......KNNNNNNNNN.UUU.UUU.UUUU..',
          '..UUUU.UUU.UU..NNN..NNN.......NNNNNKNNNN..UU..UU.UUUU..',
          '..UUUU.UU..UU..NNNKNNNNN.....KNNNNW.NNNN..UUU.UUU.UUU..',
          '..UUUU.UU.UU...NNNNNNNNNNKWKNNNNN....NNN...UU..UU.UUU..',
          '..UUUUUU..UU...NNNNNNNNNNNNNNNNNNNW.NNNN...UUU.UU.UUU..',
          '..UUUUUU.UU....NNNNNNNNNNNNNNNNNNNNKNNNN....UU..UUUUU..',
          '..UUUUU..UU....NNNNNNNNNNNNNNNNNNNNNNNNN....UUU.UUUUU..',
          '..UUUUU.UU...KKNNN.NNNN.NNNNNNNNNNNNNNNN.....UUU.UUUU..',
          '..UUUU.UU....KK.MKKNNNK.KNNNNNNNNNNNNN........UU.UUUU..',
          '..UUUUUUU....KKKKK.NNNNKNNNNNNNNNNNNN.RR......UUU.UUU..',
          '..UUUUUU.....KKKKKKNNNNNNNNNNNNNNNNNRRRRRRR....UUUUUU..',
          '..UUUUU.....KKKKKKKKNNNNNNNNNNNNNNNNRRR.RR......UUUUU..',
          '..UUUU......KKKKKKKKNNNNNNNNNNNNNNNN.RR.RRR......UUUU..',
          '..UUUU......KKKKKKK.NNNNNNNNNNNNNNNNRRRRRRR.......UUU..',
          '..UUUU......KKKKKK.NNNNNNNNNNNNNNN.....RH..DDD...UUUU..',
          '..UUUU.....KKKKKKK.NNNNNNNNNNNNNN.DDDD..D.DDDD...UUUU..',
          '..UUUUU...KKKKKKKKK...............DDDDD.D.DDD....UUUUU.',
          '..UUUUU..KKKKKKKKKK................DDDD.D.DD.....U.UUU.',
          '.UUUUUU.KKKKKKKKKKK..................DD.DD.......U.UUU.',
          '.UUUU.U.KKKKKKKKKK.................DDD.DD.DDDD..UU.UUU.',
          '.UUUU.UKKKKKKKKKKK................DDDDD.D.DDD...UU.UUU.',
          '.UUUU..KKKKKKKKKKK..................D..DDD......UU.UUU.',
          '.UUUU..KKKKKKKKKKK..................RRRDDRRRR...UU.UUU.',
          '.UUUU..KKKKKKKKKKK.................RRRRRHRRRR...UU.UUU.',
          '.UUUU..KKKKKKKKKK..................RRRRRRRRRR...UU.UUU.',
          '.UUUU..KKKKKKKKKK..................RRRRRRRRRR..UUUUUUUU',
          '.UUUU..KKKKKKKKKK...................RRRRRRRRR..UUUUUUUU',
          '.UUUU..KKKKKKKKKK...................RRRRRRRR...UUUUUUUU',
          '.UUUUU.KKKKKKKKKKKK.................RRRRRRRR...UUUUUUUU',
          '.UUUU.KKKKKKKKKKKKKHHHHHHHHHHHHHHHHHRRRRRRRR.HHUUUUUUUU',
          '.UU...KKKKKKKKKKK....................RRRRRRR......UUUUU',
          '.......KKKKKKKKKK......................RRR.............',
          'HHHHHHHHHHKKKKHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
          'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
          'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
          '..H.................................................H..',
          '..H.................................................H..',
          '..H.................................................H..',
          '..H.................................................H..',
          '..H.................................................H..',
          '..H.................................................H..',
          '..H.................................................H..',
          '..HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH..',
        ] },
        { k: 1, name: '부엉이', rows: [
          '.HHHHHHHH....DDDDD.HHHHHHHHHHHHHHHHHHHHHH....HHH..HHHH.',
          '.HHHHHHHH..DDDDDDD.HHHHHHHHHHHHHHHHHHHHHHH...HHHH.HHHH.',
          '.HHH.HHHH.DDDDDDDDHHHHHH.........HHHHHHHHH...HHHH.HHHH.',
          '.HHH.HHHH.DDDDDDD.HHH................HHHHHH..HHHH.HHHH.',
          '.HHH.HHHH.DDDDDDD.............DDDD.....HHHHHHHHHH.HHHH.',
          '.HHHHHHHH.DDDDDDDD............DDDDDD....HHHHHHHHH.HHHH.',
          '.HHHHHHHH.DDDDDDDD............DD..DDDD....HHHHHHH.HHHH.',
          '.HHHHHHHH.DDDDDDD..DD.........DDDDDDDDDD...HHHHHH.HHHH.',
          '.HHHHHHHH..DDDDD..DDDD.........DDDDDD..DD...HHHHH..HHH.',
          '.HHH.HHHH..HH...DDDDDD..........DDDDD..DDD...HHHH..HHH.',
          '.HHH.HHHH.HH...DDD..DD..........DDDDDDDDDD...HHHH.HHHH.',
          '.HHHHHHHHHHH..DDDD..DD...........DDD..DDDDD...HHH..HHH.',
          '.HHH.HHHHHH...DDDDDDD..............DDDD..DD...DDDDDDKH.',
          '.HHH.HHHHHH..DDDDDDDD................DDDDD..DDDDDDDDD..',
          '.HHHHHHHHH...DD..DDD.......................DDDDDDDDDDD.',
          '.HHHH.HHHH...DD..DD........................DDDDDDDDDDD.',
          '.HHHH.HHHH..DDDDDDD..HHHHHHHH..............DDDDDDDDDDDD',
          '.HHHH.HHHH..DDDDD....HHHHHHHHHHHHH..........DDDDDDDDDDD',
          '.HHHH.HHHH..DD.......HHHHHHHHHHHHH..........DDDDDDD..DD',
          '.HHHH.HHHH..D........HH...HHHHHHHH....DDD....DDDDDDDD..',
          '.HHHH.HHHH..........HH..H..HH...HH.....DDD....DDDDDDDD.',
          '.HHHH.HHHH..........HH..KK.WH.K..H.....DDDD....HDDDDDH.',
          '.HHHH.HHHH..........HHO....YO.K..H....DDD.DD...HHH..HH.',
          '.HHKDDDDDDD.........HHHO..Y.....HH....DD..DD...HHH.HHH.',
          '...DDDDDDDDD........HHHHHHH.OHHHHH....DD.DDD...HHH.HHH.',
          '..DDDDDDDDDD.......HHHHHHHHOHHHHHH....DD..DD...HHH.HHH.',
          '.DDDDDDDDDDD......HHHHHHHHHHHHHHHH....DDD.DD...HHH.HHH.',
          'DDDDDDDDDDD.......HHHHHHHHHHHHHHHHH....DDD.....HHH..HH.',
          'DDDDDDDDDDD......HHHHHH.HHHHHHHHHHH.....DDD...HHHH..HHH',
          'DDDDDDDDDDD......HHHHHH.HLHH..H.HHH.....DD....HHHH..HHH',
          'DDDDDDDDDD.......HHHHHH.HW......HHH.....D....HHHHH..HHH',
          'D.DDDDDDDD.D.....HHHHH.WHH.LHW.HHHH............HHH..HHH',
          '..DDDDDDKH.DD....HHHHH.H.HHHHHHHHHH......DDDDDDDKH..HHH',
          '.DD....HHH.DD....HHHHHWH.WHH.HWHHHH......DDDDDDDDD..HHH',
          '.HHHHH.HHH.DDD...HHHHHHHWLHH..WHHH.......DDDDDDDDDD.HHH',
          '.HHHHHHHHH.DDDD..HHHHHWWHHHHWWHHHH.......DDDDDDDDDD.HHH',
          '.HHHHHHHHH.DDDDD.HHHHHLHHHWWHHHHHH.......DDDDDDDDDDDHHH',
          '.HHH.HHHHH.DDDDD.HHHHWWHHWWHHHHHH......DD.DDDDDDDDDDHHH',
          '.HHH.HHHHH.DDDDD.HHHHHHHHHHHHHHHH.....DDD.DDDDDDDDDDHHH',
          '.HHH.HHHHH...DDD.HHHHHHHHHHHHHHH....DDDDDD.DDDDDD.DDHHH',
          '.HHH.HHHHHHHHH....HHHHH...HHW..H...DDDDDD...DDDDD.DDHHH',
          '.HHH.HHHHHHHHHHHHHHHHHHW..HHH.OOHHHHHH...HHHHDDDDD...HH',
          '.HHH.HHHHHHHHHHHHHHHHHHHOWHHHOHWHHHHHHHHHHH..DDDDDDDDD.',
          'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH..HH.DDDDDDDDDDDDD',
          'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH.DDDDDDDDDDDDD',
          '.HHH.HHHHHHHH.......HHHHHHH........HHHHHH.DDDDDDDDDDDDD',
          '.HHH.HHHHHHH..DDD...HHHHHHH.DDDDDD...DDDD.DDDD..DDDDDDD',
          '.HHH..HHHHH..DDDD...HHHHHH..DDDDDDD.DDDD...DDDDDDDDDDDD',
          '.HHH..HHHHH..DDDDD...HHHHH.DDDDDDD.DDDDDDD.DDDDDD.D.DDD',
          '.HHH.HHHHHH...DDDDDD.......DDDDDDD.DDDDDDD..DDDDD.D.DDD',
          '.HHH.HHHHHH.DDDDDDDD.......DDDDDDD.DDDDDDDD.DDDDDD..DDD',
          'HHHH.HHHHHHH.DDDDDDDDDD...DDDDDDDDDDDDDDDD..DDDDDDD.DDD',
          'HHHH.HHHHHHH.DDDDDDDDDDDD..DDDDDDD.DDDDDDD..DD...DDDDDD',
          'HHHH.HHHHHHH.DDDDDDDDDDDDDD..DDDDD.DDDDDD...DDDDDDDDDDD',
          'HHHH.HHHHHHH.DDDDDDDDDDDDDDD.DDDDD.DDDD....DDDDDDDDDDDD',
        ] },
        { k: 2, name: '오두막', rows: [
          '.......................................................',
          '.........UUUU...............................UUUU.......',
          '........UUUUU...........................UU.UUUUUU......',
          '.....UUUUUUUUU.UU......................UUUUUUUUUU......',
          '....UUUUUUUUUUUUUU.....................UU.UUUUUUUUU....',
          '....UU.UUUUUUUU.UU............UU....UUUUUUUUUUUUUUUU...',
          '....UUUUUUUUUUUUUUUUU........UUUU...UUUUUUUUUUUUU.UUU..',
          '..UUUUUUUUUUUUUUUUUUU.......UUUUUU......UUUUUUUUUUUU...',
          '.UUUUUUUUUUUUUUUUUUUUUUU...UUUUUUUUU....UUUUUUUUUUUUUU.',
          '.UUUUUUUUUUUUUU.UUUUUUUU...UUUUUUUU.....UU.UUUUUUUUUUU.',
          '..UUUUUU.UUUUUUUUU.................SS...UUUUUUUUUUU.UU.',
          '.......UUUU...UUU.................SSSS...UUUU....UUUUU.',
          '.................................SSSSS.................',
          '....D.............MM............SSSSS.........DD.......',
          '....DD......MM...MM.M...........SSSS.....M....DD.......',
          '...DDD....MM..M.MM...MMM........SS......MMM..DDDD..D...',
          '...DDD.........MMMMM.MMMM.......S......M..MM..DD...DD..',
          '...DDDD.M.MM.M...MMM.....M.M...HHH..MMM..M..MDDDD..DD..',
          '..DDDD...MMM.MM...MM.M.M.MM.M..HH..MM....MM..DDDD..DD..',
          '...DDDD.MM.MMM.MM..MMMMMMM...M.HH.MM...M.MMM.DDDD.DDD..',
          '..DDDDDDMM.DMM..MMM.MMMMM.HHH.MKHKM...MMMDDMMDDDDDDDDD.',
          '.DDDD.D.M...M.D...MM.MM..HHHHH.HH..M.MMMM..MDDDDD.D.DD.',
          '..DDDDDDMD..M.D..DMMMM..HH.HHHH.KKMMMMDMM..MMDDDDDD..D.',
          '..DDDDDD....DDD..D.MM..HHHHHHHHH..MMMDDMM..MDDDDDD...D.',
          '.DDDDDD.D...MDDD.DDM..HHHHHHHHHHH..MMDD.....DDDD.D...DD',
          '..DDDDDD..H..DDD.DD..HHHHHHHHHHHHH..MDD.D....DDDD....DD',
          '.DDDDDDDD....DDDDD..HH..HHHHHHHHHHH..DDD...GDDDDDD.H.DD',
          'DDDDDDDDD.H..DDDD..HHHHHHHHHHHHHHHHH..D....DDDDDD..H..D',
          '..D.DDDD..H...DDD.HHHHHHHHHHHHHHHHHHHKDD.H.DDDDDD..D..D',
          '.DDDDDDDD.D..DDDDD.H..H....H.H...HHH.DD.....DDDDD..H..D',
          'DDDDDDDDDDKH..DD.DDHHHH....HH.KKKHHHDDDD.H.DDDDDD..H...',
          '..DDDDDDD.H..DDDDDDHHHH....HH.K.KHHHDDD...DDDDDD...H..D',
          '.DDDDDDDDDH...DDDDDH..H....H..KKKH.HDDD....DDDDDD..H...',
          '.DDDDD.D..K..DDDDDDHHHH....HHH...HHHDDD....DDDDD...H..D',
          '....DDDDDDH.DDDDDD.HHHH....HHHHHHHHH.DDDDDHDD.D.G..H...',
          '.DD.DD.DD.KKDD.....H..H....HHHHHHHHH..DDDHHDD.DDDD.H..D',
          '.DD.DDDDDDDDD...HHHHHHHHHHHHHHHHHHHHHH..GDDDD.DD.D.HDDD',
          '.DDDDDDDDD....HHHHHHHHHH...HHHHHHHHHHHHH....DDDDDDDH..D',
          '.DDDDDDDD......HHHHHHHH...HHHHHHHHHHHHH.....DDDD.DDDDDD',
          '.DDD..DDDD..........HHH....HHHHHHH.........DDDDDDDDDDDD',
          '....HH.....H........DHHH.....HHHH......DD....DDDD..DDDD',
          '....HH....HH.....HH..HHHH.....HHHH..H.....HH.....HH..D.',
          '.HHHHHHHHHHHHHHHHHHH...HHH.....HHH.HHHHHWDHH.....HH....',
          '....HH....HH.....HHH.GHHHH.....HHH.HHHHHHHHHHHHHHHHHHHH',
          '.HHHHH....HH.....HH.HHHHH......HHH..H.....HH.....HH....',
          '.HHHHHHHHHHHHHHHHHHH.HHH.......HHH.HHHHHHHHH.....HH....',
          '....HH....HH.....HH.HHH.......WHHH..HHHHHHHHHHHHHHHHHHH',
          '..DDKHDD.DKHD...DHH.HH........HHHH..H.D...HH.....HH....',
          '.DDDDDDDDDDDDDDDDDDDKH........HHHH.DHKDD.DKHD..DDHKD...',
          '.DDDDDDDD.DDDDDDKK.KK.........HHHHDDDDDDDDDDDD.DDDDDDD.',
          '.DDDDD.DDDD...H.HHHHH..........H..HH.HH..DDDD.DDDDDDDD.',
          '.DDDDDDDDDD..H..HHHH............HHH..HHHD....DDDDDD.DD.',
          '.DDDDDDDDD.DHHHHHKKH.............HHHHHHHHHH.DDDDDDDDDDD',
          '.DDDDDDDD.GHHHHHHHHH..............HKHHHHHKHH.DDDDDDDDD.',
          '.......................................................',
        ] },
        { k: 3, name: '범선', rows: [
          '.......................................................',
          '..............................SSSS.....................',
          '.............................SSSSSS....................',
          '.....MMM.....MMM..........SSSSSSSSSSSS.................',
          '......MMM...MM...........SSSSSSSSSSSSSS................',
          '........MM.MM.........SSSSSSSSSSSSSSSSSSS..............',
          '........MMMMM.........SSSSSSSSSSSSSSSSSSSS.............',
          '........MMMM.................SSSSSS.SSSSS..............',
          '.......MMMMM...........................................',
          '..........................H............................',
          '..........................H.................MM...MMM...',
          '.........................HHH.................MM..M.....',
          '.......................LLLL...................MMMM.....',
          '..................H.....LLLLLL.....H..........MMMM.....',
          '..................HH....LLLLLLL...HHH..................',
          '................LLLL...LLLLLLLL.LLLL...................',
          '................LLLLL..LLLLLLLL..LLLLL.................',
          '................LLLLLL.LLLLLLLLL.LLLLLL................',
          '................LLLLLW....H...LL.LLLLLL................',
          '...............LLLLLLLWWWWHH....LLLLLLLL...............',
          '...............LL.WLLLLLLLLLW...L..W.LLL...............',
          '..............H...H..L.LLLLLL..HHH.H...L...............',
          '..............LLLWWHH..LLLLLLL..LLLLWWWH...............',
          '...............LLLLL...LLLLLLL..LLLLLLLL...............',
          '...............LLLLL...LLLLLLLL.LLLLLLLLL..............',
          '...............LLLLLL..LLLLLLLL..LLLL.LLLL.............',
          '...............LLLLLL..LLLLLLLL..LLLL.LLLLL............',
          '...............LLLLLL..LLLLLLLL..LLLL.LLLLLL...........',
          '.......UUU.....LLLLLLL.LLLLLLLL..LLLL.LLLLLL...........',
          '......UUUUU...LLLLLLLL.LLLLLLLLLLLLLLLLL...HH..........',
          '.....UUU......LLLLLLLLLLLLLLLLLLLLLLLLL................',
          '....UUU..UU...LLLLLLLLLLLLLLLLLLLLLW....HH.....UUU.....',
          '...UUUUUUUUU.LL...WWLLLL..HH..LLL..H..HHH.....UUUUU....',
          '...UUUUUU....HH...H..L....HH......HHHHHHH........UUU...',
          '..UU...UUUU......HHHHHH...HH...HHHHHHHHHH...UUU..UUU...',
          '..UU.U.UUUUU......HH...H..HH.HHHHH....HH....UUUU.UUU...',
          '..UU.UUUU......HHHHHHH.HHHHHHHH...HHHHH.......UUUUUUUU.',
          '.UU..UUUU...U..HHHHHHHHHHH.....HHHHHHHH...UU..UUU..UUU.',
          'UU..UUUUU.UUU..............HHHHHHHHHHH.....UUUUUU...UU.',
          'U..UUU.UU.UU....HHHHHHHHHHHHHHHH..HHHH.....UUUUUUU..U..',
          '..UUUU..U..UU...HHHHHHHHHHH.HH....HHHH....UU..UUUU..UU.',
          'UUUUU..U...UUUU..HH..HHHH...H...U...H..UUUUU.UUUUU..UUU',
          'UUUU..UU..U..UUUUN.............UU...HNUUUUUUUUUUUUU.UUU',
          'UUU....UU.UU..UU..UUU...UU..UU.UUU...UUUUUUUUUU.UUU...U',
          'UU..U..UUUUUUU..UUUU..UUU..UUUUUUU.U..UUUUUUUU..UUUUU..',
          '..UUU...UUUUUUUU..UUUUUUUUUUUUUUUUUUU...UUUUU....UUUUUU',
          'UUUUU.UUUUUUUUUUUUUUUUUUUU..UUUU.UUUUUUU...U..UU..UUUUU',
          'UUUUUUUUUUUUU....UUUUUUU..U.UUU...UUUUUUUU...UUUU...UUU',
          'UUUUUUU.UUU...U...UUUU..UUUUUU.....UUUUUU..UUUUUUUU...U',
          'UUUUUU.....UUUUU.U..UUUUUUUUUUUU.UU...UUUUUUUUU..UUUUUU',
          'UUUU...U...UUUUUUUUUUUUU..UUUUUUUUUUU...UUUUU..U..UUUUU',
          'UU..UUUUU....UUUUUUUUU.....UUUUUUUU...U...UUUUUUUU..UUU',
          'UUUUUUUUUU.UU..UUUUUUBUUUU....UUUUUUUUUUU...UUUUUUUUUUU',
          'UUUUUUUUUUUUUUUU..UUUUUUUUUUUU...UUUUUUUUUUU...UUUUUUUU',
          '.......................................................',
        ] },
        { k: 4, name: '꽃병', rows: [
          '.......................................................',
          '.........................Y...Y....K....................',
          '......................Y.YYY.O..Y.......................',
          '......................Y..YY.YY.OY.Y....................',
          '...................YYYY..Y........Y....................',
          '...................Y......OWW....YY....................',
          '........................OHHHHHW........................',
          '..................YYY...HHHHHHHO..Y.Y..................',
          '..................Y....WHHHHHHHH.YYO...................',
          '.............YY..YYY...HHHHHHHHH.......................',
          '.........Y..Y.Y..YY.Y..HHHHHHHHH....YY.................',
          '.........Y..Y....YY....WHHHHHHHH..YOO..YYY.............',
          '........YY..Y....YO.....HHHHHHHO...YY.YY.YY.Y..........',
          '.................Y..Y...YHHHHH......Y..Y..Y............',
          '......Y....WHHH.....O.....Y..YY..OYYY.......YYYYY......',
          '.....Y....HHHHHHW..YO.YY.Y.....Y.Y.....Y.Y..Y..Y.......',
          '.....Y...OHHHHHHHY...Y.Y..Y...Y..O....WH.HHY...Y.......',
          '.....YY..HHHHHHHH....Y.Y.YY..YY.OYY..WHHHHHHY.YYY......',
          '.....YY..HHHHHHHHO.YOG.Y..YYYY.YY....HHHHHHHW..........',
          '.........WHHHHHHHY...YDDD..G.Y..Y....HHHHHHHH...Y......',
          '.....YYY.YHHHHHHHY...YDGDD.D...DGY..OHHHHHHHH..YY......',
          '......Y...OHHHHH..YYYYDDGD.D.DDDY....HHHHHHHW..........',
          '.............O.....Y..DDDGDDDDDGY....OHHHHHH..Y.YY.....',
          '......YYO..........YD..DDGDDDDGDDYY.Y.OHHHHY...YY......',
          '........Y..Y.....YYY......DDDGDDD.Y......YY....Y.......',
          '........YYYY.YY.Y.....D.D.DGGGGDD.Y.Y........Y.Y.......',
          '...........YYYLYY.DDDDDDDD.D..DDD.G.Y..Y..Y..Y.........',
          '........DDDDYGDDDDDDGGDDDD.D.DDD.D..Y.YY..YYYGDD.......',
          '.......DDG..GDD.DDGGGDDD.D.D.DD..D.DDY..YY..YGGDD......',
          '.......DDGGGDD..DDGGDDDD.D.DGD..DDDDDDD..GDDDGGDDD.....',
          '......DDGGDGDD..DDGDDDD.DDDDG...DDDGGDDDDDDDDDGGDD.....',
          '......DDGDDGDD.DDDGDDDD.DNDDGM.DDDDDGGGDDD.DDDDDGDD....',
          '......DGDDDDDDDDDDDD..NDDDDDG..DMU.DDGGDDD.DDDDDDDD....',
          '......DDDDD..DDDGDGD.UUUNNNNNNNNUU.DDGGGGD...DDDDDD....',
          '......DD.....DDGDGGD..U.U.......U..DDGDGDDD.....DDD....',
          '......D.....DDGGDDDD..U.U.U.U.U.U...DDDDGDD.......D....',
          '............DDGDGDD...U.U.U.U.UUU...DDDDGDD............',
          '............DDGDDDD..U.UU.U.U..U......DDDD.............',
          '.............DGDD...UU.U.UU.UU.U..U....DDD.............',
          '.............DDD....U.UU.UU.UU.UU.UU....DD.............',
          '.............DD....UU.UU.UU.UU..U..U...................',
          '...................UU.U..UU.UU..U..U...................',
          '...................U..U..UU..U..UU.U...................',
          '...................U..U..UU..U..UU.U...................',
          'RRRR..RRRRR..RRRR..UU.U..UU..U..UU.UNRR..RRRRR...RRRRRR',
          'RRRR..RRRRR..RRRR..UU.U..UU..U..U..URRR..RRRRR..RRR...R',
          '..RRRRR...RRRRRRRRRRU.UU.UU.UU..U.UU..RRRRR..RRRRRRR..R',
          '..RRRRR...RRRR..RRRRU.UU.UU.UU.UU.U...RRRRR..RRRR.RRRRR',
          'RRRRRRRRRRRRRR..RRRRNU.U.UU.UU.UU.URRRRR.RRRRRRR...RRR.',
          'RRRR..RRRRR.RRRRRR...U.UU.U.UU.U.UNRRRR...RRRRRRR.RRRR.',
          'RRRR..RRRR...RRRRR..RRUUU.U.UU.U.URR.RRR..RRR..RRRRRRRR',
          '..RRRRRRRRR.RRRRRRRRRRUUU.U.UUUUUNR...RRRRRR...RRRR...R',
          '..RRRRR.RRRRRRR..RRRRR.NNUUUUUUNHRR..RRRRRRRR..RRRR...R',
          '..RRRR...RRRRRR..RRRR...RRR..RRR..RRRRRR..RRRRRRRRRR.RR',
          'RRRRRR...RRRRRRRRRRRRR..RRR...RR...RRRRR...RRRR...RRRRR',
        ] },
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
    // 큰 판(컬러 그림을 칸으로 옮긴 퍼즐)에 쓰는 색: 선명한 파랑, 진회색, 짙은 갈색
    U: '#3F86E8', M: '#6B6F78', H: '#7A4A2A',
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
