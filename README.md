# gump-sites

本地同時維護 **個人站（Py Chen）** 與 **HuHu Tech 公司站**，共用 `content/` 與 `assets/`，分別建置後推到兩個地方。

| 站點 | 網址 | 輸出 | 部署 |
|------|------|------|------|
| 個人 | https://gumpcpy.github.io/ | `docs/` | Pages：`main` → **/docs** |
| 公司 | https://www.huhu-tech.com/ | `apps/company/dist/` | `rsync` → `/var/www/huhu_site` |

## 個人站結構

```text
Py Chen
├── Projects     /projects/     ← 預設首頁（作品目錄）
├── Library      /library/
│     ├── Manuals
│     ├── Essays
│     ├── Stories
│     └── Notes
└── About        /about/        ← CV + Learning 證書
```

```text
content/
  projects.json
  learning.json
  company.json
  library/                 # ← 放 Markdown（建置成網頁）
    manuals/*.md
    essays/*.md
    stories/*.md
    notes/*.md
apps/personal/             # 頁面與共用 CSS / JS
docs/                      # 建置產物（GitHub Pages）
```

新增文章：在 `content/library/<區>/*.md` 寫 frontmatter + 正文，再 `npm run build:personal`。  
詳見 `content/library/README.md`。

## 常用指令

```bash
npm install

# 個人站（建置含 Library MD → 預覽 docs/）
npm run dev:personal              # http://localhost:8090
npm run build:personal
npm run deploy:personal -- "msg"

# 公司站
npm run dev:company               # http://localhost:5173
npm run build:company
npm run deploy:company
```

### GitHub Pages

1. `npm run build:personal` → `docs/`
2. Settings → Pages → Branch `main` → **/docs**
3. https://gumpcpy.github.io/ （會導向 `/projects/`）

## 內容怎麼改

| 要改什麼 | 改哪裡 |
|----------|--------|
| 作品目錄 | `content/projects.json` |
| Library 文章 | `content/library/**/*.md` |
| 學習證書 | `content/learning.json` |
| 公司文案 | `content/company.json` |
| 版型 / CSS | `apps/personal/styles.css` |
