"use client"
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UIModal = ({
  modalBtnText,
  btnClassName,
  btnTriggerOnClick,
  modalHeaderTitle,
  open,
  onOpenChange,
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogTrigger onClick={btnTriggerOnClick} className={btnClassName}>
        {modalBtnText}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{modalHeaderTitle}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-1">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UIModal;
