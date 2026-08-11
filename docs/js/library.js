import {
  ASSET_VERSION,
  LIBRARY_SECTIONS,
  applyChrome,
  bootSite,
  el,
  t,
  ui,
} from "./site.js";

function sectionMeta(id) {
  return LIBRARY_SECTIONS.find((s) => s.id === id);
}

function renderLibraryHub() {
  const grid = document.getElementById("library-grid");
  if (!grid) return;
  grid.replaceChildren();
  for (const section of LIBRARY_SECTIONS) {
    const card = el("a", "library-card");
    card.href = section.href;
    card.appendChild(el("h2", null, t(section.label)));
    card.appendChild(el("p", null, t(section.lead)));
    grid.appendChild(card);
  }
}

function renderSectionSubnav(activeId) {
  const nav = document.getElementById("library-subnav");
  if (!nav) return;
  nav.replaceChildren();
  for (const section of LIBRARY_SECTIONS) {
    const a = el("a", section.id === activeId ? "is-active" : null, t(section.label));
    a.href = section.href;
    nav.appendChild(a);
  }
}

function articleHref(sectionId, slug) {
  return `${sectionMeta(sectionId).href}?id=${encodeURIComponent(slug)}`;
}

function buildHeadingToc(articleEl) {
  const headings = [...articleEl.querySelectorAll("h2, h3")];
  const toc = el("nav", "article-toc");
  toc.setAttribute("aria-label", ui("libraryToc"));
  if (!headings.length) {
    toc.hidden = true;
    return toc;
  }
  toc.appendChild(el("p", "sidebar-label", ui("libraryToc")));
  const ul = el("ul", "toc-list");
  for (const h of headings) {
    if (!h.id) {
      h.id = h.textContent
        .trim()
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\-]+/g, "-");
    }
    const li = el("li", h.tagName === "H3" ? "toc-h3" : "toc-h2");
    const a = el("a", null, h.textContent);
    a.href = `#${h.id}`;
    li.appendChild(a);
    ul.appendChild(li);
  }
  toc.appendChild(ul);
  return toc;
}

function renderArticleList(items, sectionId, activeSlug) {
  const list = el("nav", "article-index");
  list.setAttribute("aria-label", ui("libraryArticles"));
  list.appendChild(el("p", "sidebar-label", ui("libraryArticles")));
  const ul = el("ul", "article-index-list");
  for (const item of items) {
    const li = el("li", item.slug === activeSlug ? "is-active" : null);
    const a = el("a", null, t(item.title));
    a.href = articleHref(sectionId, item.slug);
    li.appendChild(a);
    if (item.date) li.appendChild(el("span", "article-date", item.date));
    ul.appendChild(li);
  }
  list.appendChild(ul);
  return list;
}

async function renderSectionPage(sectionId) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const meta = sectionMeta(sectionId);

  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = ui("libraryEyebrow");
  const title = document.getElementById("page-title");
  if (title) title.textContent = t(meta.label);
  const lead = document.getElementById("page-lead");
  if (lead) lead.textContent = t(meta.lead);

  renderSectionSubnav(sectionId);

  const root = document.getElementById("library-root");
  if (!root) return;

  const indexRes = await fetch(
    `/data/library/${sectionId}/index.json?v=${ASSET_VERSION}`,
    { cache: "no-cache" }
  );
  if (!indexRes.ok) throw new Error(`index ${indexRes.status}`);
  const index = await indexRes.json();
  const items = index.items || [];

  if (!slug) {
    root.className = "library-list-view";
    root.replaceChildren();
    if (!items.length) {
      root.appendChild(el("p", "library-empty", ui("libraryEmpty")));
      applyChrome({ activeNav: "library", title: t(meta.label) });
      return;
    }
    const list = el("div", "library-listing");
    for (const item of items) {
      const a = el("a", "library-list-item");
      a.href = articleHref(sectionId, item.slug);
      a.appendChild(el("h2", null, t(item.title)));
      if (item.date) a.appendChild(el("p", "meta", item.date));
      const summary = t(item.summary);
      if (summary) a.appendChild(el("p", "blurb", summary));
      list.appendChild(a);
    }
    root.appendChild(list);
    applyChrome({ activeNav: "library", title: t(meta.label) });
    return;
  }

  const item = items.find((x) => x.slug === slug);
  const htmlRes = await fetch(
    `/data/library/${sectionId}/${encodeURIComponent(slug)}.html?v=${ASSET_VERSION}`,
    { cache: "no-cache" }
  );
  if (!htmlRes.ok || !item) {
    root.className = "library-list-view";
    root.replaceChildren(el("p", "library-empty", ui("readError")));
    applyChrome({ activeNav: "library", title: t(meta.label) });
    return;
  }

  const bodyHtml = await htmlRes.text();
  root.className = "library-reader";
  root.replaceChildren();

  const sidebar = el("aside", "library-sidebar");
  const back = el("a", "library-back", ui("libraryBack"));
  back.href = meta.href;
  sidebar.appendChild(back);
  sidebar.appendChild(renderArticleList(items, sectionId, slug));

  const main = el("div", "library-main");
  main.appendChild(el("h1", "article-title", t(item.title)));
  if (item.date) main.appendChild(el("p", "meta", item.date));
  const article = el("article", "article-body prose");
  article.innerHTML = bodyHtml;
  const toc = buildHeadingToc(article);
  sidebar.appendChild(toc);
  main.appendChild(article);

  root.appendChild(sidebar);
  root.appendChild(main);
  applyChrome({ activeNav: "library", title: t(item.title) });
}

function applyHub() {
  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = ui("libraryEyebrow");
  const title = document.getElementById("page-title");
  if (title) title.textContent = ui("libraryTitle");
  const lead = document.getElementById("page-lead");
  if (lead) lead.textContent = ui("libraryLead");
  renderLibraryHub();
  applyChrome({ activeNav: "library", title: ui("libraryTitle") });
}

const page = document.body.dataset.page;
const sectionId = document.body.dataset.section;

if (page === "library-hub") {
  bootSite({
    activeNav: "library",
    onLang: applyHub,
  });
  applyHub();
} else if (page === "library-section" && sectionId) {
  const refresh = () => {
    renderSectionPage(sectionId).catch((err) => {
      console.error(err);
      const root = document.getElementById("library-root");
      if (root) root.textContent = ui("loadError");
    });
  };
  bootSite({
    activeNav: "library",
    onLang: refresh,
  });
  refresh();
}
