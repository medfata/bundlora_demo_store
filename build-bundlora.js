// One-off build: compile the Bundlora builder JSX (from the design canvas)
// into plain browser JS so the storefront needs no in-browser Babel.
// Each module is wrapped in an IIFE to avoid top-level `const` collisions
// between classic <script> tags (they all share the global lexical scope).
const Babel = require('@babel/standalone');
const fs = require('fs');
const path = require('path');

const REF = path.join(__dirname, 'ref', 'bundlora', 'project');
const OUT = path.join(__dirname, 'assets');

function compile(src) {
  return Babel.transform(src, {
    presets: [['react', { runtime: 'classic' }]],
  }).code;
}

// module files: wrap in IIFE (they read/write window.* for cross-module sharing)
const modules = [
  ['shared.jsx', 'bundlora-shared.js'],
  ['bundle-screen.jsx', 'bundlora-bundle-screen.js'],
  ['bundle-screen-bogo.jsx', 'bundlora-bundle-screen-bogo.js'],
  ['bundle-screen-fixed-amount.jsx', 'bundlora-bundle-screen-fixed-amount.js'],
];

for (const [from, to] of modules) {
  const src = fs.readFileSync(path.join(REF, from), 'utf8');
  const code = compile(src);
  const wrapped = `/* compiled from ${from} — do not edit; see build-bundlora.js */\n;(function(){\n${code}\n})();\n`;
  fs.writeFileSync(path.join(OUT, to), wrapped);
  console.log('wrote', to, '(' + wrapped.length + ' bytes)');
}

// hero demo: source is the JSX already in assets (itself an IIFE) — compile in place
const heroPath = path.join(OUT, 'bundlora-hero-demo.js');
const heroSrc = fs.readFileSync(heroPath, 'utf8');
fs.writeFileSync(heroPath, '/* compiled hero demo — do not edit by hand */\n' + compile(heroSrc) + '\n');
console.log('wrote bundlora-hero-demo.js (compiled in place)');
