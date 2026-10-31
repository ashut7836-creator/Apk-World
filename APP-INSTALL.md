# World Mod Official — Android app

## Website and installed app
The public GitHub Pages website and the installed Android app use the same World Mod catalogue and community backend. The website-only APK promotion is hidden in the native Android WebView.

## In-app app store
In the Android app, the Explore tab opens on the Apps catalogue. APK cards show the extracted app icon and available version/package details. Tapping Install starts an Android DownloadManager download in the app. The app shows download progress; Android can also display the system download notification. When the file is ready, tap Install to open Android's package installer and approve the installation.

Android still requires the user to confirm installation. APKs are not installed silently.

## App version and updates
The requested display version is 1.0. The Android versionCode is 4 so it remains higher than the previously published versionCode 3 and can be installed as an update, provided the existing permanent signing key is retained.

The native app checks the configured app-update.json feed. A release feed must only advertise an APK after the signed release has been built and verified with the same package ID and permanent signing key. Until then, the app allows users to continue into the app if the update feed is unavailable.

## Community accounts
Community account records are stored on the server. A reinstall may clear the device's saved login session, so a member may need to sign in again using the same account credentials.
