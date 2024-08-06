"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Radio,
  Users,
  MessageCircle,
  MessageCircleX,
  MessageSquareText,
} from "lucide-react"; // Import icons from Material-UI
import { cn } from "@/lib/utils";
import { Search } from "./search";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import config from "../config/config.json";
import { MoreOption } from "./header-more-option";
const defaultProfile = config.DEFAULT_PROFILE;

export const BottomNavigation = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("home");
  const currentUser = useSelector((state: any) => state?.user);

  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setProfileId(currentUser?.id);
    }
  }, [currentUser]);

  const handleTabClick = (tab: any) => {
    setCurrentTab(tab);
    switch (tab) {
      case "home":
        router.push("/pages/home");
        break;
      case "live":
        router.push("/pages/live");
        break;
      case "groups":
        router.push("/pages/group");
        break;
      case "chats":
        router.push(`/pages/chats/${currentUser?.id}`);
        break;
      // case "profile":
      //   router.push(`/pages/chats/${currentUser.id}`);
      //   break;
      default:
        break;
    }
  };

  let tabStyles = "flex flex-col items-center";

  return (
    <div
      className={cn(
        "fixed bottom-0 w-full shadow-lg px-4 py-2 flex justify-between border-red-500 dark:border-gray-200 bg-gray-200  dark:bg-gray-800  cursor-pointer"
      )}
    >
      <div
        className={cn(tabStyles, currentTab === "home" && "text-blue-500")}
        onClick={() => handleTabClick("home")}
      >
        <Home />
        <span>Home</span>
      </div>
      <div
        className={cn(tabStyles, currentTab === "search" && "text-blue-500")}
        onClick={() => handleTabClick("search")}
      >
        <Search isMobile={true} />
      </div>
      <div
        className={cn(tabStyles, currentTab === "live" && "text-blue-500")}
        onClick={() => handleTabClick("live")}
      >
        <Radio />
        <span>Live</span>
      </div>
      <div
        className={cn(tabStyles, currentTab === "chats" && "text-blue-500")}
        onClick={() => handleTabClick("chats")}
      >
        <div className="relative">
          <span className="w-1 h-1 absolute bg-red-700 p-[6px] rounded-full -top-1 -right-3" />
          <MessageSquareText />
        </div>
        <span>Messages</span>
      </div>
      <div
        className={cn(tabStyles, currentTab === "chats" && "text-blue-500")}
        // onClick={() => handleTabClick("profile")}
      >
        <div className="relative">
          <div className="cursor-pointer">
            <Avatar className="lg:mr-4 cursor-pointer">
              <AvatarImage
                src={currentUser?.profileImage || defaultProfile}
                alt="profile"
                className="object-cover"
              />
            </Avatar>
            <div className="w-full opacity-0 absolute top-0 left-0">
              <MoreOption profileId={profileId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
