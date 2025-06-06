$(function(){
var setAll = function(){
   chrome.storage.sync.get(function(items){
	var loadButton =  function(){
	var Flip = items.Flip;
		console.log(items.Flip);
		if(Flip === undefined){
			Flip = "off";
			}
		if(Flip === "on"){
		$("#switch").text("ON");
			$("#switch").css('color','#00aced');
			$("#rt").css({'color':'#fff','background-color':'#00aced'});	
		} else { 
		$("#switch").text("OFF");
			$("#switch").css('color','#666');
			$("#rt").css({'color':'#666','background-color':'#fff'});		
		}
	};	
	loadButton();	
	var setButton =  function(){
	var RTmode = $("#switch").text();
		if(RTmode === "ON"){
			$("#switch").text("OFF");			
			$("#switch").css('color','#666');
			$("#rt").css({'color':'#666','background-color':'#fff'});	
			var option = {};
			option.Flip = "off";
 			  chrome.storage.sync.set(option,function(items){});	
			}	
		if(RTmode === "OFF"){
			$("#switch").text("ON");
			$("#switch").css('color','#00aced ');
			$("#rt").css({'color':'#fff','background-color':'#00aced'});
			var option = {};
			option.Flip = "on";
 			  chrome.storage.sync.set(option,function(items){});
			}
	};
	$("#rt").click(function(){
		setButton();
		});
		
    });
   };
   setAll();		
  chrome.storage.onChanged.addListener(function(changes, namespace) { 
	$('#rt').unbind('click');
   setAll();
	});
});