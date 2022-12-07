//const COLOR_PRIMARY = 0x4e342e;
//const COLOR_LIGHT = 0x7b5e57;
//const COLOR_DARK = 0x260e04;

class help extends Phaser.Scene {
  constructor() {
    super("help");
  }
  preload() {


  }
  create() {
    this.backBack1 = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setTint(0x000000);
    this.backBack1.displayWidth = 760;
    this.backBack1.displayHeight = 1110;

    this.backBack2 = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setTint(0x3e5e71);
    this.backBack2.displayWidth = 750;
    this.backBack2.displayHeight = 1100;

    this.backBack3 = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setTint(0xadadad);
    this.backBack3.displayWidth = 710;
    this.backBack3.displayHeight = 1060;


    var titleText = this.add.bitmapText(450, 325, 'topaz', 'HELP', 40).setOrigin(.5).setTint(0xffffff);



    var startMine = this.add.bitmapText(game.config.width / 2, 1275, 'topaz', 'EXIT', 60).setOrigin(.5).setTint(0x000000).setInteractive();
    startMine.on('pointerdown', function () {
      this.scene.stop()
      this.scene.resume(games[currentGame]);
      this.scene.start("UI");
    }, this)


  }



  saveSettings() {
    localStorage.setItem('numbersData', JSON.stringify(gameData));
  }


}

