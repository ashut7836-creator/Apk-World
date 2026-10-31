(() => {
  "use strict";

  const MAX_DATA_URL_CHARS = 120000;
  window.wmoApkThumbnail = null;
  window.wmoApkParsePromise = Promise.resolve(null);

  function setStatus(message, isError) {
    const status = document.getElementById("apk-meta-status");
    if (status) {
      status.textContent = message;
      status.style.color = isError ? "#ff929c" : "#9ba8c2";
    }
  }

  function textFrom(result, keys) {
    for (const key of keys) {
      const value = key.split(".").reduce((object, part) => object && object[part], result);
      if (typeof value === "string" && value.trim()) return value.trim();
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
          if (!/^data:image\/(?:webp|png);base64,/.test(output)) {
            output = canvas.toDataURL("image/png");
          }
          if (output.length > MAX_DATA_URL_CHARS) {
            canvas.width = 96;
            canvas.height = 96;
            const smaller = canvas.getContext("2d");
            smaller.clearRect(0, 0, 96, 96);
            smaller.drawImage(image, 0, 0, 96, 96);
            output = smaller.canvas.toDataURL("image/png");
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
    const title = document.getElementById("title");
    const version = document.getElementById("version");
    if (!window.AppInfoParser) {
      setStatus("Automatic icon parser did not load. You can still upload the APK and add an image manually later.", true);
      return null;
    }

    setStatus("Reading the APK's app name, version and icon…", false);
    const parser = new window.AppInfoParser(file);
    const result = await parser.parse();

    const appName = textFrom(result, [
      "applicationLabel", "name", "appName", "application.label", "application.name"
    ]);
    const appVersion = textFrom(result, ["versionName", "version", "application.versionName"]);
    if (title && !title.value.trim() && appName) title.value = appName.slice(0, 120);
    if (version && !version.value.trim() && appVersion) version.value = appVersion.slice(0, 40);

    const icon = result.icon || result.iconBase64 || result.applicationIcon || "";
    window.wmoApkThumbnail = await resizeIconToDataUrl(icon);
    const detail = [appName, appVersion ? "Version " + appVersion : ""].filter(Boolean).join(" · ");
    setStatus((detail ? detail + " · " : "") + "App icon detected and ready to publish.", false);
    return result;
  }

  document.addEventListener("change", event => {
    const input = event.target;
    if (!input || input.id !== "file") return;
    const kind = document.getElementById("kind");
    const file = input.files && input.files[0];
    if (!file || !kind || kind.value !== "app" || !/\.apk$/i.test(file.name)) {
      window.wmoApkThumbnail = null;
      window.wmoApkParsePromise = Promise.resolve(null);
      return;
    }
    window.wmoApkParsePromise = readApk(file).catch(error => {
      window.wmoApkThumbnail = null;
      setStatus("Icon extraction was not available: " + (error.message || "unknown error") + " You can still upload the APK.", true);
      return null;
    });
  });
})();