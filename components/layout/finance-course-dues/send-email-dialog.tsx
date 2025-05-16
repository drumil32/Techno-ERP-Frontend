import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function SendEmailDialog({
  hodEmail,
  hodName
}: {
  hodEmail: string;
  hodName: string;
}) {
  const [open, setOpen] = useState(false)
  const handleDialogClose = () => {
    setOpen(false);
  };

  const sendEmail = () => {
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-pink-700 hover:text-pink-500">
          <Send className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Send className="size-6 text-pink-700" />
            Send Email
          </DialogTitle>
          <DialogDescription className="my-3">
            Are you sure you want to send mail to {hodName}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="font-inter text-sm">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={sendEmail} className="font-inter text-sm">
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
