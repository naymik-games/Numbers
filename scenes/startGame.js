class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {

    gameData = JSON.parse(localStorage.getItem('numbersData'));

    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('numbersData',
        JSON.stringify(defaultData));
      gameData = defaultData;
    }




    this.cameras.main.fadeIn(800, 0, 0, 0);
    /*
      gameSettings = JSON.parse(localStorage.getItem('SDsave'));
      if (gameSettings === null || gameSettings.length <= 0) {
        localStorage.setItem('SDsave', JSON.stringify(defaultValues));
        gameSettings = defaultValues;
      }
    */
    this.cameras.main.setBackgroundColor(0xf4f3f4);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'Numbers', 150).setOrigin(.5).setTint(0xc94c4c);

    var startPlus = this.add.bitmapText(game.config.width / 2 - 50, 275, 'topaz', 'Plus+Plus', 50).setOrigin(0, .5).setTint(0x000000);
    startPlus.setInteractive();
    startPlus.on('pointerdown', function () {
      this.clickHandler(0)
    }, this);
    var start2048 = this.add.bitmapText(game.config.width / 2 - 50, 375, 'topaz', '2048', 50).setOrigin(0, .5).setTint(0x000000);
    start2048.setInteractive();
    start2048.on('pointerdown', function () {
      this.clickHandler(1)
    }, this);
    var startZNumber = this.add.bitmapText(game.config.width / 2 - 50, 475, 'topaz', 'zNumbers', 50).setOrigin(0, .5).setTint(0x000000);
    startZNumber.setInteractive();
    startZNumber.on('pointerdown', function () {
      this.clickHandler(2)
    }, this);

    var startNonogram = this.add.bitmapText(game.config.width / 2 - 50, 575, 'topaz', 'Nonogram', 50).setOrigin(0, .5).setTint(0x000000);
    startNonogram.setInteractive();
    startNonogram.on('pointerdown', function () {
      this.clickHandler(3)
    }, this);

    var startTen = this.add.bitmapText(game.config.width / 2 - 50, 675, 'topaz', 'Ten Pair', 50).setOrigin(0, .5).setTint(0x000000);
    startTen.setInteractive();
    startTen.on('pointerdown', function () {
      this.clickHandler(4)
    }, this);
    var startMine = this.add.bitmapText(game.config.width / 2 - 50, 775, 'topaz', 'Mine Sweeper', 50).setOrigin(0, .5).setTint(0x000000);
    startMine.setInteractive();
    startMine.on('pointerdown', function () {
      this.clickHandler(5)
    }, this);
    var start248 = this.add.bitmapText(game.config.width / 2 - 50, 875, 'topaz', '248 Connect', 50).setOrigin(0, .5).setTint(0x000000);
    start248.setInteractive();
    start248.on('pointerdown', function () {
      this.clickHandler(6)
    }, this);

    var startFuse = this.add.bitmapText(game.config.width / 2 - 50, 975, 'topaz', 'Fuse Ten', 50).setOrigin(0, .5).setTint(0x000000);
    startFuse.setInteractive();
    startFuse.on('pointerdown', function () {
      this.clickHandler(7)
    }, this);

    var startGridPlus = this.add.bitmapText(game.config.width / 2 - 50, 1075, 'topaz', 'Grid+', 50).setOrigin(0, .5).setTint(0x000000);
    startGridPlus.setInteractive();
    startGridPlus.on('pointerdown', function () {
      this.clickHandler(8)
    }, this);

    var gridNew = this.add.bitmapText(game.config.width / 2 - 250, 1175, 'topaz', 'New Game', 50).setOrigin(0, .5).setTint(0x000000);
    gridNew.setInteractive();
    gridNew.on('pointerdown', function () {
      localStorage.removeItem('gridData')
      this.clickHandler(8)
    }, this);

    var gridCont = this.add.bitmapText(game.config.width / 2, 1175, 'topaz', 'Continue', 50).setOrigin(0, .5).setTint(0x000000);
    gridCont.setInteractive();
    gridCont.on('pointerdown', function () {

      this.clickHandler(8)
    }, this);

    var startSlide = this.add.bitmapText(game.config.width / 2 - 50, 1275, 'topaz', 'NumberSide', 50).setOrigin(0, .5).setTint(0x000000);
    startSlide.setInteractive();
    startSlide.on('pointerdown', function () {
      this.clickHandler(9)
    }, this);

    var remove = this.add.bitmapText(game.config.width / 2, 1600, 'topaz', 'REMOVE DATA', 50).setOrigin(.5).setTint(0x000000).setInteractive();
    remove.on('pointerdown', function () {
      localStorage.removeItem('numbersData');
      localStorage.setItem('numbersData',
        JSON.stringify(defaultData));
      gameData = defaultData;
    }, this)


    /*this.testToast = new Toast({
      text: 'hello World';
      x: 450,
      y: 800
    })*/
    //var pimage = this.add.image(500,500, 'plus').setScale(.2)
  }
  clickHandler(cg) {
    if (cg == 3) {
      this.scene.pause();
      this.scene.launch('nonoOptions');
    } else {
      currentGame = cg;
      this.scene.start(games[cg]);
      this.scene.launch('UI');
    }

  }

}