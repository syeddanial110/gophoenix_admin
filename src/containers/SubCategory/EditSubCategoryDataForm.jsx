"use client";
import { apiPut, ImageBaseUrl } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";
import UISelect from "@/components/InputFields/UISelect";
import { SelectItem } from "@/components/ui/select";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { getAllSubCategories } from "@/store/actions/subCategory";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { slugify } from "@/utils/slugify";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const EditSubCategoryDataForm = ({ setModalOpen }) => {
  const subCategoryDataReducer = useSelector(
    (state) => state?.EditSubCategoryDataReducer?.data
  );
  const getAllCategoriesData = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res
  );
  const dispatch = useDispatch();

  const [subCategoryData, setSubCategoryData] = useState({
    id: subCategoryDataReducer.data.id,
    subCategoryName: subCategoryDataReducer.data.name,
    subCategoryImage: subCategoryDataReducer.data.image,
    categoryId: subCategoryDataReducer.data.categoryId,
    categoryName: "",
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setSubCategoryData({ ...subCategoryData, [name]: value });
  };

  const handleFileInput = (e) => {
    setSubCategoryData({
      ...subCategoryData,
      subCategoryImage: e.target.files[0],
    });
  };

  const handleSelectChange = (value) => {
    const selectedItem = getAllCategoriesData?.res?.data.find(
      (item) => item.id === value
    );
    if (selectedItem) {
      setSubCategoryData({
        ...subCategoryData,
        categoryId: selectedItem.id,
        categoryName: selectedItem.name,
      });
    }
  };

  const handleEditCategory = () => {
    const formData = new FormData();

    formData.append("name", subCategoryData.subCategoryName);
    formData.append("image", subCategoryData.subCategoryImage);
    formData.append("categoryId", subCategoryData.categoryId);

    // const dataObj = {
    //   name: subCategoryData.subCategoryName,
    //   image: subCategoryData.subCategoryImage,
    //   categoryId: subCategoryData.categoryId,
    //   //   slug: categoryData.categorySlug,
    // };
    // console.log("dataObj", dataObj);
    apiPut(
      `${ApiEndpoints.subCategory.base}${ApiEndpoints.subCategory.update}/${subCategoryData.id}`,
      formData,
      (res) => {
        console.log("res", res);
        setModalOpen(false);
        toast.success(res?.message);
        dispatch(getAllSubCategories());
      },
      (err) => {
        console.log("err", err);
      },
      { "Content-Type": "multipart/form-data" }
    );
  };

  useEffect(() => {
    if (!getAllCategoriesData?.res?.data.length > 0) {
      return; // Don't proceed if either piece of data is missing
    }

    const selectedCategory = getAllCategoriesData.res.data.find(
      (item) => item.id == subCategoryDataReducer.data.categoryId
    );

    setSubCategoryData({
      ...subCategoryData,
      categoryName: selectedCategory.name,
      categoryId: selectedCategory.id,
    });
  }, [getAllCategoriesData?.res?.data.length]); // More specific dependencies

  useEffect(() => {
    // First, fetch categories if not already loaded
    dispatch(getAllCategories());
  }, []); // This effect runs once on mount

  console.log("subCategoryDataReducer", subCategoryDataReducer);
  console.log("categoryData", subCategoryData);
  console.log("getAllCategoriesData", getAllCategoriesData);

  return (
    <>
      <div className="flex flex-col gap-3 mt-3">
        <UIInputField
          isLable={true}
          lableName="Sub Category Name"
          name="subCategoryName"
          value={subCategoryData.subCategoryName}
          onChange={handleInputChange}
        />
        <UISelect
          isLabel={true}
          labelName="Select Category Type"
          name="categoryId" // Add this
          placeholder={subCategoryData.categoryName}
          onValueChange={handleSelectChange}
          // value={subCategoryData.categoryName.toString()}
        >
          {getAllCategoriesData?.res &&
            getAllCategoriesData?.res?.data.length > 0 &&
            getAllCategoriesData?.res?.data?.map((item, i) => {
              return (
                <SelectItem key={i} value={item?.id}>
                  {item?.name}
                </SelectItem>
              );
            })}
        </UISelect>
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

export default EditSubCategoryDataForm;
