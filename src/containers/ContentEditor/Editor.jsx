"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { apiPost, BASEURL } from "@/apis/ApiRequest";
import styles from "./styles.module.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["blockquote", "code-block"],
  ["clean"],
];

const Editor = ({ editorValue, setEditroValue }) => {
  const quillRef = useRef();

  // Custom image handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      console.log("file", file);
      if (file) {
        console.log("input.files", input.files);
        // Upload to your API
        const formData = new FormData();
        const files = Array.from(input.files);
        files.forEach((val, ind) => {
          formData.append(`image`, val);
        });

        // Replace this with your actual API endpoint
        // const response = await fetch(`${BASEURL}${ApiEndpoints.uploadImage.base}${ApiEndpoints.uploadImage.upload}`, {
        //   method: "POST",
        //   body: formData,
        // });
        apiPost(
          `${ApiEndpoints.uploadImage.base}${ApiEndpoints.uploadImage.upload}`,
          formData,
          (res) => {
            console.log("res", res);

            const imageUrl = res?.data[0]?.url; // Adjust according to your API response
            console.log("imageUrl", imageUrl);
            // Insert image into editor
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", imageUrl);
          },
          (err) => {
            console.log("err", err);
          },
          { "Content-Type": "multipart/form-data" }
        );
      }
    };
  };

  const modules = {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: imageHandler,
      },
    },
  };

  return (
    <div className={styles.editorWrapper}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={setEditroValue}
        modules={modules}
        className={styles.quillEditor}
      />
    </div>
  );
};

export default Editor;
