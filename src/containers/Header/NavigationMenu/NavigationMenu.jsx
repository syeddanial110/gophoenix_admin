import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "../../../components/ui/app-sidebar";
import Image from "next/image";
import logo from "../../../assets/Images/logo.webp";
import { User } from "lucide-react";
import { cookies } from "next/headers";

const NavigationMenu = async ({ children }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify-between items-center px-4 bg-white w-full sticky top-0 border-b-1 border-gray">
          <SidebarTrigger />
          <Image src={logo} alt="log" height={70} />
          <User />
        </div>
        <div className="px-8 pt-6">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default NavigationMenu;
