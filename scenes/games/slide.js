let slideColors = [0xA6AB86, 0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E]

class Slide extends Phaser.Scene {
  constructor() {
    super("Slide");
  }
  preload() {


  }
  create() {
    //7,8,120,100 - 5,6,150,130
    this.boardWidth = 5
    this.boardHeight = 6
    this.dotSize = 150
    this.spriteSize = 130
    this.startCount = 9
    this.numberRange = [1, 4]
    this.chainRange = [1, 4]
    this.levelGoal = 200

    this.board = [];
    this.xOffset = (game.config.width - (this.dotSize * this.boardWidth)) / 2

    this.yOffset = 300


    this.chainSlots = []

    this.cameras.main.setBackgroundColor(0x333333);
    this.dots = this.add.group({

      maxSize: (this.boardWidth * this.boardHeight) + 30,

    });
    this.remove = false
    this.numText = this.add.bitmapText(15, 1400, 'topaz', '', 60).setOrigin(0, .5).setTint(0xecf0f1);
    this.board = new Board(this, this.boardWidth, this.boardHeight, this.numColors);
    this.board.makeBoard()
    console.log(this.board)

    this.drawBoard()
    this.generateChain()

    this.score = this.add.bitmapText(50, 50, 'topaz', this.board.score, 80).setOrigin(0, .5).setTint(0xfafafa);
    // this.scoreProgress = this.add.bitmapText(675, 50, 'topaz', this.board.scoreProgress, 80).setOrigin(0, .5).setTint(0xfafafa);
    this.matchCount = this.add.bitmapText(450, 50, 'topaz', this.board.matchCount, 80).setOrigin(0, .5).setTint(0xfafafa)
    this.matchIcon = this.add.image(400, 50, 'num_tiles', 33).setTint(slideColors[0]).setScale(.5).setAlpha(1).setInteractive()


    var progressBox = this.add.graphics();
    this.progressBar = this.add.graphics();
    progressBox.fillStyle(slideColors[0], 0.8);
    progressBox.fillRect(625, 30, 250, 50);
    /*  this.progressBar.clear();
     this.progressBar.fillStyle(slideColors[1], 1);
     this.progressBar.fillRect(635, 45, 230 * 0, 30); */

    this.removeButton = this.add.image(75, 1400, 'num_tiles', 32).setTint(slideColors[0]).setScale(.75).setAlpha(1).setInteractive()
    this.removeButton.on('pointerdown', function () {
      if (this.remove) {
        this.removeButton.setTint(slideColors[0])
        this.remove = false
      } else {
        if (this.board.matchCount >= 15) {
          this.removeButton.clearTint()
          this.remove = true
        } else {
          return
        }

      }

    }, this)

    this.input.on("pointerdown", this.dotSelect, this);
    this.input.on("pointermove", this.dotMove, this);
    this.input.on("pointerup", this.dotUp, this);
  }
  dotSelect(pointer) {

    this.lineArray = []
    this.rectArray = []
    let row = Math.floor((pointer.y - this.yOffset) / this.dotSize);
    let col = Math.floor((pointer.x - this.xOffset) / this.dotSize);

    if (this.board.validCoordinates(col, row) && this.remove && this.board.dots[col][row].value > 0) {
      console.log('remove')
      this.board.clearMatch2(this.board.dots[col][row].coordinates)
      this.remove = false
      this.removeButton.setTint(slideColors[0])
      this.board.matchCount -= 15
      this.matchCount.setText(this.board.matchCount)
      this.tweenMatch(0)
      return
    }
    if (this.remove) { return }
    if (!this.board.validCoordinates(col, row) || !this.board.canSelectDot(this.board.dots[col][row])) { return }
    console.log('row ' + row + ' col ' + col)
    this.board.dots[col][row].activate();
    this.board.dots[col][row].image.setFrame(this.board.chain[0])
    this.board.dragging = true;
    this.numText.setText(this.board.selectedDots.length)
  }
  dotMove(pointer) {
    if (this.board.dragging) {
      let row = Math.floor((pointer.y - this.yOffset) / this.dotSize);
      let col = Math.floor((pointer.x - this.xOffset) / this.dotSize);
      if (!this.board.validCoordinates(col, row)) { return }
      var coor = [col, row]
      var dot = this.board.findDot(coor)
      if (this.board.validDrag(dot)) {
        //new dot
        var line = this.add.line(null, null, this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, dot.image.x, dot.image.y, slideColors[0]).setOrigin(0);
        line.setLineWidth(10)
        this.lineArray.push(line)
        var rect = this.add.rectangle(dot.image.x, dot.image.y, 20, 20, slideColors[0])
        this.rectArray.push(rect)

        dot.activate();
        this.board.dots[col][row].image.setFrame(this.board.chain[this.board.selectedDots.length - 1])
        this.numText.setText(this.board.selectedDots.length)
      } else if (this.board.secondToLast(dot)) {
        //backtrack
        var line = this.lineArray.pop()
        line.setAlpha(0).destroy()
        var rect = this.rectArray.pop()
        rect.setAlpha(0).destroy()
        this.board.deactivateLastDot();
        //this.board.lastSelectedDot().image.setFrame(0)
        this.numText.setText(this.board.selectedDots.length)
      } /* else if (this.allowSquares && this.board.rightColor(dot) && this.board.isNeighbor(dot) && this.board.completeSquare(dot)) {
        //square
        var line = this.add.line(null, null, this.board.secondToLastSelectedDot().image.x, this.board.secondToLastSelectedDot().image.y, this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, dotColors[this.board.selectedColor]).setOrigin(0);
        line.setLineWidth(10)
        this.lineArray.push(line)
        var rect = this.add.rectangle(this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, 20, 20, dotColors[this.board.selectedColor])
        this.rectArray.push(rect)
        this.board.activateSquare(dot);
        //  this.squareBox.lineStyle(15, dotColors[this.board.selectedColor], 1);
        // this.squareBox.strokeRoundedRect(this.xOffset - 5, this.yOffset - 5, (this.dotSize * this.cols) + 10, (this.dotSize * this.rows + 10), 15);
      } */
    }
  }
  dotUp() {
    if (this.remove) {

      return
    }
    if (!this.board.dragging) { return }
    if (this.lineArray.length > 0) {
      this.lineArray.forEach(function (line) {
        line.destroy()
      }.bind(this))
      this.lineArray = []
    }
    if (this.rectArray.length > 0) {
      this.rectArray.forEach(function (rect) {
        rect.destroy()
      }.bind(this))
      this.rectArray = []
    }


    if (this.board.selectedDots.length == this.board.chain.length) {
      console.log('Yes!')
      this.board.setTiles()
      this.board.resetBoardKeep()
      var matches = this.board.findChainMatches()
      console.log(matches)
      if (matches) {
        this.tweenMatch(1)
      }
      this.generateChain()
      this.updateStats()

    } else {
      console.log('No!')
      this.board.resetBoard()
    }

  }
  generateChain() {
    this.board.chain = []
    for (var i = 0; i < this.chainSlots.length; i++) {
      this.chainSlots[i].setAlpha(0)
    }
    var newChainLength = Phaser.Math.Between(this.chainRange[0], this.chainRange[1])
    for (var j = 0; j < newChainLength; j++) {
      this.board.chain.push(Phaser.Math.Between(this.numberRange[0], this.numberRange[1]))
    }
    for (var i = 0; i < this.board.chain.length; i++) {
      this.chainSlots[i].setAlpha(1)
      this.chainSlots[i].setFrame(this.board.chain[i])
    }
  }
  drawBoard() {

    //console.log('making numbers')
    var placedB = 0
    while (placedB < this.startCount) {
      var randX = Phaser.Math.Between(0, this.boardWidth - 1)
      var randY = Phaser.Math.Between(0, this.boardHeight - 1)
      if (this.board.dots[randX][randY].value == 0) {
        //var ranCol = Phaser.Math.Between(1, slideColors.length - 1)
        //this.board.dots[randX][randY].image.setTint(slideColors[ranCol])
        var ranVal = Phaser.Math.Between(this.numberRange[0], this.numberRange[1])
        this.board.dots[randX][randY].image.setFrame(ranVal)
        this.board.dots[randX][randY].value = ranVal
        this.board.dots[randX][randY].selectable = false
        placedB++
      }
    }


    for (var i = 0; i < this.boardHeight; i++) {
      for (var j = 0; j < this.boardWidth; j++) {
        // var xpos = i*64 + 160;
        //  var ypos = 550 - j*64;
        let xpos = this.xOffset + this.dotSize * j + this.dotSize / 2;
        let ypos = this.yOffset + this.dotSize * i + this.dotSize / 2
        var dot = this.board.dots[j][i];
        //  console.log(dot)
        if (dot.image.x !== xpos || dot.image.y !== ypos) {
          //   var t = this.game.add.tween(dot).to({x: xpos, y: ypos}, 300).start();
          var t = this.tweens.add({
            targets: dot.image,
            x: xpos,
            y: ypos,
            duration: 300
          })
        }
      }
    }

    for (var i = 0; i < 5; i++) {
      let xpos = this.xOffset + (this.dotSize * .75) * i + (this.dotSize * .75) / 2;
      let ypos = this.yOffset - (this.dotSize * .75) * 1 + (this.dotSize * .75) / 2
      var slot = this.add.image(xpos, ypos, 'num_tiles', 0).setTint(slideColors[0]).setScale(.75).setAlpha(0)
      this.chainSlots.push(slot)
    }



  }
  updateStats() {
    this.score.setText(this.board.score)
    this.matchCount.setText(this.board.matchCount)

    if (this.board.scoreProgress >= this.levelGoal) {
      this.board.scoreProgress = 0
      this.nextLevel()
    }
    //this.scoreProgress.setText(this.board.scoreProgress)
    this.progressBar.clear();
    this.progressBar.fillStyle(slideColors[1], 1);
    this.progressBar.fillRect(635, 40, 230 * (this.board.scoreProgress / this.levelGoal), 30);
  }
  nextLevel() {
    this.numberRange[0]++
    this.numberRange[1]++
  }
  tweenMatch(scale) {
    var t = this.tweens.add({
      targets: this.matchIcon,
      scale: scale,
      duration: 200,
      yoyo: true
    })
  }

}


function sample(array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
}

function getLastElement(array) {
  return getLaterElements(array, 1);
}

function getSecondToLastElement(array) {
  return getLaterElements(array, 2);
}

function getLaterElements(array, index) {
  return array[array.length - index];
}

function deleteAt(array, index) {
  array.splice(index, 1);
}