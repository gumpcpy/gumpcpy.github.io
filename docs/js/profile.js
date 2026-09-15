import {
  ASSET_VERSION,
  applyChrome,
  assetUrl,
  bootSite,
  el,
  t,
  ui,
} from "./site.js";

let profileData = null;
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
  const btn = document.getElementById("cert-toggle");
  const list = document.getElementById("cert-list");
  const section = document.getElementById("certifications");
  if (!btn || !list) return;
  btn.textContent = learningExpanded
    ? ui("collapseLearning")
    : ui("expandLearning")(count);
  btn.setAttribute("aria-expanded", String(learningExpanded));
  list.hidden = !learningExpanded;
  section?.classList.toggle("is-expanded", learningExpanded);
}

function renderPlaceholderSection(id, section) {
  const elRoot = document.getElementById(id);
  if (!elRoot || !section) return;
  const title = elRoot.querySelector(".profile-section-title");
  const lead = elRoot.querySelector(".section-lead");
  const body = elRoot.querySelector(".profile-section-body");
  if (title) title.textContent = t(section.label);
  if (lead) lead.textContent = t(section.lead);
  if (body) {
    const items = section.items || [];
    if (!items.length) body.textContent = ui("profileEmpty");
  }
}

function renderContact(section) {
  const elRoot = document.getElementById("contact");
  if (!elRoot || !section) return;
  const title = elRoot.querySelector(".profile-section-title");
  const lead = elRoot.querySelector(".section-lead");
  const body = elRoot.querySelector(".profile-section-body");
  if (title) title.textContent = t(section.label);
  if (lead) lead.textContent = t(section.lead);
  if (body && section.email) {
    body.replaceChildren();
    const a = el("a", "profile-email", section.email);
    a.href = `mailto:${section.email}`;
    body.appendChild(a);
  }
}

function renderCertifications(section) {
  const elRoot = document.getElementById("certifications");
  if (!elRoot || !section) return;
  const title = elRoot.querySelector(".profile-section-title");
  const lead = elRoot.querySelector(".section-lead");
  if (title) title.textContent = t(section.label);
  if (lead) {
    lead.textContent =
      t(learningData?.lead) || t(section.lead) || "";
  }
  const list = document.getElementById("cert-list");
  if (!list) return;
  list.replaceChildren();
  const certs = learningData?.certificates || [];
  for (const cert of certs) list.appendChild(renderCertificate(cert));
  updateLearningToggle(certs.length);
}

function bindCertToggle() {
  const btn = document.getElementById("cert-toggle");
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = "1";
  btn.addEventListener("click", () => {
    learningExpanded = !learningExpanded;
    updateLearningToggle(learningData?.certificates?.length || 0);
  });
}

function applyPage() {
  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow) eyebrow.textContent = ui("profileEyebrow");
  const title = document.getElementById("page-title");
  if (title) title.textContent = ui("profileTitle");
  const lead = document.getElementById("page-lead");
  if (lead) {
    lead.textContent = t(profileData?.lead) || ui("profileLead");
  }

  const sections = profileData?.sections || {};
  renderPlaceholderSection("experience", sections.experience);
  renderPlaceholderSection("talks", sections.talks);
  renderCertifications(sections.certifications);
  renderPlaceholderSection("patents", sections.patents);
  renderContact(sections.contact);

  applyChrome({ activeNav: "about", title: ui("profileTitle") });
}

bindCertToggle();
bootSite({
  activeNav: "about",
  onLang: applyPage,
});
applyPage();

Promise.all([
  fetch(`/data/profile.json?v=${ASSET_VERSION}`, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(`profile ${r.status}`);
    return r.json();
  }),
  fetch(`/data/learning.json?v=${ASSET_VERSION}`, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(`learning ${r.status}`);
    return r.json();
  }),
])
  .then(([profile, learning]) => {
    profileData = profile;
    learningData = learning;
    applyPage();
  })
  .catch((err) => {
    console.error(err);
    const body = document.querySelector(".profile-section-body");
    if (body) body.textContent = ui("loadError");
  });
