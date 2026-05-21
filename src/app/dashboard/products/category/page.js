"use client";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import AddCategoryModal from "@/containers/Category/AddCategoryModal";
import EditCategoryDataForm from "@/containers/Category/EditCategoryDataForm";
import CategoryTable from "@/containers/Category/CategoryTable";
import React, { useState } from "react";

const Category = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleIsAdd = () => {
    setIsAdd(!isAdd);
    setIsEdit(false);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
  };

  const showTable = !isAdd && !isEdit;

  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Collection" />
        {showTable && (
          <UIButton
            type="contained"
            icon={false}
            title="Add Collection"
            onClick={handleIsAdd}
          />
        )}
        {(isAdd || isEdit) && (
          <UIButton
            type="outlined"
            icon={false}
            title="Cancel"
            onClick={isAdd ? handleIsAdd : handleCancelEdit}
          />
        )}
      </div>
      {isAdd && <AddCategoryModal setIsAdd={setIsAdd} />}
      {isEdit && <EditCategoryDataForm setModalOpen={handleCancelEdit} />}
      {showTable && <CategoryTable setIsEdit={setIsEdit} />}
    </>
  );
};

export default Category;
