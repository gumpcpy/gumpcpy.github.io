import {
  ASSET_VERSION,
  applyChrome,
  bootSite,
  el,
  t,
  ui,
} from "./site.js";

let catalogueData = null;

function renderHeroCtas() {
  const row = document.getElementById("cta-row");
  if (!row) return;
  const items = [
    { href: "#ai-hub", label: ui("cta").aiHub, primary: true },
    { href: "#immersive", label: ui("cta").immersive },
    { href: "#apps", label: ui("cta").apps },
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
  top.appendChild(el("span", `status ${project.status}`, statusLabel));
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
  if (!main) return;
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
    for (const project of items) grid.appendChild(renderCard(project));
    section.appendChild(grid);
    main.appendChild(section);
  }
}

function renderSubNav(pillars) {
  const nav = document.getElementById("project-subnav");
  if (!nav || !pillars) return;
  nav.replaceChildren();
  for (const p of pillars) {
    const a = el("a", null, t(p.label));
    a.href = `#${p.id}`;
    nav.appendChild(a);
  }
}

function applyPage() {
  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = ui("projectsEyebrow");

  renderHeroCtas();

  if (!catalogueData) return;
  const person = catalogueData.person;
  const name = t(person.name);
  const personName = document.getElementById("person-name");
  if (personName) personName.textContent = name;
  const tagline = document.getElementById("person-tagline");
  if (tagline) tagline.textContent = t(person.tagline);
  const about = document.getElementById("person-about");
  if (about) about.textContent = t(person.about);

  renderSubNav(catalogueData.pillars);
  renderPillars(catalogueData);
  applyChrome({ activeNav: "projects", title: ui("projectsTitle") });
}

bootSite({
  activeNav: "projects",
  onLang: applyPage,
});

fetch(`/data/projects.json?v=${ASSET_VERSION}`, { cache: "no-cache" })
  .then((res) => {
    if (!res.ok) throw new Error(`projects.json ${res.status}`);
    return res.json();
  })
  .then((data) => {
    catalogueData = data;
    applyPage();
  })
  .catch((err) => {
    console.error(err);
    const main = document.getElementById("catalogue");
    if (main) main.textContent = ui("loadError");
  });
