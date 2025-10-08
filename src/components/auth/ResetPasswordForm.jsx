import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useResetPasswordMutation } from "@/store/api/authApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  const { email, otp } = router.query;

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleSubmit = async (values) => {
    try {
      await resetPassword({
        email,
        otp,
        newPassword: values.password,
      }).unwrap();

      toast.success("Password reset successful! Redirecting to login...", {
        position: "top-right",
      });

      setTimeout(() => router.push("/portal/auth/login"), 2000);
    } catch (error) {
      toast.error(error?.data?.message || "Reset password failed!", {
        position: "top-right",
      });
    }
  };

  if (!router.isReady) {
    return <div className="text-center p-6">Loading...</div>;
  }

  useEffect(() => {
    if (!email || !otp) {
      toast.error("Invalid or missing reset parameters.", {
        position: "top-right",
      });
      router.replace("/portal/auth/forgot-password");
    }
  }, [email, otp, router]);

  return (
    <div className="w-full max-w-md bg-amber-50/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
        Reset Password
      </h1>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          {/* New Password */}
          <div className="mb-4 relative">
            <Field
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              className="w-full p-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-500 transition"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 cursor-pointer text-amber-600 hover:text-amber-700 transition-colors"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <Field
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-500 transition"
            />
            <div
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-3 cursor-pointer text-amber-600 hover:text-amber-700 transition-colors"
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 font-bold rounded-lg text-white bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>

          {/* Cancel / Back to Login */}
          <Link
            href="/portal/auth/login"
            className="block text-center mt-4 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
          >
            Cancel / Back to Login
          </Link>
        </Form>
      </Formik>

      <ToastContainer />
    </div>
  );
};

export default ResetPasswordForm;
