"use client";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { Ban, Edit, File, Pencil, Reply } from "lucide-react";
import { ToolTip } from "@/components/tooltip-provider";
import { formatDate } from "@/lib/format-date";
import { convertSize } from "@/lib/file-size-convert";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Loader from "@/components/loading";

export const ChatSingle = ({
  data: chatData,
  editChat,
  deleteChat,
  replyChat,
}: any) => {
  const [replied, setReplied] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [isCurrentUser, setIsCurrentUser] = useState<any>(false);
  const currentUser = useSelector((state: any) => state?.user);

  useEffect(() => {
    const isCurrent = chatData?.senderId === currentUser?.id;
    setIsCurrentUser(isCurrent);
    const repliedBySender = chatData?.repliedBySender ?? null;
    const repliedByReceiver = chatData?.repliedByReceiver ?? null;
    const repliedByMember = chatData?.repliedByMember?.[0] ?? null;
    const replyData = repliedBySender || repliedByReceiver || repliedByMember;
    setData(chatData);
    setReplied(replyData);
  }, [chatData, currentUser]);

  if (!data || !currentUser) {
    return <Loader />;
  }
  return (
    <div className="relative group flex">
      {!isCurrentUser && (
        <div className="flex gap-1 items-start max-w-100">
          <Avatar>
            <AvatarImage src={data?.senderInfo?.profileImage} alt="user" />
            <AvatarFallback className="dark:bg-gray-600 bg-gray-200  w-full flex align-middle items-center content-center justify-center">
              {data?.senderInfo?.name[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs w-60 truncate text-muted-foreground">
            {data?.senderInfo?.name?.split(" ")[0] || "N/A"},{" "}
            {formatDate(data?.timestamp, true)}
          </span>
        </div>
      )}
      {isCurrentUser && (data?.message || data?.file?.type) && (
        <span className="text-xs w-40 text-muted-foreground absolute -right-5 -top-4">
          {formatDate(data?.timestamp, true)}
        </span>
      )}
      {data?.deletedAt ? (
        <div
          className={cn(
            "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ",
            isCurrentUser
              ? "ml-auto dark:bg-secondary bg-green-200 text-primary-foreground mt-1"
              : "dark:bg-gray-700 bg-gray-400  mt-5 relative right-60"
          )}
        >
          <div
            className={cn(
              "flex gap-1 items-center text-muted-foreground",
              data?.deletedAt ? "italic" : ""
            )}
          >
            {data?.deletedAt && <Ban className="w-4 h-4" />}
            {data?.message}
          </div>
        </div>
      ) : (
        <>
          {data?.file && data.file?.url ? (
            <div
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                isCurrentUser
                  ? "ml-auto dark:bg-secondary bg-green-200 text-primary-foreground my-1"
                  : "dark:bg-gray-700 bg-gray-400   mt-5 relative right-60"
              )}
            >
              {data?.file?.type == "image" ? (
                <img src={data.file?.url} alt="" className="w-60 h-40" />
              ) : data?.file?.type == "video" ? (
                <div className="w-60 h-36">
                  <video controls width="100%" height="100%">
                    <source src={data?.file?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className=" dark:bg-secondary bg-white w-full h-full rounded-sm p-4">
                  <File className="w-10 h-10 text-black dark:text-white" />
                  <div className="flex mt-8 text-xs flex-col gap-[2px]">
                    <span className="font-semibold text-muted-foreground w-40 truncate">
                      {data?.file?.name}
                    </span>
                    <span className="text-muted-foreground">
                      {convertSize(data?.file?.size)} | File
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : data?.message ? (
            <div
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                isCurrentUser
                  ? "ml-auto dark:bg-secondary bg-green-200 my-1"
                  : "dark:bg-gray-700 bg-gray-400 mt-5 relative right-60"
              )}
            >
              {replied &&
                (replied?.file && replied?.file?.url ? (
                  <div
                    className={cn(
                      "flex w-max max-w-[100%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      isCurrentUser
                        ? "ml-auto dark:bg-secondary bg-green-200 text-primary-foreground my-1"
                        : "dark:bg-gray-700 bg-gray-400"
                    )}
                  >
                    <Reply className="w-5 h-5  text-black dark:text-white" />
                    {replied?.file?.type == "image" ? (
                      <img
                        src={replied?.file?.url}
                        alt=""
                        className="w-60 h-40"
                      />
                    ) : replied?.file?.type == "video" ? (
                      <div className="w-60 h-36">
                        <video controls width="100%" height="100%">
                          <source src={replied?.file?.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="dark:bg-gray-900 bg-gray-100 w-full h-full rounded-sm p-4">
                        <File className="w-10 h-10 text-black dark:text-white" />
                        <div className="flex mt-8 text-xs flex-col gap-[2px]">
                          <span className="font-semibold text-muted-foreground w-40 truncate">
                            {replied?.file?.name}
                          </span>
                          <span className="text-muted-foreground ">
                            {convertSize(replied?.file?.size)} | File
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "mb-2 p-2 rounded-lg ",
                      isCurrentUser
                        ? "dark:bg-gray-700 bg-green-50 flex flex-col mt-1"
                        : " dark:bg-gray-900 bg-gray-300 flex flex-col"
                    )}
                  >
                    <Reply className="w-5 h-5" />
                    <span className="text-base">{replied?.message}</span>
                    <span className="text-xs">
                      {replied?.name}, {formatDate(replied?.time)}
                    </span>
                  </div>
                ))}

              <div className="flex items-center relative">
                {data?.isEdited && (
                  <ToolTip name="This message has been edited" side="bottom">
                    <Pencil
                      className={cn(
                        "w-4 h-4 text-muted-foreground absolute",
                        isCurrentUser ? "-left-9" : "-right-9"
                      )}
                    />
                  </ToolTip>
                )}
                <div
                  className={cn(
                    "flex gap-1 items-center",
                    data.deletedAt ? "italic" : ""
                  )}
                >
                  {data.deletedAt && <Ban className="w-4 h-4" />}
                  {data?.message}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div
            className={cn(
              "absolute",
              isCurrentUser ? " -right-4 bottom-2" : "-left-4 bottom-2"
            )}
          >
            {!data?.deletedAt && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DotsVerticalIcon
                    className={cn(
                      "cursor-pointer w-5 h-5 opacity-0 group-hover:opacity-100"
                    )}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => replyChat(data)}>
                    Reply
                  </DropdownMenuItem>
                  {isCurrentUser ||
                    (!data?.file?.url && (
                      <DropdownMenuItem
                        onClick={() => {
                          editChat(data);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                    ))}

                  {isCurrentUser && (
                    <DropdownMenuItem onClick={() => deleteChat(data.uid)}>
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </>
      )}
    </div>
  );
};
