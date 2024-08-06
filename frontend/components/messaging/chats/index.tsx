"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ToolTip } from "../../tooltip-provider";
import { ArrowDown } from "lucide-react";
import { ChatSingle } from "./chat-single";

import { ChatInput } from "./chat-input";
import { useSelector } from "react-redux";
import config from "../../../config/config.json";
const defaultProfile = config.DEFAULT_PROFILE;
import socket from "../../../lib/socket";
import * as API from "../../../services/api";
import { ChatHeader } from "./header";
import Loader from "@/components/loading";
import { upload } from "@/services/firebase";

export const Chats = ({
  sheetOpen,
  setSheetOpen,
  roomId,
  userId,
  getMessages,
  tab,
  setTab,
  setSelected,
  setSelectedUserId,
  handleMessageClick,
}: {
  sheetOpen: boolean;
  setSheetOpen: (value: boolean) => void;
  roomId: string | null;
  userId: string | null;
  getMessages: any;
  tab: any;
  setTab: any;
  setSelected: any;
  setSelectedUserId: any;
  handleMessageClick: any;
}) => {
  const [chatData, setChatData] = React.useState<any>(null);

  const [input, setInput] = React.useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const currentUser = useSelector((state: any) => state?.user);
  const [query, setQuery] = useState({ limit: 10, offset: 0, search: "" });
  const [isMore, setIsMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [connectedUsers, setConnectedUsers] = useState<any>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [replied, setReplied] = useState<any>({ status: false, message: null });
  const [editedMessage, setEditedMessage] = useState<any>(null);
  const [files, setFiles] = useState<any>([
    // {
    //   file: "",
    //   id: 1,
    //   preview: "",
    //   type: "application",
    //   name: "file.name",
    // },
  ]);
  const [uploading, setUploading] = useState<any>(false);

  const getChats = async (query?: any, refetch?: any) => {
    let q = {
      limit: 10,
      offset: 0,
    };

    try {
      setLoading(true);
      const res: any = await API.chats(roomId, { ...q });
      setChatData(res.result);
      setLoading(false);

      if (res.result.messages.length) {
        setMessages(res.result.messages);
      }
    } catch (error: any) {
      setLoading(false);
      if (error.message === "404") {
        setChatData(null);
      }
    }
  };

  const scrollDown = () => {
    setTimeout(() => {
      scrollRef?.current?.scrollTo({
        top: scrollRef?.current?.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    scrollDown();
  }, [messages]);

  useEffect(() => {
    if (!roomId || !currentUser) {
      return;
    }
    setMessages([]);
    getMessages(null, true, tab);
    setInput("");
    getChats();
    setIsMore(true);
    setEditedMessage(null);
    setReplied({ status: false, message: null });
    setIsEdit(false);

    socket.emit("registerUser", { userId: currentUser?.id, roomId });

    socket.emit("joinRoom", { roomId, senderId: currentUser?.id, userId });

    socket.on("receiveMessage", (data) => {
      console.log(">>data", data);
      if (data?.roomId == roomId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
      getMessages(null, true, tab);
    });

    socket.on("updatedMessage", (data) => {
      console.log(">>updatedMessage client", data);
      if (data?.roomId === roomId) {
        setMessages((prevMessages) => {
          return prevMessages.map((message) => {
            if (message.uid === data.uid) {
              // Update the message if it matches the ID
              return data;
            } else {
              // Otherwise, return the original message
              return message;
            }
          });
        });
      }
      getMessages(null, true, tab);
    });

    socket.on("userConnected", (data) => {
      setConnectedUsers((prevUsers: any) => [...prevUsers, data.userId]);
      getChats();
      getMessages(null, true, tab);
    });

    socket.on("userDisconnected", (data) => {
      setConnectedUsers((prevUsers: any) =>
        prevUsers.filter((id: any) => id !== data.userId)
      );
      console.log(`User disconnected: ${data.userId}`);
      getChats();
      getMessages(null, true, tab);
    });
    socket.on("clearChat", () => {
      console.log(">>", "clearChat");
      setMessages([]);
      getChats();
      setInput("");
      setIsScroll(false);
      setEditedMessage(null);
      setReplied({ status: false, message: null });
      setIsEdit(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updatedMessage");
      socket.off("userConnected");
      socket.off("clearChat");
      socket.off("userDisconnected");
    };
  }, [roomId, currentUser]);

  const scrollFunction: any = () => {
    if (scrollRef.current) {
      const { scrollTop, offsetHeight, scrollHeight } = scrollRef.current;
      if (offsetHeight < scrollHeight - scrollTop - 100) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", scrollFunction);

    return () => {
      scrollRef.current?.removeEventListener("scroll", scrollFunction);
    };
  }, [scrollRef, scrollRef.current, isScroll]);

  useEffect(() => {
    getChats();
    setInput("");
    setIsScroll(false);
    setEditedMessage(null);
    setReplied({ status: false, message: null });
    setIsEdit(false);
  }, []);

  useEffect(() => {
    if (chatData?.isGroup) {
      let { groupName, groupImage } = chatData;
      let info = {
        name: groupName,
        profileImage: groupImage,
        ...chatData,
      };
      setUserInfo(info);
    } else {
      if (chatData && currentUser) {
        if (chatData.userId == currentUser.id) {
          setUserInfo(chatData.userInfo);
        } else {
          setUserInfo(chatData.fromUserInfo);
        }
      }
    }
  }, [chatData, currentUser, roomId]);

  const sendMessage = (file?: any) => {
    const newMessage = {
      receiverId: userId,
      senderId: currentUser?.id,
      message: input.trim(),
      roomId: roomId,
      file: file || null,
    };

    socket.emit("sendMessage", newMessage);
    getMessages(null, true, tab);
    setInput("");
  };

  const editChat = (data: any) => {
    setInput(data?.message);
    setIsEdit(true);

    const newMessage = {
      roomId: roomId,
      id: data.uid,
      receiverId: userId,
      senderId: currentUser?.id,
    };

    setEditedMessage(newMessage);
  };

  useEffect(() => {
    if (editedMessage) {
      setEditedMessage({
        ...editedMessage,
        message: input,
      });
    }
  }, [isEdit, input]);

  const deleteChat = (id: any) => {
    const newMessage = {
      senderId: currentUser?.id,
      receiverId: userId,
      roomId: roomId,
      id,
    };

    socket.emit("deleteMessage", newMessage);
    getMessages(null, true, tab);

    setInput("");
  };

  const replyChat = (data: any) => {
    setReplied(null);
    let isGroup = roomId?.split("-")[0] == "group";

    let insertData: any = {
      status: true,
      message: data?.message,
      time: data?.timestamp,
      name: data?.senderInfo?.name,
      userId: currentUser?.id,
      messageId: data.uid,
      file: data?.file,
      isGroup,
    };

    setReplied(insertData);
  };
  const inputLength = input.trim().length;

  const handleInputChange = (event: any) => {
    setInput(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (inputLength === 0 && !files.length) return;

    if (files.length) {
      setUploading(true);

      try {
        files.forEach(async (data: any) => {
          let path = "messages";
          let url = await upload(data.file, path);
          if (url) {
            sendMessage({
              url,
              type: data.type,
              name: data.name,
              size: data.size,
            });
          }
        });
        setTimeout(() => {
          setUploading(false);
          setFiles([]);
        }, 3000);
      } catch (error) {
        console.log(">>", error);
        setUploading(false);
        return;
      }
    }

    if (isEdit && editedMessage) {
      socket.emit("editMessage", editedMessage);
    }
    if (replied && replied?.status) {
      let message = {
        replyData: replied,
        roomId: roomId,
        receiverId: userId,
        senderId: currentUser?.id,
        id: replied?.messageId,
        message: input,
      };
      socket.emit("replyMessage", message);
    } else {
      sendMessage();
    }

    console.log(">>handleSubmit");

    getMessages(null, true, tab);
    setEditedMessage(null);
    setInput("");
    setReplied({ status: false, message: null });
    scrollDown();
  };

  const clearChat = (id: any) => {
    console.log(">>", id);

    socket.emit("clearMessage", { userId: id, roomId });
  };
  if (loading) {
    return <Loader />;
  }
  return chatData ? (
    <div className="flex  flex-col  lg:col-span-2 h-full ">
      <Card className="bg-muted/50 rounded-xl overflow-hidden relative p-0 ">
        <CardHeader>
          <ChatHeader
            userInfo={userInfo}
            clearChat={clearChat}
            handleMessageClick={handleMessageClick}
            getChats={getChats}
          />
        </CardHeader>

        <div
          className="lg:h-[80vh] h-[65vh] chat-scroll lg:w-auto w-[400px]"
          ref={scrollRef}
          onScroll={() => {
            setIsScroll(true);
          }}
        >
          <CardContent className="w-full overflow-hidden">
            <div className="space-y-4 w-full h-full">
              {messages?.map((message: any, index: number) => (
                <ChatSingle
                  key={index}
                  data={message}
                  editChat={editChat}
                  deleteChat={deleteChat}
                  replyChat={replyChat}
                />
              ))}
            </div>
          </CardContent>
        </div>

        {isScroll && (
          <div className="absolute bottom-1 right-[50%]">
            <ToolTip name="Go down" side="top">
              <Button
                onClick={scrollDown}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </ToolTip>
          </div>
        )}
        {uploading && (
          <div className="flex justify-center content-center align-middle items-center flex-col gap-1 absolute bottom-0 w-full">
            <span className="text-muted-foreground text-sm">
              Files uploading...
            </span>
            <div className="w-[90%] bg-gray-200 h-1 rounded-lg overflow-hidden relative">
              <div className="bg-green-600 h-full w-1/4 absolute animate-loading"></div>
            </div>
          </div>
        )}
      </Card>
      <ChatInput
        messages={messages}
        setMessages={setMessages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        scrollDown={scrollDown}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        replied={replied}
        setReplied={setReplied}
        files={files}
        setFiles={setFiles}
        uploading={uploading}
      />
    </div>
  ) : (
    <div className="flex  flex-col  lg:col-span-2 h-full">
      <Card className="bg-muted/50 rounded-xl overflow-hidden relative flex justify-center">
        <div className="lg:h-[96vh] h-[85vh]">
          <CardContent className="w-full h-auto overflow-hidden mt-20 flex justify-center flex-col gap-10">
            <div className="flex justify-center">
              <Avatar className="w-40 h-40">
                <AvatarImage
                  src={currentUser?.profileImage || defaultProfile}
                  alt="Image"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-center flex-col gap-2">
              <h2 className="w-auto text-center text-xl font-bold">
                Welcome, {currentUser?.name || "N/A"}
              </h2>
              <p className="max-w-[450px] text-center text-sm mx-auto">
                You don't have any conversations yet. To start a new
                conversation{" "}
                <span className="lg:block hidden cursor-pointer">
                  {" "}
                  Select any message
                </span>
                <span
                  className="text-blue-500 block lg:hidden cursor-pointer"
                  onClick={() => setSheetOpen(!sheetOpen)}
                >
                  Click here
                </span>{" "}
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
