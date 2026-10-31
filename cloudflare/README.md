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


## Community features

The production D1 database also contains the community tables (`community_users`, `community_sessions`, `community_messages`, `community_reports`, `community_shoutouts`, `community_requests`, `community_notifications`, `community_notification_reads`, `community_activity`, and `community_login_limits`), plus `catalogue_stats` and catalogue metadata columns `sha256`, `category`, and `android_requirement`. These schema additions were applied to the existing production D1 database before the Worker rollout. Do not re-run ad-hoc `ALTER TABLE` statements against that database.

The Worker serves `/community-admin` for the existing site Owner and authorised community admins. Public accounts use username plus a private six-digit PIN; only the Owner can promote or demote community admins. The chat is a shared public room with moderation, reporting, spam cooldowns, app requests, notifications and the global shoutout.
