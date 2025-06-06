$(function(){	
  chrome.storage.sync.get(function(items){
    var setHeight = function() {
      var height = $('body').height();
      $('html,body').height(height);
    }

    var FlipX = items.FlipX,
        FlipY = items.FlipY,
        Rotate = items.Rotate,
        OK = true;

    if(FlipX === undefined){ FlipX = "off"; }
    if(FlipY === undefined){ FlipY = "off"; }
    if(Rotate === undefined){ Rotate = "0"; }

    var loadButton = function(){
      if(FlipX === "on"){
        $("#switch").text("ON");
        $("#switch").css('color','#00aced');
        $("#flipX").css({'color':'#fff','background-color':'#00aced'});	
      } else {
        $("#switch").text("OFF");
        $("#switch").css('color','#666');
        $("#flipX").css({'color':'#666','background-color':'#fff'});		
      }

      if(FlipY === "on"){
        $("#switch2").text("ON");
        $("#switch2").css('color','#00aced');
        $("#flipY").css({'color':'#fff','background-color':'#00aced'});	
      } else {
        $("#switch2").text("OFF");
        $("#switch2").css('color','#666');
        $("#flipY").css({'color':'#666','background-color':'#fff'});		
      }

      $("#rotate").val(Rotate);
    };	

    loadButton();	

    var setButtonX = function(){
      var flipXmode = $("#switch").text();
      var option = {};
      if(flipXmode === "ON"){
        $("#switch").text("OFF");			
        $("#switch").css('color','#666');
        $("#flipX").css({'color':'#666','background-color':'#fff'});	
        option.FlipX= "off";
      } else {
        $("#switch").text("ON");
        $("#switch").css('color','#00aced');
        $("#flipX").css({'color':'#fff','background-color':'#00aced'});
        option.FlipX= "on";
      }
      chrome.storage.sync.set(option);
    };	

    var setButtonY = function(){		
      var flipYmode = $("#switch2").text();
      var option = {};
      if(flipYmode === "ON"){
        $("#switch2").text("OFF");			
        $("#switch2").css('color','#666');
        $("#flipY").css({'color':'#666','background-color':'#fff'});	
        option.FlipY= "off";
      } else {
        $("#switch2").text("ON");
        $("#switch2").css('color','#00aced');
        $("#flipY").css({'color':'#fff','background-color':'#00aced'});
        option.FlipY= "on";
      }
      chrome.storage.sync.set(option);
    };

    var setRotate = function(){	
      var Rotate = $("#rotate").children(':selected').val(); 	 
      var option = {};
      option.Rotate = Rotate;
      chrome.storage.sync.set(option);
    };

    $("#flipX").click(function(){ setButtonX(); });
    $("#flipY").click(function(){ setButtonY(); });
    $("#rotate").change(function(){ setRotate(); });

    // ジョグダイアル → select を動かすための連携
    if (typeof window.jogDialAngleHook === 'function') {
      window.jogDialAngleHook(function(deg) {
        var sel = $("#rotate");
        if (sel.children("option[value='" + deg + "']").length === 0) {
          sel.append($("<option></option>").attr("value", deg).text(deg + "°"));
        }
        sel.val(deg).change();
      });
    }
  });
});
