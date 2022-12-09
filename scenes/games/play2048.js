var twentyOptions = {
    tileSize: 200,
    tweenSpeed: 50,
    tileSpacing: 20,
    size: { rows: 4, cols: 4 }
}


class play2048 extends Phaser.Scene {
    constructor() {
        super("play2048");
    }
    preload() {


    }
    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        //this.cameras.main.setBackgroundColor(0xecf0f1);
        this.cameras.main.setBackgroundColor(0x000000);
        this.yOffset = 250;
        this.gridBackB = this.add.image(0, this.yOffset, 'blank').setOrigin(0).setTint(0xffffff);
        this.gridBackB.displayWidth = game.config.width;
        this.gridBackB.displayHeight = twentyOptions.size.rows * (twentyOptions.tileSize + twentyOptions.tileSpacing) + 20
        console.log(twentyOptions.size.rows * (twentyOptions.tileSize + twentyOptions.tileSpacing) + 20)
        this.gridBack = this.add.image(5, this.yOffset + 5, 'blank').setOrigin(0).setTint(0x000000);
        this.gridBack.displayWidth = 890;
        this.gridBack.displayHeight = (twentyOptions.size.rows * (twentyOptions.tileSize + twentyOptions.tileSpacing) + 20) - 10

        var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', '2048', 100).setOrigin(.5).setTint(0xc76210);

        this.fieldArray = [];
        this.fieldGroup = this.add.group();
        if (gameData.twentyBoard == null) {
            for (var i = 0; i < twentyOptions.size.rows; i++) {
                this.fieldArray[i] = [];
                for (var j = 0; j < twentyOptions.size.cols; j++) {
                    var two = this.add.sprite(this.tileDestination(j), this.yOffset + this.tileDestination(i), "tiles2");
                    two.alpha = 0;
                    two.visible = 0;
                    this.fieldGroup.add(two);
                    this.fieldArray[i][j] = {
                        tileValue: 0,
                        tileSprite: two,
                        canUpgrade: true
                    }
                }
            }
            this.score = 0
        } else {
            for (var i = 0; i < twentyOptions.size.rows; i++) {
                this.fieldArray[i] = [];
                for (var j = 0; j < twentyOptions.size.cols; j++) {
                    var dat = gameData.twentyBoard[i][j]
                    var two = this.add.sprite(this.tileDestination(j), this.yOffset + this.tileDestination(i), "tiles2", dat - 1);
                    if (dat == 0) {
                        two.alpha = 0;
                        two.visible = 0;
                    } else {
                        two.alpha = 1;
                        two.visible = 1;
                    }

                    //this.fieldGroup.add(two);
                    this.fieldArray[i][j] = {
                        tileValue: dat,
                        tileSprite: two,
                        canUpgrade: true
                    }
                }
            }
            this.score = gameData.twentyCurrentScore
        }

        this.scoreText = this.add.bitmapText(50, 1250, 'topaz', this.score, 120).setOrigin(0, .5).setTint(0xffffff);
        this.scoreLabe = this.add.bitmapText(50, 1325, 'topaz', 'SCORE', 40).setOrigin(0, .5).setTint(0xc76210);



        this.highScore = gameData.twentyHigh
        this.highText = this.add.bitmapText(850, 1250, 'topaz', this.highScore, 120).setOrigin(1, .5).setTint(0xffffff);
        this.highLabel = this.add.bitmapText(850, 1325, 'topaz', 'HIGH', 40).setOrigin(1, .5).setTint(0xc76210);

        this.input.keyboard.on("keydown", this.handleKey, this);
        this.canMove = false;
        if (gameData.twentyBoard == null) {
            this.addTwo();
            this.addTwo();
        }
        this.input.on("pointerup", this.endSwipe, this);
    }
    update() {

    }


    endSwipe(e) {
        var swipeTime = e.upTime - e.downTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
        if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
            var children = this.fieldGroup.getChildren();
            if (swipeNormal.x > 0.8) {
                for (var i = 0; i < children.length; i++) {
                    children[i].depth = game.config.width - children[i].x;
                }
                this.handleMove(0, 1);
            }
            if (swipeNormal.x < -0.8) {
                for (var i = 0; i < children.length; i++) {
                    children[i].depth = children[i].x;
                }
                this.handleMove(0, -1);
            }
            if (swipeNormal.y > 0.8) {
                for (var i = 0; i < children.length; i++) {
                    children[i].depth = game.config.height - children[i].y;
                }
                this.handleMove(1, 0);
            }
            if (swipeNormal.y < -0.8) {
                for (var i = 0; i < children.length; i++) {
                    children[i].depth = children[i].y;
                }
                this.handleMove(-1, 0);
            }
        }
    }
    addTwo() {
        var emptyTiles = [];
        for (var i = 0; i < twentyOptions.size.rows; i++) {
            for (var j = 0; j < twentyOptions.size.cols; j++) {
                if (this.fieldArray[i][j].tileValue == 0) {
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
        this.fieldArray[chosenTile.row][chosenTile.col].tileValue = 1;
        this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
        this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
        this.saveBoard()
        this.tweens.add({
            targets: [this.fieldArray[chosenTile.row][chosenTile.col].tileSprite],
            alpha: 1,
            duration: twentyOptions.tweenSpeed,
            onComplete: function (tween) {
                tween.parent.scene.canMove = true;

                // when a move is completed, it's time to chek for game over
                tween.parent.scene.checkGameOver();
            },
        });
    }
    handleKey(e) {
        if (this.canMove) {
            var children = this.fieldGroup.getChildren();
            switch (e.code) {
                case "KeyA":
                case "ArrowLeft":
                    for (var i = 0; i < children.length; i++) {
                        children[i].depth = children[i].x;
                    }
                    this.handleMove(0, -1);
                    break;
                case "KeyD":
                case "ArrowRight":
                    for (var i = 0; i < children.length; i++) {
                        children[i].depth = game.config.width - children[i].x;
                    }
                    this.handleMove(0, 1);
                    break;
                case "KeyW":
                case "ArrowUp":
                    for (var i = 0; i < children.length; i++) {
                        children[i].depth = children[i].y;
                    }
                    this.handleMove(-1, 0);
                    break;
                case "KeyS":
                case "ArrowDown":
                    for (var i = 0; i < children.length; i++) {
                        children[i].depth = game.config.height - children[i].y;
                    }
                    this.handleMove(1, 0);
                    break;
            }
        }
    }
    handleMove(deltaRow, deltaCol) {
        this.canMove = false;
        var somethingMoved = false;
        this.movingTiles = 0;
        for (var i = 0; i < twentyOptions.size.rows; i++) {
            for (var j = 0; j < twentyOptions.size.cols; j++) {
                var colToWatch = deltaCol == 1 ? (twentyOptions.size.cols - 1) - j : j;
                var rowToWatch = deltaRow == 1 ? (twentyOptions.size.rows - 1) - i : i;
                var tileValue = this.fieldArray[rowToWatch][colToWatch].tileValue;

                if (tileValue != 0) {
                    var colSteps = deltaCol;
                    var rowSteps = deltaRow;
                    while (this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) && this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue == 0) {
                        colSteps += deltaCol;
                        rowSteps += deltaRow;
                    }
                    if (this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) && (this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue == tileValue) && this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].canUpgrade && this.fieldArray[rowToWatch][colToWatch].canUpgrade) {
                        this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue++;

                        this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].canUpgrade = false;
                        this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
                        this.moveTile(this.fieldArray[rowToWatch][colToWatch], rowToWatch + rowSteps, colToWatch + colSteps, Math.abs(rowSteps + colSteps), true);
                        somethingMoved = true;
                    }
                    else {
                        colSteps = colSteps - deltaCol;
                        rowSteps = rowSteps - deltaRow;
                        if (colSteps != 0 || rowSteps != 0) {
                            this.fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue = tileValue;
                            this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
                            this.moveTile(this.fieldArray[rowToWatch][colToWatch], rowToWatch + rowSteps, colToWatch + colSteps, Math.abs(rowSteps + colSteps), false);
                            somethingMoved = true;
                        }
                    }
                }
            }
        }
        if (!somethingMoved) {
            this.canMove = true;
        }
        console.log(this.fieldArray)
    }
    moveTile(tile, row, col, distance, changeNumber) {
        this.movingTiles++;
        this.tweens.add({
            targets: [tile.tileSprite],
            x: this.tileDestination(col),
            y: this.yOffset + this.tileDestination(row),
            duration: twentyOptions.tweenSpeed * distance,
            onComplete: function (tween) {
                tween.parent.scene.movingTiles--;
                if (changeNumber) {
                    tween.parent.scene.transformTile(tile, row, col);
                }
                if (tween.parent.scene.movingTiles == 0) {
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.addTwo();
                }
            }
        })
    }
    transformTile(tile, row, col) {
        this.movingTiles++;
        tile.tileSprite.setFrame(this.fieldArray[row][col].tileValue - 1);
        this.addScore(this.fieldArray[row][col].tileValue - 1);
        this.tweens.add({
            targets: [tile.tileSprite],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: twentyOptions.tweenSpeed,
            yoyo: true,
            repeat: 1,
            onComplete: function (tween) {
                tween.parent.scene.movingTiles--;
                if (tween.parent.scene.movingTiles == 0) {
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.addTwo();
                }
            }
        })
    }
    resetTiles() {
        for (var i = 0; i < twentyOptions.size.rows; i++) {
            for (var j = 0; j < twentyOptions.size.cols; j++) {
                this.fieldArray[i][j].canUpgrade = true;
                this.fieldArray[i][j].tileSprite.x = this.tileDestination(j);
                this.fieldArray[i][j].tileSprite.y = this.yOffset + this.tileDestination(i);
                if (this.fieldArray[i][j].tileValue > 0) {
                    this.fieldArray[i][j].tileSprite.alpha = 1;
                    this.fieldArray[i][j].tileSprite.visible = true;
                    this.fieldArray[i][j].tileSprite.setFrame(this.fieldArray[i][j].tileValue - 1);
                }
                else {
                    this.fieldArray[i][j].tileSprite.alpha = 0;
                    this.fieldArray[i][j].tileSprite.visible = false;
                }
            }
        }
    }
    isInsideBoard(row, col) {
        return (row >= 0) && (col >= 0) && (row < 4) && (col < 4);
    }
    tileDestination(pos) {
        return pos * (twentyOptions.tileSize + twentyOptions.tileSpacing) + twentyOptions.tileSize / 2 + twentyOptions.tileSpacing
    }
    addScore(value) {
        var score = 0;
        if (value == 1) {
            score = 4;
        } else if (value == 2) {
            score = 8;
        } else if (value == 3) {
            score = 16;
        } else if (value == 4) {
            score = 32;
        } else if (value == 5) {
            score = 64;
        } else if (value == 6) {
            score = 128;
        } else if (value == 7) {
            score = 256;
        } else if (value == 8) {
            score = 512;
        } else if (value == 9) {
            score = 1024;
        } else if (value == 10) {
            score = 2048;
            alert('You got 2048!')
            gameData.twentyAchieved++;
            this.saveSettings();
        } else if (value == 11) {
            score = 4096;
        }
        this.score += score;
        this.scoreText.setText(this.score);
    }
    checkGameOver() {

        // loop through the entire board
        for (var i = 0; i < twentyOptions.size.rows; i++) {
            for (var j = 0; j < twentyOptions.size.cols; j++) {

                // if there is an empty tile, it's not game over
                if (this.fieldArray[i][j].tileValue == 0) {
                    return;
                }

                // if there are two vertical adjacent tiles with the same value, it's not game over
                if ((i < 3) && this.fieldArray[i][j].tileValue == this.fieldArray[i + 1][j].tileValue) {
                    return;
                }

                // if there are two horizontal adjacent tiles with the same value, it's not game over
                if ((j < 3) && this.fieldArray[i][j].tileValue == this.fieldArray[i][j + 1].tileValue) {
                    return
                }
            }
        }
        gameData.twentyLast = this.score;
        if (this.score > gameData.twentyHigh) {
            gameData.twentyHigh = this.score;
        }
        gameData.twentyBoard = null
        gameData.twentyCurrentScore = 0
        this.saveSettings();
        // ok, it's definitively game over :(
        alert("no more moves");
    }
    saveBoard() {
        var boardSave = []
        for (var i = 0; i < twentyOptions.size.rows; i++) {
            boardSave[i] = [];
            for (var j = 0; j < twentyOptions.size.cols; j++) {
                boardSave[i][j] = this.fieldArray[i][j].tileValue

            }
        }
        gameData.twentyBoard = boardSave
        gameData.twentyCurrentScore = this.score
        this.saveSettings()
    }

    saveSettings() {

        localStorage.setItem('numbersData', JSON.stringify(gameData));

    }







}