import { apiGet } from "@/apis/ApiRequest";
import { EditPageDataConstants, GetAllMenusConstants } from "@/store/constants";
import { ApiEndpoints } from "@/utils/ApiEndpoints";

export const getAllMenus = () => (dispatch) => {
  dispatch({ type: GetAllMenusConstants.GET_ALL_MENUS_LOADING });
  apiGet(
    `${ApiEndpoints.content.base}${ApiEndpoints.content.getAll}`,
    (res) => {
      dispatch({
        type: GetAllMenusConstants.GET_ALL_MENUS_SUCCESS,
        payload: res,
      });
    },
    (err) => {
      dispatch({
        type: GetAllMenusConstants.GET_ALL_MENUS_ERROR,
      });
    }
  );
};

export const editPageData = (data) => (dispatch) => {
  dispatch({
    type: EditPageDataConstants.EDIT_PAGE_DATA_SUCCESS,
    payload: { data },
  });
};
