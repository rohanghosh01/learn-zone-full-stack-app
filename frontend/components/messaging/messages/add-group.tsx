"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Camera, CheckIcon } from "lucide-react";
import { ToolTip } from "@/components/tooltip-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as API from "../../../services/api";
import { upload } from "@/services/firebase";
import { useSelector } from "react-redux";
import Loader from "@/components/loading";
import socket from "@/lib/socket";

export const AddGroup = ({
  open,
  setOpen,
  setSelected,
  setSelectedUserId,
  setRoomId,
  handleMessageClick,
}: any) => {
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [file, setFile] = useState<any>(null);
  const [users, setUsers] = useState<any>([]);
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [query, setQuery] = useState({ limit: 10, offset: 0, search: "" });
  const [isMore, setIsMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector((state: any) => state?.user);

  const getUsers = async (refetch?: any) => {
    if (!isMore) return;
    try {
      setLoading(true);
      const res: any = await API.userList({ ...query });

      if (refetch) {
        let result = res.results.filter(
          (user: any) => user.id !== currentUser.id
        );
        setUsers(result);
        setLoading(false);
      } else {
        setUsers((prev: any) => {
          const existingIds = new Set(prev.map((user: any) => user.id));
          const filtered = res.results.filter(
            (user: any) => !existingIds.has(user.id)
          );
          const newFiltered = filtered.filter(
            (user: any) => user.id !== currentUser.id
          );

          return [...prev, ...newFiltered];
        });
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      if (error.message === "404") {
        setIsMore(false);
      }
    }
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const fileChange = (e: any) => {
    let data = e.target.files[0];
    setFile({
      preview: URL.createObjectURL(data),
      content: data,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let insertData: any = {
        name: groupName,
        members: selectedUsers,
        groupImage: null,
      };
      if (file) {
        let url = await upload(file.content, "messages");
        insertData.groupImage = url;
      }

      let res: any = await API.addGroup(insertData);
      let roomId = res?.connectionId;

      setSelectedUserId(roomId);
      setSelected(roomId);
      setRoomId(roomId);
      handleMessageClick(roomId, roomId);

      setOpen(false);
      setGroupName("");
      setFile(null);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    setQuery({ limit: 10, offset: 0, search: "" });
    setUsers([]);
    setIsMore(true);
    getUsers(true);
  }, [open, currentUser]);

  useEffect(() => {
    if (scrollRef.current && open) {
      const handleScroll = () => {
        if (scrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
          if (scrollTop + clientHeight >= scrollHeight) {
            setQuery((prevQuery) => {
              const updatedOffset = prevQuery.offset + prevQuery.limit;
              return {
                ...prevQuery,
                offset: updatedOffset,
              };
            });
          }
        }
      };

      const currentRef = scrollRef.current;
      currentRef.addEventListener("scroll", handleScroll);

      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [open, scrollRef.current]);

  useEffect(() => {
    if (query.offset > 0 || query.search !== "") {
      getUsers();
    }
  }, [query]);

  const handleSelect = (user: any) => {
    setSelectedUsers((prevSelected: any) => {
      if (prevSelected.includes(user.id)) {
        // User is already selected, remove them
        return prevSelected.filter((id: any) => id !== user.id);
      } else {
        // User is not selected, add them
        return [user.id, ...prevSelected];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] h-[600px]">
        {loading && <Loader />}
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">New Group Chat</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  {file && file?.preview ? (
                    <div className="">
                      <img
                        src={file?.preview}
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <Camera className="text-white" />
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                  <label htmlFor="profile-pic" className="sr-only">
                    Update profile picture
                  </label>
                  <input
                    type="file"
                    id="profile-pic"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={fileChange}
                    accept="image/*"
                  />
                </div>
              </div>
              <Input
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="mb-4"
              />
            </div>
            <DialogFooter>
              <ToolTip name="Next" side="bottom">
                <Button
                  type="button"
                  className="rounded-full w-14 h-14"
                  onClick={handleNextStep}
                  disabled={groupName.trim().length == 0}
                >
                  <ArrowRight />
                </Button>
              </ToolTip>
            </DialogFooter>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader className="p-0 mb-2">
              <div className="flex gap-20 items-center cursor-pointer">
                <ArrowLeft onClick={handlePreviousStep} />
                <DialogTitle className="text-center">
                  New Group Chat
                </DialogTitle>
              </div>
            </DialogHeader>
            <Command className="overflow-hidden rounded-t-none border-t bg-transparent ">
              <CommandInput
                placeholder="Search user..."
                onValueChange={(value: any) =>
                  setQuery((prevQuery) => ({
                    ...prevQuery,
                    search: value,
                    offset: 0,
                  }))
                }
              />
              <CommandList ref={scrollRef}>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup className="p-2" heading="Suggestions">
                  {users.length > 0 &&
                    users.map((user: any) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        className="flex items-center px-2 cursor-pointer"
                        // onSelect={(value) => {
                        //   console.log(">>", value);
                        //   setSelectedUsers((prev: any) => [user.id, ...prev]);
                        // }}
                        onSelect={() => handleSelect(user)}
                      >
                        <Avatar>
                          <AvatarImage
                            src={user.profileImage}
                            alt="Image"
                            className="object-cover"
                          />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="ml-2">
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.userName}
                          </p>
                        </div>
                        {selectedUsers?.includes(user.id) ? (
                          <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                        ) : null}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>

            <DialogFooter>
              <Button
                type="submit"
                className="rounded-full"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={!selectedUsers.length}
              >
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
