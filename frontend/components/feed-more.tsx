import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Trash, SquarePen } from "lucide-react";
import { ConformDialog } from "./alert-dialog";
import { useState } from "react";
import { ToolTip } from "./tooltip-provider";

export function FeedMore({ handleDelete, handleEdit }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };
  return (
    <>
      <DropdownMenu>
        <ToolTip name="More actions">
          <DropdownMenuTrigger asChild>
            <DotsHorizontalIcon />
          </DropdownMenuTrigger>
        </ToolTip>
        <DropdownMenuContent className="w-10">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
              Edit
              <DropdownMenuShortcut>
                <SquarePen className="w-5 h-5" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleClick}>
              Delete
              <DropdownMenuShortcut>
                <Trash className="w-5 h-5" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConformDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        text="This action cannot be undone. This will permanently delete your feed"
        handleSubmit={handleDelete}
      />
    </>
  );
}
