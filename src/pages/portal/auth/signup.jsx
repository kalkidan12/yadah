import React from "react";
import Head from "next/head";
import SignupForm from "@/components/auth/SignupForm";

const SignupPage = () => (
  <>
    <Head>
      <title>Sign Up | Join Yadah Today</title>
      <meta
        name="description"
        content="Create an account with Yadah to access personalized content and resources. Join our community today!"
      />
    </Head>
    <div
      style={{
        backgroundImage: "url('/assets/images/studio-bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-amber-600 via-amber-700 to-amber-600 p-4"
    >
      <SignupForm />
    </div>
  </>
);

export default SignupPage;
