"use client";
import React from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

const UITable = (props) => {
  const { columns, data, selectableRows } = props;

  const customStyles = {
    headRow: {
      style: {
        padding: 0,
        backgroundColor: "white !important",
        borderBottomWidth: "0.5px",
        borderBottomStyle: "solid",
        borderBottomColor: "#A4A4A4",
      },
    },
    headCells: {
      style: {
        padding: 0,
        color: "black !important",
        display: "flex",
        justifyContent: "flex-start",
        backgroundColor: "transparent !important",
        "&:nth-child(1)": { paddingLeft: "8px" },
      },
    },
    cells: {
      style: {
        padding: "10px !important",
        display: "flex",
        fontSize: "15px",
        height: "80px",
        overflowY: "hidden",
        // justifyContent: "flex-start",
        "&:nth-child(1)": { paddingLeft: "8px" },
       
      },
    },
    rows: {
      style: {
        backgroundColor: "white !important",
        color: "black !important",
        padding: "10px 0px",
         borderBottomWidth: "0.5px",
        borderBottomStyle: "solid",
        borderBottomColor: "#A4A4A4",
        "&:nth-child": {
          borderTop: "1px solid rgba(0, 0, 0, .12)",
          marginTop: "8px",
        },
      },
    },
    table: {
      style: {
        borderRadius: "10px",
        padding: "10px",
        backgroundColor: "white !important",
      },
    },
    pagination: {
      style: {
        border: "none",
        backgroundColor: "transparent !important",
        color: "#0D0D0D !important",
        "& > .sc-brSOsn > button > svg": {
          fill: "#0D0D0D !important",
        },
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      selectableRows={selectableRows}
      customStyles={customStyles}
      draggable
      {...props}
    />
  );
};

export default UITable;
