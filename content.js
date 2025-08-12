'use strict';

(function main() {
  const TARGET_SELECTOR = '#entryCanvas';
  let injected = false;

  function waitForElement(selector) {
    return new Promise((resolve) => {
      const found = document.querySelector(selector);
      if (found) return resolve(found);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });
      observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
      });
    });
  }

  function injectFileOnce(file) {
    if (injected) return;
    injected = true;
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(file);
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  }

  waitForElement(TARGET_SELECTOR).then(() => {
    injectFileOnce('injected.js');
  });
})();
