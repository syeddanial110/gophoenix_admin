import { apiDelete, apiGet, ImageBaseUrl } from "@/apis/ApiRequest";
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

const PagesTable = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const menuDataReducer = useSelector(
    (state) => state?.GetAllMenusReducer?.res
  );
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleCategoryDelete = (row) => {
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
      name: <UITypography text="Name" />,
      selector: (row) => row?.name,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.name} />;
      },
    },
    {
      name: <UITypography text={"URL"} />,
      selector: (row) => row?.slug,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.slug} />;
      },
    },
    {
      name: <UITypography text="" />,

      style: {
        display: "flex",
        justifyContent: "flex-end",
      },
      cell: (row) => (
        <>
          <UIModal
            onOpenChange={handleModalOpen}
            open={modalOpen}
            modalBtnText={<PencilLine />}
            btnClassName="hover:cursor-pointer"
            btnTriggerOnClick={() => handleEditClick(row)}
            modalHeaderTitle="Edit Page"
          >
            <EditPageModal setModalOpen={setModalOpen} />
          </UIModal>
          <UITooltip>
            <TooltipTrigger open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <Trash />
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-2">
                <UITypography text="Are you sure you want to delete this category?" />
                <div className="flex items-center gap-2">
                  <UIButton
                    type="contained"
                    icon={false}
                    title="Yes"
                    btnOnclick={() => handleCategoryDelete(row)}
                  />
                </div>
              </div>
            </TooltipContent>
          </UITooltip>
        </>
      ),
    },
  ];

  const handleEditClick = (row) => {
    console.log('row', row)
    dispatch(editPageData(row));
  };

  useEffect(() => {
    dispatch(getAllMenus());
  }, []);

  const LinearIndeterminate = () => {
    return <Spinner />;
  };

  console.log("menuDataReducer///////////", menuDataReducer);

  return (
    <UITable
      columns={columns}
      data={
        menuDataReducer?.success && menuDataReducer?.data?.length > 0
          ? menuDataReducer?.data
          : []
      }
      pagination={true}
      // progressPending={true}
      // noDataComponent={LinearIndeterminate}
    />
  );
};

export default PagesTable;
