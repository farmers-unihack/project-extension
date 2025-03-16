let clickCount = 0;
let wordCount = 0;

document.addEventListener("click", () => {
  clickCount++
  sendMetrics()
});

let buffer = "";
function handlePressedKey(event) {
  if (event.key.length === 1 && /\w/.test(event.key)) {
    buffer += event.key;
  } else if (
    event.key === " " ||
    event.key === "Enter" ||
    /[\.,!?;:]/.test(event.key)
  ) {
    if (buffer.trim().length > 0) {
      wordCount++;
    }
    buffer = "";
    sendMetrics()
  }
}

function injectIFrameBuffer() {
  let iframes = document.querySelectorAll("iframe");

  iframes.forEach((iframe) => {
    try {
      if (iframe.contentDocument) {
        iframe.contentDocument.addEventListener("keydown", (e) => handlePressedKey(e));
      }
    } catch (error) {
      console.log(error)
      console.log("Cant access iframe");
    }
  });
}

async function sendMetrics() {
  try {
    await chrome.runtime.sendMessage({
      action: "update_metrics",
      clickCount,
      wordCount
    });
  } catch (e) {
    console.log(e)
  }
}

document.addEventListener("keydown", (event) => handlePressedKey(event));
setTimeout(injectIFrameBuffer, 2000);

findAllURL = function changeAllURL() {
  var current = window.location.href;
  chrome.storage.local.get("blockedURLs", ({ blockedURLs }) => {
    blockedURLs = blockedURLs || [];

    let normalizedCurrent = current.replace(/^https?:\/\//, "");
    normalizedCurrent = normalizedCurrent.replace(/^www\./, "");

    if (
      blockedURLs.some((url) => {
        let normalizedUrl = url
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "");
        return normalizedCurrent.includes(normalizedUrl);
      })
    ) {
      if (document.body) {
        updateOverlay(true);
      }
       else {
        document.addEventListener("DOMContentLoaded", () =>
          updateOverlay(true)
        );
      }
    }
  });
};

chrome.storage.local.get("running", ({ running }) => {
  if (running) {
    findAllURL();
  }
});

function updateOverlay(isBlocking) {
  let overlay = document.getElementById("blocking-overlay");
  if (isBlocking) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "blocking-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      overlay.style.zIndex = "999999";
      overlay.style.pointerEvents = "all";

      let contentDiv = document.createElement("div");
      contentDiv.style.color = "white";
      contentDiv.style.fontSize = "24px";
      contentDiv.style.textAlign = "center";
      contentDiv.style.position = "absolute";
      contentDiv.style.top = "50%";
      contentDiv.style.left = "50%";
      contentDiv.style.transform = "translate(-50%, -50%)";
      contentDiv.style.display = "flex";
      contentDiv.style.flexDirection = "column";
      contentDiv.style.alignItems = "center";
      contentDiv.style.justifyContent = "center";

      let textDiv = document.createElement("div");
      textDiv.textContent = "Your coffee is still brewing!";
      contentDiv.appendChild(textDiv);

      let img = document.createElement("img");
      img.src = chrome.runtime.getURL("coffecup.png");
      img.alt = "Coffee Cup";
      img.style.marginTop = "20px";
      img.style.width = "100px";
      img.style.height = "auto";
      contentDiv.appendChild(img);

      let giveUpButton = document.createElement("button");
      giveUpButton.textContent = "Give Up";
      giveUpButton.style.marginTop = "20px";
      giveUpButton.style.padding = "10px 20px";
      giveUpButton.style.fontSize = "18px";
      giveUpButton.style.backgroundColor = "transparent";
      giveUpButton.style.color = "white";
      giveUpButton.style.border = "2px solid gray";
      giveUpButton.style.cursor = "pointer";

      giveUpButton.addEventListener("mouseover", () => {
        giveUpButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        giveUpButton.style.borderColor = "white";
      });

      giveUpButton.addEventListener("mouseout", () => {
        giveUpButton.style.backgroundColor = "transparent";
        giveUpButton.style.borderColor = "gray";
      });

      giveUpButton.onclick = async function () {
        chrome.runtime.sendMessage({ action: "stop" });
        let overlay = document.getElementById("blocking-overlay");
        if (overlay) {
          overlay.remove();
        }

        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        return;
      };

      contentDiv.appendChild(giveUpButton);

      overlay.appendChild(contentDiv);
      document.body.appendChild(overlay);

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
  } else {
    //Has to be duplicated as it cannot call functions outside the function
    let overlay = document.getElementById("blocking-overlay");
    if (overlay) {
      overlay.remove();
    }

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }
}
