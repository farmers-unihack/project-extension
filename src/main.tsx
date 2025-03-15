import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./components/auth/authprovider";
import App from "./app";
import "./index.css"
import {  HashRouter, Route, Routes } from "react-router-dom";
import NoGroup from "./components/group/no-group";
import ViewGroup from "./components/group/view-group";


createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path = "/" element={<App />}/>
                    <Route path = "/no-group" element={<NoGroup/>}/>
                    <Route path = "/view-group" element={<ViewGroup/>}/>
                </Routes>
            </HashRouter>
        </AuthProvider>
    </StrictMode>
);