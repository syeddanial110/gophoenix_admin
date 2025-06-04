"use client";
import { apiGet, apiPost, ImageBaseUrl } from "@/apis/ApiRequest";
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
import Image from "next/image";
import { Cross, X } from "lucide-react";

const EditProductForm = ({ setIsProductEdit }) => {
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
  const editProductData = useSelector(
    (state) => state?.EditProductDataReducer?.data
  );

  console.log("editProductData", editProductData);

  const form = useForm({
    resolver: yupResolver(addProductSchema),
    defaultValues: {
      productName: editProductData?.data?.productName
        ? editProductData?.data?.productName
        : "",
      locationAddress: editProductData?.data?.locationAddress
        ? editProductData?.data?.locationAddress
        : "",
      locationMapLink: editProductData?.data?.locationMapLink
        ? editProductData?.data?.locationMapLink
        : "",
      activities: editProductData?.data?.activities
        ? editProductData?.data?.activities
        : "",
      seats: editProductData?.data?.seats ? editProductData?.data?.seats : "",
      minAge: editProductData?.data?.minAge
        ? editProductData?.data?.minAge
        : "",
      maxAge: editProductData?.data?.maxAge
        ? editProductData?.data?.maxAge
        : "",
      ageException: editProductData?.data?.ageException
        ? editProductData?.data?.ageException
        : "",
      description: editProductData?.data?.description
        ? editProductData?.data?.description
        : "",
      price: editProductData?.data?.price ? editProductData?.data?.price : "",
      intervalCount: editProductData?.data?.intervalCount
        ? editProductData?.data?.intervalCount
        : "",
    },
  });

  const [startTime, setStartTime] = useState(
    editProductData?.data?.startTime || "10:00"
  );
  const [endTime, setEndTime] = useState(
    editProductData?.data?.endTime || "14:00"
  );
  const [date, setDate] = useState({
    from: editProductData?.data?.startDate
      ? new Date(editProductData.data.startDate)
      : new Date(),
    to: editProductData?.data?.endDate
      ? new Date(editProductData.data.endDate)
      : new Date(),
  });

  const [productData, setProductData] = useState({
    paymentType: editProductData?.data?.paymentType
      ? editProductData?.data?.paymentType
      : "",
    paymentTypeName: "",
    paymentInterval: editProductData?.data?.paymentInterval
      ? editProductData?.data?.paymentInterval
      : "",
    paymentIntervalName: "",
    productImage: editProductData?.data?.image
      ? editProductData?.data?.image
      : "",
    hoverImage: editProductData?.data?.hoverImage
      ? editProductData?.data?.hoverImage
      : "",
    galleryImages:
      editProductData?.data?.galleryImages?.length > 0
        ? editProductData?.data?.galleryImages
        : [],
    categoryName: editProductData?.data?.categoryName
      ? editProductData?.data?.categoryName
      : "",
    categoryId: editProductData?.data?.categoryId
      ? editProductData?.data?.categoryId
      : "",
    subCategoryName: editProductData?.data?.subCategoryName
      ? editProductData?.data?.subCategoryName
      : "",
    subCategoryId: editProductData?.data?.subCategoryId
      ? editProductData?.data?.subCategoryId
      : "",
  });

  const subCategoryDataReducer = useSelector(
    (state) => state?.GetAllSubCategoriesReducer?.res
  );
  const getAllCategoriesData = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res
  );

  function onSubmit(data, e) {
    console.log("data", data, e);

    const formData = new FormData();

    formData.append("productName", data.productName);
    formData.append("locationAddress", data.locationAddress);
    formData.append("locationMapLink", data.locationMapLink);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("startDate", date.from);
    formData.append("endDate", date.to);
    formData.append("activities", data.activities);
    formData.append("categoryId", productData.categoryId);
    formData.append("subCategoryId", productData.subCategoryId);
    formData.append("seats", data.seats);
    formData.append("minAge", data.minAge);
    formData.append("maxAge", data.maxAge);
    formData.append("ageException", data.ageException);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("currency", "USD");
    formData.append("paymentType", productData.paymentType);
    formData.append("paymentInterval", productData.paymentInterval);
    formData.append("intervalCount", data.intervalCount);
    formData.append("image", productData.productImage);
    formData.append("hoverImage", productData.hoverImage);
    productData.galleryImages.forEach((val, ind) => {
      formData.append(`galleryImages`, val);
    });

    const dataObj = {
      productName: data.productName,
      locationAddress: data.locationAddress,
      locationMapLink: data.locationMapLink,
      startTime: startTime,
      endTime: endTime,
      startDate: date.from,
      endDate: date.to,
      activities: data.activities,
      categoryId: productData.categoryId,
      subCategoryId: productData.subCategoryId,
      seats: data.seats,
      minAge: data.minAge,
      maxAge: data.maxAge,
      ageException: data.ageException,
      description: data.description,
      price: data.price,
      currency: "USD",
      paymentType: productData.paymentType,
      paymentInterval: productData.paymentInterval,
      intervalCount: data.intervalCount,
      image: productData.productImage,
      hoverImage: productData.hoverImage,
      galleryImages: productData.galleryImages,
    };
    console.log("formData", formData);
    console.log("dataObj", dataObj);

    // apiPost(
    //   `${ApiEndpoints.products.base}${ApiEndpoints.products.create}`,
    //   formData,
    //   (res) => {
    //     console.log("res", res);
    //     if (res.success) {
    //       toast.success(res.message);
    //       setIsProductEdit(false);
    //       if (res?.data?.message) {
    //         setTimeout(() => {
    //           toast.error(res?.data?.message);
    //         }, 1500);
    //       }
    //     }
    //   },
    //   (err) => {
    //     console.log("err", err);
    //   },
    //   { "Content-Type": "multipart/form-data" }
    // );
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

  const handleGalleryFileUpload = (e) => {
    const files = Array.from(e.target.files);

    setProductData({
      ...productData,
      galleryImages: files,
    });
  };

  const handleFileInput = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleGalleryImageRemove = (i) => {
    console.log("remove", i);
  };

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllSubCategories());
  }, []);

  // filteration for dropdown of payment types, sub category
  useEffect(() => {
    if (subCategoryDataReducer?.res) {
      let filteredPaymentTypeName = paymentTypes.filter(
        (item) => item.value == editProductData?.data?.paymentType
      );
      let filteredSubCategoryName = [];
      if (editProductData?.data?.subCategoryName !== null) {
        filteredSubCategoryName = subCategoryDataReducer?.res?.data.filter(
          (item) => item.name == editProductData?.data?.subCategoryName
        );
      }
      console.log("filteredSubCategoryName", filteredSubCategoryName);
      setProductData({
        ...productData,
        paymentTypeName: filteredPaymentTypeName[0]?.name,
        subCategoryName:
          editProductData?.data?.subCategoryName !== null
            ? filteredSubCategoryName[0]?.name
            : null,
      });
    }
  }, [subCategoryDataReducer?.res]);

  console.log("subCategoryDataReducer", subCategoryDataReducer);
  console.log("productData", productData);

  return (
    <>
      <div className="border-y-1 border-gray-300 my-4"></div>
      <div className="flex flex-col gap-3 w-[50%]">
        <UITypography variant="h4" text={"Edit Product"} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Product Name"
                    placeholder="Product Name"
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
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Activities"
                    placeholder="Activities"
                  />
                  <FormMessage />
                </FormItem>
              )}
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
                    type="number"
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
                    type="number"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ageException"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Age Exception" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Description" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Price"
                    type="number"
                    placeholder="eg: 300"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <UISelect
              isLabel={true}
              labelName="Select Category"
              name="categoryName"
              placeholder={"Category"}
              value={productData.categoryName}
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
              labelName="Select Sub Category"
              name="subCategoryName"
              placeholder={"Sub Category"}
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
            </UISelect>

            <UISelect
              isLabel={true}
              labelName="Select Payment Type"
              name="paymentType"
              placeholder={"Payment Type"}
              onValueChange={handlePaymentTypeSelectChange}
              value={productData?.paymentType}
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
            <UIFileInput
              labelName="ProductImage"
              onChange={handleFileInput}
              name="productImage"
            />

            {editProductData.data.image && (
              <Image
                src={`${ImageBaseUrl}${editProductData.data.image}`}
                alt={editProductData.data.image}
                height={180}
                width={140}
              />
            )}

            <UIFileInput
              labelName="Product Hover Image"
              onChange={handleFileInput}
              name="hoverImage"
            />
            {editProductData.data.hoverImage && (
              <Image
                src={`${ImageBaseUrl}${editProductData.data.hoverImage}`}
                alt={editProductData.data.image}
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
                        <UIButton
                          type="contained"
                          icon={true}
                          BtnIcon={X}
                          className="!bg-white !p-1 rounded"
                          btnOnclick={() => handleGalleryImageRemove(i)}
                        />
                      </div>
                      <Image
                        src={`${ImageBaseUrl}${item.imageUrl}`}
                        alt={item.imageUrl}
                        key={i}
                        height={240}
                        width={240}
                        objectFit="cover"
                      />
                    </div>
                  );
                })}
            </div>
            <UIButton
              type="contained"
              icon={false}
              title="Submit"
              btnType="submit"
            />
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditProductForm;
