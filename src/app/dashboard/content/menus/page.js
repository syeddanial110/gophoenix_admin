"use client";
import UIModal from "@/components/UIModal/UIModal";
import UITypography from "@/components/UITypography/UITypography";
import AddPagesModal from "@/containers/Menus/AddPagesModal";
import PagesTable from "@/containers/Menus/PagesTable";
import React, { useState } from "react";

const Menus = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Menus" />
        {/* <UIButton type="contained" icon={false} title="Add Category" /> */}
        <UIModal
          open={modalOpen}
          onOpenChange={handleModalOpen}
          modalBtnText="Add Menu"
          btnClassName="bg-main text-white px-7 py-2 rounded-2xl hover:cursor-pointer"
        >
          <AddPagesModal setModalOpen={setModalOpen} />
        </UIModal>
      </div>
      
      <PagesTable />
    </>
  );
};

export default Menus;
