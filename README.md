# gump-sites

本地同時維護 **個人 catalogue** 與 **HuHu Tech 公司站**，共用 `content/` 與 `assets/`，分別建置後推到兩個地方。

| 站點 | 網址 | 輸出 | 部署 |
|------|------|------|------|
| 個人 | https://gumpcpy.github.io/ | `docs/` | Pages：`main` → **/docs** |
| 公司 | https://www.huhu-tech.com/ | `apps/company/dist/` | `rsync` → `/var/www/huhu_site` |

## 目錄

```text
content/                 # 文案 JSON（只維護這份）
assets/
  personal/              # Coursera 等個人資產
  shared/                # 海報、沉浸式圖（兩邊可用）
  company/               # logo、Datacenter 截圖、微信…
apps/
  personal/              # 個人站原始碼（靜態）
  company/               # 公司站 Vite + React → dist/
scripts/
  build-personal.sh
  build-company.sh
  deploy-personal.sh
  deploy-company.sh
legacy/huhu-website/     # 舊靜態站（參考用；巨大 Keynote assets 已 gitignore）
```

## 常用指令

```bash
# 安裝（公司站依賴）
npm install

# 個人站
npm run build:personal
npm run preview:personal          # http://localhost:8080
npm run deploy:personal -- "msg"  # 或 ./scripts/deploy-personal.sh "msg"

# 公司站
cp .env.company.example .env.company   # 填 SSH
npm run dev:company                   # http://localhost:5173
npm run build:company                 # → apps/company/dist
npm run deploy:company                # rsync dist → server
npm run deploy:company -- --dry-run   # 先預覽
```

### 公司站 `.env.company` 範例

```bash
COMPANY_SSH_HOST=user@your-server
COMPANY_SSH_PATH=/var/www/huhu_site
COMPANY_SSH_PORT=22
# COMPANY_SSH_KEY=~/.ssh/id_ed25519
```

### GitHub Pages（個人站）

1. 本地或 CI 執行 `npm run build:personal` → 產出 `docs/`
2. Repo Settings → Pages → **Deploy from a branch**
   - Branch: `main`
   - Folder: **/docs**（不要選 root `/`）
3. 儲存後等 1～2 分鐘：https://gumpcpy.github.io/

（可選）Source 若設成 GitHub Actions，會用 workflow 上傳同一個 `docs/` 產物。）

## 內容怎麼改

| 要改什麼 | 改哪裡 |
|----------|--------|
| 個人作品 | `content/projects.json` |
| 學習證書 | `content/learning.json` |
| 公司服務／聯絡 | `content/company.json` |
| 共用圖 | `assets/shared/` |
| 公司圖 | `assets/company/` |
| 證書圖 | `assets/personal/coursera/` |

之後 React 公司站細節、個人站遷 React，都在 `apps/*` 裡做即可；部署腳本不用變。
