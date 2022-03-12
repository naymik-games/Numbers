class Toast {

  constructor(obj) {
    if(obj == undefined){
		obj = {}
	}
	this.text = (obj.text != undefined) ? obj.text : 'hello default';
	this.x = (obj.x != undefined) ? obj.x : 450;
	this.y = (obj.y != undefined) ? obj.y : 800;
  }

}