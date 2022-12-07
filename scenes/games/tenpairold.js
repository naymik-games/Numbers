let tenPairOptions = {
  cols: 8,

  rows: 10,
  offSetY: 250,
  offSetX: 75,
  sum: 10,
  gameMode: 0
}

class tenPair extends Phaser.Scene {
  constructor() {
    super("tenPair");
  }
  preload() {


  }
  create() {


    this.maxTiles = 24;
    this.cameras.main.setBackgroundColor(0x000000);
    this.selected = { value: 0, id: null }
    this.maxTotalTiles = tenPairOptions.cols * tenPairOptions.rows
    this.numbers = [1, 2, 5, 8, 9];
    this.blockSize = 100;
    this.createBoard();
    // this.drawBoard();
    this.mT = this.add.bitmapText(800, 100, 'topaz', this.maxTotalTiles, 50).setOrigin(.5).setTint(0xffffff).setInteractive();

    this.cons = this.add.bitmapText(100, 100, 'topaz', 'cons', 100).setOrigin(.5).setTint(0xffffff).setInteractive();
    this.cons.on('pointerdown', this.consolidate, this)

    this.cons2 = this.add.bitmapText(400, 100, 'topaz', 'row', 100).setOrigin(.5).setTint(0xffffff).setInteractive();
    this.cons2.on('pointerdown', function(){
      this.addTiles(8)
    }, this)

    this.cons3 = this.add.bitmapText(100, 1450, 'topaz', 'shuff', 100).setOrigin(.5).setTint(0xffffff).setInteractive();
    this.cons3.on('pointerdown', this.shuffle, this)


    this.input.on("pointerdown", this.gemSelect, this);
    //this.input.on("pointermove", this.drawPath, this);
    // this.input.on("pointerup", this.endDrag, this);

    //this.coin = this.add.sprite(game.config.width / 2, 100, "field", 5).setAlpha(0);
    this.dragging = false;
    this.canPick = true;



    this.graphics = this.add.graphics({ lineStyle: { width: 15, color: 0xffffff } });
    console.log(this.getGridById(3))
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update() {
    this.mT.setText(this.maxTiles)
  }

  gemSelect(e) {

    if (e.y < tenPairOptions.offSetY || e.y > tenPairOptions.offSetY + this.blockSize * tenPairOptions.rows) { return }

    if (!this.canPick) { return }


    let row = Math.floor((e.downY - tenPairOptions.offSetY) / this.blockSize);
    let col = Math.floor((e.downX - tenPairOptions.offSetX) / this.blockSize);
    let id = this.getIdfromGrid({ r: row, c: col })
    console.log('row' + row + ' col' + col + ' id' + id + 'active: ' + this.board[id].active + 'open: ' + this.board[id].open + 'value: ' + this.board[id].value);
    if (this.validPick(id)) {




      if (this.selected.value == 0 && this.board[id].value > 0 && this.board[id].open) {
        this.selectTile(this.board[id]);
        //this.getNumBlankRight(pickedTile.id)
        // this.highlightNeighbors(pickedTile);
      } else {
        if (this.areAjacent(this.selected.id, id)) {
          console.log(this.selected.value + ' s , c ' + this.board[id].value)

          if (this.selected.value == this.board[id].value || this.selected.value + this.board[id].value == tenPairOptions.sum) {
            this.board[id].image.setTint(0xffffff);
            this.board[id].tileText.setTint(0xf4f4f4);
            this.board[id].open = false;
            this.board[id].value = 0;
            this.board[this.selected.id].value = 0;
            this.board[this.selected.id].image.setTint(0xffffff);
            this.board[this.selected.id].tileText.setTint(0xf4f4f4);
            this.board[this.selected.id].open = false
            this.clearSelectedTile(true);
            //this.checkBoard();
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

    this.selected.value = tile.value;
    //  this.selected.row = tile.tileRow;
    // this.selected.col = tile.tileCol;
    this.selected.id = tile.id
    tile.image.setTint(0x16a085);
  }
  clearSelectedTile(match) {
    if (!match) {
      this.board[this.selected.id].image.setTint(0xffffff);

    }
    this.checkForEmpty()
    this.selected.value = 0;
    // this.selected.row = null;
    //this.selected.col = null;
    this.selected.id = null;
  }
  checkBoard() {
    for (var i = 0; i < this.maxTotalTiles; i++) {
     
        var tile = this.board[i];
        if (tile.open && tile.value > 0) {
          return
        }
      
    }
    this.addTiles(8)
  }
  checkForEmpty() {
    //finds all empty rows
    var emptyRows = []
    for (var i = 0; i < tenPairOptions.rows; i++) {
      var isEmpty = true;
      for (var j = 0; j < tenPairOptions.cols; j++) {
        //if(this.board[this.getIdfromGrid({r:i,c:j})].active){
        if (this.board[this.getIdfromGrid({ r: i, c: j })].open) {
          isEmpty = false;
        }
        //}
      }
      if (isEmpty) {
        emptyRows.push(i)
      }
    }
    console.log('empty rows' + emptyRows)
    this.removeAllEmptyRows(emptyRows)
  }
  removeAllEmptyRows(empty) {
    if (empty.length < 1) { return }
    for (var e = 0; e < empty.length; e++) {
      this.removeRow(empty[e])
    }
  }
  removeRow(row) {
    //remove row 1
    var r = tenPairOptions.cols * row
    for (var i = r; i < r + tenPairOptions.cols; i++) {
     
      this.board[i].value = 0
      this.board[i].open = false
      this.board[i].tileText.setText(0)
      this.board[i].tileText.setTint(0xffffff)
    }
    
    //grab values below and clear
   var rowValues = []
    var r = tenPairOptions.cols * (row +1)
    for (var i = r; i < this.maxTiles; i++) {
      rowValues.push(this.board[i].value)
      this.board[i].value = 0
      this.board[i].open = false
      this.board[i].tileText.setText(0)
      this.board[i].tileText.setTint(0xffffff)
    }
    console.log(rowValues.length)
   var r2 = tenPairOptions.cols * row
    var v = 0;
    for (var i = r2; i < r2 + 8; i++) {
      this.board[i].value = rowValues[v];
      this.board[i].tileText.setText(rowValues[v])
      this.board[i].open = true;
      this.board[i].tileText.setTint(0x000000)
      if(this.board[i].value == 0){
        this.board[i].tileText.setTint(0xffffff)
        this.board[i].open = false
      }
      
      this.board[i].id = r2
      v++
    }
    this.maxTiles -= tenPairOptions.cols;
    console.log(this.maxTiles)
  }
  removeRow_(row) {
    //remove row 1
    var r = tenPairOptions.cols * (row +1)
    for (var i = r; i < r + tenPairOptions.cols; i++) {
      this.board[i].image.setTint(0x00ff00)
    }
  }
  addTiles(num) {
    for (var i = 0; i < num; i++) {
      var tile = this.board[this.maxTiles + i]
      var num2 = Phaser.Math.Between(0, this.numbers.length - 1);
      tile.value = this.numbers[num2];
      tile.tileText.setText(this.numbers[num2])
      tile.tileText.setTint(0x000000)
      tile.active = true;
      tile.open = true
    }
    this.maxTiles += num;
    if (this.maxTiles > this.maxTotalTiles) {
      alert('game over')
      return
    }
  }
  consolidate() {
    console.log('click')
    var values = this.getArrayOfValues();

    if (values.length > 0) {
      if (this.maxTiles + values.length > this.maxTotalTiles) {
        alert('game over')
        return
      }

      /*  value: this.numbers[num],
        image: img,
        open: true,
        active: true,
        tileText: tileText,
        id: count */


      for (var i = 0; i < values.length; i++) {
        // var grid = this.getGridById(this.maxTiles + i);
        var tile = this.board[this.maxTiles + i]
        tile.image.setTint(0xffffff);
        tile.open = true;
        tile.value = values[i];
        tile.tileText.setText(values[i])
      }
      this.maxTiles += values.length;
      //var newRows = Math.ceil(this.maxTiles / tenPairOptions.cols);
      //   this.maxRows = newRows;
      // console.log('mt ' + this.maxTiles + ' mr ' + this.maxRows)
    }
  }
  shuffle(){
    var values = this.getArrayOfValues();
    Phaser.Utils.Array.Shuffle(values)
    for (var i = 0; i < values.length; i++) {
        // var grid = this.getGridById(this.maxTiles + i);
        var tile = this.board[i]
        tile.image.setTint(0xffffff);
        tile.open = true;
        tile.value = values[i];
        tile.tileText.setText(values[i])
      }
  }
  getArrayOfValues() {
    var openValues = []
    for (var r = 0; r < tenPairOptions.rows; r++) {
      for (var c = 0; c < tenPairOptions.cols; c++) {
        var tile = this.board[this.getIdfromGrid({ r: r, c: c })];
        if (tile.open && tile.value > 0) {
          openValues.push(tile.value)
        }
      }
    }
    // console.log(openValues.length)
    return openValues;
  }
  createBoard() {
    //j is row
    //i is column
    var count = 0;
    this.board = [];
    for (var i = 0; i < tenPairOptions.cols * tenPairOptions.rows; i++) {

      var grid = this.getGridById(count)

      var block = this.makeTile(count)

      // block.value = 50
      this.board.push(block);
      count++
    }

  }


  makeTile(count) {
    //var img = this.add.image(50, 300, 'blank').setTint(0xffffff);

    var img = this.add.image(tenPairOptions.offSetX + (this.blockSize * this.getGridById(count).c) + this.blockSize / 2, tenPairOptions.offSetY + this.blockSize / 2 + (this.blockSize * this.getGridById(count).r), 'blank').setTint(0xffffff);
    img.displayWidth = this.blockSize;
    img.displayHeight = this.blockSize;
    var num = Phaser.Math.Between(0, this.numbers.length - 1);
    var tileText = this.add.bitmapText(tenPairOptions.offSetX + (this.blockSize * this.getGridById(count).c) + this.blockSize / 2, tenPairOptions.offSetY + this.blockSize / 2 + (this.blockSize * this.getGridById(count).r), 'topaz', this.numbers[num], 100).setOrigin(.5).setTint(0x000000);

    var block = {
      value: this.numbers[num],
      image: img,
      open: true,
      active: true,
      tileText: tileText,
      id: count

    }

    if (count >= this.maxTiles) {
      block.value = 0;
      block.active = false;
      //block.open = false;
      block.tileText.setText('');
    }

    //block.setFrame(block.value);



    return block;
  }
  notSelected(col, row) {

    for (var i = 0; i < this.selected.length; i++) {

      if (row == this.selected[i].row && col == this.selected[i].col) {
        return false;
      }
    }
    return true;
  }
  areNext(column, row) {
    var row2 = this.selected[this.selected.length - 1].row;
    var column2 = this.selected[this.selected.length - 1].col;
    return (Math.abs(row - row2) + Math.abs(column - column2) == 1) || (Math.abs(row - row2) == 1 && Math.abs(column - column2) == 1);
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
      console.log('stat' + status)
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
    return this.board[id].open

  }



  validPick(id) {
    return id > -1 && id < this.maxTiles && this.board[id].open && this.board[id] != undefined;
  }
  getIdfromGrid(grid) {
    return (grid.r * tenPairOptions.cols) + grid.c
    //return this.grid[grid.r][grid.c].id
  }
  getGridById(id) {
    // if(id < 0){return false}
    var row = Math.floor(id / tenPairOptions.cols);
    var col = id % tenPairOptions.cols;
    return { r: row, c: col }

  }



}