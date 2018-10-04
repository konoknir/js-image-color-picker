var ImageColorPicker = function(img_selector, opt){

	// vars
	var x = '', y = '';
	var inst = this;
	var d = document;

	// constructor
	opt = (typeof opt === 'object') ? opt : {};

	inst.img = _(img_selector);

	if(!inst.img){
		return;
	}

	inst.img.style.cursor = 'crosshair';

	// create canvas
	if(opt.canvas){
		inst.canvas = opt.canvas;
	}
	else {
		inst.canvas = d.createElement('canvas');
		inst.img.parentNode.insertBefore(inst.canvas, inst.img.nextSibling);
	}
	inst.canvas.style.display = 'none';

	// optional public containers
	inst.preview = opt.preview ? _(opt.preview) : d.createElement('div');

	// default
	inst.result_hex = '';
	inst.result_rgb = [];
	inst.result_rgb_string = '';

	// callbacks
	var clicked = opt.clicked || function(){};

	// click function
	inst.img.addEventListener('click', function(e){
		// chrome
		if(e.offsetX) {
			x = e.offsetX;
			y = e.offsetY; 
		}
		// firefox
		else if(e.layerX) {
			x = e.layerX;
			y = e.layerY;
		}
		useCanvas(inst.canvas, inst.img, function(){
			// get image data
			inst.result_rgb = inst.canvas.getContext('2d')
				.getImageData(x, y, 1, 1).data;
			
			var p = inst.result_rgb;
			
			// show info
			inst.result_hex = rgbToHex(p[0],p[1],p[2]);
			inst.result_rgb_string = 'rgb('+p[0]+','+ p[1]+','+ p[2]+')';
			
			// callback
			clicked(inst);
		});
	}, false);

	// preview function mousemove
	inst.img.addEventListener('mousemove', function(e){
		// chrome
		if(e.offsetX) {
			x = e.offsetX;
			y = e.offsetY; 
		}
		// firefox
		else if(e.layerX) {
			x = e.layerX;
			y = e.layerY;
		}
		
		useCanvas(inst.canvas, inst.img, function(){
			// get image data
			var p = inst.canvas.getContext('2d')
				.getImageData(x, y, 1, 1).data;
			
			// show preview color
			inst.preview.style.background = rgbToHex(p[0],p[1],p[2]);
		});
	}, false);

	// default first pixel canvas
	useCanvas(inst.canvas, inst.img, function(){
		// console.log('first init');
	});

	// check img resize
	function checkCanvasSize(el, image){
		return el.width == image.width && el.height == image.height;
	}

	// canvas function
	function useCanvas(el, image, callback){
		if(!checkCanvasSize(el, image)){
			el.width = image.width; // img width
			el.height = image.height; // img height
			
			// draw image in canvas tag
			el.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
		}
		
		return callback();
	}
	
	// short querySelector
	function _(el){
		return d.querySelector(el);
	};

	// convert rgba to hex 
	// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	function findPos(obj) {
		var curleft = 0, curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			
			return { x: curleft, y: curtop };
		}
	}
};