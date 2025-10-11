"use client";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import AddBlog from "@/containers/Blogs/AddBlog";
import BlogTable from "@/containers/Blogs/BlogTable";
import EditBlog from "@/containers/Blogs/EditBlog";
import { getAllBlogs } from "@/store/actions/blogs";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Blogs = () => {
  const dispatch = useDispatch();
  const [isBlogAdd, setIsBlogAdd] = useState(false);
  const [isBlogEdit, setIsBlogEdit] = useState(false);
  const handleAddBlog = () => {
    if (!isBlogEdit) setIsBlogAdd(!isBlogAdd);
    if (isBlogEdit) {
      setIsBlogEdit(!isBlogEdit);
    }
  };

  useEffect(() => {
    dispatch(getAllBlogs());
  }, []);

  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Blogs" />
        <UIButton
          type={isBlogAdd || isBlogEdit ? "outlined" : "contained"}
          icon={false}
          title={isBlogAdd || isBlogEdit ? "Cancel" : "Add Blog"}
          btnOnclick={handleAddBlog}
        />
      </div>
      {isBlogAdd && <AddBlog setIsBlogAdd={setIsBlogAdd} />}
      {isBlogEdit && <EditBlog setIsBlogEdit={setIsBlogEdit} />}
      {!isBlogAdd && !isBlogEdit && (
        <BlogTable setIsBlogEdit={setIsBlogEdit} setIsBlogAdd={setIsBlogAdd} />
      )}
    </>
  );
};

export default Blogs;
