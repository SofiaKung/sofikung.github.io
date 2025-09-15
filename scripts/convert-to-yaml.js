/*
  Convert existing JSON data (data/projects.json, data/posts.json)
  into individual Markdown files with YAML front matter.

  Output:
    - content/projects/<slug>.md
    - content/posts/<slug>.md
*/

const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJSON(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function q(str) {
  if (str === null || str === undefined) return '""';
  const s = String(str);
  // YAML double-quoted escaping for common chars
  return '"' + s
    .replace(/\\/g, "\\\\")
    .replace(/\"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
    + '"';
}

function writeLine(lines, level, key, value, comment) {
  const indent = '  '.repeat(level);
  if (comment) lines.push(`${indent}# ${comment}`);
  if (value === undefined || value === null || value === '') return;
  if (key) {
    lines.push(`${indent}${key}: ${value}`);
  } else {
    lines.push(`${indent}${value}`);
  }
}

function writeArray(lines, level, key, arr) {
  if (!Array.isArray(arr) || arr.length === 0) return;
  const indent = '  '.repeat(level);
  lines.push(`${indent}${key}:`);
  arr.forEach((v) => lines.push(`${indent}- ${q(v)}`));
}

function writeObjectArray(lines, level, key, arr, fields) {
  if (!Array.isArray(arr) || arr.length === 0) return;
  const indent = '  '.repeat(level);
  lines.push(`${indent}${key}:`);
  arr.forEach((obj) => {
    lines.push(`${indent}-`);
    fields.forEach((f) => {
      const val = obj && obj[f.src] !== undefined ? obj[f.src] : undefined;
      if (val === undefined || val === null || val === '') return;
      writeLine(lines, level + 1, f.dest || f.src, q(val));
    });
  });
}

function writeContentBlocks(lines, level, key, blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return;
  const indent = '  '.repeat(level);
  lines.push(`${indent}${key}:`);
  blocks.forEach((b) => {
    const type = (b && b.type) || 'paragraph';
    lines.push(`${indent}- type: ${q(type)}`);
    if (b.level !== undefined) writeLine(lines, level + 1, 'level', String(b.level));
    const text = b.text || b.content;
    if (text) writeLine(lines, level + 1, 'text', q(text));
    if (type === 'list' && Array.isArray(b.items)) {
      const subIndent = '  '.repeat(level + 1);
      lines.push(`${subIndent}items:`);
      b.items.forEach((it) => lines.push(`${subIndent}- ${q(it)}`));
    }
    if (type === 'image') {
      if (b.src) writeLine(lines, level + 1, 'src', q(b.src));
      if (b.alt) writeLine(lines, level + 1, 'alt', q(b.alt));
      if (b.caption) writeLine(lines, level + 1, 'caption', q(b.caption));
    }
  });
}

function buildProjectYAML(p) {
  const lines = [];
  lines.push('---');
  // Basic metadata
  writeLine(lines, 0, null, null, 'Basic metadata');
  writeLine(lines, 0, 'title', q(p.title));
  const slug = p.slug || slugify(p.title);
  writeLine(lines, 0, 'slug', q(slug));
  if (p.date) writeLine(lines, 0, 'date', q(p.date));
  if (p.datePretty) writeLine(lines, 0, 'date_pretty', q(p.datePretty));
  if (p.description) writeLine(lines, 0, 'description', q(p.description));
  writeLine(lines, 0, 'type', q('project'));
  lines.push('');

  // Hero/cover section
  if (p.image || p.alt || p.imageLink || p.link) {
    writeLine(lines, 0, null, null, 'Hero/cover section');
    lines.push('hero:');
    if (p.image) writeLine(lines, 1, 'image', q(p.image));
    if (p.alt) writeLine(lines, 1, 'alt', q(p.alt));
    const link = p.imageLink || p.link;
    if (link) {
      writeLine(lines, 1, 'link', q(link));
      writeLine(lines, 1, 'link_text', q('View Live Project'));
    }
    lines.push('');
  }

  // Project metadata
  if ((p.tags && p.tags.length)) {
    writeLine(lines, 0, null, null, 'Project metadata');
    lines.push('project:');
    if (Array.isArray(p.tags) && p.tags.length) {
      writeArray(lines, 1, 'tags', p.tags);
    }
    lines.push('');
  }

  // Content structure
  if (Array.isArray(p.body) && p.body.length) {
    writeLine(lines, 0, null, null, 'Content structure');
    writeContentBlocks(lines, 0, 'content_blocks', p.body);
    lines.push('');
  }

  // Gallery
  if (Array.isArray(p.gallery) && p.gallery.length) {
    writeLine(lines, 0, null, null, 'Gallery');
    lines.push('gallery:');
    writeLine(lines, 1, 'layout', q('masonry'));
    writeLine(lines, 1, 'columns', '2');
    const fields = [
      { src: 'src' },
      { src: 'title' },
      { src: 'alt' },
      { src: 'caption' }
    ];
    writeObjectArray(lines, 1, 'items', p.gallery, fields);
    lines.push('');
  }

  // SEO
  const og = p.image;
  const keywords = Array.isArray(p.tags) ? p.tags : [];
  if (og || keywords.length) {
    writeLine(lines, 0, null, null, 'SEO and additional metadata');
    lines.push('seo:');
    if (keywords.length) {
      writeArray(lines, 1, 'keywords', keywords);
    }
    if (og) writeLine(lines, 1, 'og_image', q(og));
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('<!-- Optional markdown content can go here. -->');
  lines.push('');
  return lines.join('\n');
}

function buildPostYAML(p) {
  const lines = [];
  lines.push('---');
  // Basic metadata
  writeLine(lines, 0, null, null, 'Basic metadata');
  writeLine(lines, 0, 'title', q(p.title));
  const slug = p.slug || slugify(p.title);
  writeLine(lines, 0, 'slug', q(slug));
  if (p.date) writeLine(lines, 0, 'date', q(p.date));
  if (p.datePretty) writeLine(lines, 0, 'date_pretty', q(p.datePretty));
  const desc = p.excerpt || p.description;
  if (desc) writeLine(lines, 0, 'description', q(desc));
  writeLine(lines, 0, 'type', q('post'));
  lines.push('');

  // Hero (optional image)
  if (p.image || p.alt || p.url) {
    writeLine(lines, 0, null, null, 'Hero/cover section');
    lines.push('hero:');
    if (p.image) writeLine(lines, 1, 'image', q(p.image));
    if (p.alt) writeLine(lines, 1, 'alt', q(p.alt));
    if (p.url && p.url !== '#') {
      writeLine(lines, 1, 'link', q(p.url));
      writeLine(lines, 1, 'link_text', q('Read Post'));
    }
    lines.push('');
  }

  // Tags
  if (Array.isArray(p.tags) && p.tags.length) {
    writeArray(lines, 0, 'tags', p.tags);
    lines.push('');
  }

  // SEO
  const og = p.image;
  const keywords = Array.isArray(p.tags) ? p.tags : [];
  if (og || keywords.length) {
    writeLine(lines, 0, null, null, 'SEO and additional metadata');
    lines.push('seo:');
    if (keywords.length) writeArray(lines, 1, 'keywords', keywords);
    if (og) writeLine(lines, 1, 'og_image', q(og));
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('<!-- Optional markdown content can go here. -->');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const root = process.cwd();
  const dataDir = path.join(root, 'data');
  const projects = readJSON(path.join(dataDir, 'projects.json'));
  const posts = readJSON(path.join(dataDir, 'posts.json'));

  // Ensure output dirs
  const projectsOut = path.join(root, 'content', 'projects');
  const postsOut = path.join(root, 'content', 'posts');
  ensureDir(projectsOut);
  ensureDir(postsOut);

  let created = [];

  if (Array.isArray(projects)) {
    projects.forEach((p) => {
      const slug = p.slug || slugify(p.title || 'untitled');
      const outPath = path.join(projectsOut, `${slug}.md`);
      const matter = buildProjectYAML(p);
      fs.writeFileSync(outPath, matter, 'utf8');
      created.push(outPath);
    });
  }

  if (Array.isArray(posts)) {
    posts.forEach((p) => {
      const slug = p.slug || slugify(p.title || 'untitled');
      const outPath = path.join(postsOut, `${slug}.md`);
      const matter = buildPostYAML(p);
      fs.writeFileSync(outPath, matter, 'utf8');
      created.push(outPath);
    });
  }

  console.log('Created/updated files:\n' + created.map((p) => path.relative(root, p)).join('\n'));
}

if (require.main === module) {
  main();
}

