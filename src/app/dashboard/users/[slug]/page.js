"use client";
import React, { useEffect, useState } from "react";
import UITypography from "@/components/UITypography/UITypography";
import UIButton from "@/components/UIButton/UIButton";
import UIInputField from "@/components/InputFields/UIInputField";
import UserPasswordChange from "@/containers/Users/UserPasswordChange";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { toast } from "sonner";
import { pathLocations } from "@/utils/navigation";
import UISpinner from "@/components/UISpinner/UISpinner";

const UserById = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy order history data

  const handleDisableUser = () => {
    apiGet(
      `${ApiEndpoints.users.base}${ApiEndpoints.users.disableUser}/${slug}`,
      (res) => {
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
        toast.success(res?.message);
        router.push(pathLocations.users);
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  useEffect(() => {
    if (!slug) return;
    apiGet(
      `${ApiEndpoints.users.base}${ApiEndpoints.users.getUserById}/${slug}`,
      (res) => {
        setIsLoading(false);
        // support both res.user.data or res.data
        const data = res?.user?.data ?? res?.data ?? null;
        setUserData(data);
      },
      (err) => {
        setIsLoading(false);
        console.log("err", err);
      }
    );
  }, [slug]);

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

      {/* Summary */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <UISpinner />
        </div>
      ) : (
        <div className="mt-6 mb-6">
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <UITypography
                  variant="h4"
                  text={
                    userData &&
                    `${userData.firstName ?? ""} ${userData.lastName ?? ""}`
                  }
                />
                <UITypography
                  variant="p"
                  text={userData?.email ?? ""}
                  className="text-sm text-gray-600"
                />
              </div>
              <div className="text-right">
                <UITypography
                  variant="h6"
                  text={`Children: ${userData?.children?.length ?? 0}`}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex mt-9 gap-8 mb-10">
        <div className="flex-1 pr-5">
          <UITypography variant="h6" text="Children" />
          <div className="mt-4 grid grid-cols-1 gap-4">
            {userData?.children && userData.children.length > 0 ? (
              userData.children.map((child, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 bg-gray-50 flex items-start gap-4"
                >
                  <div className="flex-1">
                    <UITypography
                      variant="h6"
                      text={child.name}
                      className="!text-[16px] !font-[700]"
                    />
                    <UITypography
                      variant="p"
                      text={`Age: ${child.age ?? "-"}`}
                      className="text-sm text-gray-600"
                    />
                    <UITypography
                      variant="p"
                      text={`Gender: ${child.gender ?? "-"}`}
                      className="text-sm text-gray-600"
                    />
                    <UITypography
                      variant="p"
                      text={`Allergies: ${child.allergies ?? "None"}`}
                      className="text-sm text-gray-600"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No children found.</div>
            )}
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
