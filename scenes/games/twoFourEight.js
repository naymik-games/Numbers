let gameOptions248 = {

  gemSize: 150,
  rows: 5,
  cols: 5,

  fallSpeed: 100,
  destroySpeed: 200,
  diagonal: false,

  boardOffset: {
    x: 40,
    y: 370
  }
}
let score = 0;
let tempScore = 0;

/////////////////////////////////////////////
class twoFourEight extends Phaser.Scene {
  constructor() {
    super("twoFourEight");
  }
  preload() {

  }
  create() {
    this.cameras.main.setBackgroundColor(0x000000);
    //this.cameras.main.setBackgroundColor(0xf0e0d1);

    gameOptions248.gemSize = (game.config.width - 80) / gameOptions248.cols;
    //this.colors = [0xa8324e, 0x32a85a, 0x326ba8, 0xa86432, 0xa232a8, 0xa8324e, 0x32a85a, 0x326ba8, 0xa86432, 0xa232a8, 0xa8324e, 0x32a85a, 0x326ba8, 0xa86432, 0xa232a8, 0xa8324e, 0x32a85a, 0x326ba8, 0xa86432, 0xa232a8]
    this.numbers = [2, 2, 2, 4, 4, 4, 8, 8];
    this.addNumbers = [128, 64, 32, 16];
    this.bg = this.add.image(20, gameOptions248.boardOffset.y - 20, 'blank').setOrigin(0).setTint(0xbbada0);
    this.bg.displayWidth = game.config.width - 40;
    this.bg.displayHeight = (gameOptions248.gemSize * gameOptions248.rows) + 40;

    this.colors = [0xe4c5af, 0x74a57f, 0x077187, 0xdc4151, 0x00bfb2, 0xdb7f67, 0xe0efde, 0xaa4465, 0x823c71, 0x85baa1, 0x1c0b19]
    this.canPick = true;
    this.dragging = false;
    this.draw3 = new Draw3({
      rows: gameOptions248.rows,
      columns: gameOptions248.cols,
      items: 6
    });
    this.draw3.generateField(this.numbers);
    this.drawField();

    this.scoreText = this.add.bitmapText(450, 65, 'topaz', '0', 100).setOrigin(.5).setTint(0x585656);


    this.scoreGoal = 500;
    this.level = 1
    this.nextLevel = this.level + 1;



    this.currentLevelTile = this.add.sprite(150, 150, "circle").setTint(this.colors[this.level]).setDepth(1);
    this.currentLevelTile.displayWidth = 100;
    this.currentLevelTile.displayHeight = 100;
    this.currentLevelText = this.add.bitmapText(this.currentLevelTile.x, this.currentLevelTile.y, 'topaz', this.level, 80).setOrigin(.5).setTint(0x000000).setDepth(2);

    this.nextLevelTile = this.add.sprite(game.config.width - 150, 150, "circle").setTint(this.colors[this.nextLevel]).setDepth(1);
    this.nextLevelTile.displayWidth = 150;
    this.nextLevelTile.displayHeight = 150;
    this.nextLevelText = this.add.bitmapText(this.nextLevelTile.x, this.nextLevelTile.y, 'topaz', this.nextLevel, 100).setOrigin(.5).setTint(0x000000).setDepth(2);

    this.levelBarWidth = (this.nextLevelTile.x - this.currentLevelTile.x) - 80;
    this.levelBarBack = this.add.image(this.currentLevelTile.x + 40, this.currentLevelTile.y, 'blank').setOrigin(0, .5).setTint(0xbbada0);
    this.levelBarBack.displayWidth = this.levelBarWidth;
    this.levelBarBack.displayHeight = 50;


    this.levelBarProgress = this.add.image(this.currentLevelTile.x, this.currentLevelTile.y, 'blank').setOrigin(0, .5).setTint(this.colors[this.level]);
    this.levelBarProgress.displayWidth = 0;
    this.levelBarProgress.displayHeight = 50;


    this.totalTile = this.add.sprite(450, gameOptions248.boardOffset.y - 115, "circle").setTint(0x777777);
    this.totalTile.displayWidth = 125;
    this.totalTile.displayHeight = 125;
    this.tileText = this.add.bitmapText(450, gameOptions248.boardOffset.y - 115, 'topaz', '0', 60).setOrigin(.5).setTint(0x000000);

    this.button1 = this.add.sprite(100, 1450, "circle").setTint(this.colors[8]).setDepth(1).setInteractive();
    this.button1.displayWidth = 150;
    this.button1.displayHeight = 150;
    this.button1.on('pointerdown', function () {
      this.cameras.main.setBackgroundColor(this.colors[9]);
      this.button1Flag = true;
    }, this)

    this.button2 = this.add.sprite(450, 1450, "circle").setTint(this.colors[7]).setDepth(1).setInteractive();
    this.button2.displayWidth = 150;
    this.button2.displayHeight = 150;
    this.button2.on('pointerdown', function () {
      this.cameras.main.setBackgroundColor(this.colors[11]);

    }, this)

    this.input.on("pointerdown", this.gemSelect, this);
    this.input.on("pointermove", this.drawPath, this);
    this.input.on("pointerup", this.removeGems, this);
  }

  scoreUpdate() {

    this.scoreText.setText(score)
    this.levelBarProgress.displayWidth = this.levelBarWidth * (tempScore / this.scoreGoal)
    if (tempScore >= this.scoreGoal) {
      // this.scoreGoal += 500;

      this.level++;
      this.nextLevel++;
      tempScore = 0;
      if (this.level % 4 == 0) {
        var temp = this.addNumbers.pop();
        this.numbers.push(temp)
      }
      this.levelBarProgress.displayWidth = this.levelBarWidth * (tempScore / this.scoreGoal)
      this.levelBarProgress.setTint(this.colors[this.level])
      this.nextLevelText.setText(this.nextLevel);
      this.currentLevelText.setText(this.level);
      this.currentLevelTile.setTint(this.colors[this.level])
      this.nextLevelTile.setTint(this.colors[this.nextLevel])
      this.damageEmit(this.currentLevelText.x, this.currentLevelText.y, this.colors[this.Level])
    }
  }
  getColor(value) {
    var num;
    switch (value) {
      case 2:
        num = 0;
        break;
      case 4:
        num = 1;
        break;
      case 8:
        num = 2;
        break;
      case 16:
        num = 3;
        break;
      case 32:
        num = 4;
        break;
      case 64:
        num = 5;
        break;
      case 128:
        num = 6;
        break;
      case 256:
        num = 7;
        break;
      case 512:
        num = 7;
        break;
      case 1024:
        num = 8;
        break;
      case 2048:
        num = 9;
        break;
      default:
        0
    }
    return this.colors[num]
  }
  drawField() {
    this.poolArray = [];
    this.arrowArray = [];
    for (let i = 0; i < this.draw3.getRows(); i++) {
      this.arrowArray[i] = [];
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        let posX = gameOptions248.boardOffset.x + gameOptions248.gemSize * j + gameOptions248.gemSize / 2;
        let posY = gameOptions248.boardOffset.y + gameOptions248.gemSize * i + gameOptions248.gemSize / 2
        let gem = this.add.sprite(posX, posY, "circle").setTint(this.getColor(this.draw3.valueAt(i, j)));
        gem.displayWidth = gameOptions248.gemSize;
        gem.displayHeight = gameOptions248.gemSize;
        var tileText = this.add.bitmapText(posX, posY, 'topaz', this.draw3.valueAt(i, j), 60).setOrigin(.5).setTint(0x000000);
        gem.text = tileText;
        let arrow = this.add.sprite(posX, posY, "arrows");
        arrow.displayWidth = gameOptions248.gemSize * 3;
        arrow.displayHeight = gameOptions248.gemSize * 3;
        arrow.setDepth(2);
        arrow.visible = false;
        this.arrowArray[i][j] = arrow;
        this.draw3.setCustomData(i, j, gem);
      }
    }
  }
  gemSelect(pointer) {

    if (this.canPick) {
      let row = Math.floor((pointer.y - gameOptions248.boardOffset.y) / gameOptions248.gemSize);
      let col = Math.floor((pointer.x - gameOptions248.boardOffset.x) / gameOptions248.gemSize);
      if (this.draw3.validPick(row, col)) {
        if (this.button1Flag) {
          this.removeValue(this.draw3.valueAt(row, col));
          this.button1Flag = false;
          this.cameras.main.setBackgroundColor(0xf0e0d1);

        }
        this.canPick = false;
        this.draw3.putInChain(row, col)
        this.draw3.customDataOf(row, col).alpha = 0.5;
        this.totalTile.setTint(this.getColor(this.draw3.getChainValue()));
        this.dragging = true;
      }
    }
  }
  drawPath(pointer) {
    if (this.dragging) {
      let row = Math.floor((pointer.y - gameOptions248.boardOffset.y) / gameOptions248.gemSize);
      let col = Math.floor((pointer.x - gameOptions248.boardOffset.x) / gameOptions248.gemSize);
      if (this.draw3.validPick(row, col)) {
        let distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.draw3.customDataOf(row, col).x, this.draw3.customDataOf(row, col).y);
        if (distance < gameOptions248.gemSize * 0.4) {
          if (this.draw3.continuesChain(row, col)) {
            this.draw3.customDataOf(row, col).alpha = 0.5;
            this.draw3.putInChain(row, col);
            var newValue = this.draw3.getNewValue(this.draw3.getChainValue(), this.draw3.getChainLength());
            this.tileText.setText(newValue)
            this.totalTile.setTint(this.getColor(newValue));
            this.displayPath()
          }
          else {
            if (this.draw3.backtracksChain(row, col)) {
              let removedItem = this.draw3.removeLastChainItem();
              this.draw3.customDataOf(removedItem.row, removedItem.column).alpha = 1;
              this.hidePath();
              this.displayPath();
            }
          }
        }
      }
    }
  }
  removeGems() {
    if (this.dragging) {
      this.hidePath();
      this.dragging = false;
      if (this.draw3.getChainLength() < 2) {
        let chain = this.draw3.emptyChain();
        chain.forEach(function (item) {
          this.draw3.customDataOf(item.row, item.column).alpha = 1;
        }.bind(this));
        this.canPick = true;
      }
      else {
        let last = this.draw3.doMerge();
        var tile = this.draw3.customDataOf(last.row, last.column)
        tile.setTint(this.getColor(this.draw3.valueAt(last.row, last.column)))

        this.damageEmit(tile.x, tile.y, this.getColor(this.draw3.valueAt(last.row, last.column)))
        var tween = this.tweens.add({
          targets: tile,
          scale: 2,
          duration: 100,
          yoyo: true,

        })
        let gemsToRemove = this.draw3.destroyChain();
        let destroyed = 0;
        this.scoreUpdate();
        gemsToRemove.forEach(function (gem) {
          this.poolArray.push(this.draw3.customDataOf(gem.row, gem.column))
          destroyed++;
          this.tweens.add({
            targets: [this.draw3.customDataOf(gem.row, gem.column), this.draw3.customDataOf(gem.row, gem.column).text],
            alpha: 0,
            duration: gameOptions248.destroySpeed,
            callbackScope: this,
            onComplete: function (event, sprite) {
              destroyed--;
              if (destroyed == 0) {
                this.makeGemsFall();
              }
            }
          });
        }.bind(this));
      }
    }
  }
  makeGemsFall() {
    let moved = 0;
    let fallingMovements = this.draw3.arrangeBoardAfterChain();
    fallingMovements.forEach(function (movement) {
      moved++;
      this.tweens.add({
        targets: [this.draw3.customDataOf(movement.row, movement.column), this.draw3.customDataOf(movement.row, movement.column).text],
        y: this.draw3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions248.gemSize,
        duration: gameOptions248.fallSpeed * Math.abs(movement.deltaRow),
        callbackScope: this,
        onComplete: function () {
          moved--;
          if (moved == 0) {
            this.canPick = true;
          }
        }
      })
    }.bind(this));
    let replenishMovements = this.draw3.replenishBoard(this.numbers);
    replenishMovements.forEach(function (movement) {
      moved++;
      let sprite = this.poolArray.pop();
      sprite.alpha = 1;
      sprite.text.alpha = 1;
      sprite.setTint(this.getColor(this.draw3.valueAt(movement.row, movement.column)))
      sprite.y = gameOptions248.boardOffset.y + gameOptions248.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions248.gemSize / 2;
      sprite.x = gameOptions248.boardOffset.x + gameOptions248.gemSize * movement.column + gameOptions248.gemSize / 2,
        sprite.text.y = gameOptions248.boardOffset.y + gameOptions248.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions248.gemSize / 2;
      sprite.text.x = gameOptions248.boardOffset.x + gameOptions248.gemSize * movement.column + gameOptions248.gemSize / 2,
        sprite.text.setText(this.draw3.valueAt(movement.row, movement.column));
      this.draw3.setCustomData(movement.row, movement.column, sprite);
      this.tweens.add({
        targets: [sprite, sprite.text],
        y: gameOptions248.boardOffset.y + gameOptions248.gemSize * movement.row + gameOptions248.gemSize / 2,
        duration: gameOptions248.fallSpeed * movement.deltaRow,
        callbackScope: this,
        onComplete: function () {
          moved--;
          if (moved == 0) {
            if (this.draw3.stillPlayable(2)) {

              this.canPick = true;

            }
            else {
              alert('game over')
            }
            this.canPick = true;
          }
        }
      });
    }.bind(this))
  }
  displayPath() {
    let path = this.draw3.getPath();
    path.forEach(function (item) {
      this.arrowArray[item.row][item.column].visible = true;
      this.arrowArray[item.row][item.column].setTint(this.getColor(this.draw3.getChainValue()))
      if (!this.draw3.isDiagonal(item.direction)) {
        this.arrowArray[item.row][item.column].setFrame(0);
        this.arrowArray[item.row][item.column].angle = 90 * Math.log2(item.direction);
      }
      else {
        this.arrowArray[item.row][item.column].setFrame(1);
        this.arrowArray[item.row][item.column].angle = 90 * (item.direction - 9 + ((item.direction < 9) ? (item.direction / 3) - 1 - item.direction % 2 : 0));
      }
    }.bind(this))
  }
  hidePath() {
    this.arrowArray.forEach(function (item) {
      item.forEach(function (subItem) {
        subItem.visible = false;
        subItem.angle = 0;
      })
    })
  }

  removeValue(value) {
    let result = []
    for (let i = this.draw3.getRows() - 2; i >= 0; i--) {
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        if (this.draw3.valueAt(i, j) == value) {
          this.draw3.putInChain(i, j)
        }

      }
    }
    this.removeGems();
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

    /* let default248GameData = {
   score: 0,
   level: 0,
   rows: 5,
     cols: 5,
   numbers: [2, 2, 2, 4, 4, 4, 8, 8],
   grid: null,
 }*/
    gridGameData.score = this.score;
    gridGameData.numbers = this.numbers;
    gridGameData.level = this.level;
    gridGameData.rows = 5,
      gridGameData.cols = 5,
      gridGameData.grid = saveGrid;
    this.saveSettings();

  }
  saveSettings() {
    localStorage.setItem('gridData', JSON.stringify(gridGameData));
    localStorage.setItem('numbersData', JSON.stringify(gameData));

  }


  blow(x, y) {
    var particles = this.add.particles('circle');
    var emitter = particles.createEmitter({
      speed: {
        min: 50,
        min: 50
      },
      scale: {
        start: 1,
        end: .25
      },
      alpha: {
        start: 1,
        end: 0
      },
      lifespan: 1000

    });
    emitter.explode(20, x, y)
  }

  damageEmit(objX, objY, tint) {
    var particlesColor = this.add.particles("circle");
    //.setTint(0x7d1414);
    var emitter = particlesColor.createEmitter({
      // particle speed - particles do not move
      // speed: 1000,
      // frame: { frames: [0, 1, 2, 3], cycle: true },

      speed: {
        min: 200,
        max: 200
      },
      // particle scale: from 1 to zero
      scale: {
        start: .2,
        end: .20
      },
      // particle alpha: from opaque to transparent
      alpha: {
        start: 1,
        end: .1
      },
      // particle frequency: one particle every 100 milliseconds
      //frequency: 50,
      // particle lifespan: 1 second
      tint: tint,
      radial: true,
      lifespan: 750
    });
    //emitter.tint.onChange(0x7d1414);
    emitter.explode(15, objX, objY);

  }



}

class Draw3 {

  // constructor, simply turns obj information into class properties and creates
  // an array called "chain" which will contain chain information
  constructor(obj) {
    if (obj == undefined) {
      obj = {}
    }
    this.rows = (obj.rows != undefined) ? obj.rows : 8;
    this.columns = (obj.columns != undefined) ? obj.columns : 7;
    this.items = (obj.items != undefined) ? obj.items : 6;
    this.chain = [];
  }

  // returns the number of rows in board
  getRows() {
    return this.rows;
  }

  // returns the number of columns in board
  getColumns() {
    return this.columns;
  }

  // generates the game field
  generateField(numbers) {
    this.gameArray = [];
    for (let i = 0; i < this.getRows(); i++) {
      this.gameArray[i] = [];
      for (let j = 0; j < this.getColumns(); j++) {
        let randomValue = Math.floor(Math.random() * numbers.length);
        this.gameArray[i][j] = {
          value: numbers[randomValue],
          isEmpty: false,
          row: i,
          column: j
        }
      }
    }
  }

  // returns true if the item at (row, column) is a valid pick
  validPick(row, column) {
    return row >= 0 && row < this.getRows() && column >= 0 && column < this.getColumns() && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
  }

  // returns the value of the item at (row, column), or false if it's not a valid pick
  valueAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].value;
  }
  setValue(row, column, value) {
    this.gameArray[row][column].value = value;
  }
  // sets a custom data of the item at (row, column)
  setCustomData(row, column, customData) {
    this.gameArray[row][column].customData = customData;
  }

  // returns the custom data of the item at (row, column)
  customDataOf(row, column) {
    return this.gameArray[row][column].customData;
  }

  // returns true if the item at (row, column) continues the chain
  continuesChain(row, column) {
    return this.getChainValue() == this.valueAt(row, column) && !this.isInChain(row, column) && this.areNext(row, column, this.getLastChainItem().row, this.getLastChainItem().column)
  }

  // returns true if the item at (row, column) backtracks the chain
  backtracksChain(row, column) {
    return this.getChainLength() > 1 && this.areTheSame(row, column, this.getNthChainItem(this.getChainLength() - 2).row, this.getNthChainItem(this.getChainLength() - 2).column)
  }

  // returns the n-th chain item
  getNthChainItem(n) {
    return {
      row: this.chain[n].row,
      column: this.chain[n].column
    }
  }

  // returns the path connecting all items in chain, as an object containing row, column and direction
  getPath() {
    let path = [];
    if (this.getChainLength() > 1) {
      for (let i = 1; i < this.getChainLength(); i++) {
        let deltaColumn = this.getNthChainItem(i).column - this.getNthChainItem(i - 1).column;
        let deltaRow = this.getNthChainItem(i).row - this.getNthChainItem(i - 1).row;
        let direction = 0
        direction += (deltaColumn < 0) ? Draw3.LEFT : ((deltaColumn > 0) ? Draw3.RIGHT : 0);
        direction += (deltaRow < 0) ? Draw3.UP : ((deltaRow > 0) ? Draw3.DOWN : 0);
        path.push({
          row: this.getNthChainItem(i - 1).row,
          column: this.getNthChainItem(i - 1).column,
          direction: direction
        });
      }
    }
    return path;
  }

  // returns an array with basic directions (UP, DOWN, LEFT, RIGHT) given a direction
  getDirections(n) {
    let result = [];
    let base = 1;
    while (base <= n) {
      if (base & n) {
        result.push(base);
      }
      base <<= 1;
    }
    return result;
  }

  // returns true if the number represents a diagonal movement
  isDiagonal(n) {
    return this.getDirections(n).length == 2;
  }

  // returns the last chain item
  getLastChainItem() {
    return this.getNthChainItem(this.getChainLength() - 1);
  }

  // returns chain length
  getChainLength() {
    return this.chain.length;
  }

  // returns true if the item at (row, column) is in the chain
  isInChain(row, column) {
    for (let i = 0; i < this.getChainLength(); i++) {
      let item = this.getNthChainItem(i)
      if (this.areTheSame(row, column, item.row, item.column)) {
        return true;
      }
    }
    return false;
  }

  // returns the value of items in the chain
  getChainValue() {
    return this.valueAt(this.getNthChainItem(0).row, this.getNthChainItem(0).column)
  }

  // puts the item at (row, column) in the chain
  putInChain(row, column) {
    this.chain.push({
      row: row,
      column: column
    })
  }

  // removes the last chain item and returns it
  removeLastChainItem() {
    return this.chain.pop();
  }

  // clears the chain and returns the items
  emptyChain() {
    let result = [];
    this.chain.forEach(function (item) {
      result.push(item);
    })
    this.chain = [];
    this.chain.length = 0;
    return result;
  }

  // clears the chain, set items as empty and returns the items
  destroyChain() {
    let result = [];
    //this.removeLastChainItem()


    this.chain.forEach(function (item) {
      result.push(item);
      this.setEmpty(item.row, item.column)
    }.bind(this))
    this.chain = [];
    this.chain.length = 0;
    return result;
  }

  // checks if the items at (row, column) and (row2, column2) are the same
  areTheSame(row, column, row2, column2) {
    return row == row2 && column == column2;
  }

  // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally, vertically or diagonally
  areNext(row, column, row2, column2) {
    var p1 = { x: row, y: column }
    var p2 = { x: row2, y: column2 }
    //return (Math.abs(row - row2) + Math.abs(column - column2) == 1) || (Math.abs(row - row2) == 1 && Math.abs(column - column2) == 1);

    if (gameOptions248.diagonal) {
      return (Math.abs(p1.x - p2.x) <= 1) && (Math.abs(p1.y - p2.y) <= 1);
    }
    else {
      return (Math.abs(p1.x - p2.x) == 1 && p1.y - p2.y == 0) || (Math.abs(p1.y - p2.y) == 1 && p1.x - p2.x == 0);
    }


  }

  // swap the items at (row, column) and (row2, column2) and returns an object with movement information
  swapItems(row, column, row2, column2) {
    let tempObject = Object.assign(this.gameArray[row][column]);
    this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
    this.gameArray[row2][column2] = Object.assign(tempObject);
    return [{
      row: row,
      column: column,
      deltaRow: row - row2,
      deltaColumn: column - column2
    },
    {
      row: row2,
      column: column2,
      deltaRow: row2 - row,
      deltaColumn: column2 - column
    }]
  }

  // set the item at (row, column) as empty
  setEmpty(row, column) {
    this.gameArray[row][column].isEmpty = true;
  }

  // returns true if the item at (row, column) is empty
  isEmpty(row, column) {
    return this.gameArray[row][column].isEmpty;
  }

  // returns the amount of empty spaces below the item at (row, column)
  emptySpacesBelow(row, column) {
    let result = 0;
    if (row != this.getRows()) {
      for (let i = row + 1; i < this.getRows(); i++) {
        if (this.isEmpty(i, column)) {
          result++;
        }
      }
    }
    return result;
  }
  doMerge() {
    var value = this.getChainValue()
    var count = this.getChainLength()
    var last = this.removeLastChainItem();
    var newValue = this.getNewValue(value, count);
    /* if (count % 2 == 0) {
       var newValue = value * count
     } else {
       var newValue = value * (count - 1)
     }*/
    //  console.log(Math.floor(count))

    this.customDataOf(last.row, last.column).setAlpha(1);
    //var newValue = value * count;

    tempScore += count * value;
    score += count * value;
    this.customDataOf(last.row, last.column).text.setText(newValue)
    this.setValue(last.row, last.column, newValue);
    return last;
  }
  getNewValue(value, count) {
    if (count <= 3) {
      var newValue = value * 2
    } else if (count >= 4 && count < 8) {
      var newValue = value * 4
    } else if (count >= 8 && count < 16) {
      var newValue = value * 8
    } else {
      var newValue = value * 16
    }
    return newValue
  }
  // arranges the board after a chain, making items fall down. Returns an object with movement information
  arrangeBoardAfterChain() {
    let result = []
    for (let i = this.getRows() - 2; i >= 0; i--) {
      for (let j = 0; j < this.getColumns(); j++) {
        let emptySpaces = this.emptySpacesBelow(i, j);
        if (!this.isEmpty(i, j) && emptySpaces > 0) {
          this.swapItems(i, j, i + emptySpaces, j)
          result.push({
            row: i + emptySpaces,
            column: j,
            deltaRow: emptySpaces,
            deltaColumn: 0
          });
        }
      }
    }
    return result;
  }

  // replenishes the board and returns an object with movement information
  replenishBoard(numbers) {
    let result = [];
    for (let i = 0; i < this.getColumns(); i++) {
      if (this.isEmpty(0, i)) {
        let emptySpaces = this.emptySpacesBelow(0, i) + 1;
        for (let j = 0; j < emptySpaces; j++) {
          let randomValue = Math.floor(Math.random() * numbers.length);
          result.push({
            row: j,
            column: i,
            deltaRow: emptySpaces,
            deltaColumn: 0
          });
          this.gameArray[j][i].value = numbers[randomValue];
          this.customDataOf(j, i).text.setText(randomValue)
          this.gameArray[j][i].isEmpty = false;
        }
      }
    }
    return result;
  }

  listConnectedItems(row, column) {
    if (!this.validPick(row, column) || this.gameArray[row][column].isEmpty) {
      return;
    }
    this.colorToLookFor = this.gameArray[row][column].value;
    this.floodFillArray = [];
    this.floodFillArray.length = 0;
    this.floodFill(row, column);
    return this.floodFillArray;
  }

  // returns the number of connected items starting at (row, column)
  countConnectedItems(row, column) {
    return this.listConnectedItems(row, column).length;
  }

  // removes all connected items starting at (row, column)
  removeConnectedItems(row, column) {
    let items = this.listConnectedItems(row, column);
    items.forEach(function (item) {
      this.gameArray[item.row][item.column].isEmpty = true;
    }.bind(this))
  }

  // returs true if in the board there is at least a move with a minimum minCombo items
  stillPlayable(minCombo) {
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (!this.isEmpty(i, j) && this.countConnectedItems(i, j) >= minCombo) {
          return true;
        }
      }
    }
    return false;
  }

  // returns the amount of non empty items on the board
  nonEmptyItems(minCombo) {
    let result = 0;
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (!this.isEmpty(i, j)) {
          result++;
        }
      }
    }
    return result;
  }

  // flood fill routine
  // http://www.emanueleferonato.com/2008/06/06/flash-flood-fill-implementation/
  floodFill(row, column) {
    if (!this.validPick(row, column) || this.isEmpty(row, column)) {
      return;
    }
    if (this.gameArray[row][column].value == this.colorToLookFor && !this.alreadyVisited(row, column)) {
      this.floodFillArray.push({
        row: row,
        column: column
      });
      this.floodFill(row + 1, column);
      this.floodFill(row - 1, column);
      this.floodFill(row, column + 1);
      this.floodFill(row, column - 1);
    }
  }

  alreadyVisited(row, column) {

    let found = false;

    this.floodFillArray.forEach(function (item) {
      if (item.row == row && item.column == column) {
        found = true;
      }
    });
    return found;
  }

}
Draw3.RIGHT = 1;
Draw3.DOWN = 2;
Draw3.LEFT = 4;
Draw3.UP = 8;
