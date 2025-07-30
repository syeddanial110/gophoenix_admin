import { apiPut } from "@/apis/ApiRequest";
import UIInputField from "@/components/InputFields/UIInputField";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import React, { useState } from "react";
import { toast } from "sonner";

const UserPasswordChange = ({ slug }) => {
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = () => {
    if (!newPassword) {
      toast.error("New password cannot be empty");
      return;
    }
    apiPut(
      `${ApiEndpoints.users.base}${ApiEndpoints.users.updateUserPassword}`,
      { pass: newPassword, userId: slug },
      (res) => {
        if (res?.success) {
          toast.success(res?.message);
          setNewPassword("");
        } else {
          toast.error(res?.message);
        }
      },
      (err) => {
        console.error("Error updating password", err);
      }
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <UIInputField
        isLable={true}
        labelName="New Password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <div>
        <UIButton
          type="contained"
          icon={false}
          title="Update Password"
          onClick={handleUpdatePassword}
        />
      </div>
    </div>
  );
};

export default UserPasswordChange;
