let mineOptions = {
  rows: 9,
  cols: 9,
  space: 0,
  bombs: 10
}

//9x9=10b,16x16=40b,16x23r92b
class mineSweeper extends Phaser.Scene {
  constructor() {
    super("mineSweeper");
  }
  preload() {
    this.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');


  }
  create() {
    if (mineMode == 0) {
      mineOptions.rows = 9;
      mineOptions.cols = 9;
      mineOptions.bombs = 10;
      var bestTime = this.formatTime(gameData.mineEasyTime);
    } else if (mineMode == 1) {
      mineOptions.rows = 16;
      mineOptions.cols = 16;
      mineOptions.bombs = 40;
      var bestTime = this.formatTime(gameData.mineHardTime);
    } else {
      mineOptions.rows = 23;
      mineOptions.cols = 16;
      mineOptions.bombs = 92;
      var bestTime = this.formatTime(gameData.mineHardTime);
    }
    this.numberArray = [1, 2, 9, 8, 4];
    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.cameras.main.setBackgroundColor(0xf4f4f4);


    this.tileSize = game.config.width / mineOptions.cols
    this.textSize = (this.tileSize * .75)
    //console.log('tile' + this.tileSize + ' text' + this.textSize)
    // this.tileSize = 100;
    //this.xOffset = (game.config.width - (mineOptions.cols * (this.tileSize + mineOptions.space) + this.tileSize / 2)) / 2;
    this.xOffset = 0;
    this.revealed = 0;
    this.flagged = 0;
    this.yOffset = 200;
    this.gridSize = mineOptions.rows * mineOptions.cols;

    this.flagText = this.add.bitmapText(game.config.width / 2, 100, 'topaz', this.flagged, 90).setOrigin(.5).setTint(0xc76210);
    this.revealText = this.add.bitmapText(game.config.width / 2 + 125, 100, 'topaz', 'Bombs: ' + mineOptions.bombs, 60).setOrigin(0, .5).setTint(0xc76210);




    this.createGrid();
    this.long = false;
    this.rexGestures.add.press()
      .on('pressstart', function (press) {

        this.long = true;
        this.longPress(press);
      }, this)
      .on('pressend', function (press) {
        //colorTag.setVisible(false);
      });


    this.initialTime = 0;


    this.timeText = this.add.bitmapText(225, 100, 'topaz', this.formatTime(this.initialTime), 60).setOrigin(0, .5).setTint(0xc76210);

    this.timeBestText = this.add.bitmapText(225, 150, 'topaz', bestTime, 40).setOrigin(0, .5).setTint(0xff0000);
    // Each 1000 ms call onEvent
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

    this.input.on('pointerup', this.pickTile, this);

  }
  update() {

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


  createGrid() {
    this.grid = [];
    //this.fieldArray = [];
    // this.fieldGroup = this.add.group();
    var count = 0
    for (var i = 0; i < mineOptions.rows * mineOptions.cols; i++) {

      var g = this.getGridFromId(i);

      var tileXPos = this.xOffset + g.c * (this.tileSize + mineOptions.space) + this.tileSize / 2;
      var tileYPos = this.yOffset + g.r * (this.tileSize + mineOptions.space) + this.tileSize / 2;


      var two = this.add.sprite(tileXPos, tileYPos, 'blank').setTint(0x333333);
      two.displayWidth = this.tileSize;
      two.displayHeight = this.tileSize;




      var rand = Phaser.Math.Between(0, this.numberArray.length - 1)
      var num = this.numberArray[rand]
      var open = true;


      var tileText = this.add.bitmapText(tileXPos, tileYPos, 'topaz', '', this.textSize).setOrigin(.5).setTint(0x000000);
      // two.alpha = 0;
      //two.visible = 0;
      //  this.fieldGroup.add(two);

      var tile = {
        tileValue: 0,
        tileText: tileText,
        tileSprite: two,
        bomb: false,
        revealed: false,
        flagged: false,
        id: i
      }
      this.grid.push(tile)
    }

    this.addBombs();
    console.log(this.getValidNeighborIds(5));

    this.countBombs();

  }
  addBombs() {
    let added = 0;
    while (added < mineOptions.bombs) {
      var index = this.getEmptySpace();
      this.grid[index].bomb = true;
      //this.grid[index].tileSprite.setTint(0x111111)
      added++;
    }
    console.log('bombs: ' + added)
  }
  countBombs() {
    for (var c = 0; c < mineOptions.cols; c++) {
      for (var r = 0; r < mineOptions.rows; r++) {
        if (!this.grid[this.getIdFromGrid(r, c)].bomb) {
          var count = 0;
          var neighbors = this.getValidNeighborIds(this.getIdFromGrid(r, c));

          if (neighbors.length > 0) {
            for (var n = 0; n < neighbors.length; n++) {
              if (this.grid[neighbors[n]].bomb) {
                count++
              }
            }
          }
          this.grid[this.getIdFromGrid(r, c)].tileValue = count;


          //this.grid[this.getIdFromGrid(r, c)].tileValue = count;
          //this.grid[this.getIdFromGrid(r, c)].tileText.setText(count);

        }
      }
    }

  }
  showAll() {
    for (var c = 0; c < mineOptions.cols; c++) {
      for (var r = 0; r < mineOptions.rows; r++) {
        var tile = this.grid[this.getIdFromGrid(r, c)]

        if (tile.bomb) {
          tile.tileSprite.setTint(0xff0000);
        } else {
          tile.tileSprite.setTint(0xffffff);
          tile.tileText.setText(tile.tileValue);

        }


      }
    }

  }
  reveal(id) {
    if (!this.grid[id].revealed) {
      this.grid[id].tileSprite.setTint(0xffffff);
      this.grid[id].tileText.setText(this.grid[id].tileValue);
      this.grid[id].revealed = true;
      this.revealed++

      if (this.grid[id].tileValue == 0) {

        var neighbors = this.getValidNeighborIds(id);
        for (var n = 0; n < neighbors.length; n++) {
          if (!this.grid[neighbors[n]].bomb) {
            this.reveal(neighbors[n])
          }
        }
      }

    }
  }
  getValidNeighborIds(id) {
    var nArray = []
    //n
    if (this.checkId(id - mineOptions.cols)) {
      nArray.push(id - mineOptions.cols)
    }
    //ne
    if (this.checkId(id - (mineOptions.cols - 1)) && !this.isRightEdge(id)) {
      nArray.push(id - (mineOptions.cols - 1))
    }
    //e
    if (this.checkId(id + 1) && !this.isRightEdge(id)) {
      nArray.push(id + 1)
    }
    //se
    if (this.checkId(id + (mineOptions.cols + 1)) && !this.isRightEdge(id)) {
      nArray.push(id + (mineOptions.cols + 1))
    }
    //s
    if (this.checkId(id + mineOptions.cols)) {
      nArray.push(id + mineOptions.cols)
    }
    //sw
    if (this.checkId(id + (mineOptions.cols - 1)) && !this.isLeftEdge(id)) {
      nArray.push(id + (mineOptions.cols - 1))
    }
    //w
    if (this.checkId(id - 1) && !this.isLeftEdge(id)) {
      nArray.push(id - 1)
    }

    //nw
    if (this.checkId(id - (mineOptions.cols + 1)) && !this.isLeftEdge(id)) {
      nArray.push(id - (mineOptions.cols + 1))
    }
    return nArray;
  }
  isLeftEdge(id) {
    return id % mineOptions.cols == 0;
  }
  isRightEdge(id) {
    return id % mineOptions.cols == mineOptions.cols - 1;
  }
  getEmptySpace() {
    let index = Math.floor(Math.random() * this.gridSize);
    while (this.grid[index].bomb) {
      index = Math.floor(Math.random() * this.gridSize);
    }
    return index;
  }
  getGridFromId(id) {
    var row = Math.floor(id / mineOptions.cols);
    var col = id % mineOptions.cols;
    return { r: row, c: col }
  }
  getIdFromGrid(r, c) {
    return c + r * mineOptions.cols;
  }
  check(c, r) {
    if ((c > 0) && (r > 0) && (c < mineOptions.cols) && (r < mineOptions.rows)) {
      // returns index
      return c + r * mineOptions.cols;
    }
  }
  checkId(id) {
    if (id > 0 && id < this.gridSize) {
      return true
    }
  }
  pickTile(e) {
    if (this.long) {
      this.long = false;
      return

    }
    var legalMove = false;
    var posX = e.x - this.xOffset;
    var posY = (e.y - this.yOffset);
    var pickedRow = Math.floor(posY / (this.tileSize + mineOptions.space));
    var pickedCol = Math.floor(posX / (this.tileSize + mineOptions.space));
    // if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < tenPairOptions.rows && pickedCol < tenPairOptions.cols) {

    if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < mineOptions.rows && pickedCol < mineOptions.cols) {
      var id = this.getIdFromGrid(pickedRow, pickedCol);
      var pickedTile = this.grid[id];
      console.log('[' + pickedRow + '][' + pickedCol + '], ' + 'id ' + pickedTile.id)
      if (!pickedTile.revealed && !pickedTile.flagged) {
        if (pickedTile.bomb) {
          pickedTile.tileSprite.setTint(0xff0000);
          alert('you lose')
          this.timedEvent.remove()
          this.showAll();
        } else {

          this.reveal(id)

        }
      }
    }
    if (this.revealed == (mineOptions.rows * mineOptions.cols) - mineOptions.bombs) {
      this.timedEvent.remove()
      alert('you win')

      if (mineMode == 0) {
        gameData.mineEasy++;
        if (this.initialTime < gameData.mineEasyTime) {
          gameData.mineEasyTime = this.initialTime
        }

      } else if (mineMode == 1) {
        gameData.mineMedium++;
        if (this.initialTime < gameData.mineMediumTime) {
          gameData.mineMediumTime = this.initialTime
        }
      } else {
        gameData.mineHard++;
        if (this.initialTime < gameData.mineHardTime) {
          gameData.mineHardTime = this.initialTime
        }
      }
      this.saveSettings()
    }
  }
  longPress(e) {
    var posX = e.x - this.xOffset;
    var posY = (e.y - this.yOffset);
    var pickedRow = Math.floor(posY / (this.tileSize + mineOptions.space));
    var pickedCol = Math.floor(posX / (this.tileSize + mineOptions.space));
    if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < mineOptions.rows && pickedCol < mineOptions.cols) {
      var id = this.getIdFromGrid(pickedRow, pickedCol);
      var pickedTile = this.grid[id];
      console.log('[' + pickedRow + '][' + pickedCol + '], ' + 'id ' + pickedTile.id)
      if (!pickedTile.revealed && !pickedTile.flagged) {
        pickedTile.flagged = true;
        pickedTile.tileSprite.setTint(0x00ff00);
        this.flagged++
        this.flagText.setText(this.flagged)
      } else if (!pickedTile.revealed && pickedTile.flagged) {
        pickedTile.flagged = false;
        pickedTile.tileSprite.setTint(0x333333);
        this.flagged--
        this.flagText.setText(this.flagged)
      }
    }
  }
  saveSettings() {

    localStorage.setItem('numbersData', JSON.stringify(gameData));

  }
}
