class numberRPG extends Phaser.Scene {
  constructor() {
    super("numberRPG");
  }
  preload() {


  }
  create() {
    numberRPGData = JSON.parse(localStorage.getItem('rpgData'));

    if (numberRPGData === null || numberRPGData.length <= 0) {
      localStorage.setItem('rpgData',
        JSON.stringify(defaultNumberRPGData));
      numberRPGData = defaultNumberRPGData;
    }

    this.range = 4;
    this.currentRoll = 0;
    this.directions = [{ r: 0, c: 1 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: -1, c: 0 }];
    this.hasArrow = false;
    this.colors = {
      bg: 0x000000,
      tileEmpty: 0x7f8c8d,
      tileNormal: 0x16a085,
      tileUpgrade: 0xe74c3c,
      tileX: 0xff914d,
      tileTree: 0x07bc07,
      tileEnemy1: 0xa70204,
      tileEnemy2: 0xc10306,
      tileEnemy3: 0xe00408,
      tileEnemy4: 0xf9060a,
      tileWall: 0xbeacad,
      tilePotion: 0x80b8cc,
      tileSword: 0xe0e0e0,
      tileShield: 0x987302,
      tileArrow: 0xd0b666,
      tileKey: 0xf48834,
      tileHealth: 0x16a085,
      tileCoin: 0xf2e711
    }

    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.cameras.main.setBackgroundColor(this.colors.bg);
    //var title = this.add.bitmapText(50, 50, 'topaz', 'L: 1', 100).setOrigin(0,.5).setTint(0xc76210);
    this.tileSize = 150;
    this.xOffset = (game.config.width - (5 * (this.tileSize + 15) + this.tileSize / 2)) / 2;

    this.yOffset = 450;


    this.nextSlot = this.add.image(this.xOffset + 2 * (this.tileSize + 15) + this.tileSize / 2, 250, 'blankoutline').setInteractive().setTint(0x16a085);
    this.nextSlot.value = 5;
    this.nextSlot.displayWidth = 140;
    this.nextSlot.displayHeight = 140;
    this.nextNum = this.add.bitmapText(this.xOffset + 2 * (this.tileSize + 15) + this.tileSize / 2, 250, 'topaz', '0', 100).setOrigin(.5).setTint(0x16a085);

    this.nextSlot2 = this.add.image(this.xOffset + 3 * (this.tileSize + 15) + this.tileSize / 2, 250, 'blankoutline').setInteractive().setTint(0x7f8c8d);
    this.nextSlot2.displayWidth = 100;
    this.nextSlot2.displayHeight = 100;
    this.nextNum2 = this.add.bitmapText(this.xOffset + 3 * (this.tileSize + 15) + this.tileSize / 2, 250, 'topaz', 'R', 70).setOrigin(.5).setTint(0x7f8c8d);
    this.nextSlot2.on('pointerdown', function() {
      this.nextSlot2.setTint(0xecf0f1)
      this.nextNum2.setTint(0xecf0f1)
      //this.removeX1.disableInteractive();

      var tween = this.tweens.add({
        targets: [this.nextSlot2, this.nextNum2],
        scale: .4,
        duration: 100,
        yoyo: true,

      })
      this.roll()
    }, this)


    this.tileTypeText = this.add.bitmapText(15, 400, 'topaz', '', 60).setOrigin(0, .5).setTint(0xecf0f1);


    this.remove = this.add.image(65, 1340, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.remove.displayWidth = 100;
    this.remove.displayHeight = 100;
    this.removeText = this.add.bitmapText(65, 1340, 'topaz', 'X', 70).setOrigin(.5).setTint(0xecf0f1);
    this.remove.on('pointerdown', function() {
      /*  if (this.bonusCount >= 5) {
          this.destroyTile = true;
          this.remove.setTint(0xe74c3c);
          this.removeText.setTint(0xe74c3c);
          // this.remove.disableInteractive()
          this.bonusCount -= 5;
          this.bonusCountText.setText('Bonus: ' + this.bonusCount)
        }*/
      this.tweens.add({
        targets: this.grid[this.player.location.r][this.player.location.c].tileSprite,
        angle: 360,
        yoyo: true,
        duration: 500,
        onCompleteScope: this,
        onComplete: function() {
          this.wallSpell();
        }
      })
    }, this)

    this.makeDeck();


    this.createGrid();

    this.player = {
      location: { r: 2, c: 2 },
      health: 10,
      strength: 5,
      magic: 0,
      protection: 5,
      coins: 0,
      inventory: null
    }

    this.addPlayer();
    this.addTiles(5)

    //player stats
    this.playerHealthText = this.add.bitmapText(15, 100, 'topaz', '#' + this.player.health, 60).setOrigin(0, .5).setTint(0xecf0f1);
    this.playerStrengthText = this.add.bitmapText(150, 100, 'topaz', 's' + this.player.strength, 60).setOrigin(0, .5).setTint(0xecf0f1);
    this.playerProtectionText = this.add.bitmapText(250, 100, 'topaz', 'p' + this.player.protection, 60).setOrigin(0, .5).setTint(0xecf0f1);
    this.playerMagicText = this.add.bitmapText(385, 100, 'topaz', '@' + this.player.magic, 60).setOrigin(0, .5).setTint(0xecf0f1);
    this.playerCoinText = this.add.bitmapText(485, 100, 'topaz', '$' + this.player.coins, 60).setOrigin(0, .5).setTint(this.colors.tileCoin);

    this.playerArrowText = this.add.bitmapText(585, 100, 'topaz', '}->', 60).setOrigin(0, .5).setTint(0xecf0f1).setVisible(false);


    this.popUpText = this.add.bitmapText(-50, -50, 'topaz', '', 60).setOrigin(.5).setTint(0xecf0f1).setAlpha(0);


    this.input.on('pointerup', this.endSwipe, this)
  }
  wallSpell() {
    //var tileUp = this.grid[this.player.location.r - 1][this.player.location.c]

    // var tileDown = this.grid[this.player.location.r + 1][this.player.location.c]
    // var tileLeft = this.grid[this.player.location.r][this.player.location.c - 1]
    // var tileRight = this.grid[this.player.location.r][this.player.location.c + 1]
    var neighbors = this.getValid4neighbors();
    for (var n = 0; n < neighbors.length; n++) {
      if (this.grid[neighbors[n].r][neighbors[n].c].name == 'Wall') {
        var tile = this.grid[neighbors[n].r][neighbors[n].c];
       /* this.tweens.add({
          targets: [tile.tileSprite, tile.tileText],
          scale: 2,
          duration: 100,
          yoyo: true,
          onYoyoScope: this,
          onYoyo: function() {*/
          tile.name = '';
       tile.isEmpty = true
       tile.tileValue = 0;
       tile.tileText.setText('');
       tile.tileText.setTint(this.colors.tileEmpty);
       tile.tileSprite.setTint(this.colors.tileEmpty);

       /*   }
        })*/


      }
    }

  }
  getValid4neighbors() {
    var neigh = []
    for (var d = 0; d < 4; d++) {

      if (this.inGrid(this.player.location.r + this.directions[d].r, this.player.location.c + this.directions[d].c)) {
        neigh.push({ r: this.player.location.r + this.directions[d].r, c: this.player.location.c + this.directions[d].c })
      }
    }
    return neigh
  }
  inGrid(row, col) {
    if (row == 5 || row < 0 || col == 5 || col < 0) {
      return false
    }
    return true
  }
  removeTile(row, col) {
    var tile = this.grid[row][col]
    tile.tileText
  }
  roll() {
    var num = Phaser.Math.Between(1, this.range)
    this.currentRoll = num;
    this.tweens.add({
      targets: [this.nextSlot, this.nextNum],
      angle: 360,
      yoyo: true,
      duration: 500,
      onCompleteScope: this,
      onComplete: function() {
        this.nextNum.setText(num)
      }
    })
  }
  updateStats() {
    this.playerHealthText.setText('#' + this.player.health)
    this.playerStrengthText.setText('s' + this.player.strength);
    this.playerProtectionText.setText('p' + this.player.protection);
    this.playerMagicText.setText('@' + this.player.magic);
    this.playerCoinText.setText('$' + this.player.coins)
  }
  addPlayer() {
    console.log(this.player)
    this.grid[this.player.location.r][this.player.location.c].tileValue = this.player.strength;
    this.grid[this.player.location.r][this.player.location.c].tileText.setText(this.player.strength)
    this.grid[this.player.location.r][this.player.location.c].tileText.setTint(this.colors.tileNormal)
    this.grid[this.player.location.r][this.player.location.c].tileSprite.setTint(this.colors.tileNormal)
    this.grid[this.player.location.r][this.player.location.c].isEmpty = false;
    this.grid[this.player.location.r][this.player.location.c].name = '';
    this.grid[this.player.location.r][this.player.location.c].strength = 0;
  }
  removePlayer() {

    this.grid[this.player.location.r][this.player.location.c].tileValue = 0;
    this.grid[this.player.location.r][this.player.location.c].tileText.setText('')
    this.grid[this.player.location.r][this.player.location.c].tileText.setTint(this.colors.tileNormal)
    this.grid[this.player.location.r][this.player.location.c].tileSprite.setTint(this.colors.tileEmpty)
    this.grid[this.player.location.r][this.player.location.c].isEmpty = true;
    this.grid[this.player.location.r][this.player.location.c].name = '';
    this.grid[this.player.location.r][this.player.location.c].strength = 0;
  }
  createGrid() {
    this.grid = [];
    this.upgradeMax = numberRPGData.upgradeMax;
    //this.fieldArray = [];
    // this.fieldGroup = this.add.group();
    // console.log('saveval ' + gridGameData.grid[2][2].value)
    for (var i = 0; i < 5; i++) {
      this.grid[i] = [];
      for (var j = 0; j < 5; j++) {

        var tileXPos = this.xOffset + j * (this.tileSize + 15) + this.tileSize / 2;
        var tileYPos = this.yOffset + i * (this.tileSize + 15) + this.tileSize / 2;
        var saveValue = numberRPGData.grid[i][j].value
        var saveUp = numberRPGData.grid[i][j].upgrade

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
          isEmpty: true,
          canUpgrade: saveUp,
          hasBonus: false,
          name: '',
        }
      }
    }
  }
  addTiles(count) {
    if (count == 0) { return }
    if (count > this.deck.length) {
      count == this.deck.length
    }
    let added = 0;
    let coo, val;
    while (added < count) {
      coo = this.getEmptySpace();
      if (this.deck.length == 0) { return }
      var card = this.deck.pop()
      this.grid[coo.r][coo.c].tileValue = card.id;
      this.grid[coo.r][coo.c].tileText.setText(card.text)
      this.grid[coo.r][coo.c].tileSprite.setTint(card.color)
      this.grid[coo.r][coo.c].tileText.setTint(card.color)
      this.grid[coo.r][coo.c].isEmpty = false;
      this.grid[coo.r][coo.c].name = card.name;
      this.grid[coo.r][coo.c].strength = card.strength;
      //this.grid[index].tileSprite.setTint(0x111111)
      added++;
    }
    console.log('tiles: ' + added)
  }
  addDoor() {
    let coo = this.getEmptySpace();
    this.grid[coo.r][coo.c].tileValue = -1;
    this.grid[coo.r][coo.c].tileText.setText('[]')
    this.grid[coo.r][coo.c].tileSprite.setTint(this.colors.tileKey)
    this.grid[coo.r][coo.c].tileText.setTint(this.colors.tileKey)
    this.grid[coo.r][coo.c].isEmpty = false;
    this.grid[coo.r][coo.c].name = 'Door';

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
      if (this.grid[rnd.r][rnd.c].isEmpty) {
        clear = true
      }
    }
    return rnd;
    // return {r: 2, c: 3};
  }
  clearGrid() {
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        this.grid[i][j].tileValue = 0;
        this.grid[i][j].isEmpty = true
        this.grid[i][j].name = '',
          this.grid[i][j].tileSprite.setTint(this.colors.tileEmpty)
        this.grid[i][j].tileText.setText('')
      }
    }

  }
  nextLevel() {
    this.removePlayer();
    //clear board
    this.clearGrid()
    this.makeDeck();
    this.addTiles(6);
    //shuffle deck
    //add tiles
  }
  endSwipe(e) {
    var swipeTime = e.upTime - e.downTime;
    var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
    var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
    if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {

      if (swipeNormal.x > 0.8) {
        console.log('right')
        this.handleMove(0, 1, );
      }
      if (swipeNormal.x < -0.8) {
        console.log('left')
        this.handleMove(0, -1);
      }
      if (swipeNormal.y > 0.8) {
        console.log('down')
        this.handleMove(1, 0);
      }
      if (swipeNormal.y < -0.8) {
        console.log('up')
        this.handleMove(-1, 0);
      }
    }
  }
  handleMove(deltaRow, deltaCol) {

    if (this.player.location.r + deltaRow == 5 || this.player.location.r + deltaRow < 0 || this.player.location.c + deltaCol == 5 || this.player.location.c + deltaCol < 0) { return }
    if (this.currentRoll > 0) {



      var playerTile = this.grid[this.player.location.r][this.player.location.c]
      var playerTileNew = this.grid[this.player.location.r + deltaRow][this.player.location.c + deltaCol]
      this.tileTypeText.setText(playerTileNew.name)
      if (this.checkBlock(playerTileNew)) { return }
      if (this.hasArrow){
        this.hasArrow = false;
        this.playerArrowText.setVisible(false)
        this.player.strength -= 1;
        this.updateStats();
      }
      this.checkCollectable(playerTileNew);
      if (this.checkEnemy(playerTileNew)) {
        this.doBattle(playerTile, playerTileNew, deltaRow, deltaCol)
        return

      }
      this.tweens.add({
        targets: [playerTile.tileSprite, playerTile.tileText],
        x: playerTile.tileSprite.x + (deltaCol * 50),
        y: playerTile.tileSprite.y + (deltaRow * 50),
        yoyo: true,
        duration: 100,
        onCompleteScope: this,
        onComplete: function() {

          this.currentRoll--;
          this.nextNum.setText(this.currentRoll)
          if (this.currentRoll == 0) {
            this.addTiles(Phaser.Math.Between(0, 3))
          }
        }
      })


      this.removePlayer()
      this.player.location.r += deltaRow;
      this.player.location.c += deltaCol;
      this.addPlayer()
      console.log(this.player.location)
    }
  }
  checkBlock(tile) {
    if (tile.name == 'Wall' || tile.name == 'Tree') {
      return true
    }
  }
  checkCollectable(tile) {
    if (tile.name == 'Potion') {
      this.player.magic += 5;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '@')
      this.updateStats();
    } else if (tile.name == 'Coin') {
      this.player.coins += 1;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '$')
      this.updateStats();
    } else if (tile.name == 'Health') {
      this.player.health += 1;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '#')
      this.updateStats();
    } else if (tile.name == 'Sword') {
      this.player.strength += 1;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '1')
      this.updateStats();
    } else if (tile.name == 'Sheild') {
      this.player.protection += 1;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '1')
      this.updateStats();
    } else if (tile.name == 'Arrow') {
      this.player.strength += 1;
      this.playerArrowText.setVisible(true)
      this.hasArrow = true;
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, '1')
      this.updateStats();
    } else if (tile.name == 'Key') {
      this.addDoor()
      this.addNumberPopUp(tile.tileSprite.x, tile.tileSprite.y, 'K')
      this.updateStats();
    } else if (tile.name == 'Door') {
      alert('level complete')
      this.nextLevel()
    }
  }
  checkEnemy(tile) {
    if (tile.name == 'Enemy 1' || tile.name == 'Enemy 2' || tile.name == 'Enemy 3' || tile.name == 'Enemy 4') {
      return true
    }
    return false
  }
  doBattle(player, enemy, deltaRow, deltaCol) {
    //alert('battle')
    this.tweens.add({
      targets: [player.tileSprite, player.tileText],
      x: player.tileSprite.x + (deltaCol * 50),
      y: player.tileSprite.y + (deltaRow * 50),
      yoyo: true,
      duration: 100,
      onCompleteScope: this,
      onComplete: function() {

        // this.currentRoll--;
        //this.nextNum.setText(this.currentRoll)
        // if (this.currentRoll == 0) {
        //this.addTiles(Phaser.Math.Between(0, 3))
        // }
      }
    })
    this.tweens.add({
      targets: [enemy.tileSprite, enemy.tileText],
      x: enemy.tileSprite.x + (deltaCol * 50),
      y: enemy.tileSprite.y + (deltaRow * 50),
      yoyo: true,
      duration: 100,
      delay: 50,
      onCompleteScope: this,
      onComplete: function() {
        var chance;
        console.log('ps' + this.player.strength + ' es' + enemy.strength)
        if(this.player.strength > enemy.strength){
          chance = 50 - (this.player.strength - enemy.strength)
        } else if(this.player.strength < enemy.strength) {
           chance = 50 + (enemy.strength - this.player.strength)
        } else {
          chance = 50
        }
       
       
       
       
       
        if (Phaser.Math.Between(0, 100) > chance) {
         // this.player.strength += 1;
          this.currentRoll--;
          this.nextNum.setText(this.currentRoll)
          this.removePlayer()
          this.player.location.r += deltaRow;
          this.player.location.c += deltaCol;
          this.addPlayer()

        } else {
          this.player.health -= 1;
          
        }
        this.updateStats();
        // this.currentRoll--;
        //this.nextNum.setText(this.currentRoll)
        // if (this.currentRoll == 0) {
        //this.addTiles(Phaser.Math.Between(0, 3))
        // }
      }
    })

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
  makeDeck() {
    this.deck = [
      { name: 'Wall', text: 'X', id: 0, color: this.colors.tileWall, strength: 0 },
      { name: 'Potion', text: '@', id: 1, color: this.colors.tilePotion, strength: 0 },
      { name: 'Sword', text: '|', id: 2, color: this.colors.tileSword, strength: 0 },
      { name: 'Sheild', text: '()', id: 3, color: this.colors.tileSheild, strength: 0 },
      { name: 'Enemy 1', text: '3', id: 4, color: this.colors.tileEnemy1, strength: 3 },
      { name: 'Tree', text: 'T', id: 6, color: this.colors.tileTree, strength: 0 },
      { name: 'Arrow', text: '}->', id: 7, color: this.colors.tileArrow, strength: 0 },
      { name: 'Tree', text: 'T', id: 8, color: this.colors.tileTree, strength: 0 },
      { name: 'Enemy 2', text: '5', id: 9, color: this.colors.tileEnemy2, strength: 5 },
      { name: 'Enemy 3', text: '7', id: 10, color: this.colors.tileEnemy3, strength: 7 },
      { name: 'Enemy 4', text: '9', id: 11, color: this.colors.tileEnemy4, strength: 9 },
      { name: 'Enemy 1', text: '3', id: 12, color: this.colors.tileEnemy1, strength: 3 },
      { name: 'Enemy 1', text: '3', id: 13, color: this.colors.tileEnemy1, strength: 3 },
      { name: 'Wall', text: 'X', id: 14, color: this.colors.tileWall, strength: 0 },
      { name: 'Potion', text: '@', id: 15, color: this.colors.tilePotion, strength: 0 },
      { name: 'Sword', text: '|', id: 16, color: this.colors.tileSword, strength: 0 },
      { name: 'Key', text: 'K', id: 17, color: this.colors.tileKey, strength: 0 },
      { name: 'Wall', text: 'X', id: 18, color: this.colors.tileWall, strength: 0 },
      { name: 'Wall', text: 'X', id: 19, color: this.colors.tileWall, strength: 0 },
      { name: 'Health', text: '#', id: 20, color: this.colors.tileHealth, strength: 0 },
      { name: 'Coin', text: '$', id: 21, color: this.colors.tileCoin, strength: 0 },
      { name: 'Coin', text: '$', id: 22, color: this.colors.tileCoin, strength: 0 },
    ]
    Phaser.Utils.Array.Shuffle(this.deck)

  }

}