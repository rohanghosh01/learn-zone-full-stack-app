"use client";
import { useEffect, useState, useRef } from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "../../../hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Comment } from "./comment";
import { CommentInput } from "./comment-input";
import * as API from "../../../services/api";
import Loader from "@/components/loading";
import { Loader2 } from "lucide-react";

interface CommentsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  feedId?: number;
  handleCommentCount?: (count: number) => void;
  setCounts?: any;
  counts?: any;
}

export function CommentsDialog({
  open,
  setOpen,
  feedId,
  handleCommentCount,
  setCounts,
  counts,
}: CommentsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const containerType = isDesktop ? "Dialog" : "Drawer";
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({ limit: 10, offset: 0 });
  const scrollRef: any = useRef(null);
  const [replyData, setReplyData] = useState(null);
  const [isMore, setIsMore] = useState(true);

  const getComments = async (refetch?: any) => {
    if (!isMore) return;
    try {
      const res: any = await API.commentList({ feedId, ...query });
      console.log(">>");
      setCounts({
        likes: counts.likes,
        comments: res.count,
        shares: counts.shares,
      });
      if (refetch) {
        setComments(res.results);
      } else {
        setComments((prevComments) => {
          const existingIds = new Set(
            prevComments.map((comment: any) => comment.id)
          );
          const filteredComments = res.results.filter(
            (comment: any) => !existingIds.has(comment.id)
          );

          return [...prevComments, ...filteredComments];
        });
      }
    } catch (error: any) {
      if (error.message == "404") {
        setIsMore(false);
      }
      // console.error("Error getting comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (data: any) => {
    setReplyData(data);
  };

  useEffect(() => {
    getComments();
  }, [query]);

  const refetchComments = () => {
    setQuery({ limit: 10, offset: 0 });
    getComments(true);
  };

  useEffect(() => {
    setIsMore(true);
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // Using the functional form of setState to ensure we're working with the most up-to-date state
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

  const handleCommentLike = (data: any) => {
    try {
      let res: any = API.commentLike({
        feedId: data.feedId,
        commentId: data.id,
      });
    } catch (error) {
      console.log("error comment like", error);
    }
  };
  const handleCommentDelete = (data: any) => {
    try {
      let res: any = API.commentDelete({
        feedId: data?.feedId,
        commentId: data?.id,
      });

      let filteredComment = comments.filter(
        (comment: any) => comment?.id !== data?.id
      );

      setComments(filteredComment);
      setCounts({
        likes: counts.likes,
        comments: counts.comments - 1,
        shares: counts.shares,
      });
    } catch (error) {
      console.log("error comment like", error);
    }
  };

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      scrollRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef.current]);

  const Comments = () => {
    return (
      <>
        {comments.length ? (
          comments.map((comment, index) => (
            <Comment
              key={index}
              data={comment}
              isDesktop={isDesktop}
              containerType={containerType}
              handleReply={handleReply}
              handleCommentLike={handleCommentLike}
              handleCommentDelete={handleCommentDelete}
            />
          ))
        ) : (
          <div className="p-4 h-[200px] w-full flex items-center justify-center">
            <div className="font-bold text-lg flex align-middle items-center">
              No comments yet
            </div>
          </div>
        )}
      </>
    );
  };

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center w-full overflow-hidden">
            Comments
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center" ref={scrollRef}>
            <Loader2 className="w-10 h-10 animate-spin " />
          </div>
        ) : (
          <>
            <div
              className={cn(
                isDesktop ? "max-h-[600px]" : "max-h-[400px]",
                "p-2 overflow-y-auto"
              )}
              ref={scrollRef}
            >
              <Comments />
            </div>

            <DialogFooter className="w-full">
              <CommentInput
                comments={comments}
                setComments={setComments}
                feedId={feedId}
                refetchComments={refetchComments}
                handleCommentCount={handleCommentCount}
                replyData={replyData}
                setReplyData={setReplyData}
              />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex h-[600px] overflow-hidden">
        <DrawerHeader>
          <DrawerTitle className="flex justify-center w-full overflow-hidden">
            Comments
          </DrawerTitle>
        </DrawerHeader>

        {loading ? (
          <div
            className="flex justify-center items-center mb-10"
            ref={scrollRef}
          >
            <Loader2 className="w-10 h-10 animate-spin " />
          </div>
        ) : (
          <>
            <div
              className={cn(
                isDesktop ? "h-[600px]" : "h-[400px]",
                "p-2 overflow-y-auto"
              )}
              ref={scrollRef}
            >
              <Comments />
            </div>
            <DrawerFooter className="pt-2 w-full">
              <CommentInput
                comments={comments}
                setComments={setComments}
                feedId={feedId}
                refetchComments={refetchComments}
                handleCommentCount={handleCommentCount}
                replyData={replyData}
                setReplyData={setReplyData}
              />
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
