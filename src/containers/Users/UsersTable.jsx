import { apiDelete, apiGet, apiPut, ImageBaseUrl } from "@/apis/ApiRequest";
import { Spinner } from "@/components/ui/spinner";
import UITable from "@/components/UITable/UITable";
import UITypography from "@/components/UITypography/UITypography";
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
import UISwitch from "@/components/UISwitch/UISwitch";
import { formatDate } from "@/lib/utils";
import UIPopover from "@/components/UIPopover/UIPopover";
import { useRouter } from "next/navigation";
import { pathLocations } from "@/utils/navigation";

const UsersTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleUserDelete = (row) => {};

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
      name: <UITypography text="Name" />,
      selector: (row) => row?.firstName,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.firstName + " " + row?.lastName} />;
      },
    },
    {
      name: <UITypography text={"Email"} />,
      selector: (row) => row?.email,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.email} />;
      },
    },
    {
      name: <UITypography text={"Created At"} />,
      selector: (row) => row?.createdAt,
      sortable: true,
      cell: (row) => {
        return <UITypography text={formatDate(row?.createdAt)} />;
      },
    },
    {
      name: <UITypography text={"Active/Disable"} />,
      selector: (row) => row?.isDisabled,
      sortable: true,
      cell: (row) => {
        return (
          <UISwitch
            checked={row?.isDisabled == 0 ? false : true}
            onCheckedChange={(value) => handleOnChangeChecked(value, row?.id)}
            className="hover:cursor-pointer"
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
          <UIButton
            type=""
            icon={true}
            BtnIcon={PencilLine}
            btnOnclick={() =>
              router.push(`${pathLocations.userById}/${row?.id}`)
            }
          />
          <UIPopover
            title="Are you sure you want to delete this user?"
            btnTrigger={<Trash />}
            onBtnClick={() => handleUserDelete(row)}
          ></UIPopover>
        </>
      ),
    },
  ];

  const handleEditClick = (row) => {
    console.log("row", row);
    dispatch(editPageData(row));
  };

  const getAllUsers = (pageNumber) => {
    apiGet(
      `${ApiEndpoints.users.base}${ApiEndpoints.users.getAll}?page=${pageNumber}`,
      (res) => {
        console.log("res///// user", res);
        if (res?.success) {
          setUsersData(res?.data?.data);
          setTotalRows(res?.data?.pagination.totalItems);
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  const handlePageChange = (page) => {
    const data = {
      page: page,
    };
    getAllUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    const data = {
      page: page,
    };
    getAllUsers(page);

    setPerPage(newPerPage);
  };

  useEffect(() => {
    getAllUsers(1);
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
      paginationServer
      paginationTotalRows={totalRows}
      onChangeRowsPerPage={handlePerRowsChange}
      onChangePage={handlePageChange}
    />
  );
};

export default UsersTable;
