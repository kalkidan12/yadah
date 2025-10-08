import React, { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/store/api/systemAdminApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import UserForm from "../forms/UserFrom";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    order: "desc",
  });

  const { data, refetch } = useGetUsersQuery({
    page: currentPage,
    limit: 10,
    searchTerm,
    ...filters,
    sortField: sortConfig.field,
    sortOrder: sortConfig.order,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [filters, searchTerm, currentPage, sortConfig]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user.");
    }
  };

  const handleSubmitUser = async (user) => {
    try {
      if (selectedUser) {
        await updateUser({ id: selectedUser._id, ...user }).unwrap();
        toast.success("User updated successfully!");
      } else {
        await addUser(user).unwrap();
        toast.success("User added successfully!");
      }
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed.");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleSort = (field) => {
    const order =
      sortConfig.field === field && sortConfig.order === "asc" ? "desc" : "asc";
    setSortConfig({ field, order });
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return <FaSort />;
    return sortConfig.order === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ role: "" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="w-full p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold shadow-lg text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add User
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />

        <select
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* User Form */}
      {isFormOpen && (
        <UserForm
          initialValues={selectedUser}
          isEdit={!!selectedUser}
          onClose={() => setIsFormOpen(false)}
          handleSubmitUser={handleSubmitUser}
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg border-collapse">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              {["createdAt", "firstName", "lastName", "email", "role"].map(
                (field) => (
                  <th
                    key={field}
                    className="px-4 py-2 text-left text-gray-700 border-r border-gray-300"
                  >
                    <button
                      onClick={() => handleSort(field)}
                      className="flex items-center space-x-1"
                    >
                      <span>
                        {field === "createdAt"
                          ? "Joined Date"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </span>
                      {getSortIcon(field)}
                    </button>
                  </th>
                )
              )}
              <th className="px-4 py-2 text-left text-gray-700 border-r border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                {[
                  new Date(user.createdAt).toLocaleDateString(),
                  user.firstName,
                  user.lastName,
                  user.email,
                  user.role,
                ].map((cell, index) => (
                  <td
                    key={index}
                    className="px-2 py-1 border-r border-gray-300 text-gray-700"
                  >
                    {cell}
                  </td>
                ))}

                <td className="px-2 py-1 flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded w-[70px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded w-[70px]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded text-white ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!data?.hasNextPage}
          className={`px-4 py-2 rounded text-white ${
            !data?.hasNextPage
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
