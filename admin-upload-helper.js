(() => {
  "use strict";

  const MAX_DATA_URL_CHARS = 120000;
  window.wmoApkThumbnail = null;
  window.wmoApkPackageName = "";
  window.wmoApkVersionCode = "";
  window.wmoApkParsePromise = Promise.resolve(null);

  function setStatus(message, isError) {
    const status = document.getElementById("apk-meta-status");
    if (status) {
      status.textContent = message;
      status.style.color = isError ? "#ff929c" : "#9ba8c2";
    }
  }

  function valueAt(result, path) {
    return path.split(".").reduce((value, part) => value && value[part], result);
  }

  function asText(value) {
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(" ").trim();
    if (value && typeof value === "object" && value.value !== undefined) return asText(value.value);
    return "";
  }

  function firstText(result, paths) {
    for (const path of paths) {
      const value = asText(valueAt(result, path));
      if (value) return value;
    }
    return "";
  }

  function resizeIconToDataUrl(icon) {
    return new Promise((resolve, reject) => {
      if (typeof icon !== "string" || !icon.trim()) {
        reject(new Error("This APK does not expose a readable app icon."));
        return;
      }
      const source = icon.startsWith("data:image/")
        ? icon
        : "data:image/png;base64," + icon.replace(/^data:[^,]*,/, "");

      const image = new Image();
      image.onload = () => {
        try {
          const side = 128;
          const canvas = document.createElement("canvas");
          canvas.width = side;
          canvas.height = side;
          const context = canvas.getContext("2d", { alpha: true });
          if (!context) throw new Error("Image canvas is unavailable.");

          const ratio = Math.min(side / image.width, side / image.height);
          const width = Math.max(1, Math.round(image.width * ratio));
          const height = Math.max(1, Math.round(image.height * ratio));
          context.clearRect(0, 0, side, side);
          context.drawImage(image, Math.round((side - width) / 2), Math.round((side - height) / 2), width, height);

          let output = canvas.toDataURL("image/webp", 0.84);
          if (!/^data:image\/(?:webp|png);base64,/.test(output)) output = canvas.toDataURL("image/png");
          if (output.length > MAX_DATA_URL_CHARS) {
            canvas.width = 96;
            canvas.height = 96;
            const smaller = canvas.getContext("2d");
            smaller.clearRect(0, 0, 96, 96);
            const scale = Math.min(96 / image.width, 96 / image.height);
            const sw = Math.max(1, Math.round(image.width * scale));
            const sh = Math.max(1, Math.round(image.height * scale));
            smaller.drawImage(image, Math.round((96 - sw) / 2), Math.round((96 - sh) / 2), sw, sh);
            output = canvas.toDataURL("image/png");
          }
          if (output.length > MAX_DATA_URL_CHARS) throw new Error("The icon is too large to save safely.");
          resolve(output);
        } catch (error) {
          reject(error);
        }
      };
      image.onerror = () => reject(new Error("Could not decode the icon stored in this APK."));
      image.src = source;
    });
  }

  async function readApk(file) {
    window.wmoApkThumbnail = null;
    window.wmoApkPackageName = "";
    window.wmoApkVersionCode = "";
    const title = document.getElementById("title");
    const version = document.getElementById("version");
    if (!window.AppInfoParser) {
      setStatus("The APK metadata parser did not load. You can still enter details manually and upload.", true);
      return null;
    }

    setStatus("Reading the APK name, package, version and icon…", false);
    const parser = new window.AppInfoParser(file);
    const result = await parser.parse();

    const appName = firstText(result, [
      "application.label", "applicationLabel", "name", "appName", "application.name"
    ]);
    const appVersion = firstText(result, ["versionName", "version", "application.versionName"]);
    const packageName = firstText(result, ["package", "packageName", "applicationId"]);
    const versionCode = firstText(result, ["versionCode"]);

    if (title && !title.value.trim() && appName) title.value = appName.slice(0, 120);
    if (version && !version.value.trim() && appVersion) version.value = appVersion.slice(0, 40);

    window.wmoApkPackageName = /^[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)+$/.test(packageName) ? packageName : "";
    window.wmoApkVersionCode = /^\d+$/.test(versionCode) ? versionCode : "";

    const icon = result.icon || result.iconBase64 || result.applicationIcon || "";
    if (icon) window.wmoApkThumbnail = await resizeIconToDataUrl(icon);
    const detail = [
      appName,
      appVersion ? "Version " + appVersion : "",
      window.wmoApkPackageName ? "Package " + window.wmoApkPackageName : "",
      window.wmoApkVersionCode ? "Code " + window.wmoApkVersionCode : "",
      window.wmoApkThumbnail ? "Icon ready" : "Icon unavailable"
    ].filter(Boolean).join(" · ");
    setStatus(detail || "APK read. Review its details before publishing.", !window.wmoApkThumbnail);
    return result;
  }

  document.addEventListener("change", event => {
    const input = event.target;
    if (!input || input.id !== "file") return;
    const kind = document.getElementById("kind");
    const file = input.files && input.files[0];
    if (!file || !kind || kind.value !== "app" || !/\.apk$/i.test(file.name)) {
      window.wmoApkThumbnail = null;
      window.wmoApkPackageName = "";
      window.wmoApkVersionCode = "";
      window.wmoApkParsePromise = Promise.resolve(null);
      return;
    }
    window.wmoApkParsePromise = readApk(file).catch(error => {
      window.wmoApkThumbnail = null;
      window.wmoApkPackageName = "";
      window.wmoApkVersionCode = "";
      setStatus("Some APK details could not be read: " + (error.message || "unknown error") + " You can enter them manually and still upload.", true);
      return null;
    });
  });
})();