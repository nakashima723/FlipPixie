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
        $("#flipX").css({'color':'#fff','background-color':'#00aced'});
      } else {
        $("#flipX").css({'color':'#666','background-color':'#fff'});
      }

      if(FlipY === "on"){
        $("#flipY").css({'color':'#fff','background-color':'#00aced'});
      } else {
        $("#flipY").css({'color':'#666','background-color':'#fff'});
      }

      $("#rotate").val(Rotate);
    };	

    loadButton();	

    var setButtonX = function(){
      var option = {};
      if(FlipX === "on"){
        $("#flipX").css({'color':'#666','background-color':'#fff'});
        FlipX = "off";
      } else {
        $("#flipX").css({'color':'#fff','background-color':'#00aced'});
        FlipX = "on";
      }
      option.FlipX = FlipX;
      chrome.storage.sync.set(option);
    };

    var setButtonY = function(){
      var option = {};
      if(FlipY === "on"){
        $("#flipY").css({'color':'#666','background-color':'#fff'});
        FlipY = "off";
      } else {
        $("#flipY").css({'color':'#fff','background-color':'#00aced'});
        FlipY = "on";
      }
      option.FlipY = FlipY;
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
