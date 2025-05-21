"use client";
import { apiGet, apiPost } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";
import UITextField from "@/components/InputFields/UITextField";
import { Input } from "@/components/ui/input";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { slugify } from "@/utils/slugify";
import React, { useState } from "react";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { addProductSchema } from "@/utils/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { UIDatePicker } from "@/components/InputFields/UIDatePicker";

const AddProductModal = ({ setIsProductAdd }) => {
  const form = useForm({
    resolver: yupResolver(addProductSchema),
    defaultValues: {
      productName: "",
      locationAddress: "",
      locationMapLink: "",
      startTime: "",
      endTime: "",
      startDate: "",
      endDate: "",
      activities: "",
      seats: "",
      minAge: "",
      maxAge: "",
      ageException: "",
      description: "",
      price: "",
      currency: "",
      paymentType: "",
      paymentInterval: "",
      intervalCount: "",
    },
  });

  const [date, setDate] = useState();

  function onSubmit(data, e) {
    console.log("data", data, e);
  }


  console.log('date', date)

  return (
    <>
      <div className="border-y-1 border-gray-300 my-4"></div>
      <div className="flex flex-col gap-4">
        <UITypography variant="h4" text="Add Product" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Product Name" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationAddress"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Location Address" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationMapLink"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Location Map Link" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Start Time" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="End Time" />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Start Date" />
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <UIDatePicker date={date} setDate={setDate} />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="End Date" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Activities" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seats"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Seats" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minAge"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Min Age" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxAge"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Max Age" />
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
                  <UITextField field={field} formLabel="Price" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Payment Type" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentInterval"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Payment Interval" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intervalCount"
              render={({ field }) => (
                <FormItem>
                  <UITextField field={field} formLabel="Interval Count" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <UIButton
              type="contained"
              icon={false}
              title="Submit"
              btnType="submit"
            />
          </form>
        </Form>
        <div className="flex flex-col gap-3">
          <UIInputField
            name="categoryName"
            type="text"
            placeholder="Enter Category Name"
            isLable={true}
            lableName="Category Name"
            // onChange={handleChange}
          />
          <UIInputField
            name="categoryName"
            type="text"
            placeholder="Enter Loacation"
            isLable={true}
            lableName="Category Name"
            // onChange={handleChange}
          />
          <UIInputField
            name="categoryName"
            type="text"
            placeholder="Enter Map Link"
            isLable={true}
            lableName="Category Name"
            // onChange={handleChange}
          />
          <UIInputField
            name="slug"
            type="text"
            // value={categoryData.slug}
            placeholder="The url will be"
            isLable={true}
            lableName="URL"
            disabled
          />
          <UIFileInput
          //   onChange={handleFileUpload}
          />
          <UIButton
            type="contained"
            icon={false}
            title="Add"
            // btnOnclick={handleAddCategory}
          />
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
