import React from "react";
import { Switch } from "@/components/ui/switch";

const UISwitch = ({ onCheckedChange, value, ...props }) => {
  return <Switch onCheckedChange={onCheckedChange} value={value} {...props} />;
};

export default UISwitch;
