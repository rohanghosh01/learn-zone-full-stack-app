import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Phone, Video } from "lucide-react";
import { useSelector } from "react-redux";
import { formatDate } from "@/lib/format-date";
import { ProfilesDialog } from "./user-profile";
import * as API from "@/services/api";

export const ChatHeader = ({
  userInfo,
  clearChat,
  handleMessageClick,
  getChats,
}: any) => {
  const currentUser = useSelector((state: any) => state?.user);
  let isOnline = userInfo?.isOnline;
  let lastSeen = formatDate(userInfo?.lastSeen);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  const handleInfoClick = () => {
    setInfoOpen(true);
  };
  const handleLeave = async () => {
    try {
      if (userInfo?.isAdmin) {
        await API.deleteGroup(userInfo?.connectionId);
        handleMessageClick(null, null);
        getChats();
      } else {
        await API.leaveGroup(userInfo?.connectionId);
        handleMessageClick(null, null);
        getChats();
      }
    } catch (error) {
      console.log(error);
    }
  };

  let status: any = isOnline ? "Online" : `Last seen ${lastSeen}`;
  return (
    <div className="flex flex-row items-center border-b-[1.3px] pb-2">
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={handleInfoClick}
      >
        <Avatar className="overflow-visible">
          <AvatarImage
            src={userInfo?.profileImage}
            alt="Image"
            className="rounded-full"
          />
          <AvatarFallback className="rounded-full">
            {userInfo?.name[0]}
          </AvatarFallback>
          {isOnline && (
            <p className="w-[10px] h-[10px] overflow-visible bg-green-500 rounded-full absolute bottom-0 right-0" />
          )}
        </Avatar>

        <div>
          <p className="text-sm font-medium leading-none">
            {userInfo?.name}
            {currentUser?.id == userInfo?.id && (
              <span className="ml-1 text-muted-foreground">(You)</span>
            )}
          </p>
          {/* <p className="text-sm text-muted-foreground">{userInfo?.userName}</p> */}
          {userInfo?.isGroup ? (
            <p className="mt-2 text-muted-foreground text-sm">
              {userInfo?.members?.length} participants
            </p>
          ) : (
            <p className="mt-2 text-muted-foreground text-sm">{status}</p>
          )}
        </div>
      </div>

      <div className="ml-auto flex gap-2">
        <div className="call-options flex gap-3">
          <Button size="icon" className="rounded-full" disabled>
            <Phone className="h-5 w-5" />
            <span className="sr-only">Audio call</span>
          </Button>
          <Button size="icon" className="rounded-full" disabled>
            <Video className="h-5 w-5" />
            <span className="sr-only">Video call</span>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <DotsVerticalIcon className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleInfoClick}>
              {userInfo?.isGroup ? "Group info" : "View profile"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => clearChat(currentUser?.id)}>
              Clear chat
            </DropdownMenuItem>
            {userInfo?.isGroup ? (
              <>
                <DropdownMenuItem onClick={() => setIsAlert(true)}>
                  {userInfo?.isAdmin ? "Delete Group" : "Leave group"}
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Block</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {infoOpen && (
        <ProfilesDialog open={infoOpen} setOpen={setInfoOpen} data={userInfo} handleMessageClick={handleMessageClick} getChats={getChats}/>
      )}
      {isAlert && (
        <AlertDialog open={isAlert} onOpenChange={setIsAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
                {userInfo?.isAdmin
                  ? "This will permanently delete your group"
                  : " This will permanently removed you from this group"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeave}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
