import { GetAllMenusConstants } from "../constants";

const initialState = {
  data: [],
};

export const GetAllMenusReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GetAllMenusConstants.GET_ALL_MENUS_LOADING:
      return { ...state, type: "loading" };
    case GetAllMenusConstants.GET_ALL_MENUS_SUCCESS:
      return { ...state, type: "success", res: payload };
    case GetAllMenusConstants.GET_ALL_MENUS_ERROR:
      return { ...state, type: "error", res: payload };
    default:
      return state;
  }
};
