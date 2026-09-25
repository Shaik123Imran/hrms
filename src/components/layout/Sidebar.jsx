import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserRound,
  UserPlus,
  UserPen,
  FileText,
  Clock3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  HR: "hr",
  MANAGER: "manager",
};

const SIDEBAR_MENU = [

  // Dashboard
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    type: "single",

    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
          ROLES.MANAGER,
          ROLES.EMPLOYEE,
        ],
      },
    ],
  },


  // Employee
  {
    title: "Employee",
    icon: Users,
    type: "group",

    items: [

      {
        label: "Add Employee",
        path: "/employee/add",
        icon: UserPlus,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
        ],
      },

      {
        label: "Edit Employee",
        path: "/employee/edit",
        icon: UserPen,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
        ],
      },

      {
        label: "Employee Form",
        path: "/employee/form",
        icon: UserRound,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
        ],
      },

      {
        label: "Employee List",
        path: "/employee/list",
        icon: Users,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
          ROLES.MANAGER,
        ],
      },

      {
        label: "Employee Profile",
        path: "/employee/profile",
        icon: UserRound,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
          ROLES.MANAGER,
          ROLES.EMPLOYEE,
        ],
      },

    ],
  },


  // Attendance
  {
    title: "Attendance",
    icon: Clock3,
    type: "group",

    items: [

      {
        label: "Attendance",
        path: "/attendance",
        icon: Clock3,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
          ROLES.MANAGER,
          ROLES.EMPLOYEE,
        ],
      },

    ],
  },


  // Leave Management
  {
    title: "Leave Management",
    icon: CalendarDays,
    type: "group",

    items: [

      {
        label: "Leave Requests",
        path: "/leave/requests",
        icon: FileText,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
          ROLES.MANAGER,
        ],
      },

      {
        label: "Apply Leave",
        path: "/leave/apply",
        icon: CalendarDays,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
          ROLES.MANAGER,
          ROLES.EMPLOYEE,
        ],
      },

      {
        label: "Approved",
        path: "/leave/approved",
        icon: FileText,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
          ROLES.MANAGER,
        ],
      },

      {
        label: "Rejected",
        path: "/leave/rejected",
        icon: FileText,
        roles: [
          ROLES.ADMIN,
          ROLES.HR,
          ROLES.MANAGER,
        ],
      },

    ],
  },

];

function Sidebar() {

  const { user } = useAuth();
  const userRole =
    user?.role?.toLowerCase() || ROLES.EMPLOYEE;

  const [openMenus, setOpenMenus] = useState({
    Employee: false,
    Attendance: false,
    "Leave Management": false,
  });

  const hasAccess = (roles) => {
    return roles.includes(userRole);
  };

  const visibleMenu = SIDEBAR_MENU
    .map((section) => {

      const visibleItems = section.items.filter(
        (item) => hasAccess(item.roles)
      );

      if (visibleItems.length === 0) {
        return null;
      }

      return {
        ...section,
        items: visibleItems,
      };

    })
    .filter(Boolean);

  const toggleMenu = (title) => {

    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));

  };


  return (

    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-[280px]
        flex-col
        border-r
        border-gray-200
        bg-white
      "
    >

      <div
        className="
          flex
          h-20
          shrink-0
          items-center
          border-b
          border-gray-200
          px-5
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-indigo-600
              text-lg
              font-bold
              text-white
            "
          >
            R
          </div>

          <div>

            <h1
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              Relyntis HRMS
            </h1>

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Human Resource Management
            </p>

          </div>

        </div>

      </div>

      <div
        className="
          border-b
          border-gray-100
          px-4
          py-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            bg-gray-50
            px-3
            py-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-indigo-100
              font-semibold
              text-indigo-600
            "
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>


          <div className="min-w-0">

            <p
              className="
                truncate
                text-sm
                font-semibold
                text-gray-800
              "
            >
              {user?.name || "Current User"}
            </p>

            <p
              className="
                text-xs
                capitalize
                text-gray-500
              "
            >
              {userRole}
            </p>

          </div>

        </div>

      </div>

      <nav
        className="
          flex-1
          overflow-y-auto
          px-3
          py-4
        "
      >

        <div className="space-y-1">

          {visibleMenu.map((section) => {

            const Icon = section.icon;

            if (section.type === "single") {

              const item = section.items[0];

              return (

                <NavLink
                  key={section.title}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition

                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                    `
                  }
                >

                  <Icon
                    size={19}
                    strokeWidth={1.8}
                  />

                  <span>
                    {item.label}
                  </span>

                </NavLink>

              );
            }

            const isOpen =
              openMenus[section.title];


            return (

              <div key={section.title}>

                <button
                  type="button"
                  onClick={() =>
                    toggleMenu(section.title)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-50
                    hover:text-gray-900
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <Icon
                      size={19}
                      strokeWidth={1.8}
                    />

                    <span>
                      {section.title}
                    </span>

                  </div>

                  {isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}

                </button>

                {isOpen && (

                  <div
                    className="
                      ml-4
                      mt-1
                      space-y-0.5
                      border-l
                      border-gray-200
                      pl-3
                    "
                  >

                    {section.items.map((item) => {

                      const ItemIcon = item.icon;

                      return (

                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            px-3
                            py-2.5
                            text-sm
                            transition

                            ${
                              isActive
                                ? "bg-indigo-50 font-medium text-indigo-600"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }
                            `
                          }
                        >

                          {ItemIcon && (
                            <ItemIcon
                              size={16}
                              strokeWidth={1.7}
                            />
                          )}

                          <span>
                            {item.label}
                          </span>

                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;