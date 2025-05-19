import React from "react";
import { Search, User, ShoppingBag } from "lucide-react";
import DesktopNavigationMenu from "./NavigationMenu/NavigationMenu";
import Image from "next/image";
import logo from "../../assets/Images/logo.png";
import { SideNavigation } from "./SideNavigation/SideNavigation";

const Header = ({ children }) => {
  return (
    <>
      <div className="sm:block hidden">
        <DesktopNavigationMenu>{children}</DesktopNavigationMenu>
      </div>
      <div className="block sm:hidden">
        <div className="flex justify-between">
          <Image src={logo} alt="logo" height={90} />
          <SideNavigation />
        </div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Header;
