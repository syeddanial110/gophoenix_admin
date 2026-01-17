import { apiDelete, apiGet } from "@/apis/ApiRequest";
import { Spinner } from "@/components/ui/spinner";
import UITable from "@/components/UITable/UITable";
import UITypography from "@/components/UITypography/UITypography";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { DeleteIcon, Eye, PencilLine, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UIButton from "@/components/UIButton/UIButton";
import { toast } from "sonner";
import { editPageData, getAllMenus } from "@/store/actions/menus";
import { useRouter } from "next/navigation";
import { pathLocations } from "@/utils/navigation";

const OrderTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [usersData, setUsersData] = useState([]);

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleOnChangeChecked = (value, id) => {
    setChecked(value);
    apiGet(
      `${ApiEndpoints.users.base}${ApiEndpoints.users.disableUser}/${id}`,
      (res) => {
        console.log("User disabled successfully", res);
        if (res?.success) {
          getAllUsers(1);
          toast.success(res?.message);
        }
      },
      (err) => {
        console.error("Error disabling user", err);
      }
    );
  };

  const columns = [
    {
      name: <UITypography text="Class Name" />,
      selector: (row) => row?.items[0]?.productName,
      sortable: true,
      cell: (row) => {
        return (
          <div
            className="mt-6 prose max-w-none [&>h1]:text-[12px] [&>h1]:font-bold [&>h2]:text-[12px] [&>h2]:font-semibold [&>h3]:text-[12px] [&>h3]:font-semibold [&>h4]:text-[12px] [&>h4]:font-semibold [&>h5]:text-[12px] [&>h5]:font-semibold [&>h6]:text-[12px] [&>h6]:font-semibold [&>p]:text-[12px]"
            dangerouslySetInnerHTML={{
              __html: row?.items[0]?.productName,
            }}
          />
        );
      },
    },
    {
      name: <UITypography text="Name" />,
      selector: (row) => row?.user?.userName,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.user?.userName} />;
      },
    },
    {
      name: <UITypography text={"Email"} />,
      selector: (row) => row?.user?.email,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.user?.userName} />;
      },
    },
    {
      name: <UITypography text={"Child Name"} />,
      selector: (row) =>
        row?.items?.length > 0 && row?.items[0]?.children[0]?.childName,
      sortable: true,
      cell: (row) => {
        return (
          <UITypography
            text={
              row?.items?.length > 0 ? row?.items[0]?.children[0]?.childName : ""
            }
          />
        );
      },
    },
    {
      name: <UITypography text={"Total Amount"} />,
      selector: (row) => row?.totalAmount,
      sortable: true,
      cell: (row) => {
        return <UITypography text={`$${row?.totalAmount}`} />;
      },
    },
    {
      name: <UITypography text={"Payment Type"} />,
      selector: (row) => row?.items[0]?.paymentType,
      sortable: true,
      cell: (row) => {
        return <UITypography text={`${row?.items[0]?.paymentType}`} />;
      },
    },
    // {
    //   name: <UITypography text={"Active/Disable"} />,
    //   selector: (row) => row?.isDisabled,
    //   sortable: true,
    //   cell: (row) => {
    //     return (
    //       <UISwitch
    //         checked={row?.isDisabled == 0 ? false : true}
    //         onCheckedChange={(value) => handleOnChangeChecked(value, row?.id)}
    //         className="hover:cursor-pointer"
    //       />
    //     );
    //   },
    // },
    {
      name: <UITypography text="" />,

      style: {
        display: "flex",
        justifyContent: "flex-end",
      },
      cell: (row) => (
        <>
          <UIButton
            type=""
            icon={true}
            BtnIcon={Eye}
            btnOnclick={() =>
              router.push(`${pathLocations.orderById}/${row?.orderId}`)
            }
          />
        </>
      ),
    },
  ];

  const handleEditClick = (row) => {
    console.log("row", row);
    dispatch(editPageData(row));
  };

  const getAllOrders = () => {
    apiGet(
      `${ApiEndpoints.orders.base}${ApiEndpoints.orders.getAll}`,
      (res) => {
        console.log("res///// orders", res);
        if (res?.success) {
          setUsersData(res?.data);
          // setTotalRows(res?.data?.pagination.totalItems);
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  // const handlePageChange = (page) => {
  //   const data = {
  //     page: page,
  //   };
  //   getAllUsers(page);
  // };

  // const handlePerRowsChange = async (newPerPage, page) => {
  //   const data = {
  //     page: page,
  //   };
  //   getAllUsers(page);

  //   setPerPage(newPerPage);
  // };

  useEffect(() => {
    getAllOrders();
  }, []);

  const LinearIndeterminate = () => {
    return <Spinner />;
  };

  console.log("checked", checked);
  return (
    <UITable
      columns={columns}
      data={usersData?.length > 0 ? usersData : []}
      pagination={true}
    />
  );
};

export default OrderTable;
