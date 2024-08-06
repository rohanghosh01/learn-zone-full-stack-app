"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquareText, PlusIcon, UserRoundPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "./message";
import Loader from "@/components/loading";
import { ToolTip } from "@/components/tooltip-provider";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { AddGroup } from "./add-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import socket from "@/lib/socket";
import { useSelector } from "react-redux";

export const Messages = ({
  searchOpen,
  setSearchOpen,
  isMobile,
  getMessages,
  userList,
  selected,
  setSelected,
  setSelectedUserId,
  setSheetOpen,
  tab,
  setTab,
  handleMessageClick,
  setRoomId,
}: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState({
    limit: 10,
    offset: 0,
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const [addGroup, setAddGroup] = useState(false);
  const currentUser = useSelector((state: any) => state?.user);

  useEffect(() => {
    if (scrollRef.current) {
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
  }, [scrollRef.current]);

  useEffect(() => {
    setLoading(true);
    getMessages(query, true, tab);
    setLoading(false);
  }, [query]);

  const handleTabChange = (newTab: string) => {
    if (newTab !== tab) {
      setTab(newTab);
      getMessages(query, true, newTab);
    }
  };

  useEffect(() => {
    socket.emit("registerUser", { userId: currentUser?.id, roomId: selected });

    socket.emit("joinRoom", {
      roomId: selected,
      senderId: currentUser?.id,
      userId: selected,
    });
    socket.on("userConnected", (data) => {
      getMessages(null, true, tab);
    });
  }, [selected]);

  if (loading) {
    return <Loader />;
  }
  return (
    <Card
      className={cn(
        "relative flex-col items-center md:flex w-full h-[96vh] overflow-hidden ",
        isMobile ? "flex mt-5 max-h-[92vh]" : "hidden"
      )}
      x-chunk="dashboard-03-chunk-0"
    >
      <CardHeader className="flex flex-col w-full p-4">
        <div className="flex items-center justify-between align-middle">
          <h2 className="w-full font-bold text-lg"> Messages</h2>
          <Menubar className="w-20 h-10 rounded-none overflow-visible outline-none border-0 bg-transparent flex justify-center">
            <MenubarMenu>
              <MenubarTrigger
                className="w-auto h-10 data-[state=open]:bg-transparent focus:bg-transparent cursor-pointer"
                asChild
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                >
                  <ToolTip name="New Chat" side="bottom">
                    <PlusIcon />
                  </ToolTip>
                </Button>
              </MenubarTrigger>
              <MenubarContent
                className="w-full flex flex-col gap-2"
                align="center"
              >
                <MenubarItem
                  className="cursor-pointer flex  justify-start gap-3"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <MessageSquareText className="w-5 h-5" />
                  New Chat
                </MenubarItem>
                <MenubarItem
                  className="cursor-pointer flex  justify-start gap-3"
                  onClick={() => setAddGroup(!addGroup)}
                >
                  <UserRoundPlus className="w-5 h-5" />
                  New Group Chat
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          {addGroup && (
            <AddGroup
              open={addGroup}
              setOpen={setAddGroup}
              setSelected={setSelected}
              setSelectedUserId={setSelectedUserId}
              setRoomId={setRoomId}
              handleMessageClick={handleMessageClick}
            />
          )}
        </div>
        <Separator />
      </CardHeader>

      <div className="flex w-full">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid  w-[80%] grid-cols-3 rounded-full ml-10 mb-5">
            <TabsTrigger
              value="all"
              className="rounded-full w-[70%]"
              onClick={() => handleTabChange("all")}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="chats"
              className="rounded-full w-[70%]"
              onClick={() => handleTabChange("chats")}
            >
              Chats
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="rounded-full  w-[70%]"
              onClick={() => handleTabChange("groups")}
            >
              Groups
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className={cn("w-full chat-scroll h-[75vh] mt-5")} ref={scrollRef}>
        <CardContent className="flex flex-col gap-5 w-full m-0 mt-0 cursor-pointer select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
          {userList && userList.length ? (
            userList.map((user: any, index: number) => (
              <Message
                key={index}
                user={user}
                selected={selected}
                setSelected={setSelected}
                setSelectedUserId={setSelectedUserId}
                setSheetOpen={setSheetOpen}
                handleMessageClick={handleMessageClick}
              />
            ))
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex justify-center">
                <h2 className="text-center">
                  Looks like you have not started any conversation yet click
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    {" "}
                    Add Chat
                  </span>{" "}
                  to start a conversation.
                </h2>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};
