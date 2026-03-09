"use client";
import { apiGet, apiPost, apiPut, ImageBaseUrl } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UITextField from "@/components/InputFields/UITextField";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import React, { useEffect, useState } from "react";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { addProductSchema } from "@/utils/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { UIDatePicker } from "@/components/InputFields/UIDatePicker";
import { UITimePicker } from "@/components/InputFields/UITimePicker";
import UISelect from "@/components/InputFields/UISelect";
import { SelectItem } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubCategories } from "@/store/actions/subCategory";
import { toast } from "sonner";
import Image from "next/image";
import { Info, Plus, Trash, X } from "lucide-react";
import UIInputField from "@/components/InputFields/UIInputField";
import Editor from "../ContentEditor/Editor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SEOForm from "./SEOForm";
import UISwitch from "@/components/UISwitch/UISwitch";
import UITooltip from "@/components/UITooltip/UITooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const EditProductForm = () => {
  const paymentTypes = [
    { name: "Recurring", value: "recurring" },
    { name: "One Time", value: "one-time" },
  ];
  const paymentInterval = [
    { name: "Day", value: "day" },
    { name: "Week", value: "week" },
    { name: "Month", value: "month" },
    { name: "Year", value: "year" },
  ];

  const dispatch = useDispatch();
  const editProductData = useSelector(
    (state) => state?.EditProductDataReducer?.data,
  );

  console.log("editProductData", editProductData);

  const [productData, setProductData] = useState({
    locationAddress: "",
    locationMapLink: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    seats: "",
    minAge: "",
    maxAge: "",
    description: "",
    selectedCollections: [],
    selectedCollectionIds: [],
    paymentTypeValue: "",
    paymentTypeName: "",
    paymentIntervalValue: "",
    paymentIntervalName: "",
    intervalCount: "",
    productImage: "",
    galleryImages: [],
  });
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const [productOptions, setProductOptions] = useState([
    {
      title: "",
      price: "",
      currency: "USD",
      isJersey: 0,
    },
  ]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [editorValue, setEditorValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [cardName, setCardName] = useState("");
  const [inputData, setInputData] = useState({
    shortDescription: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(addProductSchema),
    defaultValues: {
      slug: productData?.slug ? productData?.slug : "",
      locationAddress: productData?.locationAddress
        ? productData?.locationAddress
        : "",
      locationMapLink: productData?.locationMapLink
        ? productData?.locationMapLink
        : "",
      seats: productData?.seats ? productData?.seats : "",
      minAge: productData?.minAge ? productData?.minAge : "",
      maxAge: productData?.maxAge ? productData?.maxAge : "",
      intervalCount: productData?.intervalCount
        ? productData?.intervalCount
        : "",
    },
  });

  const getAllCategoriesData = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res,
  );

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  console.log("inputData", inputData);

  function onSubmit(data, e) {
    console.log("data", data, e);

    const formattedStartDate = date.from.toISOString().split("T")[0];
    const formattedEndDate = date.to.toISOString().split("T")[0];

    console.log("formattedStartDate", formattedStartDate);
    console.log("formattedEndDate", formattedEndDate);

    const dataObj = {
      productName: productName,
      cardName: cardName,
      locationAddress: data.locationAddress,
      locationMapLink: data.locationMapLink,
      slug: data.slug,
      startTime: startTime,
      endTime: endTime,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      // activities: data.activities,
      categories: productData.selectedCollectionIds,
      // subCategoryId: productData.subCategoryId,
      seats: data.seats,
      minAge: data.minAge,
      maxAge: data.maxAge,
      // ageException: data.ageException,
      description: editorValue,
      shortDesc: inputData.shortDescription,
      currency: "USD",
      paymentType: productData.paymentTypeValue,
      paymentInterval:
        productData.paymentTypeValue == "one-time"
          ? null
          : productData.paymentIntervalValue,
      intervalCount:
        productData.paymentTypeValue == "one-time" ? null : data.intervalCount,
      image: productData.productImage,
      galleryImages: productData.galleryImages,
      productOptions: productOptions,
      metaTitle: inputData.metaTitle,
      metaDescription: inputData.metaDescription,
    };
    console.log("dataObj", dataObj);
    // console.log("data", data);

    apiPut(
      `${ApiEndpoints.products.base}${ApiEndpoints.products.update}${editProductData?.data?.productId}`,
      dataObj,
      (res) => {
        console.log("res", res);
        if (res.success) {
          toast.success(res.message);
          if (res?.data?.message) {
            setTimeout(() => {
              toast.error(res?.data?.message);
            }, 1500);
          }
        }
      },
      (err) => {
        console.log("err", err);
      },
      // { "Content-Type": "multipart/form-data" }
    );
  }

  // select downdown functions

  const handlePaymentTypeSelectChange = (value) => {
    const selectedItem = paymentTypes.find((item) => item.value === value);
    if (selectedItem) {
      setProductData({
        ...productData,
        paymentTypeName: selectedItem.name,
        paymentTypeValue: selectedItem.value,
      });
    }
  };

  const handlePaymentIntervalSelectChange = (value) => {
    const selectedItem = paymentInterval.find((item) => item.value === value);
    if (selectedItem) {
      setProductData({
        ...productData,
        paymentIntervalName: selectedItem.name,
        paymentIntervalValue: selectedItem.value,
      });
    }
  };

  const handleCategorySelectChange = (categoryObject, type) => {
    setProductData((prev) => {
      const selectedCollections = prev.selectedCollections || [];
      const selectedCollectionIds = prev.selectedCollectionIds || [];
      const existingIndex = selectedCollections.findIndex(
        (item) => item.id === categoryObject.id
      );
      
      if (existingIndex > -1) {
        // Remove if already selected
        const updated = selectedCollections.filter((_, i) => i !== existingIndex);
        const updatedIds = selectedCollectionIds.filter((id) => id !== categoryObject.id);
        return {
          ...prev,
          selectedCollections: updated,
          selectedCollectionIds: updatedIds,
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          selectedCollections: [...selectedCollections, categoryObject],
          selectedCollectionIds: [...selectedCollectionIds, categoryObject.id],
        };
      }
    });
  };

  // end region select downdown functions

  // image files input region
  const handleGalleryFileUpload = (e) => {
    const formData = new FormData();

    // formData.append("image", e.target.files);
    const files = Array.from(e.target.files);
    console.log("e.target.files", e.target.files);
    files.forEach((val, ind) => {
      formData.append(`image`, val);
    });
    if (files?.length > 0) {
      apiPost(
        `${ApiEndpoints.uploadImage.base}${ApiEndpoints.uploadImage.upload}`,
        formData,
        (res) => {
          console.log("res", res);
          if (res?.success) {
            toast.success(res?.message);
            const formattedGalleryImages = res?.data.map((image) => ({
              path: image.url,
            }));
            // setProductData({
            //   ...productData,
            //   galleryImages: [
            //     ...productData.galleryImages,
            //     ...formattedGalleryImages,
            //   ],
            // });
            setProductData((prev) => ({
              ...prev,
              galleryImages: [...prev.galleryImages, ...formattedGalleryImages],
            }));
          }
        },
        (err) => {
          console.log("err", err);
        },
        { "Content-Type": "multipart/form-data" },
      );
    }
  };

  const handleFileInput = (e) => {
    const formData = new FormData();

    // formData.append("image", e.target.files);
    const files = Array.from(e.target.files);
    files.forEach((val, ind) => {
      formData.append(`image`, val);
    });
    if (files?.length > 0) {
      apiPost(
        `${ApiEndpoints.uploadImage.base}${ApiEndpoints.uploadImage.upload}`,
        formData,
        (res) => {
          console.log("res", res);
          if (res?.success) {
            toast.success(res?.message);
            // setProductData({
            //   ...productData,
            //   [e.target.name]: res?.data[0]?.url,
            // });
            setProductData((prev) => ({
              ...prev,
              [e.target.name]: res?.data[0]?.url,
            }));
          }
        },
        (err) => {
          console.log("err", err);
        },
        { "Content-Type": "multipart/form-data" },
      );
    }
  };

  const handleGalleryImageRemove = (i) => {
    const filteredGalleryImages = productData.galleryImages.filter(
      (_, index) => index !== i,
    );
    setProductData({
      ...productData,
      galleryImages: filteredGalleryImages,
    });
    // setProductData((prev) => ({
    //   ...prev,
    //   galleryImages: [...prev.galleryImages, ...formattedGalleryImages],
    // }));
  };

  // end region

  // product options add , remove, on save btn click
  const handleAddProductOptions = () => {
    const arr = [...productOptions];
    arr.push({ title: "", price: "", currency: "USD" });
    setProductOptions(arr);
  };

  const handleRemoveProductOptions = (ind) => {
    const filteredOptions = productOptions.filter((_, index) => index !== ind);
    setProductOptions(filteredOptions);
  };

  const handleProductOptionChange = (e, ind) => {
    console.log("ind", ind);
    const { name, value } = e.target;
    const updatedOptions = productOptions.map((item, index) => {
      if (index === ind) {
        return {
          ...item,
          [name]: value,
        };
      }
      return item;
    });
    setProductOptions(updatedOptions);
  };

  const handleIsJerseySwitch = (val, ind) => {
    console.log("val", val);
    setProductOptions((prev) =>
      prev.map((item, index) => {
        if (index === ind) {
          return {
            ...item,
            isJersey: val ? 1 : 0,
          };
        }
        return item;
      }),
    );
  };

  console.log("productOptions", productOptions);

  //end region

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  useEffect(() => {
    if (!editProductData?.data?.productId) return;
    setIsLoading(true);
    apiGet(
      `${ApiEndpoints.products.base}${ApiEndpoints.products.getById}${editProductData?.data?.productId}`,
      (res) => {
        console.log("res-------", res);
        setProductName(res?.data?.productName);
        setCardName(res?.data?.cardName);
        form.reset({
          locationAddress: res?.data.locationAddress || "",
          locationMapLink: res?.data.locationMapLink || "",
          seats: res?.data.seats || "",
          minAge: res?.data.minAge || "",
          maxAge: res?.data.maxAge || "",
          intervalCount: res?.data.intervalCount || "",
          slug: res?.data?.slug || "",
        });
        setProductData({
          productName: res?.data?.productName || "",
          cardName: res?.data?.cardName || "",
          slug: res?.data?.slug || "",
          selectedCollections: Array.isArray(res?.data?.categories) ? res?.data?.categories : [],
          selectedCollectionIds: Array.isArray(res?.data?.categories) ? res?.data?.categories.map((cat) => cat.id) : [],
          // subCategoryName: res?.data?.subCategoryName || "",
          // subCategoryId: res?.data?.subCategoryId || "",
          paymentTypeValue: res?.data?.paymentType || "",
          paymentTypeName: "",
          paymentIntervalValue: res?.data?.paymentInterval || "",
          paymentIntervalName: "",
          intervalCount: res?.data?.intervalCount || "",
          productImage: res?.data?.image || "",
          galleryImages: res?.data?.galleryImages || [],
        });
        setDate({
          from: new Date(res?.data?.startDate),
          to: new Date(res?.data?.endDate),
        });
        setStartTime(res?.data?.startTime || "");
        setEndTime(res?.data?.endTime || "");
        setProductOptions(
          res?.data?.productOptions && res?.data?.productOptions.length > 0
            ? res.data.productOptions.map((opt) => ({
                title: opt.title ?? "",
                price: opt.price ?? "",
                // ensure numeric 0/1 for your UISwitch logic
                isJersey: opt.isJersey,
              }))
            : [
                {
                  title: "",
                  price: "",
                  isJersey: 0,
                },
              ],
        );
        setEditorValue(res?.data?.description || "");
        setInputData({
          metaTitle: res?.data?.metaTitle,
          metaDescription: res?.data?.metaDescription,
          shortDescription: res?.data?.shortDesc,
        });
        setIsLoading(false);
      },
      (err) => {
        console.log("err", err);
      },
    );
    // eslint-disable-next-line
  }, [editProductData?.data?.productId, form.reset]);

  // form data setup
  // useEffect(() => {
  //   if (productData) {
  //     form.reset({
  //       locationAddress: productData.locationAddress || "",
  //       locationMapLink: productData.locationMapLink || "",
  //       activities: productData.activities || "",
  //       seats: productData.seats || "",
  //       minAge: productData.minAge || "",
  //       maxAge: productData.maxAge || "",
  //       ageException: productData.ageException || "",
  //       description: productData.description || "",
  //       price: productData.price || "",
  //       intervalCount: productData.intervalCount || "",
  //     });
  //   }
  // }, [productData, form.reset]);

  // filteration for dropdown of payment types, sub category
  useEffect(() => {
    if (!isLoading) {
      let filteredPaymentTypeName = paymentTypes.filter(
        (item) => item.value == productData?.paymentTypeValue,
      );
      setProductData({
        ...productData,
        paymentTypeName: filteredPaymentTypeName[0]?.name,
      });
    }
  }, [isLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!categoryDropdownOpen) return;

    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('[data-category-dropdown]');
      if (dropdown && !dropdown.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoryDropdownOpen]);

  console.log("productData/////,", productData);
  return (
    <>
      <div className="border-y-1 border-gray-300 my-4"></div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between items-center">
              <UITypography variant="h4" text={"Edit Class"} />
              <UIButton
                type="contained"
                icon={false}
                title="Submit"
                btnType="submit"
              />
            </div>
            <div className="flex flex-col gap-3 w-[50%]">
              <UITypography
                variant="h6"
                text="Enter Class Name (This shows on card)"
                className="!text-[14px] mt-8"
              />

              <Editor editorValue={cardName} setEditroValue={setCardName} />
              <UITypography
                variant="h6"
                text="Class Name"
                className="!text-[14px]"
              />
              <Editor
                editorValue={productName}
                setEditroValue={setProductName}
              />
              <UIInputField
                isLable={true}
                lableName="Short Description"
                name="shortDescription"
                value={inputData.shortDescription}
                onChange={(e) => handleInputChange(e)}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <UITextField
                      field={field}
                      formLabel="Enter the product URL"
                      placeholder="eg: test-url"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationAddress"
                render={({ field }) => (
                  <FormItem>
                    <UITextField
                      field={field}
                      formLabel="Location Address"
                      placeholder="Location Address"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationMapLink"
                render={({ field }) => (
                  <FormItem>
                    <UITextField
                      field={field}
                      formLabel="Location Map Link"
                      placeholder="Location Map Link"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <UIDatePicker
                date={date}
                setDate={setDate}
                labelName="Start Date & End Date"
              />
              <UITimePicker
                time={startTime}
                setTime={setStartTime}
                labelName="Start Time"
              />
              <UITimePicker
                time={endTime}
                setTime={setEndTime}
                labelName="End Time"
              />

              <FormField
                control={form.control}
                name="seats"
                render={({ field }) => (
                  <FormItem>
                    <UITextField
                      field={field}
                      formLabel="Seats"
                      placeholder="eg: 100"
                      type="number"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minAge"
                render={({ field }) => (
                  <FormItem>
                    <UITextField
                      field={field}
                      formLabel="Min Age"
                      placeholder="eg: 04"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxAge"
                render={({ field }) => (
                  <FormItem>
                    <UITextField
                      field={field}
                      formLabel="Max Age"
                      placeholder="eg: 12"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Description" />
                  <FormMessage />
                </FormItem>
              )}
            /> */}
              <UITypography
                variant="p"
                className="!font-[600]"
                text="Description"
              />
              <Editor
                editorValue={editorValue}
                setEditroValue={setEditorValue}
              />

              <div className="relative w-full" data-category-dropdown>
                <UITypography
                  variant="h6"
                  text="Select Collection"
                  className="!text-[14px] mb-2"
                />
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
                >
                  <span className="text-sm">
                    {productData.selectedCollections?.length > 0
                      ? `${productData.selectedCollections?.length} selected`
                      : "Select Collections"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      categoryDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {getAllCategoriesData?.res?.data?.length > 0 ? (
                      getAllCategoriesData?.res?.data?.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={productData.selectedCollections?.some(
                              (selected) => selected.id === item.id
                            )}
                            onChange={() =>
                              handleCategorySelectChange(item, "category")
                            }
                            className="w-4 h-4 mr-2 cursor-pointer"
                          />
                          <span className="text-sm">{item.name}</span>
                        </label>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No collections available
                      </div>
                    )}
                  </div>
                )}

                {productData.selectedCollections?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {productData.selectedCollections?.map((collection, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{collection.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCategorySelectChange(collection, "category")
                          }
                          className="cursor-pointer hover:text-blue-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* <UISelect
                isLabel={true}
                labelName="Select Class Group"
                name="subCategoryName"
                placeholder={"Class Group"}
                onValueChange={(val) =>
                  handleCategorySelectChange(val, "subCategory")
                }
                value={productData.subCategoryName}
              >
                {subCategoryDataReducer?.res &&
                  subCategoryDataReducer?.res?.data.length > 0 &&
                  subCategoryDataReducer?.res?.data?.map((item, i) => {
                    return (
                      <SelectItem key={i} value={item?.name}>
                        {item?.name}
                      </SelectItem>
                    );
                  })}
              </UISelect> */}

              <UISelect
                isLabel={true}
                labelName="Select Payment Type"
                name="paymentType"
                placeholder={"Payment Type"}
                onValueChange={handlePaymentTypeSelectChange}
                value={productData?.paymentTypeValue}
                defaultValue={productData?.paymentTypeValue}
              >
                {paymentTypes.map((item, i) => {
                  return (
                    <SelectItem key={i} value={item?.value}>
                      {item?.name}
                    </SelectItem>
                  );
                })}
              </UISelect>
              {productData.paymentTypeValue == "recurring" ? (
                <>
                  <UISelect
                    isLabel={true}
                    labelName="Select Payment Interval"
                    name="paymentInterval"
                    placeholder={"Payment Interval"}
                    value={productData?.paymentIntervalValue}
                    onValueChange={handlePaymentIntervalSelectChange}
                  >
                    {paymentInterval.map((item, i) => {
                      return (
                        <SelectItem key={i} value={item?.value}>
                          {item?.name}
                        </SelectItem>
                      );
                    })}
                  </UISelect>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="intervalCount"
                      render={({ field }) => (
                        <FormItem>
                          <UITextField
                            field={field}
                            formLabel="Interval Count"
                            type="number"
                            placeholder="eg: 2"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <UITooltip>
                      <TooltipTrigger
                        open={tooltipOpen}
                        onOpenChange={setTooltipOpen}
                      >
                        <Info />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-2">
                          <UITypography text="Interval Count means Choose how many times your payment amount will change, based on your selected billing cycle" />
                        </div>
                      </TooltipContent>
                    </UITooltip>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            {/* Add Product options */}
            <div className="flex justify-between items-center w-[80%]">
              <UITypography variant="h6" text="Add Product Options" />
              <div>
                <div
                  className="border-1 border-grey rounded-full p-3"
                  onClick={handleAddProductOptions}
                >
                  <Plus onClick={handleAddProductOptions} />
                </div>
              </div>
            </div>

            <div className="bg-[#dddcdc36] p-4 rounded-lg w-[80%]">
              <DragDropContext
                onDragEnd={(result) => {
                  if (!result.destination) return;
                  const items = Array.from(productOptions);
                  const [reorderedItem] = items.splice(result.source.index, 1);
                  items.splice(result.destination.index, 0, reorderedItem);
                  setProductOptions(items);
                }}
                className="w-full"
              >
                <Droppable droppableId="productOptions">
                  {(provided) => (
                    <div
                      className="bg-[#dddcdc36] p-4 rounded-lg"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {productOptions.map((item, ind) => (
                        <Draggable
                          key={ind}
                          draggableId={ind.toString()}
                          index={ind}
                        >
                          {(provided, snapshot) => (
                            <div
                              className="flex gap-6 items-center"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                background: snapshot.isDragging
                                  ? "#f3f3f3"
                                  : "transparent",
                              }}
                            >
                              {/* Drag handle icon (optional, you can use any icon) */}
                              <div
                                className="cursor-grab"
                                {...provided.dragHandleProps}
                              >
                                <svg width="20" height="20" fill="currentColor">
                                  <circle cx="5" cy="5" r="2" />
                                  <circle cx="15" cy="5" r="2" />
                                  <circle cx="5" cy="15" r="2" />
                                  <circle cx="15" cy="15" r="2" />
                                </svg>
                              </div>
                              <div className="w-full">
                                <UIInputField
                                  isLable={true}
                                  lableName="Title"
                                  name={`title`}
                                  value={item.title}
                                  onChange={(e) =>
                                    handleProductOptionChange(e, ind)
                                  }
                                />
                              </div>
                              <div className="w-full">
                                <UIInputField
                                  isLable={true}
                                  lableName="Price"
                                  name={`price`}
                                  value={item.price}
                                  onChange={(e) =>
                                    handleProductOptionChange(e, ind)
                                  }
                                  type="number"
                                />
                              </div>
                              <div className="flex flex-col gap-3 justify-start">
                                <UITypography variant="h6" text="Jersey" />

                                <UISwitch
                                  checked={item.isJersey == 1 ? true : false}
                                  onCheckedChange={(val) =>
                                    handleIsJerseySwitch(val, ind)
                                  }
                                />
                              </div>

                              <div className="w-[10%]">
                                {ind !== 0 && (
                                  <div
                                    onClick={() =>
                                      handleRemoveProductOptions(ind)
                                    }
                                  >
                                    <Trash />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* add product option end */}
            <UIFileInput
              labelName="Class Image"
              onChange={handleFileInput}
              name="productImage"
            />

            {productData.productImage && (
              <Image
                src={`${productData.productImage}`}
                alt={productData.productImage}
                height={180}
                width={140}
              />
            )}

            <UIFileInput
              labelName="Class Gallery Image"
              multiple={true}
              onChange={handleGalleryFileUpload}
            />
            <div className="flex gap-3">
              {productData.galleryImages.length > 0 &&
                productData.galleryImages.map((item, i) => {
                  return (
                    <div className="relative">
                      <div className="absolute right-1 top-1 hover:cursor-pointer">
                        {/* <UIButton
                          type="contained"
                          icon={true}
                          BtnIcon={X}
                          className="!bg-white !p-1 rounded"
                          btnOnclick={() => handleGalleryImageRemove(i)}
                        /> */}
                        <div onClick={() => handleGalleryImageRemove(i)}>
                          <X />
                        </div>
                      </div>
                      <Image
                        src={item.path}
                        alt={item.path}
                        key={i}
                        height={240}
                        width={240}
                        objectFit="cover"
                      />
                    </div>
                  );
                })}
            </div>
            <SEOForm
              productName={productName}
              shortDescription={inputData.shortDescription}
              metaTitle={inputData.metaTitle}
              metaDescription={inputData.metaDescription}
              onChange={handleInputChange}
            />
            <div>
              <UIButton
                type="contained"
                icon={false}
                title="Submit"
                btnType="submit"
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditProductForm;
