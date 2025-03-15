import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./components/auth/authprovider";
import App from "./app";
import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import NoGroup from "./components/group/no-group";
import ViewGroup from "./components/group/view-group";
import Blocklist from "./components/blocklist";
import { TimeProvider } from "./util/timeprovider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <TimeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/no-group" element={<NoGroup />} />
            <Route path="/view-group" element={<ViewGroup />} />
            <Route path="/blocklist" element={<Blocklist />} />
          </Routes>
        </HashRouter>
      </TimeProvider>
    </AuthProvider>
  </StrictMode>
);
