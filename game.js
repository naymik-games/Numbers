let game;



window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },

    scene: [preloadGame, startGame, playGame, plusPlus, play2048, zNumbers, nonogram, nonoOptions, tenPair, mineSweeper, minesweeperOptions, twoFourEight, fuseTen, gridPlus, Slide, help, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {


    this.cameras.main.setBackgroundColor(0x000000);

    this.player = this.add.image(game.config.width / 2, game.config.height / 2, 'gems', 0).setInteractive();
    this.player.on("pointerdown", this.addScore, this);

    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update() {

  }
  addScore() {
    this.events.emit('score');
  }
}
