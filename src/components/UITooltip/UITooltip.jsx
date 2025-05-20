import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UITooltip = ({ children }) => {
  return (
    <TooltipProvider >
      <Tooltip >{children}</Tooltip>
    </TooltipProvider>
  );
};

export default UITooltip;
