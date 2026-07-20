# gumpcpy.github.io

Personal catalogue for **CHEN PEIYU** (`gumpcpy`).

**Live:** https://gumpcpy.github.io/

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Catalogue shell |
| `app.js` | Renders pillars/cards/certificates from JSON |
| `data/projects.json` | **Add / update works here** |
| `data/learning.json` | **Coursera certificates / learning journey** |
| `assets/coursera/` | Certificate & org images |
| `styles.css` | Visual system |

## Add a project

1. Create a public showcase repo (optional Pages), e.g. `i-got-you`
2. Edit `data/projects.json` — set `status` to `live` / `wip` / `coming` and fill `links`
3. Commit & push this repo

## Local preview

```bash
cd /Users/gump/Documents/_Proj/github-my-page
python3 -m http.server 8080
# open http://localhost:8080
```

## GitHub Pages

Repo name must be **`gumpcpy.github.io`** (user site).  
Settings → Pages → Deploy from branch → `main` / `/ (root)`.

> Note: repo `gumpcpy` (exact username) is only for a **profile README** on github.com/gumpcpy — it is not this site.
