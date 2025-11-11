import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const UICheckbox = ({ checked, onChange, label, checkboxId, labelId }) => {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id={checkboxId} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={labelId}>{label}</Label>
    </div>
  );
};

export default UICheckbox;
