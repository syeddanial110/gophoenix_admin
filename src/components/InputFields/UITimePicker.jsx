// src/components/InputFields/UITimePicker.jsx
"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UITypography from "../UITypography/UITypography";

export function UITimePicker({ time, setTime, className, labelName }) {
  return (
    <>
      <UITypography variant="h6" text={labelName} className="!text-[14px]" />
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !time && "text-muted-foreground"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              {time ? time : <span>Pick a time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <input
              type="time"
              onChange={(e) => setTime(e.target.value)}
              value={time}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
