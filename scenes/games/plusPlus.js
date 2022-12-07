class plusPlus extends Phaser.Scene {
  constructor() {
    super("plusPlus");
  }
  preload() {


  }
  create() {

this.cameras.main.fadeIn(800, 0, 0, 0);
    this.cameras.main.setBackgroundColor(0x000000);
    var title = this.add.bitmapText(game.config.width / 2, 50, 'topaz', 'Plus+Plus', 100).setOrigin(.5).setTint(0xc76210);
    this.tileSize = 150;
    this.xOffset = (game.config.width - (5 * (this.tileSize + 15) + this.tileSize / 2)) / 2;

    this.yOffset = 450;
    
    this.destroyTile = false;
    
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

    this.score = 0;
    
    this.numbers = 6;
    
    this.numText = this.add.bitmapText(15, 400, 'topaz', '', 60).setOrigin(0,.5).setTint(0xecf0f1);

    this.printNumbers(this.numbers);
    
    this.drawNumbers(this.numbers, true);
    this.createGrid();
    this.input.on('pointerdown', this.pickTile, this);
    this.nextSlot.on("pointerdown", this.addScore, this);

    this.remove = this.add.image(65, 1375, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.remove.displayWidth = 100;
    this.remove.displayHeight = 100;
    this.removeText = this.add.bitmapText(65, 1375, 'topaz', 'R', 70).setOrigin(.5).setTint(0xecf0f1);
    this.remove.on('pointerdown', function(){
      this.destroyTile = true;
      this.remove.setTint(0xe74c3c)
      this.removeText.setTint(0xe74c3c)
      this.remove.disableInteractive();
    }, this)



    this.remove2 = this.add.image(195, 1375, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.remove2.displayWidth = 100;
    this.remove2.displayHeight = 100;
    this.removeText2 = this.add.bitmapText(195, 1375, 'topaz', 'R', 70).setOrigin(.5).setTint(0xecf0f1);
    this.remove2.on('pointerdown', function(){
      this.destroyTile = true;
      this.remove2.setTint(0xe74c3c)
      this.removeText2.setTint(0xe74c3c)
      this.remove2.disableInteractive();
    }, this)


    this.remove3 = this.add.image(325, 1375, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.remove3.displayWidth = 100;
    this.remove3.displayHeight = 100;
    this.removeText3 = this.add.bitmapText(325, 1375, 'topaz', 'R', 70).setOrigin(.5).setTint(0xecf0f1);
    this.remove3.on('pointerdown', function() {
      this.destroyTile = true;
      this.remove3.setTint(0xe74c3c)
      this.removeText3.setTint(0xe74c3c)
      this.remove3.disableInteractive();
    }, this)

    this.scoreText = this.add.bitmapText(750, 1375, 'topaz', '0', 70).setOrigin(1,.5).setTint(0xecf0f1);

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
    //this.fieldArray = [];
    // this.fieldGroup = this.add.group();
    for (var i = 0; i < 5; i++) {
      this.grid[i] = [];
      for (var j = 0; j < 5; j++) {

        var tileXPos = this.xOffset + j * (this.tileSize + 15) + this.tileSize / 2;
        var tileYPos = this.yOffset + i * (this.tileSize + 15) + this.tileSize / 2;
        

        var two = this.add.sprite(tileXPos,tileYPos, 'blankoutline').setTint(0x7f8c8d);
        two.displayWidth = 140;
        two.displayHeight = 140;
        
        var tileText = this.add.bitmapText(tileXPos, tileYPos, 'topaz', '', 100).setOrigin(.5).setTint(0x16a085);

        // two.alpha = 0;
        //two.visible = 0;
        //  this.fieldGroup.add(two);
        this.grid[i][j] = {
          tileValue: 0,
          tileText: tileText,
          tileSprite: two,
          canUpgrade: true
        }
      }
    }
  }
  pickTile(e){
    var legalMove = false;
    var posX = e.x - this.xOffset;
    var posY = (e.y - this.yOffset);
    var pickedRow = Math.floor(posY / (this.tileSize + 15));
    var pickedCol = Math.floor(posX / (this.tileSize + 15));
   console.log('[' + pickedRow + '][' + pickedCol + ']')
    if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < 5 && pickedCol < 5) {
      var pickedTile = this.grid[pickedRow][pickedCol];
      
       if(pickedTile.tileValue == 0){
         pickedTile.tileSprite.setTint(0x16a085);
         pickedTile.tileValue = this.nextSlot.value;
         pickedTile.tileText.setText(this.nextSlot.value);
         legalMove = true;
         
       } else if(pickedTile.tileValue > 0){
         if(this.destroyTile){
           pickedTile.tileSprite.setTint(0x7f8c8d);
           pickedTile.tileValue = 0;
           pickedTile.tileText.setText('');
           pickedTile.tileText.setTint(0x16a085);
           pickedTile.canUpgrade = true;
           this.destroyTile = false;
         } else if(pickedTile.canUpgrade){
         
           pickedTile.tileSprite.setTint(0xe74c3c);
           pickedTile.tileValue = this.nextSlot.value + pickedTile.tileValue;
           pickedTile.tileText.setText(pickedTile.tileValue);
           pickedTile.tileText.setTint(0xe74c3c);
           pickedTile.canUpgrade = false;
           legalMove = true;
         }
         
       }
       
       if(legalMove){
         
         this.score += pickedTile.tileValue;
         this.score += this.removeTiles(pickedRow, pickedCol);
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
  printNumbers(n){
    var numText = '';
    for(var i = 1; i < n + 1; i++){
      numText += i + ' ';
    }
    
    this.numText.setText(numText);

   
  }
  updateGUI(n, s){
    if(s > n * (n - 1) * (n - 2)){
      n++
    }
    this.printNumbers(n);
    this.scoreText.setText(s);
    return n
  }
  removeTiles(row, col){
    var score = 0;
    if(this.removeRow(row)){
      for(var i = 0; i < 5; i++){
        var tile = this.grid[row][i];
        score += tile.tileValue;
        tile.tileSprite.setTint(0x7f8c8d);
           tile.tileValue = 0;
           tile.tileText.setText('');
           tile.tileText.setTint(0x16a085);
           tile.canUpgrade = true;
      }
    }
    if(this.removeCol(col)){
      for(var i = 0; i < 5; i++){
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
  removeRow(row){
    var value = this.grid[row][0].tileValue;
    if(value == 0){
      return false;
    }
    for(var i = 1; i < 5; i++){
      if(this.grid[row][i].tileValue != value){
        return false;
      }
    }
    return true;
  } 
  removeCol(col){
    var value = this.grid[0][col].tileValue;
    if(value == 0){
      return false;
    }
    for(var i = 1; i < 5; i++){
      if(this.grid[i][col].tileValue != value){
        return false;
      }
    }
    return true;
  }
  drawNumbers(max, firstRun){
    var n = Math.floor(Math.random() * max) + 1;
    this.nextNum3.setText(n);
    this.nextSlot3.value = n;
    if(firstRun){
      var n = Math.floor(Math.random() * max) + 1;
      this.nextSlot2.value = n;
      this.nextNum2.setText(n);
      var n = Math.floor(Math.random() * max) + 1;
      this.nextSlot.value = n;
      this.nextNum.setText(n);
    }
  }
  checkBoard(){
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        var tile = this.grid[i][j];
        if(tile.tileValue == 0 || tile.canUpgrade){
          return
        }
      }
    }
    alert('lose')
    gameData.plusLast = this.score;

        if(this.score > gameData.plusHigh){

          gameData.plusHigh = this.score;
        }
      this.saveSettings();
  }
  addScore() {
    console.log('clicked')
    this.events.emit('score');
  }
  saveSettings() {

    localStorage.setItem('numbersData', JSON.stringify(gameData));

  }
}