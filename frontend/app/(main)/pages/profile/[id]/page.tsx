"use client";
import React, { useEffect, useState } from "react";
import * as API from "../../../../../services/api";
import { setUser } from "@/lib/nextSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/loading";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import config from "../../../../../config/config.json";
import { UserFeeds } from "@/components/profile/feeds";
import { Settings } from "lucide-react";
import { ToolTip } from "@/components/tooltip-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileSkeleton } from "./profile-skeleton";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";
const defaultProfile = config.DEFAULT_PROFILE;

interface Params {
  params: {
    id: string;
  };
}

export default function Profile({ params }: Params) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUser = useSelector((state: any) => state?.user);
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
  }, []);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="h-full">
      {/* <div className="m-4"></div> */}
      {loading || !userInfo ? (
        <>
          <div className="flex flex-rows items-start p-4 justify-center max-sm:gap-1 gap-10 max-sm:flex-wrap">
            <ProfileSkeleton />
          </div>
          <div className="grid  sm:grid-cols-2 min-[1600px]:grid-cols-2 min-[1900px]:grid-cols-4  lg:grid-cols-2  md:grid-cols-2 gap-10 ml-10 my-4 justify-center">
            {Array.from({ length: 5 }, (_, index) => (
              <FeedSkeleton key={index} isGrid={true} />
            ))}
          </div>
        </>
      ) : (
        <>
          <UserDetail
            userInfo={userInfo}
            currentUser={currentUser}
            handleFollow={handleFollow}
            isFollowing={isFollowing}
          />
          <UserFeeds user={userInfo} />
        </>
      )}
    </div>
  );
}

const UserDetail = ({
  userInfo,
  currentUser,
  handleFollow,
  isFollowing,
}: any) => (
  <div className="flex flex-rows items-start p-4 justify-center max-sm:gap-1 gap-10 max-sm:flex-wrap">
    <div className="photo">
      <Avatar className="border-2 border-gray-600 dark:border-gray-300 w-40 h-40 md:w-60 md:h-60 mb-4">
        <AvatarImage
          src={userInfo?.profileImage || defaultProfile}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </Avatar>
    </div>
    <div className="details">
      <div className="username flex items-center justify-start gap-4 cursor-pointer  max-sm:justify-center max-sm:flex-wrap">
        <h2 className="text-xl font-semibold">{userInfo?.userName}</h2>
        {currentUser?.id !== userInfo?.id && (
          <div className="flex gap-4 ">
            <Button
              variant={isFollowing ? "secondary" : "outline"}
              onClick={handleFollow}
              className="h-7 w-28"
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button variant="outline" className="h-7 w-28">
              Message
            </Button>
          </div>
        )}
        {currentUser?.id == userInfo?.id && (
          <Link href="/pages/settings">
            <ToolTip name="Go to Settings">
              <Settings className="flex text-sky-700" />
            </ToolTip>
          </Link>
        )}
      </div>
      <div className="other-info flex flex-col justify-start gap-4">
        <div className="flex space-x-4 my-4 gap-8">
          <div className="flex gap-2">
            <p className="font-semibold">{userInfo?.totalPosts}</p>
            <p className="text-gray-500">Posts</p>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold">{userInfo?.totalFollowers}</p>
            <p className="text-gray-500">Followers</p>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold">{userInfo?.totalFollowing}</p>
            <p className="text-gray-500">Following</p>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-lg capitalize">{userInfo?.name}</h2>
          <p className="dark:text-gray-400 text-gray-700">{userInfo?.about}</p>
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
  </div>
);
