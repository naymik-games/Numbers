let currentGame;
let games = ['plusPlus', 'play2048', 'zNumbers', 'nonogram', 'tenPair', 'mineSweeper', 'twoFourEight', 'fuseTen', 'gridPlus', 'Slide'];
let gameNames = ['Plus+Plus', '2048', 'zNumbers', 'Nonogram', 'TenPair', 'Minesweeper', '2-4-8', 'Fuse Ten', 'Grid+', 'NumberSlide'];
//plusPlus, play2048, zNumbers, nonogram

let nonoLevel = {}
let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 250,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}

var znumbersOptions = {
  gameWidth: 900,
  gameHeight: 1600,
  tileSize: 100,
  fieldSize: {
    rows: 6,
    cols: 6
  },
  colors: [0x999999, 0xffcb97, 0xffaeae, 0xa8ffa8, 0x9fcfff],

}
let gameSettings;
let gameData;
let gridGameData;
let defaultGridGameData = {
  score: 0,
  numbers: 3,
  level: 0,
  bonus: 0,
  upgradeMax: 2,
  grid: [
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],

  ]
}
let numberRPGData;
let defaultNumberRPGData = {
  score: 0,
  numbers: 3,
  level: 0,
  bonus: 0,
  upgradeMax: 2,
  grid: [
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],
    [{ value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }, { value: 0, upgrade: 0 }],

  ]
}




let default248GameData = {
  score: 0,
  level: 0,
  rows: 5,
  cols: 5,
  numbers: [2, 2, 2, 4, 4, 4, 8, 8],
  grid: null,
}
var defaultData = {
  plusHigh: 0,
  plusLast: 0,
  gridPlusHigh: 0,
  gridPlusLast: 0,

  twentyHigh: 0,
  twentyLast: 0,
  twentyAchieved: 0,
  twentyBoard: null,
  twentyCurrentScore: 0,
  twoFourEightHight: 0,
  twoFourEightLast: 0,
  znumverHigh: 0,
  znumberLast: 0,
  tenHugh: 0,
  tenLast: 0,
  mineEasy: 0,
  mineEasyTime: 2700,
  mineMedium: 0,
  mineMediumTime: 2700,
  mineHard: 0,
  mineHardTime: 2700,
  nonoSet: { r: 5, c: 5, diff: 1 },
  currentGame: 0
}