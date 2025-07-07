import { apiGet, apiPost, apiPut } from "@/apis/ApiRequest";
import UIFileInput from "@/components/InputFields/UIFileInput";
import UIInputField from "@/components/InputFields/UIInputField";

import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { getAllCategories } from "@/store/actions/category";
import { getAllMenus } from "@/store/actions/menus";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { slugify } from "@/utils/slugify";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const EditPageModal = ({ setModalOpen }) => {
  const menuDataReducer = useSelector((state) => state?.EditPageDataReducer);

  const [menuData, setMenuData] = useState({
    id: "",
    pageName: "",
    slug: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { value, name } = e.target;
    const slug = slugify(value);
    setMenuData({ ...menuData, [name]: value, slug: slug });
  };

  const handleEditPage = () => {
    const dataObj = {
      name: menuData.pageName,
      content: menuDataReducer?.data?.data?.content,
    };
    console.log("dataObj", dataObj);
    apiPut(
      `${ApiEndpoints.content.base}${ApiEndpoints.content.update}/${menuData.id}`,
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

  useEffect(() => {
    if (menuDataReducer?.data?.data) {
      setMenuData({
        id: menuDataReducer?.data?.data?.id,
        pageName: menuDataReducer?.data?.data?.name,
        slug: menuDataReducer?.data?.data?.slug,
      });
    }
  }, []);

  console.log("menuDataReducer editttt", menuDataReducer);
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 mt-5">
          <UIInputField
            name="pageName"
            type="text"
            placeholder="Enter Page Name"
            isLable={true}
            lableName="Page Name"
            value={menuData.pageName}
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
            title="Update"
            btnOnclick={handleEditPage}
          />
        </div>
      </div>
    </>
  );
};

export default EditPageModal;
