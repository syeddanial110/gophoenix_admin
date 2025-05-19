import UIButton from "@/components/UIButton/UIButton";
import UIModal from "@/components/UIModal/UIModal";
import UITypography from "@/components/UITypography/UITypography";
import UsersTable from "@/containers/Customers/UsersTable";
import React from "react";

const Customers = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <UITypography variant="h3" text="Customers" />
        </div>
        <div>
          <UIButton type="contained" title="Add User" />
        </div>
      </div>
      <div>
        <UIModal modalBtnText="Click"></UIModal>
      </div>

      {/* Table */}
      <div>
        <UsersTable />
      </div>
    </>
  );
};

export default Customers;
