import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Image from "next/image";
import logo from "../../assets/Images/logo.png";
import { Navigation_Menu } from "@/utils/navigation";
import Link from "next/link";
import UITypography from "../UITypography/UITypography";

// Menu items.

export function AppSidebar() {
  // const pathname = pathname();
  return (
    <Sidebar className="py-5">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Image src={logo} alt="logo" height={60} />
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              {Navigation_Menu.map((item, i) => {
                if (item?.subMenu) {
                  return (
                    <Collapsible
                      key={i}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarGroup className="p-0">
                        <SidebarGroupLabel asChild>
                          <CollapsibleTrigger>
                            <div
                              className={`flex gap-2 items-center ${"bg-#808080e2"}`}
                            >
                              <item.icon className="size-4.5 stroke-black" />
                              <UITypography
                                text={item.name}
                                className="text-black"
                              />
                            </div>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        {item.subMenu.map((elm, ind) => {
                          return (
                            <CollapsibleContent key={ind}>
                              <SidebarGroupContent className="pl-14 mt-2">
                                <Link href={elm.link}>
                                  <UITypography text={elm.name} />
                                </Link>
                              </SidebarGroupContent>
                            </CollapsibleContent>
                          );
                        })}
                      </SidebarGroup>
                    </Collapsible>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild>
                        <Link href={item.link}>
                          <item.icon />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
