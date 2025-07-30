"use client";
import { apiDelete, apiGet, ImageBaseUrl } from "@/apis/ApiRequest";
import { Spinner } from "@/components/ui/spinner";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UIModal from "@/components/UIModal/UIModal";
import UITable from "@/components/UITable/UITable";
import UITooltip from "@/components/UITooltip/UITooltip";
import UITypography from "@/components/UITypography/UITypography";
import {
  editSubCategoryData,
  getAllSubCategories,
} from "@/store/actions/subCategory";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { DeleteIcon, PencilLine, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditSubCategoryDataForm from "./EditSubCategoryDataForm";
import UIButton from "@/components/UIButton/UIButton";
import { toast } from "sonner";
import { getAllCategories } from "@/store/actions/category";

const SubCategoryTable = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const subCategoryDataReducer = useSelector(
    (state) => state?.GetAllSubCategoriesReducer?.res
  );

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleCategoryDelete = (row) => {
    apiDelete(
      `${ApiEndpoints.subCategory.base}${ApiEndpoints.categories.delete}/${row?.id}`,
      (res) => {
        toast.success(res?.message);
        dispatch(getAllSubCategories());
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  const handleEditClick = (row) => {
    dispatch(editSubCategoryData(row));
  };

  const columns = [
    {
      name: <UITypography text="Class Group Name" />,
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.name} />;
      },
    },
    {
      name: <UITypography text="Collection Name" />,
      selector: (row) => row.categoryName,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.categoryName} />;
      },
    },
    {
      name: <UITypography text="URL" />,
      selector: (row) => row.slug,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row.slug} />;
      },
    },
    {
      name: <UITypography text="Image" />,
      selector: (row) => row?.image,
      sortable: true,
      cell: (row) => {
        const imageSrc =
          row?.image &&
          (row.image.startsWith("http") || row.image.startsWith("/"))
            ? row.image
            : "/default-image.png";
        return (
          <UITooltip>
            <TooltipTrigger>
              <Image src={imageSrc} alt={imageSrc} width={40} height={40} />
            </TooltipTrigger>
            <TooltipContent>
              <div className="">
                <Image
                  src={`${row?.image != null ? row?.image : ""}`}
                  alt={row?.image}
                  width={100}
                  height={100}
                />
              </div>
            </TooltipContent>
          </UITooltip>
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
            modalHeaderTitle="Edit Class Group"
          >
            <EditSubCategoryDataForm setModalOpen={setModalOpen} />
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

  useEffect(() => {
    dispatch(getAllSubCategories());
  }, []);

  const LinearIndeterminate = () => {
    return <Spinner />;
  };

  console.log("subCategoryDataReducer", subCategoryDataReducer);

  return (
    <UITable
      columns={columns}
      data={
        subCategoryDataReducer?.res &&
        subCategoryDataReducer?.res?.data?.length > 0
          ? subCategoryDataReducer?.res?.data
          : []
      }
      pagination={true}
      // progressPending={true}
      // noDataComponent={LinearIndeterminate}
    />
  );
};

export default SubCategoryTable;
