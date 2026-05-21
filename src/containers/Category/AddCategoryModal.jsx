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
import SEOForm from "../Products/SEOForm";

const AddCategoryModal = ({ setIsAdd }) => {
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryImage: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { value, name } = e.target;
    console.log("e.target", e.target.name);
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleFileUpload = (e) => {
    console.log("e.target.files", e.target.files);
    setCategoryData({ ...categoryData, categoryImage: e.target.files[0] });
  };



  const handleAddCategory = () => {
    const formData = new FormData();

    formData.append("name", categoryData.categoryName);
    formData.append("slug", categoryData.slug);
    formData.append("image", categoryData.categoryImage);
    formData.append("metaTitle", categoryData.metaTitle);
    formData.append("metaDescription", categoryData.metaDescription);
    // const dataObj = {
    //   name: categoryData.categoryName,
    //   image: categoryData.categoryImage,
    // };
    // console.log("dataObj", dataObj);
    apiPost(
      `${ApiEndpoints.categories.base}${ApiEndpoints.categories.create}`,
      formData,
      (res) => {
        console.log("res", res);
        if (res?.success) {
          toast.success(res?.message);
          setIsAdd(false);
          dispatch(getAllCategories());
        }
      },
      (err) => {
        console.log("err", err);
      },
      { "Content-Type": "multipart/form-data" },
    );
  };

  console.log("categoryData", categoryData);

  return (
    <>
      <div className="w-[60%] flex flex-col gap-4 mt-6">
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
            onChange={handleChange}

            // disabled
          />
          <div>
            <UITypography
              variant="h6"
              text="Upload Image"
              className="!text-[14px]"
            />
            <UIFileInput onChange={handleFileUpload} />
          </div>

          <SEOForm
            productName={categoryData.categoryName}
            metaTitle={categoryData.metaTitle}
            metaDescription={categoryData.metaDescription}
            onChange={handleChange}
          />
          <div>
            <UIButton
              type="contained"
              icon={false}
              title="Submit"
              btnOnclick={handleAddCategory}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategoryModal;
