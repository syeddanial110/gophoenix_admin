"use client"
import UITypography from "@/components/UITypography/UITypography";
import MenuEditor from "@/containers/Menu/MenuEditor";
import PagesTable from "@/containers/Menus/PagesTable";
import React from "react";

const Menu = () => {
  return (
    <div>
      <div>
        <UITypography variant="h3" text="Header Menu" />
        <MenuEditor />
      </div>
      <div>
        <UITypography variant="h3" text="Footer Menu" />
        <PagesTable />
      </div>
    </div>
  );
};

export default Menu;
