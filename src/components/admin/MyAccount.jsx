import React, { useState, useEffect } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/profileApiSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyAccount = () => {
  const { data, isLoading, isError, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    role: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (data?.user) {
      setFormValues({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        email: data.user.email || "",
        currentPassword: "",
        newPassword: "",
        role: data.user.role || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formValues).unwrap();
      toast.success("Profile updated successfully!");
      setFormValues((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  if (isLoading) return <p className="text-center mt-6">Loading...</p>;
  if (isError || error)
    return (
      <p className="text-center text-red-500 mt-6">
        Failed to load profile: {error?.data?.message}
      </p>
    );

  return (
    <div className="w-full flex justify-center px-4 md:px-0">
      <div className="w-full max-w-2xl bg-amber-50/90 backdrop-blur-sm shadow-2xl p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
          My Account Settings
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="flex flex-col md:flex-row gap-4">
            <label className="w-full">
              <span className="block text-gray-700 font-medium mb-1">
                First Name
              </span>
              <input
                type="text"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition outline-none"
                required
              />
            </label>
            <label className="w-full">
              <span className="block text-gray-700 font-medium mb-1">
                Last Name
              </span>
              <input
                type="text"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition outline-none"
                required
              />
            </label>
          </div>

          {/* Email */}
          <label className="w-full">
            <span className="block text-gray-700 font-medium mb-1">Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              disabled
              className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition outline-none cursor-not-allowed"
              required
            />
          </label>

          {/* Current Password */}
          <label className="w-full relative">
            <span className="block text-gray-700 font-medium mb-1">
              Current Password
            </span>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formValues.currentPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition outline-none"
            />
            <span
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer text-amber-600 hover:text-amber-700 transition-colors"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>

          {/* New Password */}
          <label className="w-full relative">
            <span className="block text-gray-700 font-medium mb-1">
              New Password
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formValues.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition outline-none"
            />
            <span
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer text-amber-600 hover:text-amber-700 transition-colors"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>

          {/* Role Display */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold">Role:</span>
            <span className="bg-amber-600 text-white px-3 py-1 rounded-full font-medium shadow-sm">
              {formValues.role}
            </span>
          </div>

          {/* Update Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className={`w-full md:w-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:from-amber-700 hover:to-orange-700 transition-all duration-300 ${
                isUpdating ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default MyAccount;
