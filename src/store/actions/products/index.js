import { apiGet } from "@/apis/ApiRequest";
import {
  EditCategoryDataConstants,
  EditProductsConstants,
  GetAllCategoriesConstants,
  GetAllProductsConstants,
} from "@/store/constants";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { toast } from "sonner";

export const editProductData = (data) => (dispatch) => {
  dispatch({
    type: EditProductsConstants.EDIT_PRODUCTS_DATA_SUCCESS,
    payload: { data },
  });
};

export const getAllProducts = (data) => (dispatch) => {
  dispatch({ type: GetAllProductsConstants.GET_ALL_PRODUCTS_LOADING });
  apiGet(
    `${ApiEndpoints.products.base}${ApiEndpoints.products.getAll}/?page=${data?.page}`,
    (res) => {
      dispatch({
        type: GetAllProductsConstants.GET_ALL_PRODUCTS_SUCCESS,
        payload: { res },
      });
    },
    (err) => {
      dispatch({
        type: GetAllProductsConstants.GET_ALL_PRODUCTS_ERROR,
      });
      toast.error(err?.message);
    }
  );
};
