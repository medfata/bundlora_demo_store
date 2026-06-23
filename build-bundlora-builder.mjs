// Generates the hero "real builder" widget by running the ACTUAL Bundlora
// storefront renderer (from D:/my_projects/bundlora) for three discount types
// — simple %, tiered %, BOGO — with four shoe products, then captures the
// exact HTML/CSS/JS, scrubs Liquid money tokens to concrete prices, and wraps
// each in an isolated iframe document (with a demo shim that blocks real
// checkout + pre-selects two items). Output: assets/bundlora-real-builders.js
//
// Run:  node build-bundlora-builder.mjs

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const BUNDLORA = "D:/my_projects/bundlora";
const APP = path.join(BUNDLORA, "app");
const DEMO = "D:/my_projects/bundlora_demo_store";
const OUT_ASSET = path.join(DEMO, "assets", "bundlora-real-builders.js");
const TMP = path.join(DEMO, ".tmp-bundlora-render.mjs");

const require = createRequire(path.join(BUNDLORA, "package.json"));
const esbuild = require("esbuild");

// ── 1. Bundle the real renderer + appearance resolver to a runnable ESM module
const aliasTilde = {
  name: "alias-tilde",
  setup(b) {
    b.onResolve({ filter: /^~\// }, async (args) => {
      const rel = args.path.slice(2);
      const r = await b.resolve("./" + rel, {
        resolveDir: APP,
        kind: args.kind,
      });
      if (r.errors.length) return { errors: r.errors };
      return { path: r.path, external: r.external };
    });
  },
};

const entry = `
export { renderBundleStorefront } from "~/utils/storefront-renderer.server";
export { resolveBundleAppearance } from "~/utils/resolve-bundle-appearance";
`;

console.log("bundling real renderer with esbuild…");
const result = await esbuild.build({
  stdin: { contents: entry, resolveDir: APP, loader: "ts", sourcefile: "entry.ts" },
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  write: false,
  logLevel: "warning",
  plugins: [aliasTilde],
});
fs.writeFileSync(TMP, result.outputFiles[0].text);
const mod = await import(pathToFileURL(TMP).href);
const { renderBundleStorefront, resolveBundleAppearance } = mod;
console.log("renderer bundled OK");

// ── 2. Mock data: four shoe products (one variant each)
const IMG = {
  timberland:
    "https://cdn.shopify.com/s/files/1/0640/9348/7275/files/timberland-6-inch-premium-brown.png?v=1779356009",
  vans1:
    "https://cdn.shopify.com/s/files/1/0640/9348/7275/files/v07a9924_3.png?v=1779355824",
  vans2:
    "https://cdn.shopify.com/s/files/1/0640/9348/7275/files/vans-era-59-earthtone-suede-moroccan-blue.png?v=1779355755",
  vans3:
    "https://cdn.shopify.com/s/files/1/0640/9348/7275/files/images.jpg?v=1779355365",
};

function product(id, title, vendor, price, compareAt, img) {
  return {
    id,
    title,
    vendor,
    productType: "Shoes",
    featuredImage: { url: img },
    images: [img],
    tags: [],
    variants: [
      {
        id: `gid://shopify/ProductVariant/${id}`,
        title: "Default",
        price: String(price),
        compareAtPrice: compareAt ? String(compareAt) : undefined,
        image: img,
        availableForSale: true,
      },
    ],
  };
}

// Base four shoes, then duplicated to six so the desktop 3-column grid fills
// two clean rows (3 + 3) instead of a single row with a lonely fourth card.
const baseProducts = [
  product("tmb6", "Timberland 6-Inch Premium Boot", "Timberland", 199.99, 229.99, IMG.timberland),
  product("vans-skool", "Vans Old Skool", "Vans", 74.99, undefined, IMG.vans1),
  product("vans-era59", "Vans Era 59 Earthtone Suede", "Vans", 79.99, 94.99, IMG.vans2),
  product("vans-slip", "Vans Classic Slip-On", "Vans", 64.99, undefined, IMG.vans3),
];

// repeat the same products (with unique ids) up to a clean multiple of 3
const GRID_COLS = 3;
const TARGET_COUNT = 6; // two full desktop rows
const products = [];
for (let i = 0; i < TARGET_COUNT; i++) {
  const base = baseProducts[i % baseProducts.length];
  const copyN = Math.floor(i / baseProducts.length);
  products.push(
    copyN === 0
      ? base
      : product(`${base.id}-d${copyN}`, base.title, base.vendor, base.variants[0].price, base.variants[0].compareAtPrice, base.featuredImage.url)
  );
}
void GRID_COLS;

// ── 3. Three bundle configs
const rule = (id, minValue, discountValue, extra = {}) => ({
  id,
  conditionType: "QUANTITY",
  minValue,
  discountValue,
  displayOrder: id - 1,
  ...extra,
});

const configs = {
  simple: {
    id: 1,
    bundleName: "Sneaker Bundle",
    discountType: "PERCENTAGE",
    discountRules: [rule(1, 2, 15)],
    variantGroups: [],
  },
  tiered: {
    id: 2,
    bundleName: "Build Your Sneaker Pack",
    discountType: "PERCENTAGE",
    discountRules: [rule(1, 2, 10), rule(2, 3, 15), rule(3, 4, 20)],
    variantGroups: [],
  },
  bogo: {
    id: 3,
    bundleName: "Buy 1 Get 1 Sneakers",
    discountType: "BOGO",
    discountRules: [rule(1, 2, 0, { bogoFreeQuantity: 1 })],
    variantGroups: [],
  },
};

const appearance = resolveBundleAppearance("clean-retail-sidebar");

// ── 4. Liquid → concrete value scrub
function scrub(html) {
  return html
    .replace(/\{\{\s*(\d+)\s*\|\s*money\s*\}\}/g, (_, c) => "$" + (Number(c) / 100).toFixed(2))
    .replace(/\{\{\s*shop\.currency\s*\}\}/g, "USD")
    .replace(/\{\{[^}]*\}\}/g, "");
}

// ── 5. Demo shim: block real checkout, pre-select two items
const SHIM = `
<script>
(function(){
  function toast(){
    var t=document.getElementById('bndl-demo-toast');
    if(!t){t=document.createElement('div');t.id='bndl-demo-toast';
      t.style.cssText='position:fixed;left:50%;bottom:96px;transform:translateX(-50%);background:#191430;color:#fff;font:600 13px/1.3 system-ui,sans-serif;padding:10px 16px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);z-index:99999;text-align:center;max-width:84%;opacity:0;transition:opacity .2s';
      document.body.appendChild(t);}
    t.textContent='Demo preview — install Bundlora to take real bundles to checkout.';
    requestAnimationFrame(function(){t.style.opacity='1';});
    clearTimeout(t._h);t._h=setTimeout(function(){t.style.opacity='0';},2200);
  }
  document.addEventListener('click',function(e){
    var c=e.target.closest&&e.target.closest('.bundlora-tray-cta,.bundlora-sidebar-checkout');
    if(!c)return;
    if(c.getAttribute('aria-disabled')==='true')return;
    e.preventDefault();e.stopImmediatePropagation();toast();
  },true);
  function addByIndex(i){
    try{
      var b=document.querySelectorAll('.bundlora-product-add-button:not([disabled])');
      if(b[i])b[i].click();
    }catch(_){}
  }
  // pre-select two items so the discount shows applied right away (re-query
  // each time in case the grid re-renders on add)
  function preselect(){ addByIndex(0); setTimeout(function(){ addByIndex(1); },300); }
  if(document.readyState!=='loading')setTimeout(preselect,120);
  else document.addEventListener('DOMContentLoaded',function(){setTimeout(preselect,120);});
})();
</script>`;

// Mobile wrapper — for phone frames (hero + showcase phone). Force the mobile
// layout regardless of computed width.
function docMobile(fragment) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  html,body{margin:0;padding:0;background:#fafafa;-webkit-font-smoothing:antialiased;}
  html{scrollbar-width:none;-ms-overflow-style:none;}
  html::-webkit-scrollbar,body::-webkit-scrollbar{display:none;width:0;height:0;}
  .bundlora-desktop-layout{display:none!important;}
  .bundlora-mobile-layout{display:block!important;}
</style></head><body>${fragment}${SHIM}</body></html>`;
}

// Desktop wrapper — for the showcase browser-window frame. Pin the layout
// viewport wide so the renderer's >=1024px desktop layout (and its media
// queries) kick in; the host scales the iframe down to fit the frame.
function docDesktop(fragment) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=1200">
<style>
  html,body{margin:0;padding:0;background:#fafafa;-webkit-font-smoothing:antialiased;}
  html{scrollbar-width:none;-ms-overflow-style:none;}
  html::-webkit-scrollbar,body::-webkit-scrollbar{display:none;width:0;height:0;}
  .bundlora-mobile-layout{display:none!important;}
  .bundlora-desktop-layout{display:block!important;}
</style></head><body>${fragment}${SHIM}</body></html>`;
}

// ── 6. Render all three, write the asset
const data = {};
const dataDesktop = {};
for (const [key, cfg] of Object.entries(configs)) {
  const html = renderBundleStorefront({
    bundleData: cfg,
    products,
    appearance,
    shopDomain: "startup-apps.myshopify.com",
    locale: "en",
  });
  const clean = scrub(html);
  const leftover = (clean.match(/\{\{|\}\}/g) || []).length;
  if (leftover) console.warn(`  ! ${key}: ${leftover} unresolved liquid braces remain`);
  data[key] = docMobile(clean);
  dataDesktop[key] = docDesktop(clean);
  console.log(`rendered ${key} (mobile ${data[key].length} / desktop ${dataDesktop[key].length} bytes)`);
}

const out = `/* GENERATED by build-bundlora-builder.mjs — do not edit by hand.
   Real Bundlora storefront builder captured for 3 discount types,
   in both mobile (phone) and desktop (browser-window) layouts. */
window.BUNDLORA_REAL_BUILDERS = ${JSON.stringify(data)};
window.BUNDLORA_REAL_BUILDERS_DESKTOP = ${JSON.stringify(dataDesktop)};
`;
fs.writeFileSync(OUT_ASSET, out);
fs.rmSync(TMP, { force: true });
console.log(`\nwrote ${OUT_ASSET} (${out.length} bytes)`);
