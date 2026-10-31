package com.worldmodsofficial.app;

import android.Manifest;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.view.Gravity;
import android.view.View;
import android.webkit.SslErrorHandler;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private static final String HOME_URL = "https://ashut7836-creator.github.io/Apk-World/";
    private static final String UPDATE_URL = "https://ashut7836-creator.github.io/Apk-World/app-update.json";
    private static final String SITE_HOST = "ashut7836-creator.github.io";
    private static final String API_HOST = "world-mods-official-api.ashut7836.workers.dev";
    private static final int NOTIFICATION_PERMISSION_REQUEST = 4102;

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final ExecutorService updateExecutor = Executors.newSingleThreadExecutor();
    private WebView webView;
    private DownloadManager downloadManager;

    private LinearLayout gateRoot;
    private TextView gateStatus;
    private TextView gateVersion;
    private ProgressBar gateProgress;
    private Button gatePrimary;
    private Button gateSecondary;

    private JSONObject pendingUpdate;
    private long updateDownloadId = -1L;
    private Runnable updatePoller;
    private boolean updateDownloadFinished;
    private boolean pendingInstallerPermission;
    private boolean installerLaunched;
    private boolean checkingUpdate;

    private AlertDialogState downloadState;

    private static class AlertDialogState {
        android.app.AlertDialog dialog;
        TextView details;
        ProgressBar progress;
        Button primary;
        Button secondary;
        long id = -1L;
        String name = "Download";
        String mimeType = "application/octet-stream";
        boolean isApk;
        boolean complete;
        boolean failed;
        Runnable poller;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(11, 16, 32));
        getWindow().setNavigationBarColor(Color.rgb(11, 16, 32));
        downloadManager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        showGate("Checking for the latest WorldMod Official version…", true);
        checkForRequiredUpdate();
    }

    private void checkForRequiredUpdate() {
        if (checkingUpdate) return;
        checkingUpdate = true;
        showGate("Checking for updates…", true);
        updateExecutor.execute(() -> {
            JSONObject metadata = null;
            String error = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(UPDATE_URL + "?check=" + System.currentTimeMillis());
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setConnectTimeout(10000);
                connection.setReadTimeout(10000);
                connection.setUseCaches(false);
                connection.setRequestProperty("Cache-Control", "no-cache, no-store");
                connection.setRequestProperty("Accept", "application/json");
                int status = connection.getResponseCode();
                if (status != HttpURLConnection.HTTP_OK) {
                    throw new IllegalStateException("Update service returned HTTP " + status + ".");
                }
                try (InputStream input = connection.getInputStream()) {
                    byte[] buffer = new byte[8192];
                    java.io.ByteArrayOutputStream output = new java.io.ByteArrayOutputStream();
                    int count;
                    while ((count = input.read(buffer)) != -1) {
                        if (output.size() + count > 128 * 1024) {
                            throw new IllegalStateException("Update information is too large.");
                        }
                        output.write(buffer, 0, count);
                    }
                    metadata = new JSONObject(output.toString("UTF-8"));
                }
                if (!getPackageName().equals(metadata.optString("packageName"))) {
                    throw new IllegalStateException("Update information is for a different app.");
                }
                if (metadata.optInt("versionCode", 0) < 1
                        || metadata.optString("versionName").trim().isEmpty()) {
                    throw new IllegalStateException("Update information is incomplete.");
                }
                String apkUrl = metadata.optString("apkUrl");
                Uri apkUri = Uri.parse(apkUrl);
                if (!"https".equalsIgnoreCase(apkUri.getScheme())
                        || !"github.com".equalsIgnoreCase(apkUri.getHost())
                        || !"/ashut7836-creator/Apk-World/releases/latest/download/WorldMod-Official.apk".equals(apkUri.getPath())) {
                    throw new IllegalStateException("The update download address is not trusted.");
                }
            } catch (Exception exception) {
                error = exception.getMessage() == null ? "Could not check for updates." : exception.getMessage();
            } finally {
                if (connection != null) connection.disconnect();
            }

            final JSONObject result = metadata;
            final String failure = error;
            mainHandler.post(() -> {
                checkingUpdate = false;
                if (result == null) {
                    showOfflineGate(failure == null ? "Could not check for updates." : failure);
                    return;
                }
                int latestCode = result.optInt("versionCode", 0);
                if (latestCode > BuildConfig.VERSION_CODE && result.optBoolean("mandatory", true)) {
                    pendingUpdate = result;
                    showMandatoryUpdate();
                } else {
                    pendingUpdate = null;
                    openMainApp();
                }
            });
        });
    }

    private void showGate(String message, boolean busy) {
        gateRoot = new LinearLayout(this);
        gateRoot.setOrientation(LinearLayout.VERTICAL);
        gateRoot.setGravity(Gravity.CENTER);
        gateRoot.setPadding(dp(28), dp(30), dp(28), dp(30));
        gateRoot.setBackgroundColor(Color.rgb(11, 16, 32));

        TextView brand = new TextView(this);
        brand.setText("W");
        brand.setTextColor(Color.rgb(105, 229, 208));
        brand.setTextSize(38);
        brand.setGravity(Gravity.CENTER);
        brand.setTypeface(null, android.graphics.Typeface.BOLD);
        gateRoot.addView(brand, new LinearLayout.LayoutParams(-1, dp(58)));

        TextView heading = new TextView(this);
        heading.setText("WorldMod Official");
        heading.setTextColor(Color.WHITE);
        heading.setTextSize(23);
        heading.setGravity(Gravity.CENTER);
        heading.setTypeface(null, android.graphics.Typeface.BOLD);
        LinearLayout.LayoutParams headingParams = new LinearLayout.LayoutParams(-1, -2);
        headingParams.topMargin = dp(10);
        gateRoot.addView(heading, headingParams);

        gateVersion = new TextView(this);
        gateVersion.setText("Version " + BuildConfig.VERSION_NAME);
        gateVersion.setTextColor(Color.rgb(164, 179, 203));
        gateVersion.setTextSize(12);
        gateVersion.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams versionParams = new LinearLayout.LayoutParams(-1, -2);
        versionParams.topMargin = dp(7);
        gateRoot.addView(gateVersion, versionParams);

        gateStatus = new TextView(this);
        gateStatus.setText(message);
        gateStatus.setTextColor(Color.rgb(221, 230, 245));
        gateStatus.setTextSize(14);
        gateStatus.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams statusParams = new LinearLayout.LayoutParams(-1, -2);
        statusParams.topMargin = dp(22);
        gateRoot.addView(gateStatus, statusParams);

        gateProgress = new ProgressBar(this);
        gateProgress.setIndeterminate(busy);
        LinearLayout.LayoutParams progressParams = new LinearLayout.LayoutParams(dp(52), dp(52));
        progressParams.topMargin = dp(20);
        gateRoot.addView(gateProgress, progressParams);

        gatePrimary = new Button(this);
        gatePrimary.setVisibility(View.GONE);
        LinearLayout.LayoutParams primaryParams = new LinearLayout.LayoutParams(-1, -2);
        primaryParams.topMargin = dp(24);
        gateRoot.addView(gatePrimary, primaryParams);

        gateSecondary = new Button(this);
        gateSecondary.setVisibility(View.GONE);
        LinearLayout.LayoutParams secondaryParams = new LinearLayout.LayoutParams(-1, -2);
        secondaryParams.topMargin = dp(8);
        gateRoot.addView(gateSecondary, secondaryParams);

        setContentView(gateRoot);
    }

    private void showOfflineGate(String message) {
        showGate("We couldn't verify the latest app version. Connect to the internet and try again.", false);
        gateProgress.setVisibility(View.GONE);
        gateVersion.setText(message);
        gatePrimary.setText("Try again");
        gatePrimary.setVisibility(View.VISIBLE);
        gatePrimary.setOnClickListener(view -> checkForRequiredUpdate());
        gateSecondary.setText("Continue to app");
        gateSecondary.setVisibility(View.VISIBLE);
        gateSecondary.setOnClickListener(view -> {
            pendingUpdate = null;
            openMainApp();
        });
    }

    private void showMandatoryUpdate() {
        String version = pendingUpdate.optString("versionName", "new version");
        String notes = pendingUpdate.optString("releaseNotes", "Important improvements and fixes.");
        showGate("A required update is available. Install it to continue using WorldMod Official.", false);
        gateVersion.setText("Version " + BuildConfig.VERSION_NAME + " → " + version);
        gateProgress.setVisibility(View.GONE);
        gatePrimary.setText("Update now");
        gatePrimary.setVisibility(View.VISIBLE);
        gatePrimary.setOnClickListener(view -> beginMandatoryUpdate());
        gateSecondary.setText("What's new");
        gateSecondary.setVisibility(View.VISIBLE);
        gateSecondary.setOnClickListener(view -> gateStatus.setText(notes));
    }

    private void beginMandatoryUpdate() {
        if (pendingUpdate == null) return;
        if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
            pendingInstallerPermission = true;
            gateStatus.setText("Allow WorldMod Official to install this update in Android settings. Return here after allowing it.");
            try {
                Intent settings = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + getPackageName()));
                startActivity(settings);
            } catch (Exception exception) {
                gateStatus.setText("Open Android Settings and allow installation from this app, then return and tap Update now.");
            }
            return;
        }
        enqueueMandatoryUpdate();
    }

    private void enqueueMandatoryUpdate() {
        if (downloadManager == null) {
            showMandatoryUpdateError("Android downloads are unavailable on this device.");
            return;
        }
        try {
            Uri uri = Uri.parse(pendingUpdate.optString("apkUrl"));
            String version = pendingUpdate.optString("versionName", "update").replaceAll("[^A-Za-z0-9._-]", "_");
            String filename = "WorldMod-Official-" + version + ".apk";
            DownloadManager.Request request = new DownloadManager.Request(uri);
            request.setTitle("WorldMod Official update");
            request.setDescription("Downloading version " + pendingUpdate.optString("versionName"));
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);
            request.setMimeType("application/vnd.android.package-archive");
            updateDownloadId = downloadManager.enqueue(request);
            updateDownloadFinished = false;
            showMandatoryUpdate();
            gateStatus.setText("Downloading update…");
            gateProgress.setVisibility(View.VISIBLE);
            gateProgress.setIndeterminate(true);
            gatePrimary.setText("Hide progress");
            gatePrimary.setOnClickListener(view -> gateStatus.setText("The download continues in the background. Return here to check progress."));
            gateSecondary.setText("Cancel download");
            gateSecondary.setVisibility(View.VISIBLE);
            gateSecondary.setOnClickListener(view -> {
                if (updateDownloadId != -1L) downloadManager.remove(updateDownloadId);
                stopUpdatePolling();
                showMandatoryUpdateError("The update download was cancelled. Try again to continue.");
            });
            requestNotificationPermission();
            startUpdatePolling(updateDownloadId);
        } catch (Exception exception) {
            showMandatoryUpdateError("Could not start the update download. Please try again.");
        }
    }

    private void startUpdatePolling(long id) {
        stopUpdatePolling();
        updatePoller = new Runnable() {
            @Override public void run() { pollMandatoryUpdate(id); }
        };
        mainHandler.post(updatePoller);
    }

    private void pollMandatoryUpdate(long id) {
        if (downloadManager == null || id != updateDownloadId) return;
        try (Cursor cursor = downloadManager.query(new DownloadManager.Query().setFilterById(id))) {
            if (cursor == null || !cursor.moveToFirst()) {
                showMandatoryUpdateError("The update download status is unavailable.");
                return;
            }
            int downloadedColumn = cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR);
            int totalColumn = cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES);
            int statusColumn = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
            int reasonColumn = cursor.getColumnIndex(DownloadManager.COLUMN_REASON);
            long downloaded = downloadedColumn >= 0 ? cursor.getLong(downloadedColumn) : 0;
            long total = totalColumn >= 0 ? cursor.getLong(totalColumn) : -1;
            int status = statusColumn >= 0 ? cursor.getInt(statusColumn) : -1;
            int reason = reasonColumn >= 0 ? cursor.getInt(reasonColumn) : 0;

            if (status == DownloadManager.STATUS_SUCCESSFUL) {
                updateDownloadFinished = true;
                stopUpdatePolling();
                gateProgress.setIndeterminate(false);
                gateProgress.setProgress(100);
                gateStatus.setText("Download complete. Verifying the update package…");
                updateExecutor.execute(() -> verifyThenInstall(id));
                return;
            }
            if (status == DownloadManager.STATUS_FAILED) {
                showMandatoryUpdateError("The update download failed (code " + reason + "). Please retry.");
                return;
            }
            gateProgress.setIndeterminate(total <= 0);
            if (total > 0) {
                gateProgress.setMax(1000);
                gateProgress.setProgress((int) Math.min(1000L, downloaded * 1000L / total));
                gateStatus.setText(formatBytes(downloaded) + " of " + formatBytes(total) + " · "
                        + Math.min(100, downloaded * 100L / total) + "%");
            } else {
                gateStatus.setText(formatBytes(downloaded) + " downloaded · Getting total size…");
            }
            if (updatePoller != null) mainHandler.postDelayed(updatePoller, 700L);
        } catch (Exception exception) {
            showMandatoryUpdateError("Could not read update download progress.");
        }
    }

    private void verifyThenInstall(long id) {
        String expected = pendingUpdate.optString("sha256", "").trim().toLowerCase(Locale.ROOT);
        try {
            Uri uri = downloadManager.getUriForDownloadedFile(id);
            if (uri == null) throw new IllegalStateException("The downloaded update file could not be opened.");
            if (!expected.isEmpty()) {
                String actual = sha256(uri);
                if (!actual.equals(expected)) throw new IllegalStateException("The update file did not pass its integrity check.");
            }
            mainHandler.post(() -> {
                gateStatus.setText("Update verified. Opening Android installer…");
                installDownloadedUpdate(uri);
            });
        } catch (Exception exception) {
            mainHandler.post(() -> showMandatoryUpdateError(
                    exception.getMessage() == null ? "Update verification failed." : exception.getMessage()));
        }
    }

    private String sha256(Uri uri) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (InputStream input = getContentResolver().openInputStream(uri)) {
            if (input == null) throw new IllegalStateException("Could not read the update file.");
            byte[] buffer = new byte[64 * 1024];
            int count;
            while ((count = input.read(buffer)) != -1) digest.update(buffer, 0, count);
        }
        byte[] hash = digest.digest();
        StringBuilder hex = new StringBuilder(hash.length * 2);
        for (byte value : hash) hex.append(String.format(Locale.US, "%02x", value & 0xff));
        return hex.toString();
    }

    private void installDownloadedUpdate(Uri uri) {
        if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
            pendingInstallerPermission = true;
            showMandatoryUpdateError("Allow installation from WorldMod Official in Android settings, then return to install the update.");
            gatePrimary.setText("Open install settings");
            gatePrimary.setOnClickListener(view -> beginMandatoryUpdate());
            return;
        }
        try {
            Intent install = new Intent(Intent.ACTION_VIEW);
            install.setDataAndType(uri, "application/vnd.android.package-archive");
            install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            installerLaunched = true;
            startActivity(install);
        } catch (Exception exception) {
            showMandatoryUpdateError("Android could not open the installer. Open the downloaded APK from Downloads.");
        }
    }

    private void showMandatoryUpdateError(String message) {
        stopUpdatePolling();
        showMandatoryUpdate();
        gateProgress.setVisibility(View.GONE);
        gateStatus.setText(message);
        gatePrimary.setText("Try again");
        gatePrimary.setVisibility(View.VISIBLE);
        gatePrimary.setOnClickListener(view -> {
            updateDownloadId = -1L;
            updateDownloadFinished = false;
            beginMandatoryUpdate();
        });
    }

    private void stopUpdatePolling() {
        if (updatePoller != null) {
            mainHandler.removeCallbacks(updatePoller);
            updatePoller = null;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (pendingInstallerPermission && Build.VERSION.SDK_INT >= 26
                && getPackageManager().canRequestPackageInstalls()) {
            pendingInstallerPermission = false;
            if (updateDownloadFinished && updateDownloadId != -1L && downloadManager != null) {
                Uri uri = downloadManager.getUriForDownloadedFile(updateDownloadId);
                if (uri != null) installDownloadedUpdate(uri);
            } else if (pendingUpdate != null) {
                enqueueMandatoryUpdate();
            }
        }
        installerLaunched = false;
    }

    private void openMainApp() {
        if (webView != null) return;
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(11, 16, 32));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportZoom(false);
        settings.setUserAgentString(settings.getUserAgentString() + " WorldModOfficialApp");

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (shouldKeepInWebView(uri)) return false;
                openExternal(uri);
                return true;
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.cancel();
            }
        });

        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) ->
                beginDownload(url, userAgent, contentDisposition, mimeType));

        webView.loadUrl(HOME_URL);
    }

    private void beginDownload(String url, String userAgent, String contentDisposition, String mimeType) {
        try {
            Uri uri = Uri.parse(url);
            if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null) {
                Toast.makeText(this, "Only secure downloads are allowed.", Toast.LENGTH_LONG).show();
                return;
            }
            if (downloadManager == null) {
                Toast.makeText(this, "Downloads are unavailable on this device.", Toast.LENGTH_LONG).show();
                return;
            }

            AlertDialogState state = new AlertDialogState();
            downloadState = state;
            state.name = URLUtil.guessFileName(url, contentDisposition, mimeType);
            state.mimeType = mimeType == null || mimeType.trim().isEmpty()
                    ? (URLUtil.guessContentTypeFromName(state.name) == null ? "application/octet-stream" : URLUtil.guessContentTypeFromName(state.name))
                    : mimeType;
            state.isApk = state.name.toLowerCase(Locale.ROOT).endsWith(".apk")
                    || "application/vnd.android.package-archive".equalsIgnoreCase(state.mimeType);
            DownloadManager.Request request = new DownloadManager.Request(uri);
            request.setTitle(state.name);
            request.setDescription("Downloading from WorldMod Official");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, state.name);
            if (mimeType != null && !mimeType.isEmpty()) request.setMimeType(mimeType);
            if (userAgent != null && !userAgent.isEmpty()) request.addRequestHeader("User-Agent", userAgent);
            state.id = downloadManager.enqueue(request);
            showRegularDownloadDialog(state);
            requestNotificationPermission();
            startRegularDownloadPolling(state);
        } catch (Exception exception) {
            Toast.makeText(this, "Could not start the download.", Toast.LENGTH_LONG).show();
        }
    }

    private void showRegularDownloadDialog(AlertDialogState state) {
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        int padding = dp(20);
        panel.setPadding(padding, dp(8), padding, dp(8));

        state.details = new TextView(this);
        state.details.setTextColor(Color.rgb(35, 45, 60));
        state.details.setTextSize(14);
        state.details.setText("Connecting…");
        panel.addView(state.details, new LinearLayout.LayoutParams(-1, -2));

        state.progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        state.progress.setMax(1000);
        LinearLayout.LayoutParams progressParams = new LinearLayout.LayoutParams(-1, dp(9));
        progressParams.topMargin = dp(14);
        progressParams.bottomMargin = dp(8);
        panel.addView(state.progress, progressParams);

        TextView note = new TextView(this);
        note.setTextColor(Color.rgb(95, 105, 120));
        note.setTextSize(12);
        note.setText("The download continues in the background if you hide this panel.");
        panel.addView(note);

        state.dialog = new android.app.AlertDialog.Builder(this)
                .setTitle(state.name)
                .setView(panel)
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Hide", null)
                .create();
        state.dialog.setOnShowListener(ignored -> {
            state.primary = state.dialog.getButton(android.app.AlertDialog.BUTTON_POSITIVE);
            state.secondary = state.dialog.getButton(android.app.AlertDialog.BUTTON_NEGATIVE);
            state.primary.setOnClickListener(view -> {
                if (state.complete) installRegularDownloadedFile(state);
                else state.dialog.dismiss();
            });
            state.secondary.setOnClickListener(view -> {
                if (!state.complete && !state.failed && state.id != -1L) {
                    downloadManager.remove(state.id);
                    stopRegularDownloadPolling(state);
                    Toast.makeText(this, "Download cancelled.", Toast.LENGTH_SHORT).show();
                }
                state.dialog.dismiss();
            });
        });
        state.dialog.setCanceledOnTouchOutside(false);
        state.dialog.show();
    }

    private void startRegularDownloadPolling(AlertDialogState state) {
        stopRegularDownloadPolling(state);
        state.poller = new Runnable() { @Override public void run() { pollRegularDownload(state); } };
        mainHandler.post(state.poller);
    }

    private void pollRegularDownload(AlertDialogState state) {
        if (downloadManager == null || state.id == -1L) return;
        try (Cursor cursor = downloadManager.query(new DownloadManager.Query().setFilterById(state.id))) {
            if (cursor == null || !cursor.moveToFirst()) {
                state.failed = true;
                setRegularDownloadDetails(state, "Download status is unavailable.");
                stopRegularDownloadPolling(state);
                return;
            }
            int downloadedIndex = cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR);
            int totalIndex = cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES);
            int statusIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
            int reasonIndex = cursor.getColumnIndex(DownloadManager.COLUMN_REASON);
            long downloaded = downloadedIndex >= 0 ? cursor.getLong(downloadedIndex) : 0L;
            long total = totalIndex >= 0 ? cursor.getLong(totalIndex) : -1L;
            int status = statusIndex >= 0 ? cursor.getInt(statusIndex) : -1;
            int reason = reasonIndex >= 0 ? cursor.getInt(reasonIndex) : 0;

            if (status == DownloadManager.STATUS_SUCCESSFUL) {
                state.complete = true;
                if (state.progress != null) {
                    state.progress.setIndeterminate(false);
                    state.progress.setProgress(1000);
                }
                setRegularDownloadDetails(state, "Download complete · " + formatBytes(downloaded) + " saved to Downloads");
                setRegularDownloadButtons(state, state.isApk ? "Install" : "Open", "Close");
                stopRegularDownloadPolling(state);
                return;
            }
            if (status == DownloadManager.STATUS_FAILED) {
                state.failed = true;
                setRegularDownloadDetails(state, "Download failed (code " + reason + "). Please try again.");
                setRegularDownloadButtons(state, "Close", "Close");
                stopRegularDownloadPolling(state);
                return;
            }
            if (total > 0) {
                int progress = (int) Math.min(1000L, downloaded * 1000L / total);
                if (state.progress != null) {
                    state.progress.setIndeterminate(false);
                    state.progress.setProgress(progress);
                }
                long percent = Math.min(100L, downloaded * 100L / total);
                setRegularDownloadDetails(state, formatBytes(downloaded) + " of " + formatBytes(total) + " · " + percent + "%");
            } else {
                if (state.progress != null) state.progress.setIndeterminate(true);
                setRegularDownloadDetails(state, formatBytes(downloaded) + " downloaded · Getting file size…");
            }
            if (state.poller != null) mainHandler.postDelayed(state.poller, 650L);
        } catch (Exception exception) {
            state.failed = true;
            setRegularDownloadDetails(state, "Could not read download progress.");
            stopRegularDownloadPolling(state);
        }
    }

    private void setRegularDownloadDetails(AlertDialogState state, String text) {
        if (state.details != null) state.details.setText(text);
    }

    private void setRegularDownloadButtons(AlertDialogState state, String primary, String secondary) {
        if (state.primary != null) state.primary.setText(primary);
        if (state.secondary != null) state.secondary.setText(secondary);
    }

    private void installRegularDownloadedFile(AlertDialogState state) {
        Uri fileUri = downloadManager.getUriForDownloadedFile(state.id);
        if (fileUri == null) {
            Toast.makeText(this, "Downloaded file could not be opened.", Toast.LENGTH_LONG).show();
            return;
        }
        try {
            if (state.isApk && Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
                Toast.makeText(this, "Allow WorldMod Official to install APKs in Android settings, then return and tap Install.", Toast.LENGTH_LONG).show();
                Intent settings = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + getPackageName()));
                startActivity(settings);
                return;
            }
            String type = state.isApk ? "application/vnd.android.package-archive" : state.mimeType;
            Intent open = new Intent(Intent.ACTION_VIEW);
            open.setDataAndType(fileUri, type);
            open.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivity(open);
        } catch (Exception exception) {
            Toast.makeText(this, state.isApk
                    ? "Open the APK from Downloads and allow installation if Android asks."
                    : "No app is available to open this downloaded file.", Toast.LENGTH_LONG).show();
        }
    }

    private void stopRegularDownloadPolling(AlertDialogState state) {
        if (state.poller != null) {
            mainHandler.removeCallbacks(state.poller);
            state.poller = null;
        }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_REQUEST);
        }
    }

    private String formatBytes(long bytes) {
        if (bytes < 0L) return "Unknown size";
        return String.format(Locale.US, "%.1f MB", bytes / (1024.0 * 1024.0));
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private boolean shouldKeepInWebView(Uri uri) {
        if (uri == null || !"https".equalsIgnoreCase(uri.getScheme())) return false;
        String host = uri.getHost();
        if (host == null) return false;
        if (SITE_HOST.equalsIgnoreCase(host) || API_HOST.equalsIgnoreCase(host)) return true;

        // Keep only the official Google Drive file-download endpoints inside WebView.
        // This lets DownloadListener hand APK files to Android DownloadManager rather
        // than sending the user to an external browser.
        if ("drive.google.com".equalsIgnoreCase(host)) {
            return "/uc".equals(uri.getPath())
                    && "download".equalsIgnoreCase(uri.getQueryParameter("export"));
        }
        if ("drive.usercontent.google.com".equalsIgnoreCase(host)) {
            return "/download".equals(uri.getPath());
        }
        return false;
    }

    private void openExternal(Uri uri) {
        if (uri == null || uri.getScheme() == null) return;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (Exception ignored) {
            Toast.makeText(this, "No app can open this link.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (pendingUpdate != null) {
            Toast.makeText(this, "Install the required update to continue.", Toast.LENGTH_SHORT).show();
        } else if (downloadState != null && downloadState.dialog != null && downloadState.dialog.isShowing()) {
            downloadState.dialog.dismiss();
        } else if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        stopUpdatePolling();
        if (downloadState != null) {
            stopRegularDownloadPolling(downloadState);
            if (downloadState.dialog != null && downloadState.dialog.isShowing()) downloadState.dialog.dismiss();
        }
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        updateExecutor.shutdownNow();
        super.onDestroy();
    }
}
