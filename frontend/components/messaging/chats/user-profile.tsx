"use client";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../../hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import * as API from "../../../services/api";
import {
  Check,
  Cross,
  Loader2,
  Pencil,
  Plus,
  PlusCircle,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import config from "../../../config/config.json";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "../../ui/button";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { ToolTip } from "@/components/tooltip-provider";
import { Badge } from "@/components/ui/badge";
const defaultProfile = config.DEFAULT_PROFILE;

interface ProfilesDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  handleMessageClick: any;
  getChats: any;
}

export function ProfilesDialog({
  open,
  setOpen,
  data,
  handleMessageClick,
  getChats,
}: ProfilesDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isGroup, setIsGroup] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const currentUser = useSelector((state: any) => state?.user);
  const [edit, setEdit] = useState({ status: false, name: "" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (data) {
      let info = data || {};

      if (info.isGroup) {
        setIsGroup(info.isGroup);
        info.profileImage = info.groupImage;
        info.name = info.groupName;
        setUsers(info?.members);
      }

      setTitle(info.name);

      setUserInfo(info);
    }
  }, [open, data]);

  const UserDetail = () => (
    <div className="flex flex-col items-center p-4">
      <Avatar className="border-2 border-gray-600 dark:border-gray-300 w-32 h-32 mb-4">
        <AvatarImage
          src={userInfo?.profileImage || defaultProfile}
          alt="profile"
        />
      </Avatar>
      {isGroup ? (
        <>
          <Command className="overflow-hidden rounded-t-none border-t bg-transparent ">
            <CommandList ref={scrollRef}>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup
                className="p-2"
                heading={`${users.length} PARTICIPANTS`}
              >
                <CommandItem className="flex items-center px-2 cursor-pointer gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-background"
                  >
                    <Plus />
                  </Button>
                  <span>Add participants</span>
                </CommandItem>
                {users.length > 0 &&
                  users.map((user: any, index: any) => (
                    <CommandItem
                      key={index}
                      value={user.name}
                      className="flex items-center px-2 cursor-pointer"
                      onSelect={() => setSelectedUser(user.id)}
                    >
                      <Avatar>
                        <AvatarImage
                          src={user.profileImage}
                          alt="Image"
                          className="object-cover"
                        />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-10 text-center">
                        <div className="ml-2 flex flex-col items-start">
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.userName}
                          </p>
                        </div>
                        {user?.isAdmin ? <Badge>Admin</Badge> : ""}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </>
      ) : (
        <div className="details text-center">
          <div className="username flex items-center justify-center gap-4 cursor-pointer  max-sm:justify-center max-sm:flex-wrap">
            <h2 className="text-xl font-semibold">{userInfo?.userName}</h2>
          </div>
          <div className="other-info flex flex-col justify-center gap-4">
            <div className="flex space-x-4 my-4 gap-8">
              <div className="flex gap-2">
                <p className="font-semibold">{userInfo?.totalPosts || 0}</p>
                <p className="text-gray-500">Posts</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold">{userInfo?.totalFollowers || 0}</p>
                <p className="text-gray-500">Followers</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold">{userInfo?.totalFollowing || 0}</p>
                <p className="text-gray-500">Following</p>
              </div>
            </div>
            <div>
              <p className="dark:text-gray-400 text-gray-700">
                {userInfo?.about}
              </p>
            </div>

            <a
              href={userInfo?.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              YouTube Video
            </a>
          </div>
        </div>
      )}
    </div>
  );

  const commonContent = loading ? (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  ) : (
    <div
      className={cn(
        "p-2 overflow-y-auto",
        isDesktop ? "max-h-[600px]" : "max-h-[400px]"
      )}
    >
      <UserDetail />
    </div>
  );

  useEffect(() => {
    setTimeout(() => {
      if (inputRef?.current) {
        const inputElement = inputRef.current;
        inputElement.focus();
        const length = inputElement.value.length;
        inputElement.setSelectionRange(length, length);
      }
    });
  }, [inputRef.current, edit]);

  const handleEdit = async () => {
    try {
      let connectionId = userInfo?.connectionId;
      setTitle(edit.name);
      await API.updateGroup({
        name: edit.name,
        connectionId,
      });
      setEdit({ status: false, name: "" });
      handleMessageClick(connectionId, connectionId);
      getChats();
    } catch (error) {
      console.log(">>", error);
    }
  };

  const Title = () => (
    <>
      {edit.status ? (
        <div className="grow flex justify-center relative mb-4">
          <Input
            className="w-1/2"
            value={edit.name}
            ref={inputRef}
            onChange={(e) => setEdit({ status: true, name: e.target.value })}
          />
          <div className="flex gap-2 absolute right-32 -bottom-11">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEdit({ status: false, name: "" })}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <span className="basis-1/2 font-bold text-xl"> {title || "N/A"}</span>
          <ToolTip name="Edit name" side="bottom">
            <Pencil
              className="w-5 h-5 basis-1/4 cursor-pointer"
              onClick={() => setEdit({ status: true, name: title })}
            />
          </ToolTip>
        </>
      )}
    </>
  );

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex justify-end w-full items-center text-center mb-3">
            {isGroup && <Title />}
          </DialogTitle>
        </DialogHeader>
        {commonContent}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col h-[600px] overflow-hidden">
        <DrawerHeader>
          <DrawerTitle className="flex justify-end w-full items-center text-center">
            {isGroup && <Title />}
          </DrawerTitle>
        </DrawerHeader>
        {commonContent}
      </DrawerContent>
    </Drawer>
  );
}
