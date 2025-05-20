"use client";
import { apiGet, apiPost } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";
import UITextField from "@/components/InputFields/UITextField";
import { Input } from "@/components/ui/input";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { slugify } from "@/utils/slugify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const AddCategoryModal = ({ setModalOpen }) => {
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryImage: "",
    slug: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { value, name } = e.target;
    console.log("e.target", e.target.name);
    const slug = slugify(value);
    setCategoryData({ ...categoryData, [name]: value, slug: slug });
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
    apiPost(
      `${ApiEndpoints.categories.base}${ApiEndpoints.categories.create}`,
      dataObj,
      (res) => {
        console.log("res", res);
        if (res?.success) {
          toast.success(res?.message);
          setModalOpen(false);
          dispatch(getAllCategories());
        }
      },
      (err) => {
        console.log("err", err);
      },
      { "Content-Type": "multipart/form-data" }
    );
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
          <UIInputField
            name="slug"
            type="text"
            value={categoryData.slug}
            placeholder="The url will be"
            isLable={true}
            lableName="URL"
            disabled
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

export default AddCategoryModal;
