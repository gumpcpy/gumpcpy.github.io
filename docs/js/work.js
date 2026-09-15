import {
  ASSET_VERSION,
  applyChrome,
  bindItemLink,
  bootSite,
  categoryHref,
  el,
  findCategory,
  findItemContext,
  formatDate,
  getLang,
  isItemReady,
  itemHref,
  loadWorkIndex,
  loadWorkItem,
  loadWorkTaxonomy,
  navIdForCategory,
  SECTION_KEYS,
  t,
  ui,
} from "./site.js";

let taxonomy = null;
let indexById = {};

async function loadIndex() {
  const data = await loadWorkIndex();
  indexById = {};
  for (const item of data.items || []) indexById[item.id] = item;
  return data;
}

function statusLabel(status) {
  const map = ui("status") || {};
  return map[status] || status || "";
}

function currentCat() {
  return new URLSearchParams(window.location.search).get("cat") || "";
}

function currentItemId() {
  return new URLSearchParams(window.location.search).get("id") || "";
}

function pickLangPath(mapOrString) {
  if (!mapOrString) return "";
  if (typeof mapOrString === "string") return mapOrString;
  const lang = getLang();
  return mapOrString[lang] || mapOrString.zh || mapOrString.en || "";
}

function withAssetVersion(src) {
  if (!src) return "";
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}v=${ASSET_VERSION}`;
}

function renderSubnav(category, activeId) {
  const ids = category?.itemIds || [];
  if (!ids.length) return null;
  const nav = el("nav", "work-subnav");
  nav.setAttribute("aria-label", t(category.label));
  for (const id of ids) {
    const meta = indexById[id];
    const a = el("a", id === activeId ? "is-active" : null, meta ? t(meta.title) : id);
    bindItemLink(a, id);
    nav.appendChild(a);
  }
  return nav;
}

function renderItemRow(id) {
  const meta = indexById[id];
  const li = el("li", "work-item-row");
  const a = el("a", "work-item-link");
  bindItemLink(a, id);
  const titleRow = el("div", "work-item-title-row");
  titleRow.appendChild(el("span", "work-item-title", meta ? t(meta.title) : id));
  if (meta?.status) {
    titleRow.appendChild(el("span", `status-pill ${meta.status}`, statusLabel(meta.status)));
  }
  if (!isItemReady(meta || id)) {
    titleRow.appendChild(el("span", "status-pill soon", ui("workItemSoon")));
  }
  a.appendChild(titleRow);
  if (meta?.blurb) a.appendChild(el("p", "work-item-blurb", t(meta.blurb)));
  a.appendChild(el("span", "work-item-cta", isItemReady(meta || id) ? ui("workViewItem") : ui("workItemSoon")));
  li.appendChild(a);
  return li;
}

function renderCategoryBlock(cat, { withSubnav = false, activeId = "" } = {}) {
  const block = el("div", "work-category");
  block.id = cat.id;
  block.appendChild(el("h3", "work-category-title", t(cat.label)));
  block.appendChild(el("p", "work-category-lead", t(cat.lead)));
  if (withSubnav) {
    const sub = renderSubnav(cat, activeId);
    if (sub) block.appendChild(sub);
  }
  const ids = cat.itemIds || [];
  if (!ids.length) {
    block.appendChild(el("p", "work-empty", ui("workEmpty")));
  } else if (!withSubnav) {
    const list = el("ul", "work-item-list");
    for (const id of ids) list.appendChild(renderItemRow(id));
    block.appendChild(list);
  }
  return block;
}

function renderHub(filterCat) {
  const root = document.getElementById("work-root");
  if (!root || !taxonomy) return;
  root.replaceChildren();

  if (filterCat) {
    const found = findCategory(taxonomy, filterCat);
    if (!found) {
      root.appendChild(el("p", "work-empty", ui("workEmpty")));
      return;
    }
    // Category view: list only (secondary menu sits under page hero)
    const wrap = el("div", "work-category-view");
    wrap.appendChild(el("p", "work-category-lead", t(found.category.lead)));
    const list = el("ul", "work-item-list");
    for (const id of found.category.itemIds || []) list.appendChild(renderItemRow(id));
    wrap.appendChild(list);
    root.appendChild(wrap);
    return;
  }

  if (Array.isArray(taxonomy.categories) && !taxonomy.groups) {
    for (const cat of taxonomy.categories) {
      root.appendChild(renderCategoryBlock(cat));
    }
    return;
  }

  for (const group of taxonomy.groups || []) {
    const section = el("section", "work-group");
    section.id = group.id;
    section.appendChild(el("h2", "work-group-title", t(group.label)));
    section.appendChild(el("p", "section-lead", t(group.lead)));
    for (const cat of group.categories || []) {
      section.appendChild(renderCategoryBlock(cat));
    }
    root.appendChild(section);
  }
}

function buildBreadcrumb(ctx, item) {
  const nav = el("nav", "library-crumb");
  nav.setAttribute("aria-label", ui("workCrumb"));
  const home = el("a", null, ui("homeTitle"));
  home.href = "/";
  nav.appendChild(home);
  nav.appendChild(el("span", "crumb-sep", "/"));
  if (ctx?.category) {
    const c = el("a", null, t(ctx.category.label));
    c.href = categoryHref(ctx.category.id);
    nav.appendChild(c);
    nav.appendChild(el("span", "crumb-sep", "/"));
  }
  nav.appendChild(el("span", "crumb-current", t(item.title)));
  return nav;
}

function buildPager(ctx) {
  if (!ctx) return null;
  const nav = el("nav", "article-pager");
  nav.setAttribute("aria-label", `${ui("workPrev")} / ${ui("workNext")}`);

  const prevMeta = ctx.prevId ? indexById[ctx.prevId] : null;
  if (ctx.prevId) {
    const a = el("a", "pager-prev");
    a.href = itemHref(ctx.prevId);
    a.appendChild(el("span", "pager-label", ui("workPrev")));
    a.appendChild(el("span", "pager-title", prevMeta ? t(prevMeta.title) : ctx.prevId));
    nav.appendChild(a);
  } else {
    const span = el("span", "pager-prev is-disabled");
    span.appendChild(el("span", "pager-label", ui("workPrev")));
    span.appendChild(el("span", "pager-title", "—"));
    nav.appendChild(span);
  }

  const nextMeta = ctx.nextId ? indexById[ctx.nextId] : null;
  if (ctx.nextId) {
    const a = el("a", "pager-next");
    a.href = itemHref(ctx.nextId);
    a.appendChild(el("span", "pager-label", ui("workNext")));
    a.appendChild(el("span", "pager-title", nextMeta ? t(nextMeta.title) : ctx.nextId));
    nav.appendChild(a);
  } else {
    const span = el("span", "pager-next is-disabled");
    span.appendChild(el("span", "pager-label", ui("workNext")));
    span.appendChild(el("span", "pager-title", "—"));
    nav.appendChild(span);
  }
  return nav;
}

function sectionHasContent(sec) {
  if (!sec) return false;
  if (typeof sec === "string") return sec.trim().length > 0;
  const text = t(sec);
  const url = sec.url || sec.downloadUrl || "";
  const shots = sec.screenshots;
  const hasShots =
    shots &&
    ((Array.isArray(shots) && shots.length) ||
      (shots.zh && shots.zh.length) ||
      (shots.en && shots.en.length));
  const bullets = sec.bullets;
  const hasBullets =
    bullets &&
    ((Array.isArray(bullets) && bullets.length) ||
      (bullets.zh && bullets.zh.length) ||
      (bullets.en && bullets.en.length));
  return Boolean((text && text.trim()) || url || hasShots || hasBullets);
}

function getBulletList(sec) {
  const bullets = sec?.bullets;
  if (!bullets) return [];
  if (Array.isArray(bullets)) return bullets.filter(Boolean);
  return bullets[getLang()] || bullets.zh || bullets.en || [];
}

function appendBullets(parent, items) {
  const list = (items || []).map((s) => String(s || "").trim()).filter(Boolean);
  if (!list.length) return;
  const ul = el("ul", "work-bullets");
  for (const line of list) {
    ul.appendChild(el("li", null, line));
  }
  parent.appendChild(ul);
}

function renderAppIcon(item) {
  const src = withAssetVersion(pickLangPath(item.hero));
  if (!src) return null;
  const fig = el("figure", "work-app-icon");
  const img = document.createElement("img");
  img.src = src;
  img.alt = t(item.title);
  img.loading = "eager";
  img.onerror = () => {
    fig.hidden = true;
  };
  fig.appendChild(img);
  return fig;
}

function getScreenshotList(sec) {
  const shots = sec?.screenshots;
  if (!shots) return [];
  return Array.isArray(shots) ? shots : shots[getLang()] || shots.zh || shots.en || [];
}

function ensureLightbox() {
  let box = document.getElementById("shot-lightbox");
  if (box) return box;
  box = document.createElement("div");
  box.id = "shot-lightbox";
  box.className = "shot-lightbox";
  box.hidden = true;
  box.innerHTML = `
    <button type="button" class="shot-lightbox-close" aria-label="${ui("lightboxClose")}">&times;</button>
    <button type="button" class="shot-lightbox-nav prev" aria-label="${ui("galleryPrev")}">&lsaquo;</button>
    <img class="shot-lightbox-img" alt="" />
    <button type="button" class="shot-lightbox-nav next" aria-label="${ui("galleryNext")}">&rsaquo;</button>
  `;
  document.body.appendChild(box);
  box.querySelector(".shot-lightbox-close").addEventListener("click", () => closeLightbox());
  box.addEventListener("click", (e) => {
    if (e.target === box) closeLightbox();
  });
  return box;
}

let lightboxState = { list: [], index: 0 };

function openLightbox(list, index) {
  const box = ensureLightbox();
  lightboxState = { list, index };
  const img = box.querySelector(".shot-lightbox-img");
  img.src = withAssetVersion(list[index]);
  box.hidden = false;
  box.classList.add("is-open");
  document.documentElement.style.overflow = "hidden";

  const prev = box.querySelector(".shot-lightbox-nav.prev");
  const next = box.querySelector(".shot-lightbox-nav.next");
  prev.onclick = (e) => {
    e.stopPropagation();
    lightboxState.index = (lightboxState.index - 1 + list.length) % list.length;
    img.src = withAssetVersion(list[lightboxState.index]);
  };
  next.onclick = (e) => {
    e.stopPropagation();
    lightboxState.index = (lightboxState.index + 1) % list.length;
    img.src = withAssetVersion(list[lightboxState.index]);
  };

  if (!box.dataset.keyBound) {
    box.dataset.keyBound = "1";
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev.click();
      if (e.key === "ArrowRight") next.click();
    });
  }
}

function closeLightbox() {
  const box = document.getElementById("shot-lightbox");
  if (!box) return;
  box.hidden = true;
  box.classList.remove("is-open");
  document.documentElement.style.overflow = "";
}

function renderScreenshotGallery(sec) {
  const list = getScreenshotList(sec).filter(Boolean);
  if (!list.length) return null;

  const wrap = el("div", "shot-gallery");
  const viewport = el("div", "shot-gallery-viewport");
  const track = el("div", "shot-gallery-track");

  list.forEach((src, index) => {
    const fig = el("figure", "shot-gallery-item");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shot-gallery-thumb";
    const img = document.createElement("img");
    img.src = withAssetVersion(src);
    img.alt = `${ui("workScreenshots")} ${index + 1}`;
    img.loading = "lazy";
    img.draggable = false;
    img.onerror = () => {
      fig.hidden = true;
    };
    btn.appendChild(img);
    btn.addEventListener("click", () => openLightbox(list, index));
    fig.appendChild(btn);
    track.appendChild(fig);
  });

  viewport.appendChild(track);
  wrap.appendChild(viewport);

  const rail = el("div", "shot-gallery-rail");
  const thumb = el("div", "shot-gallery-rail-thumb");
  rail.appendChild(thumb);
  wrap.appendChild(rail);

  const updateRail = () => {
    const max = viewport.scrollWidth - viewport.clientWidth;
    if (max <= 1) {
      rail.hidden = true;
      return;
    }
    rail.hidden = false;
    const ratio = viewport.clientWidth / viewport.scrollWidth;
    const thumbW = Math.max(12, ratio * 100);
    const left = (viewport.scrollLeft / max) * (100 - thumbW);
    thumb.style.width = `${thumbW}%`;
    thumb.style.left = `${left}%`;
  };
  viewport.addEventListener("scroll", updateRail, { passive: true });
  window.addEventListener("resize", updateRail);
  track.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", () => {
      updateRail();
    });
  });
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(updateRail).observe(track);
  }
  requestAnimationFrame(updateRail);

  const controls = el("div", "shot-gallery-controls");
  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "shot-gallery-arrow";
  prev.setAttribute("aria-label", ui("galleryPrev"));
  prev.innerHTML = "&lsaquo;";
  const next = document.createElement("button");
  next.type = "button";
  next.className = "shot-gallery-arrow";
  next.setAttribute("aria-label", ui("galleryNext"));
  next.innerHTML = "&rsaquo;";

  const scrollByPage = (dir) => {
    const amount = Math.max(viewport.clientWidth * 0.8, 240);
    viewport.scrollBy({ left: dir * amount, behavior: "smooth" });
  };
  prev.addEventListener("click", () => scrollByPage(-1));
  next.addEventListener("click", () => scrollByPage(1));
  controls.append(prev, next);
  wrap.appendChild(controls);

  // Center the strip when it overflows; touch swipe is native scroll
  requestAnimationFrame(() => {
    const max = viewport.scrollWidth - viewport.clientWidth;
    if (max > 0) viewport.scrollLeft = max / 2;
    updateRail();
  });

  return wrap;
}

function appendParagraphs(parent, text, className) {
  const raw = (text || "").trim();
  if (!raw) return;
  const parts = raw.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  parts.forEach((line, i) => {
    const p = el("p", className || null, line);
    if (i > 0) p.classList.add("work-para-follow");
    parent.appendChild(p);
  });
}

function renderItemPage(item, ctx) {
  const root = document.getElementById("work-root");
  if (!root) return;
  document.body.classList.add("is-reading");
  root.className = "work-reader";
  root.replaceChildren();

  const main = el("div", "work-article");
  main.appendChild(buildBreadcrumb(ctx, item));

  const titleRow = el("div", "work-title-row");
  titleRow.appendChild(el("h1", "article-title", t(item.title)));
  const icon = renderAppIcon(item);
  if (icon) titleRow.appendChild(icon);
  main.appendChild(titleRow);

  const labels = ui("sectionLabels") || {};
  const sections = item.sections || {};

  // Intent lines (problem, no heading)
  const intent = sections.problem;
  if (sectionHasContent(intent)) {
    appendParagraphs(main, t(intent), "work-intent");
  }

  for (const key of ["idea", "method", "system", "notes"]) {
    const sec = sections[key];
    if (!sectionHasContent(sec) && key !== "system") continue;
    const hasSystemBits =
      key === "system" &&
      (sectionHasContent(sec) || item.links?.repo || getScreenshotList(sec).length);
    if (key === "system" && !hasSystemBits) continue;

    const block = el("section", `work-section work-section-${key}`);
    block.id = key;
    block.appendChild(el("h2", null, labels[key] || key));

    if (key === "system") {
      const gallery = renderScreenshotGallery(sec || {});
      if (gallery) block.appendChild(gallery);

      appendParagraphs(block, t(sec), "work-system-copy");

      const links = el("div", "work-system-links");
      if (item.links?.repo) {
        const a = el("a", "work-demo-link", ui("workRepo"));
        a.href = item.links.repo;
        a.target = "_blank";
        a.rel = "noopener";
        links.appendChild(a);
      }
      if (sec?.downloadUrl) {
        const a = el("a", "work-demo-link", ui("workDownload"));
        a.href = sec.downloadUrl;
        a.target = "_blank";
        a.rel = "noopener";
        links.appendChild(a);
      }
      if (links.childNodes.length) block.appendChild(links);
    } else {
      const bullets = getBulletList(sec);
      if (bullets.length) appendBullets(block, bullets);
      appendParagraphs(block, t(sec));
    }

    main.appendChild(block);
  }

  if (item.updatedAt) {
    main.appendChild(
      el("p", "item-updated item-updated-foot", ui("itemUpdatedAt")(formatDate(item.updatedAt)))
    );
  }

  root.appendChild(main);
}

function applyHub() {
  document.body.classList.remove("is-reading");
  const cat = currentCat();
  const found = cat ? findCategory(taxonomy, cat) : null;
  const navId = cat ? navIdForCategory(cat) : "home";

  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = found ? t(found.category.label) : ui("workEyebrow");
  const title = document.getElementById("page-title");
  if (title) title.textContent = found ? t(found.category.label) : ui("workTitle");
  const lead = document.getElementById("page-lead");
  if (lead) lead.textContent = found ? t(found.category.lead) : ui("workLead");

  // Put secondary nav under page hero for category pages
  const hero = document.querySelector(".page-hero");
  let slot = document.getElementById("work-cat-subnav");
  if (slot) slot.remove();
  if (found && hero) {
    slot = renderSubnav(found.category, currentItemId());
    if (slot) {
      slot.id = "work-cat-subnav";
      hero.appendChild(slot);
    }
  }

  renderHub(cat || null);
  applyChrome({
    activeNav: "work",
    title: found ? t(found.category.label) : ui("workTitle"),
  });
}

async function applyItem() {
  const id = currentItemId();
  const root = document.getElementById("work-root");
  if (!id) {
    location.replace("/");
    return;
  }
  const item = await loadWorkItem(id);
  if (!item) {
    document.body.classList.remove("is-reading");
    if (root) {
      root.className = "";
      root.replaceChildren(el("p", "library-empty", ui("readError")));
    }
    applyChrome({ activeNav: "home", title: ui("readError") });
    return;
  }
  // Prefer item.ready, fall back to index
  const ready = item.ready === true || isItemReady(id);
  if (!ready) {
    document.body.classList.remove("is-reading");
    if (root) {
      root.className = "work-reader";
      root.replaceChildren(el("p", "library-empty", ui("workNotReady")));
    }
    applyChrome({ activeNav: "work", title: t(item.title) });
    return;
  }
  const ctx = findItemContext(taxonomy, id);
  renderItemPage(item, ctx);
  applyChrome({
    activeNav: "work",
    title: t(item.title),
  });
}

const page = document.body.dataset.page;

async function boot() {
  try {
    await Promise.all([loadIndex(), loadWorkTaxonomy().then((tax) => (taxonomy = tax))]);
  } catch (err) {
    console.error(err);
    const root = document.getElementById("work-root");
    if (root) root.textContent = ui("loadError");
    bootSite({ activeNav: "home" });
    return;
  }

  if (page === "work-item") {
    const refresh = () => {
      applyItem().catch((err) => console.error(err));
    };
    bootSite({ activeNav: null, onLang: refresh });
    refresh();
  } else {
    const cat = currentCat();
    bootSite({
      activeNav: cat ? navIdForCategory(cat) : "home",
      onLang: applyHub,
    });
    applyHub();
  }
}

boot();
