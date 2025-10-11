import React from "react";
import { Button } from "../ui/button";
import "./styles.css";

const UIButton = ({
  type,
  title,
  className,
  btnType,
  icon,
  BtnIcon,
  btnOnclick,
  ...props
}) => {
  return (
    <>
      {type == "contained" && icon == false ? (
        <Button
          type={btnType}
          className={`bg-main btn rounded-full py-5 px-6 ${className}`}
          onClick={btnOnclick}
          {...props}
        >
          {title}
        </Button>
      ) : type == "outlined" ? (
        <Button
          className={`bg-transparent border-b-1 border-black hover:border-b-2 transition-all ease-in duration-200 cursor-pointer text-black hover:bg-transparent ${className}`}
          type={btnType}
          onClick={btnOnclick}
          {...props}
        >
          {title}
        </Button>
      ) : type == "contained" && icon == true ? (
        <Button
          variant="contained"
          type={btnType}
          size="icon"
          onClick={btnOnclick}
          className={`hover:cursor-pointer ${className}`}
          {...props}
        >
          {<BtnIcon />}
          {title}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          type={btnType}
          onClick={btnOnclick}
          className={`hover:cursor-pointer ${className}`}
          {...props}
        >
          <BtnIcon strokeColor="black" /> {title}
        </Button>
      )}
    </>
  );
};

export default UIButton;
