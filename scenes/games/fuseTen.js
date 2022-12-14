let fuseOptions = {
  cols: 8,

  rows: 10,
  offSetY: 250,
  offSetX: 75,
  sum: 10,
  gameMode: 0
}
let qTotal = 5; //col
let rTotal = 4; //row
//let imageW = 146;
//let imageH = 128; 
let imageW = 154;
let imageH = 134;
let scale = 1;
let tileScale = 1.1;
let hexW = imageW * scale;
let hexH = imageH * scale;
let hexSide = hexW / 2;
//hexagon
let depth = 2;
let boardType = 'rhom';
const sin60 = Math.sqrt(3) / 2;
const cos60 = 1 / 2;
const tan60 = Math.sqrt(3);

/////////////////////////////////////////////
class fuseTen extends Phaser.Scene {
  constructor() {
    super("fuseTen");
  }
  preload() {


  }
  create() {
    this.colors = [0xa8324e, 0x32a85a, 0x326ba8, 0xa86432, 0xa232a8]
    this.range = [1, 3];
    this.score = 0;
    this.tempScore = 0;
    this.scoreGoal = 50;
    this.level = 0;
    this.hexagons = [];
    this.idMap = [];
    this.hexagonsLayer = [];
    this.idMapLayer = [];
    if (boardType == 'hex') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(425, 720));
      var hexes = makeHexagonalShape(depth);

    } else if (boardType == 'rect') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(150, 350));
      var hexes = makeRectangularShape(0, qTotal, 0, rTotal, ODD);

    } else if (boardType == 'triUp') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(150, 60));
      var hexes = makeUpTriangularShape(6);

    } else if (boardType == 'triDown') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(150, 350));
      var hexes = makeDownTriangularShape(6);
    } else if (boardType == 'rhom') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(150, 300));
      var hexes = makeRhombusShape(qTotal, 6)

    }

    // 
    this.chainSlots = []
    this.numberRange = [1, 4]
    this.chainRange = [1, 2]

    this.drawGrid(hexes);

    this.cameras.main.setBackgroundColor(0xbbada0);
    var coo = hex_to_pixel(this.flat, Hex(0, 0, 0))

    this.tilePool = []
    this.addOccupied(4)
    // this.slot = this.add.image(450, 1375, "hex", 0).setScale(tileScale + .2).setTint(0xbbada0);
    //  this.slotNext = this.add.image(150, 1375, "hex", 0).setScale(1.2).setTint(0xbbada0);

    this.tileGroup = this.add.group();





    for (var i = 0; i < 5; i++) {
      let xpos = 100 + i * hexW * .75;
      if (i % 2 == 0) {
        var yPlus = hexH * .5
      } else {
        var yPlus = 0
      }
      let ypos = 1400 + yPlus
      var slot = this.add.image(xpos, ypos, 'hex', 0).setScale(scale).setAlpha(1)
      this.chainSlots.push(slot)
    }
    this.generateChain()


    this.scoreText = this.add.bitmapText(750, 1450, 'topaz', this.score, 90).setOrigin(.5).setTint(0xc76210);




    /*  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
       gameObject.x = dragX;
       gameObject.y = dragY;
       //gameObject.text.x = dragX;
       //gameObject.text.y = dragY;
     }, this)
     this.input.on('dragenter', function (pointer, gameObject, target) {
       target.setAlpha(.2)
       //tatget.setTint(0xff0000)
 
       var hex = pixel_to_hex(this.flat, Point(target.x, target.y));
 
       //this.drawHex(hex)
     }, this)
 
     this.input.on('dragleave', function (pointer, gameObject, target) {
       target.setAlpha(1)
 
 
     })
     this.input.on('drop', function (pointer, gameObject, target) {
       this.dropTile(gameObject, target)
       target.setAlpha(1)
     }, this)
     this.input.on('dragend', function (pointer, gameObject, dropped) {
       if (!dropped) {
         //console.log(gameObject.input.dragStartX)
         gameObject.x = gameObject.input.dragStartX;
         gameObject.y = gameObject.input.dragStartY;
         // target.setAlpha(1)
         // gameObject.text.x = gameObject.input.dragStartX;
         // gameObject.text.y = gameObject.input.dragStartY;
       }
 
 
 
     })
  */

    this.graphics = this.add.graphics();
    this.input.on("pointerdown", this.hexSelect, this);
    //  this.input.on("pointerup", this.test, this);
    this.input.on("pointermove", this.drawPath, this);
    this.input.on("pointerup", this.endPath, this);

    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update() {

  }
  addOccupied(count) {
    var placedB = 0



    while (placedB < count) {
      var ranInd = Phaser.Math.Between(0, this.hexagons.length - 1)
      var dot = this.getHexObjectByHex(this.hexagons[ranInd].hex)
      if (dot.value == 0) {
        //var ranCol = Phaser.Math.Between(1, slideColors.length - 1)
        //this.board.dots[randX][randY].image.setTint(slideColors[ranCol])
        var ranVal = Phaser.Math.Between(this.numberRange[0], this.numberRange[1])
        dot.image.setFrame(ranVal)
        dot.value = ranVal
        dot.selectable = false
        placedB++
      }
    }
  }
  scoreUpdate() {

    this.scoreText.setText(this.score)
    // this.levelBarProgress.displayWidth = this.levelBarWidth * (tempScore / this.scoreGoal)
    if (this.tempScore >= this.scoreGoal) {
      // this.scoreGoal += 500;

      this.level++;
      this.range[0]++
      this.range[1]++
      // this.nextLevel++;
      this.tempScore = 0;
      // this.scoreGoal += 25;
      //  this.levelBarProgress.displayWidth = this.levelBarWidth * (tempScore / this.scoreGoal)
      //  this.levelBarProgress.setTint(this.colors[this.level])
      //  this.nextLevelText.setText(this.nextLevel);
      //  this.currentLevelText.setText(this.level);
      //  this.currentLevelTile.setTint(this.colors[this.level])
      // this.nextLevelTile.setTint(this.colors[this.nextLevel])
      // this.damageEmit(this.currentLevelText.x, this.currentLevelText.y, this.colors[this.Level])
    }
  }


  getNXY(x, y, dir) {
    if (dir == 0) {
      return { x: x + hexW * 3 / 4, y: y + hexH / 2 }
    } else if (dir == 1) {
      return { x: x + hexW * 3 / 4, y: y - hexH / 2 }
    } else if (dir == 2) {
      return { x: x, y: y - hexH }
    } else if (dir == 3) {
      return { x: x - hexW * 3 / 4, y: y - hexH / 2 }
    } else if (dir == 4) {
      return { x: x - hexW * 3 / 4, y: y + hexH / 2 }
    } else if (dir == 5) {
      return { x: x, y: y + hexH }
    }
  }



  /* dropTile(gameObject, target) {


    //set xy to match target
    gameObject.x = target.x;
    gameObject.y = target.y;
    //gameObject.text.x = target.x;
    //gameObject.text.y = target.y;

    //
    gameObject.disableInteractive()

    //grab the target tile
    var hex = pixel_to_hex(this.flat, Point(target.x, target.y))
    console.log(hex)
    var tile = this.getHexObjectByHex(hex)
    tile.value = gameObject.value
    //console.log('tv' + tile.value + 'go' + gameObject.value)
    tile.occupied = true;
    tile.tileSprite = gameObject;

    target.input.dropZone = false;
    this.updateTile()
    var matches = this.findChainMatches(hex)


  } */
  findChainMatches(hex) {

    var testMatch = []
    var numberOfMatches = 0

    testMatch = this.listConnectedItems(hex)

    if (testMatch.length > 2) {

      /*  this.score += testMatch.length * 5
       this.matchCount++
       numberOfMatches++ */
      this.fuseTiles(testMatch)

    }

    return numberOfMatches
  }

  listConnectedItems(hex) {
    if (!this.inMap(hex)) {
      return [];
    }

    var tile = this.getHexObjectByHex(hex)
    this.colorToLookFor = tile.value;

    this.floodFillArray = [];
    this.floodFillArray.length = 0;
    this.floodFill(hex);

    return this.floodFillArray;
  }

  floodFill(hex) {
    if (!this.inMap(hex) || this.getHexObjectByHex(hex).value == 0) {
      return;
    }
    if (this.getHexObjectByHex(hex).value == this.colorToLookFor && !this.alreadyVisited(hex)) {

      this.floodFillArray.push(hex);

      for (var i = 0; i < 6; i++) {
        var newHex = hex_neighbor(hex, i);

        this.floodFill(newHex);


      }

    }
  }

  alreadyVisited(hex) {
    let found = false;
    this.floodFillArray.forEach(function (item) {
      if (item.q == hex.q && item.r == hex.r && item.s == hex.s) {
        found = true;
      }
    });
    return found;
  }


  fuseTiles(matches) {

    // var matches = this.checkMatches(targetHex, value);

    if (matches.length > 0) {
      var targetTile = this.getHexObjectByHex(matches[0])
      var newVal = targetTile.value + 1

      console.log('target val ' + targetTile.value + ' match len ' + matches.length)
      this.tempScore += targetTile.value * matches.length;
      this.score += targetTile.value * matches.length;
      this.scoreUpdate()
      targetTile.value = newVal;
      targetTile.image.setFrame(newVal);

      for (var h = 1; h < matches.length; h++) {
        var moveTile = this.getHexObjectByHex(matches[h])

        //  moveTile.image.setPosition(targetTile.image.x, targetTile.image.y)

        moveTile.occupied = false;

        // moveTile.image.input.dropZone = true;
        moveTile.selectable = true
        moveTile.value = 0;
        moveTile.image.setFrame(0)
        //moveTile.image.setVisible(false)
        // this.tilePool.push(moveTile.image);
        //    moveTile.image = null;

        //this.tempScore += newVal;
        //this.score += newVal;

        //  this.scoreText.setText(this.score)


      }
      // this.fuseTiles(targetHex, targetTile.value)
      var m = this.findChainMatches(matches[0])
    }
    // console.log(this.tilePool.length)
  }







  checkSixes() {
    var sixArray = [];
    for (var i = 0; i < this.hexagons.length; i++) {
      if (this.hexagons[i].value == 12) {
        sixArray.push(this.hexagons[i].hex)
      }

    }
    return sixArray;
  }

  checkBoard() {
    var open = false;
    for (var i = 0; i < this.hexagons.length; i++) {
      if (this.hexagons[i].occupied) {
        open = true
      }

    }
    if (!open) {
      alert('game over')
    }
  }

  pointInArray(p) {
    for (var i = 0; i < this.filled.length; i++) {
      if (this.filled[i] == p) {
        return true;
      }
    }
    return false;
  }

  drawHex(hex, mult) {
    var polygon = new Phaser.Geom.Polygon(polygon_corners(this.flat, hex));
    this.graphics.clear()

    // graphics.setPosition(center.x,center.y)

    this.graphics.lineStyle(4, 0xfcba03);
    this.graphics.beginPath();
    this.graphics.moveTo(polygon.points[0].x, polygon.points[0].y);
    for (var i = 1; i < polygon.points.length; i++) {
      this.graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
    }

    this.graphics.closePath();
    this.graphics.strokePath();
  }

  move(dir) {
    var newHex = hex_neighbor(this.player.hex, dir);
    var newCoo = hex_to_pixel(this.flat, newHex)
    var tween = this.tweens.add({
      targets: this.player,
      x: newCoo.x,
      y: newCoo.y,
      duration: 100,
      onCompleteScope: this,
      onComplete: function () {
        this.player.hex = newHex;
      }



    })
  }
  hexSelect(e) {
    this.selected = []
    this.dragging = true
    var hex = pixel_to_hex(this.flat, Point(e.x, e.y));
    if (!this.inMap(hex)) { return }
    var hexagon = this.getHexObjectByHex(hex);
    if (hexagon.selectable) {
      hexagon.image.setFrame(this.chain[0]);
      this.selected.push(hex)
    }

  }
  drawPath(e) {
    if (!this.dragging) { return }
    var hex = pixel_to_hex(this.flat, Point(e.x, e.y));
    if (!this.inMap(hex)) { return }
    var hexagon = this.getHexObjectByHex(hex);
    if (this.isNeighbor(hex) && !this.inPath(hex) && this.movesLeft() && hexagon.selectable) {

      this.selected.push(hex)
      hexagon.image.setFrame(this.chain[this.selected.length - 1]);

    } else if (this.selected.length > 1 && this.secondToLast(hex) && hexagon.selectable) {
      console.log('backtrack')
      this.getHexObjectByHex(this.lastSelected()).image.setFrame(0)
      this.selected.pop()
    }
  }
  endPath() {
    if (!this.dragging) { return }
    if (this.selected.length == this.chain.length) {
      for (let i = 0; i < this.selected.length; i++) {
        const dot = this.selected[i];
        var hexagon = this.getHexObjectByHex(dot);
        hexagon.value = this.chain[i];
        hexagon.selectable = false
        var matches = this.findChainMatches(dot)
      }

      this.generateChain()
    } else {
      for (let i = 0; i < this.selected.length; i++) {
        const dot = this.selected[i];
        var hexagon = this.getHexObjectByHex(dot);
        hexagon.image.setFrame(0);
      }
    }
    this.dragging = false
  }
  isNeighbor(dot) {
    var d = hex_distance(dot, this.lastSelected())
    if (d == 1) {
      return true
    } else {
      return false
    }
  }
  movesLeft() {
    if (this.selected.length == this.chain.length) {
      return false
    }
    return true
  }
  inPath(hex) {
    let found = false;
    this.selected.forEach(function (item) {
      if (item.q == hex.q && item.r == hex.r && item.s == hex.s) {
        found = true;
      }
    });
    return found;
  }

  lastSelected() {
    return this.selected[this.selected.length - 1]
  }
  secondToLast(dot) {
    var secondToLastDot = this.selected[this.selected.length - 2]
    return hex_equal(dot, secondToLastDot)
  }
  generateChain() {
    this.chain = []
    for (var i = 0; i < this.chainSlots.length; i++) {
      this.chainSlots[i].setAlpha(0)
    }
    var newChainLength = Phaser.Math.Between(this.chainRange[0], this.chainRange[1])
    for (var j = 0; j < newChainLength; j++) {
      this.chain.push(Phaser.Math.Between(this.numberRange[0], this.numberRange[1]))
    }
    for (var i = 0; i < this.chain.length; i++) {
      this.chainSlots[i].setAlpha(1)
      this.chainSlots[i].setFrame(this.chain[i])
    }
  }



  drawGrid(hexes) {



    for (var i = 0; i < hexes.length; i++) {
      var center = hex_to_pixel(this.flat, hexes[i]);
      var num = Phaser.Math.Between(0, this.colors.length - 1);

      var value = 0;
      var image = this.add.image(center.x, center.y, "hex", 0).setScale(tileScale).setTint(0xcdc1b4).setInteractive({ dropZone: true });


      var coo = hexes[i].q + ',' + hexes[i].r + ',' + hexes[i].s;
      //this.cooText = this.add.bitmapText(center.x, center.y, 'lato', coo, 30).setOrigin(.5).setTint(0x000000).setAlpha(1);
      this.makeGameGrid(hexes[i], image, value);
    }
    console.log(this.hexagons)
  }
  makeGameGrid(hex, image, value) {
    var id = makeID(hex)
    //var text = this.add.bitmapText(image.x, image.y, 'topaz', '', 90).setOrigin(.5).setTint(0xc76210);
    image.id = id;
    var hexObject = {
      hex: hex,
      image: image,
      value: value,
      id: id,
      occupied: false,
      blocked: false,
      selectable: true

    }
    this.hexagons.push(hexObject)
    this.idMap.push(makeID(hex));
  }
  inMap(hex) {
    var findId = makeID(hex);
    if (this.idMap.indexOf(findId) > -1) {
      return true;
    } else {
      return false;
    }
  }
  getHexObjectByHex(hex) {
    var findId = makeID(hex);
    var tempIndex = this.idMap.indexOf(findId);
    return this.hexagons[tempIndex];
  }
  getHexObjectById(id) {
    var tempIndex = this.idMap.indexOf(id);
    return this.hexagons[id];
  }
  addScore() {
    this.events.emit('score');
  }
}