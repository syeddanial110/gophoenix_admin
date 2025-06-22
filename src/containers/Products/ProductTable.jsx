import { apiDelete, ImageBaseUrl } from "@/apis/ApiRequest";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UIButton from "@/components/UIButton/UIButton";
import UIModal from "@/components/UIModal/UIModal";
import UIPopover from "@/components/UIPopover/UIPopover";
import UITable from "@/components/UITable/UITable";
import UITooltip from "@/components/UITooltip/UITooltip";
import UITypography from "@/components/UITypography/UITypography";
import { editProductData, getAllProducts } from "@/store/actions/products";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { PencilLine, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const ProductTable = ({ setIsProductEdit, setIsProductAdd }) => {
  const dispatch = useDispatch();
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const allProducts = useSelector((state) => state?.GetAllProductsReducer?.res);

  const handleEditClick = (row) => {
    setIsProductEdit(true);
    setIsProductAdd(false);
    dispatch(editProductData({ productId: row?.id }));
  };

  const handleProductDelete = (row) => {
    apiDelete(
      `${ApiEndpoints.products.base}${ApiEndpoints.products.delete}/${row.id}`,
      (res) => {
        toast.success(res?.message);
        dispatch(getAllProducts({ page: 1 }));
      },
      (err) => {
        toast.error(err?.message);
      }
    );
  };

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
    // {
    //   name: <UITypography text={"Description"} />,
    //   selector: (row) => row?.description,
    //   sortable: true,
    //   cell: (row) => {
    //     return <UITypography text={row?.description} />;
    //   },
    // },
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
          <>
            {row?.image !== null ? (
              <UITooltip>
                <TooltipTrigger>
                  <Image
                    src={`${row?.image}`}
                    alt={row?.image}
                    width={40}
                    height={40}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="">
                    <Image
                      src={`${row?.image}`}
                      alt={row?.image}
                      width={100}
                      height={100}
                    />
                  </div>
                </TooltipContent>
              </UITooltip>
            ) : (
              <></>
            )}
          </>
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
          <button
            onClick={() => handleEditClick(row)}
            className="hover:cursor-pointer"
          >
            <PencilLine />
          </button>

          <UIPopover
            btnTrigger={<Trash />}
            onBtnClick={() => handleProductDelete(row)}
          ></UIPopover>
        </>
      ),
    },
  ];

  const handlePageChange = (page) => {
    const data = {
      page: page,
    };
    dispatch(getAllProducts(data));
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    const data = {
      page: page,
    };
    dispatch(getAllProducts(data));

    setPerPage(newPerPage);
  };

  useEffect(() => {
    const data = {
      page: 1,
    };
    dispatch(getAllProducts(data));
  }, []);

  useEffect(() => {
    setTotalRows(allProducts?.res?.data?.pagination.totalItems);
  }, [allProducts?.res?.success]);

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
      paginationServer
      paginationTotalRows={totalRows}
      onChangeRowsPerPage={handlePerRowsChange}
      onChangePage={handlePageChange}
      // progressPending={true}
      // noDataComponent={LinearIndeterminate}
    />
  );
};

export default ProductTable;
