import React from "react";
import { Input } from "../ui/input";
import UITypography from "../UITypography/UITypography";
import { Textarea } from "../ui/textarea";

const UIInputField = ({
  placeholder,
  onChange,
  type,
  isLable,
  lableName,
  isTextArea = false,
  name,
  ...props
}) => {
  return (
    <>
      {isLable && isTextArea == false ? (
        <div className="flex flex-col gap-2">
          <UITypography
            variant="h6"
            text={lableName}
            className="!text-[14px]"
          />
          <Input
            placeholder={placeholder}
            onChange={onChange}
            name={name}
            type={type}
            {...props}
          />
        </div>
      ) : isTextArea ? (
        <div className="flex flex-col gap-2">
          <UITypography
            variant="h6"
            text={lableName}
            className="!text-[14px]"
          />
          <Textarea
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            {...props}
          />
        </div>
      ) : (
        <Input
          placeholder={placeholder}
          onChange={onChange}
          type={type}
          {...props}
        />
      )}
    </>
  );
};

export default UIInputField;
