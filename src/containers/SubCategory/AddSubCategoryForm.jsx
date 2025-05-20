"use client";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";
import UITextField from "@/components/InputFields/UITextField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import React, { useState } from "react";

const AddSubCategoryForm = () => {
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryImage: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    console.log("e.target", e.target.name);
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleFileUpload = (e) => {
    console.log("e.target.files", e.target.files);
    setCategoryData({ ...categoryData, categoryImage: e.target.files[0].name });
  };

  const handleAddCategory = () => {
    const dataObj = {
      name: categoryData.categoryName,
      image: categoryData.categoryImage,
    };
    console.log("dataObj", dataObj);
  };

  console.log("categoryData", categoryData);

  return (
    <>
      <div className="flex flex-col gap-4">
        <UITypography variant="h2" text="Add Category" />
        <div className="flex flex-col gap-3">
          <UIInputField
            name="categoryName"
            type="text"
            placeholder="Enter Category Name"
            isLable={true}
            lableName="Category Name"
            onChange={handleChange}
          />
          <UIFileInput onChange={handleFileUpload} />
          <UIButton
            type="contained"
            icon={false}
            title="Add"
            btnOnclick={handleAddCategory}
          />
        </div>
      </div>
    </>
  );
};

export default AddSubCategoryForm;
