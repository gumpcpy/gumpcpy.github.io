import { useEffect, useState } from "react";
import "./App.css";

type LangText = string | { zh?: string; en?: string };

type CompanyData = {
  brand: { name: string; nameZh: string; icp: string; domain: string };
  tagline: LangText;
  hero: {
    lines: Array<{
      title: LangText;
      items: LangText[];
    }>;
  };
  contact: {
    address: LangText;
    phone: string;
    email: string;
    wechatImage: string;
  };
  services: Array<{
    id: string;
    title: LangText;
    blurb: LangText;
  }>;
};

function t(value: LangText | undefined, lang: "zh" | "en" = "zh"): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.zh ?? value.en ?? "";
}

export default function App() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/content/company.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load company.json (${res.status})`);
        return res.json();
      })
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

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

  return (
    <div className="page">
      <header className="top">
        <img
          className="logo"
          src="/media/company/brand/logo_white.png"
          alt={data.brand.name}
          height={48}
        />
        <nav>
          <a href="#services">服务</a>
          <a href="#contact">联系</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="top">
          <p className="eyebrow">{data.brand.nameZh}</p>
          <h1>{data.brand.name}</h1>
          <p className="tagline">{t(data.tagline)}</p>
          <div className="hero-grid">
            {data.hero.lines.map((line) => (
              <div key={t(line.title)} className="hero-col">
                <h2>{t(line.title)}</h2>
                <ul>
                  {line.items.map((item) => (
                    <li key={t(item)}>{t(item)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a className="cta" href="#contact">
            联系我们
          </a>
        </section>

        <section className="services" id="services">
          <h2>服务项目</h2>
          <div className="service-grid">
            {data.services.map((service) => (
              <article key={service.id} className="service-card">
                <h3>{t(service.title)}</h3>
                <p>{t(service.blurb)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <h2>联系我们</h2>
          <p>{t(data.contact.address)}</p>
          <p>
            <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`}>
              {data.contact.phone}
            </a>
          </p>
          <p>
            <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
          </p>
          <img
            className="wechat"
            src={`/media/company/${data.contact.wechatImage}`}
            alt="微信"
            width={160}
            height={160}
          />
        </section>
      </main>

      <footer>
        <p>
          © {new Date().getFullYear()} {data.brand.name}. {data.brand.icp}
        </p>
      </footer>
    </div>
  );
}
