import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";



interface GroupInfo {
  activeUsers: Array<{ username: string; clocked_in_at: string }> | null;
  totalTime: number | null;
  collectibles: Array<{id: string}> | null;
}

interface AuthContextType {
  user: string | null;
  group: string | null;
  login: (username: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  clockIn: () => Promise<void>;
  clockOut: (valid: boolean) => Promise<void>;
  fetchGroupData: () => Promise<void>;
  groupInfo: GroupInfo | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
  baseURL: "https://api.dejabrew.live/api",
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (token && token.trim() !== "") {
      config.headers["x-access-token"] = `${token}`;
    }

    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [group, setGroup] = useState<string | null>(null);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);

  useEffect(() => {
    fetchUserGroupStatus();
  }, [user]);

  useEffect(() => {
    if(group){
      fetchGroupData();
    }
  }, [group]);

  const fetchUserGroupStatus = async () => {
    try {
      const response = await api.get("/user/me");
      if (response.status === 200) {
        const data = response.data;

        if (data.in_group) {
          setGroup(data.group_name);
        } else {
          setGroup(null);
        }

        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching user group status:", error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password });

      if (response.status === 201 && response.data.token) {

        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);

        setUser(username);
        fetchUserGroupStatus();
      }
    } catch (error: any) {
      console.error("Login error: ", error);
    }
  };


  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  const clockIn = async () => {
    try {
      const response = await api.post("/user/clockin");
      console.log(response);
      if (response.status === 200) {
        console.log(response.data.msg);
        return response.data.msg;
      }
    } catch(error: any) {
      console.error("Error during clock-in:", error);
  // Log full error object
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
  } else if (error.request) {
    // If the error doesn't have a response, check the request
    console.error("Request data:", error.request);
  } else {
    // If it's an error not related to the API request
    console.error("General Error:", error.message);
  }

  return error.response?.data?.msg || "Error during clock-in, please try again later.";
    }
  }

  const clockOut = async (valid: boolean) => {
    try {
      let metrics = await chrome.storage.local.get();
      const clickCount = metrics.clickCount
      const wordCount = metrics.wordCount

      const response = await api.post("/user/clockout", {clickCount, wordCount, valid});
      if (response.status === 200) {
        return response.data.msg;
      }
    } catch(error: any) {
      console.error("Error during clock-out:", error);
      if (error.response) {
        console.error(error.response.data);
        return error.response.data.msg; 
      }
      return "Error during clock-out, please try again later.";
    }
  }

  const fetchGroupData = async () => {
    try {
      const response = await api.get("/group/poll");
  
      if (response.status === 200) {
        const data = response.data;
  
        setGroupInfo({
          activeUsers: data.active_users,
          totalTime: data.total_time_seconds,
          collectibles: data.collectibles,
        });
      }
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, group, login, logout, clockIn, clockOut, groupInfo, fetchGroupData}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export { api };
