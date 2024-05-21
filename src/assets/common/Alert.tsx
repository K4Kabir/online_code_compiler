import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Alert({
  open,
  setOpen,
  title,
  description,
  handleSubmit,
}) {
  const [input, setInput] = useState<any>();
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          <Input onChange={(e) => setInput(e.target.value)} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          {!input ? (
            <AlertDialogAction onClick={() => handleSubmit(Date.now())}>
              Create A Random Room
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={() => handleSubmit(input)}>
              Join
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
