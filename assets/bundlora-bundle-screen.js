/* compiled from bundle-screen.jsx — do not edit; see build-bundlora.js */
;(function(){
// bundle-screen.jsx — Production-ready interactive bundle builder
// (375×812 mobile). Each artboard is a self-contained working prototype:
//   - tap a card's + to add, − to decrement, the chip to toggle the tray
//   - the × on a thumbnail removes; tier pill and CTA strikethrough update live
//   - free-shipping progress bar fills as items accumulate

const {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect
} = React;
const {
  T,
  PRODUCTS,
  ProductImage,
  Icon,
  StatusBar,
  HomeIndicator,
  TopNav
} = window;
const TIERS = [{
  qty: 2,
  pct: 5
}, {
  qty: 3,
  pct: 10
}, {
  qty: 4,
  pct: 15
}, {
  qty: 5,
  pct: 20
}];
const FREE_SHIP_AT = 3;

// ─────────────────────────────────────────────────────────────────────────
// One-time CSS injection — transitions, focus rings, hover states.
if (typeof document !== 'undefined' && !document.getElementById('bb-styles')) {
  const s = document.createElement('style');
  s.id = 'bb-styles';
  s.textContent = `
    .bb-press{transition:transform .12s cubic-bezier(.2,.7,.3,1),background .15s,box-shadow .15s,border-color .15s,color .15s}
    .bb-press:active{transform:scale(0.96)}
    .bb-press:hover{filter:brightness(1.05)}
    .bb-card-image{transition:box-shadow .2s cubic-bezier(.2,.7,.3,1)}
    .bb-tray-content{transition:max-height .35s cubic-bezier(.2,.7,.3,1),opacity .25s ease}
    .bb-thumb{transition:transform .25s cubic-bezier(.2,.7,.3,1),opacity .25s ease}
    .bb-thumb-enter{transform:scale(.6);opacity:0}
    .bb-thumb-enter-active{transform:scale(1);opacity:1}
    .bb-progress-fill{transition:width .45s cubic-bezier(.2,.7,.3,1)}
    .bb-chip{transition:transform .2s cubic-bezier(.2,.7,.3,1),box-shadow .2s}
    .bb-chip:hover{transform:translateX(-50%) translateY(-1px)}
    .bb-tier-pill{transition:background .2s,color .2s,border-color .2s,transform .15s}
    .bb-tier-pill:active{transform:scale(0.97)}
    .bb-cta-savings{animation:bbSavingsIn .35s cubic-bezier(.2,.7,.3,1) both}
    @keyframes bbSavingsIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
    .bb-grid-scroll::-webkit-scrollbar{display:none}
    .bb-grid-scroll{scrollbar-width:none}
    /* Reset native button defaults inside the prototype */
    .bb-root button{font-family:inherit;letter-spacing:inherit}
    .bb-root button:focus-visible{outline:2px solid ${T.accent};outline-offset:2px}
  `;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────────────────
// Tab strip
function TabStrip({
  active = 'All',
  onChange
}) {
  const tabs = ['All', 'Tees', 'Hoodies', 'Accessories'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      padding: '18px 20px 14px 20px',
      overflowX: 'auto'
    },
    className: "bb-grid-scroll"
  }, tabs.map(g => {
    const isActive = g === active;
    return /*#__PURE__*/React.createElement("button", {
      key: g,
      onClick: () => onChange && onChange(g),
      className: "bb-press",
      style: {
        border: 'none',
        background: 'transparent',
        padding: 0,
        fontSize: 15,
        color: isActive ? T.text : T.muted,
        fontWeight: isActive ? 700 : 400,
        whiteSpace: 'nowrap',
        letterSpacing: '-0.005em',
        cursor: 'pointer'
      }
    }, g);
  }));
}

// ─────────────────────────────────────────────────────────────────────────
// Product card
function ProductCard({
  p,
  qty,
  onAdd,
  onSub
}) {
  const selected = qty > 0;
  const soldOut = p.badge === 'Sold out';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      opacity: soldOut ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bb-card-image",
    style: {
      background: p.tint,
      borderRadius: 16,
      aspectRatio: '1 / 1',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: selected ? `inset 0 0 0 1.5px ${T.accent}` : 'inset 0 0 0 1px rgba(0,0,0,0.02)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '78%',
      height: '78%'
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    kind: p.img,
    hue: p.hue,
    edge: p.edge
  })), p.badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      background: T.badgeBg,
      color: T.badgeText,
      fontSize: 10.5,
      fontWeight: 600,
      padding: '4px 8px',
      borderRadius: 99,
      letterSpacing: '0.01em'
    }
  }, p.badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '2px 2px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text,
      lineHeight: 1.25,
      letterSpacing: '-0.005em',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, p.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.muted,
      lineHeight: 1.3,
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, p.subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      minHeight: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text
    }
  }, "$", p.price, ".00"), p.compareAt && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 400,
      color: T.muted,
      textDecoration: 'line-through'
    }
  }, "$", p.compareAt, ".00")), selected ? /*#__PURE__*/React.createElement(Stepper, {
    qty: qty,
    onAdd: onAdd,
    onSub: onSub
  }) : /*#__PURE__*/React.createElement(AddButton, {
    disabled: soldOut,
    onClick: onAdd
  }))));
}
function AddButton({
  disabled,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    "aria-label": "Add",
    className: "bb-press",
    style: {
      width: 36,
      height: 36,
      borderRadius: 99,
      border: 'none',
      background: disabled ? T.disabledBg : T.btn,
      color: disabled ? T.disabledText : T.btnText,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Icon.Plus, {
    c: disabled ? T.disabledText : T.btnText
  }));
}
function Stepper({
  qty,
  onAdd,
  onSub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 36,
      borderRadius: 99,
      background: T.btn,
      color: T.btnText,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px',
      gap: 2,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Decrease",
    onClick: onSub,
    className: "bb-press",
    style: {
      width: 28,
      height: 28,
      border: 'none',
      background: 'transparent',
      color: T.btnText,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0,
      borderRadius: 99
    }
  }, /*#__PURE__*/React.createElement(Icon.Minus, {
    c: T.btnText
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 20,
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 700
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Increase",
    onClick: onAdd,
    className: "bb-press",
    style: {
      width: 28,
      height: 28,
      border: 'none',
      background: 'transparent',
      color: T.btnText,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0,
      borderRadius: 99
    }
  }, /*#__PURE__*/React.createElement(Icon.Plus, {
    c: T.btnText
  })));
}

// ─────────────────────────────────────────────────────────────────────────
function ProductGrid({
  cart,
  addItem,
  subItem
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 22,
      padding: '0 20px 20px 20px'
    }
  }, PRODUCTS.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    p: p,
    qty: cart[p.id] || 0,
    onAdd: () => addItem(p.id),
    onSub: () => subItem(p.id)
  })));
}

// ─────────────────────────────────────────────────────────────────────────
function CountChip({
  count,
  expanded,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: "bb-chip bb-press",
    "aria-label": expanded ? 'Collapse bundle' : 'Expand bundle',
    style: {
      position: 'absolute',
      left: '50%',
      top: -18,
      transform: 'translateX(-50%)',
      background: T.cardBg,
      borderRadius: 99,
      padding: '7px 14px 7px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: T.font,
      fontSize: 13,
      fontWeight: 700,
      color: T.text,
      boxShadow: '0 6px 18px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)',
      border: 'none',
      cursor: 'pointer',
      zIndex: 2
    }
  }, expanded ? /*#__PURE__*/React.createElement(Icon.ChevronDown, {
    s: 14,
    c: T.text
  }) : /*#__PURE__*/React.createElement(Icon.ChevronUp, {
    s: 14,
    c: T.text
  }), /*#__PURE__*/React.createElement("span", null, count));
}

// ─────────────────────────────────────────────────────────────────────────
// Free-shipping progress bar — replaces the basic "unlocked" pill.
// Single bar that fills as items accumulate; truck icon nudges left→right.
function FreeShipBar({
  count,
  threshold = FREE_SHIP_AT
}) {
  const ratio = Math.min(1, count / threshold);
  const unlocked = count >= threshold;
  const remaining = Math.max(0, threshold - count);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: unlocked ? T.successSoft : '#f7f5ef',
      borderRadius: 12,
      padding: '12px 14px 11px 14px',
      marginBottom: 14,
      border: `1px solid ${unlocked ? '#cdebe0' : '#ecead9'}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(TruckIcon, {
    c: unlocked ? T.success : T.dim
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: unlocked ? T.success : T.text,
      letterSpacing: '-0.005em'
    }
  }, unlocked ? 'Free shipping included' : `Add ${remaining} more for free shipping`)), unlocked && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 99,
      background: T.success,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "5 12 10 17 19 7"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 4,
      borderRadius: 99,
      background: unlocked ? 'rgba(4,120,87,0.18)' : 'rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bb-progress-fill",
    style: {
      position: 'absolute',
      inset: 0,
      width: `${ratio * 100}%`,
      background: unlocked ? T.success : T.btn,
      borderRadius: 99
    }
  })));
}
function TruckIcon({
  s = 16,
  c = T.text
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 8 h11 v9 H2 z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 11 h5 l3 3 v3 h-8 z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "18.5",
    r: "1.7",
    fill: c,
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "18.5",
    r: "1.7",
    fill: c,
    stroke: "none"
  }));
}

// ─────────────────────────────────────────────────────────────────────────
function Tray({
  expanded,
  setExpanded,
  cart,
  addItem,
  subItem,
  removeItem
}) {
  const items = useMemo(() => Object.entries(cart).map(([id, qty]) => ({
    p: PRODUCTS.find(x => x.id === id),
    qty
  })).filter(r => r.p && r.qty > 0), [cart]);
  const count = items.reduce((s, r) => s + r.qty, 0);
  const subtotal = items.reduce((s, r) => s + r.p.price * r.qty, 0);
  let active = null;
  for (const t of TIERS) if (count >= t.qty) active = t;
  const next = TIERS.find(t => count < t.qty);
  const discount = active ? +(subtotal * (active.pct / 100)).toFixed(2) : 0;
  const total = +(subtotal - discount).toFixed(2);
  const ctaEnabled = count > 0;
  let progressMsg = null;
  if (next) {
    const delta = next.qty - count;
    progressMsg = `Add ${delta} more for ${next.pct}% off`;
  } else if (active) {
    progressMsg = `Maximum saving — ${active.pct}% off your bundle`;
  }

  // Smooth expand/collapse: render expanded contents in a wrapper that
  // animates max-height + opacity. Generous max so any cart size fits.
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: T.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      boxShadow: '0 -10px 40px rgba(0,0,0,0.10), 0 -2px 8px rgba(0,0,0,0.04)',
      padding: '20px 20px 14px 20px',
      fontFamily: T.font
    }
  }, /*#__PURE__*/React.createElement(CountChip, {
    count: count,
    expanded: expanded,
    onClick: () => setExpanded(!expanded)
  }), progressMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 700,
      color: active ? T.success : T.text,
      marginBottom: expanded ? 8 : 12,
      letterSpacing: '-0.005em'
    }
  }, progressMsg), /*#__PURE__*/React.createElement("div", {
    className: "bb-tray-content",
    style: {
      maxHeight: expanded ? 460 : 0,
      opacity: expanded ? 1 : 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 700,
      color: T.btn,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      marginTop: 4,
      marginBottom: 14
    }
  }, "Bundle Builder"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 14
    }
  }, TIERS.map(t => {
    const isActive = active && active.qty === t.qty;
    return /*#__PURE__*/React.createElement("div", {
      key: t.qty,
      className: "bb-tier-pill",
      style: {
        flex: '1 1 0',
        minWidth: 0,
        height: 52,
        borderRadius: 12,
        background: isActive ? T.btn : T.cardBg,
        border: isActive ? `1px solid ${T.btn}` : `1px solid ${T.border}`,
        color: isActive ? T.btnText : T.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '-0.005em'
      }
    }, "Box of ", t.qty), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        marginTop: 2,
        color: isActive ? 'rgba(255,255,255,0.75)' : T.muted
      }
    }, "Save ", t.pct, "%"));
  })), items.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bb-grid-scroll",
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 14,
      overflowX: 'auto',
      paddingTop: 6,
      paddingBottom: 4
    }
  }, items.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.p.id,
    className: "bb-thumb",
    style: {
      width: 54,
      height: 54,
      flex: '0 0 54px',
      borderRadius: 12,
      background: r.p.tint,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '78%',
      height: '78%'
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    kind: r.p.img,
    hue: r.p.hue,
    edge: r.p.edge
  })), r.qty > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      padding: '0 5px',
      borderRadius: 99,
      background: T.btn,
      color: T.btnText,
      fontSize: 10,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      border: `1.5px solid ${T.cardBg}`
    }
  }, "\xD7", r.qty), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Remove",
    onClick: () => removeItem(r.p.id),
    className: "bb-press",
    style: {
      position: 'absolute',
      top: -6,
      left: -6,
      width: 20,
      height: 20,
      borderRadius: 99,
      background: T.cardBg,
      border: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
    }
  }, /*#__PURE__*/React.createElement(Icon.X, {
    s: 10,
    c: T.muted
  }))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 14,
      paddingTop: 4,
      paddingBottom: 2
    }
  }, [0, 1].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 54,
      height: 54,
      borderRadius: 12,
      border: `1.5px dashed ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: T.muted,
      fontSize: 18,
      fontWeight: 400
    }
  }, "+"))), /*#__PURE__*/React.createElement(FreeShipBar, {
    count: count
  })), /*#__PURE__*/React.createElement("button", {
    disabled: !ctaEnabled,
    className: "bb-press",
    style: {
      width: '100%',
      height: 52,
      borderRadius: 99,
      border: 'none',
      background: ctaEnabled ? T.btn : T.disabledBg,
      color: ctaEnabled ? T.btnText : T.disabledText,
      fontSize: 14,
      fontWeight: 700,
      fontFamily: T.font,
      cursor: ctaEnabled ? 'pointer' : 'not-allowed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '0 16px',
      letterSpacing: '-0.005em'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Add To Cart"), ctaEnabled && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.55
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "$", total.toFixed(2)), discount > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.55,
      fontWeight: 400,
      textDecoration: 'line-through'
    }
  }, "$", subtotal.toFixed(2)), /*#__PURE__*/React.createElement("span", {
    className: "bb-cta-savings",
    style: {
      background: T.accent,
      color: T.btnText,
      fontSize: 11,
      fontWeight: 700,
      padding: '3px 7px',
      borderRadius: 99,
      marginLeft: 2
    }
  }, active.pct, "% off")))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement(HomeIndicator, null)));
}

// ─────────────────────────────────────────────────────────────────────────
// Top-level interactive screen.
// `initialCart` and `initialExpanded` seed each artboard's local state.
function BundleScreen({
  initialCart = {},
  initialExpanded = false
}) {
  const [cart, setCart] = useState(initialCart);
  const [expanded, setExpanded] = useState(initialExpanded);
  const addItem = useCallback(id => {
    setCart(c => ({
      ...c,
      [id]: (c[id] || 0) + 1
    }));
  }, []);
  const subItem = useCallback(id => {
    setCart(c => {
      const cur = c[id] || 0;
      if (cur <= 1) {
        const next = {
          ...c
        };
        delete next[id];
        return next;
      }
      return {
        ...c,
        [id]: cur - 1
      };
    });
  }, []);
  const removeItem = useCallback(id => {
    setCart(c => {
      const next = {
        ...c
      };
      delete next[id];
      return next;
    });
  }, []);
  const count = Object.values(cart).reduce((s, n) => s + n, 0);

  // Approx tray pad reserves space below grid so content isn't hidden.
  const trayPad = expanded ? 460 : 150;

  // Cart count in the top-nav bag (distinct from bundle count: shows whether
  // the user has anything in the running bundle).
  const bagCount = count > 0 ? 1 : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "bb-root",
    style: {
      width: 375,
      height: 812,
      background: T.pageBg,
      fontFamily: T.font,
      color: T.text,
      position: 'relative',
      overflow: 'hidden',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(TopNav, {
    brand: "bundlora",
    cartCount: bagCount
  }), /*#__PURE__*/React.createElement("div", {
    className: "bb-grid-scroll",
    style: {
      flex: '1 1 auto',
      overflowY: 'auto',
      paddingBottom: trayPad,
      transition: 'padding-bottom .35s cubic-bezier(.2,.7,.3,1)'
    }
  }, /*#__PURE__*/React.createElement(TabStrip, {
    active: "All"
  }), /*#__PURE__*/React.createElement(ProductGrid, {
    cart: cart,
    addItem: addItem,
    subItem: subItem
  }))), /*#__PURE__*/React.createElement(Tray, {
    expanded: expanded,
    setExpanded: setExpanded,
    cart: cart,
    addItem: addItem,
    subItem: subItem,
    removeItem: removeItem
  }));
}
Object.assign(window, {
  BundleScreen,
  // Shared building blocks for variant screens (BOGO, FIXED_PRICE, etc.)
  TabStrip,
  ProductGrid,
  ProductCard,
  AddButton,
  Stepper,
  CountChip,
  FreeShipBar,
  TruckIcon
});
})();
