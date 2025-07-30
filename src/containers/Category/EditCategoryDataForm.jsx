"use client";
import { apiPut, ImageBaseUrl } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { slugify } from "@/utils/slugify";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const EditCategoryDataForm = ({ setModalOpen }) => {
  const categoryDataReducer = useSelector(
    (state) => state?.EditCategoryDataReducer?.data
  );
  const dispatch = useDispatch();

  const [categoryData, setCategoryData] = useState({
    id: "",
    categoryName: "",
    categoryImage: "",
    categorySlug: "",
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleFileInput = (e) => {
    setCategoryData({
      ...categoryData,
      categoryImage: e.target.files[0],
    });
  };

  const handleEditCategory = () => {
    const formData = new FormData();

    formData.append("name", categoryData.categoryName);
    formData.append("slug", categoryData.categorySlug);
    formData.append("image", categoryData.categoryImage);
    // const dataObj = {
    //   name: categoryData.categoryName,
    //   image: categoryData.categoryImage,
    //   url: categoryData.categorySlug,
    // };
    // console.log("dataObj", dataObj);
    apiPut(
      `${ApiEndpoints.categories.base}${ApiEndpoints.categories.update}/${categoryData.id}`,
      formData,
      (res) => {
        console.log("res", res);
        setModalOpen(false);
        toast.success(res?.message);
        dispatch(getAllCategories());
      },
      (err) => {
        console.log("err", err);
      },
      { "Content-Type": "multipart/form-data" }
    );
  };

  useEffect(() => {
    if (categoryDataReducer?.data) {
      setCategoryData({
        id: categoryDataReducer?.data?.id,
        categoryName: categoryDataReducer?.data?.name,
        categoryImage: categoryDataReducer?.data?.image,
        categorySlug: categoryDataReducer?.data?.slug,
      });
    }
  }, []);

  console.log("categoryDataReducer", categoryDataReducer);
  console.log("categoryData", categoryData);

  return (
    <>
      <div className="flex flex-col gap-3 mt-3">
        <UIInputField
          isLable={true}
          lableName="Collection Name"
          name="categoryName"
          value={categoryData.categoryName}
          onChange={handleInputChange}
        />
        <UIInputField
          isLable={true}
          lableName="URL"
          name="categorySlug"
          onChange={handleInputChange}
          value={categoryData.categorySlug}
        />
        <div>
          <UITypography
            variant="h6"
            text="Upload Image"
            className="!text-[14px]"
          />
          <UIFileInput onChange={handleFileInput} />
        </div>
        {/* {categoryData.categoryImage &&
          (categoryData.categoryImage.startsWith("http") ||
            categoryData.categoryImage.startsWith("/")) && (
            <Image
              src={categoryData.categoryImage}
              alt="img"
              height={60}
              width={60}
            />
          )} */}
        <UIButton
          type="contained"
          icon={false}
          title="Save"
          btnOnclick={handleEditCategory}
        />
      </div>
    </>
  );
};

export default EditCategoryDataForm;
