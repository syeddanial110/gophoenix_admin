import { apiDelete, ImageBaseUrl } from "@/apis/ApiRequest";
import UIInputField from "@/components/InputFields/UIInputField";
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
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { apiGet } from "@/apis/ApiRequest";

const ProductTable = ({ setIsProductEdit, setIsProductAdd }) => {
  const dispatch = useDispatch();
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProductsList, setAllProductsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const allProducts = useSelector((state) => state?.GetAllProductsReducer?.res);

  // Fetch all products
  const fetchAllProducts = () => {
    apiGet(
      `${ApiEndpoints.products.base}${ApiEndpoints.products.getAll}/?page=1&limit=10000`,
      (res) => {
        if (res?.data?.data) {
          setAllProductsList(res?.data?.data);
          setTotalRows(res?.data?.data?.length);
        }
      },
      (err) => {
        toast.error("Failed to fetch products");
      }
    );
  };

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
        fetchAllProducts();
      },
      (err) => {
        toast.error(err?.message);
      },
    );
  };

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return allProductsList;
    }

    const query = searchQuery.toLowerCase();
    return allProductsList.filter((product) => {
      const productName = product?.productName?.toLowerCase() || "";
      const categoryName = product?.categoryName?.toLowerCase() || "";
      return productName.includes(query) || categoryName.includes(query);
    });
  }, [allProductsList, searchQuery]);

  const columns = [
    {
      name: <UITypography text="Class Name" />,
      selector: (row) => row?.productName,
      sortable: true,
      cell: (row) => {
        return (
          <div
            className="mt-6 prose max-w-none [&>h1]:text-[12px] [&>h1]:font-bold [&>h2]:text-[12px] [&>h2]:font-semibold [&>h3]:text-[12px] [&>h3]:font-semibold [&>h4]:text-[12px] [&>h4]:font-semibold [&>h5]:text-[12px] [&>h5]:font-semibold [&>h6]:text-[12px] [&>h6]:font-semibold [&>p]:text-[12px]"
            dangerouslySetInnerHTML={{ __html: row?.productName }}
          />
        );
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
      name: <UITypography text={"Collection Name"} />,
      selector: (row) => row?.categoryName,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.categoryName} />;
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
            title="Are you sure you want to delete this product?"
            btnTrigger={<Trash />}
            onBtnClick={() => handleProductDelete(row)}
          ></UIPopover>
        </>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  console.log("filteredProducts", filteredProducts);

  return (
    <div>
      <div className="pt-4">
        <UIInputField
          isLable={true}
          lableName="Search"
          name="search"
          onChange={handleSearch}
          value={searchQuery}
        />
      </div>
      <UITable
        columns={columns}
        data={
          Array.isArray(filteredProducts) && filteredProducts.length > 0
            ? filteredProducts
            : []
        }
        pagination={true}
        paginationServer={false}
        paginationTotalRows={
          Array.isArray(filteredProducts) ? filteredProducts.length : 0
        }
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />
    </div>
  );
};

export default ProductTable;