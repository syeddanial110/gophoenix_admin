import React from "react";
import UITypography from "../../components/UITypography/UITypography";
import UIButton from "../../components/UIButton/UIButton";
import Image from "next/image";

const BlogCard = ({ image, title, excerpt, onEdit, onDelete }) => {
  return (
    <div className="max-w-sm bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="w-full h-44 overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            width={400}
            height={200}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="p-5">
        <UITypography
          variant="h4"
          text={title || "Untitled"}
          className="!text-[22px] !font-[800] mb-3"
        />

        <UITypography
          variant="p"
          text={excerpt || ""}
          className="text-[14px] text-gray-700 mb-4"
        />

        <div className="flex gap-4">
          <UIButton
            type="contained"
            title="Edit"
            icon={false}
            btnOnclick={onEdit}
            className="rounded-2xl"
          />
          <UIButton
            type="outlined"
            title="Delete"
            btnOnclick={onDelete}
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;