import {
  ASSET_VERSION,
  applyChrome,
  assetUrl,
  bootSite,
  el,
  t,
  ui,
} from "./site.js";

let learningData = null;
let learningExpanded = false;

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
  if (cert.grade) parts.push(`${ui("gradeLabel")}${ui("contactSep")}${cert.grade}`);
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

  btn.textContent = learningExpanded
    ? ui("collapseLearning")
    : ui("expandLearning")(count);
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
  for (const cert of certs) list.appendChild(renderCertificate(cert));
  updateLearningToggle(certs.length);
}

function bindLearningToggle() {
  const btn = document.getElementById("learning-toggle");
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = "1";
  btn.addEventListener("click", () => {
    learningExpanded = !learningExpanded;
    updateLearningToggle(learningData?.certificates?.length || 0);
  });
}

function renderCvPlaceholder() {
  const title = document.getElementById("cv-title");
  if (title) title.textContent = ui("cvTitle");
  const lead = document.getElementById("cv-lead");
  if (lead) lead.textContent = ui("cvLead");
  const list = document.getElementById("cv-list");
  if (list) list.textContent = ui("cvEmpty");
}

function applyPage() {
  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = ui("aboutEyebrow");
  const title = document.getElementById("page-title");
  if (title) title.textContent = ui("aboutTitle");
  const lead = document.getElementById("page-lead");
  if (lead) lead.textContent = ui("aboutLead");

  const learningTitle = document.getElementById("learning-title");
  if (learningTitle) learningTitle.textContent = ui("learningTitle");

  renderCvPlaceholder();
  if (learningData) renderLearning(learningData);
  applyChrome({ activeNav: "about", title: ui("aboutTitle") });
}

bindLearningToggle();
bootSite({
  activeNav: "about",
  onLang: applyPage,
});
applyPage();

fetch(`/data/learning.json?v=${ASSET_VERSION}`, { cache: "no-cache" })
  .then((res) => {
    if (!res.ok) throw new Error(`learning.json ${res.status}`);
    return res.json();
  })
  .then((data) => {
    learningData = data;
    applyPage();
  })
  .catch((err) => {
    console.error(err);
    const list = document.getElementById("learning-list");
    if (list) list.textContent = ui("loadError");
  });
