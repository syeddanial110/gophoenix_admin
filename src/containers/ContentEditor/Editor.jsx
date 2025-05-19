"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Define the toolbar options
const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header dropdown
  ["bold", "italic", "underline", "strike"], // Text formatting
  [{ color: [] }, { background: [] }], // Text color and background color
  [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
  [{ list: "ordered" }, { list: "bullet" }], // Lists
  [{ indent: "-1" }, { indent: "+1" }], // Indent
  [{ align: [] }], // Text alignment
  ["link", "image", "video"], // Links, images, and videos
  ["blockquote", "code-block"], // Blockquote and code block
  ["clean"], // Remove formatting
];

const Editor = () => {
  const [value, setValue] = useState("");

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={{
          toolbar: toolbarOptions, // Add the toolbar options
        }}
      />
    </div>
  );
};

export default Editor;
