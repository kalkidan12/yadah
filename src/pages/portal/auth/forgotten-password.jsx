import React from "react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPasswordPage = () => (
  <>
    <div
      style={{
        backgroundImage: "url('/assets/images/studio-bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full min-h-screen flex justify-center items-center bg-gray-100 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-600 p-4"
    >
      <ForgotPasswordForm />
    </div>
  </>
);

export default ForgotPasswordPage;
