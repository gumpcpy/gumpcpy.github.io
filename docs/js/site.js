export const LANG_KEY = "catalogue-lang";
export const THEME_KEY = "catalogue-theme";
export const SUPPORTED = ["zh", "en"];
export const ASSET_VERSION = "20260929e";
export const UPDATED_AT = "2026-09-15";

export const SITE_NAV = [
  { id: "work", label: { zh: "作品", en: "Work" }, panel: "work" },
  { id: "about", label: { zh: "關於我", en: "About" }, panel: "about", href: "/profile/" },
];

export const ABOUT_LINKS = [
  { id: "experience", href: "/profile/#experience", label: { zh: "經歷", en: "Experience" } },
  { id: "talks", href: "/profile/#talks", label: { zh: "演講／分享", en: "Talks" } },
  { id: "certifications", href: "/profile/#certifications", label: { zh: "證明", en: "Credentials" } },
  { id: "contact", href: "/profile/#contact", label: { zh: "聯繫", en: "Contact" } },
];

export const SECTION_KEYS = [
  "problem",
  "idea",
  "method",
  "system",
  "demo",
  "notes",
];

export function categoryHref(catId) {
  return `/work/?cat=${encodeURIComponent(catId)}`;
}

export const UI = {
  zh: {
    brand: "Py Chen",
    menuOpen: "開啟選單",
    menuClose: "關閉選單",
    homeAria: "首頁",
    workMenu: "作品目錄",
    aboutMenu: "關於我",
    backToTop: "回到頂部",
    themeGroup: "外觀",
    themeLight: "日間",
    themeDark: "夜間",
    updatedAt: (date) => `更新日期：${date}`,
    itemUpdatedAt: (date) => `最後更新：${date}`,
    contactLabel: "聯繫方式",
    contactSep: "：",
    footerNote: "個人網站 · 系統、案例與檔案",
    homeEyebrow: "首頁",
    homeTitle: "Py Chen",
    homeLead:
      "影視製作與軟體工程交會——系統設計、AI 工作流、沉浸式體驗與獨立應用。",
    homeLatest: "最新項目",
    workEyebrow: "作品",
    workTitle: "作品",
    workLead: "選擇一個專題深入閱讀。",
    workEmpty: "此分類尚無項目。",
    workBack: "← 返回",
    workCrumb: "目前位置",
    workPrev: "上一項",
    workNext: "下一項",
    workOpenDemo: "開啟 Demo →",
    workViewItem: "閱讀 →",
    workItemSoon: "撰寫中",
    workNotReady: "此項目尚在整理，稍後開放。",
    workDownload: "下載／展示 →",
    workScreenshots: "產品截圖",
    workRepo: "Private repo →",
    galleryPrev: "上一張",
    galleryNext: "下一張",
    lightboxClose: "關閉",
    sectionLabels: {
      problem: "Problem",
      idea: "Idea",
      method: "Method",
      system: "System",
      demo: "Demo",
      notes: "Notes",
    },
    profileEyebrow: "關於我",
    profileTitle: "關於我",
    profileLead: "經歷、演講、證明與聯繫方式。",
    profileEmpty: "內容整理中。",
    viewCertificate: "查看證書 →",
    gradeLabel: "成績",
    expandLearning: (n) => `展開 ${n} 張證書`,
    collapseLearning: "收合證書",
    status: { live: "上線", wip: "進行中", coming: "即將上架" },
    linkShowcase: "展示頁 →",
    linkRepo: "原始碼",
    loadError: "無法載入資料。",
    readError: "找不到這個項目。",
  },
  en: {
    brand: "Py Chen",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    homeAria: "Home",
    workMenu: "Work",
    aboutMenu: "About",
    backToTop: "Back to top",
    themeGroup: "Appearance",
    themeLight: "Day",
    themeDark: "Night",
    updatedAt: (date) => `Updated: ${date}`,
    itemUpdatedAt: (date) => `Last updated: ${date}`,
    contactLabel: "Contact",
    contactSep: ": ",
    footerNote: "Personal site · systems, cases, and profile",
    homeEyebrow: "Home",
    homeTitle: "Py Chen",
    homeLead:
      "Where film production meets software—systems, AI workflows, immersive experiences, and independent apps.",
    homeLatest: "Latest",
    workEyebrow: "Work",
    workTitle: "Work",
    workLead: "Open a project page to read in depth.",
    workEmpty: "No items in this category yet.",
    workBack: "← Back",
    workCrumb: "You are here",
    workPrev: "Previous",
    workNext: "Next",
    workOpenDemo: "Open demo →",
    workViewItem: "Read →",
    workItemSoon: "Writing",
    workNotReady: "This item is still being prepared.",
    workDownload: "Download / showcase →",
    workScreenshots: "Screenshots",
    workRepo: "Private repo →",
    galleryPrev: "Previous",
    galleryNext: "Next",
    lightboxClose: "Close",
    sectionLabels: {
      problem: "Problem",
      idea: "Idea",
      method: "Method",
      system: "System",
      demo: "Demo",
      notes: "Notes",
    },
    profileEyebrow: "About",
    profileTitle: "About",
    profileLead: "Experience, talks, credentials, and contact.",
    profileEmpty: "Content forthcoming.",
    viewCertificate: "View certificate →",
    gradeLabel: "Grade",
    expandLearning: (n) => `Show ${n} certificates`,
    collapseLearning: "Hide certificates",
    status: { live: "Live", wip: "WIP", coming: "Coming" },
    linkShowcase: "Showcase →",
    linkRepo: "Source",
    loadError: "Failed to load data.",
    readError: "Item not found.",
  },
};

let lang = "zh";
const langListeners = new Set();
let workTreeCache = null;
let workIndexCache = null;
let openPanel = null; // 'work' | 'about' | null

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
    const burger = document.getElementById("nav-toggle");
    if (burger) end.insertBefore(group, burger);
    else end.appendChild(group);
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

export function itemHref(id) {
  return `/work/item/?id=${encodeURIComponent(id)}`;
}

export function getIndexItem(id) {
  return (workIndexCache?.items || []).find((x) => x.id === id) || null;
}

/** Only explicit ready:true is open; missing/false stays disabled. */
export function isItemReady(metaOrId) {
  if (metaOrId == null) return false;
  if (typeof metaOrId === "object") return metaOrId.ready === true;
  const hit = getIndexItem(metaOrId);
  return hit?.ready === true;
}

/** Wire an anchor: ready → real link; else visible but not clickable. */
export function bindItemLink(anchor, id, { onClick } = {}) {
  const ready = isItemReady(id);
  anchor.classList.toggle("is-disabled", !ready);
  if (ready) {
    anchor.href = itemHref(id);
    anchor.removeAttribute("aria-disabled");
    anchor.removeAttribute("tabindex");
    if (onClick) anchor.addEventListener("click", onClick);
  } else {
    anchor.removeAttribute("href");
    anchor.setAttribute("aria-disabled", "true");
    anchor.setAttribute("tabindex", "-1");
    anchor.title = ui("workItemSoon");
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }
  return anchor;
}

export function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  if (lang === "zh") return `${y} 年 ${m} 月 ${d} 日`;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatSiteUpdatedAt() {
  return formatDate(UPDATED_AT);
}

function isDesktopNav() {
  return window.matchMedia("(min-width: 900px)").matches;
}

function ensureMegaPanel() {
  let panel = document.getElementById("mega-panel");
  if (panel) return panel;
  panel = document.createElement("div");
  panel.id = "mega-panel";
  panel.className = "mega-panel";
  panel.hidden = true;
  document.body.appendChild(panel);
  return panel;
}

function ensureMegaBackdrop() {
  let backdrop = document.getElementById("mega-backdrop");
  if (backdrop) return backdrop;
  backdrop = document.createElement("button");
  backdrop.type = "button";
  backdrop.id = "mega-backdrop";
  backdrop.className = "mega-backdrop";
  backdrop.setAttribute("aria-label", ui("menuClose"));
  backdrop.hidden = true;
  backdrop.tabIndex = -1;
  backdrop.addEventListener("click", () => closeNav());
  document.body.appendChild(backdrop);
  return backdrop;
}

function setPanelBackdrop(open) {
  const backdrop = ensureMegaBackdrop();
  document.body.classList.toggle("is-panel-open", open);
  backdrop.hidden = !open;
  backdrop.classList.toggle("is-open", open);
}

function ensureMobileSheet() {
  let sheet = document.getElementById("mobile-menu");
  if (sheet) return sheet;
  sheet = document.createElement("div");
  sheet.id = "mobile-menu";
  sheet.className = "mobile-sheet";
  sheet.hidden = true;
  document.body.appendChild(sheet);
  return sheet;
}

export function closePanels() {
  openPanel = null;
  const panel = document.getElementById("mega-panel");
  if (panel) {
    panel.hidden = true;
    panel.classList.remove("is-open");
  }
  document.querySelectorAll(".nav-pill").forEach((b) => {
    b.classList.remove("is-open");
    b.setAttribute("aria-expanded", "false");
  });
  if (!document.body.classList.contains("is-nav-open")) {
    setPanelBackdrop(false);
  }
}

export function setNavOpen(open) {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("nav-toggle");
  const menu = ensureMobileSheet();
  if (isDesktopNav()) open = false;
  document.body.classList.toggle("is-nav-open", open);
  if (nav) nav.classList.toggle("is-open", open);
  if (toggle) {
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? ui("menuClose") : ui("menuOpen"));
  }
  menu.hidden = !open;
  menu.classList.toggle("is-open", open);
  document.documentElement.style.overflow = open && !isDesktopNav() ? "hidden" : "";
  if (!open) closePanels();
  else setPanelBackdrop(true);
}

export function closeNav() {
  setNavOpen(false);
  closePanels();
}

export function resolveActiveNav(hint) {
  if (hint) return hint;
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "") return "home";
  if (path.startsWith("/profile")) return "about";
  if (path.startsWith("/work")) return "work";
  return "home";
}

function titleForId(id) {
  const hit = (workIndexCache?.items || []).find((x) => x.id === id);
  return hit ? t(hit.title) : id;
}

function renderWorkMega(container) {
  container.replaceChildren();
  const inner = el("div", "mega-inner");
  const taxonomy = workTreeCache;
  const cats = taxonomy?.categories || [];
  for (const cat of cats) {
    const col = el("div", "mega-col");
    col.appendChild(el("p", "mega-col-title", t(cat.label)));
    const list = el("ul", "mega-list");
    for (const id of cat.itemIds || []) {
      const li = document.createElement("li");
      const a = el("a", null, titleForId(id));
      bindItemLink(a, id, { onClick: closeNav });
      li.appendChild(a);
      list.appendChild(li);
    }
    col.appendChild(list);
    inner.appendChild(col);
  }
  container.appendChild(inner);
}

function renderAboutMega(container) {
  container.replaceChildren();
  const inner = el("div", "mega-inner mega-inner-about");
  const list = el("ul", "mega-list");
  for (const link of ABOUT_LINKS) {
    const li = document.createElement("li");
    const a = el("a", null, t(link.label));
    a.href = link.href;
    a.addEventListener("click", closeNav);
    li.appendChild(a);
    list.appendChild(li);
  }
  inner.appendChild(list);
  container.appendChild(inner);
}

function openMega(kind) {
  if (!isDesktopNav()) return;
  const panel = ensureMegaPanel();
  openPanel = kind;
  panel.hidden = false;
  panel.classList.add("is-open");
  setPanelBackdrop(true);
  if (kind === "work") renderWorkMega(panel);
  else renderAboutMega(panel);
  document.querySelectorAll(".nav-pill").forEach((b) => {
    const on = b.dataset.panel === kind;
    b.classList.toggle("is-open", on);
    b.setAttribute("aria-expanded", String(on));
  });
}

function renderMobileSheet() {
  const sheet = ensureMobileSheet();
  sheet.replaceChildren();
  const close = document.createElement("button");
  close.type = "button";
  close.className = "mobile-close";
  close.setAttribute("aria-label", ui("menuClose"));
  close.innerHTML = "&times;";
  close.addEventListener("click", () => closeNav());
  sheet.appendChild(close);

  const body = el("div", "mobile-sheet-body");
  body.appendChild(el("p", "mobile-section-label", ui("workMenu")));
  for (const cat of workTreeCache?.categories || []) {
    body.appendChild(el("p", "mobile-cat-title", t(cat.label)));
    for (const id of cat.itemIds || []) {
      const a = el("a", "mobile-link", titleForId(id));
      bindItemLink(a, id, { onClick: closeNav });
      body.appendChild(a);
    }
  }
  body.appendChild(el("p", "mobile-section-label", ui("aboutMenu")));
  for (const link of ABOUT_LINKS) {
    const a = el("a", "mobile-link", t(link.label));
    a.href = link.href;
    a.addEventListener("click", closeNav);
    body.appendChild(a);
  }
  sheet.appendChild(body);
}

export function renderSiteNav(activeId) {
  const active = resolveActiveNav(activeId);
  const desktop = document.getElementById("nav-desktop");
  if (desktop) {
    desktop.replaceChildren();
    for (const item of SITE_NAV) {
      if (item.id === "about") {
        const wrap = el("div", "nav-pill-wrap");
        const a = el("a", `nav-pill${item.id === active ? " is-active" : ""}`, t(item.label));
        a.href = item.href;
        a.dataset.panel = "about";
        a.addEventListener("mouseenter", () => {
          if (isDesktopNav()) openMega("about");
        });
        a.addEventListener("focus", () => {
          if (isDesktopNav()) openMega("about");
        });
        a.addEventListener("click", () => closeNav());
        wrap.appendChild(a);
        desktop.appendChild(wrap);
        continue;
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `nav-pill${item.id === active ? " is-active" : ""}`;
      btn.textContent = t(item.label);
      btn.dataset.panel = item.panel;
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-haspopup", "true");
      btn.addEventListener("mouseenter", () => {
        if (isDesktopNav()) openMega(item.panel);
      });
      btn.addEventListener("focus", () => {
        if (isDesktopNav()) openMega(item.panel);
      });
      btn.addEventListener("click", (e) => {
        if (!isDesktopNav()) return;
        e.preventDefault();
        if (openPanel === item.panel) closePanels();
        else openMega(item.panel);
      });
      desktop.appendChild(btn);
    }
  }

  const home = document.querySelector(".nav-home");
  if (home) {
    home.setAttribute("aria-label", ui("homeAria"));
    home.classList.toggle("is-active", active === "home");
  }

  renderMobileSheet();
}

export function bindNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  if (!toggle || toggle.dataset.bound) return;
  toggle.dataset.bound = "1";
  ensureMobileSheet();
  ensureMegaPanel();
  ensureMegaBackdrop();

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (!open) renderMobileSheet();
    setNavOpen(!open);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // close mega when leaving nav + panel
  const nav = document.querySelector(".nav");
  const panel = ensureMegaPanel();
  const leaveTimer = { id: null };
  const scheduleClose = () => {
    clearTimeout(leaveTimer.id);
    leaveTimer.id = setTimeout(() => {
      if (isDesktopNav()) closePanels();
    }, 180);
  };
  const cancelClose = () => clearTimeout(leaveTimer.id);
  if (nav) {
    nav.addEventListener("mouseleave", scheduleClose);
    nav.addEventListener("mouseenter", cancelClose);
  }
  panel.addEventListener("mouseleave", scheduleClose);
  panel.addEventListener("mouseenter", cancelClose);

  window.addEventListener(
    "resize",
    () => {
      if (isDesktopNav()) setNavOpen(false);
      else closePanels();
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
  if (brand) {
    brand.textContent = ui("brand");
    brand.href = "/";
  }

  renderSiteNav(activeNav);

  const footerBrand = document.getElementById("footer-brand");
  if (footerBrand) footerBrand.textContent = ui("brand");

  const footerNote = document.getElementById("footer-note");
  if (footerNote) footerNote.textContent = ui("footerNote");

  const contactLabel = document.getElementById("footer-contact-label");
  if (contactLabel) contactLabel.textContent = `${ui("contactLabel")}${ui("contactSep")}`;

  const footerUpdated = document.getElementById("footer-updated");
  if (footerUpdated) footerUpdated.textContent = ui("updatedAt")(formatSiteUpdatedAt());

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

export async function loadWorkTaxonomy() {
  if (workTreeCache) return workTreeCache;
  const res = await fetch(`/data/work/taxonomy.json?v=${ASSET_VERSION}`, {
    cache: "no-cache",
  });
  if (!res.ok) throw new Error(`taxonomy ${res.status}`);
  workTreeCache = await res.json();
  return workTreeCache;
}

export async function loadWorkItem(id) {
  const res = await fetch(`/data/work/items/${encodeURIComponent(id)}.json?v=${ASSET_VERSION}`, {
    cache: "no-cache",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function loadWorkIndex() {
  if (workIndexCache) return workIndexCache;
  const res = await fetch(`/data/work/index.json?v=${ASSET_VERSION}`, {
    cache: "no-cache",
  });
  if (!res.ok) throw new Error(`index ${res.status}`);
  workIndexCache = await res.json();
  return workIndexCache;
}

export function findCategory(taxonomy, categoryId) {
  const cats = taxonomy?.categories || [];
  for (const cat of cats) {
    if (cat.id === categoryId) return { category: cat };
  }
  // legacy nested groups
  for (const group of taxonomy?.groups || []) {
    for (const cat of group.categories || []) {
      if (cat.id === categoryId) return { group, category: cat };
    }
  }
  return null;
}

export function findItemContext(taxonomy, itemId) {
  const cats = taxonomy?.categories || [];
  const scan = (cat) => {
    const ids = cat.itemIds || [];
    const idx = ids.indexOf(itemId);
    if (idx >= 0) {
      return {
        category: cat,
        itemIds: ids,
        index: idx,
        prevId: idx > 0 ? ids[idx - 1] : null,
        nextId: idx < ids.length - 1 ? ids[idx + 1] : null,
      };
    }
    return null;
  };
  for (const cat of cats) {
    const hit = scan(cat);
    if (hit) return hit;
  }
  for (const group of taxonomy?.groups || []) {
    for (const cat of group.categories || []) {
      const hit = scan(cat);
      if (hit) return hit;
    }
  }
  return null;
}

export function navIdForCategory() {
  return "work";
}

export function bootSite({ activeNav, onLang } = {}) {
  lang = detectLang();
  applyTheme(resolveTheme());
  bindThemeSystemListener();
  bindLangToggle();
  bindNavToggle();
  bindBackToTop();
  bindSky();
  applyChrome({ activeNav });

  Promise.all([loadWorkTaxonomy(), loadWorkIndex()])
    .then(() => {
      renderSiteNav(activeNav);
    })
    .catch((err) => console.error(err));

  if (onLang) {
    onLangChange(() => {
      applyChrome({ activeNav });
      onLang();
    });
  } else {
    onLangChange(() => {
      applyChrome({ activeNav });
    });
  }
}
