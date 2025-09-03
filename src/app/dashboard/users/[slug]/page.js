"use client";
import React, { useEffect } from "react";
import UITypography from "@/components/UITypography/UITypography";
import UIButton from "@/components/UIButton/UIButton";
import UIInputField from "@/components/InputFields/UIInputField";
import UserPasswordChange from "@/containers/Users/UserPasswordChange";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { toast } from "sonner";
import { pathLocations } from "@/utils/navigation";

const UserById = () => {
  const { slug } = useParams();
  const router = useRouter();
  // Dummy order history data
  const orders = [
    { product: "Product A", date: "07-10-2025", price: "$50" },
    { product: "Product B", date: "07-11-2025", price: "$30" },
  ];

  const handleDisableUser = () => {
    apiGet(
      `${ApiEndpoints.users.base}${ApiEndpoints.users.disableUser}/${slug}`,
      (res) => {
        console.log("User disabled successfully", res);
        if (res?.success) {
          toast.success(res?.message);
        }
      },
      (err) => {
        console.error("Error disabling user", err);
      }
    );
  };

  const handleDeleteUser = () => {
    apiGet(
      `${ApiEndpoints.users.base}${ApiEndpoints.users.deleteUser}/${slug}`,
      (res) => {
        console.log("res", res);
        toast.success(res?.message);
        router.push(pathLocations.users);
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  useEffect(() => {
    // apiGet(`${ApiEndpoints.users.}`)
  }, []);

  console.log("slug", slug);

  return (
    <>
      <div className="flex justify-between mb-4">
        <UITypography variant="h2" text="User Details" />
        <div className="flex gap-2">
          <UIButton
            type="contained"
            icon={false}
            title="Disable User"
            btnOnclick={handleDisableUser}
          />
          <UIButton
            type="contained"
            icon={false}
            title="Delete User"
            btnOnclick={handleDeleteUser}
          />
        </div>
      </div>
      <hr />
      <div className="flex mt-9">
        <div className="flex-1 border-r-4 border-#828282-50 pr-5">
          <UITypography variant="h6" text="Order History" />

          <div className="border-1 border-gray-200 mt-4 p-4 rounded-2xl bg-gray-50">
            <div className="flex justify-between">
              <UITypography variant="h6" text="Class Name" />
              <div>
                <UITypography variant="p" text="Price" />
                <UITypography variant="p" text="Date" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pl-8">
          <UITypography variant="h6" text="Change Password" />
          <UserPasswordChange slug={slug} />
        </div>
      </div>
    </>
  );
};

export default UserById;
