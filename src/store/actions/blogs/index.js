import { apiGet } from "@/apis/ApiRequest";
import { EditBlogDataConstants, GetAllBlogsConstants } from "@/store/constants";
import { ApiEndpoints } from "@/utils/ApiEndpoints";

export const getAllBlogs = () => (dispatch) => {
  dispatch({ type: GetAllBlogsConstants.GET_ALL_BLOGS_LOADING });
  apiGet(
    `${ApiEndpoints.blogs.base}${ApiEndpoints.blogs.getAll}`,
    (res) => {
      dispatch({
        type: GetAllBlogsConstants.GET_ALL_BLOGS_SUCCESS,
        payload: { res },
      });
    },
    (err) => {
      dispatch({
        type: GetAllBlogsConstants.GET_ALL_BLOGS_ERROR,
      });
    }
  );
};

export const editBlogData = (data) => (dispatch) => {
  dispatch({
    type: EditBlogDataConstants.EDIT_BLOG_DATA_SUCCESS,
    payload: { data },
  });
};
