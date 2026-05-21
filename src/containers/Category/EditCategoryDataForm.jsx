"use client";
import { apiPut, apiGet, ImageBaseUrl } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "sonner";
import SEOForm from "../Products/SEOForm";

const EditCategoryDataForm = ({ setModalOpen }) => {
  const categoryDataReducer = useSelector(
    (state) => state?.EditCategoryDataReducer?.data,
  );
  const dispatch = useDispatch();

  const [categoryData, setCategoryData] = useState({
    id: "",
    categoryName: "",
    categoryImage: "",
    categorySlug: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [selectedClasses, setSelectedClasses] = useState([]);

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

  const handleClassSelect = (product) => {
    setSelectedClasses((prev) => {
      const exists = prev.findIndex((item) => item.id === product.id);
      let updatedClasses;
      if (exists > -1) {
        updatedClasses = prev.filter((_, i) => i !== exists);
      } else {
        updatedClasses = [...prev, product];
      }
      // Call API to update order
      updateClassesOrder(updatedClasses);
      return updatedClasses;
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(selectedClasses);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSelectedClasses(reordered);
    // Call API to update order
    updateClassesOrder(reordered);
  };

  const updateClassesOrder = (classes) => {
    setSelectedClasses(classes);
  };

  const handleEditCategory = () => {
    const formData = new FormData();

    formData.append("name", categoryData.categoryName);
    formData.append("slug", categoryData.categorySlug);
    formData.append("image", categoryData.categoryImage);
    formData.append("metaTitle", categoryData.metaTitle);
    formData.append("metaDescription", categoryData.metaDescription);
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
        
        // Update classes order
        const payload = {
          categoryId: categoryData.id,
          orderedIds: selectedClasses.map(cls => cls.id),
        };
        apiPut(
          `${ApiEndpoints.categories.updateOrder}`,
          JSON.stringify(payload),
          (orderRes) => {
            console.log("Classes order updated:", orderRes);
            setModalOpen(false);
            toast.success(res?.message);
            dispatch(getAllCategories());
          },
          (orderErr) => {
            console.log("Error updating classes order:", orderErr);
            setModalOpen(false);
            toast.success(res?.message);
            dispatch(getAllCategories());
          },
          { "Content-Type": "application/json" }
        );
      },
      (err) => {
        console.log("err", err);
      },
      { "Content-Type": "multipart/form-data" },
    );
  };

  useEffect(() => {
    if (categoryDataReducer?.data?.id) {
      const categoryId = categoryDataReducer?.data?.id;
      apiGet(
        `${ApiEndpoints.categories.base}${ApiEndpoints.categories.getById}/${categoryId}`,
        (res) => {
          const data = res?.data;
          setCategoryData({
            id: data?.id,
            categoryName: data?.name,
            categoryImage: data?.image,
            categorySlug: data?.slug,
            metaTitle: data?.metaTitle || "",
            metaDescription: data?.metaDescription || "",
          });
          if (data?.products) {
            setSelectedClasses(data.products);
          }
        },
        (err) => {
          console.log("Error fetching category:", err);
          toast.error("Failed to fetch category data");
        }
      );
    }
  }, [categoryDataReducer?.data?.id]);


  return (
    <>
      <div className="w-[60%] flex flex-col gap-3 mt-3">
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
        {categoryData.categoryImage && typeof categoryData.categoryImage === "string" && (
          <Image
            src={
              categoryData.categoryImage?.startsWith("http") ||
              categoryData.categoryImage?.startsWith("/")
                ? categoryData.categoryImage
                : `${ImageBaseUrl}${categoryData.categoryImage}`
            }
            alt="Category"
            height={100}
            width={100}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
            }}
            className="rounded border"
          />
        )}

        <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="selected-classes">
                {(provided) => (
                  <div
                    className="mt-2 border border-gray-200 rounded-lg overflow-hidden"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {selectedClasses.map((cls, idx) => (
                      <Draggable key={cls.id.toString()} draggableId={cls.id.toString()} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between px-4 py-2 text-sm border-b border-gray-100 last:border-b-0"
                            style={{
                              ...provided.draggableProps.style,
                              backgroundColor: snapshot.isDragging ? "#f0f9ff" : "white",
                            }}
                          >
                            <span
                              {...provided.dragHandleProps}
                              className="mr-2 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
                              title="Drag to reorder"
                            >
                              ⠿
                            </span>
                            <div
                              className="prose max-w-none flex-1 [&>*]:!m-0 [&>*]:!text-[13px] [&>*]:!font-normal [&>*]:!text-gray-700"
                              dangerouslySetInnerHTML={{ __html: cls.productName }}
                            />
                            <button
                              type="button"
                              onClick={() => handleClassSelect(cls)}
                              className="ml-3 text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
        </DragDropContext>

        <SEOForm
          productName={categoryData.categoryName}
          metaTitle={categoryData.metaTitle}
          metaDescription={categoryData.metaDescription}
          onChange={handleInputChange}
        />
        <div>
          <UIButton
            type="contained"
            icon={false}
            title="Save"
            btnOnclick={handleEditCategory}
          />
        </div>
      </div>
    </>
  );
};

export default EditCategoryDataForm;
