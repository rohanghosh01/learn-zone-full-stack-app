"use client";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  X,
  Check,
  SmilePlus,
} from "lucide-react";
import { VideoPlayer } from "../video-player";
import { ToolTip } from "../tooltip-provider";
import { cn } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setProfileInfo } from "@/lib/nextSlice";
import { FeedMore } from "../feed-more";
import * as API from "../../services/api";
import { UpdateFeed } from "./update-feed";
import { Input } from "../ui/input";
import { CommentsDialog } from "./comment/comment-list";
import { Emoji } from "../use-emoji";
import config from "../../config/config.json";
import { ShareDialog } from "./feed-share";
import { usePathname, useRouter } from "next/navigation";
const defaultProfile = config.DEFAULT_PROFILE;
export function Feed({
  data: feedData,
  onUpdateFeeds,
  setFeeds,
  feeds,
  isGrid,
  tab,
}: any) {
  const [data, setData] = useState<any>(feedData);
  const { title, description, content, userInfo, userId } = data;
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLikeAllowed, setIsLikeAllowed] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [counts, setCounts] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
  });

  const [editedTitle, setEditedTitle] = useState("");
  const [contentLoading, setContentLoading] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUser = useSelector((state: any) => state?.user);
  const router = useRouter();
  const pathname = usePathname();
  const profilePath = pathname.split("/")[2] === "profile";
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCounts({
      likes: data?.totalLikes,
      comments: data?.totalComments,
      shares: data?.totalShare,
    });
    setIsLiked(data?.isLiked);
    setIsSaved(data?.isSaved);
    setEditedTitle(data?.description);
  }, [data]);

  useEffect(() => {
    setData(feedData);
  }, [feedData]);

  const dispatch = useDispatch();
  const handleLike = async () => {
    if (!isLikeAllowed) {
      return; // Do nothing if like is not allowed
    }

    setIsLikeAllowed(false);
    setIsLiked(!isLiked);
    await API.likeDislike(data.id);

    if (isLiked) {
      setCounts({
        likes: counts.likes - 1,
        comments: counts.comments,
        shares: counts.shares,
      });
    } else {
      setCounts({
        likes: counts.likes + 1,
        comments: counts.comments,
        shares: counts.shares,
      });
    }
    setTimeout(() => {
      setIsLikeAllowed(true);
    }, 4000);
  };
  const handleSave = async () => {
    setIsSaved(!isSaved);
    await API.saveFeed(data.id);
  };
  const handleProfileClick = () => {
    router.push(`/pages/profile/${userId}`);
  };

  const handleDelete = async () => {
    await API.deleteFeed(data.id);
    // onUpdateFeeds(data.id);
    let filteredFeed = feeds.filter((feed: any) => feed.id !== data.id);
    setFeeds(filteredFeed);
  };
  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const insertEmoji = (emoji: string) => {
    setEditedTitle((prevInput) => prevInput + emoji);
  };

  const handleUpdateTitle = async () => {
    if (editedTitle.trim() === "") {
      toast.error("Title cannot be empty");
      return;
    }

    await API.updateFeed({ uid: data.id, description: editedTitle });
    onUpdateFeeds();
    setIsEdit(false);
  };

  const handleCommentCount = async () => {
    setCounts({
      likes: counts.likes,
      comments: counts.comments + 1,
      shares: counts.shares,
    });
  };

  // const handleCommentCount = async () => {
  //   handleCount();
  // };

  const handleImageLoad = () => {
    setContentLoading(false);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  useEffect(() => {
    setTimeout(() => {
      if (inputRef?.current) {
        const inputElement = inputRef.current;
        inputElement.focus();
        const length = inputElement.value.length;
        inputElement.setSelectionRange(length, length);
      }
    });
  }, [inputRef.current, isEdit]);
  return (
    <Card
      className={cn(
        isGrid
          ? "h-[420px]  xl:w-[400px] lg:w-[350px] md:w-[300px] max-sm:w-[300px]"
          : "lg:w-[700px]  md:w-[750px] sm:w-[700px] max-[659px]:w-[500px] max-[500px]:w-[350px]  mx-6",
        !isGrid && content?.length < 0
          ? "sm:h-[660px] md:h-[690px]  lg:h-[620px]"
          : ""
      )}
    >
      <div className="flex flex-row items-center">
        <Avatar className="h-12 w-12 rounded-full m-2 cursor-pointer">
          <AvatarImage
            src={userInfo?.profileImage || defaultProfile}
            alt="@shadcn"
            className="rounded-full object-cover"
          />
        </Avatar>

        <Button
          variant="link"
          className="text-sky-400 m-0 p-0"
          onClick={handleProfileClick}
        >
          {userInfo?.userName || data.userInfo?.name || "N/A"}
        </Button>
        {userId !== currentUser?.id && !isGrid && (
          <Button
            className="h-7 ml-3 overflow-hidden"
            variant={isFollowing ? "secondary" : "outline"}
            onClick={handleFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )}

        {userId == currentUser?.id && (
          <div className="flex ml-auto mr-4 mb-3 cursor-pointer">
            <FeedMore handleDelete={handleDelete} handleEdit={handleEdit} />
          </div>
        )}
      </div>

      <CardHeader>
        {isEdit ? (
          <div className="flex gap-2 relative">
            <Input
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              className="w-full p-2 border rounded"
              ref={inputRef}
            />
            <div className="absolute cursor-pointer right-24 top-1/2 transform -translate-y-1/2 flex space-x-2 z-50">
              <div className="relative">
                <Emoji
                  insertEmoji={insertEmoji}
                  className={cn(
                    profilePath
                      ? "-left-16 top-[40px]"
                      : "right-2 top-12 z-10000"
                  )}
                />
              </div>
            </div>
            <ToolTip name="update">
              <Button onClick={handleUpdateTitle} variant="outline" size="icon">
                <Check className="h-4 w-4" />
              </Button>
            </ToolTip>

            <ToolTip name="close">
              <Button
                onClick={() => {
                  setIsEdit(false);
                }}
                variant="outline"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </ToolTip>
          </div>
        ) : (
          <>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </>
        )}
      </CardHeader>
      {content?.length ? (
        content?.map((item: any, index: number) => (
          <CardContent
            className="flex justify-center max-h-[650px]"
            key={index}
          >
            {item?.type == "video" ? (
              <VideoPlayer
                url={item.url}
                onLoad={handleImageLoad}
                isGrid={isGrid}
              />
            ) : (
              <img
                src={item?.url}
                // src="/assets/feedimage.svg"
                alt="feed"
                className={cn(
                  "object-fit",
                  isGrid ? "max-h-[190px]" : "max-h-[650px]"
                )}
                onLoad={handleImageLoad}
              />
            )}
            {contentLoading && (
              <div className="loading-indicator">
                Loading...
                <img
                  src="/assets/feedImage.svg"
                  alt="feed"
                  className={cn("object-fit", isGrid ? "max-h-[400px]" : "")}
                />
              </div>
            )}
          </CardContent>
        ))
      ) : (
        <></>
      )}
      <CardFooter
        className={cn(
          "flex gap-4 cursor-pointer p-3",
          isGrid && content?.length == 0 ? "h-[500px]" : ""
        )}
      >
        <ToolTip name={isLiked ? "liked" : "like"}>
          <div className="flex flex-col gap-1 text-center justify-center">
            <Heart
              className={cn(isLiked ? "fill-red-600 text-red-600" : "")}
              onClick={handleLike}
            />

            <p className="w-full text-xs">{counts.likes}</p>
          </div>
        </ToolTip>
        <ToolTip name="comment">
          <div
            className="flex flex-col gap-1 text-center justify-center"
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <MessageCircle />
            <p className="w-full text-xs">{counts.comments}</p>
          </div>
        </ToolTip>
        <ShareDialog>
          <ToolTip name="share">
            <div className="flex flex-col gap-1 text-center justify-center">
              <Share2 />
              <p className="w-full text-xs">{counts.shares}</p>
            </div>
          </ToolTip>
        </ShareDialog>

        <ToolTip name={isSaved ? "saved" : "save"}>
          <div className="flex flex-col gap-1 text-center justify-center ml-auto">
            <Bookmark
              className={cn(
                isSaved ? "dark:fill-slate-300 fill-slate-900" : ""
              )}
              onClick={handleSave}
            />
          </div>
        </ToolTip>
      </CardFooter>
      {commentOpen && (
        <CommentsDialog
          open={commentOpen}
          setOpen={setCommentOpen}
          feedId={data.id}
          handleCommentCount={handleCommentCount}
          counts={counts}
          setCounts={setCounts}
        />
      )}
    </Card>
  );
}
