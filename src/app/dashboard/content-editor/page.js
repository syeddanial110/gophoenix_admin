"use client";
import { apiPut } from "@/apis/ApiRequest";
import UISelect from "@/components/InputFields/UISelect";
import { SelectItem } from "@/components/ui/select";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import Editor from "@/containers/ContentEditor/Editor";
import { getAllMenus } from "@/store/actions/menus";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const ContentEditor = () => {
  const dispatch = useDispatch();
  const menuDataReducer = useSelector(
    (state) => state?.GetAllMenusReducer?.res
  );

  const [selectedPage, setSelectedPage] = useState("");
  const [content, setContent] = useState("");

  const handleSelectChange = (value) => {
    console.log("value", value);
    const menu = menuDataReducer?.data?.find(
      (item) => String(item.id) === String(value)
    );
    setSelectedPage(menu);
    console.log("Selected menu:", menu);
  };

  const handleSaveContent = () => {
    const dataObj = {
      name: selectedPage?.name,
      content: content,
    };
    apiPut(
      `${ApiEndpoints.content.base}${ApiEndpoints.content.update}/${selectedPage.id}`,
      dataObj,
      (res) => {
        console.log("res", res);
        if (res?.success) {
          toast.success(res?.message);
          dispatch(getAllMenus());
          setContent("");
          setSelectedPage("");
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  useEffect(() => {
    dispatch(getAllMenus());
  }, []);

  useEffect(() => {
    if (
      selectedPage &&
      selectedPage.content !== null &&
      selectedPage.content !== undefined
    ) {
      setContent(selectedPage.content);
    } else {
      setContent("");
    }
  }, [selectedPage]);

  console.log("menuDataReducer", menuDataReducer);
  console.log("selectedPage", selectedPage);
  console.log("content", content);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <UITypography variant="h2" text="Content Editor" />
          </div>
          <div>
            <UISelect
              name="categoryId"
              placeholder="Select Category"
              value={selectedPage?.id || ""}
              onValueChange={handleSelectChange}
            >
              {menuDataReducer?.data &&
                menuDataReducer?.data.length > 0 &&
                menuDataReducer?.data?.map((item, i) => (
                  <SelectItem key={i} value={item?.id}>
                    {item?.name}
                  </SelectItem>
                ))}
            </UISelect>
          </div>
        </div>
        <Editor
          key={selectedPage?.id || "new"}
          editorValue={content}
          setEditroValue={setContent}
        />
        <div>
          <UIButton
            type="contained"
            icon={false}
            title="Save"
            btnOnclick={handleSaveContent}
          />
        </div>
      </div>
    </>
  );
};

export default ContentEditor;
