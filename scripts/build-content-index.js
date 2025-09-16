/*
  Build a JS manifest from Markdown files with YAML front matter.
  - Scans content/projects/*.md and content/posts/*.md
  - Parses a subset of YAML front matter needed for list + detail views
  - Writes content/manifest.js (window.CONTENT_INDEX)

  Supported front matter fields:
    - title, slug, date, date_pretty, description, type
    - hero: { image, alt, link }
    - project: { tags: [..] }
    - tags: [..] (for posts)
    - gallery: { items: [{ src, title, alt, caption }] }
*/

const fs = require('fs');
const path = require('path');

function listFiles(dir) {
  try { return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => path.join(dir, f)); } catch { return []; }
}

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function dequote(s) {
  if (s == null) return s;
  let t = String(s).trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1);
  }
  // unescape common sequences from our generator
  t = t.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  return t;
}

function parseFrontMatter(md) {
  // Extract block between first two --- lines
  const m = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: md };
  const yaml = m[1];
  const body = md.slice(m[0].length);

  // Very small YAML subset parser for our schema
  const data = {};
  const lines = yaml.split(/\r?\n/);
  let ctxStack = [{ name: 'root', indent: -1, obj: data }];
  let currentItem = null; // for gallery.items object entries

  function getCtxForLine(indent, line) {
    const isArrayItem = /^\s*-\s+/.test(line);
    while (ctxStack.length) {
      const top = ctxStack[ctxStack.length - 1];
      if (top.indent > indent) { ctxStack.pop(); continue; }
      if (isArrayItem) {
        // For a new array item, ensure we are positioned at the array, not a previous object
        if (!Array.isArray(top.obj) && top.indent >= indent) { ctxStack.pop(); continue; }
      } else {
        if (top.indent >= indent) { ctxStack.pop(); continue; }
      }
      break;
    }
    return ctxStack[ctxStack.length - 1];
  }

  for (let raw of lines) {
    const line = raw.replace(/\t/g, '  ');
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const indent = (line.match(/^\s*/)[0] || '').length;
    const ctx = getCtxForLine(indent, line);
    const at = ctx.obj;

    // Array item (could be scalar or object)
    let mArr = line.match(/^\s*-\s*(.*)$/);
    if (mArr) {
      const val = mArr[1];
      // Determine which array we are inside: tags (root), project.tags, gallery.items
      // Find nearest array in context by name
      const parent = ctx.name;
      if ((parent === 'tags' || parent === 'project.tags') && Array.isArray(at)) {
        at.push(dequote(val));
        continue;
      }
      if (parent === 'gallery.items' && Array.isArray(at)) {
        // Start new object item (even if on one line, we treat as object)
        currentItem = {};
        at.push(currentItem);
        // If inline like "- src: \"...\"" process the rest as key: value
        const mInline = val.match(/^([A-Za-z0-9_\-]+):\s*(.*)$/);
        if (mInline) {
          currentItem[mInline[1]] = dequote(mInline[2]);
        }
        // Push a new context level for fields under this item
        ctxStack.push({ name: 'gallery.item', indent, obj: currentItem });
        continue;
      }
      // If we are in a scalar array which we didn't detect, skip
      continue;
    }

    // Key: value or Key:
    const mKey = line.match(/^\s*([A-Za-z0-9_\-\.]+):\s*(.*)$/);
    if (!mKey) continue;
    const key = mKey[1];
    const val = mKey[2];

    function ensure(parent, k, t) {
      if (parent[k] === undefined) parent[k] = (t === 'array') ? [] : {};
      return parent[k];
    }

    if (val === '') {
      // Object or array to follow
      if (key === 'hero' || key === 'project' || key === 'seo') {
        const obj = ensure(at, key, 'object');
        ctxStack.push({ name: key, indent, obj });
      } else if (key === 'tags') {
        const arr = ensure(at, key, 'array');
        ctxStack.push({ name: ctx.name === 'project' ? 'project.tags' : 'tags', indent, obj: arr });
      } else if (key === 'gallery') {
        const obj = ensure(at, key, 'object');
        ctxStack.push({ name: 'gallery', indent, obj });
      } else if (key === 'items' && ctx.name === 'gallery') {
        const arr = ensure(at, 'items', 'array');
        ctxStack.push({ name: 'gallery.items', indent, obj: arr });
      } else {
        // Generic nested map
        const obj = ensure(at, key, 'object');
        ctxStack.push({ name: key, indent, obj });
      }
      continue;
    }

    // Inline key: value
    const v = dequote(val);
    if (ctx.name === 'root') {
      if (key === 'date_pretty') {
        at.datePretty = v;
      } else {
        at[key] = v;
      }
    } else if (ctx.name === 'hero') {
      at[key] = v; // image, alt, link, link_text
    } else if (ctx.name === 'project') {
      at[key] = v;
    } else if (ctx.name === 'gallery.item' && currentItem) {
      currentItem[key] = v; // src, title, alt, caption
    } else if (ctx.name === 'gallery') {
      // If currently inside an item, route known item fields to that object
      if (currentItem && (key === 'src' || key === 'title' || key === 'alt' || key === 'caption')) {
        currentItem[key] = v;
      } else {
        at[key] = v; // layout, columns, etc.
      }
    } else if (Array.isArray(at) && (ctx.name === 'tags' || ctx.name === 'project.tags')) {
      // handled in array branch
    } else {
      at[key] = v;
    }
  }

  return { data, body, yamlRaw: yaml };
}

function parseGalleryFromYaml(yaml) {
  const lines = yaml.split(/\r?\n/);
  const items = [];
  let gi = -1; let gIndent = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*gallery:\s*$/.test(l)) { gi = i; gIndent = (l.match(/^\s*/)[0]||'').length; break; }
  }
  if (gi === -1) return items;
  // Find items:
  let ii = -1; let itemsIndent = 0;
  for (let i = gi + 1; i < lines.length; i++) {
    const l = lines[i];
    const indent = (l.match(/^\s*/)[0]||'').length;
    if (indent <= gIndent && /\w/.test(l)) break; // end of gallery block
    if (/^\s*items:\s*$/.test(l)) { ii = i; itemsIndent = indent; break; }
  }
  if (ii === -1) return items;
  let i = ii + 1;
  while (i < lines.length) {
    let l = lines[i];
    const indent = (l.match(/^\s*/)[0]||'').length;
    if (indent <= gIndent && /\w/.test(l)) break; // end of gallery block
    if (/^\s*-\s*$/.test(l) || /^\s*-\s+/.test(l)) {
      const itemIndent = (l.match(/^\s*/)[0]||'').length;
      const obj = {};
      // parse following lines belonging to this item
      i++;
      while (i < lines.length) {
        l = lines[i];
        const ind2 = (l.match(/^\s*/)[0]||'').length;
        if (ind2 <= itemIndent) break; // next item or out
        const mk = l.match(/^\s*([A-Za-z0-9_\-\.]+):\s*(.*)$/);
        if (mk) {
          const k = mk[1];
          let v = mk[2].trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
          obj[k] = v;
        }
        i++;
      }
      if (Object.keys(obj).length) items.push(obj);
      continue; // continue loop without i++ because we moved already
    }
    i++;
  }
  return items;
}

function buildItemFromFM(fm, kind) {
  const t = (fm.type || kind || '').toLowerCase();
  const common = {
    title: fm.title || '',
    slug: fm.slug || '',
  };
  if (fm.date) common.date = fm.date;
  if (fm.datePretty) common.datePretty = fm.datePretty;
  if (fm.description) {
    if (t === 'post') common.excerpt = fm.description; else common.description = fm.description;
  }
  const hero = fm.hero || {};
  if (hero.image) common.image = hero.image;
  if (hero.alt) common.alt = hero.alt;
  if (hero.link) {
    if (t === 'post') common.url = hero.link; else common.imageLink = hero.link;
  }
  // Explicit card-level direct link (optional)
  function normalizeUrl(u) {
    if (!u) return u;
    if (/^www\./i.test(u)) return `http://${u}`;
    return u;
  }
  if (fm.external_link) common.externalLink = normalizeUrl(fm.external_link);
  if (t === 'project') {
    const proj = fm.project || {};
    if (Array.isArray(proj.tags)) common.tags = proj.tags;
    // gallery
    if (fm.gallery && Array.isArray(fm.gallery.items)) {
      common.gallery = fm.gallery.items.map((g) => ({
        src: g.src, title: g.title, alt: g.alt, caption: g.caption
      })).filter(x => x.src);
    }
    return common;
  } else {
    if (Array.isArray(fm.tags)) common.tags = fm.tags;
    return common;
  }
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function main() {
  const root = process.cwd();
  const postsDir = path.join(root, 'content', 'posts');
  const projectsDir = path.join(root, 'content', 'projects');
  const existingProjectsPath = path.join(root, 'data', 'projects.json');
  let existingProjects = [];
  try { existingProjects = JSON.parse(fs.readFileSync(existingProjectsPath, 'utf8')); } catch {}
  const postFiles = listFiles(postsDir);
  const projectFiles = listFiles(projectsDir);

  const posts = [];
  for (const f of postFiles) {
    const md = readFile(f);
    const { data: fm } = parseFrontMatter(md);
    const item = buildItemFromFM({ ...fm, type: 'post' }, 'post');
    // default slug from filename if missing
    if (!item.slug) item.slug = path.basename(f, '.md');
    posts.push(item);
  }

  const projects = [];
  for (const f of projectFiles) {
    const md = readFile(f);
    const { data: fm, yamlRaw } = parseFrontMatter(md);
    // Fallback parse for gallery items if missing
    if (fm.gallery && (!fm.gallery.items || !fm.gallery.items.length)) {
      const items = parseGalleryFromYaml(yamlRaw || '');
      if (items.length) {
        if (!fm.gallery) fm.gallery = {};
        fm.gallery.items = items;
      }
    }
    const item = buildItemFromFM({ ...fm, type: 'project' }, 'project');
    if (!item.slug) item.slug = path.basename(f, '.md');
    // Preserve existing gallery if parsing did not yield any
    if ((!item.gallery || item.gallery.length === 0) && Array.isArray(existingProjects)) {
      const prev = existingProjects.find(x => (x.slug || '') === item.slug);
      if (prev && Array.isArray(prev.gallery) && prev.gallery.length) {
        item.gallery = prev.gallery;
      }
    }
    projects.push(item);
  }

  // Emit a runtime manifest JS to avoid JSON fetches
  const manifestJsPath = path.join(root, 'content', 'manifest.js');
  const js = `// Auto-generated by scripts/build-content-index.js\n` +
    `(function(){\n` +
    `  window.CONTENT_INDEX = {\n` +
    `    projects: ${JSON.stringify(projects, null, 2)},\n` +
    `    posts: ${JSON.stringify(posts, null, 2)}\n` +
    `  };\n` +
    `})();\n`;
  fs.writeFileSync(manifestJsPath, js, 'utf8');

  console.log(`Built content manifest.\n  Posts: ${posts.length}\n  Projects: ${projects.length}\n  -> content/manifest.js`);
}

if (require.main === module) {
  main();
}

module.exports = {
  parseFrontMatter,
};
