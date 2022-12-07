const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class nonoOptions extends Phaser.Scene {
  constructor() {
    super("nonoOptions");
  }
  preload() {
    
//this.load.scenePlugin({
  //key: 'rexuiplugin',
 // url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
 // sceneKey: 'rexUI'
//});
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
    
    nonoLevel = {
      rows: 7,
      cols: 7,
      diff: 'easy'
    }
    
    var titleText = this.add.bitmapText(450, 325, 'topaz', 'NONOGRAM OPTIONS ', 40).setOrigin(.5).setTint(0xffffff);

    
    var widthText = this.add.bitmapText(150, 400, 'topaz', 'Columns: ', 50).setOrigin(0,.5).setTint(0x000000);
    var colText = this.add.bitmapText(450, 500, 'topaz', nonoLevel.cols, 50).setOrigin(0,.5).setTint(0x000000);
    var leftText = this.add.bitmapText(150, 500, 'topaz', '<', 70).setOrigin(0,.5).setTint(0x000000).setInteractive();
    leftText.on('pointerdown', function(){
      if(nonoLevel.cols > 4){
        nonoLevel.cols--
        colText.setText(nonoLevel.cols)
        nonoLevel.rows = nonoLevel.cols;
      }
      
    },this)
    var rightText = this.add.bitmapText(750, 500, 'topaz', '>', 70).setOrigin(0,.5).setTint(0x000000).setInteractive();
    rightText.on('pointerdown', function(){
      if(nonoLevel.cols < 11)
      nonoLevel.cols++
      colText.setText(nonoLevel.cols)
      nonoLevel.rows = nonoLevel.cols;
    },this)
    
    
    
    var heightText = this.add.bitmapText(150, 600, 'topaz', 'Rows: ', 50).setOrigin(0,.5).setTint(0x000000);
    var rowText = this.add.bitmapText(150, 700, 'topaz', nonoLevel.rows, 50).setOrigin(0,.5).setTint(0x000000);
    
    
    
    
    
    
    var difficultyText = this.add.bitmapText(150, 800, 'topaz', 'Difficlty: ', 50).setOrigin(0,.5).setTint(0x000000);
    var difText = this.add.bitmapText(450, 900, 'topaz', nonoLevel.diff, 50).setOrigin(.5).setTint(0x000000).setInteractive();
    difText.on('pointerdown', function(){
      if(nonoLevel.diff == 'easy'){
        nonoLevel.diff = 'medium';
        difText.setText(nonoLevel.diff)
      } else if (nonoLevel.diff == 'medium') {
        nonoLevel.diff = 'hard';
        difText.setText(nonoLevel.diff)
      } else if (nonoLevel.diff == 'hard') {
        nonoLevel.diff = 'easy';
        difText.setText(nonoLevel.diff)
      }
    }, this)
/*
            var numberBar = this.rexUI.add.numberBar({
                x: game.config.width / 2,
                y: 475,
                width: 600, // Fixed width
               // height: 50,
   
               // background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
    
               // icon: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
    
                slider: {
                  // width: 120, // Fixed width
                  track: this.add.image(0,0,'bar'),
                 // track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
                  //indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
                  indicator: this.add.image(10,0,'button'),
                  input: 'click',
                },
    
                //text: this.add.text(0, 0, '').setFixedSize(35, 0),
    
                space: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
    
                 // icon: 10,
                  slider: 0,
                },
    
                valuechangeCallback: function(value, oldValue, numberBar) {
                  //numberBar.text = Math.round(Phaser.Math.Linear(4,16, value));
                  widthText.setText('Columns: ' + Math.round(Phaser.Math.Linear(4,16, value)));
                  nonoLevel.cols = Math.round(Phaser.Math.Linear(4,16, value))
                  gameData.nonoSet.c = Math.round(Phaser.Math.Linear(4,16, value))
                  
                },
              })
              .layout();
    
            numberBar.setValue(gameData.nonoSet.r, 4, 16);
    
    
    
            var numberBarR = this.rexUI.add.numberBar({
                x: game.config.width / 2,
                y: 675,
                width: 600, // Fixed width
               // height: 50,
   
               // background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
    
               // icon: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
    
                slider: {
                  // width: 120, // Fixed width
                  track: this.add.image(0,0,'bar'),
                 // track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
                  //indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
                  indicator: this.add.image(10,0,'button'),
                  input: 'click',
                },
    
                //text: this.add.text(0, 0, '').setFixedSize(35, 0),
    
                space: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
    
                 // icon: 10,
                  slider: 0,
                },
    
                valuechangeCallback: function(value, oldValue, numberBarR) {
                  //numberBar.text = Math.round(Phaser.Math.Linear(4,16, value));
                  heightText.setText('Rows: ' + Math.round(Phaser.Math.Linear(4,16, value)));
                  nonoLevel.rows = Math.round(Phaser.Math.Linear(4,16, value))
                  gameData.nonoSet.r = Math.round(Phaser.Math.Linear(4,16, value))
                  
                },
              })
              .layout();
    
            numberBarR.setValue(gameData.nonoSet.r, 4, 16);
    
          var numberBarD = this.rexUI.add.numberBar({
                x: game.config.width / 2,
                y: 875,
                width: 300, // Fixed width
               // height: 50,
   
               // background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
    
               // icon: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
    
                slider: {
                  // width: 120, // Fixed width
                  track: this.add.image(0,0,'bar'),
                 // track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
                  //indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
                  indicator: this.add.image(10,0,'button'),
                  input: 'click',
                },
    
                //text: this.add.text(0, 0, '').setFixedSize(35, 0),
    
                space: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
    
                 // icon: 10,
                  slider: 0,
                },
    
                valuechangeCallback: function(value, oldValue, numberBarD) {
                  //numberBar.text = Math.round(Phaser.Math.Linear(4,16, value));
                  var roundValue = Math.round(Phaser.Math.Linear(1,3, value));
                 if(roundValue == 1){
                   difficultyText.setText('Difficlty: Easy');
                  nonoLevel.diff = 'easy';
                  gameData.nonoSet.diff = roundValue;
                  
                 } else if (roundValue == 2) {
                   difficultyText.setText('Difficlty: Medium');
                   nonoLevel.diff = 'medium';
                   gameData.nonoSet.diff = roundValue;
                  
                 } else {
                   difficultyText.setText('Difficlty: Hard');
                   nonoLevel.diff = 'Hard';
                   gameData.nonoSet.diff = roundValue;
                   
                 }
                 
                 
                  
                },
              })
              .layout();
    
            numberBarD.setValue(gameData.nonoSet.diff, 1, 3);
    */
    
    
    
    var startNonogram = this.add.bitmapText(game.config.width / 2, 1175, 'topaz', 'PLAY', 90).setOrigin(.5).setTint(0x000000);
    startNonogram.setInteractive();
    startNonogram.on('pointerdown', function(){
      this.saveSettings();
	  var cg = 3;
    currentGame = cg;
    this.scene.start(games[cg]);
    this.scene.launch('UI');
	}, this);
    //cg = 3;
   // currentGame = cg;
 // this.scene.start(games[cg]);
 // this.scene.launch('UI');
    
    
  }
  
  
  saveSettings() {
    localStorage.setItem('numbersData', JSON.stringify(gameData));
  }
  
  
}
   
