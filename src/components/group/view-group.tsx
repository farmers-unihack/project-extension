import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authprovider";
import { formatClockInTime, formatSeconds } from "../../util/formatTime";
import { useState, useRef, useEffect } from "react";

function ViewGroup() {
  const { group, groupInfo } = useAuth();
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);
  const collectibleRef = useRef<HTMLImageElement | null>(null);

  const handleGoToTimerStart = () => {
    navigate("/");
  };

  const handleCollectibleClick = () => {
    if (collectibleRef.current) {
      const rect = collectibleRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width / 2,
      });
    }
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
            ref={collectibleRef}
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
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            ref={menuRef}
            className="bg-black/40 p-6 rounded-md shadow-lg w-68 menu-animating"
            style={{
              transformOrigin: 'center',
              animation: 'slideIn 0.4s ease-out forwards',
            }}
          >
            <h2 className="text-white text-lg font-semibold mb-4">Your Group's Collectibles</h2>
            <ul className="text-white text-sm">
              {groupInfo?.collectibles && groupInfo.collectibles.length > 0 ? (
                groupInfo.collectibles.map((collectible, index) => (
                  <li key={index} className="mb-2">
                    {collectible.name} - {collectible.description}
                  </li>
                ))
              ) : (
                <li>No collectibles available</li>
              )}
            </ul>
            <button
              className="mt-4 text-white bg-[#3a2312] px-4 py-2 rounded-md"
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
