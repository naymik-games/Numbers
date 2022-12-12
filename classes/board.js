let floodFillArray = []

class Board {
  constructor(scene, width, height, numColors) {
    this.width = width;
    this.height = height
    this.scene = scene
    this.dots = [];
    this.idCount = 0
    this.selectedColor = null
    this.selectedDots = []
    this.chain = null
    this.matches = []
    this.score = 0
    this.scoreProgress = 0
    this.matchCount = 0
    this.squareCompleted = false
    this.numColors = numColors
    this.redrawTheseColumns = {};
    this.newDots = []
    this.colorToLookFor = 0
  }

  makeBoard() {

    for (var xAxis = 0; xAxis < this.width; xAxis++) {
      this.makeColumn(xAxis);
    }
    // return html + htmlEnd;






  };

  makeColumn(xAxis) {

    var column = [];
    for (var yAxis = 0; yAxis < this.height; yAxis++) {
      var dot = this.addDot(xAxis, yAxis);
      column.push(dot);

    }
    this.dots.push(column);

  };
  addDot(x, y) {
    //var num = Phaser.Math.Between(0, slideColors.length - 1);
    var num = 0
    var id = this.idCount;
    var dot = new Dot(id, x, y, num, this, this.scene.dotSize)

    var dotImg = this.scene.dots.get();
    // console.log(dotImg)
    dotImg.setTexture('num_tiles', 0)
    dotImg.setTint(slideColors[num])
    dotImg.displayWidth = this.scene.spriteSize
    dotImg.displayHeight = this.scene.spriteSize
    dotImg.setPosition(game.config.width / 2, -game.config.height / 2);


    // dotImg.addChild(text);
    dot.image = dotImg
    // dot.events.onInputDown.add(this.clickDot, this);
    // dot.events.onInputUp.add(this.upDot, this);
    // dot.events.onInputOver.add(this.overDot, this);

    this.idCount++;
    return dot;
  }
  createNewDot(x) {
    var dot = this.addDot(x, 0);
    let posX = this.scene.xOffset + this.scene.dotSize * x + this.scene.dotSize / 2;
    let posY = this.scene.yOffset + this.scene.dotSize * 0 + this.scene.dotSize / 2

    //  let posX = this.scene.xOffset + this.scene.dotSize * x + this.scene.dotSize / 2;
    //  let posY = -150
    //dot.image.setTint(dotColors[dot.color])
    dot.image.setVisible(true)
    dot.image.setActive(true)
    dot.image.setAlpha(1)
    //   dot.image.displayWidth = this.scene.spriteSize
    //  dot.image.displayHeight = this.scene.spriteSize
    dot.image.setPosition(posX, posY)
    this.dots[x].unshift(dot);
    //this.newDots.push({x: x, y:0})
  }
  resetBoard() {
    this.selectedDots.forEach(function (dot) {
      dot.deactivate();
    });
    this.selectedDots = [];
    this.selectedColor = "none";
    this.redrawTheseColumns = {};
  }
  resetBoardKeep() {
    this.selectedDots.forEach(function (dot) {
      dot.deactivateKeep();
    });
    // this.selectedDots = [];
    //  this.selectedColor = "none";
    this.redrawTheseColumns = {};
  }

  ///////REMOVING
  findChainMatches() {
    console.log(this.selectedDots)
    /*  const dot = this.selectedDots[2];
     var testMatch = this.fillMatrix2(dot)
     console.log(testMatch.length) */
    var testMatch = []
    var numberOfMatches = 0
    for (let i = 0; i < this.selectedDots.length; i++) {
      const dot = this.selectedDots[i];
      testMatch = this.listConnectedItems(dot.coordinates[0], dot.coordinates[1])
      if (testMatch.length > 2) {
        this.score += testMatch.length * 5
        this.scoreProgress += testMatch.length * 5
        this.matchCount++
        numberOfMatches++
        this.clearMatches(testMatch)

      }
    }
    this.selectedDots = [];
    this.selectedColor = "none";
    return numberOfMatches
  }

  listConnectedItems(x, y) {
    if (!this.validCoordinates(x, y) || this.dots[x][y].value == 0) {
      return [];
    }
    this.colorToLookFor = this.dots[x][y].value;
    floodFillArray = [];
    floodFillArray.length = 0;
    this.floodFill(x, y);

    return floodFillArray;
  }
  floodFill(x, y) {
    if (!this.validCoordinates(x, y) || this.dots[x][y].value == 0) {
      return;
    }
    if (this.dots[x][y].value == this.colorToLookFor && !this.alreadyVisited(x, y)) {
      floodFillArray.push({
        x: x,
        y: y
      });
      this.floodFill(x + 1, y);
      this.floodFill(x - 1, y);
      this.floodFill(x, y + 1);
      this.floodFill(x, y - 1);
    }
  }
  alreadyVisited(x, y) {
    let found = false;
    floodFillArray.forEach(function (item) {
      if (item.x == x && item.y == y) {
        found = true;
      }
    });
    return found;
  }

  clearMatches(matches) {
    for (let i = 0; i < matches.length; i++) {
      const coord = matches[i];
      this.clearMatch(coord)

    }
  }

  clearMatch(coord) {
    this.dots[coord.x][coord.y].image.setFrame(0)
    this.dots[coord.x][coord.y].selectable = true
    this.dots[coord.x][coord.y].value = 0
  }
  clearMatch2(coord) {
    this.dots[coord[0]][coord[1]].image.setFrame(0)
    this.dots[coord[0]][coord[1]].selectable = true
    this.dots[coord[0]][coord[1]].value = 0
  }

  setTiles() {
    this.selectedDots.forEach(function (dot) {
      dot.set()
    });
  }
  destroyDots() {
    if (this.squareCompleted) {
      this.deleteAllDotsofColor();
    } else {
      this.deleteSelectedDots();
    }
    this.resetAfterDestroying();
  }
  deleteSelectedDots() {
    this.selectedDots.forEach(function (dot) {

      dot.explode();
    });
    this.selectedDots.forEach(function (dot) {
      dot.destroy();
    });
  }
  deleteAllDotsofColor() {
    var color = this.selectedColor;
    var dotsOfColor = this.findAllByColor(color);
    dotsOfColor.forEach(function (dot) {
      dot.explode();
    });
    dotsOfColor.forEach(function (dot) {
      dot.destroy();
    });
  }
  resetAfterDestroying() {
    this.selectedDots = [];
    this.selectedColor = "none";
    this.squareCompleted = false;
    this.redrawColumns();
    //  this.updateScore();
    // this.addListeners();
    //  $(".bounce").removeClass("bounce");
    this.redrawTheseColumns = {};
  }
  redrawColumns = function () {
    var board = this;
    for (var x in board.redrawTheseColumns) {
      var column = board.dots[x];
      // var newHTML = "";
      column.forEach(function (dot) {
        //  newHTML += dot.html();
      });
      //$("#column-" + x).html(newHTML);
    }
    //this.bounceDots();
  }
  ////////////

  findDrops() {
    var drops = []
    for (var c = 0; c < this.width; c++) {
      if (this.dots[c][this.height - 1].type == 1) {
        drops.push({ x: c, y: this.height - 1 })
      }
    }
    return drops

  }
  processDrops(drops) {
    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      //this.dots[drop.x][drop.y].image.setAlpha(.5)
      this.selectedDots.push(this.dots[drop.x][drop.y])
      this.scene.explode(drop.x, drop.y)
    }

  }



  findDots(coords) {
    var foundDots = [];
    var board = this;
    coords.forEach(function (coordinates) {
      var found = board.findDot(coordinates);
      if (found) foundDots.push(found);
    });
    //console.log(foundDots)
    return foundDots;
  }
  findDot(coordinates) {
    //var x = col
    //var y = row
    var x = coordinates[0];
    var y = coordinates[1];
    if (this.validCoordinates(x, y)) {
      return this.dots[x][y];
    } else {
      return false;
    }
  }
  findAllByColor = function (color) {
    var container = [];
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        if (dot.color == color) container.push(dot);
      });
    });
    return container;
  };
  validCoordinates(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
  validDrag(dot) {
    return this.rightColor(dot) && this.isNeighbor(dot) && this.notAlreadySelected(dot) && this.canSelectDot(dot) && this.movesLeft();
  }
  movesLeft() {
    if (this.selectedDots.length == this.chain.length) {
      return false
    }
    return true
  }
  rightColor(dot) {
    return dot.color == this.selectedColor;
  }
  canSelectDot(dot) {
    return dot.selectable
  }
  isNeighbor(dot) {
    var neighbors = this.lastSelectedDot().neighbors();
    return neighbors.includes(dot);

  }

  notAlreadySelected(dot) {
    return !this.selectedDots.includes(dot);

  }
  sameDot = function (dotA, dotB) {
    return dotA.coordinates[0] == dotB.coordinates[0] && dotA.coordinates[1] == dotB.coordinates[1];
  }
  secondToLast(dot) {
    var secondToLastDot = getSecondToLastElement(this.selectedDots);
    return secondToLastDot == dot;
  }
  lastSelectedDot() {
    //console.log(getLastElement(this.selectedDots));
    return getLastElement(this.selectedDots);
  }
  secondToLastSelectedDot() {
    return getSecondToLastElement(this.selectedDots)
  }
  deactivateLastDot() {
    var lastDot = getLastElement(this.selectedDots);
    lastDot.deactivate();
    this.selectedDots.pop();
  }
  activateSquare(dot) {
    this.selectedDots.push(dot);
    this.squareCompleted = true;
    this.scene.cameras.main.shake(50)
    var allColor = this.findAllByColor(this.selectedColor)
    //console.log(allColor.length)
    allColor.forEach(function (dot) {
      dot.image.setAlpha(.5)
    });
  }

  completeSquare(dot) {
    if (this.selectedDots.includes(dot)) {
      var tempDots = this.selectedDots;
      tempDots.push(dot);
      var index = tempDots.indexOf(dot);
      var circle = tempDots.slice(index, tempDots.length);
      console.log(circle)
      if (circle.length >= 5) return true;
    }
    return false;
  }
}