import { combineReducers } from "redux";
import { SignInReducer } from "./signinReducer";
import { EditCategoryDataReducer } from "./editCategoryDataReducer";
import { GetAllCategoriesReducer } from "./getAllCategoriesReducer";
import { GetAllSubCategoriesReducer } from "./getAllSubCategoriesReducer";
import { EditSubCategoryDataReducer } from "./editSubCategoryDataReducer";
import { GetAllProductsReducer } from "./getAllProductsReducer";

export default combineReducers({
  SignInReducer,
  EditCategoryDataReducer,
  GetAllCategoriesReducer,
  GetAllSubCategoriesReducer,
  EditSubCategoryDataReducer,
  GetAllProductsReducer,
});
