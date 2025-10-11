import { GetAllBlogsConstants } from "../constants";

const initialState = {
  data: {},
};

export const GetAllBlogsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GetAllBlogsConstants.GET_ALL_BLOGS_LOADING:
      return { ...state, type: "loading" };
    case GetAllBlogsConstants.GET_ALL_BLOGS_SUCCESS:
      return { ...state, type: "success", data: payload };
    case GetAllBlogsConstants.GET_ALL_BLOGS_ERROR:
      return { ...state, type: "error", res: payload };
    default:
      return state;
  }
};
