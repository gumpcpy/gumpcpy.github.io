import { useEffect, useState } from "react";
import "./App.css";

type Lang = "zh" | "en";
type LangText = string | { zh?: string; en?: string };

type Poster = { src: string; alt: string; href?: string };
type Tool = { src: string; label: LangText };
type CaseItem = { src: string; title: LangText; href?: string };

type Service = {
  id: string;
  theme: "dark" | "light";
  eyebrow: string;
  title: LangText;
  headline: LangText;
  blurb: LangText;
  image?: string;
  features?: LangText[];
  audience?: LangText;
  coop?: LangText;
  posters?: Poster[];
  tools?: Tool[];
  cases?: CaseItem[];
  cta?: LangText;
  ctaSecondary?: LangText;
  ctaSecondaryHref?: string;
};

type CompanyData = {
  brand: { name: string; nameZh: string; icp: string; legal: string };
  tagline: LangText;
  hero: {
    headline: LangText;
    sub: LangText;
    cta: LangText;
    ctaSecondary: LangText;
  };
  nav: Array<{ id: string; label: LangText }>;
  services: Service[];
  about: { title: LangText; body: LangText };
  contact: {
    title: LangText;
    address: LangText;
    phone: string;
    email: string;
    wechatImage: string;
    wechatLabel: LangText;
  };
};

function t(value: LangText | undefined, lang: Lang): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.zh ?? value.en ?? "";
}

function media(src: string) {
  return `/media/${src}`;
}

function PosterRail({ posters }: { posters: Poster[] }) {
  return (
    <div className="rail" role="list">
      {posters.map((p) => {
        const img = (
          <img src={media(p.src)} alt={p.alt} loading="lazy" role="listitem" />
        );
        return p.href ? (
          <a key={p.src} href={p.href} target="_blank" rel="noopener" className="rail-item">
            {img}
          </a>
        ) : (
          <div key={p.src} className="rail-item">
            {img}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang] = useState<Lang>("zh");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/content/company.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load company.json (${res.status})`);
        return res.json();
      })
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [data]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (error) {
    return (
      <main className="shell">
        <p className="error">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="shell">
        <p className="muted">Loading…</p>
      </main>
    );
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site" data-lang={lang}>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <a className="nav-brand" href="#top" onClick={closeMenu}>
          <img
            src="/media/company/brand/logo_white.png"
            alt={data.brand.name}
            className="nav-logo nav-logo-dark"
            height={36}
          />
          <img
            src="/media/company/brand/logo_black.png"
            alt=""
            aria-hidden
            className="nav-logo nav-logo-light"
            height={36}
          />
        </a>

        <nav className="nav-desktop" aria-label="Primary">
          {data.nav.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {t(item.label, lang)}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href="#contact">
          {t(data.hero.cta, lang)}
        </a>

        <button
          type="button"
          className={`nav-burger ${menuOpen ? "is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        hidden={!menuOpen}
      >
        {data.nav.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={closeMenu}>
            {t(item.label, lang)}
          </a>
        ))}
        <a className="btn primary" href="#contact" onClick={closeMenu}>
          {t(data.hero.cta, lang)}
        </a>
      </div>

      <main>
        <section className="hero" id="top">
          <div className="hero-inner reveal">
            <p className="hero-brand">{data.brand.name}</p>
            <h1>
              {t(data.hero.headline, lang)
                .split("\n")
                .map((line) => (
                  <span key={line} className="hero-line">
                    {line}
                  </span>
                ))}
            </h1>
            <p className="hero-sub">{t(data.hero.sub, lang)}</p>
            <div className="hero-actions">
              <a className="btn primary" href="#contact">
                {t(data.hero.cta, lang)}
              </a>
              <a className="btn ghost" href="#datacenter">
                {t(data.hero.ctaSecondary, lang)}
              </a>
            </div>
          </div>
          <div className="hero-visual reveal" aria-hidden="true">
            <img src="/media/company/brand/dcis.png" alt="" />
          </div>
        </section>

        {data.services.map((service) => (
          <section
            key={service.id}
            id={service.id}
            className={`band band-${service.theme}`}
          >
            <div className="band-inner reveal">
              <p className="eyebrow">{service.eyebrow}</p>
              <h2 className="band-title">{t(service.title, lang)}</h2>
              <p className="band-headline">{t(service.headline, lang)}</p>
              <p className="band-blurb">{t(service.blurb, lang)}</p>

              {service.image && (
                <div className="band-media">
                  <img src={media(service.image)} alt="" loading="lazy" />
                </div>
              )}

              {service.features && (
                <ul className="feature-list">
                  {service.features.map((f) => (
                    <li key={t(f, lang)}>{t(f, lang)}</li>
                  ))}
                </ul>
              )}

              {service.audience && (
                <p className="band-meta">
                  <strong>{lang === "zh" ? "适合" : "For"}</strong>
                  {t(service.audience, lang)}
                </p>
              )}
              {service.coop && (
                <p className="band-meta">
                  <strong>{lang === "zh" ? "合作" : "Engagement"}</strong>
                  {t(service.coop, lang)}
                </p>
              )}

              {service.posters && service.posters.length > 0 && (
                <>
                  <h3 className="band-sub">
                    {lang === "zh" ? "参与项目" : "Selected titles"}
                  </h3>
                  <PosterRail posters={service.posters} />
                </>
              )}

              {service.tools && (
                <div className="tool-grid">
                  {service.tools.map((tool) => (
                    <figure key={tool.src} className="tool-item">
                      <img src={media(tool.src)} alt={t(tool.label, lang)} loading="lazy" />
                      <figcaption>{t(tool.label, lang)}</figcaption>
                    </figure>
                  ))}
                </div>
              )}

              {service.cases && (
                <div className="case-grid">
                  {service.cases.map((c) => (
                    <a
                      key={c.src}
                      className="case-item"
                      href={c.href}
                      target="_blank"
                      rel="noopener"
                    >
                      <img src={media(c.src)} alt={t(c.title, lang)} loading="lazy" />
                      <span>{t(c.title, lang)}</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="band-actions">
                {service.cta && (
                  <a className="btn primary" href="#contact">
                    {t(service.cta, lang)}
                  </a>
                )}
                {service.ctaSecondary && service.ctaSecondaryHref && (
                  <a
                    className="btn ghost"
                    href={service.ctaSecondaryHref}
                    target="_blank"
                    rel="noopener"
                  >
                    {t(service.ctaSecondary, lang)}
                  </a>
                )}
              </div>
            </div>
          </section>
        ))}

        <section className="band band-light" id="about">
          <div className="band-inner narrow reveal">
            <h2 className="band-title">{t(data.about.title, lang)}</h2>
            <p className="about-body">{t(data.about.body, lang)}</p>
          </div>
        </section>

        <section className="band band-dark" id="contact">
          <div className="band-inner contact-inner reveal">
            <h2 className="band-title">{t(data.contact.title, lang)}</h2>
            <div className="contact-grid">
              <div className="contact-copy">
                <p>{t(data.contact.address, lang)}</p>
                <p>
                  <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`}>
                    {data.contact.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
                </p>
              </div>
              <figure className="contact-wechat">
                <img
                  src={media(data.contact.wechatImage)}
                  alt={t(data.contact.wechatLabel, lang)}
                  width={180}
                  height={180}
                />
                <figcaption>{t(data.contact.wechatLabel, lang)}</figcaption>
              </figure>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {data.brand.legal || data.brand.name}
        </p>
        <p>{data.brand.icp}</p>
      </footer>
    </div>
  );
}
