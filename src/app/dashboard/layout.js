import ProtectedRoute from "@/components/hoc/ProtectedRoute";
import Header from "@/containers/Header/Header";
import React from "react";

const Layout = ({ children }) => {
  return (
      <Header>{children}</Header>
  );
};

export default Layout;
