"use client";
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
import EditCategoryDataForm from "./EditCategoryDataForm";
import UITooltip from "@/components/UITooltip/UITooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UIButton from "@/components/UIButton/UIButton";
import { toast } from "sonner";
import UIPopover from "@/components/UIPopover/UIPopover";
import CollectionDragableTable from "@/components/UITable/CollectionDragableTable";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const categoryDataReducer = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res
  );
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleCategoryDelete = (row) => {
    apiDelete(
      `${ApiEndpoints.categories.base}${ApiEndpoints.categories.delete}/${row?.id}`,
      (res) => {
        console.log("res", res);
        toast.success(res?.message);
        dispatch(getAllCategories());
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  console.log("categoryDataReducer", categoryDataReducer);
  const columns1 = [
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
      name: <UITypography text="Image" />,
      selector: (row) => row?.image,
      sortable: true,
      cell: (row) => {
        return (
          <Image
            src={`${row?.image != null ? row?.image : ""}`}
            alt={row?.image}
            width={40}
            height={1080}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        );
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
            modalHeaderTitle="Edit Collection"
          >
            <EditCategoryDataForm setModalOpen={setModalOpen} />
          </UIModal>
          <UIPopover
            title="Are you sure you want to delete this collection?"
            btnTrigger={<Trash />}
            onBtnClick={() => handleCategoryDelete(row)}
          ></UIPopover>
          {/* <UITooltip>
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
          </UITooltip> */}
        </>
      ),
    },
  ];

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
      field: "image",
      label: "Image",
    },
    {
      field: "image",
      label: "",
    },
  ];

  const handleEditClick = (row) => {
    dispatch(editCategoryData(row));
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  const LinearIndeterminate = () => {
    return <Spinner />;
  };

  useEffect(() => {
    if (
      categoryDataReducer?.res &&
      categoryDataReducer?.res?.data?.length > 0
    ) {
      setRows(categoryDataReducer?.res?.data);
    }
  }, [categoryDataReducer]);

  return (
    <>
      {/* <UITable
        columns={columns}
        data={
          categoryDataReducer?.res && categoryDataReducer?.res?.data?.length > 0
            ? categoryDataReducer?.res?.data
            : []
        }
        pagination={true}
        // progressPending={true}
        // noDataComponent={LinearIndeterminate}
      /> */}
      <CollectionDragableTable
        columns={columns}
        rows={rows}
        setRows={setRows}
        handleDeleteClick={handleCategoryDelete}
        handleEditClick={handleEditClick}
      />
    </>
  );
};

export default CategoryTable;
