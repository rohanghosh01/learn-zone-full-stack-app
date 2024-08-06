import React, { useEffect, useRef, useState, useCallback } from "react";
import { CheckIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as API from "../../../services/api";

export const MessageSearch = ({
  open,
  setOpen,
  handleSelect,
  selectedUserId,
  setSelectedUserId,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSelect: (value: any) => void;
  selectedUserId: string | null;
  setSelectedUserId: (value: string) => void;
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState({ limit: 10, offset: 0, search: "" });
  const [isMore, setIsMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getUsers = async (refetch?: any) => {
    if (!isMore) return;
    try {
      const res: any = await API.userList({ ...query });

      if (refetch) {
        setUsers(res.results);
      } else {
        setUsers((prev) => {
          const existingIds = new Set(prev.map((user: any) => user.id));
          const filtered = res.results.filter(
            (user: any) => !existingIds.has(user.id)
          );

          return [...prev, ...filtered];
        });
      }
    } catch (error: any) {
      if (error.message === "404") {
        setIsMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuery({ limit: 10, offset: 0, search: "" });
    setUsers([]);
    setIsMore(true);
    getUsers(true);
  }, [open]);

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

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>New message</DialogTitle>
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
                  users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.name}
                      className="flex items-center px-2 cursor-pointer"
                      onSelect={() => setSelectedUserId(user.id)}
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
                      {selectedUserId === user.id ? (
                        <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                      ) : null}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            <Button
              className="ml-auto"
              disabled={!selectedUserId}
              onClick={() => {
                handleSelect(selectedUserId);
                setOpen(false);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
