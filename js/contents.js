$(function(){
var setAll = function(){	
	chrome.storage.sync.get(function(items) {
		var FlipX = items.FlipX,
			FlipY = items.FlipY,
			Rotate = items.Rotate,
			url = window.location.href,
			img= 'img, div',
			scale = " scale(1,1)",
			dot = url.substr(-4,4);	
			if (dot === "jpeg"||dot === ".png"||dot === ".gif"||dot === ".jpg"||dot === ".bmp" ||dot === ".svg" ||dot === ".JPEG"||dot === ".PNG"||dot === ".GIF"||dot === ".JPG"||dot === ".SVG" ||dot === "tiff"||dot === "TIFF"||dot === "svgz"||dot === "SVGZ"){
				var image = true;
				}
				else { var image = false;}
			if(FlipX === undefined){
				FlipX = "off";
				}
			if(FlipY === undefined){
				FlipY = "off";
				}
			if(Rotate === undefined){
				Rotate = "0";
				}
		if(FlipX ==="off" && FlipY === "off"){
			var changed = false;
			}
		if(FlipX === "on"){ var changed = true;
			if(FlipY === "on"){ scale = " scale(-1,-1)";
			if(image === false){
			$(img).each(function(){
				if($(this).is('img') || $(this).css('background-image')!== "none")
				 $(this).css({'transform': scale});
				 });
				 $('embed').css({'transform': scale});
				 } 
			}
			else{ scale = " scale(-1,1)"; var changed = true;
			if(image === false){
			$(img).each(function(){
				if($(this).is('img') || $(this).css('background-image')!== "none")
				 $(this).css({'transform': scale});
				 });
				 }				 
				 $('embed').css({'transform': scale});
			 }
			}
		if(FlipX === "off"){ 
			if(FlipY === "on"){ var changed = true;
			scale = " scale(1,-1)";
			if(image === false){
			$(img).each(function(){
				if($(this).is('img') || $(this).css('background-image')!== "none")
				 $(this).css({'transform': scale});
				 });
		    	}
				$('embed').css({'transform': scale});
			}
			else{
			if(image === false){
			$(img).each(function(){
				if($(this).is('img') || $(this).css('background-image')!== "none")
				var trans = $(this).css('transform');
				if(trans !== "none"){
					if ( trans === "matrix(-1, 0, 0, 1, 0, 0)" || trans === "matrix(1, 0, 0, -1, 0, 0)" || trans === "matrix(-1, 0, 0, -1, 0, 0)"){
				 $(this).css({'transform': 'scale(1,1)'});
					}
					}
				 });				 
				$('embed').css({'transform': 'scale(1,1)'});
				}
			}
		}
		if(Rotate !== 0 && Rotate !== undefined && document.getElementsByTagName('img').length === 1  && document.getElementsByTagName('div').length === 0 ){
			$(img).each(function(){
			if($(this).is('img') || $(this).css('background-image')!== "none"){
				var width = $(this).width()/2,
				 height = $(this).height()/2,
				 x = height/width,
				 y = width/height,
				 arcX = Math.atan(x),
				 arcY = Math.atan(y),
				 square = (width*width) + (height*height),
				 root = Math.sqrt(square),
				 deg = Rotate;				 
				 if(Rotate >= 90 && Rotate < 180){
					 deg = Rotate - 90;
					 }	 
				 if(Rotate >= 270 && Rotate < 360){
					 deg = Rotate - 270;
					 }
				 var radX = deg * (Math.PI / 180) + arcX,
				 radY =  deg * (Math.PI / 180) + arcY,
				 sinX = Math.sin(radX) * root,
				 top = Math.abs(sinX) - height,
				 sinY = Math.sin(radY) * root,
				 left = Math.abs(sinY) - width,
				 rotate = "rotate(" + Rotate + "deg)";
				 arcX = radX * 180 / Math.PI;
				 arcY = radY * 180 / Math.PI;	 
				 if(Rotate >= 90 && Rotate < 180){
				 left = Math.abs(sinX) - width;
				 top = Math.abs(sinY) - height;
					 }	 		 
				 if(Rotate >=270 && Rotate < 360){
				 left = Math.abs(sinX) - width;
				 top = Math.abs(sinY) - height;
					 }	 
				 $(this).css({'position': 'absolute', 'top': top, 'left': left , 'transform': rotate + scale});
				}
			});	
		}
	});
};
//読み込み時に実行
setAll();
  chrome.storage.onChanged.addListener(function(changes, namespace) { 
   setAll();
	});
});//一番外側のfunctionの終わり