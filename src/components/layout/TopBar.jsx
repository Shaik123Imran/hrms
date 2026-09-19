import { useState } from 'react';
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export default function TopBar({
  title = 'Dashboard',
  onMenuClick,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const { user, logout } = useAuth();

  const userName = user?.name || user?.firstName || 'User';
  const userRole = user?.role || 'Employee';

  const initial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    setShowMenu(false);
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition md:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-800">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        <div className="hidden md:block h-8 w-px bg-slate-200" />

        <div className="relative">

          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 md:gap-3 p-1.5 rounded-lg hover:bg-slate-100 transition"
            aria-expanded={showMenu}
          >

            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
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
              className={`hidden md:block text-slate-500 transition-transform ${
                showMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">

              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setShowMenu(false)}
              >
                <User size={17} />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setShowMenu(false)}
              >
                <Settings size={17} />
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}