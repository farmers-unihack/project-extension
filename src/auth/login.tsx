import { useState, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "./authprovider";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const { login } = useAuth(); 

    const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                new URLSearchParams({ username, password }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            if (response.status === 201 && response.data.token) {
                login(username, response.data.token);
                setMessage("Login successful!");
            } else {
                setMessage(response.data.msg || "Login failed");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            setMessage(error.response?.data?.msg || "Server error");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
