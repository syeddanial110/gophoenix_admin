import UIModal from "@/components/UIModal/UIModal";
import UITypography from "@/components/UITypography/UITypography";
import AddCategoryModal from "@/containers/Category/AddCategoryModal";
import CategoryTable from "@/containers/Category/CategoryTable";
import AddSubCategoryForm from "@/containers/SubCategory/AddSubCategoryForm";
import SubCategoryTable from "@/containers/SubCategory/SubCategoryTable";
import React from "react";

const SubCategory = () => {
  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Sub Category" />
        {/* <UIButton type="contained" icon={false} title="Add Category" /> */}
        <UIModal
          modalBtnText="Add Sub Category"
          btnClassName="bg-main text-white px-7 py-2 rounded-2xl hover:cursor-pointer"
        >
          <AddSubCategoryForm />
        </UIModal>
      </div>
      <SubCategoryTable />
    </>
  );
};

export default SubCategory;
