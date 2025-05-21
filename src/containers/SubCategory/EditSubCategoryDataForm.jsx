"use client";
import { apiPut, ImageBaseUrl } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";
import UISelect from "@/components/InputFields/UISelect";
import { SelectItem } from "@/components/ui/select";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { slugify } from "@/utils/slugify";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const EditSubCategoryDataForm = () => {
  const subCategoryDataReducer = useSelector(
    (state) => state?.EditSubCategoryDataReducer?.data
  );
  const getAllCategoriesData = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res
  );
  const dispatch = useDispatch();

  const [subCategoryData, setSubCategoryData] = useState({
    id: "",
    subCategoryName: "",
    subCategoryImage: "",
    categoryId: "",
    categorName: "",
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
        categoryId: selectedItem,
      });
    }
  };

  const handleEditCategory = () => {
    const dataObj = {
      name: subCategoryData.categoryName,
      image: subCategoryData.categoryImage,
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
    if (subCategoryDataReducer?.data) {
        // const category_name = subCategoryDataReducer?.res?.data?.find((item) => )
      setSubCategoryData({
        id: subCategoryDataReducer?.data?.id,
        subCategoryName: subCategoryDataReducer?.data?.name,
        subCategoryImage: subCategoryDataReducer?.data?.image,
        categoryId: subCategoryDataReducer?.data?.categoryId,
      });
    }

    dispatch(getAllCategories());
  }, []);

  console.log("subCategoryDataReducer", subCategoryDataReducer);
  console.log("categoryData", subCategoryData);

  return (
    <>
      <div className="flex flex-col gap-3 mt-3">
        <UIInputField
          isLable={true}
          lableName="Category Name"
          name="categoryName"
          value={subCategoryData.subCategoryName}
          onChange={handleInputChange}
        />
        <UISelect
          name="categoryId" // Add this
          onChange={handleInputChange}
          placeholder="Select Category"
          onValueChange={handleSelectChange}
          value={subCategoryData.categoryId?.toString()}
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
