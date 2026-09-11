/* このファイルは index.html 内にあったJSXを事前コンパイルしたものです。
   ブラウザ側で Babel(約2.8MB) を読み込んで毎回変換していたのをやめ、表示速度を優先しています。
   以後の編集はこのファイルを直接触ってください（JSXではなく素のJavaScriptです）。 */
const {
  useState,
  useEffect,
  useRef
} = React;
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
    className: `w-full ${flush ? '' : 'px-4'} ${fired ? 'cta-line-animated' : ''} ${className}`
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
  }, /*#__PURE__*/React.createElement("i", {
    className: "fab fa-line text-4xl drop-shadow-md"
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
  className: "h-8 w-auto"
})), /*#__PURE__*/React.createElement("a", {
  href: "https://maps.app.goo.gl/SVMYspHp6BMLiEwa7",
  target: "_blank",
  rel: "noopener noreferrer",
  onClick: () => window.trackMap(),
  className: "flex items-center gap-1.5 bg-skin-cream text-skin-dark text-xs font-bold px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all border border-skin-blush/50"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-map-marker-alt text-skin-rose"
}), /*#__PURE__*/React.createElement("span", null, "Googleマップで確認"))));

/* ─── ① ヘッドライン（A/Bテスト対象） ─── */
/* パターンは URL の ?v= で決まる。切り替えロジックは <head> のスクリプト側。 */
const HERO_VARIANTS = {
  a: {
    src: './images/hero-ab-a-empathy.webp',
    alt: '「また同じかも…」そう思いながらこのページを見ているあなたへ。何件通っても繰り返した首・肩のつらさに、今度こそ丁寧に向き合います。初回限定2,980円'
  },
  b: {
    src: './images/hero-ab-b-authority.webp',
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
    alt: "こんなお悩みありませんか？",
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
    alt: "そのまま放置しておくと…",
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
    alt: "なぜ、何をしてもコリが戻るのか",
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
    loading: "lazy",
    decoding: "async",
    alt: "院長",
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
    alt: "当院はここが違います",
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
    alt: "こんな未来が待っています！",
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
    alt: "他院との違い",
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
  }, /*#__PURE__*/React.createElement("h4", {
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
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
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
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
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
    className: "border-b border-skin-blush/30"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpenIdx(openIdx === i ? null : i),
    className: "w-full flex items-center justify-between py-4 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-skin-rose font-bold text-base mt-0.5"
  }, "Q"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-bold text-skin-dark leading-relaxed"
  }, item.q)), /*#__PURE__*/React.createElement("i", {
    className: `fas fa-chevron-down text-skin-blush text-[10px] ml-2 flex-shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`
  })), /*#__PURE__*/React.createElement("div", {
    className: `overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-[800px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`
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
  }, "通常 7,500円"), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-caret-right text-skin-peach text-sm"
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
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-phone-alt text-base text-skin-peach"
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
}, /*#__PURE__*/React.createElement("h4", {
  className: "text-white/80 text-base mb-3 font-bold tracking-widest"
}, "桜並木駅前の整骨院"), /*#__PURE__*/React.createElement("p", {
  className: "mb-1"
}, "〒812-0888 福岡県福岡市博多区竹丘町２丁目４−１８"), /*#__PURE__*/React.createElement("p", {
  className: "mb-3"
}, "西鉄天神大牟田線「桜並木駅」徒歩1分 / 駐車場完備"), /*#__PURE__*/React.createElement("a", {
  href: "tel:070-5530-6656",
  onClick: () => window.trackTel(),
  className: "inline-block text-skin-peach border border-skin-blush/40 px-4 py-2 rounded-full hover:bg-skin-blush/10 transition text-sm"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-phone-alt mr-2"
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
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-phone-alt text-xl mr-2"
}), /*#__PURE__*/React.createElement("span", null, "今すぐ電話で", /*#__PURE__*/React.createElement("br", null), "来店予約")), /*#__PURE__*/React.createElement("a", {
  href: "https://lin.ee/uqCRkRL",
  onClick: () => window.trackLead(),
  className: "flex-1 flex items-center justify-center bg-[#06C755] text-white rounded-full py-3 shadow-md active:scale-95 transition-all text-[13px] font-bold leading-tight text-center"
}, /*#__PURE__*/React.createElement("i", {
  className: "fab fa-line text-2xl mr-2"
}), /*#__PURE__*/React.createElement("span", null, "初回2,980円で", /*#__PURE__*/React.createElement("br", null), "LINE予約"))));

/* ─── App ─── */
const App = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md mx-auto shadow-xl bg-white min-h-screen relative my-0 md:my-8"
  }, /*#__PURE__*/React.createElement(StickyHeader, null), /*#__PURE__*/React.createElement(Headline, null), /*#__PURE__*/React.createElement(EmpathySection, null), /*#__PURE__*/React.createElement(ProblemSection, null), /*#__PURE__*/React.createElement(CauseSection, null), /*#__PURE__*/React.createElement(SolutionSection, null), /*#__PURE__*/React.createElement(BenefitSection, null), /*#__PURE__*/React.createElement(ClinicDifferenceSection, null), /*#__PURE__*/React.createElement(ComparisonSection, null), /*#__PURE__*/React.createElement(FeatureSection, null), /*#__PURE__*/React.createElement(ReviewsSection, null), /*#__PURE__*/React.createElement(QASection, null), /*#__PURE__*/React.createElement(FinalCTA, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(StickyCTA, null));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
requestAnimationFrame(() => {
  window.scrollTo(0, 0);
});
