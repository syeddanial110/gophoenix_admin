"use client";
import { apiGet } from "@/apis/ApiRequest";
import { Spinner } from "@/components/ui/spinner";
import UITable from "@/components/UITable/UITable";
import UITypography from "@/components/UITypography/UITypography";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { DeleteIcon, Trash } from "lucide-react";
import React, { useEffect } from "react";

const SubCategoryTable = () => {
  const columns = [
    {
      name: <UITypography text="Name" />,
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.name} />;
      },
    },
    {
      name: <UITypography text={"Email"} />,
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row?.email} />;
      },
    },
    {
      name: <UITypography text="Phone Number" />,
      selector: (row) => row.phoneNumber,
      sortable: true,
      cell: (row) => {
        return <UITypography text={row.phoneNumber} />;
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
          <Trash />
        </>
      ),
    },
  ];
  const data = [
    {
      id: "2204 86 3M121 3k",
      name: "Beetlejuice",
      plan: "1988",
      elapsedTime: "15 days",
      planProgress: "24 % completed",
    },
    {
      id: "2204 86 3M131 3k",
      name: "Beetlejuice",
      plan: "1988",
      elapsedTime: "15 days",
      planProgress: "24 % completed",
    },
    {
      id: "2204286 3M11 3k",
      name: "Beetlejuice",
      plan: "1988",
      elapsedTime: "15 days",
      planProgress: "24 % completed",
    },
    {
      id: "2204 86 33M11 3k",
      name: "Beetlejuice",
      plan: "1988",
      elapsedTime: "15 days",
      planProgress: "24 % completed",
    },
  ];

  const getAllCategory = () => {
    apiGet(
      `${ApiEndpoints.categories.base}${ApiEndpoints.categories.getAll}`,
      (res) => {
        console.log("res", res);
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const LinearIndeterminate = () => {
    return <Spinner />;
  };
  return (
    <UITable
      columns={columns}
      data={data}
      pagination={true}
      // progressPending={true}
      noDataComponent={LinearIndeterminate}
    />
  );
};

export default SubCategoryTable;
