import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSignupMutation } from "@/store/api/authApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/router";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain a lowercase letter")
      .matches(/[A-Z]/, "Password must contain an uppercase letter")
      .matches(/\d/, "Password must contain a number")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await signup(values).unwrap();
      toast.success("Signup successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/portal/auth/login");
      }, 2000);
    } catch (error) {
      toast.error(
        `Signup failed: ${error?.data?.message || "Unexpected error"}`,
        { position: "top-right" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-amber-50/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
        Sign Up
      </h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* First Name */}
            <div className="mb-4">
              <Field
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none transition"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <Field
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none transition"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none transition"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none transition"
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
                type={showRePassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-white/90 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none transition"
              />
              <div
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 cursor-pointer text-amber-600 hover:text-amber-700 transition-colors"
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>

              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`w-full py-3 px-4 font-bold rounded-lg text-white bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 ${
                isSubmitting || isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting || isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-4 text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <Link
          className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
          href="/portal/auth/login"
        >
          Login
        </Link>
      </p>

      <ToastContainer />
    </div>
  );
};

export default SignupForm;
