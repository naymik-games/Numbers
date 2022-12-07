const defaultSetting = 'advanced';
const defaultSize = 'medium';
const msSettings = {
  'beginner': {
    'gridWidth': 9,
    'gridHeight': 9,
    'maxMines': 10,
    'textOffset': 'small'
  },
  'intermediate': {
    'gridWidth': 16,
    'gridHeight': 16,
    'maxMines': 40,
    'textOffset': 'medium'
  },
  'advanced': {
    'gridWidth': 20,
    'gridHeight': 24,
    'maxMines': 99,
    'textOffset': 'large'
  }
};
const textOffsetSettings = {
  'small': {
    'tileSize': 100,
    'hOffset': 6,
    'vOffset': -3,
    'hOffsetMine': 8,
    'vOffsetMine': 3,
    'hOffsetFlag': 3,
    'vOffsetFlag': -3,
    'hOffsetX': 5,
    'vOffsetX': -3
  },
  'medium': {
    'tileSize': 56,
    'hOffset': 8,
    'vOffset': -4,
    'hOffsetMine': 11,
    'vOffsetMine': 3,
    'hOffsetFlag': 4,
    'vOffsetFlag': -4,
    'hOffsetX': 6,
    'vOffsetX': -4
  },
  'large': {
    'tileSize': 45,
    'hOffset': 8,
    'vOffset': -4,
    'hOffsetMine': 11,
    'vOffsetMine': 3,
    'hOffsetFlag': 4,
    'vOffsetFlag': -4,
    'hOffsetX': 6,
    'vOffsetX': -4
  }
};

var gridWidth;
var gridHeight;
var maxMines;
var maxGameMines;
var totalTiles;
var minesLeft;
var tilesToClick;
var tileSize;
var textOffsets;

const tileBomb = -1;
const tileDefault = 0;
const tileFlagged = 1;
const tileUnsure = 2;
const tileClicked = 3;

let gridClicked = [];
let gameState = [];
let tileGrid = []
let gameStarted = false;
let gameOver = false;
let timer = 0;

let selectedTextSize = defaultSize;

class mineSweeper extends Phaser.Scene {
  constructor() {
    super("mineSweeper");
  }
  preload() {
    this.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');


  }
  create() {

    this.xOffset = 0;

    this.yOffset = 200;

    this.long = false;
    this.rexGestures.add.press()
      .on('pressstart', function (press) {

        this.long = true;
        this.tileRightClick(press);
      }, this)
      .on('pressend', function (press) {
        //colorTag.setVisible(false);
      });

    this.input.on('pointerup', this.tileClick, this);




    this.mines = this.add.bitmapText(225, 100, 'topaz', '0', 80).setOrigin(.5).setTint(0xc76210).setInteractive();

    this.initialTime = 0;
    this.timeText = this.add.bitmapText(675, 100, 'topaz', this.formatTime(this.initialTime), 80).setOrigin(.5).setTint(0xc76210);

    //this.timeBestText = this.add.bitmapText(225, 150, 'topaz', bestTime, 40).setOrigin(0, .5).setTint(0xff0000);
    // Each 1000 ms call onEvent
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true, paused: true });

    this.emoji = this.add.image(450, 100, 'emoji', 0).setScale(3.5)
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(10, 0xffffff, 1)

    this.setDifficulty(defaultSetting)



    this.beginner = this.add.bitmapText(225, game.config.height - 110, 'topaz', 'EASY', 60).setOrigin(.5, 1).setTint(0xc76210).setInteractive();
    this.beginner.on('pointerdown', function () {
      this.setDifficulty('beginner')
    }, this)
    this.medium = this.add.bitmapText(450, game.config.height - 110, 'topaz', 'MEDIUM', 60).setOrigin(.5, 1).setTint(0xc76210).setInteractive();
    this.medium.on('pointerdown', function () {
      this.setDifficulty('intermediate')
    }, this)
    this.hard = this.add.bitmapText(675, game.config.height - 110, 'topaz', 'HARD', 60).setOrigin(.5, 1).setTint(0xc76210).setInteractive();
    this.hard.on('pointerdown', function () {
      this.setDifficulty('advanced')
    }, this)



  }
  formatTime(seconds) {
    // Minutes
    var minutes = Math.floor(seconds / 60);
    // Seconds
    var partInSeconds = seconds % 60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2, '0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
  }


  onEvent() {
    this.initialTime += 1; // One second
    this.timeText.setText(this.formatTime(this.initialTime));
  }

  setTextOffsets(size) {

    selectedTextSize = size;

    tileSize = textOffsetSettings[size].tileSize;
    textOffsets = textOffsetSettings[size];

    this.resetGame();
  }
  setDifficulty(difficulty) {


    gridWidth = msSettings[difficulty].gridWidth;
    gridHeight = msSettings[difficulty].gridHeight;
    maxMines = msSettings[difficulty].maxMines;
    totalTiles = gridWidth * gridHeight;

    this.setTextOffsets(msSettings[difficulty].textOffset);
  }
  resetGame() {
    this.initialTime = 0
    this.emoji.setFrame(0)
    this.timeText.setText(this.formatTime(this.initialTime));

    if (tileGrid.length > 0) {
      console.log('reset')


      for (var row = 0; row < tileGrid.length; row++) {
        for (var col = 0; col < tileGrid[0].length; col++) {
          var tile = tileGrid[row][col]
          tile.destroy()
        }
      }
    }
    gridClicked = [];
    tileGrid = []
    gameStarted = false;
    gameOver = false;
    timer = 0;
    minesLeft = maxMines;
    maxGameMines = maxMines;
    tilesToClick = totalTiles - maxMines;


    for (var row = 0; row < gridHeight; row++) {
      gridClicked[row] = []
      for (var col = 0; col < gridWidth; col++) {
        gridClicked[row][col] = tileDefault

      }
    }



    for (var row = 0; row < gridHeight; row++) {
      tileGrid[row] = []
      for (var col = 0; col < gridWidth; col++) {
        var tileXPos = this.xOffset + col * tileSize + tileSize / 2;
        var tileYPos = this.yOffset + row * tileSize + tileSize / 2;
        var tile = this.add.sprite(tileXPos, tileYPos, 'ms', 0)
        tile.displayWidth = tileSize;
        tile.displayHeight = tileSize;

        tileGrid[row][col] = tile;

      }
    }
    this.graphics.clear()
    this.graphics.strokeRect(0, 200, 100, 100); // rect: {x, y, width, height}
    // this.rectBack.setSize((gridWidth - 1) * tileSize + tileSize / 2, (gridHeight - 1) * tileSize + tileSize / 2)


  }
  startGame(initX, initY) {
    gameState = [];
    this.emoji.setFrame(1)
    this.timedEvent.paused = false;
    for (var row = 0; row < gridHeight; row++) {
      gameState[row] = []
      for (var col = 0; col < gridWidth; col++) {
        gameState[row][col] = 0;
      }
    }


    let minesToPlace = maxMines;
    while (minesToPlace > 0) {
      var mineX = Math.floor(Math.random() * gridWidth);
      var mineY = Math.floor(Math.random() * gridHeight);
      if (gameState[mineY][mineX] != tileBomb && (Math.abs(initX - mineX) > 1 || Math.abs(initY - mineY) > 1)) {
        gameState[mineY][mineX] = tileBomb;
        for (var j = Math.max(mineY - 1, 0); j <= Math.min(mineY + 1, gridHeight - 1); j++) {
          for (var i = Math.max(mineX - 1, 0); i <= Math.min(mineX + 1, gridWidth - 1); i++) {
            if (gameState[j][i] != tileBomb) {
              gameState[j][i] += 1;
            }
          }
        }
        minesToPlace -= 1;
      }
    }
    console.log(gameState)
    this.mines.setText(minesLeft)
  }


  checkTile(x, y) {
    if (gridClicked[y][x] == tileFlagged || gridClicked[y][x] == tileClicked) {
      return;
    }

    if (gridClicked[y][x] != tileClicked) {
      gridClicked[y][x] = tileClicked;
      tilesToClick -= 1;
    }


    if (gameState[y][x] == 0) {

      tileGrid[y][x].setFrame(2);
      this.checkSurroundingTiles(x, y);
    }
    else if (gameState[y][x] < 0) {
      tileGrid[y][x].setFrame(13);
      this.endGame(x, y);
      return;
    }
    else {
      switch (gameState[y][x]) {
        case 1:
          tileGrid[y][x].setFrame(4);
          break;
        case 2:
          tileGrid[y][x].setFrame(5);
          break;
        case 3:
          tileGrid[y][x].setFrame(6);
          break;
        case 4:
          tileGrid[y][x].setFrame(7);
          break;
        case 5:
          tileGrid[y][x].setFrame(8);
          break;
        case 6:
          tileGrid[y][x].setFrame(9);
          break;
        case 7:
          tileGrid[y][x].setFrame(10);
          break;
        case 8:
          tileGrid[y][x].setFrame(11);
          break;
        default:
          tileGrid[y][x].setFrame(2);
      }

    }

    if (tilesToClick <= 0) {
      this.winGame();
    }
  }

  checkSurroundingTiles(x, y) {
    for (var j = Math.max(y - 1, 0); j <= Math.min(y + 1, gridHeight - 1); j++) {
      for (var i = Math.max(x - 1, 0); i <= Math.min(x + 1, gridWidth - 1); i++) {
        if (gridClicked[j][i] != tileClicked) {
          this.checkTile(i, j);
        }
      }
    }
  }
  countSurroundingTiles(x, y) {
    count = 0;
    for (var j = Math.max(y - 1, 0); j <= Math.min(y + 1, gridHeight - 1); j++) {
      for (var i = Math.max(x - 1, 0); i <= Math.min(x + 1, gridWidth - 1); i++) {
        switch (gridClicked[j][i]) {
          case tileFlagged:
            count++;
            break;
        }
      }
    }
    return count;
  }
  markTile(x, y) {
    if (gridClicked[y][x] == tileClicked) {
      return;
    }

    gridClicked[y][x] = (gridClicked[y][x] + 1) % 3;


    switch (gridClicked[y][x]) {
      case tileDefault:
        tileGrid[y][x].setFrame(0);
        break;
      case tileFlagged:

        tileGrid[y][x].setFrame(1);
        minesLeft -= 1;

        break;
      case tileUnsure:

        tileGrid[y][x].setFrame(14);
        minesLeft += 1;

        break;
    }
    this.mines.setText(minesLeft)
  }


  endGame(x, y) {
    gameOver = true;
    this.timedEvent.paused = true;
    this.emoji.setFrame(2)

    tileGrid[y][x].setFrame(13);


    for (var j = 0; j < gameState.length; j++) {
      for (var i = 0; i < gameState[j].length; i++) {
        if (gameState[j][i] != tileBomb && (gridClicked[j][i] == tileFlagged || gridClicked[j][i] == tileUnsure)) {

          tileGrid[j][i].setFrame(12);
        }
        if (gameState[j][i] == tileBomb && gridClicked[j][i] == tileDefault && (x != i || y != j)) {

          tileGrid[j][i].setFrame(3);
        }
      }
    }
  }

  winGame() {
    gameOver = true;
    this.timedEvent.paused = true;
    this.emoji.setFrame(3)

    for (var j = 0; j < gameState.length; j++) {
      for (var i = 0; i < gameState[j].length; i++) {
        if (gridClicked[j][i] != tileClicked) {
          tileGrid[j][i].setFrame(3);
        }
      }
    }
  }

  tileRightClick(pointer) {
    if (gameOver == true || gameStarted == false) {
      return;
    }

    let row = Math.floor((pointer.y - this.yOffset) / tileSize);
    let col = Math.floor((pointer.x - this.xOffset) / tileSize);
    console.log(col + ', ' + row)
    if (row >= 0 && col >= 0 && row < gridHeight && col < gridWidth) {
      this.markTile(col, row);
    }

  }
  tileClick(pointer) {

    if (gameOver == true) {
      return;
    }
    if (this.long) {
      this.long = false;
      return
    }

    let row = Math.floor((pointer.y - this.yOffset) / tileSize);
    let col = Math.floor((pointer.x - this.xOffset) / tileSize);
    console.log(col + ', ' + row)
    if (row >= 0 && col >= 0 && row < gridHeight && col < gridWidth) {
      if (gameStarted == false) {
        gameStarted = true;
        this.startGame(col, row);
      }

      this.checkTile(col, row);
    }


  }

}