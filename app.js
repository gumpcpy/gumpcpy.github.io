const LANG_KEY = "catalogue-lang";
const SUPPORTED = ["zh", "en"];

const UI = {
  zh: {
    eyebrow: "作品目錄 · 系統 · 產品",
    viewApps: "查看 Apps",
    github: "GitHub",
    learningNav: "學習軌跡",
    learningTitle: "學習軌跡",
    learningLead: "學習軌跡與證書——目前仍放在既有 portfolio 頁，之後可遷入本站。",
    learningCta: "Coursera 與學習旅程 →",
    footerNote: "個人作品目錄 · 持續新增",
    catalogueTitle: "作品目錄",
    status: { live: "上線", wip: "進行中", coming: "即將上架" },
    linkShowcase: "展示頁 →",
    linkRepo: "Repo",
    linkAppStore: "App Store",
    loadError: "無法載入作品資料。",
  },
  en: {
    eyebrow: "Catalogue · Systems · Products",
    viewApps: "View apps",
    github: "GitHub",
    learningNav: "Learning",
    learningTitle: "Learning",
    learningLead:
      "Learning journey and certificates—still on the existing portfolio page for now; may move here later.",
    learningCta: "Coursera & learning journey →",
    footerNote: "Personal catalogue · works added over time",
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

function t(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.en ?? value.zh ?? "";
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
  if (text != null) node.textContent = text;
  return node;
}

function renderNav(pillars) {
  const nav = document.getElementById("nav-links");
  nav.replaceChildren();
  for (const p of pillars) {
    const a = el("a", null, t(p.label));
    a.href = `#${p.id}`;
    nav.appendChild(a);
  }
  const learn = el("a", null, ui("learningNav"));
  learn.href = "#learning";
  nav.appendChild(learn);
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
    if (pillar.id === "immersive" || items.length >= 3) {
      grid.classList.add("cols-3");
    }
    for (const project of items) {
      grid.appendChild(renderCard(project));
    }
    section.appendChild(grid);
    main.appendChild(section);
  }
}

function applyPerson(person) {
  document.getElementById("person-name").textContent = person.name;
  document.getElementById("person-tagline").textContent = t(person.tagline);
  document.getElementById("person-about").textContent = t(person.about);
  document.getElementById("github-link").href = person.github;
  document.getElementById("learning-link").href = person.learningUrl;
  document.title = `${person.name} — ${ui("catalogueTitle")}`;
}

function applyStaticUi() {
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";

  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = ui("eyebrow");

  const viewApps = document.getElementById("cta-apps");
  if (viewApps) viewApps.textContent = ui("viewApps");

  const github = document.getElementById("github-link");
  if (github) github.textContent = ui("github");

  const ctaLearning = document.getElementById("cta-learning");
  if (ctaLearning) ctaLearning.textContent = ui("learningNav");

  const learningTitle = document.getElementById("learning-title");
  if (learningTitle) learningTitle.textContent = ui("learningTitle");

  const learningLead = document.getElementById("learning-lead");
  if (learningLead) learningLead.textContent = ui("learningLead");

  const learningLink = document.getElementById("learning-link");
  if (learningLink) learningLink.textContent = ui("learningCta");

  const footerNote = document.getElementById("footer-note");
  if (footerNote) footerNote.textContent = ui("footerNote");

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.setAttribute("aria-pressed", String(active));
    btn.classList.toggle("is-active", active);
  });
}

function applyLanguage() {
  applyStaticUi();
  if (!catalogueData) return;
  applyPerson(catalogueData.person);
  renderNav(catalogueData.pillars);
  renderPillars(catalogueData);
}

function bindLangToggle() {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

async function boot() {
  lang = detectLang();
  bindLangToggle();
  applyStaticUi();

  const res = await fetch("./data/projects.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load projects.json (${res.status})`);
  catalogueData = await res.json();
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
