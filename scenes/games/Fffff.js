create() {
    this.numberArray = [1, 2, 9,8,4];
    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.cameras.main.setBackgroundColor(0x000000);
    var title = this.add.bitmapText(game.config.width / 2, 50, 'topaz', 'Plus+Plus', 100).setOrigin(.5).setTint(0xc76210);
    this.tileSize = 100;
    this.xOffset = (game.config.width - (tenPairOptions.cols * (this.tileSize + tenPairOptions.space) + this.tileSize / 2)) / 2;

    this.yOffset = 200;

    this.destroyTile = false;

    this.numberTemp = 5;

    this.selected = { value: 0, row: null, col: null }

    this.maxTiles = 12;
    this.maxTotalTiles = tenPairOptions.rows * tenPairOptions.cols;
    this.maxRows = 13;
    this.score = 0;

    this.numbers = 6;

    this.numText = this.add.bitmapText(15, 400, 'topaz', '', 60).setOrigin(0, .5).setTint(0xecf0f1);

    // this.printNumbers(this.numbers);

    // this.drawNumbers(this.numbers, true);
    this.createGrid();
    this.input.on('pointerdown', this.pickTile, this);
    // this.nextSlot.on("pointerdown", this.addScore, this);

    this.remove = this.add.image(65, 1375, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.remove.displayWidth = 100;
    this.remove.displayHeight = 100;
    this.removeText = this.add.bitmapText(65, 1375, 'topaz', '+', 70).setOrigin(.5).setTint(0xecf0f1);
    this.remove.on('pointerdown', function() {
      this.consolidate();
    }, this)
this.remove2 = this.add.image(185, 1375, 'blankoutline').setInteractive().setTint(0xecf0f1);
    this.remove2.displayWidth = 100;
    this.remove2.displayHeight = 100;
    this.remove2Text = this.add.bitmapText(185, 1375, 'topaz', 'E', 70).setOrigin(.5).setTint(0xecf0f1);
    this.remove2.on('pointerdown', function() {
      this.addNewTiles(8)
    }, this)




    this.scoreText = this.add.bitmapText(750, 1375, 'topaz', '0', 70).setOrigin(1, .5).setTint(0xecf0f1);

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
    var count = 0
    for (var i = 0; i < tenPairOptions.rows; i++) {
      this.grid[i] = [];
      for (var j = 0; j < tenPairOptions.cols; j++) {

        var tileXPos = this.xOffset + j * (this.tileSize + tenPairOptions.space) + this.tileSize / 2;
        var tileYPos = this.yOffset + i * (this.tileSize + tenPairOptions.space) + this.tileSize / 2;


        var two = this.add.sprite(tileXPos, tileYPos, 'blank').setTint(0xffffff);
        two.displayWidth = this.tileSize;
        two.displayHeight = this.tileSize;



        if (count < this.maxTiles) {
          var rand = Phaser.Math.Between(0, this.numberArray.length - 1)
          var num = this.numberArray[rand]
          var open = true;
        } else {
          var num = 0
          var open = false
          two.setTint(0x000000);
        }
        var tileText = this.add.bitmapText(tileXPos, tileYPos, 'topaz', num, 100).setOrigin(.5).setTint(0x000000);
        // two.alpha = 0;
        //two.visible = 0;
        //  this.fieldGroup.add(two);
        this.grid[i][j] = {
          tileValue: num,
          tileText: tileText,
          tileSprite: two,
          open: open,
          tileRow: i,
          tileCol: j,
          id: count
        }
        count++;
      }
    }
  }
  pickTile(e) {
    var legalMove = false;
    var posX = e.x - this.xOffset;
    var posY = (e.y - this.yOffset);
    var pickedRow = Math.floor(posY / (this.tileSize + tenPairOptions.space));
    var pickedCol = Math.floor(posX / (this.tileSize + tenPairOptions.space));
    // if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < tenPairOptions.rows && pickedCol < tenPairOptions.cols) {

    if (pickedRow >= 0 && pickedCol >= 0 && pickedRow < tenPairOptions.rows && pickedCol < tenPairOptions.cols) {
      if (this.getIdfromGrid({ r: pickedRow, c: pickedCol }) > this.maxTiles) { return }
      var pickedTile = this.grid[pickedRow][pickedCol];
      console.log('[' + pickedRow + '][' + pickedCol + '], ' + 'id ' + pickedTile.id)
      // console.log(pickedTile.id)
      //id from coo = row * total cols + col
      //console.log((pickedRow * tenPairOptions.cols) + pickedCol)
      //console.log(Math.floor(pickedTile.id / tenPairOptions.cols))
      //console.log(pickedTile.id % tenPairOptions.cols)
      if (this.selected.value == 0 && pickedTile.tileValue > 0 && pickedTile.open) {
        this.selectTile(pickedTile);
        //this.getNumBlankRight(pickedTile.id)
        // this.highlightNeighbors(pickedTile);
      } else {
        if (this.areAjacent(this.selected.id, pickedTile.id)) {
          if (this.selected.value == pickedTile.tileValue || this.selected.value + pickedTile.tileValue == tenPairOptions.sum) {
            pickedTile.tileSprite.setTint(0xffffff);
            pickedTile.tileText.setTint(0xf4f4f4);
            pickedTile.open = false;
            this.grid[this.selected.row][this.selected.col].tileSprite.setTint(0xffffff);
            this.grid[this.selected.row][this.selected.col].tileText.setTint(0xf4f4f4);
            this.grid[this.selected.row][this.selected.col].open = false
            this.clearSelectedTile(true);
            this.checkBoard();
           // this.checkAllRows();
          } else {
            this.clearSelectedTile(false);
          }
        } else {
          this.clearSelectedTile(false);
        }
      }
    }
  }
  selectTile(tile) {

    this.selected.value = tile.tileValue;
    this.selected.row = tile.tileRow;
    this.selected.col = tile.tileCol;
    this.selected.id = tile.id
    tile.tileSprite.setTint(0x16a085);
  }
  clearSelectedTile(match) {
    if (!match) {
      this.grid[this.selected.row][this.selected.col].tileSprite.setTint(0xffffff);

    }
    this.selected.value = 0;
    this.selected.row = null;
    this.selected.col = null;
    this.selected.id = null;
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
  highlightNeighbors(tile) {

    var right = this.getGridById(tile.id + 1)
    this.grid[right.r][right.c].tileSprite.setAlpha(.5)

    var left = this.getGridById(tile.id - 1);
    this.grid[left.r][left.c].tileSprite.setAlpha(.5);

    var down = this.getGridById(tile.id + tenPairOptions.cols);
    this.grid[down.r][down.c].tileSprite.setAlpha(.5);
    var up = this.getGridById(tile.id - tenPairOptions.cols);
    this.grid[up.r][up.c].tileSprite.setAlpha(.5);
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
      console.log(status)
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
    return this.grid[row][col].open

  }
  getIdfromGrid(grid) {
    return this.grid[grid.r][grid.c].id
  }
  getGridById(id) {
    // if(id < 0){return false}
    var row = Math.floor(id / tenPairOptions.cols);
    var col = id % tenPairOptions.cols;
    return { r: row, c: col }

  }
  getGridById_(id) {
    for (var i = 0; i < tenPairOptions.rows; i++) {
      for (var j = 0; j < tenPairOptions.cols; j++) {
        var tile = this.grid[i][j];
        if (tile.id == id) {
          return { r: tile.tileRow, c: tile.tileCol }
        }
      }
    }
  }
  checkAllRows() {
    var remove = []
    for (var r = 0; r < this.maxRows; r++) {
      var allClosed = false;
      for (var c = 0; c < tenPairOptions.cols; c++) {
        var tile = this.grid[r][c];
        if (tile.open) {
          allClosed = true;
        }
      }
      if (allClosed) {
        //  console.log('dont delete ' + r)
      } else {
        // console.log('delete ' + r)
        remove.push(r)
      }
    }

    if (remove.length > 0) {
      for (var i = 0; i < remove.length; i++) {
        this.removeClosedRow(remove[i]);
      }
    }





  }

  removeClosedRow(row) {

  }


  consolidate() {
    var values = this.getArrayOfValues();

    if (values.length > 0) {
      if (this.maxTiles + values.length >= this.maxTotalTiles) {
        alert('game over')
        return
      }
      for (var i = 0; i < values.length; i++) {
        var grid = this.getGridById(this.maxTiles + i);
        var tile = this.grid[grid.r][grid.c]
        tile.tileSprite.setTint(0xffffff);
        tile.open = true;
        tile.tileValue = values[i];
        tile.tileText.setText(values[i])
      }
      this.maxTiles += values.length;
      var newRows = Math.ceil(this.maxTiles / tenPairOptions.cols);
      this.maxRows = newRows;
     // console.log('mt ' + this.maxTiles + ' mr ' + this.maxRows)
    }
  }
  getArrayOfValues() {
    var openValues = []
    for (var r = 0; r < this.maxRows; r++) {
      for (var c = 0; c < tenPairOptions.cols; c++) {
        var tile = this.grid[r][c];
        if (tile.open && tile.tileValue > 0) {
          openValues.push(tile.tileValue)
        }
      }
    }
   // console.log(openValues.length)
    return openValues;
  }
  addNewTiles(qty){
    if (this.maxTiles + qty >= this.maxTotalTiles) {
       // alert('game over')
       this.addOldTiles(qty);
        return
      }
      for (var i = 0; i < qty; i++) {
        var grid = this.getGridById(this.maxTiles + i);
        var tile = this.grid[grid.r][grid.c]
        tile.tileSprite.setTint(0xffffff);
        tile.open = true;
        var rand = Phaser.Math.Between(0, this.numberArray.length - 1)
          var num = this.numberArray[rand]
        tile.tileValue = num;
        tile.tileText.setText(num)
      }
      this.maxTiles += qty;
      var newRows = Math.ceil(this.maxTiles / tenPairOptions.cols);
      this.maxRows = newRows;
  }
  addOldTiles(qty){
    for (var i = 0; i < qty; i++) {
        var grid = this.getGridById(i);
        var tile = this.grid[grid.r][grid.c];
        tile.tileSprite.setTint(0xffffff);
        tile.open = true;
        var rand = Phaser.Math.Between(0, this.numberArray.length - 1)
        var num = this.numberArray[rand]
        tile.tileValue = num;
        tile.tileText.setTint(0x000000);
        tile.tileText.setText(num)
      }
      this.maxTiles = qty;
      var newRows = Math.ceil(this.maxTiles / tenPairOptions.cols);
      this.maxRows = newRows;
  }
  
  
  
  checkBoard() {
    for (var i = 0; i < tenPairOptions.rows; i++) {
      for (var j = 0; j < tenPairOptions.cols; j++) {
        var tile = this.grid[i][j];
        if (tile.open) {
          return
        }
      }
    }
    this.addOldTiles(8)
  }
  addScore() {
    console.log('clicked')
    this.events.emit('score');
  }