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

const AddPagesModal = ({ setModalOpen }) => {
  const [menuData, setMenuData] = useState({
    pageName: "",
    slug: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { value, name } = e.target;
    const slug = slugify(value);
    setMenuData({ ...menuData, [name]: value, slug: slug });
  };

  const handleAddPage = () => {
    const dataObj = {
      name: menuData.pageName,
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
            onChange={handleChange}
          />
          <UIInputField
            name="slug"
            type="text"
            value={menuData.slug}
            placeholder="The url will be"
            isLable={true}
            lableName="URL"
            disabled
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
