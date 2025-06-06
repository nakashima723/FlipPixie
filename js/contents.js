$(function(){
var setAll = function(){
    chrome.storage.sync.get(function(items) {
        var FlipX = items.FlipX || "off",
            FlipY = items.FlipY || "off",
            Rotate = items.Rotate || "0",
            Brightness = items.Brightness || 0,
            Contrast = items.Contrast || 0,
            Hue = items.Hue || 0,
            Saturation = items.Saturation || 0,
            Invert = items.Invert || 0,
            img = 'img, div';

        var scale = " scale(1,1)";
        if (FlipX === "on" && FlipY === "on") {
            scale = " scale(-1,-1)";
        } else if (FlipX === "on") {
            scale = " scale(-1,1)";
        } else if (FlipY === "on") {
            scale = " scale(1,-1)";
        }

        var rotate = "";
        if (Rotate !== 0 && Rotate !== "0") {
            rotate = " rotate(" + Rotate + "deg)";
        }

        var transform = rotate + scale;

        $(img).each(function(){
            if($(this).is('img') || $(this).css('background-image') !== 'none'){
                $(this).css({'transform': transform});
            }
        });
        $('embed').css({'transform': transform});

        var filter = 'brightness(' + ((100 + parseInt(Brightness,10)) / 100) +
                     ') contrast(' + ((100 + parseInt(Contrast,10)) / 100) +
                     ') hue-rotate(' + parseInt(Hue,10) + 'deg)' +
                     ' saturate(' + ((100 + parseInt(Saturation,10)) / 100) +
                     ') invert(' + (parseInt(Invert,10) / 100) + ')';
        $(img).each(function(){
            if($(this).is('img') || $(this).css('background-image') !== 'none'){
                $(this).css({'filter': filter});
            }
        });
        $('embed').css({'filter': filter});
    });
};
//読み込み時に実行
setAll();
chrome.storage.onChanged.addListener(function(changes, namespace) {
    setAll();
});

// Popupからの更新要求
var applyFilters = function(bright, cont, hue, sat, inv) {
    var filter = 'brightness(' + ((100 + parseInt(bright, 10)) / 100) +
                 ') contrast(' + ((100 + parseInt(cont, 10)) / 100) +
                 ') hue-rotate(' + parseInt(hue, 10) + 'deg)' +
                 ' saturate(' + ((100 + parseInt(sat, 10)) / 100) +
                 ') invert(' + (parseInt(inv, 10) / 100) + ')';
    $('img, div').each(function(){
        if($(this).is('img') || $(this).css('background-image') !== 'none'){
            $(this).css({'filter': filter});
        }
    });
    $('embed').css({'filter': filter});
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message && message.type === 'refresh') {
        setAll();
    } else if (message && message.type === 'updateFilters') {
        applyFilters(message.brightness, message.contrast,
                     message.hue, message.saturate, message.invert);
    }
});
});//一番外側のfunctionの終わり
