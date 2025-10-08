import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import Dashboard from "@/components/admin/Dashboard";
import Members from "@/components/admin/Members";
import Users from "@/components/admin/Users";
import MyAccount from "@/components/admin/MyAccount";
import { useGetUserRoleQuery } from "@/store/api/authApiSlice";

const AdminPage = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  // Fetch current user's role via RTK Query
  const { data, error, isLoading } = useGetUserRoleQuery();

  useEffect(() => {
    if (!isLoading) {
      if (
        !data?.role ||
        error ||
        !["admin", "system-admin"].includes(data.role)
      ) {
        // Unauthorized access redirects to login
        router.replace("/portal/auth/login");
      } else {
        setUserRole(data.role);

        // Set default page based on role if first load
        if (data.role === "system-admin" && selectedPage === "Dashboard") {
          setSelectedPage("Dashboard");
        }
      }
    }
  }, [data, error, isLoading, router]);

  // Show loading spinner while fetching role
  if (isLoading || !userRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const renderContent = () => {
    if (userRole === "admin") {
      switch (selectedPage) {
        case "Dashboard":
          return <Dashboard />;
        case "Members":
          return <Members />;
        case "My Account":
          return <MyAccount />;
        default:
          return <Dashboard />;
      }
    }

    if (userRole === "system-admin") {
      switch (selectedPage) {
        case "Dashboard":
          return <Dashboard />;
        case "Members":
          return <Members />;
        case "Users":
          return <Users />;
        case "My Account":
          return <MyAccount />;
        default:
          return <Dashboard />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Top Navbar */}
      <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          setSelectedPage={setSelectedPage}
          sidebarOpen={sidebarOpen}
          userRole={userRole}
        />

        {/* Main Content */}
        <main
          className={`transition-all duration-300 mt-[60px] p-6 w-full overflow-y-auto
          ${sidebarOpen ? "ml-[110px] md:ml-[190px]" : "ml-[60px]"}`}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
