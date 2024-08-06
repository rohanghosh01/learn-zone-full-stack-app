"use client";
import React, { useEffect, useState } from "react";
import * as API from "../../../../../services/api";
import { MessagingComponet } from "@/components/messaging";
import { ChatSkeleton } from "./chat-skeleton";

interface Params {
  params: {
    id: string;
  };
}

export default function Chat({ params }: Params) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any | null>(null);

  async function getUser() {
    setLoading(true);
    try {
      let res: any = await API.profile(params.id);
      setUserInfo(res?.result);
    } catch (error: any) {
      console.log("error get profile", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, [params.id]);

  return (
    <div className="h-full">
      {loading || !userInfo ? (
        <ChatSkeleton />
      ) : (
        <>
          <MessagingComponet user={userInfo} />
        </>
      )}
    </div>
  );
}
