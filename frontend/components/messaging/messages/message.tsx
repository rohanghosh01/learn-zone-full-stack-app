"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

export const Message = ({ user, selected, handleMessageClick }: any) => {
  const currentUser = useSelector((state: any) => state?.user);

  const [isOnline, setIsOnline] = useState(false);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user && currentUser) {
      if (user?.isGroup) {
        let { groupName, groupImage } = user;
        let info = {
          name: groupName,
          profileImage: groupImage,
          ...user,
        };
        setData(info);
      } else {
        if (user.userId == currentUser.id) {
          setData(user.userInfo);
        } else {
          setData(user.fromUserInfo);
        }
      }
    }
  }, [user, currentUser]);

  useEffect(() => {
    if (data) {
      setIsOnline(data.isOnline);
    }
  }, [data]);

  return (
    <div
      className={cn(
        "flex items-center space-x-4  relative rounded-sm px-2 py-1.5 text-sm outline-none  dark:hover:bg-gray-700 hover:bg-gray-200 ",
        selected == user?.connectionId ? "dark:bg-gray-700 bg-gray-200" : ""
      )}
      onClick={() => {
        let id = user?.isGroup ? user?.connectionId : user?.userId;
        handleMessageClick(user?.connectionId, id);
      }}
    >
      <Avatar className="overflow-visible ">
        <AvatarImage
          src={data?.profileImage}
          alt="Image"
          className="rounded-full"
        />
        <AvatarFallback> {data?.name?.[0] ?? "U"}</AvatarFallback>
        {isOnline && (
          <p className="w-[10px] h-[10px] overflow-visible bg-green-500 rounded-full absolute bottom-0 right-0" />
        )}
      </Avatar>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium leading-none">
          {data?.name}
          {currentUser?.id == data?.id && (
            <span className="ml-1 text-muted-foreground">(You)</span>
          )}
        </p>
        {/* <p className="text-sm text-muted-foreground">{data?.userName}</p> */}
        <p className="text-sm text-muted-foreground overflow-hidden max-w-100 max-h-10 line-clamp-2">
          {user?.lastMessage?.message}
        </p>
      </div>
    </div>
  );
};
