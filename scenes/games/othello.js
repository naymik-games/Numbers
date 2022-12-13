class Othello extends Phaser.Scene {
  constructor() {
    super("Othello");
  }
  preload() {


  }
  create() {


    this.cameras.main.setBackgroundColor(0x222222);

    this.dotSize = 100
    this.spriteSize = 100

    this.xOffset = (game.config.width - (8 * this.dotSize)) / 2
    this.yOffset = 200


    this.playerScore = this.add.bitmapText(50, 50, 'topaz', 'Player: 0', 80).setOrigin(0, .5).setTint(0xfafafa);
    this.computerScore = this.add.bitmapText(450, 50, 'topaz', 'Computer: 0', 80).setOrigin(0, .5).setTint(0xfafafa);
    this.statusText = this.add.bitmapText(50, 1500, 'topaz', 'Status', 60).setOrigin(0, .5).setTint(0xfafafa);

    this.initGrid()
    this.start = false
    this.end = false;

    this.player = 1;
    this.player1ColorLabel = this.add.bitmapText(450, 1100, 'topaz', 'Player 1', 50).setOrigin(.5).setTint(0xfafafa).setInteractive();
    this.player1Color = this.add.bitmapText(450, 1200, 'topaz', 'BLACK', 50).setOrigin(.5).setTint(0xfafafa).setInteractive();
    this.player1Color.on('pointerdown', function () {
      if (this.player == 1) {
        this.player = 2
        this.player1Color.setText('WHITE')
      } else {
        this.player = 1
        this.player1Color.setText('BLACK')
      }
    }, this)




    this.startGame = this.add.bitmapText(450, 1300, 'topaz', 'START', 50).setOrigin(.5).setTint(0xfafafa).setInteractive();
    this.startGame.on('pointerdown', function () {
      this.player1Color.disableInteractive().setAlpha(0)
      this.player1ColorLabel.setAlpha(0)
      this.black = 1;
      this.white = 2;
      this.legal = 3;
      this.computer = (this.player == this.black) ? this.white : this.black;
      this.turn = (this.computer == this.black) ? this.computer : this.player;
      this.start = true

      this.board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, this.player, this.computer, 0, 0, 0],
        [0, 0, 0, this.computer, this.player, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]

      this.updateGame()
      if (this.turn == this.computer) {
        this.computerMove()
      }
      this.startGame.disableInteractive().setAlpha(0)
      this.startGame.setAlpha(0)
    }, this)




    this.dir = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
      [1, 1],
      [-1, -1],
      [-1, 1],
      [1, -1]
    ];





    this.input.on("pointerdown", this.boardSelect, this);
    /*      this.input.on("pointermove", this.drawPath, this);
         this.input.on("pointerup", this.removeGems, this); */

    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update() {

    if (this.start) {
      if (this.turn == this.computer) {
        this.statusText.setText('Computer\'s Turn...')
      } else {
        this.statusText.setText('Player\'s Turn...')
      }
    }
  }
  updateGame() {
    this.setBoard()
    this.removeLegal()
    if (!this.getLegal()) {
      this.end = true;
      console.log('game over')
      // this.getWinner();
    }
    this.countScore();
  }
  boardSelect(pointer) {
    if (!this.start) { return }
    let row = Math.floor((pointer.y - this.yOffset) / this.dotSize);
    let col = Math.floor((pointer.x - this.xOffset) / this.dotSize);
    console.log('col ' + col + ', row ' + row)
    this.playerMove(row, col)
    // if (!this.board.validCoordinates(col, row)) { return }
    //console.log(this.board.dots[col][row])
  }
  playerMove(y, x) {
    if (this.end) return;
    if (this.turn != this.player) return;
    if (this.board[y][x] != this.legal) return;
    console.log('player play')
    this.board[y][x] = this.player;
    this.replace(y, x);

    this.turn = this.computer;
    this.updateGame();
    this.computerMove();
  }
  computerMove() {
    if (this.end) return;

    let coord = this.getLegalCoord();
    let random = coord[~~(Math.random() * coord.length)];

    setTimeout(() => {
      this.board[random.y][random.x] = this.computer;
      this.replace(random.y, random.x);

      this.turn = this.player;
      this.updateGame();
    }, 500);
  }
  replace(y, x) {
    let opponent = (this.turn == this.computer) ? this.player : this.computer;

    this.dir.forEach(val => {
      let [dirX, dirY] = val;

      let tempY = y + dirY;
      let tempX = x + dirX;

      while (this.inBoard(tempY, tempX) && this.board[tempY][tempX] == opponent) {
        if (this.last(tempY, tempX, dirX, dirY)) {
          this.board[tempY][tempX] = this.turn;
        }

        tempY += dirY;
        tempX += dirX;
      }
    });
  }
  last(y, x, dirX, dirY) {
    let last = false;

    while (this.inBoard(y, x)) {
      if (this.board[y][x] == this.turn) last = true;

      y += dirY;
      x += dirX;
    }

    return last;
  }
  setBoard() {
    for (let i = 0; i < 8; i++) {

      for (let j = 0; j < 8; j++) {
        this.pieces[j][i].setFrame(this.board[j][i])
      }

    }
  }
  removeLegal() {
    this.board.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col == this.legal) {
          this.board[y][x] = 0;
        }
      });
    });
    this.setBoard()
  }

  getLegal() {
    let valid = false;
    let opponent = (this.turn == this.computer) ? this.player : this.computer;
    console.log('getting legal...')
    this.board.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col == this.turn) {
          this.dir.forEach(val => {
            let [dirX, dirY] = val;

            if (this.inBoard(y + dirY, x + dirX) && this.board[y + dirY][x + dirX] == opponent) {
              let tempY = y + dirY;
              let tempX = x + dirX;

              while (this.inBoard(tempY, tempX) && this.board[tempY][tempX] == opponent) {
                if (this.inBoard(tempY + dirY, tempX + dirX) && this.board[tempY + dirY][tempX + dirX] == 0) {
                  this.board[tempY + dirY][tempX + dirX] = this.legal;

                  valid = true;
                }

                tempY += dirY;
                tempX += dirX;
              }
            }
          });
        }
      });
    });
    console.log(this.turn)
    if (this.turn == this.player) this.drawLegal();

    return valid;
  }
  getLegalCoord() {
    let coord = [];

    this.board.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col == this.legal) {
          coord.push({ x: x, y: y });
        }
      });
    });

    return coord;
  }

  drawLegal() {
    this.setBoard()
    /* this.board.forEach((row, y) => {
        row.forEach((col, x) => {
            
        
            if (col == this.legal) {
               this.
            }
        });
    }); */
  }
  initGrid() {

    this.pieces = []
    for (let i = 0; i < 8; i++) {
      var temp = []
      for (let j = 0; j < 8; j++) {
        let xpos = this.xOffset + this.dotSize * j + this.dotSize / 2;
        let ypos = this.yOffset + this.dotSize * i + this.dotSize / 2
        let element = this.add.image(xpos, ypos, 'board')
        let piece = this.add.image(xpos, ypos, 'piece', 0)
        temp.push(piece)
      }
      this.pieces.push(temp)
    }
  }
  inBoard(y, x) {
    return x >= 0 && y >= 0 && x < 8 && y < 8;
  }
  countScore() {
    let computer = 0;
    let player = 0;

    this.board.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col == this.player) {
          player++;
        }

        else if (col == this.computer) {
          computer++;
        }
      });
    });
    this.playerScore.setText('Player: ' + player)
    this.computerScore.setText('Computer: ' + computer)
    // console.log('Player: ' + player + ', Computer: ' + computer)
  }

}
