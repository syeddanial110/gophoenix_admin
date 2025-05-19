import LoginForm from "@/containers/AUTH/Login/LoginForm";
import React from "react";

const Login = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
      <p className="text-center text-gray-600 mb-6">
        Please enter your credentials to access your account.
      </p>
      <LoginForm />
    </>
  );
};

export default Login;
