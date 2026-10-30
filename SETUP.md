# APK World setup

The public website is hosted on GitHub Pages. Supabase provides secure owner login, database records and storage for APK and video files.

## 1. Configure Supabase
1. Create a Supabase project.
2. In Project Settings → API, copy the Project URL and publishable key (or legacy anon key).
3. Replace the two placeholder values in config.js with those values.
4. Open the Supabase SQL Editor and run the complete setup.sql file once.
5. In Supabase Authentication → Users, create your owner account with a strong, unique password. Keep public sign-ups disabled.
6. Run this SQL after replacing the email with the exact owner email:

    insert into public.admin_users (user_id)
    select id from auth.users where email = 'YOUR-ADMIN-EMAIL'
    on conflict (user_id) do nothing;

Never put a service_role key, database password or other private credential in this public repository. The publishable/anon key is designed to be public; row-level security policies in setup.sql protect admin actions.

## 2. Enable GitHub Pages
1. Open this repository on GitHub.
2. Go to Settings → Pages.
3. Under Build and deployment, choose Deploy from a branch.
4. Select branch main and folder /(root), then Save.
5. GitHub will show the public website address after deployment.

## 3. Upload content
1. Open the public website address.
2. Go to /admin.html and sign in with your owner account.
3. Publish an APK file, direct HTTPS APK link, or MP4/WebM video.

The starter dashboard limits each upload to 50 MB. Check your Supabase plan limits before uploading larger files. APKs and videos are stored in Supabase, not in the GitHub repository. Only share apps and videos you created or have permission to share. Published files are public. APK World does not scan or certify APK files.