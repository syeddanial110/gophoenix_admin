import { ImageBaseUrl } from "@/apis/ApiRequest";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UIButton from "@/components/UIButton/UIButton";
import UIModal from "@/components/UIModal/UIModal";
import UITable from "@/components/UITable/UITable";
import UITooltip from "@/components/UITooltip/UITooltip";
import UITypography from "@/components/UITypography/UITypography";
import { getAllProducts } from "@/store/actions/products";
import { PencilLine, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductTable = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const allProducts = useSelector((state) => state?.GetAllProductsReducer?.res);

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleCategoryDelete = (row) => {};

  const columns = [
    {
      name: <UITypography text="Product Name" />,
      selector: (row) => row?.productName,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.productName} />;
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
      name: <UITypography text={"Description"} />,
      selector: (row) => row?.description,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.description} />;
      },
    },
    {
      name: <UITypography text={"Category Name"} />,
      selector: (row) => row?.categoryName,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.categoryName} />;
      },
    },
    {
      name: <UITypography text={"Sub Category Name"} />,
      selector: (row) => row?.subCategoryName,
      sortable: true,
      cell: (row) => {
        return (
          <UITypography
            text={row?.subCategoryName == null ? "-" : row?.subCategoryName}
          />
        );
      },
    },
    {
      name: <UITypography text={"Price"} />,
      selector: (row) => row?.price,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.price} />;
      },
    },
    {
      name: <UITypography text={"Payment Type"} />,
      selector: (row) => row?.paymentType,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.paymentType} />;
      },
    },
    {
      name: <UITypography text="Image" />,
      selector: (row) => row?.image,
      sortable: true,
      cell: (row) => {
        return (
          <UITooltip>
            <TooltipTrigger>
              <Image
                src={`${ImageBaseUrl}${row?.image}`}
                alt={row?.image}
                width={40}
                height={40}
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="">
                <Image
                  src={`${ImageBaseUrl}${row?.image}`}
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
            modalHeaderTitle="Edit Category"
          >
            {/* <EditCategoryDataForm setModalOpen={setModalOpen} /> */}
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
    dispatch(getAllProducts());
  }, []);

  console.log("allProducts", allProducts);

  return (
    <UITable
      columns={columns}
      data={
        allProducts?.res &&
        allProducts?.res?.data?.data?.length > 0 &&
        allProducts?.res?.data?.data
      }
      pagination={true}
      // progressPending={true}
      // noDataComponent={LinearIndeterminate}
    />
  );
};

export default ProductTable;
