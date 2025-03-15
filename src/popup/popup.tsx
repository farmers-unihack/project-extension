import { formatTime } from "../time/formatTime";
import { useTimer } from "../time/useTimer";
import { useState } from "react";

function Popup() {
  const { state, handleStart, handleStop, setTargetTimeMinutes } = useTimer();
  const [showWarning, setShowWarning] = useState(false);

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

  return (
    <div className="w-80 h-96 bg-[#492e16] p-4 flex flex-col items-center justify-between relative">
      <img src="logo.png" className="mb-4 w-30 mx-auto" alt="Logo" />
      <p className="text-white text-lg text-center">
        Click the coffee to {state.running ? "stop" : "start"} brewing!
      </p>

      <div className="relative w-46 h-48">
        <img
          src="coffecup.png"
          alt="Coffee Cup"
          className="w-full h-full object-cover"
          onClick={state.running ? handleStopWithWarning : handleStart}
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
        <p className="text-white text-6xl font-bold">
          {formatTime(state.timer)}
        </p>
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
