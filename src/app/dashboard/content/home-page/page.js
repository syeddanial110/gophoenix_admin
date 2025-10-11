"use client";
import UITypography from "@/components/UITypography/UITypography";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { homepageContentSchema } from "@/utils/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import UITextField from "@/components/InputFields/UITextField";
import UIButton from "@/components/UIButton/UIButton";
import { apiPost } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import SEOForm from "@/containers/Products/SEOForm";
import BlogSEOForm from "@/containers/Blogs/BlogSEOForm";
import { toast } from "sonner";

const page = () => {
  const form = useForm({
    resolver: yupResolver(homepageContentSchema),
    defaultValues: {
      mainHeading: "",
      mainDescription: "",
      statsCard1Heading: "",
      statsCard1SubHeading: "",
      statsCard1Description: "",
      statsCard2Heading: "",
      statsCard2SubHeading: "",
      statsCard2Description: "",
      statsCard3Heading: "",
      statsCard3SubHeading: "",
      statsCard3Description: "",
    },
  });
  const [inputData, setInputData] = useState({
    metaTitle: "",
    metaDescription: "",
  });

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  function onSubmit(data) {
    console.log("data", data);
    const dataObj = {
      statsMainHeading: data.mainHeading,
      statsMainDescription: data.mainDescription,
      metaTitle: inputData.metaTitle,
      metaDescription: inputData.metaDescription,
      stats: [
        {
          heading: data.statsCard1Heading,
          subHeading: data.statsCard1SubHeading,
          description: data.statsCard1Description,
        },
        {
          heading: data.statsCard2Heading,
          subHeading: data.statsCard2SubHeading,
          description: data.statsCard2Description,
        },
        {
          heading: data.statsCard3Heading,
          subHeading: data.statsCard3SubHeading,
          description: data.statsCard3Description,
        },
      ],
    };
    apiPost(
      `${ApiEndpoints.home.create}`,
      dataObj,
      (res) => {
        console.log("res", res);
        toast.success(res?.data?.message);
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Home Page Content" />
      </div>
      <UITypography variant="h4" text="Stats Card" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-3 w-[50%]">
            <FormField
              control={form.control}
              name="mainHeading"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Main Stats Heading"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainDescription"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Main Stats Description"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard1Heading"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 1 Heading"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard1SubHeading"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 1 Sub Heading"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard1Description"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 1 Description"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard2Heading"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 2 Heading"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard2SubHeading"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 2 Sub Heading"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard2Description"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 2 Description"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard3Heading"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 3 Heading"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard3SubHeading"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 3 Sub Heading"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statsCard3Description"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Card 3 Description"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <BlogSEOForm
                shortDescription={inputData.shortDescription}
                metaTitle={inputData.metaTitle}
                metaDescription={inputData.metaDescription}
                onChange={(e) => handleInputChange(e)}
              />
              <UIButton
                type="contained"
                title="Submit"
                icon={false}
                btnType="submit"
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default page;
