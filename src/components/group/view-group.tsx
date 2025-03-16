import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authprovider";
import { formatClockInTime, formatSeconds } from "../../util/formatTime";
import { useState, useRef, useEffect } from "react";
import CollectibleComponents from "./collectible";

function ViewGroup() {
  const { group, groupInfo } = useAuth();
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleGoToTimerStart = () => {
    navigate("/");
  };

  const handleCollectibleClick = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    console.log(groupInfo?.collectibles);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-96 h-[28rem] bg-[#492e16] p-4 flex flex-col items-center justify-between relative">
      <img src="logo.png" className="w-34 mx-auto" alt="Logo" />

      <div className="flex items-center justify-between bg-[#3a2312] px-3 py-1 rounded-md shadow-md text-center w-full">
        <div className="w-14 h-13 rounded-md bg-[#2b1a0c] flex items-center justify-center overflow-hidden">
          <img
            src="collectible_1.png"
            alt="Collectible"
            className="w-10 h-10 object-cover cursor-pointer"
            onClick={handleCollectibleClick}
          />
        </div>

        <div className="text-white text-xs text-center flex-1">
          <p className="font-semibold">{group ? `👤 ${group}` : "None"}</p>
          {groupInfo?.totalTime !== undefined && (
            <p className="mt-1">⏳ {formatSeconds(groupInfo.totalTime!)}</p>
          )}
        </div>
      </div>

      <p className="text-white text-lg text-center">
        Ready to start brewing? Press the coffee
      </p>

      <div className="relative w-36 h-36 cursor-pointer">
        <img
          src="coffecup.png"
          alt="Coffee Cup"
          className="w-full h-full object-cover hover:cursor-pointer"
          onClick={handleGoToTimerStart}
        />
      </div>

      {groupInfo?.activeUsers && groupInfo.activeUsers.length > 0 ? (
        <div className="mt-4 bg-[#3a2312] px-3 py-2 rounded-md shadow-md w-full">
          <p className="text-white text-sm font-semibold">Active Members:</p>
          <ul className="mt-2">
            {groupInfo.activeUsers.map((user, index) => (
              <li key={index} className="text-white text-xs">
                {user.username} - {formatClockInTime(user.clocked_in_at)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-white text-sm">No active members</p>
      )}

      {isMenuVisible && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div
            ref={menuRef}
            className="bg-black/40 p-6 rounded-md shadow-lg w-80 md:w-96"
          >
            <h2 className="text-white text-lg font-semibold mb-4 text-center">
              Your Group's Collectibles
            </h2>
            <CollectibleComponents
              collectibleList={
                groupInfo?.collectibles?.map((collectible) => collectible.id) ||
                []
              }
            />
            <button
              className="mt-4 text-white bg-[#3a2312] px-4 py-2 rounded-md w-full"
              onClick={handleCloseMenu}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewGroup;
