import React from "react";
import { Input } from "../ui/input";
import UITypography from "../UITypography/UITypography";

const UIInputField = ({
  placeholder,
  onChange,
  type,
  isLable,
  lableName,
  ...props
}) => {
  return (
    <>
      {isLable ? (
        <>
          <UITypography variant="h6" text={lableName} />
          <Input
            placeholder={placeholder}
            onChange={onChange}
            type={type}
            {...props}
          />
        </>
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
