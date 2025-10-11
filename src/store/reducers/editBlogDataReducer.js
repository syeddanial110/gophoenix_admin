import {
    EditBlogDataConstants,
  EditCategoryDataConstants,
  EditProductsConstants,
  SignInConstants,
} from "../constants";

const initialState = {
  data: {},
};

export const EditBlogDataReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case EditBlogDataConstants.EDIT_BLOG_DATA_LOADING:
      return { ...state, type: "loading" };
    case EditBlogDataConstants.EDIT_BLOG_DATA_SUCCESS:
      return { ...state, type: "success", data: payload };
    case EditBlogDataConstants.EDIT_BLOG_DATA_ERROR:
      return { ...state, type: "error" };
    default:
      return state;
  }
};
