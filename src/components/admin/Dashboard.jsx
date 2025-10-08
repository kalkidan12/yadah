import React from "react";
import { useGetDashboardMetricsQuery } from "@/store/api/adminApiSlice";
import {
  FaUsers,
  FaMale,
  FaFemale,
  FaUserPlus,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE", "#AA336A"];

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();

  if (isLoading) return <p>Loading dashboard metrics...</p>;
  if (isError) return <p>Failed to load dashboard metrics.</p>;

  // --- Metrics cards ---
  const metrics = [
    {
      label: "Total Members",
      value: data.totalUsers,
      icon: <FaUsers size={28} className="text-white" />,
      bg: "bg-amber-500",
    },
    {
      label: "Male Members",
      value: data.maleUsers,
      icon: <FaMale size={28} className="text-white" />,
      bg: "bg-blue-500",
    },
    {
      label: "Female Members",
      value: data.femaleUsers,
      icon: <FaFemale size={28} className="text-white" />,
      bg: "bg-pink-500",
    },
    {
      label: "New Members This Month",
      value: data.newUsersThisMonth,
      icon: <FaUserPlus size={28} className="text-white" />,
      bg: "bg-orange-500",
    },
  ];

  // --- Add system-admin metrics if authStats exists ---
  if (data.authStats) {
    metrics.push(
      {
        label: "Total Authenticated Users",
        value: data.authStats.totalAuthUsers,
        icon: <FaUsers size={28} className="text-white" />,
        bg: "bg-purple-500",
      },
      {
        label: "Total Admins",
        value: data.authStats.totalAdmins,
        icon: <FaUserTie size={28} className="text-white" />,
        bg: "bg-green-500",
      },
      {
        label: "Total System Admins",
        value: data.authStats.totalSystemAdmins,
        icon: <FaUserShield size={28} className="text-white" />,
        bg: "bg-red-500",
      }
    );
  }

  // --- Format numeric tooltip values as whole numbers ---
  const formatNumber = (value) => Math.round(value);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* --- Metrics Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg ${metric.bg}`}
          >
            <div className="mb-3">{metric.icon}</div>
            <p className="text-white text-xl font-semibold">{metric.value}</p>
            <p className="text-white text-sm mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- Occupation Distribution --- */}
        <div className="bg-white p-2 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Occupation Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.occupationCounts}>
              <XAxis dataKey="occupation" />
              <YAxis allowDecimals={false} domain={[0, "dataMax + 1"]} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* --- Marital Status Distribution --- */}
        <div className="bg-white p-2 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">
            Marital Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.maritalDistribution}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${formatNumber(value)}`}
              >
                {data.maritalDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* --- Batch Distribution --- */}
        <div className="bg-white p-2 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Batch Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.batchCounts}>
              <XAxis dataKey="batch" />
              <YAxis allowDecimals={false} domain={[0, "dataMax + 1"]} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* --- Roles in Yadah Ministry --- */}
        <div className="bg-white p-2 md:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Roles in Yadah Ministry</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.rolesInYadahMinistry}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${formatNumber(value)}`}
              >
                {data.rolesInYadahMinistry.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
