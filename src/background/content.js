let clickCount = 0;
let wordCount = 0;
setInterval(function () {
  console.log(clickCount);
}, 100);

document.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "trackClick", clickCount });
  clickCount++;
});

document.addEventListener("keydown", (event) => {
  console.log("Triggered");
});

let iframeWords = new Map();

function detectGoogleDocsTyping() {
  let iframes = document.querySelectorAll('iframe');

  iframes.forEach((iframe) => {
    try {
      if (iframe.contentDocument) {
        if (!iframeWords.has(iframe)) {
          iframeWords.set(iframe, "");
        }

        iframe.contentDocument.addEventListener("keydown", (e) => {
          let buffer = iframeWords.get(iframe);

          if (e.key.length === 1 && /\w/.test(e.key)) {
            buffer += e.key;
          } else if (e.key === " " || e.key === "Enter" || /[\.,!?;:]/.test(e.key)){
            if (buffer.trim().length > 0) {
              console.log("word detected:", buffer);
            }

            buffer = "";
          }

          iframeWords.set(iframe, buffer);
        });
      }
    } catch (error) {
      console.log("Cant access iframe");
    }
  });
}

setTimeout(detectGoogleDocsTyping, 2000);
