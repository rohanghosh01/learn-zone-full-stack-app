import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { ReplyList } from "./comment-reply-list";

export function CommentReply({ data }: any) {
  let isReply = true;

  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <Card className="border-x-0 border-0 rounded-none text-wrap">
      <CardHeader className="p-3 mr-4">
        <div className="flex gap-2 justify-start align-middle items-center">
          <img
            src="/assets/defaultProfile.webp"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />

          <CardTitle className="text-base">
            <Link
              href="/profile"
              className="dark:text-sky-400 text-sky-700 m-0 p-0 w-full"
            >
              @test_user111
            </Link>
          </CardTitle>
          <div className="flex flex-col ml-auto justify-center items-center">
            <Heart className="w-4 h-4 cursor-pointer" />
            <p className="text-sm">10k</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap break-words pb-1">
        {data}
      </CardContent>
      {/* {isReply && <ReplyList data={data} />} */}
    </Card>
  );
}
