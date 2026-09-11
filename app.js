/* このLPの本文を定義しているファイルです（JSXではなく素のJavaScript）。
   文言やセクションを変えるときはここを編集します。

   ★重要★ このファイルはブラウザには配信されません。
   編集したあと必ず次を実行してください。実行しないと画面に反映されません。

       node tools/prerender.js

   これが app.js を一度だけレンダリングして、結果を index.html の
   <div id="root"> に焼き込みます。ブラウザにReactは送らないので、
   初期表示が速く、検索エンジンもJSを実行せずに本文を読めます。
   画面の動き（開閉・アニメ・計測）は lp.js が担当します。 */
const {
  useState,
  useEffect,
  useRef
} = React;

/* Font Awesome をやめてインラインSVGにしたもの。
   all.min.css(102KB)とwebフォント実体(約250KB)を読み込まず、実際に使う6個だけを持つ。
   viewBoxの比率から幅を出しているので、従来どおり text-xl 等の文字サイズで拡縮できる。
   色は fill:currentColor なので text-skin-rose 等のクラスもそのまま効く。 */
const ICONS = {
  "caret-right": ["0 0 256 512", "M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"],
  "chevron-down": ["0 0 512 512", "M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"],
  "line": ["0 0 512 512", "M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"],
  "location-dot": ["0 0 384 512", "M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"],
  "phone-flip": ["0 0 512 512", "M347.1 24.6c7.7-18.6 28-28.5 47.4-23.2l88 24C499.9 30.2 512 46 512 64c0 247.4-200.6 448-448 448c-18 0-33.8-12.1-38.6-29.5l-24-88c-5.3-19.4 4.6-39.7 23.2-47.4l96-40c16.3-6.8 35.2-2.1 46.3 11.6L207.3 368c70.4-33.3 127.4-90.3 160.7-160.7L318.7 167c-13.7-11.2-18.4-30-11.6-46.3l40-96z"],
  "star": ["0 0 576 512", "M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"]
};
const Icon = ({
  name,
  className = ""
}) => {
  const ic = ICONS[name];
  const vb = ic[0].split(" ");
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    viewBox: ic[0],
    fill: "currentColor",
    "aria-hidden": "true",
    focusable: "false",
    style: {
      height: "1em",
      width: parseInt(vb[2], 10) / parseInt(vb[3], 10) + "em",
      display: "inline-block",
      verticalAlign: "-0.125em"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: ic[1]
  }));
};
const useFadeUp = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }, {
      threshold: 0.1
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
};

/* ─── LINE CTA ─── */
const LineCTA = ({
  className = "",
  flush = false
}) => {
  const ref = useRef(null);
  const [fired, setFired] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired) {
        setFired(true);
        obs.disconnect();
      }
    }, {
      threshold: 0.6
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [fired]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: `w-full ${flush ? '' : 'px-4'} ${fired ? 'cta-line-animated' : ''} ${className}`,
    "data-cta-line": ""
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://lin.ee/uqCRkRL",
    onClick: () => window.trackLead(),
    className: "block w-full bg-gradient-to-br from-[#06C755] to-[#04a044] text-white font-bold py-5 rounded-xl shadow-[0_10px_30px_rgba(6,199,85,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(6,199,85,0.5)] active:scale-[0.97] transition-all relative overflow-hidden group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -ml-10 group-hover:ml-[120%] transition-all duration-700"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center gap-1 relative z-10"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] tracking-widest bg-black/20 px-3 py-0.5 rounded-full"
  }, "＼ 24時間受付・LINEで完結 ／"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mt-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "line",
    className: "text-4xl drop-shadow-md"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[17px] sm:text-xl font-black tracking-tight leading-snug"
  }, "初回2,980円で", /*#__PURE__*/React.createElement("br", {
    className: "sm:hidden"
  }), "予約する")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] mt-1 opacity-80"
  }, "※タップするとLINEアプリが開きます"))));
};

/* ─── Sticky Header ─── */
const StickyHeader = () => /*#__PURE__*/React.createElement("div", {
  className: "fixed top-0 left-0 w-full bg-white/95 backdrop-blur border-b border-skin-peach/60 shadow-sm z-50"
}, /*#__PURE__*/React.createElement("div", {
  className: "max-w-md mx-auto flex items-center justify-between px-3 py-2"
}, /*#__PURE__*/React.createElement("a", {
  href: "#",
  className: "flex-shrink-0"
}, /*#__PURE__*/React.createElement("img", {
  src: "./images/logo-new2.webp",
  alt: "桜並木駅前の整骨院",
  width: "726",
  height: "161",
  className: "h-8 w-auto"
})), /*#__PURE__*/React.createElement("a", {
  href: "https://maps.app.goo.gl/SVMYspHp6BMLiEwa7",
  target: "_blank",
  rel: "noopener noreferrer",
  onClick: () => window.trackMap(),
  className: "flex items-center gap-1.5 bg-skin-cream text-skin-dark text-xs font-bold px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all border border-skin-blush/50"
}, /*#__PURE__*/React.createElement(Icon, {
    name: "location-dot",
    className: "text-skin-rose"
  }), /*#__PURE__*/React.createElement("span", null, "Googleマップで確認"))));

/* ─── ① ヘッドライン（A/Bテスト対象） ─── */
/* a と c の2パターン。どちらを出すかはページごとに固定されている。
   tools/prerender.js が index.html には a、c.html には c を焼き込むため、
   ブラウザ側で切り替える処理は無い（MetaのA/BテストでURLごとに分けるため）。 */
const HERO_VARIANTS = {
  a: {
    src: './images/hero-ab-a-empathy.webp',
    alt: '「また同じかも…」そう思いながらこのページを見ているあなたへ。何件通っても繰り返した首・肩のつらさに、今度こそ丁寧に向き合います。初回限定2,980円'
  },
  c: {
    src: './images/hero-ab-c-shinsokin.webp',
    alt: '何度も繰り返す、そのつらさに。身体の奥深くから整える深層筋集中整体。深層筋×骨格×姿勢を整える、あなただけに合わせる整体。丁寧なカウンセリング／国家資格保有10年のキャリア／首・肩・腰のお悩みに。'
  }
};
const Headline = () => {
  const hero = HERO_VARIANTS[window.AB_VARIANT] || HERO_VARIANTS.a;
  return /*#__PURE__*/React.createElement("div", {
    className: "pt-12 bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("img", {
    src: hero.src,
    alt: hero.alt,
    width: "940",
    height: "1672",
    fetchpriority: "high",
    "data-hero": "",
    decoding: "async",
    className: "w-full h-auto block"
  })));
};
/* ─── ② 悩みの共感 ─── */
const EmpathySection = () => {
  const ref = useFadeUp();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full bg-[#FCF8F5]"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/empathy-new-image.webp",
    width: 941,
    height: 1672,
    loading: "lazy",
    decoding: "async",
    alt: "こんなお悩みありませんか？ マッサージへ行っても数日で戻る／湿布ばかり貼っている／病院では異常なしと言われた／原因が分からない／もう歳だから仕方ないと思っている。もし一つでも当てはまるなら、原因は痛い場所ではないかもしれません。",
    className: "w-full h-auto block drop-shadow-sm"
  }));
};

/* ─── ③ 問題提起（画像） ─── */
const ProblemSection = () => {
  const ref = useFadeUp();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full bg-[#FCF8F5]"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/problem-new-image.webp",
    width: 940,
    height: 1673,
    loading: "lazy",
    decoding: "async",
    alt: "そのまま放置しておくと… 1．集中力が続かない（仕事や勉強の効率が低下しミスが増える）／2．肩があがらなくなる・首が回らなくなる（服の着脱や運転など日常生活が不自由に）／3．痺れや痛みがとれない（慢性的な症状は改善に時間がかかる）／4．睡眠不足で体調を崩しやすくなる（疲れが取れず免疫力が低下）。つらい症状は早めのケアが大切です。",
    className: "w-full h-auto block drop-shadow-sm"
  }));
};

/* ─── ④ 原因の提示 ─── */
const CauseSection = () => {
  const ref = useFadeUp();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/cause-new-image.webp",
    width: 941,
    height: 1672,
    loading: "lazy",
    decoding: "async",
    alt: "なぜ肩や腰は何度も戻るのか？ 多くの整体では痛い場所を揉みます。でも姿勢・関節の動き・呼吸・身体を支える深層筋が変わっていなければ、数日後にはまた元通りになります。「また戻った」を繰り返していませんか？",
    className: "w-full h-auto block"
  }));
};

/* ─── ⑤ 解決策 ─── */
const SolutionSection = () => {
  const ref = useFadeUp();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full bg-skin-peach"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-14 pb-6 text-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-mincho text-2xl font-bold text-skin-dark mb-4 leading-relaxed"
  }, "私たちの", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose"
  }, "「深層筋集中整体」"), "なら、", /*#__PURE__*/React.createElement("br", null), "それを解決できます。")), /*#__PURE__*/React.createElement("div", {
    className: "px-5 pb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl shadow-lg overflow-hidden"
  }, /*#__PURE__*/React.createElement("video", {
    src: "./images/solution-video-sm.mp4",
    preload: "metadata",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    className: "w-full h-72 object-cover"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-5"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/director.webp",
    width: "857",
    height: "849",
    loading: "lazy",
    decoding: "async",
    alt: "桜並木駅前の整骨院 院長 今坂智和（国家資格保有）",
    className: "w-14 h-14 rounded-full object-cover shadow-md flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-skin-dark font-bold text-sm"
  }, "院長\u3000今坂智和"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-skin-text/60"
  }, "国家資格保有者"))), /*#__PURE__*/React.createElement("div", {
    className: "mb-5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-skin-rose font-bold tracking-widest mb-2 text-center"
  }, "▼ 院長からのメッセージをご覧ください"), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-skin-peach/40",
    style: {
      paddingTop: '56.25%'
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    className: "absolute inset-0 w-full h-full",
    src: "https://www.youtube.com/embed/KWMeWBIzs2o?rel=0&modestbranding=1",
    title: "院長からのメッセージ",
    frameBorder: "0",
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen: true
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-sm leading-[2] text-skin-dark/80 mb-3"
  }, "私の", /*#__PURE__*/React.createElement("span", {
    className: "text-skin-dark font-bold"
  }, "10年の経験"), "から独自に生み出したオリジナルの深層筋集中整体で、表面の筋肉をもみほぐす一般的な施術とは異なり、", /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose font-bold"
  }, "骨に最も近い深部のコリをピンポイントで"), "とらえます。また、同時に固まってしまった関節の動きをだしていき、お身体を本来あるべき姿に戻していきます。"), /*#__PURE__*/React.createElement("p", {
    className: "text-base leading-relaxed text-skin-dark font-black text-center mt-4 py-3 border-t border-skin-blush/40"
  }, "そうすることで", /*#__PURE__*/React.createElement("br", null), "「何をしても戻る首肩のコリ」を", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose text-lg"
  }, "根本から解消"), "します。")));
};

/* ─── ⑤.5 当院はここが違います ─── */
const ClinicDifferenceSection = () => {
  const ref = useFadeUp();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/clinic-difference.webp",
    width: 941,
    height: 1672,
    loading: "lazy",
    decoding: "async",
    alt: "当院はココが違います。深層筋集中整体はただ揉むだけではありません。1．関節の動きを確認 2．姿勢を分析 3．呼吸を確認 4．深層筋へアプローチ 5．再発しない身体の使い方までアドバイス。痛みだけでなく、戻らない身体を目指します。",
    className: "w-full h-auto block"
  }));
};

/* ─── ⑥ ベネフィット + 中盤CTA ─── */
const BenefitSection = () => {
  const ref = useFadeUp();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full bg-white"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/benefit-new.webp",
    width: 941,
    height: 1672,
    loading: "lazy",
    decoding: "async",
    alt: "施術のその先に、こんな毎日を取り戻しませんか？　朝、身体が軽く感じられる／つらさを気にせず過ごせる時間が増える／デスクワークもラクな姿勢で／頭も気持ちもすっきり前向きに／やりたいことをもっと楽しめる",
    className: "w-full h-auto block"
  }), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-10 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-lg text-skin-dark font-black mb-8 max-w-xs mx-auto leading-relaxed"
  }, /*#__PURE__*/React.createElement("span", {
    className: "animate-text-shimmer text-skin-rose"
  }, "まず一度、その身体で他との違いを感じてください。")), /*#__PURE__*/React.createElement(LineCTA, null)));
};

/* ─── ⑥.5 他院との違い ─── */
const ComparisonSection = () => {
  const ref = useFadeUp();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/comparison-table.webp",
    width: 941,
    height: 1672,
    loading: "lazy",
    decoding: "async",
    alt: "他院との違い。一般的な整体は痛い場所を揉む・担当が変わる・待ち時間あり・気持ち良さ重視。当院は原因から改善・院長が毎回担当・完全予約制・卒業を目指す。",
    className: "w-full h-auto block"
  }));
};

/* ─── ⑦ 特徴（選ばれる理由） ─── */
const FeatureSection = () => {
  const ref = useFadeUp();
  const features = [{
    num: "01",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "独自の「深層筋」アプローチ", /*#__PURE__*/React.createElement("br", null), "10年の経験・臨床1万件"),
    desc: "表面の筋肉だけを揉みほぐす一般的な施術とは異なり、骨に最も近い深部のコリをピンポイントで捉えます。10年以上のキャリアと1万件を超える施術実績で培った独自技術です。",
    mediaSrc: "./images/technique-sm.mp4",
    isVideo: true
  }, {
    num: "02",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "痛みの「本当の原因」を見抜く", /*#__PURE__*/React.createElement("br", null), "徹底カウンセリング＋担当制"),
    desc: "なぜ痛むのか。その理由は一人ひとり全く異なります。国家資格者の知見に基づき、あなたの日常生活のクセから痛みの引き金を探り出します。院長が最初から最後まで担当するので、細かい変化も見逃しません。",
    mediaSrc: "./images/counseling.webp",
    isVideo: false
  }, {
    num: "03",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "通いやすい環境", /*#__PURE__*/React.createElement("br", null), "提携駐車場あり・駅チカ1分"),
    desc: "桜並木駅から徒歩1分のアクセス。提携駐車場（タイムズ桜並木駅前）をご利用いただけます。料金は当院が負担いたしますので、お車の方もスムーズに施術を受けていただけます。",
    mediaSrc: "./images/parking.webp",
    isVideo: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full bg-skin-cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-14 pb-8 text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose text-[10px] tracking-[0.3em] font-bold block mb-4"
  }, "3 REASONS"), /*#__PURE__*/React.createElement("h2", {
    className: "font-mincho text-2xl font-bold text-skin-dark leading-relaxed"
  }, "当院が選ばれる", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose"
  }, "3つの理由"))), features.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full relative"
  }, f.isVideo ? /*#__PURE__*/React.createElement("video", {
    src: f.mediaSrc,
    preload: "metadata",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    className: "w-full h-64 object-cover block"
  }) : /*#__PURE__*/React.createElement("img", {
    src: f.mediaSrc,
    alt: "feature",
    loading: "lazy",
    decoding: "async",
    className: "w-full h-64 object-cover block"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-4 left-5 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-skin-peach font-black text-3xl opacity-90 drop-shadow-md"
  }, f.num), /*#__PURE__*/React.createElement("div", {
    className: "h-[2px] bg-skin-peach w-8 shadow-sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-8 bg-white border-b border-skin-peach/30"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-skin-dark mb-3 leading-snug"
  }, f.title), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-skin-text/70 leading-relaxed"
  }, f.desc)))));
};

/* ─── ⑧ 実績（Google口コミ） ─── */
const ReviewsSection = () => {
  const ref = useFadeUp();
  const data = [{
    name: "N.Yさん",
    attr: "30代女性",
    t: "「今までの整骨院とは違う」",
    c: "首の凝りと腰痛で悩んでいましたが、確実に良くなっているのを実感。継続したいと思える施術です。"
  }, {
    name: "S.Mさん",
    attr: "40代女性",
    t: "生活習慣のアドバイスも的確",
    c: "長年悩んでいた腰痛が良くなってきました。施術だけでなくアドバイスも的確。信頼できる先生に出会えました。"
  }, {
    name: "M.Kさん",
    attr: "30代男性",
    t: "根本的に改善する治療法",
    c: "マッサージも気持ち良いのですが、根本改善治療でどんどん体調が良くなっています。引き続き通います。"
  }, {
    name: "S.Tさん",
    attr: "30代女性",
    t: "今までで1番自分に合った整骨院",
    c: "辛かった肩こりも一度で楽になり、体が軽くなりました。キッズスペースもあります！"
  }, {
    name: "N.Hさん",
    attr: "20代女性",
    t: "すっと姿勢が正された",
    c: "施術後は自分でも驚くほど姿勢が改善。コスパ、先生の人柄、有資格者の施術、全てにおいて満足です。"
  }, {
    name: "T.Iさん",
    attr: "40代女性",
    t: "一人ひとりに寄り添う姿勢",
    c: "本気で体を良くしたい方におすすめ。技術も素晴らしく、終わった後は本当に体が軽くなっていました。"
  }, {
    name: "K.Oさん",
    attr: "50代女性",
    t: "手技のみで30分しっかり",
    c: "表層筋・深層筋合わせてアプローチしてくれて、週2日メンテナンスで通っています。今どき貴重な整骨院です。"
  }, {
    name: "W.Aさん",
    attr: "30代女性",
    t: "最初の施術で腰痛が大幅改善",
    c: "母の腰痛と自分の不調で通院。先生の親身な対応と清潔な院内で安心して施術を受けられます。"
  }, {
    name: "S.Sさん",
    attr: "30代女性",
    t: "毎回赤ちゃん連れでも安心",
    c: "産後の腰痛で来院。施術中は先生やスタッフがお世話してくれて助かりました。説明もわかりやすい。"
  }, {
    name: "Y.Uさん",
    attr: "40代男性",
    t: "駅徒歩1分のアクセス",
    c: "ひどい肩こり・腰痛で来院。施術後は肩・首がスッと軽くなりました。無理な勧誘もなく自分のペースで通えます。"
  }, {
    name: "R.Eさん",
    attr: "40代女性",
    t: "的確な施術で身体が軽く",
    c: "腰の不調の原因を瞬時に見抜き、力加減も絶妙。対処法まで教えてくれる親切さに感謝です。"
  }, {
    name: "K.Nさん",
    attr: "30代女性",
    t: "相談しやすい優しい先生",
    c: "足腰の痛み、反り腰、巻き肩まで総合的に施術。駐車場代も負担してくれる心遣いが嬉しい。友人にもすすめます。"
  }];
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-14"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    alt: "Google",
    className: "h-5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xl text-skin-dark"
  }, "マップの口コミ")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-skin-dark text-lg"
  }, "5.0"), /*#__PURE__*/React.createElement("div", {
    className: "flex text-yellow-500 text-base gap-0.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  })))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-0 max-w-sm mx-auto"
  }, data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "py-5 border-b border-skin-peach/40 last:border-b-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-full bg-skin-peach flex items-center justify-center text-skin-dark font-bold text-sm"
  }, d.name.charAt(0)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-skin-dark text-sm"
  }, d.name), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-skin-text/50 ml-2"
  }, d.attr))), /*#__PURE__*/React.createElement("div", {
    className: "flex text-yellow-500 text-[10px] gap-0.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    className: ""
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-skin-dark mb-1"
  }, d.t), /*#__PURE__*/React.createElement("p", {
    className: "text-[13px] text-skin-text/60 leading-relaxed"
  }, d.c)))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-sm mx-auto mt-10 pt-8 border-t border-skin-peach/50"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-center text-[15px] font-bold text-skin-dark leading-relaxed mb-4"
  }, "次は、", /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose"
  }, "あなたの番"), "です。"), /*#__PURE__*/React.createElement(LineCTA, {
    flush: true
  }))));
};

/* ─── ⑨ QA ─── */
const QASection = () => {
  const ref = useFadeUp();
  const qaData = [{
    q: "駐車場はありますか？",
    a: "タイムズ桜並木駅前をご利用下さい。施術時間分の料金は当院が負担しますので、安心してご利用下さい。"
  }, {
    q: "何回の通院でなおりますか？",
    a: "症状や個人差がありますが、多くの方が3〜5回の施術で大きな変化を実感されています。初回のカウンセリングで、おおよその回数をお伝えします。"
  }, {
    q: "料金はいくらですか？",
    a: "通常は\n・深層筋集中整体＋初診料 → 7,500円\n\nですが…\n\nお試し体験 2,980円で受けていただけます。\n\n2回目以降は\n・保険施術：400〜800円程度\n・深層筋集中整体：5,500円\n\n※通いやすいプランもご用意していますが、\n無理な勧誘は一切ありませんのでご安心ください。\n\n※初回体験時に、お身体の状態に合わせた最適な通い方をわかりやすくお伝えします！"
  }, {
    q: "どれくらいの頻度で通院したらいいですか？",
    a: "最初は週1〜2回のペースをおすすめしています。改善に伴い、徐々に間隔を空けていきます。"
  }, {
    q: "受付時間を教えてください",
    a: "10:00〜14:00 / 15:00〜20:00（月曜〜土曜・祝日）です。日曜日は休診です。"
  }, {
    q: "軽い症状でも行っていいですか？",
    a: "もちろんです！軽い症状のうちからケアすることで、重症化を予防できます。お気軽にご相談ください。"
  }, {
    q: "保険は使えますか？",
    a: "症状によっては健康保険が適用できる場合がございます。初回カウンセリング時にご確認ください。"
  }, {
    q: "施術時間はどれくらいですか？",
    a: "初回はカウンセリング含め約60分、2回目以降は約30〜40分を目安としております。"
  }, {
    q: "毎回担当は変わりますか？",
    a: "いいえ、完全担当制です。毎回同じ施術者が担当するため、お身体の変化をしっかり把握しながら施術を行います。"
  }, {
    q: "支払い方法は？",
    a: "現金のほか、各種クレジットカード、電子マネーがご利用いただけます。"
  }, {
    q: "予約はどうしたらいいですか？",
    a: "お電話・LINEどちらでもご予約いただけますが、LINE予約がおすすめです。\n\n施術中はお電話に出られない場合があるため、LINEの方がスムーズにご案内できます。\nまた、LINEでは空き状況の確認や24時間予約が可能です。\n\nご都合の良い時間を選んで、お気軽にご予約ください。"
  }, {
    q: "ボキボキする施術ですか？",
    a: "いいえ、当院では無理に関節を鳴らすようなボキボキ施術は行っておりません。\n\n首・肩・背中の深層筋を中心に、手技でやさしく筋肉や関節の動きを整えていきます。\n「整体が初めてで不安」「強い刺激が苦手」という方にも安心して受けていただける施術です。"
  }, {
    q: "整骨院が初めてですが大丈夫ですか？",
    a: "もちろん大丈夫です。\n\n当院には「整骨院や整体に行くのが初めて」という方も多く来院されています。\n初回は現在のお悩みや生活習慣についてしっかりお話を伺い、お身体の状態を確認したうえで施術を行います。\nわからないことや不安なことがあれば、その都度ご説明いたしますのでご安心ください。"
  }];
  const [openIdx, setOpenIdx] = useState(null);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full bg-skin-cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-14"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-10"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose text-[10px] tracking-[0.3em] font-bold block mb-4"
  }, "FAQ"), /*#__PURE__*/React.createElement("h2", {
    className: "font-mincho text-2xl font-bold text-skin-dark"
  }, "よくあるご質問")), /*#__PURE__*/React.createElement("div", {
    className: "max-w-sm mx-auto"
  }, qaData.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "border-b border-skin-blush/30",
    "data-qa-item": ""
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpenIdx(openIdx === i ? null : i),
    className: "w-full flex items-center justify-between py-4 text-left",
    "aria-expanded": openIdx === i ? "true" : "false"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose font-bold text-base mt-0.5"
  }, "Q"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-bold text-skin-dark leading-relaxed"
  }, item.q)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    className: `text-skin-blush text-[10px] ml-2 flex-shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`
  })), /*#__PURE__*/React.createElement("div", {
    className: `overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-[800px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`,
    "data-qa-panel": ""
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 pl-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-skin-pink font-bold text-base"
  }, "A"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-skin-text/70 leading-relaxed whitespace-pre-line"
  }, item.a)))))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-sm mx-auto mt-9"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-center text-[13px] text-skin-text/70 leading-relaxed mb-4"
  }, "その他のご質問も、", /*#__PURE__*/React.createElement("br", null), "LINEからお気軽にどうぞ。"), /*#__PURE__*/React.createElement(LineCTA, {
    flush: true
  }))));
};

/* ─── ⑩ CTA + LINE特典 (最後の一押し) ─── */
const FinalCTA = () => {
  const ref = useFadeUp();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "fade-up w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative overflow-hidden",
    style: {
      minHeight: '70vh'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "./images/offer-bg-1200.webp",
    loading: "lazy",
    decoding: "async",
    alt: "",
    className: "absolute inset-0 w-full h-full object-cover z-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-10"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-20 px-6 pt-10 pb-8 min-h-[70vh] flex flex-col justify-between text-left text-white"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-white/60 text-[10px] tracking-widest font-bold mb-3"
  }, "─ ご覧いただいたあなたへ ─"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-black leading-snug mb-5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
  }, "あなたが探していた", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-skin-peach"
  }, "整骨院かもしれません。")), /*#__PURE__*/React.createElement("p", {
    className: "text-white font-bold text-base mb-1 drop-shadow-sm"
  }, "「もっと早く来ればよかった」"), /*#__PURE__*/React.createElement("p", {
    className: "text-white/70 text-sm leading-relaxed mb-6"
  }, "これは多くの患者様からいただく言葉です。"), /*#__PURE__*/React.createElement("p", {
    className: "text-white/90 text-base leading-[2.2] mb-6"
  }, "もしあなたが", /*#__PURE__*/React.createElement("br", null), "何度もマッサージを繰り返し", /*#__PURE__*/React.createElement("br", null), "改善を諦めかけているなら", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-skin-peach font-bold"
  }, "一度だけ当院へお越しください。")), /*#__PURE__*/React.createElement("p", {
    className: "text-white font-black text-xl drop-shadow-md"
  }, "あなたのお身体に、", /*#__PURE__*/React.createElement("br", null), "本気で向き合います。")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 border border-white/30"
  }, "初回体験・特別価格"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-white/60 text-sm line-through"
  }, "通常 7,500円"), /*#__PURE__*/React.createElement(Icon, {
    name: "caret-right",
    className: "text-skin-peach text-sm"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-black text-[52px] tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
  }, "2,980"), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-bold ml-1"
  }, "円"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-white/60 ml-1"
  }, "(税込)")), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-white/40 mt-2"
  }, "※定員に達し次第、通常価格に戻ります。")))), /*#__PURE__*/React.createElement("div", {
    className: "bg-skin-dark px-4 pt-8 pb-10"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-center text-[11px] font-bold tracking-[0.16em] text-skin-peach mb-3"
  }, "＼ 初回特別価格でご予約いただけます ／"), /*#__PURE__*/React.createElement("p", {
    className: "text-center text-[13px] leading-relaxed text-white/75 mb-5"
  }, "ご予約は", /*#__PURE__*/React.createElement("br", null), "LINEから24時間受け付けています。"), /*#__PURE__*/React.createElement(LineCTA, {
    flush: true
  }), /*#__PURE__*/React.createElement("a", {
    href: "tel:070-5530-6656",
    onClick: () => window.trackTel(),
    className: "mt-3 w-full flex items-center justify-center gap-2.5 border border-white/30 text-white rounded-xl py-4 active:scale-[0.97] hover:bg-white/10 transition-all"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone-flip",
    className: "text-base text-skin-peach"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[15px] font-bold tracking-tight"
  }, "電話で予約する"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-white/50"
  }, "070-5530-6656")), /*#__PURE__*/React.createElement("p", {
    className: "mt-5 text-center text-[10px] leading-relaxed text-white/40"
  }, "受付 10:00〜14:00 / 15:00〜20:00（月〜土・祝）\u3000日曜休診", /*#__PURE__*/React.createElement("br", null), "提携駐車場の料金は当院が負担します")));
};

/* ─── Footer ─── */
const Footer = () => /*#__PURE__*/React.createElement("footer", {
  className: "bg-skin-dark text-white/50 py-10 pb-28 text-center text-xs"
}, /*#__PURE__*/React.createElement("h3", {
  className: "text-white/80 text-base mb-3 font-bold tracking-widest"
}, "桜並木駅前の整骨院"), /*#__PURE__*/React.createElement("p", {
  className: "mb-1"
}, "〒812-0888 福岡県福岡市博多区竹丘町２丁目４−１８"), /*#__PURE__*/React.createElement("p", {
  className: "mb-3"
}, "西鉄天神大牟田線「桜並木駅」徒歩1分 / 駐車場完備"), /*#__PURE__*/React.createElement("a", {
  href: "tel:070-5530-6656",
  onClick: () => window.trackTel(),
  className: "inline-block text-skin-peach border border-skin-blush/40 px-4 py-2 rounded-full hover:bg-skin-blush/10 transition text-sm"
}, /*#__PURE__*/React.createElement(Icon, {
    name: "phone-flip",
    className: "mr-2"
  }), "070-5530-6656"), /*#__PURE__*/React.createElement("p", {
  className: "opacity-30 mt-6"
}, "© Sakuranamiki Station Front Chiropractic."));

/* ─── Sticky CTA ─── */
const StickyCTA = () => /*#__PURE__*/React.createElement("div", {
  className: "fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-skin-peach/40 p-2 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] z-[100]"
}, /*#__PURE__*/React.createElement("div", {
  className: "max-w-md mx-auto flex gap-2"
}, /*#__PURE__*/React.createElement("a", {
  href: "tel:070-5530-6656",
  onClick: () => window.trackTel(),
  className: "flex-1 flex items-center justify-center bg-skin-rose text-white rounded-full py-3 shadow-md active:scale-95 transition-all text-[13px] font-bold leading-tight text-center"
}, /*#__PURE__*/React.createElement(Icon, {
    name: "phone-flip",
    className: "text-xl mr-2"
  }), /*#__PURE__*/React.createElement("span", null, "今すぐ電話で", /*#__PURE__*/React.createElement("br", null), "来店予約")), /*#__PURE__*/React.createElement("a", {
  href: "https://lin.ee/uqCRkRL",
  onClick: () => window.trackLead(),
  className: "flex-1 flex items-center justify-center bg-[#06C755] text-white rounded-full py-3 shadow-md active:scale-95 transition-all text-[13px] font-bold leading-tight text-center"
}, /*#__PURE__*/React.createElement(Icon, {
    name: "line",
    className: "text-2xl mr-2"
  }), /*#__PURE__*/React.createElement("span", null, "初回2,980円で", /*#__PURE__*/React.createElement("br", null), "LINE予約"))));

/* ─── App ─── */
const App = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md mx-auto shadow-xl bg-white min-h-screen relative my-0 md:my-8"
  }, /*#__PURE__*/React.createElement(StickyHeader, null), /*#__PURE__*/React.createElement(Headline, null), /*#__PURE__*/React.createElement(EmpathySection, null), /*#__PURE__*/React.createElement(ProblemSection, null), /*#__PURE__*/React.createElement(CauseSection, null), /*#__PURE__*/React.createElement(SolutionSection, null), /*#__PURE__*/React.createElement(BenefitSection, null), /*#__PURE__*/React.createElement(ClinicDifferenceSection, null), /*#__PURE__*/React.createElement(FeatureSection, null), /*#__PURE__*/React.createElement(ComparisonSection, null), /*#__PURE__*/React.createElement(ReviewsSection, null), /*#__PURE__*/React.createElement(QASection, null), /*#__PURE__*/React.createElement(FinalCTA, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(StickyCTA, null));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
