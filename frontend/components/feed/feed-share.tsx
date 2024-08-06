import { Copy, Share, Share2 } from "lucide-react";
import { Icons } from "../icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ShareDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md h-60 flex justify-center flex-col ">
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-center gap-2 items-center">
              Share Feed
              <Share2 />
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 justify-center">
          <Button
            type="submit"
            size="sm"
            className="px-3 bg-gray-500 hover:bg-gray-600"
          >
            <Copy className="h-4 w-4" />
            <span className="ml-1">Copy</span>
          </Button>
          <Button
            type="submit"
            size="sm"
            className="px-3 bg-green-500 hover:bg-green-600"
          >
            <Icons.whatsApp className="h-5 w-5" />
            <span className="ml-1">Whatsapp</span>
          </Button>
          <Button type="submit" size="sm" className="px-3">
            <Icons.facebook className="h-5 w-5" />
            <span className="ml-1">Facebook</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
