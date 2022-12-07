

const EASY_PERCENT = 92;
const MEDIUM_PERCENT = 75;
const HARD_PERCENT = 40;
const EASY_DIFFICULTY = 'easy';
const MEDIUM_DIFFICULTY = 'medium';
const HARD_DIFFICULTY = 'hard';
const STATE_UNSELECTED = 0;
const STATE_SELECTED = 1;
const STATE_MARKED = 2;
const DEFAULT_DIFFICULTY = MEDIUM_DIFFICULTY;

var board = [];

class nonogram extends Phaser.Scene {
  constructor() {
    super("nonogram");
  }
  preload() {


  }
  create() {
    //this.numRows = nonoLevel.rows
    //this.numCols = nonoLevel.cols;
    //7x7, 7x9, 8x8, 8x10
    this.numRows = 12
    this.numCols = 8;
    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.cameras.main.setBackgroundColor(0x000000);
    var title = this.add.bitmapText(game.config.width / 2, 50, 'topaz', 'Nonogram', 100).setOrigin(.5).setTint(0xc76210);
    var info = nonoLevel.cols + 'x' + nonoLevel.rows + ' - ' + nonoLevel.diff;
    var infoText = this.add.bitmapText(game.config.width / 2, 150, 'topaz', info, 60).setOrigin(.5).setTint(0xffffff);

    this.xOffset = 50;
    this.yOffset = 425;
    if (this.numCols > 12) {
      //max 16 max row 20
      this.tileSize = 35;
      this.hintSize = 40
    } else if (this.numCols > 8) {
      //max 12
      this.tileSize = 50;
      this.hintSize = 50
    } else {
      // max 8
      this.tileSize = 75;
      this.hintSize = 60
    }
    this.tileSize = (game.config.width - 300) / this.numCols

    this.tileSpacing = 5;
    this.hHints = [];
    this.vHints = [];
    this.start(nonoLevel.diff);
    this.makeGame();
    this.setUpHints();
    var solve = this.add.bitmapText(game.config.width / 2, 1475, 'topaz', 'Solve', 100).setOrigin(.5).setTint(0xc76210).setInteractive();
    solve.on('pointerdown', this.solve, this)
    // this.solve()
    this.input.on('pointerdown', this.pickTile, this);
  }
  pickTile(e) {
    var posX = e.x - this.xOffset;
    var posY = e.y - this.yOffset;
    var pickedRow = Math.floor(posY / (this.tileSize + this.tileSpacing));
    var pickedCol = Math.floor(posX / (this.tileSize + this.tileSpacing));
    //console.log('[' + pickedRow + '][' + pickedCol + ']')
    console.log()
    if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < this.numRows && pickedCol < this.numCols) {
      var cell = board[pickedRow][pickedCol];
      console.log(cell.isSpot)
      switch (cell.selectedState) {
        case STATE_UNSELECTED:
          cell.selectedState = STATE_SELECTED;
          cell.tile.setTint(0x00ff00);
          break;
        case STATE_SELECTED:
          cell.selectedState = STATE_MARKED;
          cell.tile.setTint(0xff0000);
          break;
        case STATE_MARKED:
          cell.selectedState = STATE_UNSELECTED;
          cell.tile.setTint(0xffffff)
          break;
      }
      this.checkForWin();
    }
  }
  start(difficulty) {
    switch (difficulty) {
      case EASY_DIFFICULTY:
        this.percentSpots = EASY_PERCENT;
        break;
      case MEDIUM_DIFFICULTY:
        this.percentSpots = MEDIUM_PERCENT;
        break;
      case HARD_DIFFICULTY:
        this.percentSpots = HARD_PERCENT;
        break;
      default:
        this.start(DEFAULT_DIFFICULTY);
        break;
    }
    console.log(difficulty)

    //this.setHintsH();
    //this.setHintsV();
    //reset();
  }
  makeGame() {
    for (let i = 0; i < this.numRows; i++) {
      board[i] = [];

      for (let j = 0; j < this.numCols; j++) {
        var tile = this.add.sprite(this.tileDestination(j, 'r'), this.tileDestination(i, 'c'), 'blank');
        var hintTextH = this.add.bitmapText(this.tileDestination(this.numCols, 'r'), this.tileDestination(i, 'c'), 'topaz', '', this.hintSize).setOrigin(0, .5).setTint(0xc76210);
        var hintTextV = this.add.bitmapText(this.tileDestination(j, 'r'), this.tileDestination(-1, 'c'), 'topaz', '', this.hintSize).setOrigin(.5, 1).setTint(0xc76210).setAngle(0);

        this.hHints[i] = hintTextH;
        this.vHints[j] = hintTextV;
        tile.displayWidth = this.tileSize;
        tile.displayHeight = this.tileSize;
        board[i][j] = {
          selectedState: STATE_UNSELECTED,
          isSpot: Math.random() >= 1 - (this.percentSpots / 100),
          tile: tile
        }

      }
    }
  }
  setUpHints() {
    var hHints = this.setHintsH();

    for (var i = 0; i < this.numRows; i++) {
      var text = ''
      for (var j = 0; j < hHints[i].length; j++) {
        text += hHints[i][j] + ' ';

      }
      this.hHints[i].setText(text)

      // console.log(JSON.stringify(hHints[i]))
    }
    //console.log(text)

    var vHints = this.setHintsV();

    for (var i = 0; i < this.numCols; i++) {
      var text = ''
      for (var j = 0; j < vHints[i].length; j++) {
        text += vHints[i][j] + '\n';

      }
      this.vHints[i].setText(text)

      // console.log(JSON.stringify(hHints[i]))
    }



  }
  setHintsH() {
    var filledTiles = [];

    for (var i = 0; i < board.length; i++) {
      var counts = [];
      var count = 0;
      for (var j = 0; j < board[i].length; j++) {
        if (board[i][j].isSpot) {
          count++;
          if (j == board[i].length - 1) {
            counts.push(count);
          }
        } else if (count != 0) {
          counts.push(count);
          count = 0;
        }
      }
      filledTiles.push(counts);
    }
    console.log('l ' + filledTiles.length)
    return filledTiles;
    //console.log(JSON.stringify(filledTiles))
  }
  setHintsV() {
    var filledTiles = [];

    var grid = this.transpose(board);

    for (var i = 0; i < grid.length; i++) {
      var counts = [];
      var count = 0;
      for (var j = 0; j < grid[i].length; j++) {
        if (grid[i][j].isSpot) {
          count++;
          if (j == grid[i].length - 1) {
            counts.push(count);
          }
        } else if (count != 0) {
          counts.push(count);
          count = 0;
        }
      }
      filledTiles.push(counts);
    }

    return filledTiles;
    //console.log(JSON.stringify(filledTiles))
  }


  transpose(matrix) {
    var grid = [];
    for (var i = 0; i < matrix[0].length; i++) {
      var aux = [];
      for (var j = 0; j < matrix.length; j++) {
        aux.push(matrix[j][i]);
      }
      grid.push(aux);
    }
    return grid;
  }

  setHints__() {
    // horizontal
    var horizontal = [];
    for (let i = 1; i < this.numRows + 1; i++) {
      let row = [];
      let count = 0;
      for (let j = 1; j < this.numCols + 1; j++) {
        let cell = board[i - 1][j - 1];

        if (cell.isSpot) {
          count++;
        } else if (count > 0) {
          row.push(count);
          count = 0;
        }
      }

      if (count > 0) {
        row.push(count);
      }


      row.forEach(num => {
        console.log('row' + i + ' hint ' + num)

      });


    }

  }
  solve() {
    for (let i = 1; i < this.numRows + 1; i++) {

      for (let j = 1; j < this.numCols + 1; j++) {
        let cell = board[i - 1][j - 1];

        cell.selectedState = cell.isSpot ? STATE_SELECTED : STATE_UNSELECTED;
        if (cell.selectedState == STATE_SELECTED) {
          cell.tile.setTint(0x00ff00)
        } else {
          cell.tile.setTint(0x000000)
        }
      }
    }
  }
  solve_() {
    for (let i = 0; i < this.numRows; i++) {

      for (let j = 0; j < this.numCols; j++) {
        let cell = board[i][j];

        cell.selectedState = cell.isSpot ? STATE_SELECTED : STATE_UNSELECTED;
        if (cell.selectedState == STATE_SELECTED) {
          cell.tile.setTint(0xffffff)
        } else {
          cell.tile.setTint(0x000000)
        }
      }
    }
  }
  checkForWin() {

    for (let i = 1; i < this.numRows + 1; i++) {

      for (let j = 1; j < this.numCols + 1; j++) {
        // let tableCell = tableCells[i][j];
        let cell = board[i - 1][j - 1];
        if ((cell.isSpot && cell.selectedState !== STATE_SELECTED) ||
          (!cell.isSpot && cell.selectedState === STATE_SELECTED)) {
          return;
        }
      }
    }

    // give enough time for css of last cell to update
    //setTimeout(() => alert('You win!'), 50);
    this.time.addEvent({
      delay: 1000, callback: function () {
        alert("You Win");
        this.solve()
      }, callbackScope: this, loop: false
    })


  }
  tileDestination(pos, dir) {
    if (dir == 'r') {
      return this.xOffset + pos * (this.tileSize + this.tileSpacing) + this.tileSize / 2 + this.tileSpacing
    } else {
      return this.yOffset + pos * (this.tileSize + this.tileSpacing) + this.tileSize / 2 + this.tileSpacing
    }
  }
}
