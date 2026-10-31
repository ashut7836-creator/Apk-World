package com.worldmodsofficial.app;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
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

public class MainActivity extends Activity {
    private static final String HOME_URL = "https://ashut7836-creator.github.io/Apk-World/";
    private static final String SITE_HOST = "ashut7836-creator.github.io";
    private static final int NOTIFICATION_PERMISSION_REQUEST = 4102;

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private WebView webView;
    private DownloadManager downloadManager;
    private AlertDialog downloadDialog;
    private TextView downloadDetails;
    private ProgressBar downloadProgress;
    private Button primaryDownloadButton;
    private Button secondaryDownloadButton;
    private long activeDownloadId = -1L;
    private String activeDownloadName = "Download";
    private boolean downloadComplete;
    private boolean downloadFailed;
    private Runnable downloadPoller;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(11, 16, 32));
        getWindow().setNavigationBarColor(Color.rgb(11, 16, 32));

        downloadManager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);

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

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equalsIgnoreCase(uri.getScheme()) && SITE_HOST.equalsIgnoreCase(uri.getHost())) {
                    return false;
                }
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

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(HOME_URL);
        }
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

            activeDownloadName = URLUtil.guessFileName(url, contentDisposition, mimeType);
            DownloadManager.Request request = new DownloadManager.Request(uri);
            request.setTitle(activeDownloadName);
            request.setDescription("Downloading from WorldMod Official");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, activeDownloadName);
            if (mimeType != null && !mimeType.isEmpty()) request.setMimeType(mimeType);
            if (userAgent != null && !userAgent.isEmpty()) request.addRequestHeader("User-Agent", userAgent);

            activeDownloadId = downloadManager.enqueue(request);
            downloadComplete = false;
            downloadFailed = false;
            showDownloadProgress();
            requestNotificationPermission();
            startDownloadPolling(activeDownloadId);
        } catch (Exception exception) {
            Toast.makeText(this, "Could not start the download.", Toast.LENGTH_LONG).show();
        }
    }

    private void showDownloadProgress() {
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        int padding = dp(20);
        panel.setPadding(padding, dp(8), padding, dp(8));

        downloadDetails = new TextView(this);
        downloadDetails.setTextColor(Color.rgb(35, 45, 60));
        downloadDetails.setTextSize(14);
        downloadDetails.setText("Connecting…");
        panel.addView(downloadDetails, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        downloadProgress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        downloadProgress.setMax(1000);
        LinearLayout.LayoutParams progressParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dp(9));
        progressParams.topMargin = dp(14);
        progressParams.bottomMargin = dp(8);
        panel.addView(downloadProgress, progressParams);

        TextView note = new TextView(this);
        note.setTextColor(Color.rgb(95, 105, 120));
        note.setTextSize(12);
        note.setText("Your download continues in the background when you hide this panel.");
        panel.addView(note);

        downloadDialog = new AlertDialog.Builder(this)
                .setTitle(activeDownloadName)
                .setView(panel)
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Hide", null)
                .create();

        downloadDialog.setOnShowListener(ignored -> {
            primaryDownloadButton = downloadDialog.getButton(AlertDialog.BUTTON_POSITIVE);
            secondaryDownloadButton = downloadDialog.getButton(AlertDialog.BUTTON_NEGATIVE);

            primaryDownloadButton.setOnClickListener(view -> {
                if (downloadComplete) {
                    installDownloadedFile();
                } else {
                    downloadDialog.dismiss();
                }
            });

            secondaryDownloadButton.setOnClickListener(view -> {
                if (!downloadComplete && !downloadFailed && activeDownloadId != -1L) {
                    downloadManager.remove(activeDownloadId);
                    stopDownloadPolling();
                    Toast.makeText(this, "Download cancelled.", Toast.LENGTH_SHORT).show();
                }
                downloadDialog.dismiss();
            });
        });
        downloadDialog.setCanceledOnTouchOutside(false);
        downloadDialog.show();
    }

    private void startDownloadPolling(long downloadId) {
        stopDownloadPolling();
        downloadPoller = new Runnable() {
            @Override
            public void run() {
                pollDownload(downloadId);
            }
        };
        mainHandler.post(downloadPoller);
    }

    private void pollDownload(long downloadId) {
        if (downloadManager == null || downloadId != activeDownloadId) return;

        Cursor cursor = null;
        try {
            cursor = downloadManager.query(new DownloadManager.Query().setFilterById(downloadId));
            if (cursor == null || !cursor.moveToFirst()) {
                markDownloadFailed("Download status is unavailable.");
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
                downloadComplete = true;
                downloadFailed = false;
                if (downloadProgress != null) {
                    downloadProgress.setIndeterminate(false);
                    downloadProgress.setProgress(1000);
                }
                setDownloadDetails("Download complete · " + formatBytes(downloaded) + " saved to Downloads");
                setDownloadButtons("Install", "Close");
                if (downloadDialog == null || !downloadDialog.isShowing()) {
                    Toast.makeText(this, "Download complete: " + activeDownloadName, Toast.LENGTH_LONG).show();
                }
                stopDownloadPolling();
                return;
            }

            if (status == DownloadManager.STATUS_FAILED) {
                markDownloadFailed("Download failed (code " + reason + "). Please try again.");
                return;
            }

            if (total > 0) {
                int percent = (int) Math.min(1000L, (downloaded * 1000L) / total);
                if (downloadProgress != null) {
                    downloadProgress.setIndeterminate(false);
                    downloadProgress.setProgress(percent);
                }
                int percentLabel = (int) Math.min(100L, (downloaded * 100L) / total);
                setDownloadDetails(formatBytes(downloaded) + " of " + formatBytes(total)
                        + " · " + percentLabel + "%");
            } else {
                if (downloadProgress != null) downloadProgress.setIndeterminate(true);
                setDownloadDetails(formatBytes(downloaded) + " downloaded · Getting file size…");
            }

            if (status == DownloadManager.STATUS_PAUSED) {
                setDownloadDetails("Paused · " + (total > 0
                        ? formatBytes(downloaded) + " of " + formatBytes(total)
                        : formatBytes(downloaded) + " downloaded"));
            }

            if (downloadPoller != null) mainHandler.postDelayed(downloadPoller, 650L);
        } catch (Exception exception) {
            markDownloadFailed("Could not read download progress.");
        } finally {
            if (cursor != null) cursor.close();
        }
    }

    private void markDownloadFailed(String message) {
        downloadFailed = true;
        downloadComplete = false;
        setDownloadDetails(message);
        setDownloadButtons("Close", "Close");
        if (downloadDialog == null || !downloadDialog.isShowing()) {
            Toast.makeText(this, message, Toast.LENGTH_LONG).show();
        }
        stopDownloadPolling();
    }

    private void setDownloadDetails(String message) {
        if (downloadDetails != null) downloadDetails.setText(message);
    }

    private void setDownloadButtons(String primary, String secondary) {
        if (primaryDownloadButton != null) primaryDownloadButton.setText(primary);
        if (secondaryDownloadButton != null) secondaryDownloadButton.setText(secondary);
    }

    private void installDownloadedFile() {
        if (downloadManager == null || activeDownloadId == -1L) return;
        Uri fileUri = downloadManager.getUriForDownloadedFile(activeDownloadId);
        if (fileUri == null) {
            Toast.makeText(this, "Downloaded file could not be opened.", Toast.LENGTH_LONG).show();
            return;
        }
        try {
            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(fileUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivity(installIntent);
        } catch (Exception exception) {
            Toast.makeText(this,
                    "Open the APK from Downloads and allow installation for this app if Android asks.",
                    Toast.LENGTH_LONG).show();
        }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != android.content.pm.PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    NOTIFICATION_PERMISSION_REQUEST);
        }
    }

    private String formatBytes(long bytes) {
        if (bytes < 0L) return "Unknown size";
        double mb = bytes / (1024.0 * 1024.0);
        return String.format(java.util.Locale.US, "%.1f MB", mb);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private void stopDownloadPolling() {
        if (downloadPoller != null) {
            mainHandler.removeCallbacks(downloadPoller);
            downloadPoller = null;
        }
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
        if (downloadDialog != null && downloadDialog.isShowing()) {
            downloadDialog.dismiss();
        } else if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        stopDownloadPolling();
        if (downloadDialog != null && downloadDialog.isShowing()) downloadDialog.dismiss();
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
