import { useState, FormEvent } from "react";
import { useAuth } from "./authprovider";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      await login(username, password);
      setMessage("Login successful!");
    } catch (error: any) {
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#492e16] p-4">
      <div className="w-96 h-[28rem] bg-[#492e16] p-4 flex flex-col items-center justify-between relative">
        <img src="logo.png" className="w-34 mx-auto" alt="Logo" />

        <div className="bg-[#3a2312] px-3 py-1 rounded-md shadow-md">
          <p className="text-white text-xs font-semibold">Login</p>
        </div>

        <div className="relative w-36 h-36">
          <img
            src="coffecup.png"
            alt="Coffee Cup"
            className="w-full h-full object-cover"
          />
        </div>

        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col items-center mt-4"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-3/4 p-2 mb-4 rounded-md bg-[#3a2312] text-white border-none shadow-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-3/4 p-2 mb-4 rounded-md bg-[#3a2312] text-white border-none shadow-md"
          />
          <button
            type="submit"
            className="w-3/4 p-2 bg-[#3a2312] text-white font-semibold rounded-md shadow-md hover:bg-[#3a1810]"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-white mt-4 text-lg font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
