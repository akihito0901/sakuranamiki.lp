/*
 * このLPの動きはここに全部入っています。
 *
 * 以前は React + ReactDOM（約140KB）でページ全体を毎回組み立てていました。
 * ただ中身はほぼ静的な画像とテキストで、動くのは
 *   ・スクロールで要素をふわっと出す（fade-up）
 *   ・LINEボタンが画面に入ったときのアニメーション
 *   ・よくあるご質問の開閉
 *   ・ヒーロー画像のA/B差し替え
 *   ・LINE / 電話 / マップ タップの計測
 * の5つだけでした。
 *
 * そのためHTMLは事前に書き出したものをそのまま置き、
 * このファイルは上の5つだけを担当します。
 * Reactを読み込まなくなったぶん初期表示が速く、
 * 検索エンジンからもJSを実行せずに本文が読める状態になります。
 */
(function () {
  'use strict';

  /* ヒーロー画像の差し替え処理はここにあったが、不要になったので削除した。
     A/Cはページ自体を分けて（/ と /c.html）それぞれに正しい画像を
     焼き込む方式にしたため、JSで入れ替える必要がない。
     以前の方式では、Cを見る人がA画像とC画像の両方を読み込んでいた。 */

  /* ── スクロールで要素を出す ──
     IntersectionObserver が無い環境では最初から見えている状態にする。 */
  var fadeTargets = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < fadeTargets.length; i++) fadeTargets[i].classList.add('visible');
  } else {
    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    for (var j = 0; j < fadeTargets.length; j++) fadeObs.observe(fadeTargets[j]);

    /* ── LINEボタンが画面に入ったら一度だけ animate ── */
    /* Googleマップのボタン（data-cta-map）も同じタイミングでゆらす。光る色は別（index.html の map-cta-glow） */
    var ctas = document.querySelectorAll('[data-cta-line], [data-cta-map]');
    var ctaObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add(e.target.hasAttribute('data-cta-map') ? 'map-cta-animated' : 'cta-line-animated');
        ctaObs.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    for (var k = 0; k < ctas.length; k++) ctaObs.observe(ctas[k]);
  }

  /* ── 今月の残り枠 ──
     月を4つに分けて 10 → 8 → 6 → 3 名と減らす（依頼者の指示、2026-10-02）。
     実際の予約数とは連動していない。日付は端末の時計ではなく日本時間で判定する。
     表を変えるときは app.js の SLOTS も揃えること（プリレンダ時の初期値に使う）。 */
  var SLOTS = [10, 8, 6, 3];
  /* ★手動で数字を下げるときはここだけ書き換える（app.js の SLOTS_MANUAL も揃える）。
     書いた月の間だけ効き、翌月は自動で 10 名から始まる。
     日付の表より少ないほうを出すので、9 名にしても 9日以降は 8 → 6 → 3 と下がっていく。 */
  var SLOTS_MANUAL = { month: '2026-10', count: 9 };
  var slotEls = document.querySelectorAll('[data-slots-count]');
  if (slotEls.length) {
    var jst = new Date(Date.now() + 9 * 3600 * 1000);
    var y = jst.getUTCFullYear(), mo = jst.getUTCMonth(), day = jst.getUTCDate();
    var days = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
    var left = SLOTS[Math.min(3, Math.floor((day - 1) / (days / 4)))];
    var ym = y + '-' + (mo < 9 ? '0' : '') + (mo + 1);
    if (SLOTS_MANUAL && SLOTS_MANUAL.month === ym) left = Math.min(left, SLOTS_MANUAL.count);
    for (var si = 0; si < slotEls.length; si++) slotEls[si].textContent = String(left);
  }

  /* ── よくあるご質問の開閉 ──
     開いている項目は一度にひとつ。Reactの openIdx と同じ挙動。 */
  var OPEN = ['max-h-[800px]', 'opacity-100', 'pb-4'];
  var SHUT = ['max-h-0', 'opacity-0'];

  function setOpen(item, open) {
    var panel = item.querySelector('[data-qa-panel]');
    var btn = item.querySelector('button');
    var chevron = item.querySelector('svg');
    if (!panel) return;
    SHUT.forEach(function (c) { panel.classList.toggle(c, !open); });
    OPEN.forEach(function (c) { panel.classList.toggle(c, open); });
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (chevron) chevron.classList.toggle('rotate-180', open);
  }

  var qaItems = document.querySelectorAll('[data-qa-item]');
  for (var m = 0; m < qaItems.length; m++) {
    (function (item) {
      var btn = item.querySelector('button');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        for (var n = 0; n < qaItems.length; n++) setOpen(qaItems[n], false);
        if (!isOpen) setOpen(item, true);
      });
    })(qaItems[m]);
  }

  /* ── 計測 ──
     以前は各ボタンに onClick を直接書いていたが、静的HTMLにしたので
     リンク先を見て振り分ける方式にした。ボタンを増やしても自動で計測される。
     計測の考え方（LeadとFindLocationの切り分け）は index.html 側のコメント参照。 */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a') : null;
    if (!a || !a.href) return;
    if (a.href.indexOf('lin.ee') !== -1) {
      if (window.trackLead) window.trackLead();
    } else if (a.href.indexOf('tel:') === 0) {
      if (window.trackTel) window.trackTel();
    } else if (a.href.indexOf('maps.app.goo.gl') !== -1) {
      if (window.trackMap) window.trackMap();
    }
  }, true);
})();
