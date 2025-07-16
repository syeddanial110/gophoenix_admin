import React from "react";
import { Switch } from "@/components/ui/switch";

const UISwitch = ({ onCheckedChange, ...props }) => {
  return <Switch onCheckedChange={onCheckedChange} {...props} />;
};

export default UISwitch;
