$(function(){	
  chrome.storage.sync.get(function(items){
    var setHeight = function() {
      var height = $('body').height();
      $('html,body').height(height);
    }

      var FlipX = items.FlipX,
          FlipY = items.FlipY,
          Rotate = items.Rotate,
          Brightness = items.Brightness,
          Contrast = items.Contrast,
          OK = true;

    if(FlipX === undefined){ FlipX = "off"; }
    if(FlipY === undefined){ FlipY = "off"; }
      if(Rotate === undefined){ Rotate = "0"; }
      if(Brightness === undefined){ Brightness = 0; }
      if(Contrast === undefined){ Contrast = 0; }

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
        $("#brightness").val(Brightness);
        $("#contrast").val(Contrast);
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

      var setBrightness = function(){
        var val = parseInt($("#brightness").val(), 10) || 0;
        chrome.storage.sync.set({ Brightness: val });
      };

      var setContrast = function(){
        var val = parseInt($("#contrast").val(), 10) || 0;
        chrome.storage.sync.set({ Contrast: val });
      };

      var resetBC = function(){
        $("#brightness").val(0);
        $("#contrast").val(0);
        chrome.storage.sync.set({ Brightness: 0, Contrast: 0 });
      };

      $("#flipX").click(function(){ setButtonX(); });
      $("#flipY").click(function(){ setButtonY(); });
      $("#rotate").change(function(){ setRotate(); });
      $("#brightness").on('input change', function(){ setBrightness(); });
      $("#contrast").on('input change', function(){ setContrast(); });
      $("#bc-reset").click(function(){ resetBC(); });

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
