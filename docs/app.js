const LANG_KEY = "catalogue-lang";
const SUPPORTED = ["zh", "en"];
const ASSET_VERSION = "20260721f";
/** Site content last updated (YYYY-MM-DD). Bump when publishing content changes. */
const UPDATED_AT = "2026-07-21";

const UI = {
  zh: {
    eyebrow: "作品目錄 · 個人簡歷",
    menuOpen: "開啟選單",
    menuClose: "關閉選單",
    backToTop: "回到頂部",
    updatedAt: (date) => `更新日期：${date}`,
    cta: {
      aiHub: "AI 工作流集成",
      immersive: "沉浸式實驗室",
      apps: "應用程式 & 插件",
      learning: "學習軌跡",
      cv: "個人簡歷",
    },
    learningNav: "學習軌跡",
    learningTitle: "學習軌跡",
    learningLead: "Coursera 學習軌跡與證書——課程、機構與驗證連結。",
    cvNav: "個人簡歷",
    cvTitle: "個人簡歷",
    cvLead: "履歷、榮譽、演講與活動——內容整理中，稍後補上。",
    cvEmpty: "內容即將上架。",
    viewCertificate: "查看證書 →",
    gradeLabel: "成績",
    expandLearning: (n) => `展開 ${n} 張證書`,
    collapseLearning: "收合證書",
    footerNote: "個人作品目錄 · 持續新增",
    contactLabel: "聯繫方式",
    catalogueTitle: "作品目錄",
    status: { live: "上線", wip: "進行中", coming: "即將上架" },
    linkShowcase: "展示頁 →",
    linkRepo: "Repo",
    linkAppStore: "App Store",
    loadError: "無法載入作品資料。",
  },
  en: {
    eyebrow: "Catalogue · CV & Events",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    backToTop: "Back to top",
    updatedAt: (date) => `Updated: ${date}`,
    cta: {
      aiHub: "AI Hub",
      immersive: "Immersive Lab",
      apps: "Apps & Plugins",
      learning: "Learning",
      cv: "CV & Events",
    },
    learningNav: "Learning",
    learningTitle: "Learning",
    learningLead:
      "Coursera learning journey and certificates—courses, institutions, and verification links.",
    cvNav: "CV & Events",
    cvTitle: "CV & Events",
    cvLead: "CV, honors, talks, and events—coming soon.",
    cvEmpty: "Content coming soon.",
    viewCertificate: "View certificate →",
    gradeLabel: "Grade",
    expandLearning: (n) => `Show ${n} certificates`,
    collapseLearning: "Hide certificates",
    footerNote: "Personal catalogue · works added over time",
    contactLabel: "Contact",
    catalogueTitle: "Catalogue",
    status: { live: "Live", wip: "WIP", coming: "Coming" },
    linkShowcase: "Showcase →",
    linkRepo: "Repo",
    linkAppStore: "App Store",
    loadError: "Failed to load catalogue data.",
  },
};

let lang = "zh";
let catalogueData = null;
let learningData = null;
let learningExpanded = false;

/** Resolve bilingual field `{ zh, en }` or plain string. Never returns an object. */
function t(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value !== "object") return String(value);

  const picked = value[lang] ?? value.en ?? value.zh;
  if (picked == null) return "";
  if (typeof picked === "string") return picked;
  return String(picked);
}

function ui(key) {
  return UI[lang][key];
}

function detectLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  return "en";
}

function setLang(next) {
  if (!SUPPORTED.includes(next) || next === lang) return;
  lang = next;
  localStorage.setItem(LANG_KEY, lang);
  applyLanguage();
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) {
    node.textContent = typeof text === "string" ? text : t(text);
  }
  return node;
}

function assetUrl(file) {
  return `./assets/coursera/${file}?v=${ASSET_VERSION}`;
}

function setNavOpen(open) {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("nav-toggle");
  if (!nav || !toggle) return;
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? ui("menuClose") : ui("menuOpen"));
}

function closeNav() {
  setNavOpen(false);
}

function renderNav(pillars) {
  const nav = document.getElementById("nav-links");
  nav.replaceChildren();
  for (const p of pillars) {
    const a = el("a", null, t(p.label));
    a.href = `#${p.id}`;
    a.addEventListener("click", closeNav);
    nav.appendChild(a);
  }
  const learn = el("a", null, ui("learningNav"));
  learn.href = "#learning";
  learn.addEventListener("click", closeNav);
  nav.appendChild(learn);
  const cv = el("a", null, ui("cvNav"));
  cv.href = "#cv-events";
  cv.addEventListener("click", closeNav);
  nav.appendChild(cv);
}

function bindNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  if (!toggle || toggle.dataset.bound) return;
  toggle.dataset.bound = "1";
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
      if (window.matchMedia("(min-width: 860px)").matches) closeNav();
    },
    { passive: true }
  );
}

function renderHeroCtas() {
  const row = document.getElementById("cta-row");
  if (!row) return;
  const items = [
    { href: "#ai-hub", label: ui("cta").aiHub, primary: true },
    { href: "#immersive", label: ui("cta").immersive },
    { href: "#apps", label: ui("cta").apps },
    { href: "#learning", label: ui("cta").learning },
    { href: "#cv-events", label: ui("cta").cv },
  ];
  row.replaceChildren();
  for (const item of items) {
    const a = el("a", `btn ${item.primary ? "primary" : "ghost"}`, item.label);
    a.href = item.href;
    row.appendChild(a);
  }
}

function renderCard(project) {
  const card = el("article", `card ${project.status === "coming" ? "coming" : ""}`);

  const top = el("div", "card-top");
  top.appendChild(el("p", "meta", t(project.role) || ""));
  const statusLabel = ui("status")[project.status] || project.status;
  const badge = el("span", `status ${project.status}`, statusLabel);
  top.appendChild(badge);
  card.appendChild(top);

  card.appendChild(el("h3", null, t(project.title)));
  card.appendChild(el("p", "blurb", t(project.blurb)));

  if (project.stack?.length) {
    const ul = el("ul", "stack");
    for (const s of project.stack) ul.appendChild(el("li", null, s));
    card.appendChild(ul);
  }

  const links = project.links || {};
  const linkRow = el("div", "card-links");
  if (links.site) {
    const a = el("a", null, ui("linkShowcase"));
    a.href = links.site;
    a.target = "_blank";
    a.rel = "noopener";
    linkRow.appendChild(a);
  }
  if (links.repo) {
    const a = el("a", null, ui("linkRepo"));
    a.href = links.repo;
    a.target = "_blank";
    a.rel = "noopener";
    linkRow.appendChild(a);
  }
  if (links.appstore) {
    const a = el("a", null, ui("linkAppStore"));
    a.href = links.appstore;
    a.target = "_blank";
    a.rel = "noopener";
    linkRow.appendChild(a);
  }
  if (linkRow.childNodes.length) card.appendChild(linkRow);

  return card;
}

function renderPillars(data) {
  const main = document.getElementById("catalogue");
  main.replaceChildren();

  for (const pillar of data.pillars) {
    const section = el("section", "section");
    section.id = pillar.id;

    section.appendChild(el("h2", null, t(pillar.title)));
    section.appendChild(el("p", "section-lead", t(pillar.lead)));

    const grid = el("div", "card-grid");
    const items = data.projects.filter((p) => p.pillar === pillar.id);
    if (pillar.id === "immersive" || pillar.id === "apps" || items.length >= 3) {
      grid.classList.add("cols-3");
    }
    for (const project of items) {
      grid.appendChild(renderCard(project));
    }
    section.appendChild(grid);
    main.appendChild(section);
  }
}

function renderCertificate(cert) {
  const article = el("article", "cert");

  const body = el("div", "cert-body");

  const orgRow = el("div", "cert-org");
  if (cert.orgLogo) {
    const logo = document.createElement("img");
    logo.className = "cert-org-logo";
    logo.src = assetUrl(cert.orgLogo);
    logo.alt = "";
    logo.width = 36;
    logo.height = 36;
    orgRow.appendChild(logo);
  }
  orgRow.appendChild(el("p", "cert-org-name", t(cert.org)));
  body.appendChild(orgRow);

  body.appendChild(el("h3", null, t(cert.title)));

  const meta = el("p", "cert-meta");
  const parts = [t(cert.date), t(cert.hours)];
  if (cert.grade) parts.push(`${ui("gradeLabel")}: ${cert.grade}`);
  meta.textContent = parts.filter(Boolean).join(" · ");
  body.appendChild(meta);

  if (cert.url) {
    const a = el("a", "cert-link", ui("viewCertificate"));
    a.href = cert.url;
    a.target = "_blank";
    a.rel = "noopener";
    body.appendChild(a);
  }

  article.appendChild(body);

  if (cert.image) {
    const media = el("div", "cert-media");
    const img = document.createElement("img");
    img.src = assetUrl(cert.image);
    img.alt = t(cert.title);
    img.loading = "lazy";
    media.appendChild(img);
    article.appendChild(media);
  }

  return article;
}

function updateLearningToggle(count) {
  const btn = document.getElementById("learning-toggle");
  const list = document.getElementById("learning-list");
  const section = document.getElementById("learning");
  if (!btn || !list) return;

  const label = learningExpanded
    ? ui("collapseLearning")
    : ui("expandLearning")(count);

  btn.textContent = label;
  btn.setAttribute("aria-expanded", String(learningExpanded));
  list.hidden = !learningExpanded;
  section?.classList.toggle("is-expanded", learningExpanded);
}

function renderLearning(data) {
  const list = document.getElementById("learning-list");
  if (!list) return;

  const lead = document.getElementById("learning-lead");
  if (lead) lead.textContent = t(data.lead) || ui("learningLead");

  const certs = data.certificates || [];
  list.replaceChildren();
  for (const cert of certs) {
    list.appendChild(renderCertificate(cert));
  }
  updateLearningToggle(certs.length);
}

function bindLearningToggle() {
  const btn = document.getElementById("learning-toggle");
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = "1";
  btn.addEventListener("click", () => {
    learningExpanded = !learningExpanded;
    const count = learningData?.certificates?.length || 0;
    updateLearningToggle(count);
  });
}

function applyPerson(person) {
  const name = t(person.name);
  document.getElementById("person-name").textContent = name;
  document.getElementById("person-tagline").textContent = t(person.tagline);
  document.getElementById("person-about").textContent = t(person.about);
  const footerBrand = document.getElementById("footer-brand");
  if (footerBrand) footerBrand.textContent = name;
  document.title = `${name} — ${ui("catalogueTitle")}`;
}

function renderCvPlaceholder() {
  const title = document.getElementById("cv-title");
  if (title) title.textContent = ui("cvTitle");
  const lead = document.getElementById("cv-lead");
  if (lead) lead.textContent = ui("cvLead");
  const list = document.getElementById("cv-list");
  if (list) list.textContent = ui("cvEmpty");
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

function applyStaticUi() {
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";

  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = ui("eyebrow");

  renderHeroCtas();

  const learningTitle = document.getElementById("learning-title");
  if (learningTitle) learningTitle.textContent = ui("learningTitle");

  const footerNote = document.getElementById("footer-note");
  if (footerNote) footerNote.textContent = ui("footerNote");

  const contactLabel = document.getElementById("footer-contact-label");
  if (contactLabel) contactLabel.textContent = `${ui("contactLabel")}：`;

  const footerUpdated = document.getElementById("footer-updated");
  if (footerUpdated) footerUpdated.textContent = ui("updatedAt")(formatUpdatedAt());

  const backTop = document.getElementById("back-to-top");
  if (backTop) backTop.setAttribute("aria-label", ui("backToTop"));

  renderCvPlaceholder();

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.setAttribute("aria-pressed", String(active));
    btn.classList.toggle("is-active", active);
  });
}

function bindBackToTop() {
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

function applyLanguage() {
  applyStaticUi();
  if (catalogueData) {
    applyPerson(catalogueData.person);
    renderNav(catalogueData.pillars);
    renderPillars(catalogueData);
  }
  if (learningData) renderLearning(learningData);
  const toggle = document.getElementById("nav-toggle");
  if (toggle) {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-label", open ? ui("menuClose") : ui("menuOpen"));
  }
}

function bindLangToggle() {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

async function boot() {
  lang = detectLang();
  bindLangToggle();
  bindNavToggle();
  bindLearningToggle();
  bindBackToTop();
  applyStaticUi();

  const [projectsRes, learningRes] = await Promise.all([
    fetch(`./data/projects.json?v=${ASSET_VERSION}`, { cache: "no-cache" }),
    fetch(`./data/learning.json?v=${ASSET_VERSION}`, { cache: "no-cache" }),
  ]);

  if (!projectsRes.ok) throw new Error(`Failed to load projects.json (${projectsRes.status})`);
  if (!learningRes.ok) throw new Error(`Failed to load learning.json (${learningRes.status})`);

  catalogueData = await projectsRes.json();
  learningData = await learningRes.json();
  applyLanguage();
}

const sky = document.querySelector(".sky");
window.addEventListener(
  "pointermove",
  (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 6;
    const y = (e.clientY / window.innerHeight - 0.5) * 4;
    sky.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
  },
  { passive: true }
);

boot().catch((err) => {
  console.error(err);
  document.getElementById("catalogue").textContent = ui("loadError");
});
