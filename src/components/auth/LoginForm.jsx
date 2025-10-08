import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useLoginMutation } from "@/store/api/authApiSlice";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import Link from "next/link";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const result = await login(values).unwrap();
      const { accessToken, refreshToken, user } = result;

      dispatch(setCredentials({ user, accessToken, refreshToken }));

      if (["admin", "system-admin"].includes(user.role)) {
        router.replace("/portal/admin");
      } else {
        router.replace("/portal/auth/login");
      }

      toast.success("Login successful!", { position: "top-right" });
    } catch (error) {
      const message = error?.data?.message || "Login failed";
      toast.error(message, { position: "top-right" });
    }
  };

  return (
    <div className="w-full max-w-md bg-amber-50/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
        Login
      </h1>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          {/* Email */}
          <div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 bg-white/90 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none transition"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Field
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 bg-white/90 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 outline-none transition"
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/portal/auth/forgotten-password"
              className="text-amber-600 font-medium hover:text-amber-700 transition-colors text-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 font-bold rounded-lg text-white bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </Form>
      </Formik>

      {/* Sign Up Link */}
      <p className="mt-4 text-center text-gray-500 text-sm">
        Don't have an account?{" "}
        <Link
          href="/portal/auth/signup"
          className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
        >
          Sign Up
        </Link>
      </p>

      <ToastContainer />
    </div>
  );
};

export default LoginForm;
