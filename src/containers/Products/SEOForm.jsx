import React, { useState } from "react";
import UIInputField from "@/components/InputFields/UIInputField";
import UITypography from "@/components/UITypography/UITypography";
import UIButton from "@/components/UIButton/UIButton";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import UITextField from "@/components/InputFields/UITextField";

const SEOForm = ({
  productName,
  shortDescription,
  metaTitle,
  metaDescription,
  onChange,
  
}) => {
  return (
    <>
      <div className="max-w-2xl bg-white rounded-lg p-6 shadow border border-gray-200 my-5">
        {/* Search engine listing preview */}
        <div className="mb-6">
          <div className="text-xs text-gray-500 mb-1">
            Search engine listing
          </div>
          <div className="font-semibold text-gray-800">Phoenix Sports</div>

          {metaTitle && (
            <div className="text-lg text-blue-800 font-medium mt-0.5">
              {metaTitle || (
                <div dangerouslySetInnerHTML={{ __html: productName }} />
              )}
            </div>
          )}
          {shortDescription && (
            <div className="text-sm text-gray-700 mt-1">
              {metaDescription || shortDescription}
            </div>
          )}
        </div>

        {/* Page title input */}
        <div className="mb-4">
          <UIInputField
            isLable={true}
            name="metaTitle"
            lableName="Meta Title"
            onChange={onChange}
            value={metaTitle}
          />
          <div className="text-xs text-gray-500 mt-1">
            {metaTitle.length} of 70 characters used
          </div>
        </div>

        {/* Meta description input */}
        <div className="mb-4">
          <UIInputField
            isTextArea={true}
            lableName="Meta Description"
            name="metaDescription"
            onChange={onChange}
            value={metaDescription}
          />
          <div className="text-xs text-gray-500 mt-1">
            {metaDescription.length} of 160 characters used
          </div>
        </div>
      </div>
    </>
  );
};

export default SEOForm;
