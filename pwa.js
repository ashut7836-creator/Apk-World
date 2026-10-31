(() => {
  const installButton = document.getElementById("install-app");
  let installEvent = null;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  if (installButton && !isStandalone) {
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      installEvent = event;
      installButton.hidden = false;
    });
    installButton.addEventListener("click", async () => {
      if (!installEvent) return;
      installEvent.prompt();
      await installEvent.userChoice.catch(() => null);
      installEvent = null;
      installButton.hidden = true;
    });
    window.addEventListener("appinstalled", () => {
      installEvent = null;
      installButton.hidden = true;
    });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js", {scope:"./"})
        .catch(error => console.warn("PWA offline support could not be enabled:", error));
    });
  }
})();
