import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authprovider";

function ViewGroup() {
  const { group, groupInfo } = useAuth();
  const navigate = useNavigate();

  const handleGoToTimerStart = () => {
    navigate("/"); 
  };

  return (
    <div className="w-96 h-[28rem] bg-[#492e16] p-4 flex flex-col items-center justify-between relative">
      <img src="logo.png" className="w-34 mx-auto" alt="Logo" />

      <div className="bg-[#3a2312] px-3 py-1 rounded-md shadow-md">
        <p className="text-white text-xs font-semibold">
          {group ? `👤 ${group}` : "None"}
        </p>
      </div>

      <p className="text-white text-lg text-center">Ready to start brewing? Press the coffee</p>

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
                {user.username} - {new Date(user.clocked_in_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-white text-sm">No active members</p>
      )}
    </div>
    
  );
}

export default ViewGroup;
