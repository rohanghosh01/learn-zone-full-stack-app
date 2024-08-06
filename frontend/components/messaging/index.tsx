"use client";
import { useEffect, useState } from "react";
import { MessageHeader } from "./messages/header";
import { Messages } from "./messages";
import { Chats } from "./chats";
import { MessageSearch } from "./messages/search";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSelector } from "react-redux";
import * as API from "../../services/api";
import Loader from "@/components/loading";

export function MessagingComponet({ user }: any) {
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [sheetOpen, setSheetOpen] = useState(isMobile);

  const [userId, setUserId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isMore, setIsMore] = useState(true);
  const [userList, setUserList] = useState<any>([]);
  const currentUser = useSelector((state: any) => state?.user);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("all");

  const getMessages = async (query?: any, refetch?: any, tab?: any) => {
    if (!isMore) return;
    let q = {
      limit: 10,
      offset: 0,
      tab,
    };

    if (query) {
      q = { ...query, tab };
    }
    try {
      const res: any = await API.messages({ ...q });

      if (refetch) {
        setUserList(res.result);
        setIsMore(true);
      } else {
        setUserList((prev: any) => {
          const existingIds = new Set(prev.map((user: any) => user.id));
          const filtered = res.result.filter(
            (user: any) => !existingIds.has(user.id)
          );

          return [...prev, ...filtered];
        });
      }
    } catch (error: any) {
      if (error.message === "404") {
        if (tab) {
          setIsMore(true);
          setUserList([]);
        } else {
          setIsMore(false);
        }
      }
    }
  };

  const handleSelectUser = async (id: any) => {
    console.log("handleSelectUser", tab);
    try {
      const res: any = await API.addChat({ userId: id });
      if (res) {
        setRoomId(res.connectionId);
        setUserId(id);
        setSelected(res.connectionId);
        getMessages(null, true, tab);
      }
    } catch (error) {
      console.log(">>>>>log", error);
      return false;
    }
  };

  const handleMessageClick = (id?: any, id2?: any) => {
    setSelected(id);
    setRoomId(id);
    setUserId(id2);
    setSheetOpen(false);
    setTab(tab);
    getMessages(null, true, tab);
  };

  return (
    <div className="grid max-h-screen w-full p-0 m-0">
      <div className="grid  w-full h-full">
        <div className="flex flex-col">
          <MessageHeader
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            isMobile={isMobile}
            isDesktop={isDesktop}
            sheetOpen={sheetOpen}
            setSheetOpen={setSheetOpen}
            getMessages={getMessages}
            userList={userList}
            setUserList={setUserList}
            selected={selected}
            setSelected={setSelected}
            setSelectedUserId={setUserId}
            tab={tab}
            setTab={setTab}
            handleMessageClick={handleMessageClick}
            setRoomId={setRoomId}
          />
          <MessageSearch
            open={searchOpen}
            setOpen={setSearchOpen}
            handleSelect={handleSelectUser}
            selectedUserId={userId}
            setSelectedUserId={setUserId}
          />
          <main className="grid flex-1 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3 gap-4 h-screen w-auto">
            <Messages
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              isMobile={false}
              getMessages={getMessages}
              userList={userList}
              setUserList={setUserList}
              selected={selected}
              setSelected={setSelected}
              selectedUserId={userId}
              setSelectedUserId={setUserId}
              setSheetOpen={setSheetOpen}
              tab={tab}
              setTab={setTab}
              handleMessageClick={handleMessageClick}
              setRoomId={setRoomId}
            />
            <Chats
              sheetOpen={sheetOpen}
              setSheetOpen={setSheetOpen}
              roomId={selected}
              setSelected={setSelected}
              userId={userId}
              setSelectedUserId={setUserId}
              getMessages={getMessages}
              tab={tab}
              setTab={setTab}
              handleMessageClick={handleMessageClick}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
