"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "../../../components/ui/app-sidebar";
import Image from "next/image";
import logo from "../../../assets/Images/logo.png";
import { User } from "lucide-react";
import Cookies from "js-cookie";

const NavigationMenu = ({ children }) => {
  const [defaultOpen, setDefaultOpen] = useState(false);

  useEffect(() => {
    const sidebarState = Cookies.get("sidebar_state");
    setDefaultOpen(sidebarState === "true");
  }, []);
  
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen} hotkeys={false}>
        <AppSidebar />
        <main className="w-full">
          <div className="flex justify-between items-center px-4 bg-white w-full sticky top-0 border-b-1 border-gray z-9">
            <SidebarTrigger />
            <Image src={logo} alt="log" height={70} />
            <User />
          </div>
          <div className="px-8 pt-6">{children}</div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default NavigationMenu;
