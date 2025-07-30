import { apiGet, apiPost } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";

import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { getAllMenus } from "@/store/actions/menus";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { slugify } from "@/utils/slugify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import SEOForm from "../Products/SEOForm";

const AddPagesModal = ({ setModalOpen }) => {
  const [menuData, setMenuData] = useState({
    pageName: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setMenuData({ ...menuData, [name]: value });
  };

  const handleAddPage = () => {
    const dataObj = {
      name: menuData.pageName,
      slug: menuData.slug,
      metaTitle: menuData.metaTitle,
      metaDescription: menuData.metaDescription,
    };
    console.log("dataObj", dataObj);
    apiPost(
      `${ApiEndpoints.content.base}${ApiEndpoints.content.create}`,
      dataObj,
      (res) => {
        console.log("res", res);
        if (res?.success) {
          toast.success(res?.message);
          setModalOpen(false);
          dispatch(getAllMenus());
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  console.log("menuData", menuData);

  return (
    <>
      <div className="flex flex-col gap-4">
        <UITypography variant="h2" text="Add Page" />
        <div className="flex flex-col gap-3">
          <UIInputField
            name="pageName"
            type="text"
            placeholder="Enter Page Name"
            isLable={true}
            lableName="Page Name"
            onChange={(e) => handleChange(e)}
          />
          <UIInputField
            name="slug"
            type="text"
            value={menuData.slug}
            placeholder="The url will be"
            isLable={true}
            lableName="URL"
            onChange={(e) => handleChange(e)}
          />
          <SEOForm
            productName={menuData.pageName}
            // shortDescription={menuData.me}
            metaTitle={menuData.metaTitle}
            metaDescription={menuData.metaDescription}
            onChange={(e) => handleChange(e)}
          />
          <UIButton
            type="contained"
            icon={false}
            title="Add"
            btnOnclick={handleAddPage}
          />
        </div>
      </div>
    </>
  );
};

export default AddPagesModal;
