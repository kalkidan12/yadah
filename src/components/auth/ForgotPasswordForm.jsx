import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForgotPasswordMutation } from "@/store/api/authApiSlice";
import { useRouter } from "next/router";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading: isSendingOTP }] =
    useForgotPasswordMutation();
  const router = useRouter();

  const emailSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const otpSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const handleEmailSubmit = async (values) => {
    try {
      await forgotPassword(values.email).unwrap();
      setEmail(values.email);
      setStep(2);
      toast.success("OTP sent to your email!", { position: "top-right" });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP", {
        position: "top-right",
      });
    }
  };

  const handleOTPSubmit = async (values) => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      toast.success("OTP verified! Redirecting to reset password...", {
        position: "top-right",
      });
      setTimeout(
        () =>
          router.push(
            `/portal/auth/reset-password?email=${email}&otp=${values.otp}`
          ),
        1000
      );
    } catch (error) {
      toast.error(error.message || "OTP verification failed", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="w-full max-w-md bg-amber-50/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
      {step === 1 ? (
        <>
          <h1 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
            Forgot Password
          </h1>
          <p className="text-gray-600 mb-4">
            Enter your email to receive a verification OTP.
          </p>
          <Formik
            key="email-step"
            initialValues={{ email: "" }}
            validationSchema={emailSchema}
            onSubmit={handleEmailSubmit}
          >
            <Form>
              <div className="mb-4">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full p-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-500 transition"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 px-4 font-bold rounded-lg text-white bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 ${
                  isSendingOTP ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSendingOTP}
              >
                {isSendingOTP ? "Sending OTP..." : "Send OTP"}
              </button>
            </Form>
          </Formik>
        </>
      ) : (
        <>
          {/* Header */}
          <h1 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
            Verify OTP
          </h1>
          <p className="text-gray-600 mb-4">Enter the OTP sent to {email}.</p>
          <Formik
            key="otp-step"
            initialValues={{ otp: "" }}
            validationSchema={otpSchema}
            onSubmit={handleOTPSubmit}
          >
            <Form>
              <div className="mb-4">
                <Field
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className="w-full p-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-500 transition"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 font-bold rounded-lg text-white bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300"
              >
                Verify OTP
              </button>
            </Form>
          </Formik>
        </>
      )}
      <p className="mt-4 text-center text-gray-500 text-sm">
        Remembered your password?{" "}
        <Link
          href="/portal/auth/login"
          className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
        >
          Back to Login
        </Link>
      </p>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordForm;
