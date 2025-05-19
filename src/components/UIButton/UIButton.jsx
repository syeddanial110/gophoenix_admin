import React from "react";
import { Button } from "../ui/button";
import "./styles.css";

const UIButton = ({
  type,
  title,
  className,
  btnType,
  icon,
  btnIcon,
  btnOnclick,
}) => {
  return (
    <>
      {type == "contained" && icon == false ? (
        <Button
          type={btnType}
          className={`bg-main btn rounded-full py-5 px-6 ${className}`}
        >
          {title}
        </Button>
      ) : type == "outlined" ? (
        <Button
          className={`bg-transparent border-b-1 border-black text-black hover:bg-transparent ${className}`}
          type={btnType}
        >
          {title}
        </Button>
      ) : type == "contained" && icon == true ? (
        <Button variant="contained" size="icon" onClick={btnOnclick}>
          {btnIcon}
          {title}
        </Button>
      ) : (
        <Button variant="outline" size="icon">
          <btnIcon strokeColor="black" /> {title}
        </Button>
      )}
    </>
  );
};

export default UIButton;
