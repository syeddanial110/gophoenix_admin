import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UITypography from "../UITypography/UITypography";
import UIButton from "../UIButton/UIButton";

const UIPopover = ({ btnTrigger, onBtnClick, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>{btnTrigger}</PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <UITypography text={title} />
          <div className="flex items-center gap-2">
            <UIButton
              type="contained"
              icon={false}
              title="Yes"
              btnOnclick={onBtnClick}
            />
            <UIButton
              type="contained"
              icon={false}
              title="No"
              btnOnclick={() => setOpen(false)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UIPopover;
