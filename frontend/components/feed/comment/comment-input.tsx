import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolTip } from "../../tooltip-provider";
import { Button } from "@/components/ui/button";
import { Send, SmilePlus } from "lucide-react";
import { Emoji } from "../../use-emoji";
import * as API from "../../../services/api";

export const CommentInput = ({
  refetchComments,
  feedId,
  handleCommentCount,
  comments,
  setComments,
  setReplyData,
  replyData,
}: any) => {
  const [commentInput, setCommentInput] = useState("");
  const [isMore, setIsMore] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [placeholder, setPlaceholder] = useState("Add a comment...");
  const insertEmoji = (emoji: string) => {
    setCommentInput((prevInput) => prevInput + emoji);
  };

  useEffect(() => {
    if (replyData) {
      setPlaceholder(`Reply to ${replyData?.userInfo?.name}`);
    }
  }, [placeholder, replyData]);
  const handleAddComment = async () => {
    let insertData: any = {};
    let trimmedComment = commentInput.trim();
    insertData = {
      feedId,
    };
    if (trimmedComment) {
      insertData.comment = trimmedComment;
      if (replyData) {
        insertData.parentId = replyData.id;
      }
      try {
        let res: any = await API.addComment(insertData);
        handleCommentCount();
        refetchComments();
        setCommentInput("");
        setReplyData(null);
      } catch (error) {
        console.log("error add comment", error);
      }
    }
  };
  return (
    <div className="relative flex mt-4 w-full">
      <Textarea
        className="flex-grow rounded-lg border-gray-300 w-full h-20"
        placeholder={placeholder}
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
      />
      {/* {replyData && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex space-x-2  z-50 text-zinc-100 font-semibold">
          Reply to {replyData?.userInfo?.name}
        </div>
      )} */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2  z-50">
        <div className="relative">
          <Button variant="outline" size="icon">
            <Emoji
              insertEmoji={insertEmoji}
              className="right-[-50px] top-[-470px] z-10000"
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
  );
};
