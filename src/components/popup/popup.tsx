import { useAuth } from "../auth/authprovider";
import { formatTime } from "../../util/formatTime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTimerContext } from "../../util/timeprovider";


function Popup() {
  
  const { state, handleStart, handleStop, setTargetTimeMinutes } = useTimerContext();
  const [showWarning, setShowWarning] = useState(false);
  const { user, group, clockIn, fetchGroupData } = useAuth();

  const [clickCount, setClickCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = () => {
      chrome.storage.local.get(["clickCount", "wordCount"], (data) => {
        setClickCount(data.clickCount || 0);
        setWordCount(data.wordCount || 0);
      });
    };

    if (state.running) {
      fetchStats();
      const interval = setInterval(fetchStats, 1000);

      return () => clearInterval(interval);
    }
  }, [state.running]);

  const handleIncrement = () => {
    setTargetTimeMinutes(state.targetTimeMinutes + 5);
  };

  const handleDecrement = () => {
    if (state.targetTimeMinutes > 1) {
      setTargetTimeMinutes(state.targetTimeMinutes - 5);
    }
  };

  const handleStopWithWarning = () => {
    setShowWarning(true);
  };

  const confirmStop = () => {
    handleStop();
    setShowWarning(false);
  };

  const cancelStop = () => {
    setShowWarning(false);
  };

  const handleClockIn = () => {
    handleStart();
    clockIn();
  };

  const handleGroupClick = () => {
    fetchGroupData;
    navigate("/view-group");
  };

  const handleBlocklist = () => {
    navigate("/blocklist");
  };

  return (
    <div className="w-96 h-[28rem] bg-[#492e16] p-4 flex flex-col items-center justify-between relative">
      <img src="logo.png" className="w-34 mx-auto" alt="Logo" />

      <div className="flex space-x-7 w-full">
        <div className="bg-[#3a2312] px-3 py-1 rounded-md shadow-md flex-1">
          <p className="text-white text-xs font-semibold">
            {user ? `👤 ${user}` : "Guest"}
          </p>
        </div>

        <div
          className="bg-[#3a2312] px-3 py-1 rounded-md shadow-md flex-1 hover:cursor-pointer"
          onClick={handleGroupClick}
        >
          <p className="text-white text-xs font-semibold">
            {group ? `👤 ${group}` : "No Group"}
          </p>
        </div>
      </div>

      <div
        className="bg-[#BDB395] px-3 py-1 rounded-md shadow-md hover:cursor-pointer"
        onClick={handleBlocklist}
      >
        <p className="text-white text-xs font-semibold">Blocklist</p>
      </div>

      <p className="text-white text-lg text-center">
        Click the coffee to {state.running ? "stop" : "start"} brewing!
      </p>

      <div className="relative w-36 h-36">
        <img
          src="coffecup.png"
          alt="Coffee Cup"
          className="w-full h-full object-cover hover:cursor-pointer"
          onClick={state.running ? handleStopWithWarning : handleClockIn}
        />
      </div>

      {!state.running && (
        <div className="flex justify-between w-full">
          <button onClick={handleDecrement} className="text-white text-3xl">
            &lt;
          </button>
          <span className="text-white text-lg font-semibold">
            {state.targetTimeMinutes} min
          </span>
          <button onClick={handleIncrement} className="text-white text-3xl">
            &gt;
          </button>
        </div>
      )}

      {state.running && (
        <>
          <p className="text-white text-6xl font-bold">
            {formatTime(state.timer)}
          </p>

          <div className="bg-[#3a2312] p-2 mt-4 w-full rounded-lg text-center text-white">
            <p>
              Mouse Clicks: <span className="font-bold">{clickCount}</span>
            </p>
            <p>
              Words Typed: <span className="font-bold">{wordCount}</span>
            </p>
          </div>
        </>
      )}

      {showWarning && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#492e16] p-6 rounded-lg shadow-lg border border-white">
            <p className="text-white text-lg mb-4">
              Stopping will burn the coffee. Are you sure?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmStop}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
              >
                Yes
              </button>
              <button
                onClick={cancelStop}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Popup;
