let fuseOptions = {
  cols: 8,

  rows: 10,
  offSetY: 250,
  offSetX: 75,
  sum: 10,
  gameMode: 0
}
let qTotal = 4; //col
let rTotal = 4; //row
//let imageW = 146;
//let imageH = 128; 
let imageW = 154;
let imageH = 134;
let scale = 1.3;
let tileScale = 1.4;
let hexW = imageW * scale;
let hexH = imageH * scale;
let hexSide = hexW / 2;
//hexagon
let depth = 2;
let boardType = 'hex';
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
    this.max = 3;
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
      var hexes = makeUpTriangularShape(5);

    } else if (boardType == 'triDown') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(150, 350));
      var hexes = makeDownTriangularShape(5);
    } else if (boardType == 'rhom') {
      this.flat = Layout(layout_flat, Point(hexSide, hexSide), Point(60, 300));
      var hexes = makeRhombusShape(4, 4)

    }

    // 

    this.drawGrid(hexes);

    this.cameras.main.setBackgroundColor(0xbbada0);
    var coo = hex_to_pixel(this.flat, Hex(0, 0, 0))

    this.tilePool = []

    this.slot = this.add.image(450, 1375, "hex", 0).setScale(tileScale + .2).setTint(0xbbada0);
    this.slotNext = this.add.image(150, 1375, "hex", 0).setScale(1.2).setTint(0xbbada0);

    this.tileGroup = this.add.group();
    // var num = Phaser.Math.Between(1, this.max);
    // var tile = this.add.image(this.slotNext.x,this.slotNext.y, "hex", num).setScale(tileScale).setInteractive();
    //  tile.value = num
    //var text1 = this.add.bitmapText(this.slot.x, this.slot.y, 'topaz', tile.value, 90).setOrigin(.5).setTint(0xc76210);
    //tile.text = text1
    // this.input.setDraggable(tile);
    //  tile.disableInteractive()
    // this.tilePool.unshift(tile)
    this.addNext();
    this.updateTile();
    // var next = this.tilePool.pop()
    //  next.setPosition(this.slot.x, this.slot.y)
    //  next.setInteractive()
    //  this.player = this.add.image(coo.x, coo.y, "hex").setScale(tileScale).setTint(0x00ff00);
    //  this.player.hex = Hex(0,0,0)
    // console.log(this.player.hex)

    // var testHex = this.add.image(250, 1250, "hexmult",1).setScale(tileScale).setTint(0xeee4da).setInteractive();
    //  this.input.setDraggable(testHex);
    // var hx = 450 + hexW * 3/4;
    // var hy = 1250 + hexH / 2;
    // var ncoo = this.getNXY(testHex.x, testHex.y, 5);
    // var testHex2 = this.add.image(ncoo.x, ncoo.y, "hex").setScale(tileScale).setTint(0xcdc1b4);
    // var moveContainer = this.add.container(450,1250);
    //moveContainer.add([testHex, testHex2])
    //moveContainer.setSize(400, 400);

    //moveContainer.setInteractive();

    // this.input.setDraggable(moveContainer)
    /*   this.oneHex = this.add.image(150, 1500, "hex").setScale(tileScale).setTint(0xeee4da).setInteractive();
    var text1 = this.add.bitmapText(this.oneHex.x, this.oneHex.y, 'topaz', '5', 40).setOrigin(.5).setTint(0xc76210);
    this.oneHex.text = text1
    this.oneHex.value = 5;
    this.input.setDraggable(this.oneHex);
    this.twoHex = this.add.image(750, 1500, "hex").setScale(tileScale).setTint(0xeee4da).setInteractive();
    var text2 = this.add.bitmapText(this.twoHex.x, this.twoHex.y, 'topaz', '2', 40).setOrigin(.5).setTint(0xc76210);
    this.twoHex.text = text2
    this.twoHex.value = 2;
    this.input.setDraggable(this.twoHex);
*/

    this.scoreText = this.add.bitmapText(750, 1450, 'topaz', this.score, 90).setOrigin(.5).setTint(0xc76210);




    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
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


    this.graphics = this.add.graphics();
    //this.input.on("pointerdown", this.hexSelect, this);
    //  this.input.on("pointerup", this.test, this);
    /*this.input.on("pointermove", this.drawPath, this);
    this.input.on("pointerup", this.removeGems, this);
   */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update() {

  }
  scoreUpdate() {

    this.scoreText.setText(this.score)
    // this.levelBarProgress.displayWidth = this.levelBarWidth * (tempScore / this.scoreGoal)
    if (this.tempScore >= this.scoreGoal) {
      // this.scoreGoal += 500;

      this.level++;
      this.max++;
      // this.nextLevel++;
      this.tempScore = 0;
      this.scoreGoal += 25;
      //  this.levelBarProgress.displayWidth = this.levelBarWidth * (tempScore / this.scoreGoal)
      //  this.levelBarProgress.setTint(this.colors[this.level])
      //  this.nextLevelText.setText(this.nextLevel);
      //  this.currentLevelText.setText(this.level);
      //  this.currentLevelTile.setTint(this.colors[this.level])
      // this.nextLevelTile.setTint(this.colors[this.nextLevel])
      // this.damageEmit(this.currentLevelText.x, this.currentLevelText.y, this.colors[this.Level])
    }
  }
  updateTile() {

    var tile = this.tile;
    var tween = this.tweens.add({
      targets: tile,
      x: this.slot.x,
      y: this.slot.y,
      scale: tileScale,
      duration: 200,
      onCompleteScope: this,
      onComplete: function () {
        tile.setInteractive()
        this.addNext();
      }
    })
  }
  addNext() {
    if (this.tilePool.length > 0) {
      this.tile = this.tilePool.shift()
      this.tile.setScale(1);
      this.tile.setVisible(true);
      this.tile.setPosition(this.slotNext.x, this.slotNext.y)
    } else {
      this.tile = this.tileGroup.create(this.slotNext.x, this.slotNext.y, "hex", 0);
    }
    //this.tile = this.tilePool.length > 0 ? this.tilePool.shift() : this.tileGroup.create(this.slotNext.x, this.slotNext.y, "hex", 0);

    this.children.bringToTop(this.tile)
    var num = Phaser.Math.Between(1, this.max);
    // var tile = this.add.image(this.slotNext.x,this.slotNext.y, "hex", num).setScale(tileScale).setInteractive();
    this.tile.setInteractive();
    this.tile.value = num;
    this.tile.setFrame(num);

    //var text1 = this.add.bitmapText(this.slot.x, this.slot.y, 'topaz', tile.value, 90).setOrigin(.5).setTint(0xc76210);
    //tile.text = text1
    this.input.setDraggable(this.tile);
    this.tile.disableInteractive()

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



  dropTile(gameObject, target) {


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
    this.fuseTiles(hex, gameObject.value)

    // performing a flood fill on the selected tile
    // this will populate "filled" array
    //this.floodFill(hex, gameObject.value);
    /*  var sixes = this.checkSixes();
     if (sixes.length > 5) {
       for (var h = 0; h < sixes.length; h++) {
         var tile = this.getHexObjectByHex(sixes[h]);
         var num = Phaser.Math.Between(1, this.max);
         tile.value = num;
         tile.tileSprite.setFrame(num)
       }
     }
  */
    /* var next = this.tilePool.pop()
     next.setPosition(this.slot.x, this.slot.y)
     next.setVisible(true)
     next.setInteractive();
     var num = Phaser.Math.Between(1, this.max);
     next.value = num;
     next.setFrame(num)*/

    // do we have more than one tile in the array?

  }
  findChainMatches() {

    var testMatch = []
    var numberOfMatches = 0

    const dot = this.selectedDots[i];
    testMatch = this.listConnectedItems(dot.coordinates[0], dot.coordinates[1])
    if (testMatch.length > 2) {
      this.score += testMatch.length * 5
      this.matchCount++
      numberOfMatches++
      this.clearMatches(testMatch)

    }

    this.selectedDots = [];
    this.selectedColor = "none";
    return numberOfMatches
  }
  listConnectedItems(hex) {
    if (!this.inMap(hex)) {
      return [];
    }
    var tile = this.getHexObjectByHex(hex)
    this.colorToLookFor = tile.value;
    floodFillArray = [];
    floodFillArray.length = 0;
    this.floodFill(hex);

    return floodFillArray;
  }
  floodFill(hex) {
    if (!this.inMap(hex) || this.getHexObjectByHex(hex).value == 0) {
      return;
    }
    if (this.getHexObjectByHex(hex).value == this.colorToLookFor && !this.alreadyVisited(x, y)) {
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




  fuseTiles(targetHex, value) {
    this.filled = []
    var matches = this.checkMatches(targetHex, value);
    if (matches > 0) {
      var targetTile = this.getHexObjectByHex(targetHex)
      var newVal = value += 1
      for (var h = 0; h < this.filled.length; h++) {
        var moveTile = this.getHexObjectByHex(this.filled[h])

        moveTile.tileSprite.setPosition(targetTile.image.x, targetTile.image.y)


        targetTile.value = newVal;
        targetTile.tileSprite.setFrame(newVal);
        moveTile.occupied = false;

        moveTile.image.input.dropZone = true;
        moveTile.value = 0;
        moveTile.tileSprite.setVisible(false)
        this.tilePool.push(moveTile.tileSprite);
        moveTile.tileSprite = null;

        this.tempScore += newVal;
        this.score += newVal;
        this.scoreUpdate()
        //  this.scoreText.setText(this.score)


      }
      this.fuseTiles(targetHex, targetTile.value)
    }
    // console.log(this.tilePool.length)
  }






  checkMatches(hex, value) {

    for (var i = 0; i < 6; i++) {
      var newHex = hex_neighbor(hex, i);
      if (this.inMap(newHex)) {
        var tile = this.getHexObjectByHex(newHex)
        if (tile.value == value && tile.occupied && !this.pointInArray(newHex) && tile.value != 12) {
          // this.floodFill(newHex, value);
          this.filled.push(newHex);
        }
      }
    }
    console.log(this.filled)

    return this.filled.length


  }

  floodFill(hex, value) {
    //hex just placed
    //check each neighbor
    // if it matches, check eack neighber of that one
    if (!this.inMap(hex)) {
      return

    }
    var tile = this.getHexObjectByHex(hex)

    if (tile.value == value && tile.occupied && !this.pointInArray(hex)) {

      this.filled.push(hex)
      for (var i = 0; i < 6; i++) {

        var newHex = hex_neighbor(hex, i);


        // this.floodFill(newHex, value);

        tile.image.setTint(0x00ff00)

      }




    }





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
    var hex = pixel_to_hex(this.flat, Point(e.x, e.y));
    if (!this.inMap(hex)) { return }
    var hexagon = this.getHexObjectByHex(hex);
    hexagon.image.setAlpha(.6);
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