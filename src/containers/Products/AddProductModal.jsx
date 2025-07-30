"use client";
import { apiGet, apiPost } from "@/apis/ApiRequest";
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
import { addDays } from "date-fns";
import { UITimePicker } from "@/components/InputFields/UITimePicker";
import UISelect from "@/components/InputFields/UISelect";
import { SelectItem } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubCategories } from "@/store/actions/subCategory";
import { toast } from "sonner";
import UIModal from "@/components/UIModal/UIModal";
import { Minus, Plus, Trash, X } from "lucide-react";
import UIInputField from "@/components/InputFields/UIInputField";
import Editor from "../ContentEditor/Editor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import SEOForm from "./SEOForm";

const AddProductModal = ({ setIsProductAdd }) => {
  const paymentTypes = [
    { name: "Recurring", value: "recurring" },
    { name: "One Time", value: "one-time" },
    { name: "Both", value: "both" },
  ];
  const paymentInterval = [
    { name: "Day", value: "day" },
    { name: "Week", value: "week" },
    { name: "Month", value: "month" },
    { name: "Year", value: "year" },
  ];

  const dispatch = useDispatch();

  const form = useForm({
    resolver: yupResolver(addProductSchema),
    defaultValues: {
      locationAddress: "",
      locationMapLink: "",
      // activities: "",
      slug: "",
      seats: "",
      minAge: "",
      maxAge: "",
      // ageException: "",
      intervalCount: "",
    },
  });

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });
  const [productName, setProductName] = useState("");
  const [cardName, setCardName] = useState("");
  const [inputData, setInputData] = useState({
    shortDescription: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [productData, setProductData] = useState({
    paymentType: "",
    paymentTypeName: "",
    paymentInterval: "",
    paymentIntervalName: "",
    productImage: "",
    galleryImages: [],
    categoryName: "",
    categoryId: "",
    subCategoryName: "",
    subCategoryId: "",
  });
  const [productOptions, setProductOptions] = useState([
    {
      title: "",
      price: "",
      currency: "USD",
    },
  ]);
  const [editorValue, setEditorValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const subCategoryDataReducer = useSelector(
    (state) => state?.GetAllSubCategoriesReducer?.res
  );
  const getAllCategoriesData = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res
  );

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  function onSubmit(data, e) {
    console.log("data", data, e);

    const formattedStartDate = date.from.toISOString().split("T")[0];
    const formattedEndDate = date.to.toISOString().split("T")[0];

    console.log("formattedStartDate", formattedStartDate);
    console.log("formattedEndDate", formattedEndDate);

    // const formData = new FormData();

    // formData.append("productName", data.productName);
    // formData.append("locationAddress", data.locationAddress);
    // formData.append("locationMapLink", data.locationMapLink);
    // formData.append("startTime", startTime);
    // formData.append("endTime", endTime);
    // formData.append("startDate", formattedStartDate);
    // formData.append("endDate", formattedEndDate);
    // formData.append("activities", data.activities);
    // formData.append("categoryId", productData.categoryId);
    // formData.append("subCategoryId", productData.subCategoryId);
    // formData.append("seats", data.seats);
    // formData.append("minAge", data.minAge);
    // formData.append("maxAge", data.maxAge);
    // formData.append("ageException", data.ageException);
    // formData.append("description", data.description);
    // formData.append("price", data.price);
    // formData.append("currency", "USD");
    // formData.append("paymentType", productData.paymentType);
    // formData.append("paymentInterval", productData.paymentInterval);
    // formData.append("intervalCount", data.intervalCount);
    // formData.append("image", productData.productImage);
    // formData.append("hoverImage", productData.hoverImage);
    // formData.append("productOptions", JSON.stringify(productOptions));
    // productData.galleryImages.forEach((val, ind) => {
    //   formData.append(`galleryImages`, val);
    // });

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
      categoryId: productData.categoryId,
      subCategoryId: productData.subCategoryId,
      seats: data.seats,
      minAge: data.minAge,
      maxAge: data.maxAge,
      // ageException: data.ageException,
      description: editorValue,
      shortDesc: inputData.shortDescription,
      currency: "USD",
      paymentType: productData.paymentType,
      paymentInterval:
        productData.paymentType == "one-time"
          ? null
          : productData.paymentInterval,
      intervalCount:
        productData.paymentType == "one-time" ? null : data.intervalCount,
      image: productData.productImage,
      galleryImages: productData.galleryImages,
      productOptions: productOptions,
    };
    // console.log("formData", formData);
    console.log("dataObj", dataObj);

    apiPost(
      `${ApiEndpoints.products.base}${ApiEndpoints.products.create}`,
      dataObj,
      (res) => {
        console.log("res", res);
        if (res.success) {
          toast.success(res.message);
          setIsProductAdd(false);
          if (res?.data?.message) {
            setTimeout(() => {
              toast.error(res?.data?.message);
            }, 1500);
          }
        } else {
          toast.error(res?.message);
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  const handlePaymentTypeSelectChange = (value) => {
    const selectedItem = paymentTypes.find((item) => item.value === value);
    if (selectedItem) {
      setProductData({
        ...productData,
        paymentTypeName: selectedItem.name,
        paymentType: selectedItem.value,
      });
    }
  };

  const handlePaymentIntervalSelectChange = (value) => {
    const selectedItem = paymentInterval.find((item) => item.value === value);
    if (selectedItem) {
      setProductData({
        ...productData,
        paymentIntervalName: selectedItem.name,
        paymentInterval: selectedItem.value,
      });
    }
  };

  const handleCategorySelectChange = (value, type) => {
    if (type == "category") {
      const selectedItem = getAllCategoriesData?.res?.data.find(
        (item) => item.name === value
      );
      if (selectedItem) {
        setProductData({
          ...productData,
          categoryId: selectedItem.id,
          categoryName: selectedItem.name,
        });
      }
    } else {
      const selectedItem = subCategoryDataReducer?.res?.data.find(
        (item) => item.name === value
      );
      if (selectedItem) {
        setProductData({
          ...productData,
          subCategoryId: selectedItem.id,
          subCategoryName: selectedItem.name,
        });
      }
    }
  };

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
            console.log("formattedGalleryImages", formattedGalleryImages);
            setProductData((prev) => ({
              ...prev,
              galleryImages: [...prev.galleryImages, ...formattedGalleryImages],
            }));
          }
        },
        (err) => {
          console.log("err", err);
        },
        { "Content-Type": "multipart/form-data" }
      );
    }

    // setProductData({
    //   ...productData,
    //   galleryImages: files,
    // });
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
            setProductData({
              ...productData,
              [e.target.name]: res?.data[0]?.url,
            });
          }
        },
        (err) => {
          console.log("err", err);
        },
        { "Content-Type": "multipart/form-data" }
      );
    }
  };

  const handleGalleryImageRemove = (i) => {
    const filteredGalleryImages = productData.galleryImages.filter(
      (_, index) => index !== i
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

  console.log("productData", productData);
  // end image files input region

  // product options add , remove, on save btn click
  const handleAddProductOptions = () => {
    const arr = [...productOptions];
    arr.push({ title: "", price: "", currency: "USD" });
    console.log("arr", arr);
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

  const onSaveProductOptions = () => {
    setModalOpen(false);
  };
  console.log("productOptions", productOptions);

  //end region

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllSubCategories());
  }, []);

  console.log("inputData", inputData);

  return (
    <>
      <div className="border-y-1 border-gray-300 my-4"></div>
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between items-center">
              <UITypography variant="h4" text={"Add Class"} />
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
                text="Enter Class Name"
                className="!text-[14px] mt-8"
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
                      // type="number"
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
                      // type="number"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <UITypography
                variant="p"
                className="!font-[600]"
                text="Description"
              />
              <Editor
                editorValue={editorValue}
                setEditroValue={setEditorValue}
              />

              <UISelect
                isLabel={true}
                labelName="Select Collection"
                name="categoryName"
                placeholder={"Collection"}
                onValueChange={(val) =>
                  handleCategorySelectChange(val, "category")
                }
              >
                {getAllCategoriesData?.res &&
                  getAllCategoriesData?.res?.data.length > 0 &&
                  getAllCategoriesData?.res?.data?.map((item, i) => {
                    return (
                      <SelectItem key={i} value={item?.name}>
                        {item?.name}
                      </SelectItem>
                    );
                  })}
              </UISelect>
              <UISelect
                isLabel={true}
                labelName="Select Class Group"
                name="subCategoryName"
                placeholder={"Class Group"}
                onValueChange={(val) =>
                  handleCategorySelectChange(val, "subCategory")
                }
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
              </UISelect>

              <UISelect
                isLabel={true}
                labelName="Select Payment Type"
                name="paymentType"
                placeholder={"Payment Type"}
                onValueChange={handlePaymentTypeSelectChange}
              >
                {paymentTypes.map((item, i) => {
                  return (
                    <SelectItem key={i} value={item?.value}>
                      {item?.name}
                    </SelectItem>
                  );
                })}
              </UISelect>
              {productData.paymentType == "recurring" ||
              productData.paymentType == "both" ? (
                <>
                  <UISelect
                    isLabel={true}
                    labelName="Select Payment Interval"
                    name="paymentInterval"
                    placeholder={"Payment Interval"}
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
                  <FormField
                    control={form.control}
                    name="intervalCount"
                    render={({ field }) => (
                      <FormItem>
                        <UITextField
                          field={field}
                          formLabel="intervalCount"
                          type="number"
                          placeholder="eg: 2"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <></>
              )}
              {/* Add Product options */}
              <div className="flex justify-between items-center">
                <UITypography variant="h6" text="Add Product Options" />
                {/* <UIButton
                type="contained"
                icon={true}
                BtnIcon={Plus}
                className="border-1 border-grey rounded-full p-0"
                btnOnclick={handleAddProductOptions}
              /> */}
                <div>
                  <div
                    className="border-1 border-grey rounded-full p-3"
                    onClick={handleAddProductOptions}
                  >
                    <Plus onClick={handleAddProductOptions} />
                  </div>
                </div>
              </div>

              <div className="bg-[#dddcdc36] p-4 rounded-lg">
                <DragDropContext
                  onDragEnd={(result) => {
                    if (!result.destination) return;
                    const items = Array.from(productOptions);
                    const [reorderedItem] = items.splice(
                      result.source.index,
                      1
                    );
                    items.splice(result.destination.index, 0, reorderedItem);
                    setProductOptions(items);
                  }}
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
                                  <svg
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                  >
                                    <circle cx="5" cy="5" r="2" />
                                    <circle cx="15" cy="5" r="2" />
                                    <circle cx="5" cy="15" r="2" />
                                    <circle cx="15" cy="15" r="2" />
                                  </svg>
                                </div>
                                <div>
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
                                <div>
                                  <UIInputField
                                    isLable={true}
                                    lableName="Price"
                                    name={`price`}
                                    value={item.price}
                                    onChange={(e) =>
                                      handleProductOptionChange(e, ind)
                                    }
                                  />
                                </div>

                                {ind !== 0 && (
                                  <div className="w-[10%]">
                                    <div
                                      onClick={() =>
                                        handleRemoveProductOptions(ind)
                                      }
                                    >
                                      <Trash />
                                    </div>
                                  </div>
                                )}
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
                labelName="Product Image"
                onChange={handleFileInput}
                name="productImage"
              />
              {productData?.productImage && (
                <Image
                  src={`${productData.productImage}`}
                  alt={productData.productImage}
                  height={180}
                  width={140}
                />
              )}

              <UIFileInput
                labelName="Product Gallery Image"
                multiple={true}
                onChange={handleGalleryFileUpload}
              />
              <div className="flex gap-3">
                {productData.galleryImages.length > 0 &&
                  productData.galleryImages.map((item, i) => {
                    return (
                      <div className="relative">
                        <div className="absolute right-1 top-1 hover:cursor-pointer">
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
                onChange={(e) => handleInputChange(e)}
              />
              <div>
                <UIButton
                  type="contained"
                  icon={false}
                  title="Submit"
                  btnType="submit"
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddProductModal;
