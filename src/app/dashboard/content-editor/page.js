import UITypography from "@/components/UITypography/UITypography";
import Editor from "@/containers/ContentEditor/Editor";
import React from "react";

const ContentEditor = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <UITypography variant="h2" text="Content Editor" />
        <Editor />
      </div>
    </>
  );
};

export default ContentEditor;
