import { combineReducers } from "redux";
import { SignInReducer } from "./signinReducer";
import { EditCategoryDataReducer } from "./editCategoryDataReducer";
import { GetAllCategoriesReducer } from "./getAllCategoriesReducer";
import { GetAllSubCategoriesReducer } from "./getAllSubCategoriesReducer";
import { EditSubCategoryDataReducer } from "./editSubCategoryDataReducer";
import { GetAllProductsReducer } from "./getAllProductsReducer";
import { EditProductDataReducer } from "./editProductDataReducer";
import { GetAllMenusReducer } from "./getAllMenusReducer";
import { EditPageDataReducer } from "./editPageDataReducer";

export default combineReducers({
  SignInReducer,
  EditCategoryDataReducer,
  GetAllCategoriesReducer,
  GetAllSubCategoriesReducer,
  EditSubCategoryDataReducer,
  GetAllProductsReducer,
  EditProductDataReducer,
  GetAllMenusReducer,
  EditPageDataReducer,
});
