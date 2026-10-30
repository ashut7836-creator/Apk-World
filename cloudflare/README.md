# World Mods Official — Cloudflare migration (staging)

This directory is the separate staging implementation. The live GitHub Pages site and the Lovable project are intentionally left unchanged until the replacement is verified.

## Planned services

- Cloudflare Workers: private admin API and OAuth callback.
- Cloudflare D1: listing metadata and admin session records.
- Google Drive API: file storage with resumable uploads.
- GitHub Pages: current public site, until a new deployment is tested.

## Staging database

D1 database: `world-mods-official-db`

Database ID: `e20794be-a42b-4e37-adcd-4abc076c2814`

The initial schema is in `migrations/0001_world_mods.sql`.

## Important

- Never commit Google OAuth client secrets, refresh tokens, passwords, or Cloudflare API tokens.
- Use Cloudflare Worker secrets for confidential configuration.
- Keep Google Drive OAuth limited to `https://www.googleapis.com/auth/drive.file`.
- Use Google's resumable upload protocol for files; save the resumable session URI only in the signed-in admin browser and resume interrupted transfers.
- Drive storage is subject to the user's available Google storage quota (15 GB shared with Gmail and Photos on a standard account).
- Do not make uploaded files public until the admin explicitly publishes the catalogue item.
- A public Google Drive download can be rate-limited when many people fetch the same file; test public downloads before moving live traffic.
- No deployment or live-site cutover is authorized by this staging branch alone.
