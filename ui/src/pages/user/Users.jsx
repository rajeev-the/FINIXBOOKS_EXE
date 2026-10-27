import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Save, Edit2, Lock, LogOut, User } from "lucide-react";
import { logout } from "../../store/slices/authSlice";

export default function Users() {
  const stateUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const profile = stateUser?.user || stateUser;
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!profile) return null;

  return (
    <div className="w-full h-full text-slate-900 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-1">
      {/* Header Block */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-5 rounded-xl border border-slate-200/80 shadow-xs shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            My Account
          </h1>
          <p className="text-xs text-slate-500">
            View and manage your user credentials and system authorization
          </p>
        </div>
        <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center text-base font-bold uppercase tracking-wider shrink-0 shadow-xs">
          {profile?.firstName?.charAt(0) || profile?.email?.charAt(0) || "U"}
        </div>
      </div>

      <div className="flex flex-col max-w-lg mx-auto w-full gap-4 mt-1">
        {/* Profile Information Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Profile Details
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200/80 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={profile.firstName || ""}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-slate-800 font-medium"
                />
              ) : (
                <span className="text-xs font-semibold text-slate-800">
                  {profile.firstName || "-"}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={profile.lastName || ""}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-slate-800 font-medium"
                />
              ) : (
                <span className="text-xs font-semibold text-slate-800">
                  {profile.lastName || "-"}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  {profile.email}
                  {isEditing && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                </span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  Primary Account
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={profile.phone || ""}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-slate-800 font-medium"
                />
              ) : (
                <span className="text-xs font-semibold text-slate-800">
                  {profile.phone || "-"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100/80 text-red-600 font-semibold py-2 px-5 rounded-lg border border-red-200/80 transition-all shadow-xs active:scale-98 text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
