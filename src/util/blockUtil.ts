// export function updateOverlay(isBlocking: boolean) {
//   let overlay = document.getElementById("blocking-overlay");
//   if (isBlocking) {
//     if (!overlay) {
//       overlay = document.createElement("div");
//       overlay.id = "blocking-overlay";
//       overlay.style.position = "fixed";
//       overlay.style.top = "0";
//       overlay.style.left = "0";
//       overlay.style.width = "100vw";
//       overlay.style.height = "100vh";
//       overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
//       overlay.style.zIndex = "999999";
//       overlay.style.pointerEvents = "all";

//       let contentDiv = document.createElement("div");
//       contentDiv.style.color = "white";
//       contentDiv.style.fontSize = "24px";
//       contentDiv.style.textAlign = "center";
//       contentDiv.style.position = "absolute";
//       contentDiv.style.top = "50%";
//       contentDiv.style.left = "50%";
//       contentDiv.style.transform = "translate(-50%, -50%)";
//       contentDiv.style.display = "flex";
//       contentDiv.style.flexDirection = "column";
//       contentDiv.style.alignItems = "center";
//       contentDiv.style.justifyContent = "center";

//       let textDiv = document.createElement("div");
//       textDiv.textContent = "Your coffee is still brewing!";
//       contentDiv.appendChild(textDiv);

//       let img = document.createElement("img");
//       img.src = chrome.runtime.getURL("coffecup.png");
//       img.alt = "Coffee Cup";
//       img.style.marginTop = "20px";
//       img.style.width = "100px";
//       img.style.height = "auto";
//       contentDiv.appendChild(img);

//       let giveUpButton = document.createElement("button");
//       giveUpButton.textContent = "Give Up";
//       giveUpButton.style.marginTop = "20px";
//       giveUpButton.style.padding = "10px 20px";
//       giveUpButton.style.fontSize = "18px";
//       giveUpButton.style.backgroundColor = "transparent";
//       giveUpButton.style.color = "white";
//       giveUpButton.style.border = "2px solid gray";
//       giveUpButton.style.cursor = "pointer";

//       giveUpButton.addEventListener("mouseover", () => {
//         giveUpButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
//         giveUpButton.style.borderColor = "white";
//       });

//       giveUpButton.addEventListener("mouseout", () => {
//         giveUpButton.style.backgroundColor = "transparent";
//         giveUpButton.style.borderColor = "gray";
//       });

//       giveUpButton.onclick = async function () {
//         chrome.runtime.sendMessage({ action: "stop" });
//         let overlay = document.getElementById("blocking-overlay");
//         if (overlay) {
//           overlay.remove();
//         }

//         document.documentElement.style.overflow = "";
//         document.body.style.overflow = "";
//         return;
//       };

//       contentDiv.appendChild(giveUpButton);

//       overlay.appendChild(contentDiv);
//       document.body.appendChild(overlay);

//       document.documentElement.style.overflow = "hidden";
//       document.body.style.overflow = "hidden";
//     }
//   } else {
//     //Has to be duplicated as it cannot call functions outside the function
//     let overlay = document.getElementById("blocking-overlay");
//     if (overlay) {
//       overlay.remove();
//     }

//     document.documentElement.style.overflow = "";
//     document.body.style.overflow = "";
//   }
// }

// export async function updateAllTabs(isBlocking: boolean): Promise<void> {
//   try {
//     const { blockedURLs } = await chrome.storage.local.get("blockedURLs");
    
//     const blocklist = blockedURLs || [];

//     const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({});

//     tabs.forEach(async (tab) => {
//       if (tab.url && blocklist.some((blockedUrl: string) => tab.url!.includes(blockedUrl))) {
//         try {
//           if (tab.id !== undefined) {
//             await chrome.scripting.executeScript({
//               target: { tabId: tab.id },
//               func: updateOverlay,
//               args: [isBlocking],
//             });
//           }
//         } catch (err) {
//           console.error("Error updating content script:", err);
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Error querying tabs:", error);
//   }
// }