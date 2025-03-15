import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
    user: string | null;
    login: (username: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem("username"));

    const login = (username: string, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setUser(username);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};