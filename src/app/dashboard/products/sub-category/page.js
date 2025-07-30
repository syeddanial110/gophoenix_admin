"use client";
import UIModal from "@/components/UIModal/UIModal";
import UITypography from "@/components/UITypography/UITypography";
import AddCategoryModal from "@/containers/Category/AddCategoryModal";
import CategoryTable from "@/containers/Category/CategoryTable";
import AddSubCategoryForm from "@/containers/SubCategory/AddSubCategoryForm";
import SubCategoryTable from "@/containers/SubCategory/SubCategoryTable";
import React, { useState } from "react";

const SubCategory = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Class Group" />
        {/* <UIButton type="contained" icon={false} title="Add Category" /> */}
        <UIModal
          open={modalOpen}
          onOpenChange={handleModalOpen}
          modalBtnText="Add Class Group"
          modalHeaderTitle="Add Class Group"
          btnClassName="bg-main text-white px-7 py-2 rounded-2xl hover:cursor-pointer"
        >
          <AddSubCategoryForm setModalOpen={setModalOpen} />
        </UIModal>
      </div>
      <SubCategoryTable />
    </>
  );
};

export default SubCategory;
