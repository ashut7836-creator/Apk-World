# APK World — content management

The public website is hosted with GitHub Pages. There is intentionally no public admin dashboard.

## How new uploads are managed
Send the APK, video, or download URL to the APK World website manager in the chat. Include the display name and a short description. The website manager can then add the supported files to this GitHub repository and update `media.json`, subject to file-size and hosting limits.

## Repository layout
- `index.html`, `styles.css`, `app.js`: public website
- `media.json`: catalogue shown on the website
- `downloads/`: APK files
- `videos/`: small MP4/WebM video files

Large video files are better hosted on a video or file-storage service and linked from the catalogue. GitHub Pages is static website hosting, not an unlimited media server.

## Publishing
GitHub repository → Settings → Pages → Deploy from a branch → `main` → `/(root)`.

## Safety
Only publish content you created or have permission to distribute. Do not upload copyrighted apps/videos without permission, modified apps presented as official, or files you have not checked. Published content is public. Never add passwords, personal access tokens, or service-role keys to the repository.