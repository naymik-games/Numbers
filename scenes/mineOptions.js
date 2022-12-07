//const COLOR_PRIMARY = 0x4e342e;
//const COLOR_LIGHT = 0x7b5e57;
//const COLOR_DARK = 0x260e04;

class minesweeperOptions extends Phaser.Scene {
  constructor() {
    super("minesweeperOptions");
  }
  preload() {
    
/*this.load.scenePlugin({
  key: 'rexuiplugin',
  url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
  sceneKey: 'rexUI'
});*/
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
    
    
    var titleText = this.add.bitmapText(450, 325, 'topaz', 'MINE OPTIONS ', 40).setOrigin(.5).setTint(0xffffff);

    var easyText = this.add.bitmapText(225, 425, 'topaz', 'Easy', 70).setOrigin(.5).setTint(0x000000);
	var easyWinsText = this.add.bitmapText(225, 525, 'topaz', gameData.mineEasy + '\n' + this.formatTime(gameData.mineEasyTime), 50).setOrigin(.5).setTint(0xffffff);

	var mediumText = this.add.bitmapText(450, 425, 'topaz', 'Medium', 70).setOrigin(.5).setTint(0x000000);
	var mediumWinsText = this.add.bitmapText(450, 525, 'topaz', gameData.mineMedium + '\n' + this.formatTime(gameData.mineMediumTime), 50).setOrigin(.5).setTint(0xffffff);
    
	var hardText = this.add.bitmapText(675, 425, 'topaz', 'Hard', 70).setOrigin(.5).setTint(0x000000);
	var hardWinsText = this.add.bitmapText(675, 525, 'topaz', gameData.mineHard + '\n' + this.formatTime(gameData.mineHardTime), 50).setOrigin(.5).setTint(0xffffff);


        var difficultyText = this.add.bitmapText(150, 800, 'topaz', 'Difficlty ', 50).setOrigin(0,.5).setTint(0x000000).setInteractive();
difficultyText.on('pointerdown', function(){
      if(mineMode == 0){
        mineMode = 1;
        difficultyText.setText('Difficlty: Medium')
      } else if (mineMode == 1) {
        mineMode = 2
        difficultyText.setText('Difficlty: Hard')
      } else if (mineMode == 3) {
        mineMode = 0
        difficultyText.setText('Difficlty: Easy')
      }
    }, this)
      /*          
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
                  var roundValue = Math.round(Phaser.Math.Linear(0,2, value));
                 if(roundValue == 0){
                   difficultyText.setText('Difficlty: Easy');
                  mineMode = 0;
                  
                 } else if (roundValue == 1) {
                   difficultyText.setText('Difficlty: Medium');
                   mineMode = 1;
                  
                 } else {
                   difficultyText.setText('Difficlty: Hard');
                   
                   mineMode = 2;
                 }
                 
                 
                  
                },
              })
              .layout();
    
            numberBarD.setValue(1, 0, 2);
    */
    
    
    
    var startMine = this.add.bitmapText(game.config.width / 2, 1175, 'topaz', 'PLAY', 90).setOrigin(.5).setTint(0x000000);
    startMine.setInteractive();
    startMine.on('pointerdown', function(){
    
	  var cg = 5;
    currentGame = cg;
    this.scene.start(games[cg]);
    this.scene.launch('UI');
	}, this);
    //cg = 3;
   // currentGame = cg;
 // this.scene.start(games[cg]);
 // this.scene.launch('UI');
    
    
  }
  
  formatTime(seconds) {
    // Minutes
    var minutes = Math.floor(seconds / 60);
    // Seconds
    var partInSeconds = seconds % 60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2, '0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
  }

  saveSettings() {
    localStorage.setItem('numbersData', JSON.stringify(gameData));
  }
  
  
}
   
