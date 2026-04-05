"use client";
import { apiGet, apiGetFile } from "@/apis/ApiRequest";
import UIButton from "@/components/UIButton/UIButton";
import UIModal from "@/components/UIModal/UIModal";
import UITypography from "@/components/UITypography/UITypography";
import UsersTable from "@/containers/Users/UsersTable";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { Download } from "lucide-react";
import React from "react";

const Users = () => {
  const handleDownloadUserSheet = () => {
    apiGetFile(
      `${ApiEndpoints.users.base}${ApiEndpoints.users.downloadExcel}`,
      (blob, response) => {
        try {
          const contentDisposition = response?.headers?.["content-disposition"] || response?.headers?.["Content-Disposition"];
          let fileName = "users.xlsx";
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
      <div className="flex justify-between">
        <div className="w-50">
          <UITypography variant="h2" text="Users" />
        </div>
        <div className="w-50">
          <UIButton
            type="contained"
            icon={false}
            BtnIcon={Download}
            title="Download Sheet"
            btnOnclick={handleDownloadUserSheet}
          />
        </div>
        {/* <UIModal
          open={modalOpen}
          onOpenChange={handleModalOpen}
          modalBtnText="Add Menu"
          btnClassName="bg-main text-white px-7 py-2 rounded-2xl hover:cursor-pointer"
        >
          <UpdateUserPassword setModalOpen={setModalOpen} />
        </UIModal> */}
      </div>
      <UsersTable />
    </>
  );
};

export default Users;
