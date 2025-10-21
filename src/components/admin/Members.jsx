import React, { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUniqueFiltersQuery,
} from "@/store/api/adminApiSlice";
import ViewUserDetails from "./ViewUserDetails";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MemberForm from "../forms/MemberForm";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const Members = () => {
  const [viewUser, setViewUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    maritalStatus: "",
    occupation: "",
    skills: "",
    localChurchName: "",
    roleInLocalChurch: "",
    roleInYadahMinistry: "",
    educationalBackground: "",
    batchInYadahMinistry: "",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    order: "desc",
  });

  const { data: filterData } = useGetUniqueFiltersQuery();

  const { data, refetch, isLoading, isError, error } = useGetUsersQuery({
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

  // Refetch whenever filters, searchTerm, currentPage, or sortConfig changes
  useEffect(() => {
    refetch();
  }, [filters, searchTerm, currentPage, sortConfig]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("Member deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete member.");
    }
  };

  const handleSubmitMember = async (member) => {
    try {
      if (selectedMember) {
        await updateUser({ id: selectedMember._id, ...member }).unwrap();
        toast.success("Member updated successfully!");
      } else {
        await addUser(member).unwrap();
        toast.success("Member added successfully!");
      }
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed.");
    }
  };

  // Handler to open modal
  const handleViewUser = (member) => {
    setViewUser(member);
    setIsViewOpen(true);
  };

  // Handler to close modal
  const handleCloseView = () => {
    setViewUser(null);
    setIsViewOpen(false);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedMember(null);
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
    setCurrentPage(1); // Reset page when filters change
  };

  const resetFilters = () => {
    setFilters({
      gender: "",
      maritalStatus: "",
      occupation: "",
      skills: "",
      localChurchName: "",
      roleInLocalChurch: "",
      roleInYadahMinistry: "",
      educationalBackground: "",
      batchInYadahMinistry: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="w-full p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Members</h1>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold shadow-lg text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add Member
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filter Section (Collapsible) */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden">
        <button
          onClick={() => setFiltersVisible((prev) => !prev)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-lg hover:opacity-90 transition"
        >
          <span>Filter & Search</span>
          <span className="text-xl transform transition-transform duration-300">
            {filtersVisible ? "▲" : "▼"}
          </span>
        </button>

        {/* Filter body (collapsible) */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            filtersVisible
              ? "max-h-[1000px] opacity-100 p-4"
              : "max-h-0 opacity-0 p-0"
          } overflow-hidden`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />

            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              value={filters.maritalStatus}
              onChange={(e) =>
                handleFilterChange("maritalStatus", e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>

            <select
              value={filters.occupation}
              onChange={(e) => handleFilterChange("occupation", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Occupations</option>
              {filterData?.occupations?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <select
              value={filters.skills}
              onChange={(e) => handleFilterChange("skills", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Skills</option>
              {filterData?.skills?.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filters.localChurchName}
              onChange={(e) =>
                handleFilterChange("localChurchName", e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Churches</option>
              {filterData?.localChurches?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filters.roleInLocalChurch}
              onChange={(e) =>
                handleFilterChange("roleInLocalChurch", e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Roles (Church)</option>
              {filterData?.rolesInLocalChurch?.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={filters.roleInYadahMinistry}
              onChange={(e) =>
                handleFilterChange("roleInYadahMinistry", e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Roles (Yadah)</option>
              {filterData?.rolesInYadahMinistry?.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={filters.educationalBackground}
              onChange={(e) =>
                handleFilterChange("educationalBackground", e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Education</option>
              {filterData?.educationalBackgrounds?.map((ed) => (
                <option key={ed} value={ed}>
                  {ed}
                </option>
              ))}
            </select>

            <select
              value={filters.batchInYadahMinistry}
              onChange={(e) =>
                handleFilterChange("batchInYadahMinistry", e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="">All Batches</option>
              {filterData?.batchesInYadah?.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Member Form */}
      {isFormOpen && (
        <MemberForm
          initialValues={selectedMember}
          isEdit={!!selectedMember}
          onClose={() => setIsFormOpen(false)}
          handleSubmitUser={handleSubmitMember}
        />
      )}

      {isViewOpen && viewUser && (
        <ViewUserDetails user={viewUser} onClose={handleCloseView} />
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg border-collapse">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              {[
                "createdAt",
                "userId",
                "fullName",
                "emailAddress",
                "phoneNumber",
                "gender",
                "maritalStatus",
                "numberOfChildren",
                "residentialAddress",
                "workAddress",
                "educationalBackground",
                "occupation",
                "skills",
                "localChurchName",
                "localChurchAddress",
                "roleInLocalChurch",
                "roleInYadahMinistry",
                "batchInYadahMinistry",
              ].map((field, index) => (
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
                        : field.replace(/([A-Z])/g, " $1")}
                    </span>
                    {getSortIcon(field)}
                  </button>
                </th>
              ))}
              <th className="px-4 py-2 text-left text-gray-700 border-r border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((member) => (
              <tr
                key={member._id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                {[
                  new Date(member.createdAt).toLocaleDateString(),
                  member.userId,
                  member.fullName,
                  member.emailAddress,
                  member.phoneNumber,
                  member.gender,
                  member.maritalStatus,
                  member.numberOfChildren,
                  member.residentialAddress,
                  member.workAddress,
                  member.educationalBackground,
                  member.occupation,
                  member.skills?.join(", "),
                  member.localChurchName,
                  member.localChurchAddress,
                  member.roleInLocalChurch?.join(", "),
                  member.roleInYadahMinistry?.join(", "),
                  member.batchInYadahMinistry,
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
                    onClick={() => handleEdit(member)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded w-[70px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewUser(member)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded w-[70px]"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
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

export default Members;
