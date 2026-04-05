"use client";
import { apiGetFile } from "@/apis/ApiRequest";
import UIButton from "@/components/UIButton/UIButton";
import UIModal from "@/components/UIModal/UIModal";
import UITypography from "@/components/UITypography/UITypography";
import OrderTable from "@/containers/Orders/OrderTable";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import React from "react";

const Users = () => {
    const handleDownloadUserSheet = () => {
    apiGetFile(
      `${ApiEndpoints.orders.base}${ApiEndpoints.orders.downloadExcel}`,
      (blob, response) => {
        try {
          const contentDisposition = response?.headers?.["content-disposition"] || response?.headers?.["Content-Disposition"];
          let fileName = "orders.xlsx";
          if (contentDisposition) {
            const match = /filename\*=UTF-8''(.+)$/.exec(contentDisposition) || /filename="?([^";]+)"?/.exec(contentDisposition);
            if (match && match[1]) fileName = decodeURIComponent(match[1]);
          }
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } catch (e) {
          console.error(e);
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Orders" />
           <UIButton
            type="contained"
            icon={false}
            title="Download Sheet"
            btnOnclick={handleDownloadUserSheet}
          />
        {/* <UIButton type="contained" icon={false} title="Add Category" /> */}
        {/* <UIModal
          open={modalOpen}
          onOpenChange={handleModalOpen}
          modalBtnText="Add Menu"
          btnClassName="bg-main text-white px-7 py-2 rounded-2xl hover:cursor-pointer"
        >
          <UpdateUserPassword setModalOpen={setModalOpen} />
        </UIModal> */}
      </div>
      <OrderTable />
    </>
  );
};

export default Users;
