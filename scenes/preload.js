class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/particle.png");
    }




    //this.load.image("particle", "assets/sprites/particle.png");
    this.load.bitmapFont('topaz', 'assets/fonts/lato.png', 'assets/fonts/lato.xml');
    this.load.spritesheet("menu_icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });
    this.load.spritesheet("rover", "assets/sprites/rover.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("tiles2", "assets/sprites/2048_tiles_dark.png", {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("ms", "assets/sprites/ms.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet("emoji", "assets/sprites/emoji.png", {
      frameWidth: 23,
      frameHeight: 23
    });
    this.load.spritesheet("num_tiles", "assets/sprites/number_tiles_.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image('plus', 'assets/sprites/Plus.png');
    this.load.image('bar', 'assets/sprites/bar.png');
    this.load.image('button', 'assets/sprites/button.png');

    this.load.image('dot', 'assets/sprites/dot2.png');
    this.load.image('blankoutline', 'assets/sprites/outline_tile.png');
    this.load.image("tile", "assets/sprites/tile.png");
    this.load.image("circle", "assets/sprites/circle.png");
    this.load.image("restart", "assets/sprites/restart.png");
    this.load.spritesheet("arrows", "assets/sprites/arrows.png", {

      frameWidth: 300,

      frameHeight: 300
    });
    this.load.spritesheet("hex", "assets/sprites/fusehex.png", {
      frameWidth: 154,
      frameHeight: 134
    });
  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}