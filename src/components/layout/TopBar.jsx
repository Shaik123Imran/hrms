import { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function TopBar({ title = "Dashboard", onMenuClick }) {
  const [showMenu, setShowMenu] = useState(false);

  const { user, logout } = useAuth();

  const userName = user?.name || user?.firstName || "User";
  const userRole = user?.role || "Employee";
  const initial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    setShowMenu(false);
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
      
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100">
          <Menu size={20} />
        </button>

        <h1 className="text-lg md:text-xl font-semibold text-slate-800">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">

        <button className="relative p-2 rounded-lg hover:bg-slate-100">
          <Bell size={20} className="text-slate-600" />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100">

            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
              {initial}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-800">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                {userRole}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden md:block text-slate-500"/>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1">

              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                onClick={() => setShowMenu(false)}>

                My Profile
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                onClick={() => setShowMenu(false)}>
                Settings
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}

        </div>
      </div>
    </header>
  );
}