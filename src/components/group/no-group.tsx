import { useAuth } from "../auth/authprovider";

function NoGroup() {
  const { user } = useAuth();

  const joinGroup = () => {
    chrome.tabs.create({ url: "https://dejabrew.live/prompt" }); 
  };

  return (
    <div className="w-96 h-[28rem] bg-[#492e16] p-4 flex flex-col items-center justify-between relative">
      <img src="logo.png" className="w-34 mx-auto" alt="Logo" />

      <div className="bg-[#3a2312] px-3 py-1 rounded-md shadow-md">
        <p className="text-white text-xs font-semibold">
          {user ? `👤 ${user}` : "Guest"}
        </p>
      </div>

      <p className="text-white text-lg text-center">Ready to start brewing?</p>

      <div className="relative w-36 h-36">
        <img
          src="coffecup.png"
          alt="Coffee Cup"
          className="w-full h-full object-cover"
        />
      </div>

      <button
        onClick={joinGroup}
        className="px-4 py-2 bg-[#FFDCD3] hover:bg-[#e6c6be] text-white font-bold rounded"
      >
        Join a Group
      </button>
    </div>
  );
}

export default NoGroup;
