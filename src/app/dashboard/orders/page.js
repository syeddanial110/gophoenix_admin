"use client";
import UIModal from "@/components/UIModal/UIModal";
import UITypography from "@/components/UITypography/UITypography";
import OrderTable from "@/containers/Orders/OrderTable";
import React from "react";

const Users = () => {
  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Orders" />
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
