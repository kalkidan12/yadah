import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { useLogoutMutation } from "@/store/api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useRouter } from "next/router";

const AdminNavbar = ({ toggleSidebar }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    if (!user?._id && !user?.id) {
      console.warn("No user ID found in store; skipping backend logout.");
      dispatch(logoutAction());
      router.replace("/portal/auth/login");
      return;
    }

    setIsLoggingOut(true);
    try {
      // Hit backend API via RTK Query
      await logout(user._id || user.id).unwrap();

      // Clear Redux + localStorage
      dispatch(logoutAction());
      localStorage.removeItem("selectedOption");

      // Hard replace to clear navigation history
      window.location.replace("/portal/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-br from-gray-700 via-amber-800 to-orange-700  text-white p-2 z-50 h-[60px] flex justify-between items-center shadow-md">
      {/* Sidebar Toggle Button */}
      <div className="flex items-center space-x-7">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl md:text-3xl focus:outline-none"
        >
          <FaBars />
        </button>

        {/* Text Logo (visible md and above) */}
        <span
          className="hidden md:inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-400 
             text-lg md:text-xl lg:text-2xl font-extrabold tracking-wider select-none 
             transition-transform transform hover:scale-105 hover:drop-shadow-lg"
        >
          YADAH WORSHIP MINISTRY PORTAL
        </span>
      </div>

      {/* Right Section */}
      <div className="border border-blue-400 px-3 py-1 rounded-md flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:text-gray-200 transition disabled:opacity-60"
          disabled={isLoggingOut || isLoading}
        >
          <AiOutlineLogout className="transform -rotate-90" />
          <span>{isLoggingOut || isLoading ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
