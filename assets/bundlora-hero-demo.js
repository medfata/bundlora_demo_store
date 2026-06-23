/* compiled hero demo — do not edit by hand */
// bundlora-hero-demo.js — hero interactive demo.
// Renders the real mobile bundle builder, scaled into the hero, with a
// selector for the three discount mechanics (%, BOGO, spend & save).
(function () {
  const {
    useState
  } = React;
  const PHONE_W = 375;
  const PHONE_H = 812;
  const SCALE = 300 / PHONE_W; // 0.8
  const VIS_W = 300;
  const VIS_H = Math.floor(PHONE_H * SCALE); // 649
  const PHONE_BR = Math.round(44 * SCALE); // 35

  const TYPES = [{
    id: 'percent',
    label: '% Discount',
    sub: 'Tiered % off as items stack'
  }, {
    id: 'bogo',
    label: 'Buy 1 Get 1',
    sub: 'Every 2nd item is free'
  }, {
    id: 'amount',
    label: 'Spend & Save',
    sub: 'Flat $ off at spend tiers'
  }];

  // Start each builder with 2 items so the discount mechanic is
  // visible right away without the user needing to add anything.
  const INIT = {
    percent: {
      'tee-pocket': 1,
      tote: 1
    },
    bogo: {
      'tee-pocket': 1,
      tote: 1
    },
    amount: {
      'tee-pocket': 1,
      tote: 1
    }
  };
  function HeroBundleDemo() {
    const [active, setActive] = useState('percent');
    const info = TYPES.find(t => t.id === active);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        fontFamily: '"Inter",-apple-system,BlinkMacSystemFont,system-ui,sans-serif'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 13px',
        borderRadius: 99,
        background: 'rgba(32,167,123,0.12)',
        color: '#20a77b',
        fontSize: 12.5,
        fontWeight: 600,
        marginBottom: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: '#20a77b',
        display: 'inline-block',
        boxShadow: '0 0 0 3px rgba(32,167,123,0.22)'
      }
    }), "Interactive demo"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        background: '#f4f1ff',
        borderRadius: 13,
        padding: 4,
        border: '1px solid rgba(128,96,255,0.18)',
        width: VIS_W
      }
    }, TYPES.map(t => {
      const on = t.id === active;
      return /*#__PURE__*/React.createElement("button", {
        key: t.id,
        onClick: () => setActive(t.id),
        style: {
          flex: 1,
          padding: '8px 4px',
          borderRadius: 9,
          border: 'none',
          background: on ? '#fff' : 'transparent',
          color: on ? '#21124d' : '#6f6b87',
          fontWeight: on ? 700 : 500,
          fontSize: 12,
          cursor: 'pointer',
          boxShadow: on ? '0 1px 6px rgba(33,18,77,0.12)' : 'none',
          transition: 'background .15s,color .15s,box-shadow .15s',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit'
        }
      }, t.label);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#6f6b87',
        letterSpacing: '-0.005em',
        marginTop: -4
      }
    }, info.sub), /*#__PURE__*/React.createElement("div", {
      style: {
        width: VIS_W,
        height: VIS_H,
        borderRadius: PHONE_BR,
        overflow: 'hidden',
        boxShadow: '0 28px 72px rgba(33,18,77,0.26), 0 8px 20px rgba(33,18,77,0.12)',
        border: '1px solid rgba(255,255,255,0.55)',
        flex: '0 0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: `scale(${SCALE})`,
        transformOrigin: 'top left',
        width: PHONE_W,
        height: PHONE_H
      }
    }, active === 'percent' && /*#__PURE__*/React.createElement(BundleScreen, {
      initialCart: INIT.percent,
      initialExpanded: true
    }), active === 'bogo' && /*#__PURE__*/React.createElement(BundleScreenBogo, {
      initialCart: INIT.bogo,
      initialExpanded: true
    }), active === 'amount' && /*#__PURE__*/React.createElement(BundleScreenFixedAmount, {
      initialCart: INIT.amount,
      initialExpanded: true
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#9ca3af',
        textAlign: 'center'
      }
    }, "Tap products to try it \u2014 this is what your customers see"));
  }
  const el = document.getElementById('bndl-hero-builder-root');
  if (el) ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(HeroBundleDemo, null));
})();
