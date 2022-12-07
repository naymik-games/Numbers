class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {



  }
  create() {

    this.footer = this.add.image(game.config.width / 2, game.config.height, 'blank').setOrigin(.5, 1).setTint(0x3e5e71);
    this.footer.displayWidth = 900;
    this.footer.displayHeight = 100;



    this.scoreText = this.add.bitmapText(15, game.config.height - 50, 'topaz', gameNames[currentGame], 60).setOrigin(0, .5).setTint(0xcbf7ff).setAlpha(1);
    var help = this.add.image(620, 1590, 'icons', 0).setInteractive();
    help.on('pointerdown', function () {
      this.scene.launch('help')
      this.scene.pause(games[currentGame]);
      this.scene.pause("UI");
    }, this)
    var restart = this.add.image(720, 1590, 'icons', 1).setInteractive();
    restart.on('pointerdown', function () {
      this.scene.start(games[currentGame]);
      this.scene.start("UI");
    }, this)
    var home = this.add.image(820, 1590, 'icons', 3).setInteractive();
    home.on('pointerdown', function () {
      this.scene.stop(games[currentGame]);
      this.scene.stop("UI");
      this.scene.start('startGame')
    }, this)






  }

  update() {

  }



}