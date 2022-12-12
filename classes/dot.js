class Dot {
  constructor(id, x, y, color, board, dotSize) {
    this.coordinates = [x, y];
    this.color = color;
    this.type = 0;
    this.strength = 0
    this.value = 0
    this.board = board;
    this.disabled = false;
    this.bounce = false
    this.image = null
    this.dotSize = dotSize
    this.selectable = true
    this.disabled = false
    /* if (this.color == 2) {
      this.selectable = false
    } else {
      this.selectable = true
    } */


  }
  set() {
    // this.board.dots[randX][randY].image.setFrame(ranVal)
    this.value = this.image.frame.name
    this.selectable = false
  }
  activate() {
    //var visibleDot = this.findDOMObject();
    //visibleDot.addClass("active");

    this.board.selectedColor = this.color;
    this.board.selectedDots.push(this);
    this.image.setAlpha(.5)


  }
  deactivate() {
    this.image.setFrame(0)
    this.image.setAlpha(1)
  }
  deactivateKeep() {

    this.image.setAlpha(1)
  }
  ///remove

  explode(matches) {
    //this.board.scene.killAndHide(this.image)

  }
  destroy() {
    if (this.strength == 0) {
      this.disabled = true
      this.redrawThisColumn();
      this.adjustAboveDotCoordinates(this.dotSize);
      this.deleteThisFromArray();
      this.fillInSpaceLeft();
      if (this.type == 2) {
        this.board.scene.explode(this.coordinates[0], this.coordinates[1])
        console.log('bomb exploded')
        // tally[7]++
      }
    } else {
      this.image.setAlpha(1)
    }
  }
  redrawThisColumn() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    if (!(x in this.board.redrawTheseColumns) || this.board.redrawTheseColumns[x] < y) {
      this.board.redrawTheseColumns[x] = y;
    }
  }
  aboveDot() {
    var aboveCoords = this.aboveCoordinate();
    return this.board.findDot(aboveCoords);
  }

  aboveCoordinate() {
    return [this.coordinates[0], (this.coordinates[1] - 1)]
  }
  adjustAboveDotCoordinates() {
    this.aboveDots().forEach(function (dot, index) {
      dot.coordinates[1] += 1;
      dot.image.y += dot.dotSize
      /* dot.board.scene.tweens.add({
        targets: dot.image,
        y: '+=' + dot.dotSize,
        duration: 500,
        delay: index * 50,
        onComplete: function () {
          //dot.deleteThisFromArray()
          
        }
      }) */
      //dot.image.y += 110
    });
  }
  deleteThisFromArray() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    deleteAt(this.column(), y);
  }
  aboveDots() {
    var columnDots = this.column();
    var y = this.coordinates[1];
    return columnDots.filter(function (dot) {
      return dot.coordinates[1] < y;
    });
  }
  column() {
    var x = this.coordinates[0];
    return this.board.dots[x];
  }
  fillInSpaceLeft() {
    var x = this.coordinates[0];
    this.board.createNewDot(x);
  }
  ///////


  neighbors() {
    var coords = this.neighborCoordinates();
    return this.board.findDots(coords);
  }

  neighborCoordinates() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    return [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y]
    ];
  }
}