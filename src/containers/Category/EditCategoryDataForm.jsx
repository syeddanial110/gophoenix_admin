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
    const slug = slugify(value);
    setCategoryData({ ...categoryData, [name]: value, categorySlug: slug });
  };

  const handleFileInput = (e) => {
    setCategoryData({
      ...categoryData,
      categoryImage: e.target.files[0],
    });
  };

  const handleEditCategory = () => {
    const dataObj = {
      name: categoryData.categoryName,
      image: categoryData.categoryImage,
      //   slug: categoryData.categorySlug,
    };
    console.log("dataObj", dataObj);
    apiPut(
      `${ApiEndpoints.categories.base}${ApiEndpoints.categories.update}/${categoryData.id}`,
      dataObj,
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
          lableName="Category Name"
          name="categoryName"
          value={categoryData.categoryName}
          onChange={handleInputChange}
        />
        <UIInputField
          isLable={true}
          lableName="URL"
          disabled
          value={categoryData.categorySlug}
        />
        <UIFileInput onChange={handleFileInput} />
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
