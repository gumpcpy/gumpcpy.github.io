import {
  applyChrome,
  bindItemLink,
  bootSite,
  el,
  findCategory,
  formatDate,
  isItemReady,
  loadWorkIndex,
  loadWorkTaxonomy,
  t,
  ui,
} from "./site.js";

let indexItems = [];
let taxonomy = null;

function statusLabel(status) {
  const map = ui("status") || {};
  return map[status] || status || "";
}

function categoryLabel(catId) {
  if (!catId) return "";
  const found = findCategory(taxonomy, catId);
  return found ? t(found.category.label) : catId;
}

function pickLatest(items, limit = 6) {
  return [...items]
    .filter((item) => isItemReady(item))
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
    .slice(0, limit);
}

function renderLatest() {
  const root = document.getElementById("home-latest");
  if (!root) return;
  root.replaceChildren();
  const latest = pickLatest(indexItems);
  if (!latest.length) {
    root.appendChild(el("p", "work-empty", ui("workEmpty")));
    return;
  }
  const list = el("ul", "work-item-list");
  for (const meta of latest) {
    const li = el("li", "work-item-row");
    const a = el("a", "work-item-link");
    bindItemLink(a, meta.id);
    const titleRow = el("div", "work-item-title-row");
    titleRow.appendChild(el("span", "work-item-title", t(meta.title)));
    if (meta.category) {
      titleRow.appendChild(
        el("span", `cat-pill cat-${meta.category}`, categoryLabel(meta.category))
      );
    }
    if (meta.status) {
      titleRow.appendChild(el("span", `status-pill ${meta.status}`, statusLabel(meta.status)));
    }
    a.appendChild(titleRow);
    if (meta.updatedAt) {
      a.appendChild(el("p", "work-item-date", ui("itemUpdatedAt")(formatDate(meta.updatedAt))));
    }
    if (meta.blurb) a.appendChild(el("p", "work-item-blurb", t(meta.blurb)));
    a.appendChild(el("span", "work-item-cta", ui("workViewItem")));
    li.appendChild(a);
    list.appendChild(li);
  }
  root.appendChild(list);
}

function applyPage() {
  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = ui("homeEyebrow");
  const title = document.getElementById("page-title");
  if (title) title.textContent = ui("homeTitle");
  const lead = document.getElementById("page-lead");
  if (lead) lead.textContent = ui("homeLead");
  const latestTitle = document.getElementById("latest-title");
  if (latestTitle) latestTitle.textContent = ui("homeLatest");
  renderLatest();
  applyChrome({ activeNav: "home", title: ui("homeTitle") });
}

bootSite({
  activeNav: "home",
  onLang: applyPage,
});
applyPage();

Promise.all([loadWorkIndex(), loadWorkTaxonomy()])
  .then(([data, tax]) => {
    indexItems = data.items || [];
    taxonomy = tax;
    applyPage();
  })
  .catch((err) => {
    console.error(err);
    const root = document.getElementById("home-latest");
    if (root) root.textContent = ui("loadError");
  });
