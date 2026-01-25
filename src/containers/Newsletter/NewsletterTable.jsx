"use client";
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

const NewsletterTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [usersData, setUsersData] = useState([]);



  const columns = [
    
    {
      name: <UITypography text="Email" />,
      selector: (row) => row?.email,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.email} />;
      },
    },
    {
      name: <UITypography text={"Subscribed"} />,
      selector: (row) => row?.isSubscribed,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.isSubscribed ? "Yes" : "No"} />;
      },
    },
    
  ];

 

  const getAllSubscribedUsers = () => {
    apiGet(
      `${ApiEndpoints.newsletter.base}${ApiEndpoints.newsletter.getAll}`,
      (res) => {
        console.log("res///// newsletter", res);
        if (res?.success) {
          setUsersData(res?.data);
          // setTotalRows(res?.data?.pagination.totalItems);
        }
      },
      (err) => {
        console.log("err", err);
      },
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
    getAllSubscribedUsers();
  }, []);

  const LinearIndeterminate = () => {
    return <Spinner />;
  };

  return (
    <UITable
      columns={columns}
      data={usersData?.length > 0 ? usersData : []}
      pagination={true}
    />
  );
};

export default NewsletterTable;
