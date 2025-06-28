import { EditPageDataConstants } from "../constants";

const initialState = {
  data: {},
};

export const EditPageDataReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case EditPageDataConstants.EDIT_PAGE_DATA_LOADING:
      return { ...state, type: "loading" };
    case EditPageDataConstants.EDIT_PAGE_DATA_SUCCESS:
      return { ...state, type: "success", data: payload };
    case EditPageDataConstants.EDIT_PAGE_DATA_ERROR:
      return { ...state, type: "error", res: payload };
    default:
      return state;
  }
};
