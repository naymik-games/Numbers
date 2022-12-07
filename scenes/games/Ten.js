create() {
    let gameOptions = {

  columns: 7,

  rows: 9,
  offSetY: 250,
  offSetX: 75,
  gameMode: 0
}

    this.cameras.main.setBackgroundColor(0x000000);
this.selected = []
    this.blockSize = 100;
    this.createBoard();
    this.drawBoard();
   this.input.on("pointerdown", this.gemSelect, this);
   this.input.on("pointermove", this.drawPath, this);
    this.input.on("pointerup", this.endDrag, this);
    
    //this.coin = this.add.sprite(game.config.width / 2, 100, "field", 5).setAlpha(0);
    this.dragging = false;
    this.canPick = true;
    
 
    this.graphics = this.add.graphics({ lineStyle: { width: 15, color: 0xffffff } });
    
   /* this.input.on("pointerdown", this.gemSelect, this);
    this.input.on("pointermove", this.drawPath, this);
    this.input.on("pointerup", this.removeGems, this);
   */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update() {
   
  }
  
  gemSelect(e){

    if(e.x < gameOptions.offSetX || e.x > gameOptions.offSetX + this.blockSize * gameOptions.rows){return}

    if(!this.canPick){return}
    this.selected = [];
    this.guessWord = '';
    this.wordValue = 0;
    let row = Math.floor((e.downY - gameOptions.offSetY) / this.blockSize);
    let col = Math.floor((e.downX - gameOptions.offSetX) / this.blockSize);
      if(this.validPick(row,col)){
      //  console.log('row' + row + ' col' + col);
        this.board[col][row].setAlpha(.2);
        var gem = {col: col, row: row, value: this.board[col][row].value};
       // this.wordText.setText(this.board[col][row].letter);
       // this.guessWord = this.board[col][row].letter;
       // this.wordValue = this.board[col][row].points;
         this.selected.push(gem);
        this.dragging = true;
      }
  }
  drawPath(e){
    if(e.x < gameOptions.offSetX || e.x > gameOptions.offSetX + this.blockSize * gameOptions.rows){return}
    if(this.dragging){
        let row = Math.floor((e.y - gameOptions.offSetY) / this.blockSize);
        let col = Math.floor((e.x - gameOptions.offSetX) / this.blockSize);
        if(this.validPick(row,col)){
          let distance = Phaser.Math.Distance.Between(e.x, e.y, this.board[col][row].x, this.board[col][row].y);
          if (distance < this.blockSize * 0.4) {
            if(this.notSelected(col,row) && this.areNext(col,row)){
           // console.log('row' + row + ' col' + col);
              this.board[col][row].setAlpha(.2);
			  var gem = { col: col, row: row, value: this.board[col][row].value };
			  
			  var line = new Phaser.Geom.Line(this.board[this.selected[this.selected.length -1].col][this.selected[this.selected.length -1].row].x, this.board[this.selected[this.selected.length -1].col][this.selected[this.selected.length -1].row].y, this.board[col][row].x, this.board[col][row].y);
              this.graphics.fillStyle(0xffffff);
              this.graphics.strokeLineShape(line);
              this.graphics.fillPointShape(line.getPointA(), 15);
              this.graphics.fillStyle(0xffffff);
              this.graphics.fillPointShape(line.getPointB(), 15);
			  
              this.selected.push(gem);
              //this.guessWord += this.board[col][row].letter;
             // this.wordValue = this.makeScore(10);
             // this.wordScoreText.setText(this.wordValue);
             // this.wordText.setText(this.guessWord);
              
              console.log(this.selected.length);
            }
          }
        }
        
     }
  }
  endDrag(){
    if(this.dragging){
		this.dragging = false;
		this.canPick = false;
		
		if(this.selected.length > 1){
		 // this.graphics.clear();
			
		   for(var i = 0; i < this.selected.length; i++){ 
				var row = this.selected[i].row;
				var col = this.selected[i].col;
				this.board[col][row].setAlpha(1);
				
				this.canPick = true;
		   }
		
		} else {
			  this.board[this.selected[0].col][this.selected[0].row].setAlpha(1);
			  
			  this.canPick = true;
		}
		
		
		
		
		
		
		
		}
		
		
		
  }
  createBoard() {
//j is row
//i is column

    this.board = [];
    for (var i = 0; i < gameOptions.columns; i++) {
      var col = [];
      for (var j = 0; j < gameOptions.rows; j++) {
        
        var block = this.makeTile(i,j)
      
        // block.value = 50
        col.push(block);
      }
      this.board.push(col);
    }
  }
  
  drawBoard() {
    
   // var levelOn = this.level[this.currentLevel];
    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board[i].length; j++) {
        var block = this.board[i][j];
         this.makeTile(block,i,j);
        
      }
    }
  }
  
  makeTile(i,j){
var img = this.add.image(gameOptions.offSetX + (this.blockSize * i) + this.blockSize / 2, gameOptions.offSetY + this.blockSize / 2 + (this.blockSize * j), 'blank').setTint(0x000000);
        img.displayWidth = this.blockSize;
        img.displayHeight = this.blockSize;
    var block = {
      value:0,
      image: img,
      open: true,
      
    }
    

    //block.setFrame(block.value);
   
    
    
    return block;
  }
  notSelected(col,row){

    for(var i = 0;i < this.selected.length;i++){

      if(row == this.selected[i].row && col == this.selected[i].col){
        return false;
      }
    }
    return true;
  }
  areNext(column,row){
    var row2 = this.selected[this.selected.length - 1].row;
    var column2 = this.selected[this.selected.length - 1].col;
    return (Math.abs(row - row2) + Math.abs(column - column2) == 1) || (Math.abs(row - row2) == 1 && Math.abs(column - column2) == 1);
  }
  validPick(row, col) {
    return row >= 0 && row < gameOptions.rows && col >= 0 && col < gameOptions.columns && this.board[col][row].empty == false && this.board[col] != undefined && this.board[col][row] != undefined;
  }
  addScore(){
	  this.events.emit('score');
  }