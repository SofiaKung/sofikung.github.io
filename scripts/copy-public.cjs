// Copy root assets and styles into Astro public dir (CJS)
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src)) {
    const s = path.join(src, e);
    const d = path.join(dest, e);
    const st = fs.statSync(s);
    if (st.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const root = process.cwd();
const pub = path.join(root, 'public');
fs.mkdirSync(pub, { recursive: true });

copyDir(path.join(root, 'assets'), path.join(pub, 'assets'));

const cname = path.join(root, 'CNAME');
if (fs.existsSync(cname)) fs.copyFileSync(cname, path.join(pub, 'CNAME'));

console.log('[copy-public] assets/styles copied to public/.');
