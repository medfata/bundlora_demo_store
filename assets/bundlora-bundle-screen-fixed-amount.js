/* compiled from bundle-screen-fixed-amount.jsx — do not edit; see build-bundlora.js */
;(function(){
// bundle-screen-fixed-amount.jsx — Bundle Builder, FIXED_AMOUNT + AMOUNT variant.
// "Spend $X get $Y off" — flat $ off subtotal, tiered by $ spend.
//
// Key UI departures from the PERCENTAGE + QUANTITY variant:
//   - Tier pills replaced by a single milestone progress bar with 4 markers.
//     (Money is continuous; a continuous bar fits the AMOUNT condition better
//     than discrete pills.)
//   - Markers unlock as subtotal crosses each $ threshold.
//   - Progress copy is "$"-denominated ("Spend $X more for $Y off").
//   - CTA savings pill shows a flat "−$10" instead of "10% off".

const {
  useState,
  useMemo,
  useCallback
} = React;
const {
  T,
  PRODUCTS,
  ProductImage,
  Icon,
  StatusBar,
  HomeIndicator,
  TopNav,
  TabStrip,
  ProductGrid,
  CountChip,
  FreeShipBar
} = window;
const AMOUNT_TIERS = [{
  spend: 30,
  off: 5
}, {
  spend: 50,
  off: 10
}, {
  spend: 80,
  off: 20
}, {
  spend: 120,
  off: 35
}];
const FA_FREE_SHIP_AT = 3;

// ─────────────────────────────────────────────────────────────────────────
// Milestone progress bar — bold, modern, tiers labelled INSIDE the track.
//
// Layout:
//   ┌──────────┬──────────┬──────────┬──────────┐
//   │  $5 off  │  $10 off │  $20 off │  $35 off │
//   │   $30    │   $50    │   $80    │   $120   │
//   └──────────┴──────────┴──────────┴──────────┘
//      ←─── fill grows L→R as subtotal increases ───→
//
// Equal-width segments (one per tier). Fill grows proportionally THROUGH
// each segment, then snaps to the next segment when its threshold is met.
// Two text layers (muted base + white duplicate clipped by inset()) give
// crisp text-on-fill colour flip at the exact fill edge.
function MilestoneBar({
  subtotal,
  tiers
}) {
  const segCount = tiers.length;

  // Segment-indexed fill: each segment is 1/N of the bar; we interpolate
  // linearly between consecutive thresholds.
  let fillPct = 0;
  for (let i = 0; i < segCount; i++) {
    const prev = i === 0 ? 0 : tiers[i - 1].spend;
    const cur = tiers[i].spend;
    if (subtotal >= cur) {
      fillPct = (i + 1) / segCount * 100;
    } else if (subtotal > prev) {
      fillPct = (i + (subtotal - prev) / (cur - prev)) / segCount * 100;
      break;
    } else {
      break;
    }
  }
  fillPct = Math.max(0, Math.min(100, fillPct));
  const maxed = subtotal >= tiers[tiers.length - 1].spend;

  // Identical content rendered twice — once muted under the fill, once
  // white on top, clip-pathed to the fill width. Result: text flips colour
  // exactly at the fill boundary, even mid-segment.
  const segments = (color, weight) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      gridTemplateColumns: `repeat(${segCount}, 1fr)`,
      pointerEvents: 'none'
    }
  }, tiers.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      lineHeight: 1,
      // Subtle vertical divider on the base layer only; the fill
      // overlay covers them where unlocked, which reads naturally.
      borderRight: color === T.muted && i < segCount - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: weight,
      color,
      letterSpacing: '-0.01em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$", t.off, " off"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color,
      opacity: color === '#fff' ? 0.7 : 0.55,
      letterSpacing: '0.06em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$", t.spend, "+"))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 2px',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 56,
      borderRadius: 14,
      background: '#f3efe6',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04), inset 0 1px 2px rgba(0,0,0,0.04)'
    }
  }, segments(T.muted, 800), /*#__PURE__*/React.createElement("div", {
    className: "bb-progress-fill",
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: `${fillPct}%`,
      background: maxed ? `linear-gradient(90deg, ${T.btn} 0%, #1f4878 100%)` : T.btn,
      boxShadow: maxed ? '0 0 0 0 transparent' : 'inset -1px 0 0 rgba(255,255,255,0.04)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      clipPath: `inset(0 ${100 - fillPct}% 0 0)`,
      WebkitClipPath: `inset(0 ${100 - fillPct}% 0 0)`,
      transition: 'clip-path .45s cubic-bezier(.2,.7,.3,1), -webkit-clip-path .45s cubic-bezier(.2,.7,.3,1)'
    }
  }, segments('#fff', 800)), fillPct > 0 && fillPct < 100 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 6,
      bottom: 6,
      left: `${fillPct}%`,
      width: 2,
      transform: 'translateX(-1px)',
      borderRadius: 99,
      background: T.accent,
      boxShadow: '0 0 8px rgba(255,107,53,0.55)',
      transition: 'left .45s cubic-bezier(.2,.7,.3,1)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────────────────
function FixedAmountTray({
  expanded,
  setExpanded,
  cart,
  removeItem
}) {
  const items = useMemo(() => Object.entries(cart).map(([id, qty]) => ({
    p: PRODUCTS.find(x => x.id === id),
    qty
  })).filter(r => r.p && r.qty > 0), [cart]);
  const count = items.reduce((s, r) => s + r.qty, 0);
  const subtotal = items.reduce((s, r) => s + r.p.price * r.qty, 0);

  // Active tier = highest one whose spend threshold is satisfied.
  let active = null;
  for (const t of AMOUNT_TIERS) if (subtotal >= t.spend) active = t;
  const next = AMOUNT_TIERS.find(t => subtotal < t.spend);
  const discount = active ? active.off : 0;
  const total = Math.max(0, subtotal - discount);
  const ctaEnabled = count > 0;
  let progressMsg = null;
  if (next) {
    const delta = next.spend - subtotal;
    progressMsg = `Spend $${delta.toFixed(2)} more for $${next.off} off`;
  } else if (active) {
    progressMsg = `Maximum saving — $${active.off} off your bundle`;
  }
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
      maxHeight: expanded ? 480 : 0,
      opacity: expanded ? 1 : 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: 4,
      marginBottom: 14,
      paddingLeft: 2,
      paddingRight: 2
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: T.accent,
      marginBottom: 2
    }
  }, "Spend & save"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: T.btn,
      letterSpacing: '-0.02em',
      lineHeight: 1.05
    }
  }, "Bundle Builder")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: T.text,
      letterSpacing: '-0.005em',
      fontVariantNumeric: 'tabular-nums',
      paddingBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: subtotal > 0 ? T.accent : T.text
    }
  }, "$", subtotal.toFixed(0)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.muted,
      fontWeight: 600
    }
  }, ' ', "/ $", AMOUNT_TIERS[AMOUNT_TIERS.length - 1].spend))), /*#__PURE__*/React.createElement(MilestoneBar, {
    subtotal: subtotal,
    tiers: AMOUNT_TIERS
  }), items.length > 0 ? /*#__PURE__*/React.createElement("div", {
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
      fontSize: 18
    }
  }, "+"))), /*#__PURE__*/React.createElement(FreeShipBar, {
    count: count,
    threshold: FA_FREE_SHIP_AT
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
      marginLeft: 2,
      letterSpacing: '-0.005em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "\u2212$", discount)))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement(HomeIndicator, null)));
}

// ─────────────────────────────────────────────────────────────────────────
function BundleScreenFixedAmount({
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
  const trayPad = expanded ? 500 : 150;
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
  }))), /*#__PURE__*/React.createElement(FixedAmountTray, {
    expanded: expanded,
    setExpanded: setExpanded,
    cart: cart,
    removeItem: removeItem
  }));
}
Object.assign(window, {
  BundleScreenFixedAmount
});
})();
