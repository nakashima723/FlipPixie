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
          Hue = items.Hue,
          Saturation = items.Saturation,
         Invert = items.Invert,
         Red = items.Red,
         Green = items.Green,
         Blue = items.Blue,
         ApplyOnLoad = items.ApplyOnLoad,
         OK = true;

    if(FlipX === undefined){ FlipX = "off"; }
    if(FlipY === undefined){ FlipY = "off"; }
      if(Rotate === undefined){ Rotate = "0"; }
      if(Brightness === undefined){ Brightness = 0; }
      if(Contrast === undefined){ Contrast = 0; }
      if(Hue === undefined){ Hue = 0; }
      if(Saturation === undefined){ Saturation = 0; }
     if(Invert === undefined){ Invert = 0; }
     if(Red === undefined){ Red = 0; }
     if(Green === undefined){ Green = 0; }
     if(Blue === undefined){ Blue = 0; }
     if(ApplyOnLoad === undefined){ ApplyOnLoad = false; }

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
        $("#hue").val(Hue);
        $("#saturate").val(Saturation);
        $("#invert").val(Invert);
        $("#red").val(Red);
        $("#green").val(Green);
        $("#blue").val(Blue);
        $("#applyOnLoad").prop('checked', ApplyOnLoad);
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

      var rotatePending = null;
      var rotateTimer  = null;

      var flushRotate = function(){
        rotateTimer = null;
        var angle = rotatePending;
        rotatePending = null;
        if (angle === null) return;
        chrome.storage.sync.set({Rotate: angle}, function(){
          chrome.runtime.sendMessage({type:'refresh'});
          if (rotatePending !== null && !rotateTimer) {
            rotateTimer = setTimeout(flushRotate, 100);
          }
        });
      };

      var scheduleRotate = function(angle){
        rotatePending = String(angle);
        if (!rotateTimer) {
          rotateTimer = setTimeout(flushRotate, 100);
        }
      };

      window.addEventListener('beforeunload', flushRotate);


      // 外部からも呼び出せるように公開
      window.scheduleRotate = scheduleRotate;

      var setRotate = function(){
        var Rotate = $("#rotate").children(':selected').val();
        scheduleRotate(Rotate);
      };

      // -- filter sliders --
      var filterPending = {b: null, c: null, h: null, s: null, i: null, r: null, g: null, bl: null};
      var filterTimer  = null;

      var sendImmediate = function(){
        chrome.runtime.sendMessage({
          type: 'updateFilters',
          brightness: $("#brightness").val(),
          contrast: $("#contrast").val(),
          hue: $("#hue").val(),
          saturate: $("#saturate").val(),
          invert: $("#invert").val(),
          red: $("#red").val(),
          green: $("#green").val(),
          blue: $("#blue").val()
        });
      };

      var flushFilters = function(){
        if (filterTimer) {
          clearTimeout(filterTimer);
          filterTimer = null;
        }
        var option = {};
        if (filterPending.b !== null) option.Brightness = filterPending.b;
        if (filterPending.c !== null) option.Contrast = filterPending.c;
        if (filterPending.h !== null) option.Hue = filterPending.h;
        if (filterPending.s !== null) option.Saturation = filterPending.s;
        if (filterPending.i !== null) option.Invert = filterPending.i;
        if (filterPending.r !== null) option.Red = filterPending.r;
        if (filterPending.g !== null) option.Green = filterPending.g;
        if (filterPending.bl !== null) option.Blue = filterPending.bl;
        filterPending = {b:null,c:null,h:null,s:null,i:null,r:null,g:null,bl:null};
        chrome.storage.sync.set(option);
      };

      var scheduleFilters = function(){
        if (filterTimer) clearTimeout(filterTimer);
        filterTimer = setTimeout(flushFilters, 100);
      };

      var setBrightness = function(){
        filterPending.b = parseInt($("#brightness").val(), 10) || 0;
        scheduleFilters();
        sendImmediate();
      };

      var setContrast = function(){
        filterPending.c = parseInt($("#contrast").val(), 10) || 0;
        scheduleFilters();
        sendImmediate();
      };

      var setHue = function(){
        filterPending.h = parseInt($("#hue").val(), 10) || 0;
        scheduleFilters();
        sendImmediate();
      };

      var setSaturate = function(){
        filterPending.s = parseInt($("#saturate").val(), 10) || 0;
        scheduleFilters();
        sendImmediate();
      };

      var setInvert = function(){
        filterPending.i = parseInt($("#invert").val(), 10) || 0;
        scheduleFilters();
        sendImmediate();
      };

      var setRed = function(){
        filterPending.r = parseInt($("#red").val(), 10) || 0;
        scheduleFilters();
        sendImmediate();
      };

      var setGreen = function(){
        filterPending.g = parseInt($("#green").val(), 10) || 0;
        scheduleFilters();
        sendImmediate();
      };

      var setBlue = function(){
        filterPending.bl = parseInt($("#blue").val(), 10) || 0;
        scheduleFilters();
        sendImmediate();
      };

      var resetBC = function(){
        $("#brightness").val(0);
        $("#contrast").val(0);
        $("#hue").val(0);
        $("#saturate").val(0);
        $("#invert").val(0);
        $("#red").val(0);
        $("#green").val(0);
        $("#blue").val(0);
        filterPending = {b:0,c:0,h:0,s:0,i:0,r:0,g:0,bl:0};
        flushFilters();
        sendImmediate();
      };

      var setApplyOnLoad = function(){
        ApplyOnLoad = $("#applyOnLoad").prop('checked');
        var option = {ApplyOnLoad: ApplyOnLoad};
        chrome.storage.sync.set(option, function(){
          chrome.runtime.sendMessage({type:'refresh'});
        });
      };

      $("#flipX").click(function(){ setButtonX(); });
      $("#flipY").click(function(){ setButtonY(); });
      $("#rotate").change(function(){ setRotate(); });
      $("#brightness").on('input change', function(){ setBrightness(); });
      $("#contrast").on('input change', function(){ setContrast(); });
      $("#hue").on('input change', function(){ setHue(); });
      $("#saturate").on('input change', function(){ setSaturate(); });
      $("#invert").on('input change', function(){ setInvert(); });
      $("#red").on('input change', function(){ setRed(); });
      $("#green").on('input change', function(){ setGreen(); });
      $("#blue").on('input change', function(){ setBlue(); });
      $("#bc-reset").click(function(){ resetBC(); });
      $("#applyOnLoad").change(function(){ setApplyOnLoad(); });
      $("#color-toggle").click(function(){
        $("#color-controls").slideToggle(100, function(){
          var visible = $("#color-controls").is(":visible");
          $("#color-toggle").text(visible ? "色調整 🔼" : "色調整 🔽");
        });
      });

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
