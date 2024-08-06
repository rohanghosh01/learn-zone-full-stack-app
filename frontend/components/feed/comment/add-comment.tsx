"use client";

import { useState } from "react";
import { Send, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolTip } from "../../tooltip-provider";
import Link from "next/link";
import { CommentsDialog } from "./comment-list";
import { Emoji } from "../../use-emoji";

export function AddComment({ open, setOpen }: any) {
  const [commentInput, setCommentInput] = useState("");
  const [isMore, setIsMore] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  let commentData = ["hello", "good"];
  const [comments, setComments] = useState<string[]>(commentData);

  const insertEmoji = (emoji: string) => {
    setCommentInput((prevInput) => prevInput + emoji);
  };

  const handleAddComment = () => {
    if (commentInput.trim() !== "") {
      setComments([...comments, commentInput.trim()]);
      setCommentInput("");
    }
  };

  return (
    <div className="w-full px-2 pb-4">
      <div className="space-y-3">
        <p className="text-sm">Comments</p>
        {comments.map((comment, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <img
                src="/assets/defaultProfile.webp"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="bg-gray-300 dark:bg-gray-700  px-2 pb-1 rounded-lg">
              <Link
                href="/profile"
                className="dark:text-sky-400 text-sky-700  m-0 p-0"
              >
                @test_user111
              </Link>
              <p className="text-sm p-0 m-0">{comment}</p>
            </div>
          </div>
        ))}
        <Button variant="link" size="sm" onClick={() => setIsMore(true)}>
          view more...
        </Button>
      </div>
      <div className="relative flex mt-4">
        <Textarea
          className="flex-grow rounded-lg border-gray-300"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2  z-50">
          <div className="relative">
            <Button variant="outline" size="icon">
              <Emoji
                insertEmoji={insertEmoji}
                className="right-2 top-12 z-10000"
              />
            </Button>
          </div>
          <ToolTip name="comment">
            <Button variant="outline" size="icon" onClick={handleAddComment}>
              <Send className="h-4 w-4" />
            </Button>
          </ToolTip>
        </div>
      </div>
      <CommentsDialog open={isMore} setOpen={setIsMore} />
    </div>
  );
}
