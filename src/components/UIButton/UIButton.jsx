import React from "react";
import { Button } from "../ui/button";
import "./styles.css"

const UIButton = ({ type, title, className }) => {
  return (
    <>
      {type == "contained" ? (
        <Button className={`bg-main btn rounded-full py-5 px-6 ${className}`}>{title}</Button>
      ) : (
        <Button
          className={`bg-transparent border-b-1 border-black text-black hover:bg-transparent ${className}`}
        >
          {title}
        </Button>
      )}
    </>
  );
};

export default UIButton;
