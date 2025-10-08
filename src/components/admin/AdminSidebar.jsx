import React, { useState, useEffect } from "react";
import { FaThLarge, FaUsers, FaCog } from "react-icons/fa";
import { MdGroups } from "react-icons/md";

const AdminSidebar = ({ setSelectedPage, sidebarOpen, userRole }) => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");

  // Load last selected option from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOption = localStorage.getItem("selectedOption");
      if (storedOption) {
        setSelectedOption(storedOption);
      }
    }
  }, []);

  // Update selected page + persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedOption", selectedOption);
    }
    setSelectedPage(selectedOption);
  }, [selectedOption, setSelectedPage]);

  // Menu definitions per role
  const adminMenuItems = [
    { name: "Dashboard", icon: <FaThLarge /> },
    { name: "Members", icon: <MdGroups /> },
    { name: "My Account", icon: <FaCog /> },
  ];

  const systemAdminMenuItems = [
    { name: "Dashboard", icon: <FaThLarge /> },
    { name: "Members", icon: <MdGroups /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "My Account", icon: <FaCog /> },
  ];

  // Choose menu based on role
  let menuItems = [];
  if (userRole === "admin") {
    menuItems = adminMenuItems;
  } else if (userRole === "system-admin") {
    menuItems = systemAdminMenuItems;
  } else {
    // If role is user or unknown, return null (no access)
    return null;
  }

  const handleMenuClick = (name) => {
    setSelectedOption(name);
  };

  return (
    <aside
      className={`fixed top-[60px] left-0 h-screen bg-gradient-to-br from-gray-700 via-amber-800 to-orange-700 text-white overflow-y-auto transition-all duration-300 shadow-lg
      ${sidebarOpen ? "md:w-[190px] w-[160px]" : "w-16"}`}
    >
      <ul className="flex flex-col items-center md:items-start mt-3">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`cursor-pointer p-2 md:w-full w-full flex items-center justify-start rounded-md mb-2 transition-colors duration-200
    ${
      selectedOption === item.name
        ? "bg-amber-600 text-gray-900 font-semibold shadow-inner"
        : "hover:bg-amber-700 hover:text-white"
    }`}
            onClick={() => handleMenuClick(item.name)}
          >
            <span className="text-lg">{item.icon}</span>
            {sidebarOpen && (
              <span className="ml-3 text-sm font-medium">{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
