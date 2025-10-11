"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { blogsSchema } from "@/utils/schema";
import UITypography from "@/components/UITypography/UITypography";
import UITextField from "@/components/InputFields/UITextField";
import UIButton from "@/components/UIButton/UIButton";
import Editor from "../ContentEditor/Editor";
import SEOForm from "../Products/SEOForm";
import BlogSEOForm from "./BlogSEOForm";
import { apiPost, apiPut } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import UIFileInput from "@/components/InputFields/UIFileInput";
import { toast } from "sonner";
import Image from "next/image";
import { useSelector } from "react-redux";

const EditBlog = ({ setIsBlogEdit }) => {
  const editBlogData = useSelector((state) => state.EditBlogDataReducer?.data);
  console.log("EditBlogData", editBlogData);

  const form = useForm({
    resolver: yupResolver(blogsSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const [blogContent, setBlogContent] = useState("");
  const [inputData, setInputData] = useState({
    blogName: "",
    shortDescription: "",
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.description);
    formData.append("content", blogContent);
    formData.append("image", inputData.featuredImage);
    formData.append("metaTitle", inputData.metaTitle);
    formData.append("metaDesc", inputData.metaDescription);
    console.log("formData", formData);
    apiPut(
      `${ApiEndpoints.blogs.base}${ApiEndpoints.blogs.update}/${editBlogData?.data?.id}`,
      formData,
      (res) => {
        console.log("res", res);
        toast.success(res?.message);
        setIsBlogEdit(false);
      },
      (err) => {
        console.log("err", err);
      }
    );
    // Add your form submission logic here
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
            setInputData({ ...inputData, featuredImage: res?.data[0]?.url }); // Adjust according to your API response
            toast.success(res?.message);
          }
        },
        (err) => {
          console.log("err", err);
        },
        { "Content-Type": "multipart/form-data" }
      );
    }
  };

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!editBlogData?.data) return;

    // reset react-hook-form fields
    form.reset({
      title: editBlogData?.data.title || "",
      description: editBlogData?.data.description || "",
    });

    // set editor content and other input fields
    setBlogContent(editBlogData?.data.content || "");
    setInputData({
      blogName: editBlogData?.data.title || "",
      shortDescription: editBlogData?.data.description || "",
      featuredImage: editBlogData?.data.featuredImage || "",
      metaTitle: editBlogData?.data.metaTitle || "",
      metaDesc: editBlogData?.data.metaDesc || "",
    });
  }, [editBlogData]);

  console.log("inputData", inputData);

  return (
    <div>
      <div className="my-3">
        <hr />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-end items-center">
            {/* <UITypography variant="h4" text={"Add Class"} /> */}
            <UIButton
              type="contained"
              icon={false}
              title="Submit"
              btnType="submit"
            />
          </div>
          <div className="flex flex-col gap-3 w-[50%]">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Blog Name"
                    placeholder=""
                    onChange={(e) => {
                      field.onChange(e);
                      setInputData({ ...inputData, blogName: e.target.value });
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <UITextField
                    field={field}
                    formLabel="Enter the Description"
                    placeholder=""
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <UITypography
              variant="h6"
              text="Enter Blog Content"
              className="!text-[14px] mt-3"
            />
            <Editor editorValue={blogContent} setEditroValue={setBlogContent} />
            <UIFileInput
              labelName="Featured Image"
              onChange={handleFileInput}
              name="featuredImage"
            />

            {inputData.featuredImage && (
              <Image
                src={inputData.featuredImage}
                alt="Featured"
                className="w-32 h-32 object-cover mt-2"
                width={128}
                height={128}
              />
            )}

            <BlogSEOForm
              productName={inputData.blogName}
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
  );
};

export default EditBlog;
