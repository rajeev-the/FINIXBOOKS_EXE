import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout";
import TitleBar from "./components/TitleBar";
import StatusBar from "./components/common/StatusBar";
import Companies from "./pages/companies/Companies";
import Tenants from "./pages/tenant/Tenants";
import Users from "./pages/user/Users";
import Settings from "./pages/settings/Settings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Sync from "./pages/sync/Sync";
import Tutorial from "./pages/tutorial/Tutorial";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between">
      <TitleBar />
      <div className="flex-grow overflow-hidden relative">
        <HashRouter>
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/companies" replace />} />
                <Route path="companies" element={<Companies />} />
                <Route path="organization" element={<Tenants />} />
                <Route path="user" element={<Users />} />
                <Route path="tutorial" element={<Tutorial />} />
                <Route path="settings" element={<Settings />} />
                <Route path="sync" element={<Sync />} />
                <Route path="*" element={<Navigate to="/companies" replace />} />
              </Route>
            )}
          </Routes>
        </HashRouter>
      </div>
      <StatusBar />
    </div>
  );
}

export default App;
