import React from "react";
import { useRouter } from "next/router";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { email, otp } = router.query;

  return (
    <div
      style={{
        backgroundImage: "url('/assets/images/studio-bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full min-h-screen flex justify-center items-center bg-gray-100 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-600 p-4"
    >
      {email && otp ? (
        <ResetPasswordForm />
      ) : (
        <p className="text-red-500 text-lg">
          Invalid or missing reset parameters
        </p>
      )}
    </div>
  );
};

export default ResetPasswordPage;
