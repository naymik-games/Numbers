class gridPlus extends Phaser.Scene {
  constructor() {
    super("gridPlus");
  }
  preload() {


  }
  create() {
    gridGameData = JSON.parse(localStorage.getItem('gridData'));

    if (gridGameData === null || gridGameData.length <= 0) {
      localStorage.setItem('gridData',
        JSON.stringify(defaultGridGameData));
      gridGameData = defaultGridGameData;
    }




    this.colors = {
      bg: 0x000000,
      tileEmpty: 0x7f8c8d,
      tileNormal: 0x16a085,
      tileUpgrade: 0xe74c3c,
      tileX: 0xff914d,

    }

    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.cameras.main.setBackgroundColor(this.colors.bg);
    //var title = this.add.bitmapText(50, 50, 'topaz', 'L: 1', 100).setOrigin(0,.5).setTint(0xc76210);
    this.tileSize = 150;
    this.xOffset = (game.config.width - (5 * (this.tileSize + 15) + this.tileSize / 2)) / 2;

    this.yOffset = 450;

    this.destroyTile = false;
    this.destroyX = false;

    this.numberTemp = 5;

    this.nextSlot = this.add.image(this.xOffset + 2 * (this.tileSize + 15) + this.tileSize / 2, 250, 'blankoutline').setInteractive().setTint(0x16a085);
    this.nextSlot.value = 5;
    this.nextSlot.displayWidth = 140;
    this.nextSlot.displayHeight = 140;
    this.nextNum = this.add.bitmapText(this.xOffset + 2 * (this.tileSize + 15) + this.tileSize / 2, 250, 'topaz', '5', 100).setOrigin(.5).setTint(0x16a085);

    this.nextSlot2 = this.add.image(this.xOffset + 3 * (this.tileSize + 15) + this.tileSize / 2, 250, 'blankoutline').setInteractive().setTint(0x7f8c8d);
    this.nextSlot2.value = 5;
    this.nextSlot2.displayWidth = 100;
    this.nextSlot2.displayHeight = 100;
    this.nextNum2 = this.add.bitmapText(this.xOffset + 3 * (this.tileSize + 15) + this.tileSize / 2, 250, 'topaz', '2', 70).setOrigin(.5).setTint(0x7f8c8d);

    this.nextSlot3 = this.add.image(this.xOffset + 3.8 * (this.tileSize + 15) + this.tileSize / 2, 250, 'blankoutline').setInteractive().setTint(0x7f8c8d);
    this.nextSlot2.value = 5;
    this.nextSlot3.displayWidth = 100;
    this.nextSlot3.displayHeight = 100;
    this.nextNum3 = this.add.bitmapText(this.xOffset + 3.8 * (this.tileSize + 15) + this.tileSize / 2, 250, 'topaz', '1', 70).setOrigin(.5).setTint(0x7f8c8d);

    this.level = gridGameData.level;
    this.score = gridGameData.score;
    this.levelScore = 0;
    this.numbers = gridGameData.numbers;
    this.levelGoal = 100;
    this.startingTiles = 7;
    this.bonusCount = gridGameData.bonus;
    this.numText = this.add.bitmapText(15, 400, 'topaz', '', 60).setOrigin(0, .5).setTint(0xecf0f1);
    var temp = this.level + 1;
    this.levelText = this.add.bitmapText(50, 50, 'topaz', 'L' + this.level, 100).setOrigin(0, .5).setTint(0x16a085);
    this.nextLevelText = this.add.bitmapText(850, 50, 'topaz', temp, 100).setOrigin(1, .5).setTint(0xe74c3c);

    this.levelBar = this.add.sprite(250, 50, 'blank').setOrigin(0, .5).setTint(0xe74c3c);
    this.levelBar.displayWidth = 450;
    this.levelBar.displayHeight = 40;

    this.progressBar = this.add.sprite(250, 50, 'blank').setOrigin(0, .5).setTint(0x16a085);
    this.progressBar.displayWidth = 0;
    this.progressBar.displayHeight = 40;


    this.printNumbers(this.numbers);

    this.drawNumbers(this.numbers, true);
    this.createGrid();
    // this.addStartingTiles(this.startingTiles);

    this.input.on('pointerdown', this.pickTile, this);
    this.nextSlot.on("pointerdown", this.addScore, this);

    this.remove = this.add.image(65, 1340, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.remove.displayWidth = 100;
    this.remove.displayHeight = 100;
    this.removeText = this.add.bitmapText(65, 1340, 'topaz', 'R', 70).setOrigin(.5).setTint(0xecf0f1);
    this.remove.on('pointerdown', function() {
      if (this.bonusCount >= 5) {
        this.destroyTile = true;
        this.remove.setTint(0xe74c3c);
        this.removeText.setTint(0xe74c3c);
        // this.remove.disableInteractive()
        this.bonusCount -= 5;
        this.bonusCountText.setText('Bonus: ' + this.bonusCount)
      }
    }, this)




    this.removeX1 = this.add.image(195, 1340, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.removeX1.displayWidth = 100;
    this.removeX1.displayHeight = 100;
    this.removeX1Text = this.add.bitmapText(195, 1340, 'topaz', 'X', 70).setOrigin(.5).setTint(0xecf0f1);
    this.removeX1.on('pointerdown', function() {
      if (this.bonusCount >= 5) {
        this.destroyX = true;
        this.removeX1.setTint(0xe74c3c)
        this.removeX1Text.setTint(0xe74c3c)
        //this.removeX1.disableInteractive();
        this.bonusCount -= 5;
        this.bonusCountText.setText('Bonus: ' + this.bonusCount)
      }
    }, this)

    this.shuffleBut = this.add.image(325, 1340, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.shuffleBut.displayWidth = 100;
    this.shuffleBut.displayHeight = 100;
    this.shuffleButText = this.add.bitmapText(315, 1340, 'topaz', 'Sh', 70).setOrigin(.5).setTint(0xecf0f1);
    this.shuffleBut.on('pointerdown', function() {
      if (this.bonusCount >= 5) {
        this.shuffle();
        this.shuffleBut.setTint(0xecf0f1)
        this.shuffleButText.setTint(0xecf0f1)
        //this.removeX1.disableInteractive();
        this.bonusCount -= 5;
        this.bonusCountText.setText('Bonus: ' + this.bonusCount)
        var tween = this.tweens.add({
          targets: [this.shuffleBut, this.shuffleButText],
          scale: .4,
          duration: 100,
          yoyo: true
        })
      }
    }, this)






    this.save = this.add.image(715, 1340, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.save.displayWidth = 100;
    this.save.displayHeight = 100;
    this.saveText = this.add.bitmapText(715, 1340, 'topaz', 'S', 70).setOrigin(.5).setTint(0xecf0f1);
    this.save.on('pointerdown', function() {
      this.saveGame();
      var tween = this.tweens.add({
        targets: [this.save, this.saveText],
        scale: .4,
        duration: 100,
        yoyo: true
      })



      // this.save.setTint(0xe74c3c)
      // this.saveText.setTint(0xe74c3c)
    }, this)



    this.scoreText = this.add.bitmapText(50, 250, 'topaz', this.score, 90).setOrigin(0, .5).setTint(0xecf0f1);
    this.bonusCountText = this.add.bitmapText(50, 325, 'topaz', 'Bonus: ' + this.bonusCount, 40).setOrigin(0, .5).setTint(0xecf0f1);


    this.popUpText = this.add.bitmapText(-50, -50, 'topaz', '', 60).setOrigin(.5).setTint(0xecf0f1).setAlpha(0);
    this.bonusCoin = this.add.image(0, 0, 'blank').setInteractive().setTint(0xe74c3c).setAlpha(0);
    this.bonusCoin.displayWidth = 50;
    this.bonusCoin.displayHeight = 50;


    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update() {

  }
  createGrid() {
    this.grid = [];
    this.upgradeMax = gridGameData.upgradeMax;
    //this.fieldArray = [];
    // this.fieldGroup = this.add.group();
    // console.log('saveval ' + gridGameData.grid[2][2].value)
    for (var i = 0; i < 5; i++) {
      this.grid[i] = [];
      for (var j = 0; j < 5; j++) {

        var tileXPos = this.xOffset + j * (this.tileSize + 15) + this.tileSize / 2;
        var tileYPos = this.yOffset + i * (this.tileSize + 15) + this.tileSize / 2;
        var saveValue = gridGameData.grid[i][j].value
        var saveUp = gridGameData.grid[i][j].upgrade

        var two = this.add.sprite(tileXPos, tileYPos, 'blankoutline').setTint(this.colors.tileEmpty);
        two.displayWidth = 140;
        two.displayHeight = 140;

        var tileText = this.add.bitmapText(tileXPos, tileYPos, 'topaz', '', 100).setOrigin(.5).setTint(this.colors.tileNormal);
        if (saveValue > 0) {
          tileText.setText(saveValue)
          if (saveUp < this.upgradeMax) {
            two.setTint(this.colors.tileNormal)
          } else {
            two.setTint(this.colors.tileUpgrade)
            tileText.setTint(this.colors.tileUpgrade)
          }
        } else if (saveValue == -1) {
          tileText.setText('X')
          two.setTint(this.colors.tileX)
          tileText.setTint(this.colors.tileX)
        }
        // two.alpha = 0;
        //two.visible = 0;
        //  this.fieldGroup.add(two);
        this.grid[i][j] = {
          tileValue: saveValue,
          tileText: tileText,
          tileSprite: two,
          canUpgrade: saveUp,
          hasBonus: false
        }
      }
    }
  }
  addBlocks(count) {
    let added = 0;
    let coo, val;
    while (added < count) {
      coo = this.getEmptySpace();

      this.grid[coo.r][coo.c].tileValue = -1;
      this.grid[coo.r][coo.c].tileText.setText('X')
      this.grid[coo.r][coo.c].tileSprite.setTint(this.colors.tileX)
      this.grid[coo.r][coo.c].tileText.setTint(this.colors.tileX)

      //this.grid[index].tileSprite.setTint(0x111111)
      added++;
    }
    console.log('tiless: ' + added)
  }
  addStartingTiles(count) {
    let added = 0;
    let coo, val;
    while (added < count) {

      coo = this.getEmptySpace();
      val = Phaser.Math.Between(1, 3)
      this.grid[coo.r][coo.c].tileValue = val;
      this.grid[coo.r][coo.c].tileText.setText(val)
      this.grid[coo.r][coo.c].tileSprite.setTint(this.colors.tileNormal);
      //this.grid[index].tileSprite.setTint(0x111111)
      added++;
    }
    console.log('tiless: ' + added)
  }
  getEmptySpace() {
    var clear = false;
    let one = Phaser.Math.Between(0, 4)
    let two = Phaser.Math.Between(0, 4)
    let rnd = { r: one, c: two };
    while (!clear) {
      one = Phaser.Math.Between(0, 4)
      two = Phaser.Math.Between(0, 4)
      rnd = { r: one, c: two };
      if (this.grid[rnd.r][rnd.c].tileValue == 0) {
        clear = true
      }
    }
    return rnd;
    // return {r: 2, c: 3};
  }
  pickTile(e) {
    var legalMove = false;
    var posX = e.x - this.xOffset;
    var posY = (e.y - this.yOffset);
    var pickedRow = Math.floor(posY / (this.tileSize + 15));
    var pickedCol = Math.floor(posX / (this.tileSize + 15));

    if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < 5 && pickedCol < 5) {
      var pickedTile = this.grid[pickedRow][pickedCol];
      console.log('[' + pickedRow + '][' + pickedCol + ']' + ', value:' + pickedTile.tileValue + ', upgrade:' + pickedTile.canUpgrade)
      if (pickedTile.tileValue == 0) {
        pickedTile.tileSprite.setTint(0x16a085);
        pickedTile.tileValue = this.nextSlot.value;
        pickedTile.tileText.setText(this.nextSlot.value);
        legalMove = true;
        var tween = this.tweens.add({
          targets: this.nextNum,
          scale: .1,
          duration: 200,
          yoyo: true

        })

      } else if (pickedTile.tileValue > 0) {
        if (this.destroyTile) {
          pickedTile.tileSprite.setTint(0x7f8c8d);
          pickedTile.tileValue = 0;
          pickedTile.tileText.setText('');
          pickedTile.tileText.setTint(0x16a085);
          pickedTile.canUpgrade = true;
          this.destroyTile = false;
          this.remove.setTint(0xecf0f1)
          this.removeText.setTint(0xecf0f1)
        } else if (pickedTile.canUpgrade < this.upgradeMax) {

          pickedTile.tileSprite.setTint(this.colors.tileUpgrade);
          pickedTile.tileValue = this.nextSlot.value + pickedTile.tileValue;
          pickedTile.tileText.setText(pickedTile.tileValue);
          pickedTile.tileText.setTint(this.colors.tileUpgrade);
          pickedTile.canUpgrade++;

          legalMove = true;
        }

      } else if (pickedTile.tileValue == -1) {
        if (this.destroyX) {
          var tween = this.tweens.add({
            targets: pickedTile.tileText,
            scale: 0,
            duration: 100,
            onCompleteScope: this,
            onComplete: function() {
              pickedTile.tileSprite.setTint(this.colors.tileEmpty);
              pickedTile.tileValue = 0;
              pickedTile.tileText.setText('');
              pickedTile.tileText.setTint(this.colors.tileNormal);
              pickedTile.tileText.setScale(1)
            }
          })


          pickedTile.canUpgrade = true;
          this.removeX1.setTint(0xecf0f1)
          this.removeX1Text.setTint(0xecf0f1)
          this.destroyX = false;
        }
      }

      if (legalMove) {
        this.mergeCount = 0;
        this.tempScore = 0;
        this.tempScore += pickedTile.tileValue;
        this.merge(pickedRow, pickedCol, pickedTile.tileValue);

        this.addNumberPopUp(pickedTile.tileSprite.x, pickedTile.tileSprite.y, tempScore)


        this.score += this.tempScore;
        this.levelScore += this.tempScore;
        if (this.mergeCount > 1) {
          console.log(this.mergeCount)
          this.collectBonus(pickedTile.tileSprite.x, pickedTile.tileSprite.y, this.mergeCount)
        }

        //  this.score += this.removeTiles(pickedRow, pickedCol);
        this.numbers = this.updateGUI(this.numbers, this.score)

        this.nextSlot.value = this.nextSlot2.value;
        this.nextNum.setText(this.nextSlot2.value);

        this.nextSlot2.value = this.nextSlot3.value;
        this.nextNum2.setText(this.nextSlot3.value);
        this.drawNumbers(this.numbers, false)
        this.checkBoard()
      }

    }
  }

  merge(row, col, value) {
    this.filled = [];
    this.filled.length = 0;
    var num = 0
    this.floodFill(row, col, value);
    if (this.filled.length > 3) {
      this.mergeCount++
      this.grid[row][col].tileValue++
      this.grid[row][col].tileText.setText(this.grid[row][col].tileValue)
      var tween = this.tweens.add({
        targets: this.grid[row][col].tileSprite,
        scale: 1.8,
        duration: 200,
        yoyo: true,
        onCompleteScope: this,
        onComplete: function() {
          this.collectBonus(this.grid[row][col].tileSprite.x, this.grid[row][col].tileSprite.y, this.filled.length)
        }
      })

      this.removeValues(row, col, this.grid[row][col].tileValue)
      num = value * this.filled.length
    }
    // console.log('mergecount ' + this.mergeCount)

    // console.log('merge' + this.filled.length)
    this.tempScore += value * num;
  }
  floodFill(row, col, value) {
    if (row < 0 || col < 0 || row > 4 || col > 4) { return }
    if (this.grid[row][col].tileValue == value && !this.pointInArray({ r: row, c: col })) {
      this.filled.push({ r: row, c: col });
      this.floodFill(row + 1, col, value);
      this.floodFill(row - 1, col, value);
      this.floodFill(row, col + 1, value);
      this.floodFill(row, col - 1, value);
    }
  }
  pointInArray(p) {
    for (var i = 1; i < this.filled.length; i++) {
      if (this.filled[i].r == p.r && this.filled[i].c == p.c) {
        return true;
      }
    }
    return false;
  }
  removeValues(row, col, newVal) {
    console.log(this.filled)
    for (var i = 0; i < this.filled.length; i++) {
      if (this.filled[i].r == row && this.filled[i].c == col) {

      } else {
        var tile = this.grid[this.filled[i].r][this.filled[i].c];
        tile.tileSprite.setTint(0x7f8c8d);
        tile.tileValue = 0;
        tile.tileText.setText('');
        tile.tileText.setTint(0x16a085);
        if (tile.canUpgrade > 0) {
          tile.canUpgrade = 0
          this.collectBonus(tile.tileSprite.x, tile.tileSprite.y, 1)
        }

      }
    }
    var timer = this.time.addEvent({
      delay: 500,
      callbackScope: this,
      callback: function() {
        this.merge(row, col, newVal)
      }
    })

  }
  removeTiles(row, col) {
    var score = 0;
    if (this.removeRow(row)) {
      for (var i = 0; i < 5; i++) {
        var tile = this.grid[row][i];
        score += tile.tileValue;
        tile.tileSprite.setTint(0x7f8c8d);
        tile.tileValue = 0;
        tile.tileText.setText('');
        tile.tileText.setTint(0x16a085);
        tile.canUpgrade = true;
      }
    }
    if (this.removeCol(col)) {
      for (var i = 0; i < 5; i++) {
        var tile = this.grid[i][col];
        score += tile.tileValue;
        tile.tileSprite.setTint(0x7f8c8d);
        tile.tileValue = 0;
        tile.tileText.setText('');
        tile.tileText.setTint(0x16a085);
        tile.canUpgrade = true;
      }
    }
    return score
  }
  removeRow(row) {
    var value = this.grid[row][0].tileValue;
    if (value == 0) {
      return false;
    }
    for (var i = 1; i < 5; i++) {
      if (this.grid[row][i].tileValue != value) {
        return false;
      }
    }
    return true;
  }
  removeCol(col) {
    var value = this.grid[0][col].tileValue;
    if (value == 0) {
      return false;
    }
    for (var i = 1; i < 5; i++) {
      if (this.grid[i][col].tileValue != value) {
        return false;
      }
    }
    return true;
  }

  addNumberPopUp(x, y, text) {
    this.popUpText.setText('+' + text);
    this.popUpText.setPosition(x, y);
    this.popUpText.setAlpha(1);
    var tween = this.tweens.add({
      targets: this.popUpText,
      y: '-=500',
      alpha: 0,
      duration: 1000
    })
  }
  printNumbers(n) {
    var numText = '';
    for (var i = 1; i < n + 1; i++) {
      numText += i + ' ';
    }

    this.numText.setText(numText);


  }
  updateGUI(n, s) {
    console.log(n * (n - 1) * (n - 2))
    if (s > n * (n - 1) * (n - 2)) {

      //n++
    }
    if (this.levelScore >= this.levelGoal) {
      this.level++;
      if (this.level > 3) {
        n++;
      }

      if (this.level == 1) {
        this.addStartingTiles(this.startingTiles);
      }
      this.levelScore = 0;
      this.levelGoal += this.level * 100;
      this.levelText.setText('L' + this.level)
      this.nextLevelText.setText(this.level + 1)
      var ran = Phaser.Math.Between(1, 3)
      this.addBlocks(ran);
    }
    this.printNumbers(n);
    this.scoreText.setText(s);
    this.progressBar.displayWidth = this.levelBar.displayWidth * (this.levelScore / this.levelGoal);
    return n
  }

  collectBonus(x, y, count) {
    this.bonusCount += count;

    this.bonusCoin.setPosition(x, y);
    this.bonusCoin.setAlpha(1);
    this.bonusCountText.setText('Bonus: ' + this.bonusCount)
    var tween = this.tweens.add({
      targets: this.bonusCoin,
      y: '-=500',
      alpha: 0,
      duration: 3000
    })
  }

  shuffle() {

    var collectGrid = [];
    for (var i = 0; i < 5; i++) {
      collectGrid[i] = [];
      for (var j = 0; j < 5; j++) {

        collectGrid[i][j] = {
          value: this.grid[i][j].tileValue,
          upgrade: this.grid[i][j].canUpgrade
        }
        this.grid[i][j].tileSprite.setTint(this.colors.tileUpgrade)
        this.grid[i][j].tileText.setTint(this.colors.tileNormal)
        this.grid[i][j].tileText.setText('')
      }
    }
    Phaser.Utils.Array.Shuffle(collectGrid)
    for (var i = 0; i < 5; i++) {

      for (var j = 0; j < 5; j++) {


        this.grid[i][j].tileValue = collectGrid[i][j].value;
        this.grid[i][j].canUpgrade = collectGrid[i][j].upgrade;
        if (this.grid[i][j].tileValue > 0) {
          this.grid[i][j].tileText.setText(this.grid[i][j].tileValue)
          if (this.grid[i][j].canUpgrade) {
            this.grid[i][j].tileSprite.setTint(this.colors.tileNormal)
            this.grid[i][j].tileText.setTint(this.colors.tileNormal)

          } else {
            this.grid[i][j].tileSprite.setTint(this.colors.tileUpgrade)
            this.grid[i][j].tileText.setTint(this.colors.tileUpgrade)
          }
        } else if (this.grid[i][j].tileValue == -1) {
          this.grid[i][j].tileText.setText('X')
          this.grid[i][j].tileSprite.setTint(this.colors.tileX)
          this.grid[i][j].tileText.setTint(this.colors.tileX)
        } else {
          this.grid[i][j].tileSprite.setTint(this.colors.tileEmpty)
        }
      }
    }

  }

  drawNumbers(max, firstRun) {
    var n = Math.floor(Math.random() * max) + 1;
    this.nextNum3.setText(n);
    this.nextSlot3.value = n;
    if (firstRun) {
      var n = Math.floor(Math.random() * max) + 1;
      this.nextSlot2.value = n;
      this.nextNum2.setText(n);
      var n = Math.floor(Math.random() * max) + 1;
      this.nextSlot.value = n;
      this.nextNum.setText(n);
    }
  }
  checkBoard() {
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        var tile = this.grid[i][j];
        if (tile.tileValue == 0 || tile.canUpgrade) {
          return
        }
      }
    }
    alert('lose')
    gameData.plusLast = this.score;

    if (this.score > gameData.plusHigh) {

      gameData.gridPlusHigh = this.score;
    }
    this.saveSettings();
  }
  addScore() {
    console.log('clicked')
    this.events.emit('score');
  }
  saveGame() {

    var saveGrid = [];
    for (var i = 0; i < 5; i++) {
      saveGrid[i] = [];
      for (var j = 0; j < 5; j++) {

        saveGrid[i][j] = {
          value: this.grid[i][j].tileValue,
          upgrade: this.grid[i][j].canUpgrade
        }
      }
    }

    /* defaultGridGameData = {
       score: 0,
       numbers: 3,
       level: 0,
       bonus: 0,
       grid: []
     }*/
    gridGameData.score = this.score;
    gridGameData.numbers = this.numbers;
    gridGameData.level = this.level;
    gridGameData.bonus = this.bonusCount;
    gridGameData.grid = saveGrid;
    gridGameData.upgradeMax = this.upgradeMax;
    this.saveSettings();

  }
  saveSettings() {
    localStorage.setItem('gridData', JSON.stringify(gridGameData));
    localStorage.setItem('numbersData', JSON.stringify(gameData));

  }
}