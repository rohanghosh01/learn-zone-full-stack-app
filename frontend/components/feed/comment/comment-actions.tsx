import { MessageSquareWarning, Trash, Ban } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CommentAction({
  children,
  data,
  currentUser,
  handleCommentDelete,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  data: any;
  currentUser: any;
  handleCommentDelete: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-full cursor-pointer" align="start">
        <div className="flex flex-col gap-2">
          {data?.userInfo?.id == currentUser?.id ? (
            <>
              <div
                className="flex gap-1 items-center"
                onClick={() => handleCommentDelete(data)}
              >
                <Trash className="h-4 w-4 text-red-700 " />
                <p className="text-sm  text-red-700">Delete comment</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex gap-1 align-middle justify-between items-center content-center">
                <p className="text-red-700 text-sm">Report</p>
                <MessageSquareWarning className="h-4 w-4 text-red-700" />
              </div>
              <div className="flex gap-1 align-middle justify-between items-center content-center">
                <p className="text-red-700 text-sm text-nowrap mr-3">
                  Block account
                </p>
                <Ban className="h-4 w-4 text-red-700" />
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
