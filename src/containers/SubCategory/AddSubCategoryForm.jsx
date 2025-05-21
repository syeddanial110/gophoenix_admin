"use client";
import { apiPost } from "@/apis/ApiRequest";
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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AddSubCategoryForm = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const getAllCategoriesData = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res
  );
  const [subCategoryData, setSubCategoryData] = useState({
    categoryId: "",
    subCategoryName: "",
    subCategoryImage: "",
    slug: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === "subCategoryName") {
      // Only generate slug for category name changes
      const slug = slugify(value);
      setSubCategoryData({ ...subCategoryData, [name]: value, slug: slug });
    } else {
      // For other fields, including categoryId from select
      setSubCategoryData({ ...subCategoryData, [name]: value });
    }
  };

  const handleFileUpload = (e) => {
    console.log("e.target.files", e.target.files);
    setSubCategoryData({
      ...subCategoryData,
      subCategoryImage: e.target.files[0],
    });
  };

  const handleAddCategory = () => {
    const dataObj = {
      name: subCategoryData.subCategoryName,
      image: subCategoryData.subCategoryImage,
      categoryId: subCategoryData.categoryId.id,
    };
    console.log("dataObj", dataObj);
    apiPost(
      `${ApiEndpoints.subCategory.base}${ApiEndpoints.subCategory.create}`,
      dataObj,
      (res) => {
        console.log("res", res);
        if (res?.success) {
          toast.success(res?.message);
          setModalOpen(false);
          dispatch(getAllSubCategories());
        }
      },
      (err) => {
        console.log("err", err);
      },
      { "Content-Type": "multipart/form-data" }
    );
  };

  const handleSelectChange = (value) => {
    const selectedItem = getAllCategoriesData?.res?.data.find(
      (item) => item.id === value
    );
    if (selectedItem) {
      setSubCategoryData({
        ...subCategoryData,
        categoryId: selectedItem,
      });
    }
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  console.log("categoryData", subCategoryData);
  console.log("getAllCategories", getAllCategoriesData);

  return (
    <>
      <div className="flex flex-col gap-4">
        <UITypography variant="h2" text="Add Category" />
        <div className="flex flex-col gap-3">
          <UIInputField
            name="subCategoryName"
            type="text"
            placeholder="Enter Category Name"
            isLable={true}
            lableName="Sub Category Name"
            onChange={handleChange}
          />
          <UIInputField
            name="slug"
            type="text"
            value={subCategoryData.slug}
            placeholder="The url will be"
            isLable={true}
            lableName="URL"
            disabled
          />
          <UISelect
            name="categoryId" // Add this
            onChange={handleChange}
            placeholder="Select Category"
            onValueChange={handleSelectChange}
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
