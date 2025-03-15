import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Blocklist: React.FC = () => {
  const [blockedURLs, setBlockedURLs] = useState<string[]>([]);
  const [newURL, setNewURL] = useState<string>("");
  const navigate = useNavigate();


  useEffect(() => {
    chrome.storage.local.get("blockedURLs", ({ blockedURLs }) => {
      setBlockedURLs(blockedURLs || []);
    });
  }, []);

  const addURLToBlocklist = () => {
    if (newURL && !blockedURLs.includes(newURL)) {
      const updatedBlockedURLs = [...blockedURLs, newURL];
      setBlockedURLs(updatedBlockedURLs);
      chrome.storage.local.set({ blockedURLs: updatedBlockedURLs });
      setNewURL("");
    }
  };

  const removeURLFromBlocklist = (url: string) => {
    const updatedBlockedURLs = blockedURLs.filter(
      (blockedURL) => blockedURL !== url
    );
    setBlockedURLs(updatedBlockedURLs);
    chrome.storage.local.set({ blockedURLs: updatedBlockedURLs });
  };


  const handleGoToTimerStart = () => {
    navigate("/"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#492e16] p-4">
      <div className="w-96 h-[28rem] bg-[#492e16] p-4 flex flex-col items-center justify-between relative">
        <img src="logo.png" className="w-34 mx-auto" alt="Logo" />
        <div className="bg-[#3a2312] px-3 py-1 rounded-md shadow-md mb-4">
          <p className="text-white text-xs font-semibold">Blocklist</p>
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

        <div className="flex items-center mb-4">
          <input
            type="text"
            className="p-2 rounded-md bg-[#3a2312] text-white mr-2"
            placeholder="Enter URL to block"
            value={newURL}
            onChange={(e) => setNewURL(e.target.value)}
          />
          <button
            onClick={addURLToBlocklist}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Add
          </button>
        </div>

        <div className="w-full overflow-auto max-h-[12rem]">
          <ul className="space-y-2">
            {blockedURLs.map((url, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-[#3a2312] px-3 py-1 rounded-md"
              >
                <span className="text-white">{url}</span>
                <button
                  onClick={() => removeURLFromBlocklist(url)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blocklist;
