# gump-sites

本地同時維護 **個人站（Py Chen）** 與 **HuHu Tech 公司站**，共用 `content/` 與 `assets/`，分別建置後推到兩個地方。

| 站點 | 網址 | 輸出 | 部署 |
|------|------|------|------|
| 個人 | https://gumpcpy.github.io/ | `docs/` | Pages：`main` → **/docs** |
| 公司 | https://www.huhu-tech.com/ | `apps/company/dist/` | `rsync` → `/var/www/huhu_site` |

## 個人站結構

```text
Py Chen
├── 首頁             /                 # 一句介紹 + 最新項目
├── AI智管           /work/?cat=smart-archive
├── 影像技術         /work/?cat=film-post-systems
├── 調色精選         /work/?cat=color-grading
├── 沈浸體驗         /work/?cat=immersive-systems
├── 獨立應用         /work/?cat=applications
└── 關於我           /profile/
```

頂部導覽（桌面橫列／手機漢堡）；深度頁：`/work/item/?id=`。

```text
content/
  work/
    taxonomy.json          # Work 樹與分類順序
    index.json             # 列表用摘要
    items/{id}.json        # 深度頁：Problem → Notes
  profile.json
  learning.json            # Coursera 證書
  company.json             # 公司站
apps/personal/             # 頁面與共用 CSS / JS
docs/                      # 建置產物（GitHub Pages）
archived/personal-site/    # 舊文庫／舊 Projects・About（未刪）
```

新增或修改項目：編輯 `content/work/items/{id}.json`，並在 `taxonomy.json` 的 `itemIds` 掛上 id；必要時更新 `index.json`（或重跑產生腳本）。深度章節欄位：`problem` / `idea` / `method` / `system` / `demo` / `notes`（中英）。

## 常用指令

```bash
npm install

# 個人站
npm run dev:personal              # http://localhost:8090
npm run build:personal
./deploy.sh "msg"                 # 建置個人 + 公司，push + rsync

# 公司站
npm run dev:company
npm run build:company
npm run deploy:company
```

### GitHub Pages

1. `npm run build:personal` → `docs/`
2. Settings → Pages → Branch `main` → **/docs**
3. https://gumpcpy.github.io/ （首頁）

## 內容怎麼改

| 要改什麼 | 改哪裡 |
|----------|--------|
| Work 分類／排序 | `content/work/taxonomy.json` |
| 項目深度文案 | `content/work/items/*.json` |
| Profile 佔位／聯繫 | `content/profile.json` |
| 學習證書 | `content/learning.json` |
| 公司文案 | `content/company.json` |
| 版型 / CSS | `apps/personal/styles.css` |
