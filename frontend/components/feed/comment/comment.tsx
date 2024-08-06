import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { ReplyList } from "./comment-reply-list";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { CommentAction } from "./comment-actions";
import { Button } from "@/components/ui/button";
import config from "../../../config/config.json";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
const defaultProfile = config.DEFAULT_PROFILE;
export function Comment({
  data,
  handleReply,
  handleCommentLike,
  handleCommentDelete,
}: any) {
  const [replyCount, setReplyCount] = useState(0);
  const [replyOpen, setReplyOpen] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const currentUser = useSelector((state: any) => state?.user);
  const [commentLikeCount, setCommentLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsLiked(data?.isLiked);
    setCommentLikeCount(data?.totalLikes);
    if (data) {
      let { replies, userInfo } = data;
      setReplyCount(replies?.length);
      if (userInfo?.id !== currentUser?.id) {
        setReplyOpen(true);
      }
    }
  }, [data]);

  const handleLike = (data: any) => {
    setIsLiked(!isLiked);
    handleCommentLike(data);
    if (isLiked) {
      setCommentLikeCount(commentLikeCount - 1);
    } else {
      setCommentLikeCount(commentLikeCount + 1);
    }
  };
  const handleProfileClick = () => {
    // dispatch(setProfileInfo(1));
    // setProfileOpen(true);
    router.push(`/pages/profile/${data?.userInfo?.id}`);
  };

  return (
    <Card className="border-0 rounded-none text-wrap">
      <CardHeader className="p-3 mr-4">
        <div className="flex gap-2 justify-start align-middle items-center cursor-pointer">
          <Avatar className="h-10 w-10 rounded-full cursor-pointer">
            <AvatarImage
              src={data?.userInfo?.profileImage || defaultProfile}
              alt="@shadcn"
              className="object-cover "
            />
          </Avatar>

          <CardTitle className="text-base">
            <Button
              variant="link"
              //  className="text-sky-400 m-0 p-0"
              onClick={handleProfileClick}
              className="dark:text-sky-400 text-sky-700 m-0 p-0 w-full"
            >
              {data?.userInfo.userName || data.userInfo?.name || "N/A"}
            </Button>
          </CardTitle>
          <div className="flex flex-col ml-auto justify-center items-center">
            <Heart
              // className="w-4 h-4 cursor-pointer"
              className={cn(
                "w-4 h-4 cursor-pointer",
                isLiked ? "fill-red-600 text-red-600" : ""
              )}
              onClick={() => handleLike(data)}
            />
            <p className="text-sm">{commentLikeCount}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-wrap break-words pb-1 w-auto">
        <CommentAction
          data={data}
          currentUser={currentUser}
          handleCommentDelete={handleCommentDelete}
          open={actionOpen}
          setOpen={setActionOpen}
        >
          <div className="w-full cursor-pointer">{data?.comment}</div>
        </CommentAction>
      </CardContent>

      <div className="flex flex-col gap-4  ml-6 p-0">
        {replyOpen && (
          <p
            className="text-sm font-medium cursor-pointer  dark:text-slate-400 text-slate-600 "
            onClick={() => handleReply(data)}
          >
            Reply
          </p>
        )}
        {replyCount ? (
          <p
            className="flex dark:text-slate-400 text-slate-600 text-sm font-medium cursor-pointer view-reply"
            onClick={() => setIsMore(!isMore)}
          >
            View {replyCount} replies
          </p>
        ) : (
          <></>
        )}

        {isMore && <ReplyList data={data?.replies} />}
      </div>
    </Card>
  );
}
