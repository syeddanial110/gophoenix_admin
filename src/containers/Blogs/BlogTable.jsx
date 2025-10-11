import React from "react";
import BlogCard from "./BlogCard";
import blogimg from "../../assets/Images/card_img.webp";
import { useDispatch, useSelector } from "react-redux";
import UITypography from "@/components/UITypography/UITypography";
import { apiDelete } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { toast } from "sonner";
import { editBlogData, getAllBlogs } from "@/store/actions/blogs";

const BlogTable = ({ setIsBlogAdd, setIsBlogEdit }) => {
  const dispatch = useDispatch();
  const getAllBlogsData = useSelector(
    (state) => state.GetAllBlogsReducer?.data
  );
  console.log("getAllBlogs", getAllBlogsData);

  const handleDeleteBlog = (blogId) => {
    apiDelete(
      `${ApiEndpoints.blogs.base}${ApiEndpoints.blogs.delete}/${blogId}`,
      (res) => {
        console.log("Blog deleted successfully", res);
        toast.success(res?.message);
        dispatch(getAllBlogs());
      },
      (err) => {
        console.error("Error deleting blog", err);
      }
    );
  };

  return (
    <div className="my-6">
      {getAllBlogsData?.res?.data?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {getAllBlogsData?.res?.data?.data?.map((item, ind) => {
            return (
              <BlogCard
                title={item.title}
                description={item.description}
                image={
                  item?.featuredImage != null &&
                  item?.featuredImage != "" &&
                  item?.featuredImage
                }
                onEdit={() => {
                  setIsBlogEdit(true);
                  dispatch(editBlogData(item));
                }}
                onDelete={() => {
                  handleDeleteBlog(item.id);
                }}
              />
            );
          })}
        </div>
      ) : (
        <UITypography variant="p" text="No Blogs Found" />
      )}
    </div>
  );
};

export default BlogTable;
