import { useEffect, useState } from "react";

interface TimerState {
  startTime: number | null;
  endTime: number | null;
  running: boolean;
  targetTimeMinutes: number;
  timer: number;
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

  const handleStart = async () => {
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
