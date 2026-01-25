"use client";
import { apiGet } from "@/apis/ApiRequest";
import UIButton from "@/components/UIButton/UIButton";
import UIModal from "@/components/UIModal/UIModal";
import UITypography from "@/components/UITypography/UITypography";
import NewsletterTable from "@/containers/Newsletter/NewsletterTable";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import React, { useState } from "react";
import { toast } from "sonner";

const Newsletter = () => {
  const handleSyncContacts = () => {
    apiGet(
      `${ApiEndpoints.newsletter.base}${ApiEndpoints.newsletter.syncContacts}`,
      (res) => {
        console.log("Sync Contacts Res", res);
        toast.success(res?.message);
        setTimeout(() => {}, 2000);
      },
      (err) => {
        console.log("Sync Contacts Err", err);
      },
    );
  };

  return (
    <>
      <div className="flex justify-between gap-4">
        <div className="flex justify-between w-full items-center">
          <UITypography variant="h2" text="Newsletter Contacts" />
          <UIButton
            type="contained"
            icon={false}
            title="Sync Contact"
            btnOnclick={() => {
              handleSyncContacts();
            }}
          />
        </div>

        {/* <UIButton type="contained" icon={false} title="Add Category" /> */}
      </div>
      <NewsletterTable />
    </>
  );
};

export default Newsletter;
