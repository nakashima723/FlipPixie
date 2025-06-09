// dial.js : ジョグダイアル制御 + 角度ボタン対応（正しい配置）

(() => {
  let currentAngle = 0;

  const dial        = document.getElementById('dial');
  if (!dial) return;
  const nub         = document.getElementById('nub');
  const angleText   = document.getElementById('angle-display');
  const rotateSel   = document.getElementById('rotate');

  // サイズを 7 割程度に縮小
  const center = { x: 70, y: 70 };
  const outerRadius = 67;
  const innerRadius = outerRadius - 30;  // ヌブ帯の幅を維持
  const nubRadius   = (innerRadius + outerRadius) / 2;

  let dragging = false;

  // ===== マウスドラッグ =====
  dial.addEventListener('pointerdown', (e) => {
    const p = pointFromEvent(e);
    const r = distance(center, p);
    if (r >= innerRadius && r <= outerRadius) {
      dragging = true;
      dial.setPointerCapture(e.pointerId);
      updateAngle(p);
    }
  });

  dial.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    updateAngle(pointFromEvent(e));
  });

  dial.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    dial.releasePointerCapture(e.pointerId);
    commitAngle();
  });

  // ===== ボタン操作 =====
  const btnLeft  = document.getElementById('rotate-left');   // 反時計回り
  const btnRight = document.getElementById('rotate-right');  // 時計回り
  const btnReset = document.getElementById('rotate-reset');  // リセット

  if (btnLeft) {
    btnLeft.addEventListener('click', () => {
      currentAngle = (currentAngle + 315) % 360;   // -45°
      renderDial();
      commitAngle();
    });
  }

  if (btnRight) {
    btnRight.addEventListener('click', () => {
      currentAngle = (currentAngle + 45) % 360;    // +45°
      renderDial();
      commitAngle();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentAngle = 0;
      renderDial();
      commitAngle();
    });
  }

  // ===== util =====
  function pointFromEvent(e) {
    const rect = dial.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function updateAngle(p) {
    const rad = Math.atan2(p.y - center.y, p.x - center.x);
    currentAngle = (Math.round(rad * 180 / Math.PI + 90 + 360) % 360);
    renderDial();
  }

  function renderDial() {
    angleText.textContent = currentAngle + '°';
    const rad = (currentAngle - 90) * Math.PI / 180;
    const x = center.x + nubRadius * Math.cos(rad);
    const y = center.y + nubRadius * Math.sin(rad);
    nub.setAttribute('cx', x);
    nub.setAttribute('cy', y);
  }

  function commitAngle() {
    // 互換 select に反映
    if (rotateSel) {
      if (![...rotateSel.options].some(o => o.value === String(currentAngle))) {
        const opt = document.createElement('option');
        opt.value = String(currentAngle);
        opt.textContent = currentAngle + '°';
        rotateSel.appendChild(opt);
      }
      rotateSel.value = String(currentAngle);
      if (typeof window.jQuery === 'function') {
        window.jQuery(rotateSel).change();
      }
    }

    // ストレージへ保存（スロットル）
    if (typeof window.scheduleRotate === 'function') {
      window.scheduleRotate(currentAngle);
    } else {
      chrome.storage.local.set({ Rotate: String(currentAngle) }, () => {
        chrome.runtime.sendMessage({type:'refresh'});
      });
    }

    // 外部フック
    if (typeof window.jogDialAngleHook === 'function') {
      window.jogDialAngleHook(currentAngle);
    }
  }

  // ===== 初期化：保存角度を復元 =====
  chrome.storage.local.get(['Rotate'], (items) => {
    const saved = parseInt(items.Rotate || '0', 10);
    if (!isNaN(saved)) {
      currentAngle = ((saved % 360) + 360) % 360;
      renderDial();
    }
  });
})();
