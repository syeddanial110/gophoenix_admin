import { apiDelete, apiGet, apiPut, ImageBaseUrl } from "@/apis/ApiRequest";
import { Spinner } from "@/components/ui/spinner";
import UIModal from "@/components/UIModal/UIModal";
import UITable from "@/components/UITable/UITable";
import UITypography from "@/components/UITypography/UITypography";
import { editCategoryData, getAllCategories } from "@/store/actions/category";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { DeleteIcon, PencilLine, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UITooltip from "@/components/UITooltip/UITooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UIButton from "@/components/UIButton/UIButton";
import { toast } from "sonner";
import { editPageData, getAllMenus } from "@/store/actions/menus";
import EditCategoryDataForm from "../Category/EditCategoryDataForm";
import EditPageModal from "./EditPageModal";
import UISwitch from "@/components/UISwitch/UISwitch";
import MenuDragableTable from "./MenuDragableTable";

const PagesTable = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [rows, setRows] = useState([]);

  const menuDataReducer = useSelector(
    (state) => state?.GetAllMenusReducer?.res
  );
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleOnChangeChecked = (value, id) => {
    console.log("value", value);
    apiPut(
      `${ApiEndpoints.content.base}${ApiEndpoints.content.updateToggle}/${id}`,
      {},
      (res) => {
        dispatch(getAllMenus());
        toast.success("Status Update Successfully");
        console.log("res", res);
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  const handlePageDelete = (row) => {
    apiDelete(
      `${ApiEndpoints.content.base}${ApiEndpoints.content.delete}/${row?.id}`,
      (res) => {
        console.log("res", res);
        toast.success(res?.message);
        dispatch(getAllMenus());
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  const columns = [
    {
      field: "name",
      label: "Name",
    },
    {
      field: "url",
      label: "URL",
    },
    {
      field: "active",
      label: "Active/InActive",
    },
    {
      field: "",
      label: "",
    },
  ];

  const handleEditClick = (row) => {
    console.log("row", row);
    dispatch(editPageData(row));
  };

  useEffect(() => {
    dispatch(getAllMenus());
  }, []);

  useEffect(() => {
    if (menuDataReducer?.success && menuDataReducer?.data?.length > 0) {
      setRows(menuDataReducer?.data);
    }
  }, [menuDataReducer]);

  const LinearIndeterminate = () => {
    return <Spinner />;
  };

  console.log("menuDataReducer///////////", menuDataReducer);
  console.log("checked", checked);
  return (
    <>
      {/* <UITable
        columns={columns}
        data={
          menuDataReducer?.success && menuDataReducer?.data?.length > 0
            ? menuDataReducer?.data
            : []
        }
        pagination={true}
        // progressPending={true}
        // noDataComponent={LinearIndeterminate}
      /> */}
      <MenuDragableTable
        columns={columns}
        rows={rows}
        setRows={setRows}
        handleDeleteClick={handlePageDelete}
        handleEditClick={handleEditClick}
      />
    </>
  );
};

export default PagesTable;
