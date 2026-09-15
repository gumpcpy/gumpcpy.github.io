# 賽姬的問卷 — media for personal site

把圖檔放進對應路徑（PNG 或 JPG）。路徑已寫在 `content/work/items/questionnaire-of-psyche.json`。

```
hero/zh.png          # 標題旁小圖／主視覺（中文）
hero/en.png          # 同上（英文；可與 zh 相同）
screens/zh/01.png … # System 橫向截圖／現場照片（中文）
screens/en/01.png … # 同上（英文）
```

建議：
- hero 用方圖或接近 app icon／海報裁切（約 512–1024px）
- screens 用直式或現場照，檔名 `01.png` 起依序即可；沒有的編號可先刪 JSON 裡對應路徑

放好圖後執行：`npm run build:personal`  
中文改完、要上線時：把 JSON 與 `content/work/index.json` 的 `"ready": true`。
