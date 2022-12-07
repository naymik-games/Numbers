var znumbersOptions = {
  gameWidth: 900,
  gameHeight: 1600,
  tileSize: 100,
  fieldSize: {
    rows: 6,
    cols: 6
  },
  //colors: [0x999999, 0xFE6D73, 0x17C3B2, 0x59A96A, 0xF3752B],
  colors: [0x999999, 0xeb4034, 0x03a5ad, 0xd17300, 0x00a33c]

}


class zNumbers extends Phaser.Scene {
  constructor() {
    super("zNumbers");
  }
  preload() {


  }
  create() {
    this.cameras.main.fadeIn(800, 0, 0, 0);
    znumbersOptions.directions = [
      new Phaser.Geom.Point(0, 1),
      new Phaser.Geom.Point(0, -1),
      new Phaser.Geom.Point(1, 0),
      new Phaser.Geom.Point(-1, 0),
      new Phaser.Geom.Point(1, 1),
      new Phaser.Geom.Point(-1, -1),
      new Phaser.Geom.Point(1, -1),
      new Phaser.Geom.Point(-1, 1)
    ];

    this.yOffset = 250;
    this.xOffset = (game.config.width - (znumbersOptions.fieldSize.rows * (znumbersOptions.tileSize + 20) + znumbersOptions.tileSize / 2)) / 2;
    console.log(this.xOffset)

    this.cameras.main.setBackgroundColor(0xf5f5f5);
    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'zNumbers', 100).setOrigin(.5).setTint(0xff0000);
    //the higher the number of max attempt, the harder
    this.generateRandomLevel(20);
    this.createLevel();

  }
  update() {

  }


  generateRandomLevel(maxAttempts) {

    console.log("A POSSIBLE SOLUTION");

    // we will store the generated level here
    this.level = []

    // initializing the array
    for (var i = 0; i < znumbersOptions.fieldSize.rows; i++) {
      this.level[i] = [];
      for (var j = 0; j < znumbersOptions.fieldSize.cols; j++) {
        this.level[i][j] = 0;
      }
    }

    // choosing a random start position
    var startPosition = new Phaser.Geom.Point(Phaser.Math.RND.integerInRange(0, znumbersOptions.fieldSize.rows - 1), Phaser.Math.RND.integerInRange(0, znumbersOptions.fieldSize.cols - 1));

    // here we'll store the solution
    var solution = "";

    // we'll execute this process once for each tile in the game
    for (i = 0; i <= znumbersOptions.fieldSize.rows * znumbersOptions.fieldSize.cols; i++) {

      // keeping count of how many attempts we are doing to place a tile
      var attempts = 0;

      // we repeat this loop...
      do {

        // choosing a random tile value from 1 to 4
        var randomTileValue = Phaser.Math.RND.integerInRange(1, 4);

        // choosing a random direction
        var randomDirection = Phaser.Math.RND.integerInRange(0, znumbersOptions.directions.length - 1);

        // given the start position and the tile value, we can determine the destination
        var randomDestination = new Phaser.Geom.Point(startPosition.x + randomTileValue * znumbersOptions.directions[randomDirection].x, startPosition.y + randomTileValue * znumbersOptions.directions[randomDirection].y);

        // we made one more attempt
        attempts++;

        // until we find a legal destination or we made too many attempts
      } while (!this.isLegalDestination(randomDestination) && attempts < maxAttempts);

      // if we did not make too many attempts...
      if (attempts < maxAttempts) {

        // updating solution string
        solution = "(" + startPosition.x + "," + startPosition.y + ") => (" + randomDestination.x + "," + randomDestination.y + ")\n" + solution;

        // inserting the tile in the field
        this.level[startPosition.x][startPosition.y] = randomTileValue;

        // start position now is the position of the last placed tile
        startPosition = new Phaser.Geom.Point(randomDestination.x, randomDestination.y);
      }
    }

    // these rows just display the solution in the Chrome console
    console.log(this.level);
    console.log(solution);
  }
  isLegalDestination(p) {

    // it's not legal if it's outside the game field
    if (p.x < 0 || p.y < 0 || p.x >= znumbersOptions.fieldSize.rows || p.y >= znumbersOptions.fieldSize.cols) {
      return false;
    }

    // it's not legal if there's already a tile
    if (this.level[p.x][p.y] != 0) {
      return false;
    }

    // ok, it's legal
    return true
  }

  createLevel() {
    this.tilesArray = [];
    this.tileGroup = this.add.group();
    //  this.tileGroup.x = (game.config.width - (znumbersOptions.tileSize + 20) * znumbersOptions.fieldSize.cols) / 2;
    //this.tileGroup.x = ((znumbersOptions.tileSize + 20) * znumbersOptions.fieldSize.cols) / 2;

    //this.tileGroup.y = this.tileGroup.x;
    for (var i = 0; i < znumbersOptions.fieldSize.rows; i++) {
      this.tilesArray[i] = [];
      for (var j = 0; j < znumbersOptions.fieldSize.cols; j++) {
        this.addTile(i, j);
      }
    }
    this.input.on('pointerdown', this.pickTile, this);
    var reset = this.add.image(game.config.width / 2, game.config.height - this.tileGroup.y, "restart").setOrigin(0.5, 1).setInteractive();
    reset.on('pointerdown', function () {
      this.scene.start("zNumbers");
    }, this);


  }
  addTile(row, col) {
    var tileXPos = this.xOffset + col * (znumbersOptions.tileSize + 20) + znumbersOptions.tileSize / 2;
    var tileYPos = this.yOffset + row * (znumbersOptions.tileSize + 20) + znumbersOptions.tileSize / 2;
    var theTile = this.add.sprite(tileXPos, tileYPos, "tile");
    theTile.setOrigin(0.5);
    theTile.width = znumbersOptions.tileSize;
    theTile.height = znumbersOptions.tileSize;
    var tileValue = this.level[row][col];
    theTile.setTint(znumbersOptions.colors[tileValue]);
    var tileText = this.add.text(theTile.x, theTile.y, tileValue.toString(), {
      font: (znumbersOptions.tileSize / 2).toString() + "px Arial",
      fontWeight: "bold"
    });
    tileText.setOrigin(0.5);
    tileText.setAlpha((tileValue > 0) ? 0.5 : 0);
    //theTile.addChild(tileText);
    this.tilesArray[row][col] = {
      tileSprite: theTile,
      value: tileValue,
      text: tileText
    };
    this.tileGroup.add(theTile);
  }
  pickTile(e) {
    this.resetTileTweens();
    var posX = e.x - this.xOffset;
    var posY = (e.y - this.yOffset);
    var pickedRow = Math.floor(posY / (znumbersOptions.tileSize + 20));
    var pickedCol = Math.floor(posX / (znumbersOptions.tileSize + 20));
    if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < znumbersOptions.fieldSize.rows && pickedCol < znumbersOptions.fieldSize.cols) {
      var pickedTile = this.tilesArray[pickedRow][pickedCol];
      var pickedValue = pickedTile.value;
      if (pickedValue > 0) {
        this.saveTile = new Phaser.Geom.Point(pickedRow, pickedCol);
        this.possibleLanding = [];
        this.possibleLanding.length = 0;
        this.setTileTweens(pickedTile.tileSprite);
        for (var i = 0; i < znumbersOptions.directions.length; i++) {
          var newRow = pickedRow + pickedValue * znumbersOptions.directions[i].x;
          var newCol = pickedCol + pickedValue * znumbersOptions.directions[i].y;
          if (newRow < znumbersOptions.fieldSize.rows && newRow >= 0 && newCol < znumbersOptions.fieldSize.cols && newCol >= 0 && this.tilesArray[newRow][newCol].value == 0) {
            this.setTileTweens(this.tilesArray[newRow][newCol].tileSprite);
            this.possibleLanding.push(new Phaser.Geom.Point(newRow, newCol));
          }
        }
      }
      else {
        if (this.pointInArray(new Phaser.Geom.Point(pickedRow, pickedCol))) {
          this.tilesArray[pickedRow][pickedCol].value = -1;
          this.tilesArray[pickedRow][pickedCol].text.setAlpha(0.5);
          this.tilesArray[pickedRow][pickedCol].text.setText(this.tilesArray[this.saveTile.x][this.saveTile.y].value.toString());
          this.tilesArray[this.saveTile.x][this.saveTile.y].value = 0;
          this.tilesArray[this.saveTile.x][this.saveTile.y].tileSprite.setTint(znumbersOptions.colors[0]);
          this.tilesArray[this.saveTile.x][this.saveTile.y].text.setAlpha(0);
          this.checkSolution();
        }
        if (possibleLanding.length == 0) {
          alert('loser')
        }
        this.possibleLanding = [];
        this.possibleLanding.length = 0;
      }
    }
  }
  checkSolution() {
    // looping through the entire game field
    for (var i = 0; i < znumbersOptions.fieldSize.rows; i++) {
      for (var j = 0; j < znumbersOptions.fieldSize.cols; j++) {

        // if there's still a number tile on the field...
        if (this.tilesArray[i][j].value > 0) {

          // level is not solved
          return false;
        }
      }
    }
    alert('win')
    // level is solved, wait one second then advance to next level
    //game.time.events.add(Phaser.Timer.SECOND, function(){

    // start "TheGame" state, clearing World display list (true), without clearing the cache (false), and passing the new level
    //game.state.start("TheGame", true, false, (this.level + 1) % 10);
    // }, this);
  }

  setTileTweens(tile) {
    this.pulseTween = this.tweens.add({
      targets: tile,
      scale: 1.2,
      duration: 400,
      ease: 'Cubic',
      loop: -1,
      yoyo: true,

    })

  }

  resetTileTweens() {
    var activeTweens = this.tweens.getAllTweens();
    for (var i = 0; i < activeTweens.length; i++) {
      // activeTweens[i].targets.width = znumbersOptions.tileSize;
      // activeTweens[i].targets.height = znumbersOptions.tileSize;
      activeTweens[i].targets[0].setScale(1)
    }
    this.tweens.killAll();
  }

  pointInArray(p) {
    for (var i = 0; i < this.possibleLanding.length; i++) {
      if (this.possibleLanding[i].x == p.x && this.possibleLanding[i].y == p.y) {
        return true;
      }
    }
    return false;
  }

  addScore() {
    this.events.emit('score');
  }
}
