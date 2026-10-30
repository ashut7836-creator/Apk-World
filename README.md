# APK World

APK World is a public, mobile-friendly library for apps, APK downloads, external download links and videos.

## Website management
There is no public admin dashboard. The site owner sends content to the website manager, who adds the media files and updates `media.json` in this repository.

## Add content
- Put APK files in `downloads/`.
- Put video files in `videos/`.
- Add an entry for each item to `media.json`.

Example entries:

```json
[
  {
    "type": "app",
    "title": "Example App",
    "description": "A short description",
    "version": "1.0",
    "size": "12 MB",
    "file": "downloads/example.apk"
  },
  {
    "type": "video",
    "title": "Example Video",
    "description": "A short description",
    "file": "videos/example.mp4"
  },
  {
    "type": "link",
    "title": "External App",
    "description": "Download from the official source",
    "url": "https://example.com/download"
  }
]
```

GitHub Pages hosts the public site. Small media files can be stored with the site; large videos should use a video host or file-storage service and be listed as external HTTPS links to avoid making the website repository unnecessarily large.

Only upload apps and videos you created or have permission to share. APK World does not scan or certify third-party APKs.