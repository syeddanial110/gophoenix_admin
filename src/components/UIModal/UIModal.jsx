import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UIModal = ({modalBtnText, children}) => {
  return (
    <Dialog>
      <DialogTrigger>{modalBtnText}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
            {children}
          {/* <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UIModal;
