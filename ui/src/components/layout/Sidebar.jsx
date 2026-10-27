import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Building2,
  Users,
  Building,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";
import logoImg from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";

const navItems = [
  {
    name: "Companies",
    path: "/companies",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    name: "Tenants",
    path: "/organization",
    icon: <Building className="w-4 h-4" />,
  },
  {
    name: "My Account",
    path: "/user",
    icon: <Users className="w-4 h-4" />,
  },
  {
    name: "Tutorial",
    path: "/tutorial",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

export const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = user?.user || user || {};

  useEffect(() => {
    if (!user && localStorage.getItem("tb_access_token")) {
      authService
        .getProfile()
        .then((res) => {
          const data = res.data;
          if (data.success || data.data) {
            dispatch(loginSuccess(data.data || data));
          } else {
            dispatch(logout());
          }
        })
        .catch(() => dispatch(logout()));
    }
  }, [user, dispatch]);

  return (
    <aside className="w-60 bg-white/75 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between p-3.5 shadow-sm relative z-20 shrink-0 select-none">
      <div className="flex flex-col gap-5">
        {/* Header / Logo (Draggable Region) */}
        <div className="flex items-center justify-between px-2 pt-6 pb-2 [-webkit-app-region:drag]">
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="FinixBooks"
              className="w-8 h-8 rounded-lg object-contain shadow-xs"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 leading-none">
                FinixBooks
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                Desktop Edition
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 [-webkit-app-region:no-drag]">
          <span className="px-2.5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </span>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative group ` +
                (isActive
                  ? "text-indigo-600 bg-indigo-50/80 border border-indigo-200/50 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent")
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition-colors ${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile Summary */}
      <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between px-2 [-webkit-app-region:no-drag]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300/60 shrink-0 uppercase">
            {profile?.firstName?.charAt(0) || profile?.email?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-slate-800 truncate">
              {profile?.firstName
                ? `${profile.firstName} ${profile.lastName || ""}`
                : profile?.email || "User"}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              {profile?.email || "Connected"}
            </span>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
