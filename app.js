const STATUS_LABEL = {
  live: "Live",
  wip: "WIP",
  coming: "Coming",
};

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
    const a = el("a", null, p.label);
    a.href = `#${p.id}`;
    nav.appendChild(a);
  }
  const learn = el("a", null, "Learning");
  learn.href = "#learning";
  nav.appendChild(learn);
}

function renderCard(project) {
  const card = el("article", `card ${project.status === "coming" ? "coming" : ""}`);

  const top = el("div", "card-top");
  top.appendChild(el("p", "meta", project.role || ""));
  const badge = el("span", `status ${project.status}`, STATUS_LABEL[project.status] || project.status);
  top.appendChild(badge);
  card.appendChild(top);

  card.appendChild(el("h3", null, project.title));
  card.appendChild(el("p", "blurb", project.blurb));

  if (project.stack?.length) {
    const ul = el("ul", "stack");
    for (const s of project.stack) ul.appendChild(el("li", null, s));
    card.appendChild(ul);
  }

  const links = project.links || {};
  const linkRow = el("div", "card-links");
  if (links.site) {
    const a = el("a", null, "Showcase →");
    a.href = links.site;
    a.target = "_blank";
    a.rel = "noopener";
    linkRow.appendChild(a);
  }
  if (links.repo) {
    const a = el("a", null, "Repo");
    a.href = links.repo;
    a.target = "_blank";
    a.rel = "noopener";
    linkRow.appendChild(a);
  }
  if (links.appstore) {
    const a = el("a", null, "App Store");
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

    section.appendChild(el("h2", null, pillar.title));
    section.appendChild(el("p", "section-lead", pillar.lead));

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
  document.getElementById("person-tagline").textContent = person.tagline;
  document.getElementById("person-about").textContent = person.about;
  document.getElementById("github-link").href = person.github;
  document.getElementById("learning-link").href = person.learningUrl;
  document.title = `${person.name} — Catalogue`;
}

async function boot() {
  const res = await fetch("./data/projects.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load projects.json (${res.status})`);
  const data = await res.json();
  applyPerson(data.person);
  renderNav(data.pillars);
  renderPillars(data);
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
  document.getElementById("catalogue").textContent = "Failed to load catalogue data.";
});
