/* compiled from shared.jsx — do not edit; see build-bundlora.js */
;(function(){
// shared.jsx — design tokens, product catalog, icons, SVG product images,
// and a status bar — shared between BundleScreen and StepperScreen.

// ─────────────────────────────────────────────────────────────────────────
// Tokens (brief literal — these map to design tokens in code)
const T = {
  pageBg: '#fafafa',
  cardBg: '#ffffff',
  border: '#e5e7eb',
  borderSoft: '#eeede9',
  imgBg: '#f5f5f5',
  text: '#1f2937',
  muted: '#6b7280',
  dim: '#4b5563',
  accent: '#ff6b35',
  btn: '#18345b',
  btnHover: '#102542',
  btnText: '#ffffff',
  disabledBg: '#e5e7eb',
  disabledText: '#4b5563',
  success: '#047857',
  successSoft: '#ecfdf5',
  badgeBg: '#1f2937',
  badgeText: '#ffffff',
  shadowCard: '0 1px 3px rgba(0,0,0,0.06)',
  shadowTray: '0 -2px 12px rgba(0,0,0,0.08)',
  shadowChip: '0 4px 14px rgba(0,0,0,0.08)',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};

// ─────────────────────────────────────────────────────────────────────────
// Product catalog. Each product has a paired (cardTint, productHue) — the
// card background is a soft warm tint and the SVG silhouette is rendered in
// a darker tone that pops against it. The pairing yields a curated, premium
// look akin to Aesop/Sodii product tiles.
const PRODUCTS = [{
  id: 'tee-pocket',
  vendor: 'Northshore',
  title: 'Essential Pocket Tee',
  subtitle: '100% Pima cotton',
  group: 'Tees',
  price: 14,
  compareAt: 20,
  badge: 'Sale',
  variant: 'Bone · M',
  img: 'tee',
  tint: '#ede4cf',
  hue: '#ffffff',
  edge: '#dccfae'
}, {
  id: 'tee-crew',
  vendor: 'Northshore',
  title: 'Cotton Crew Tee',
  subtitle: 'Soft jersey, fitted',
  group: 'Tees',
  price: 14,
  variant: 'Slate · M',
  img: 'tee',
  tint: '#dde3d4',
  hue: '#27384a',
  edge: '#1c2a39'
}, {
  id: 'hoodie-loop',
  vendor: 'Northshore',
  title: 'Heavy Loop Hoodie',
  subtitle: '500gsm loopback',
  group: 'Hoodies',
  price: 68,
  badge: 'Sold out',
  variant: 'Charcoal · M',
  img: 'hoodie',
  tint: '#d6dae3',
  hue: '#3a3d44',
  edge: '#262a31'
}, {
  id: 'tote',
  vendor: 'Field Day',
  title: 'Canvas Day Tote',
  subtitle: 'Waxed canvas',
  group: 'Accessories',
  price: 44,
  badge: 'Low stock',
  variant: 'Natural',
  img: 'tote',
  tint: '#e9d9bc',
  hue: '#b48f5e',
  edge: '#7b5b35'
}, {
  id: 'beanie',
  vendor: 'Field Day',
  title: 'Ribbed Wool Beanie',
  subtitle: 'Merino wool',
  group: 'Accessories',
  price: 16,
  variant: 'Oat',
  img: 'beanie',
  tint: '#ead2c4',
  hue: '#7a5645',
  edge: '#5a3e2f'
}, {
  id: 'sock',
  vendor: 'Field Day',
  title: 'Trail Sock 3-Pack',
  subtitle: 'Cushioned crew',
  group: 'Accessories',
  price: 18,
  variant: 'Multi · L',
  img: 'sock',
  tint: '#dcdae8',
  hue: '#f3ede0',
  edge: '#c9beac'
}];

// ─────────────────────────────────────────────────────────────────────────
// Product image — flat-lay SVG silhouette per kind, themed by hue/edge so
// each product harmonises with its card tint.
function ProductImage({
  kind,
  hue,
  edge
}) {
  const v = {
    width: '100%',
    height: '100%',
    viewBox: '0 0 200 200'
  };
  switch (kind) {
    case 'tee':
      return /*#__PURE__*/React.createElement("svg", v, /*#__PURE__*/React.createElement("path", {
        d: "M50 62 L78 42 Q100 56 122 42 L150 62 L164 92 L140 104 L140 162 Q140 166 136 166 L64 166 Q60 166 60 162 L60 104 L36 92 Z",
        fill: hue,
        stroke: edge,
        strokeWidth: "1.2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M82 50 Q100 62 118 50",
        fill: "none",
        stroke: edge,
        strokeWidth: "1.4"
      }));
    case 'hoodie':
      return /*#__PURE__*/React.createElement("svg", v, /*#__PURE__*/React.createElement("path", {
        d: "M46 70 L76 46 Q100 36 124 46 L154 70 L168 100 L144 112 L144 164 Q144 168 140 168 L60 168 Q56 168 56 164 L56 112 L32 100 Z",
        fill: hue,
        stroke: edge,
        strokeWidth: "1.2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M76 46 Q100 70 124 46 Q126 70 100 84 Q74 70 76 46 Z",
        fill: edge,
        opacity: "0.55"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "90",
        y1: "80",
        x2: "90",
        y2: "124",
        stroke: edge,
        strokeWidth: "1.2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "110",
        y1: "80",
        x2: "110",
        y2: "124",
        stroke: edge,
        strokeWidth: "1.2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "72",
        y: "124",
        width: "56",
        height: "20",
        rx: "2",
        fill: "none",
        stroke: edge,
        strokeWidth: "1"
      }));
    case 'tote':
      return /*#__PURE__*/React.createElement("svg", v, /*#__PURE__*/React.createElement("path", {
        d: "M68 50 Q68 28 100 28 Q132 28 132 50",
        fill: "none",
        stroke: edge,
        strokeWidth: "3"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "46",
        y: "60",
        width: "108",
        height: "112",
        rx: "3",
        fill: hue,
        stroke: edge,
        strokeWidth: "1.2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "100",
        y1: "78",
        x2: "100",
        y2: "94",
        stroke: edge,
        strokeWidth: "1"
      }));
    case 'beanie':
      return /*#__PURE__*/React.createElement("svg", v, /*#__PURE__*/React.createElement("path", {
        d: "M52 134 Q52 68 100 68 Q148 68 148 134 Z",
        fill: hue,
        stroke: edge,
        strokeWidth: "1.2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "48",
        y: "132",
        width: "104",
        height: "22",
        rx: "2",
        fill: edge,
        opacity: "0.85"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "72",
        y1: "78",
        x2: "72",
        y2: "132",
        stroke: edge,
        strokeWidth: "0.9",
        opacity: "0.6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "100",
        y1: "72",
        x2: "100",
        y2: "132",
        stroke: edge,
        strokeWidth: "0.9",
        opacity: "0.6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "128",
        y1: "78",
        x2: "128",
        y2: "132",
        stroke: edge,
        strokeWidth: "0.9",
        opacity: "0.6"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "100",
        cy: "66",
        r: "6",
        fill: edge
      }));
    case 'sock':
      return /*#__PURE__*/React.createElement("svg", v, /*#__PURE__*/React.createElement("path", {
        d: "M76 36 L76 100 Q76 110 68 118 L48 138 Q40 146 48 154 L68 170 Q76 176 86 170 L120 138 Q130 130 130 118 L130 36 Z",
        fill: hue,
        stroke: edge,
        strokeWidth: "1.2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "76",
        y: "36",
        width: "54",
        height: "14",
        fill: edge,
        opacity: "0.85"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "76",
        y1: "60",
        x2: "130",
        y2: "60",
        stroke: edge,
        strokeWidth: "0.8",
        opacity: "0.4"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "76",
        y1: "72",
        x2: "130",
        y2: "72",
        stroke: edge,
        strokeWidth: "0.8",
        opacity: "0.4"
      }));
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Icons (minimal stroke, system-feel)
const Icon = {
  ChevronUp: ({
    s = 18,
    c = T.text
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "18 15 12 9 6 15"
  })),
  ChevronDown: ({
    s = 18,
    c = T.text
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })),
  Plus: ({
    s = 16,
    c = T.btnText
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })),
  Minus: ({
    s = 16,
    c = T.btnText
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })),
  X: ({
    s = 12,
    c = T.text
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  })),
  Search: ({
    s = 20,
    c = T.text
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.5",
    y2: "16.5"
  })),
  Menu: ({
    s = 20,
    c = T.text
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "7",
    x2: "21",
    y2: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "13",
    x2: "15",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "19",
    x2: "21",
    y2: "19"
  })),
  Bag: ({
    s = 20,
    c = T.text
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 8 H18 L17 20 H7 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8 V6 a3 3 0 0 1 6 0 V8"
  })),
  Account: ({
    s = 20,
    c = T.text
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "9",
    r: "3.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 20 Q12 14 19 20"
  }))
};

// ─────────────────────────────────────────────────────────────────────────
// iOS status bar
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      fontFamily: T.font,
      fontWeight: 600,
      fontSize: 15,
      color: T.text
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "11",
    viewBox: "0 0 18 11",
    fill: T.text
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7",
    width: "3",
    height: "4",
    rx: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "5",
    width: "3",
    height: "6",
    rx: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "2",
    width: "3",
    height: "9",
    rx: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "0",
    width: "3",
    height: "11",
    rx: "0.5"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "11",
    viewBox: "0 0 16 11",
    fill: T.text
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 11 L10 8.5 Q8 7 6 8.5 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 6.2 Q8 2.5 12.5 6.2 L11 7.8 Q8 5 5 7.8 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0.5 3.4 Q8 -2.5 15.5 3.4 L14 5 Q8 0 2 5 Z"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "12",
    viewBox: "0 0 26 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "22",
    height: "11",
    rx: "2.5",
    stroke: T.text,
    opacity: "0.4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "19",
    height: "8",
    rx: "1.5",
    fill: T.text
  }), /*#__PURE__*/React.createElement("rect", {
    x: "23.5",
    y: "4",
    width: "1.5",
    height: "4",
    rx: "0.6",
    fill: T.text,
    opacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────────────────
// Phone home indicator
function HomeIndicator() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 134,
      height: 5,
      background: T.text,
      borderRadius: 99,
      margin: '0 auto',
      opacity: 0.9
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Storefront top nav (hamburger / brand / account+bag)
function TopNav({
  cartCount = 0,
  brand = 'Northshore'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 48,
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      borderBottom: `1px solid ${T.borderSoft}`
    }
  }, /*#__PURE__*/React.createElement(Icon.Menu, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: T.font,
      fontSize: 17,
      fontWeight: 700,
      color: T.text,
      letterSpacing: '-0.005em'
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon.Account, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Icon.Bag, null), cartCount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -4,
      right: -6,
      minWidth: 16,
      height: 16,
      padding: '0 4px',
      borderRadius: 99,
      background: T.btn,
      color: T.btnText,
      fontSize: 10,
      fontWeight: 700,
      fontFamily: T.font,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }
  }, cartCount))));
}
Object.assign(window, {
  T,
  PRODUCTS,
  ProductImage,
  Icon,
  StatusBar,
  HomeIndicator,
  TopNav
});
})();
