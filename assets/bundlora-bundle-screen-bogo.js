/* compiled from bundle-screen-bogo.jsx — do not edit; see build-bundlora.js */
;(function(){
// bundle-screen-bogo.jsx — Bundle Builder, BOGO variant.
// "Buy 1, Get 1 Free" — every 2nd unit (the cheapest in each pair) is free.
//
// Key UI departures from the tiered % variant:
//   - No tier pills (single offer, no qty steps)
//   - Pair slot grid in the tray: [paid] + [free] visualises the mechanic
//   - Thumbs render at unit level so FREE applies to a specific unit
//   - Progress message swings by parity (odd → "add 1 more")
//   - CTA shows struck subtotal + "BOGO" pill instead of "% off"

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
const BOGO_FREE_SHIP_AT = 3;

// ─────────────────────────────────────────────────────────────────────────
// BOGO compute: explode cart to a unit list sorted by price desc, then
// every 2nd unit (index 1, 3, …) is free. Returns paired units + totals.
function computeBogo(items) {
  const units = [];
  items.forEach(({
    p,
    qty
  }) => {
    for (let i = 0; i < qty; i++) units.push(p);
  });
  // Price desc so the cheapest unit in each pair gets discounted.
  units.sort((a, b) => b.price - a.price);
  let subtotal = 0,
    discount = 0;
  const pairs = []; // [{ paid: product, free: product | null }]
  for (let i = 0; i < units.length; i += 2) {
    const paid = units[i];
    const free = units[i + 1] || null;
    subtotal += paid.price + (free ? free.price : 0);
    if (free) discount += free.price;
    pairs.push({
      paid,
      free
    });
  }
  // Ensure there's always one trailing "next pair" slot when count is even
  // and >0 — visual cue that adding 2 more unlocks another free.
  return {
    units,
    pairs,
    subtotal,
    discount,
    total: subtotal - discount,
    freeCount: Math.floor(units.length / 2),
    nextFreeIn: units.length === 0 ? 2 : units.length % 2 === 1 ? 1 : 2
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Single slot (mini thumbnail) used inside a pair.
function PairSlot({
  p,
  free,
  placeholder,
  onRemove
}) {
  if (placeholder) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 50,
        height: 50,
        borderRadius: 10,
        border: `1.5px dashed ${free ? T.accent : T.border}`,
        background: free ? 'rgba(255,107,53,0.05)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: free ? 9 : 18,
        fontWeight: free ? 700 : 400,
        letterSpacing: free ? '0.04em' : '0',
        color: free ? T.accent : T.muted,
        flex: '0 0 auto'
      }
    }, free ? 'FREE' : '+');
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 50,
      height: 50,
      borderRadius: 10,
      background: p.tint,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      boxShadow: free ? `inset 0 0 0 1.5px ${T.accent}` : 'inset 0 0 0 1px rgba(0,0,0,0.03)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '78%',
      height: '78%',
      opacity: free ? 0.92 : 1
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    kind: p.img,
    hue: p.hue,
    edge: p.edge
  })), free && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -5,
      left: '50%',
      transform: 'translateX(-50%)',
      background: T.accent,
      color: '#fff',
      fontSize: 8.5,
      fontWeight: 700,
      letterSpacing: '0.04em',
      padding: '2px 6px',
      borderRadius: 99,
      whiteSpace: 'nowrap',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    }
  }, "FREE"), onRemove && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Remove",
    onClick: onRemove,
    className: "bb-press",
    style: {
      position: 'absolute',
      top: -6,
      right: -6,
      width: 18,
      height: 18,
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
    s: 9,
    c: T.muted
  })));
}

// "+" joiner between the two slots of a pair.
function PairJoiner() {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      width: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: T.muted,
      fontSize: 14,
      fontWeight: 400,
      opacity: 0.7,
      flex: '0 0 auto'
    }
  }, "+");
}

// ─────────────────────────────────────────────────────────────────────────
// Pair grid: horizontally scrollable strip of [paid + free] pairs.
// When odd count, the trailing pair has a "FREE" placeholder.
// When even (incl. zero), we append one ghost pair as a forward-looking hint.
function PairStrip({
  pairs,
  units,
  onRemoveUnit
}) {
  const empty = pairs.length === 0;
  const trailingHint = empty || units.length % 2 === 0; // append ghost pair?

  return /*#__PURE__*/React.createElement("div", {
    className: "bb-grid-scroll",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      overflowX: 'auto',
      paddingTop: 4,
      paddingBottom: 12,
      // room for FREE badge
      marginBottom: 4
    }
  }, pairs.map((pair, pi) => /*#__PURE__*/React.createElement("div", {
    key: pi,
    style: {
      display: 'flex',
      alignItems: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(PairSlot, {
    p: pair.paid,
    onRemove: onRemoveUnit ? () => onRemoveUnit(pair.paid.id) : null
  }), /*#__PURE__*/React.createElement(PairJoiner, null), pair.free ? /*#__PURE__*/React.createElement(PairSlot, {
    p: pair.free,
    free: true,
    onRemove: onRemoveUnit ? () => onRemoveUnit(pair.free.id) : null
  }) : /*#__PURE__*/React.createElement(PairSlot, {
    placeholder: true,
    free: true
  }))), trailingHint && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flex: '0 0 auto',
      opacity: empty ? 1 : 0.5
    }
  }, /*#__PURE__*/React.createElement(PairSlot, {
    placeholder: true
  }), /*#__PURE__*/React.createElement(PairJoiner, null), /*#__PURE__*/React.createElement(PairSlot, {
    placeholder: true,
    free: true
  })));
}

// ─────────────────────────────────────────────────────────────────────────
// BOGO tray.
function BogoTray({
  expanded,
  setExpanded,
  cart,
  removeUnit
}) {
  const items = useMemo(() => Object.entries(cart).map(([id, qty]) => ({
    p: PRODUCTS.find(x => x.id === id),
    qty
  })).filter(r => r.p && r.qty > 0), [cart]);
  const {
    units,
    pairs,
    subtotal,
    discount,
    total,
    freeCount
  } = useMemo(() => computeBogo(items), [items]);
  const count = units.length;
  const ctaEnabled = count > 0;

  // Parity-driven progress copy.
  let progressMsg, progressTone;
  if (count === 0) {
    progressMsg = 'Pick 2 items — one is on us';
    progressTone = 'neutral';
  } else if (count % 2 === 1) {
    progressMsg = 'Add 1 more — get it free';
    progressTone = 'neutral';
  } else {
    progressMsg = freeCount === 1 ? '1 free item unlocked' : `${freeCount} free items unlocked`;
    progressTone = 'success';
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
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 700,
      color: progressTone === 'success' ? T.success : T.text,
      marginBottom: expanded ? 14 : 12,
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: 2,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: T.accent,
      marginBottom: 4
    }
  }, "Limited offer"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      color: T.btn,
      letterSpacing: '-0.02em',
      lineHeight: 1.05
    }
  }, "Buy 1, Get 1 Free"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.muted,
      marginTop: 4,
      letterSpacing: '-0.005em'
    }
  }, "Lowest-priced item in each pair, on us.")), /*#__PURE__*/React.createElement(PairStrip, {
    pairs: pairs,
    units: units,
    onRemoveUnit: removeUnit
  }), /*#__PURE__*/React.createElement(FreeShipBar, {
    count: count,
    threshold: BOGO_FREE_SHIP_AT
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
      fontSize: 10.5,
      fontWeight: 700,
      padding: '3px 7px',
      borderRadius: 99,
      marginLeft: 2,
      letterSpacing: '0.04em'
    }
  }, "BOGO")))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement(HomeIndicator, null)));
}

// ─────────────────────────────────────────────────────────────────────────
// Top-level BOGO screen — same outer chrome as BundleScreen, BOGO tray.
function BundleScreenBogo({
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
  // BOGO removes one *unit* (decrement qty), matching the unit-level pair UI.
  const removeUnit = useCallback(id => {
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
  const count = Object.values(cart).reduce((s, n) => s + n, 0);
  const trayPad = expanded ? 480 : 130;
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
  }))), /*#__PURE__*/React.createElement(BogoTray, {
    expanded: expanded,
    setExpanded: setExpanded,
    cart: cart,
    removeUnit: removeUnit
  }));
}
Object.assign(window, {
  BundleScreenBogo
});
})();
