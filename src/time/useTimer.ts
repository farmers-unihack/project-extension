import { useEffect, useState } from "react";

interface TimerState {
  startTime: number | null;
  endTime: number | null;
  running: boolean;
  targetTimeMinutes: number;
  timer: number;
}

interface Tab {
  id?: number;
  url?: string;
}

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    startTime: null,
    endTime: null,
    running: false,
    targetTimeMinutes: 0,
    timer: 0,
  });

  useEffect(() => {
    chrome.storage.local.get(
      ["startTime", "endTime", "running", "targetTimeMinutes"],
      (data) => {
        setState((prevState) => ({
          ...prevState,
          startTime: data.startTime || null,
          endTime: data.endTime || null,
          running: data.running || false,
          targetTimeMinutes: data.targetTimeMinutes || 0,
        }));
      }
    );

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local") {
        if (changes.startTime) {
          setState((prevState) => ({
            ...prevState,
            startTime: changes.startTime.newValue || 0,
          }));
        }
        if (changes.endTime) {
          setState((prevState) => ({
            ...prevState,
            endTime: changes.endTime.newValue || 0,
          }));
        }
        if (changes.running) {
          setState((prevState) => ({
            ...prevState,
            running: changes.running.newValue || false,
          }));
        }
        if (changes.targetTimeMinutes) {
          setState((prevState) => ({
            ...prevState,
            targetTimeMinutes: changes.targetTimeMinutes.newValue || 0,
          }));
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (state.running && state.startTime !== null && state.endTime !== null) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (state.endTime && state.endTime <= now) {
          handleStop();
          clearInterval(interval);
          return;
        }

        setState((prevState) => ({
          ...prevState,
          timer: state.endTime ? state.endTime - now : 0,
        }));
      }, 5);

      return () => clearInterval(interval);
    }
  }, [state.running, state.startTime, state.endTime]);

  const handleStart = () => {
    if (state.targetTimeMinutes > 0) {
      const now = Date.now();
      const targetEndTime = now + state.targetTimeMinutes * 60 * 1000;

      setState({
        startTime: now,
        endTime: targetEndTime,
        running: true,
        targetTimeMinutes: state.targetTimeMinutes,
        timer: state.targetTimeMinutes,
      });

      chrome.runtime.sendMessage({
        action: "start",
        startTime: now,
        endTime: targetEndTime,
        running: true,
      });
      updateAllTabs(true);
    }
  };

  const handleStop = () => {
    chrome.runtime.sendMessage({ action: "stop" });

    setState({
      startTime: null,
      endTime: null,
      running: false,
      targetTimeMinutes: 0,
      timer: 0,
    });

    updateAllTabs(false);
  };

  const handleReset = () => {
    if (state.targetTimeMinutes > 0) {
      const now = Date.now();
      const targetEndTime = now + state.targetTimeMinutes * 60 * 1000;

      setState({
        startTime: now,
        endTime: targetEndTime,
        running: true,
        targetTimeMinutes: state.targetTimeMinutes,
        timer: state.targetTimeMinutes,
      });

      chrome.runtime.sendMessage({
        action: "start",
        startTime: now,
        endTime: targetEndTime,
      });
    }
  };

  async function updateAllTabs(isBlocking: boolean): Promise<void> {
    try {
      const tabs: Tab[] = await chrome.tabs.query({});

      tabs.forEach(async (tab) => {
        if (tab.url && tab.url.includes("youtube.com")) {
          try {
            if (tab.id !== undefined) {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: updateOverlay,
                args: [isBlocking],
              });
            }
          } catch (err) {
            console.error("Error updating content script:", err);
          }
        }
      });
    } catch (error) {
      console.error("Error querying tabs:", error);
    }
  }

  function updateOverlay(isBlocking: boolean) {
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
  const setTargetTimeMinutes = (minutes: number) => {
    setState((prevState) => ({
      ...prevState,
      targetTimeMinutes: minutes,
      timer: minutes,
    }));
  };

  return {
    state,
    handleStart,
    handleStop,
    handleReset,
    setTargetTimeMinutes,
  };
};
