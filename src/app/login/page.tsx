// pages/login.js

import React from "react";
import Head from "next/head";
import { LoginForm } from "@/components/LoginTemplate";
import { Icons } from "@/components/icons";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full space-y-8">
        <div>
          <Icons.logo
            width={100}
            height={100}
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
