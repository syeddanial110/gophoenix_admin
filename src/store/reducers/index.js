import { combineReducers } from "redux";
import { SignInReducer } from "./signinReducer";
import { EditCategoryDataReducer } from "./editCategoryDataReducer";
import { GetAllCategoriesReducer } from "./getAllCategoriesReducer";

export default combineReducers({
  SignInReducer,
  EditCategoryDataReducer,
  GetAllCategoriesReducer,
});
