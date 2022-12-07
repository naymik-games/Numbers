let tenPairOptions = {
  cols: 8,

  rows: 10,
  offSetY: 160,
  offSetX: 0,
  sum: 10,
  gameMode: 0,
  addNewTiles: 8,
  startTiles: 32,
  space: 0,
  bgColor: 0x000000,
  scratchColor: 0xf3f4f3,
  textColor: 0x000000,
  tileColor: 0xffffff,
  selectColor: 0x16a085
}

class tenPair extends Phaser.Scene {
  constructor() {
    super("tenPair");
  }
  preload() {


  }
  create() {
	
	
	this.level = 1;
	//set up level varialbles
	this.sum = tenPairOptions.sum; //sum for matching 
	this.addNewNumber = tenPairOptions.addNewTiles; //how many tiles to add after board cleared
	this.numbers = [1, 2, 8, 9]; //number array for random selection
	this.stockpile = [5,3,7,4,6,10,11,12,13,14,15,16,17,18,20]; //numbers to add each level
	this.sumStockpile = [10,10,10,10,10,9,12,13,14,15,16,17,18,19,20,21]
    this.maxTiles = tenPairOptions.startTiles //starts of with a certain number of tiles
	
	
	
    this.cameras.main.setBackgroundColor(tenPairOptions.bgColor);
    this.selected = { value: 0, id: null }
    this.maxTotalTiles = tenPairOptions.cols * tenPairOptions.rows
    
    this.blockSize = game.config.width / tenPairOptions.cols;
	this.gridHeight = this.blockSize * tenPairOptions.rows;
	
	this.topBar = this.add.image(0, tenPairOptions.offSetY, "blank").setOrigin(0,1).setTint(0xff0000);
	this.topBar.displayWidth = game.config.width;
	this.topBar.displayHeight = 10;
	
	this.bottomBar = this.add.image(0, tenPairOptions.offSetY + this.gridHeight, "blank").setOrigin(0,0).setTint(0xff0000);
	this.bottomBar.displayWidth = game.config.width;
	this.bottomBar.displayHeight = 10;
	
    this.createGrid();
    
    this.addButton = this.add.image(0, 0, 'blank').setOrigin(0).setInteractive();
	this.addButton.displayWidth = game.config.width / 5;
	this.addButton.displayHeight = tenPairOptions.offSetY - 10;
	this.addButtonText = this.add.bitmapText(this.addButton.x + this.addButton.displayWidth / 2, this.addButton.displayHeight / 2, 'topaz', '+', 120).setOrigin(.5).setTint(tenPairOptions.textColor);
    this.addButton.on('pointerdown', this.addExisting, this)
    
	this.shuffleButton = this.add.image(this.addButton.displayWidth, 0, 'blank').setOrigin(0).setInteractive();
    this.shuffleButton.displayWidth = game.config.width / 5;
	this.shuffleButton.displayHeight = tenPairOptions.offSetY - 10;
	this.shuffleButtonText = this.add.bitmapText(this.shuffleButton.x + this.shuffleButton.displayWidth / 2, this.shuffleButton.displayHeight / 2, 'topaz', 'S', 90).setOrigin(.5).setTint(tenPairOptions.textColor);
    this.shuffleButton.on('pointerdown', this.shuffle, this)
	
	this.sumTile = this.add.image(this.addButton.displayWidth + this.shuffleButton.displayWidth, 0, 'blank').setOrigin(0);
    this.sumTile.displayWidth = game.config.width / 5;
	this.sumTile.displayHeight = tenPairOptions.offSetY - 10;
	this.sumTileText = this.add.bitmapText(this.sumTile.x + this.sumTile.displayWidth / 2, this.sumTile.displayHeight / 2, 'topaz', this.sum, 120).setOrigin(.5).setTint(0xff0000);
   
	this.levelTile = this.add.image(this.addButton.displayWidth + this.shuffleButton.displayWidth + this.sumTile.displayWidth, 0, 'blank').setOrigin(0);
    this.levelTile.displayWidth = game.config.width / 5;
	this.levelTile.displayHeight = tenPairOptions.offSetY - 10;
	this.levelTileText = this.add.bitmapText(this.levelTile.x + this.levelTile.displayWidth / 2, this.levelTile.displayHeight / 2, 'topaz', this.level, 120).setOrigin(.5).setTint(tenPairOptions.textColor);
   
	this.revalueButton = this.add.image(this.addButton.displayWidth + this.shuffleButton.displayWidth + this.sumTile.displayWidth + this.levelTile.displayWidth, 0, 'blank').setOrigin(0).setInteractive();
    this.revalueButton.displayWidth = game.config.width / 5;
	this.revalueButton.displayHeight = tenPairOptions.offSetY - 10;
	this.revalueButtonText = this.add.bitmapText(this.revalueButton.x + this.revalueButton.displayWidth / 2, this.revalueButton.displayHeight / 2, 'topaz', 'R', 90).setOrigin(.5).setTint(tenPairOptions.textColor);
    this.revalueButton.on('pointerdown', this.shuffle, this)

	
	
	
    this.newButton = this.add.image(200, 1400, 'blank').setInteractive();
    this.newButton.on('pointerdown', function(){
      this.addTiles(8)
    }, this)
    
    this.shuffleButton = this.add.image(350, 1400, 'blank').setInteractive();
    this.shuffleButton.on('pointerdown', this.reValue, this)
    
    
    this.input.on('pointerdown', this.pickTile, this);
  }
  pickTile(e) {

    var legalMove = false;
    var posX = e.x - tenPairOptions.offSetX;
    var posY = (e.y - tenPairOptions.offSetY);
    var pickedRow = Math.floor(posY / (this.blockSize + tenPairOptions.space));
    var pickedCol = Math.floor(posX / (this.blockSize + tenPairOptions.space));
    // if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < tenPairOptions.rows && pickedCol < tenPairOptions.cols) {
    var id = this.getIdFromGrid(pickedRow, pickedCol);
    //if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < tenPairOptions.rows && pickedCol < tenPairOptions.cols) {
    if (pickedRow >= 0 && pickedCol >= 0 && id < this.maxTiles) {

      var pickedTile = this.grid[id];
      if (!pickedTile.open) { return }
      console.log('[' + pickedRow + '][' + pickedCol + '], ' + 'id ' + pickedTile.id + ', value ' + pickedTile.tileValue)
      if (this.selected.value == 0) {
        this.selectTile(pickedTile);
      } else {
        if (this.areAjacent(pickedTile.id, this.selected.id)) {
          if (this.validMatch(this.selected.value, pickedTile.tileValue)) {
            this.doMatch(this.grid[this.selected.id], pickedTile);
           this.clearTile()
            if(this.checkCompletion()){
              alert('cleared')
              this.nextLevel();
            }
            // if values remain, check for emth rows
            this.checkForEmpty();
            
          } else {
            this.clearTile()
          }

        } else {
          this.clearTile()
        }
      }
    }

  }
  selectTile(tile) {
    this.selected.value = tile.tileValue;
    this.selected.id = tile.id;
    tile.tileSprite.setTint(tenPairOptions.selectColor);
  }
  clearTile() {
    this.grid[this.selected.id].tileSprite.setTint(tenPairOptions.tileColor);
    this.selected.value = 0;
    this.selected.id = null;

  }
  validMatch(first, second) {
    if (first == second || first + second == this.sum) {
      return true
    }
    return false
  }
  doMatch(first, second) {
    first.tileText.setTint(tenPairOptions.scratchColor)
    first.open = false;
    second.tileText.setTint(tenPairOptions.scratchColor)
    second.open = false;
  }
  checkCompletion(){
    var done = true;
    for (var i = 0; i < this.maxTiles; i++) {
      if (this.grid[i].open) {
        //console.log(this.grid[i].open)
        done = false
        return done;
      }
    }
    return done;
  }
  addExisting() {
    var values = this.getExistingValues();
    var v = 0
    for (var i = this.maxTiles; i < this.maxTiles + values.length; i++) {
      this.grid[i].tileValue = values[v];
      this.grid[i].open = true;
      this.grid[i].tileText.setText(values[v]);
      this.grid[i].tileText.setTint(tenPairOptions.textColor)
      v++;
    }
    this.maxTiles += values.length;
  }
  getExistingValues() {
    var values = []
    for (var i = 0; i < this.maxTiles; i++) {
      if (this.grid[i].open ) {
        
        values.push(this.grid[i].tileValue)
      }
    }
    return values
  }
  addTiles(num){
    for (var i = 0; i < num; i++) {
      var rand = Phaser.Math.Between(0, this.numbers.length - 1)
      var val = this.numbers[rand]
      this.grid[this.maxTiles + i].tileValue = val;
      this.grid[this.maxTiles + i].open = true;
      this.grid[this.maxTiles + i].toDelete = false;
      this.grid[this.maxTiles + i].tileText.setText(val);
      this.grid[this.maxTiles + i].tileText.setTint(tenPairOptions.textColor)
      
    }
    this.maxTiles += num;
  }

  checkForEmpty() {
    //finds all empty rows
    var emptyRows = []
    for (var i = 0; i < Math.ceil(this.maxTiles / tenPairOptions.cols); i++) {
      var isEmpty = true;
      for (var j = 0; j < tenPairOptions.cols; j++) {
        //if(this.board[this.getIdfromGrid({r:i,c:j})].active){
        if (this.grid[this.getIdFromGrid(i, j)].open) {
          isEmpty = false;
        }
        //}
      }
      if (isEmpty) {
        emptyRows.push(i)
      }
    }
    console.log('empty rows' + emptyRows)
    if (emptyRows.length > 0) {
      this.removeRow(emptyRows[0])
    }

  }

  removeRow(row) {
    for (var c = 0; c < tenPairOptions.cols; c++) {
      var id = this.getIdFromGrid(row, c);
      this.grid[id].tileText.setTint(tenPairOptions.tileColor);
      this.grid[id].toDelete = true;
    }
    this.collapseUp();
  }
  collapseUp() {
    // grab status and value of non delete tiles
    var keep = []
    for (var i = 0; i < this.maxTiles; i++) {
      if (!this.grid[i].toDelete) {
        var temp = {
          value: this.grid[i].tileValue,
          open: this.grid[i].open
        }
        keep.push(temp)
      }
      //clear board
      this.grid[i].tileValue = 0;
      this.grid[i].tileText.setTint(tenPairOptions.tileColor)
      this.grid[i].open = false;
      this.grid[i].toDelete = false;
    }
    this.maxTiles = keep.length
    console.log('move ' + keep.length)
    //reprint grid
    for (var i = 0; i < this.maxTiles; i++) {
      this.grid[i].tileValue = keep[i].value;
      this.grid[i].open = keep[i].open;
      this.grid[i].tileText.setText(keep[i].value)
      if (keep[i].open) {
        this.grid[i].tileText.setTint(tenPairOptions.textColor)
      } else {
        this.grid[i].tileText.setTint(tenPairOptions.scratchColor)
      }

    }
  }
  shuffle() {
    // grab status and value of all tiles
    var keep = []
    for (var i = 0; i < this.maxTiles; i++) {
      
        var temp = {
          value: this.grid[i].tileValue,
          open: this.grid[i].open
        }
        keep.push(temp)
      
      //clear board
      this.grid[i].tileValue = 0;
      this.grid[i].tileText.setTint(tenPairOptions.tileColor)
      this.grid[i].open = false;
      this.grid[i].toDelete = false;
    }
   Phaser.Utils.Array.Shuffle(keep)
    //reprint grid
    for (var i = 0; i < this.maxTiles; i++) {
      this.grid[i].tileValue = keep[i].value;
      this.grid[i].open = keep[i].open;
      this.grid[i].tileText.setText(keep[i].value)
      if (keep[i].open) {
        this.grid[i].tileText.setTint(tenPairOptions.textColor)
      } else {
        this.grid[i].tileText.setTint(tenPairOptions.scratchColor)
      }
  
    }
  }
  
  reValue() {
    // grab status and value of all tiles
    var keep = []
    for (var i = 0; i < this.maxTiles; i++) {
      
        var temp = {
          value: this.grid[i].tileValue,
          open: this.grid[i].open
        }
        keep.push(temp)
      
      //clear board
      this.grid[i].tileValue = 0;
      this.grid[i].tileText.setTint(tenPairOptions.tileColor)
      this.grid[i].open = false;
      this.grid[i].toDelete = false;
    }
  // Phaser.Utils.Array.Shuffle(keep)
    //reprint grid
    for (var i = 0; i < this.maxTiles; i++) {
      var rand = Phaser.Math.Between(0, this.numbers.length - 1)
      var num = this.numbers[rand];
      this.grid[i].tileValue = num;
      this.grid[i].open = keep[i].open;
      this.grid[i].tileText.setText(num)
      if (keep[i].open) {
        this.grid[i].tileText.setTint(tenPairOptions.textColor)
      } else {
        this.grid[i].tileText.setTint(tenPairOptions.scratchColor)
      }
  
    }
  }
  nextLevel(){
    this.addNewNumber += 8
	  this.addTiles(this.addNewNumber);
	  this.numbers.push(this.stockpile[this.level]);
	  this.sum = this.sumStockpile[this.level];
	  this.sumTileText.setText(this.sum);
	  this.level++;
	  this.levelTileText.setText(this.level)
	  
  }
  
  
  createGrid() {

    this.grid = [];
    //this.fieldArray = [];
    // this.fieldGroup = this.add.group();
    var count = 0
    for (var i = 0; i < tenPairOptions.cols * tenPairOptions.rows; i++) {

      var g = this.getGridFromId(i);
      var tileXPos = tenPairOptions.offSetX + g.c * (this.blockSize + tenPairOptions.space) + this.blockSize / 2;
      var tileYPos = tenPairOptions.offSetY + g.r * (this.blockSize + tenPairOptions.space) + this.blockSize / 2;


      var two = this.add.sprite(tileXPos, tileYPos, 'blank').setTint(tenPairOptions.tileColor);
      two.displayWidth = this.blockSize;
      two.displayHeight = this.blockSize;




      var rand = Phaser.Math.Between(0, this.numbers.length - 1)
      var num = this.numbers[rand]
      var open = true;


      var tileText = this.add.bitmapText(tileXPos, tileYPos, 'topaz', '', 90).setOrigin(.5).setTint(tenPairOptions.textColor);
      // two.alpha = 0;
      //two.visible = 0;
      //  this.fieldGroup.add(two);
      if (i < this.maxTiles) {
        tileText.setText(num)
        var tile = {
          tileValue: num,
          tileText: tileText,
          tileSprite: two,
          toDelete: false,
          open: true,

          id: i
        }
      } else {
        //tileText.setText(num)
        var tile = {
          tileValue: 0,
          tileText: tileText,
          tileSprite: two,
          toDelete: false,
          open: false,

          id: i
        }
      }

      this.grid.push(tile)
    }


    //console.log(this.getValidNeighborIds(5));



  }
  areAjacent(firstId, secondId) {
    var ok = false;
    if (secondId == this.getIdBlankRight(firstId)) {
      ok = true;
    } else if (secondId == this.getIdBlankLeft(firstId)) {
      ok = true;
    } else if (secondId == this.getIdBlankUp(firstId)) {
      ok = true;
    } else if (secondId == this.getIdBlankDown(firstId)) {
      ok = true;
    }
    return ok
  }

  getIdBlankRight(id) {
    var open = false
    if (id + 1 > (tenPairOptions.rows * tenPairOptions.cols) - 1 || id + 1 > this.maxTiles - 1) {
      return -1
    }
    var status;
    while (!open) {
      if (id + 1 > (tenPairOptions.rows * tenPairOptions.cols) - 1 || id + 1 > this.maxTiles - 1) {
        return -1
      }
      status = this.getStatusById(id + 1)

      if (status) {
        open = true;
      }
      id++
    }
    return id
  }
  getIdBlankLeft(id) {
    var open = false
    if (id - 1 < 0) {
      return -1
    }
    var status;
    while (!open) {
      if (id - 1 < 0) {
        return -1
      }
      status = this.getStatusById(id - 1)
      //console.log(status)
      if (status) {
        open = true;
      }
      id--
    }
    return id
  }
  getIdBlankUp(id) {
    var open = false
    if (id - tenPairOptions.cols < 0) {
      return -1
    }
    var status;
    while (!open) {
      if (id - tenPairOptions.cols < 0) {
        return -1
      }
      status = this.getStatusById(id - tenPairOptions.cols)
      //  console.log(status)
      if (status) {
        open = true;
      }
      id -= tenPairOptions.cols;
    }
    return id
  }
  getIdBlankDown(id) {
    var open = false
    if (id + tenPairOptions.cols > (tenPairOptions.rows * tenPairOptions.cols) - 1 || id + tenPairOptions.cols > this.maxTiles - 1) {
      return -1
    }
    var status;
    while (!open) {
      if (id + tenPairOptions.cols > (tenPairOptions.rows * tenPairOptions.cols) - 1 || id + tenPairOptions.cols > this.maxTiles - 1) {
        return -1
      }
      status = this.getStatusById(id + tenPairOptions.cols)
      //console.log(status)
      if (status) {
        open = true;

      }
      id += tenPairOptions.cols;
    }
    //console.log(id)
    return id
  }
  getStatusById(id) {
    // if(id < 0){return false}
    var row = Math.floor(id / tenPairOptions.cols);
    var col = id % tenPairOptions.cols;
    return this.grid[id].open

  }


  getGridFromId(id) {
    var row = Math.floor(id / tenPairOptions.cols);
    var col = id % tenPairOptions.cols;
    return { r: row, c: col }
  }
  getIdFromGrid(r, c) {
    return c + r * tenPairOptions.cols;
  }

}