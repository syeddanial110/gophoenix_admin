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
import { Minus, Plus } from "lucide-react";
import UIInputField from "@/components/InputFields/UIInputField";
import Editor from "../ContentEditor/Editor";

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
      productName: "",
      locationAddress: "",
      locationMapLink: "",
      activities: "",
      seats: "",
      minAge: "",
      maxAge: "",
      ageException: "",

      price: "",
      intervalCount: "",
    },
  });

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [productData, setProductData] = useState({
    paymentType: "",
    paymentTypeName: "",
    paymentInterval: "",
    paymentIntervalName: "",
    productImage: "",
    hoverImage: "",
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

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const subCategoryDataReducer = useSelector(
    (state) => state?.GetAllSubCategoriesReducer?.res
  );
  const getAllCategoriesData = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res
  );

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
      productName: data.productName,
      locationAddress: data.locationAddress,
      locationMapLink: data.locationMapLink,
      startTime: startTime,
      endTime: endTime,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      activities: data.activities,
      categoryId: productData.categoryId,
      subCategoryId: productData.subCategoryId,
      seats: data.seats,
      minAge: data.minAge,
      maxAge: data.maxAge,
      ageException: data.ageException,
      description: editorValue,
      price: data.price,
      currency: "USD",
      paymentType: productData.paymentType,
      paymentInterval: productData.paymentInterval,
      intervalCount: data.intervalCount,
      image: productData.productImage,
      hoverImage: productData.hoverImage,
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
            setProductData({
              ...productData,
              galleryImages: formattedGalleryImages,
            });
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

  console.log("productData", productData);
  // end image files input region

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

  const onSaveProductOptions = () => {
    setModalOpen(false);
  };
  console.log("productOptions", productOptions);

  //end region

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllSubCategories());
  }, []);

  console.log("subCategoryDataReducer", subCategoryDataReducer);
  console.log("productData", productData);
  console.log('editorValue', editorValue)

  return (
    <>
      <div className="border-y-1 border-gray-300 my-4"></div>
      <div className="flex flex-col gap-3 w-[50%]">
        <UITypography variant="h4" text={"Add Product"} />
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
            <Editor editorValue={editorValue} setEditroValue={setEditorValue} />
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

            <UITypography variant="h6" text="Add Product Options" />
            {productOptions[0].title != "" &&
              productOptions.map((item, ind) => {
                return (
                  <div className="border-1 border-gray-400 rounded-full p-4">
                    {item.title} | {item.price}
                  </div>
                );
              })}
            <UIModal
              open={modalOpen}
              onOpenChange={handleModalOpen}
              modalBtnText="Add"
              btnClassName="bg-white text-black border-2 border-grey px-7 py-2 rounded-2xl hover:cursor-pointer"
              modalHeaderTitle="Add Product for Child"
            >
              <div className="flex flex-col gap-4 h-[60vh] overflow-y-scroll">
                <div className="flex justify-end">
                  <UIButton
                    type="contained"
                    icon={true}
                    BtnIcon={Plus}
                    className="border-1 border-grey rounded-full p-0"
                    btnOnclick={handleAddProductOptions}
                  />
                </div>

                {productOptions.map((item, ind) => {
                  return (
                    <div className="flex" key={ind}>
                      <div className="w-[90%]">
                        <UIInputField
                          isLable={true}
                          lableName="Title"
                          name="title"
                          value={item.title}
                          onChange={(e) => handleProductOptionChange(e, ind)}
                        />
                        <UIInputField
                          isLable={true}
                          lableName="Price"
                          name="price"
                          value={item.price}
                          onChange={(e) => handleProductOptionChange(e, ind)}
                        />
                      </div>
                      {ind !== 0 && (
                        <div className="w-[10%]">
                          <UIButton
                            type="contained"
                            icon={true}
                            BtnIcon={Minus}
                            btnOnclick={() => handleRemoveProductOptions(ind)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <UIButton
                  type="contained"
                  icon={false}
                  title="Save"
                  btnOnclick={onSaveProductOptions}
                />
              </div>
            </UIModal>

            <UIFileInput
              labelName="ProductImage"
              onChange={handleFileInput}
              name="productImage"
            />
            <UIFileInput
              labelName="Product Hover Image"
              onChange={handleFileInput}
              name="hoverImage"
            />
            <UIFileInput
              labelName="Product Gallery Image"
              multiple={true}
              onChange={handleGalleryFileUpload}
            />
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

export default AddProductModal;
