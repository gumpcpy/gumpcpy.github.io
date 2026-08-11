export const LANG_KEY = "catalogue-lang";
export const THEME_KEY = "catalogue-theme";
export const SUPPORTED = ["zh", "en"];
export const ASSET_VERSION = "20260811g";
export const UPDATED_AT = "2026-08-11";

export const SITE_NAV = [
  { id: "projects", href: "/projects/", label: { zh: "作品", en: "Projects" } },
  { id: "library", href: "/library/", label: { zh: "文庫", en: "Library" } },
  { id: "about", href: "/about/", label: { zh: "關於", en: "About" } },
];

export const LIBRARY_SECTIONS = [
  {
    id: "manuals",
    href: "/library/manuals/",
    label: { zh: "手冊", en: "Manuals" },
    lead: {
      zh: "建置手冊與操作說明。",
      en: "Build manuals and how-to guides.",
    },
  },
  {
    id: "essays",
    href: "/library/essays/",
    label: { zh: "隨筆", en: "Essays" },
    lead: {
      zh: "讀書心得與長文思考。",
      en: "Reading notes and longer reflections.",
    },
  },
  {
    id: "stories",
    href: "/library/stories/",
    label: { zh: "故事", en: "Stories" },
    lead: {
      zh: "創意與故事。",
      en: "Creative writing and stories.",
    },
  },
  {
    id: "notes",
    href: "/library/notes/",
    label: { zh: "筆記", en: "Notes" },
    lead: {
      zh: "學習筆記與速記。",
      en: "Learning notes and quick captures.",
    },
  },
];

export const UI = {
  zh: {
    brand: "Py Chen",
    menuOpen: "開啟選單",
    menuClose: "關閉選單",
    backToTop: "回到頂部",
    themeGroup: "外觀",
    themeLight: "日間",
    themeDark: "夜間",
    updatedAt: (date) => `更新日期：${date}`,
    contactLabel: "聯繫方式",
    contactSep: "：",
    footerNote: "個人網站 · 作品、書寫與紀錄",
    projectsEyebrow: "作品",
    projectsTitle: "作品",
    libraryEyebrow: "文庫",
    libraryTitle: "文庫",
    libraryLead: "生活裡的書寫——手冊、隨筆、故事與筆記。",
    libraryEmpty: "尚無文章。",
    libraryBack: "← 返回目錄",
    libraryToc: "本篇目錄",
    libraryArticles: "文章目錄",
    siteTree: "站點目錄",
    aboutEyebrow: "關於",
    aboutTitle: "關於",
    aboutLead: "履歷、活動與學習證書。",
    cta: {
      aiHub: "AI 工作流集成",
      immersive: "沉浸式實驗室",
      apps: "應用程式與插件",
    },
    learningTitle: "學習軌跡",
    learningLead: "Coursera 學習軌跡與證書——課程、機構與驗證連結。",
    cvTitle: "個人簡歷",
    cvLead: "履歷、榮譽、演講與活動——內容整理中，稍後補上。",
    cvEmpty: "內容即將上架。",
    viewCertificate: "查看證書 →",
    gradeLabel: "成績",
    expandLearning: (n) => `展開 ${n} 張證書`,
    collapseLearning: "收合證書",
    status: { live: "上線", wip: "進行中", coming: "即將上架" },
    linkShowcase: "展示頁 →",
    linkRepo: "原始碼",
    linkAppStore: "App Store",
    loadError: "無法載入資料。",
    readError: "找不到這篇文章。",
  },
  en: {
    brand: "Py Chen",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    backToTop: "Back to top",
    themeGroup: "Appearance",
    themeLight: "Day",
    themeDark: "Night",
    updatedAt: (date) => `Updated: ${date}`,
    contactLabel: "Contact",
    contactSep: ": ",
    footerNote: "Personal site · projects, writing, and notes",
    projectsEyebrow: "Projects",
    projectsTitle: "Projects",
    libraryEyebrow: "Library",
    libraryTitle: "Library",
    libraryLead: "Writing from life—manuals, essays, stories, and notes.",
    libraryEmpty: "No articles yet.",
    libraryBack: "← Back to index",
    libraryToc: "On this page",
    libraryArticles: "Articles",
    siteTree: "Site map",
    aboutEyebrow: "About",
    aboutTitle: "About",
    aboutLead: "CV, events, and learning certificates.",
    cta: {
      aiHub: "AI Hub",
      immersive: "Immersive Lab",
      apps: "Apps & Plugins",
    },
    learningTitle: "Learning",
    learningLead:
      "Coursera learning journey and certificates—courses, institutions, and verification links.",
    cvTitle: "CV & Events",
    cvLead: "CV, honors, talks, and events—coming soon.",
    cvEmpty: "Content coming soon.",
    viewCertificate: "View certificate →",
    gradeLabel: "Grade",
    expandLearning: (n) => `Show ${n} certificates`,
    collapseLearning: "Hide certificates",
    status: { live: "Live", wip: "WIP", coming: "Coming" },
    linkShowcase: "Showcase →",
    linkRepo: "Source",
    linkAppStore: "App Store",
    loadError: "Failed to load data.",
    readError: "Article not found.",
  },
};

let lang = "zh";
const langListeners = new Set();

export function getLang() {
  return lang;
}

export function t(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value !== "object") return String(value);
  const picked = value[lang] ?? value.en ?? value.zh;
  if (picked == null) return "";
  if (typeof picked === "string") return picked;
  return String(picked);
}

export function ui(key) {
  return UI[lang][key];
}

export function detectLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (SUPPORTED.includes(saved)) return saved;
  const list =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language, navigator.userLanguage];
  for (const item of list) {
    if (String(item || "")
      .toLowerCase()
      .startsWith("zh")) {
      return "zh";
    }
  }
  return "en";
}

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return systemTheme();
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll("[data-theme-choice]").forEach((btn) => {
    const active = btn.dataset.themeChoice === theme;
    btn.setAttribute("aria-pressed", String(active));
    btn.classList.toggle("is-active", active);
  });
}

export function setTheme(theme) {
  if (theme !== "light" && theme !== "dark") return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function ensureThemeSwitch() {
  const end = document.querySelector(".nav-end");
  if (!end) return;
  let group = document.getElementById("theme-switch");
  if (!group) {
    group = document.createElement("div");
    group.id = "theme-switch";
    group.className = "theme-switch";
    group.setAttribute("role", "group");
    end.appendChild(group);
  }
  group.setAttribute("aria-label", ui("themeGroup"));
  group.replaceChildren();

  const light = document.createElement("button");
  light.type = "button";
  light.className = "theme-btn";
  light.dataset.themeChoice = "light";
  light.setAttribute("aria-label", ui("themeLight"));
  light.title = ui("themeLight");
  light.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5-2.5a1 1 0 1 1 0-2H18a1 1 0 1 1 0 2h1.5ZM7 12a1 1 0 0 1-1 1H4.5a1 1 0 1 1 0-2H6a1 1 0 0 1 1 1Zm9.95 5.45a1 1 0 0 1-1.4 1.4l-1.1-1.1a1 1 0 1 1 1.4-1.4l1.1 1.1ZM9.55 8.05a1 1 0 0 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 1.4l-1.1 1.1Zm7.85-2.5a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 1 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0ZM9.55 15.95l-1.1 1.1a1 1 0 1 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 1.4ZM12 17a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1Z"/></svg>';
  light.addEventListener("click", () => setTheme("light"));

  const dark = document.createElement("button");
  dark.type = "button";
  dark.className = "theme-btn";
  dark.dataset.themeChoice = "dark";
  dark.setAttribute("aria-label", ui("themeDark"));
  dark.title = ui("themeDark");
  dark.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.5 3.5a1 1 0 0 1 1.1 1.35A7.5 7.5 0 1 0 19.15 16a1 1 0 0 1 1.35-1.1A9.5 9.5 0 1 1 14.5 3.5Z"/></svg>';
  dark.addEventListener("click", () => setTheme("dark"));

  group.append(light, dark);
  applyTheme(resolveTheme());
}

export function bindThemeSystemListener() {
  if (window.__themeListenerBound) return;
  window.__themeListenerBound = true;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (localStorage.getItem(THEME_KEY) == null) applyTheme(systemTheme());
  };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else mq.addListener(onChange);
}

export function setLang(next) {
  if (!SUPPORTED.includes(next) || next === lang) return;
  lang = next;
  localStorage.setItem(LANG_KEY, lang);
  for (const fn of langListeners) fn();
}

export function onLangChange(fn) {
  langListeners.add(fn);
  return () => langListeners.delete(fn);
}

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = typeof text === "string" ? text : t(text);
  return node;
}

export function assetUrl(file) {
  return `/assets/coursera/${file}?v=${ASSET_VERSION}`;
}

function formatUpdatedAt() {
  const [y, m, d] = UPDATED_AT.split("-").map(Number);
  if (!y || !m || !d) return UPDATED_AT;
  if (lang === "zh") return `${y} 年 ${m} 月 ${d} 日`;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function isDesktopTree() {
  return window.matchMedia("(min-width: 960px)").matches;
}

function ensureTreeBackdrop() {
  let backdrop = document.getElementById("site-tree-backdrop");
  if (backdrop) return backdrop;
  backdrop = document.createElement("button");
  backdrop.type = "button";
  backdrop.id = "site-tree-backdrop";
  backdrop.className = "site-tree-backdrop";
  backdrop.setAttribute("aria-label", ui("menuClose"));
  backdrop.tabIndex = -1;
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", () => closeNav());
  return backdrop;
}

export function setNavOpen(open) {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("nav-toggle");
  if (isDesktopTree()) open = false;
  document.body.classList.toggle("is-tree-open", open);
  if (nav) nav.classList.toggle("is-open", open);
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-controls", "site-tree");
    toggle.setAttribute("aria-label", open ? ui("menuClose") : ui("menuOpen"));
  }
  const backdrop = document.getElementById("site-tree-backdrop");
  if (backdrop) backdrop.setAttribute("aria-hidden", String(!open));
  document.documentElement.style.overflow = open && !isDesktopTree() ? "hidden" : "";
}

export function closeNav() {
  setNavOpen(false);
}

export function renderSiteNav(activeId) {
  const nav = document.getElementById("nav-links");
  if (!nav) return;
  nav.replaceChildren();
  for (const item of SITE_NAV) {
    const a = el("a", item.id === activeId ? "is-active" : null, t(item.label));
    a.href = item.href;
    a.addEventListener("click", closeNav);
    nav.appendChild(a);
  }
}

export function bindNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  if (!toggle || toggle.dataset.bound) return;
  toggle.dataset.bound = "1";
  ensureTreeBackdrop();
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!open);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
  window.addEventListener(
    "resize",
    () => {
      if (isDesktopTree()) closeNav();
    },
    { passive: true }
  );
}

export function bindLangToggle() {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

export function bindBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = "1";

  const sync = () => {
    const show = window.scrollY > Math.min(420, window.innerHeight * 0.55);
    btn.hidden = !show;
    btn.classList.toggle("is-visible", show);
  };

  window.addEventListener("scroll", sync, { passive: true });
  sync();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeNav();
  });
}

export function applyChrome({ activeNav, title } = {}) {
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";

  const brand = document.querySelector(".nav-brand");
  if (brand) brand.textContent = ui("brand");

  renderSiteNav(activeNav);

  const footerBrand = document.getElementById("footer-brand");
  if (footerBrand) footerBrand.textContent = ui("brand");

  const footerNote = document.getElementById("footer-note");
  if (footerNote) footerNote.textContent = ui("footerNote");

  const contactLabel = document.getElementById("footer-contact-label");
  if (contactLabel) contactLabel.textContent = `${ui("contactLabel")}${ui("contactSep")}`;

  const footerUpdated = document.getElementById("footer-updated");
  if (footerUpdated) footerUpdated.textContent = ui("updatedAt")(formatUpdatedAt());

  const backTop = document.getElementById("back-to-top");
  if (backTop) backTop.setAttribute("aria-label", ui("backToTop"));

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.setAttribute("aria-pressed", String(active));
    btn.classList.toggle("is-active", active);
  });

  ensureThemeSwitch();

  const toggle = document.getElementById("nav-toggle");
  if (toggle) {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-label", open ? ui("menuClose") : ui("menuOpen"));
  }

  if (title) document.title = `${ui("brand")} — ${title}`;
}

export function bindSky() {
  const sky = document.querySelector(".sky");
  if (!sky || sky.dataset.bound) return;
  sky.dataset.bound = "1";
  window.addEventListener(
    "pointermove",
    (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 4;
      sky.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
    },
    { passive: true }
  );
}

let libraryTreeCache = null;
let treeActiveNav = "projects";

function currentArticleSlug() {
  return new URLSearchParams(window.location.search).get("id") || "";
}

function currentLibrarySection() {
  return document.body.dataset.section || "";
}

function ensureSiteTree() {
  ensureTreeBackdrop();
  let tree = document.getElementById("site-tree");
  if (tree) return tree;
  tree = document.createElement("aside");
  tree.id = "site-tree";
  tree.className = "site-tree";
  tree.setAttribute("aria-label", "Site");
  document.body.appendChild(tree);
  document.body.classList.add("has-site-tree");
  return tree;
}

function bindTreeLinkClose(anchor) {
  anchor.addEventListener("click", () => {
    if (!isDesktopTree()) closeNav();
  });
}

async function loadLibraryTree() {
  if (libraryTreeCache) return libraryTreeCache;
  const sections = [];
  for (const section of LIBRARY_SECTIONS) {
    try {
      const res = await fetch(
        `/data/library/${section.id}/index.json?v=${ASSET_VERSION}`,
        { cache: "no-cache" }
      );
      const data = res.ok ? await res.json() : { items: [] };
      sections.push({ ...section, items: data.items || [] });
    } catch {
      sections.push({ ...section, items: [] });
    }
  }
  libraryTreeCache = sections;
  return sections;
}

function renderSiteTree() {
  const tree = ensureSiteTree();
  const activeSection = currentLibrarySection();
  const activeSlug = currentArticleSlug();
  const sections = libraryTreeCache || [];

  tree.replaceChildren();
  tree.setAttribute("aria-label", ui("siteTree"));

  const brand = el("a", "site-tree-brand", ui("brand"));
  brand.href = "/projects/";
  bindTreeLinkClose(brand);
  tree.appendChild(brand);

  const label = el("p", "site-tree-label", ui("siteTree"));
  tree.appendChild(label);

  const root = el("ul", "site-tree-list");

  // Projects
  const projectsLi = el("li", "site-tree-node");
  const projectsLink = el(
    "a",
    treeActiveNav === "projects" ? "is-active" : null,
    t(SITE_NAV[0].label)
  );
  projectsLink.href = "/projects/";
  bindTreeLinkClose(projectsLink);
  projectsLi.appendChild(projectsLink);
  root.appendChild(projectsLi);

  // Library + branches + articles
  const libraryLi = el("li", "site-tree-node has-children");
  const libraryLink = el(
    "a",
    treeActiveNav === "library" && !activeSection ? "is-active" : null,
    t(SITE_NAV[1].label)
  );
  libraryLink.href = "/library/";
  bindTreeLinkClose(libraryLink);
  libraryLi.appendChild(libraryLink);

  const sectionList = el("ul", "site-tree-list nested");
  for (const section of sections.length ? sections : LIBRARY_SECTIONS) {
    const items = section.items || [];
    const secLi = el("li", "site-tree-node has-children");
    const secActive =
      treeActiveNav === "library" && activeSection === section.id && !activeSlug;
    const secLink = el("a", secActive ? "is-active" : null, t(section.label));
    secLink.href = section.href;
    bindTreeLinkClose(secLink);
    secLi.appendChild(secLink);

    if (items.length) {
      const articleList = el("ul", "site-tree-list nested articles");
      for (const item of items) {
        const artLi = el("li", "site-tree-node article");
        const artActive =
          activeSection === section.id && activeSlug === item.slug;
        const artLink = el("a", artActive ? "is-active" : null, t(item.title));
        artLink.href = `${section.href}?id=${encodeURIComponent(item.slug)}`;
        bindTreeLinkClose(artLink);
        artLi.appendChild(artLink);
        articleList.appendChild(artLi);
      }
      secLi.appendChild(articleList);
    }
    sectionList.appendChild(secLi);
  }
  libraryLi.appendChild(sectionList);
  root.appendChild(libraryLi);

  // About
  const aboutLi = el("li", "site-tree-node");
  const aboutLink = el(
    "a",
    treeActiveNav === "about" ? "is-active" : null,
    t(SITE_NAV[2].label)
  );
  aboutLink.href = "/about/";
  bindTreeLinkClose(aboutLink);
  aboutLi.appendChild(aboutLink);
  root.appendChild(aboutLi);

  tree.appendChild(root);
}

export function bootSite({ activeNav, onLang } = {}) {
  lang = detectLang();
  treeActiveNav = activeNav || "projects";
  applyTheme(resolveTheme());
  bindThemeSystemListener();
  bindLangToggle();
  bindNavToggle();
  bindBackToTop();
  bindSky();
  applyChrome({ activeNav });
  ensureSiteTree();
  renderSiteTree();
  loadLibraryTree().then(() => renderSiteTree());

  if (onLang) {
    onLangChange(() => {
      applyChrome({ activeNav });
      renderSiteTree();
      onLang();
    });
  } else {
    onLangChange(() => {
      applyChrome({ activeNav });
      renderSiteTree();
    });
  }
}
