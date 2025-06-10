$(function(){
var applyOnLoad = false;
var observer = null;
var obsTimer = null;

var colorMatrix = null;
var ensureColorFilter = function(){
    if (!colorMatrix) {
        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width','0');
        svg.setAttribute('height','0');
        var filter = document.createElementNS(svgNS, 'filter');
        filter.setAttribute('id','fp-colorfilter');
        colorMatrix = document.createElementNS(svgNS, 'feColorMatrix');
        colorMatrix.setAttribute('type','matrix');
        filter.appendChild(colorMatrix);
        svg.appendChild(filter);
        (document.body || document.documentElement).appendChild(svg);
    }
};

var updateColorMatrix = function(r,g,b){
    ensureColorFilter();
    var rf = (100 + parseInt(r,10)) / 100;
    var gf = (100 + parseInt(g,10)) / 100;
    var bf = (100 + parseInt(b,10)) / 100;
    var vals = [
        rf,0,0,0,0,
        0,gf,0,0,0,
        0,0,bf,0,0,
        0,0,0,1,0
    ].join(' ');
    colorMatrix.setAttribute('values', vals);
};

var startObserver = function(){
    if(observer){
        observer.disconnect();
        observer = null;
    }
    if(!applyOnLoad) return;
    observer = new MutationObserver(function(muts){
        if(obsTimer) clearTimeout(obsTimer);
        obsTimer = setTimeout(setAll, 100);
    });
    observer.observe(document.body || document.documentElement, {childList:true, subtree:true});
};

var setAll = function(){
    chrome.storage.local.get(function(items) {
        var FlipX = items.FlipX || "off",
            FlipY = items.FlipY || "off",
            Rotate = items.Rotate || "0",
            Brightness = items.Brightness || 0,
            Contrast = items.Contrast || 0,
            Hue = items.Hue || 0,
            Saturation = items.Saturation || 0,
            Invert = items.Invert || 0,
            Red = items.Red || 0,
            Green = items.Green || 0,
            Blue = items.Blue || 0,
            img = 'img, div';
        applyOnLoad = items.ApplyOnLoad || false;

        var scale = ""; // デフォルトでは変形なし
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

        var transform = (rotate + scale).trim();

        $(img).each(function(){
            if($(this).is('img') || $(this).css('background-image') !== 'none'){
                
                if(transform){
                    // 元の transform を保存
                    if($(this).data('fp-original-transform') === undefined){
                        $(this).data('fp-original-transform', $(this).css('transform'));
                    }
                    $(this).css({'transform': transform});
                } else {
                    // 以前に拡張が変形を適用していた場合は元に戻す
                    if($(this).data('fp-original-transform') !== undefined){
                        $(this).css({'transform': $(this).data('fp-original-transform')});
                        $(this).removeData('fp-original-transform');
                    }
                }

            }
        });
        $('embed').each(function(){
            if(transform){
                if($(this).data('fp-original-transform') === undefined){
                    $(this).data('fp-original-transform', $(this).css('transform'));
                }
                $(this).css({'transform': transform});
            } else {
                if($(this).data('fp-original-transform') !== undefined){
                    $(this).css({'transform': $(this).data('fp-original-transform')});
                    $(this).removeData('fp-original-transform');
                }
            }
        });

        updateColorMatrix(Red, Green, Blue);
        var filter = 'brightness(' + ((100 + parseInt(Brightness,10)) / 100) +
                     ') contrast(' + ((100 + parseInt(Contrast,10)) / 100) +
                     ') hue-rotate(' + parseInt(Hue,10) + 'deg)' +
                     ' saturate(' + ((100 + parseInt(Saturation,10)) / 100) +
                     ') invert(' + (parseInt(Invert,10) / 100) + ' ) url(#fp-colorfilter)';
        $(img).each(function(){
            if($(this).is('img') || $(this).css('background-image') !== 'none'){
                $(this).css({'filter': filter});
            }
        });
        $('embed').css({'filter': filter});
        startObserver();
    });
};
//読み込み時に実行
setAll();
chrome.storage.onChanged.addListener(function(changes, namespace) {
    setAll();
});

// Popupからの更新要求
var applyFilters = function(bright, cont, hue, sat, inv, red, green, blue) {
    updateColorMatrix(red, green, blue);
    var filter = 'brightness(' + ((100 + parseInt(bright, 10)) / 100) +
                 ') contrast(' + ((100 + parseInt(cont, 10)) / 100) +
                 ') hue-rotate(' + parseInt(hue, 10) + 'deg)' +
                 ' saturate(' + ((100 + parseInt(sat, 10)) / 100) +
                 ') invert(' + (parseInt(inv, 10) / 100) + ' ) url(#fp-colorfilter)';
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
                     message.hue, message.saturate, message.invert,
                     message.red, message.green, message.blue);
    }
});
});//一番外側のfunctionの終わり