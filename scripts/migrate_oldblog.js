const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const oldRoot = path.join(root, 'OldBlog');
const oldContent = path.join(oldRoot, 'content');
const sourceDir = path.join(root, 'source');
const postsDir = path.join(sourceDir, '_posts');

const collectionMap = {
  posts: { category: '时间轴', prefix: 'posts' }
};

const pageCollectionMap = {
  diary: { title: '日记', prefix: 'diary' },
  garden: { title: '花园', prefix: 'garden' }
};

const achievementData = loadAchievementData();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function writeText(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, 'utf8');
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      copyFile(srcPath, destPath);
    }
  }
}

function removeGeneratedTargets() {
  const generatedPostPattern = /^(posts|diary|garden)-.+\.md$/;
  ensureDir(postsDir);
  for (const entry of fs.readdirSync(postsDir)) {
    if (generatedPostPattern.test(entry)) {
      fs.rmSync(path.join(postsDir, entry), { force: true });
    }
  }

  for (const dir of ['about', 'friends', 'diary', 'garden', 'cv', 'js']) {
    fs.rmSync(path.join(sourceDir, dir), { recursive: true, force: true });
  }

  fs.rmSync(path.join(sourceDir, 'tags', 'index.md'), { force: true });

  for (const file of [
    'BingSiteAuth.xml',
    'google70e9692bef7306bc.html',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'android-chrome-192x192.png'
  ]) {
    fs.rmSync(path.join(sourceDir, file), { force: true });
  }
}

function splitFrontMatter(raw, file) {
  if (!raw.startsWith('---')) {
    return { data: {}, body: raw };
  }

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Invalid front matter in ${file}`);
  }

  return {
    data: yaml.load(match[1]) || {},
    body: match[2] || ''
  };
}

function dumpFrontMatter(data, body) {
  const yamlText = yaml.dump(data, {
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
    quotingType: '"'
  });
  return `---\n${yamlText}---\n\n${body.replace(/^\s+/, '')}`;
}

function walkMarkdown(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdown(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files.sort();
}

function slugFromFilename(file) {
  return path.basename(file, '.md')
    .normalize('NFKC')
    .replace(/[《》“”"']/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_+.-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function normalizeFrontMatter(data, collection, file) {
  const result = {};
  const date = data.date ? String(data.date) : undefined;
  const title = data.title || path.basename(file, '.md');

  result.title = title;
  if (date) result.date = date;
  if (data.updated) result.updated = String(data.updated);

  const tags = normalizeList(data.tags);
  if (tags.length) result.tags = tags;

  result.categories = [collection.category];
  if (data.summary || data.description) {
    result.description = data.summary || data.description;
  }
  if (data.math === true) {
    result.mathjax = true;
  }
  if (data.draft === true) {
    result.draft = true;
  }

  return result;
}

function normalizeStandaloneFrontMatter(data, collection, file) {
  const result = {};
  const date = data.date ? String(data.date) : undefined;
  const title = data.title || path.basename(file, '.md');

  result.title = title;
  if (date) result.date = date;
  if (data.updated) result.updated = String(data.updated);
  if (data.summary || data.description) {
    result.description = data.summary || data.description;
  }
  if (data.math === true) {
    result.mathjax = true;
  }
  if (data.draft === true) {
    result.draft = true;
  }
  result.layout = 'post';
  result.collection_section = collection.title;

  return result;
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return [String(value)].filter(Boolean);
}

function loadAchievementData() {
  const dataDir = path.join(oldRoot, 'data');
  if (!fs.existsSync(dataDir)) return {};

  const result = {};
  for (const file of fs.readdirSync(dataDir)) {
    if (!file.endsWith('.json')) continue;
    const full = path.join(dataDir, file);
    const parsed = JSON.parse(readText(full));
    const byName = {};
    for (const item of parsed.achievements || []) {
      byName[item.name] = item;
    }
    result[`data/${file}`] = byName;
    result[file] = byName;
  }
  return result;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function transformShortcodes(body) {
  return body.replace(/\{\{<\s*steam_achievement\s+([^>]*)>\}\}/g, (full, attrs) => {
    const params = {};
    attrs.replace(/(\w+)="([^"]*)"/g, (_, key, value) => {
      params[key] = value;
      return '';
    });

    const achievement = achievementData[params.file]?.[params.name];
    if (!achievement) {
      return `<div class="achievement-not-found">成就 "${escapeHtml(params.name)}" 未找到。</div>`;
    }

    const title = achievement.displayName_zh || achievement.displayName || achievement.displayName_en || achievement.name;
    const desc = achievement.description_zh || achievement.description || achievement.description_en || '';
    const hidden = Number(achievement.hidden) === 1;
    const hiddenBadge = hidden ? '<span class="hidden-badge">隐藏</span>' : '';

    return [
      `<div class="steam-achievement-card${hidden ? ' hidden-achievement' : ''}">`,
      '  <div class="achievement-icon">',
      `    <a href="${escapeHtml(achievement.steamUrl)}" target="_blank" rel="noopener">`,
      `      <img src="${escapeHtml(achievement.icon)}" alt="${escapeHtml(title)}" onerror="this.src='${escapeHtml(achievement.icongray)}'">`,
      '    </a>',
      '  </div>',
      '  <div class="achievement-content">',
      '    <h4 class="achievement-title">',
      `      <a href="${escapeHtml(achievement.steamUrl)}" target="_blank" rel="noopener">${escapeHtml(title)}</a>`,
      `      ${hiddenBadge}`,
      '    </h4>',
      `    <p class="achievement-desc">${escapeHtml(desc)}</p>`,
      `    <a href="${escapeHtml(achievement.steamUrl)}" target="_blank" rel="noopener" class="steam-button">Steam 页面</a>`,
      '  </div>',
      '</div>'
    ].join('\n');
  });
}

function migrateCollections() {
  let count = 0;
  for (const [folder, collection] of Object.entries(collectionMap)) {
    const dir = path.join(oldContent, folder);
    if (!fs.existsSync(dir)) continue;

    for (const file of walkMarkdown(dir)) {
      if (path.basename(file) === '_index.md') continue;
      const raw = readText(file);
      const { data, body } = splitFrontMatter(raw, file);
      const frontMatter = normalizeFrontMatter(data, collection, file);
      const content = transformShortcodes(body);
      const slug = slugFromFilename(file);
      const target = path.join(postsDir, `${collection.prefix}-${slug}.md`);
      writeText(target, dumpFrontMatter(frontMatter, content));
      count += 1;
    }
  }
  return count;
}

function migrateStandaloneCollections() {
  let count = 0;
  for (const [folder, collection] of Object.entries(pageCollectionMap)) {
    const dir = path.join(oldContent, folder);
    if (!fs.existsSync(dir)) continue;

    for (const file of walkMarkdown(dir)) {
      if (path.basename(file) === '_index.md') continue;
      const raw = readText(file);
      const { data, body } = splitFrontMatter(raw, file);
      const frontMatter = normalizeStandaloneFrontMatter(data, collection, file);
      const content = transformShortcodes(body);
      const slug = slugFromFilename(file);
      const target = path.join(sourceDir, collection.prefix, slug, 'index.md');
      writeText(target, dumpFrontMatter(frontMatter, content));
      count += 1;
    }
  }
  return count;
}

function migratePage(oldRelative, newRelative, extra = {}) {
  const src = path.join(oldContent, oldRelative);
  if (!fs.existsSync(src)) return false;
  const { data, body } = splitFrontMatter(readText(src), src);
  const frontMatter = {
    title: data.title || extra.title,
    ...(data.description ? { description: data.description } : {}),
    ...extra
  };
  writeText(path.join(sourceDir, newRelative, 'index.md'), dumpFrontMatter(frontMatter, transformShortcodes(body)));
  return true;
}

function migrateSectionPage(section, category) {
  const src = path.join(oldContent, section, '_index.md');
  if (!fs.existsSync(src)) return false;
  const { data, body } = splitFrontMatter(readText(src), src);
  const frontMatter = {
    title: data.title || category,
    description: data.description || '',
    section_path: section,
    layout: 'section'
  };
  writeText(path.join(sourceDir, section, 'index.md'), dumpFrontMatter(frontMatter, body));
  return true;
}

function migrateTagsPage() {
  const src = path.join(oldContent, 'tags', '_index.md');
  if (!fs.existsSync(src)) return false;
  const { data, body } = splitFrontMatter(readText(src), src);
  writeText(path.join(sourceDir, 'tags', 'index.md'), dumpFrontMatter({
    title: data.title || '分类',
    description: data.description || '',
    layout: 'tag-index'
  }, body));
  return true;
}

function migrateFriendsPage() {
  const src = path.join(oldContent, 'friends', '_index.md');
  if (!fs.existsSync(src)) return false;

  const { data, body } = splitFrontMatter(readText(src), src);
  const friends = yaml.load(readText(path.join(oldRoot, 'data', 'friends.yaml'))) || [];
  const exchange = data.exchange || {};

  let html = `${body.trim()}\n\n<div class="friends-grid">\n`;
  for (const friend of friends) {
    const initial = friend.name ? friend.name.trim().charAt(0) : '?';
    html += [
      `  <a class="friend-card" href="${escapeHtml(friend.url)}" target="_blank" rel="noopener">`,
      '    <span class="friend-avatar">',
      friend.avatar
        ? `      <img src="${escapeHtml(friend.avatar)}" alt="${escapeHtml(friend.name)}">`
        : `      <span class="friend-avatar-placeholder">${escapeHtml(initial)}</span>`,
      '    </span>',
      '    <span class="friend-body">',
      `      <strong class="friend-name">${escapeHtml(friend.name)}</strong>`,
      `      <span class="friend-desc">${escapeHtml(friend.desc || '')}</span>`,
      '    </span>',
      '  </a>'
    ].join('\n') + '\n';
  }
  html += '</div>\n';

  if (exchange.items?.length) {
    html += '\n<div class="friends-exchange">\n';
    if (exchange.intro) html += `<p class="friends-exchange-lead">${escapeHtml(exchange.intro)}</p>\n`;
    html += '<ul class="friends-exchange-list">\n';
    for (const item of exchange.items) {
      const value = item.conceal ? item.placeholder || '点击复制后获取' : item.value;
      const display = item.link && !item.conceal
        ? `<a href="${escapeHtml(item.value)}" target="_blank" rel="noopener">${escapeHtml(item.value)}</a>`
        : escapeHtml(value);
      html += `<li><strong>${escapeHtml(item.label)}：</strong><span>${display}</span></li>\n`;
    }
    html += '</ul>\n</div>\n';
  }

  writeText(path.join(sourceDir, 'friends', 'index.md'), dumpFrontMatter({
    title: data.title || '友人帐',
    description: data.description || ''
  }, html));
  return true;
}

function migrateStaticFiles() {
  copyFile(path.join(oldRoot, 'static', 'BingSiteAuth.xml'), path.join(sourceDir, 'BingSiteAuth.xml'));
  copyFile(path.join(oldRoot, 'static', 'google70e9692bef7306bc.html'), path.join(sourceDir, 'google70e9692bef7306bc.html'));
  copyFile(path.join(oldRoot, 'public', 'favicon-16x16.png'), path.join(sourceDir, 'favicon-16x16.png'));
  copyFile(path.join(oldRoot, 'public', 'favicon-32x32.png'), path.join(sourceDir, 'favicon-32x32.png'));
  copyFile(path.join(oldRoot, 'public', 'android-chrome-192x192.png'), path.join(sourceDir, 'android-chrome-192x192.png'));
  copyDir(path.join(oldRoot, 'static', 'cv'), path.join(sourceDir, 'cv'));
  copyDir(path.join(oldRoot, 'static', 'js'), path.join(sourceDir, 'js'));
  copyDir(path.join(oldRoot, 'static', 'friends'), path.join(sourceDir, 'friends'));
}

function main() {
  removeGeneratedTargets();
  const posts = migrateCollections();
  const standalonePages = migrateStandaloneCollections();
  migratePage('about.md', 'about');
  migrateFriendsPage();
  migrateSectionPage('diary', '日记');
  migrateSectionPage('garden', '花园');
  migrateTagsPage();
  migrateStaticFiles();
  console.log(`Migrated ${posts} posts and ${standalonePages} standalone pages from OldBlog.`);
}

if (require.main === module) {
  main();
}
