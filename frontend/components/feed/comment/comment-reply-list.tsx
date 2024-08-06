import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";

export function ReplyList({ data }: any) {
  let isReply = false;
  return data && data.length ? (
    data.map((reply: any, index: any) => (
      <Card className="border-0 rounded-none text-wrap" key={index}>
        <CardHeader className="p-3 mr-4">
          <div className="flex gap-2 justify-start align-middle items-center">
            <img
              src={reply.userInfo.profileImage || "/assets/defaultProfile.webp"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />

            <CardTitle className="text-base">
              <Link
                href="/profile"
                className="dark:text-sky-400 text-sky-700 m-0 p-0 w-full"
              >
                {reply?.userInfo?.name}
              </Link>
            </CardTitle>
            <Heart className="w-4 h-4 ml-auto cursor-pointer" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap break-words pb-1">
          {reply?.comment}
        </CardContent>
        {/* {replyOpen && (
          <div className="flex flex-col gap-4  ml-6 p-0">
            <p className="text-sm font-medium cursor-pointer  dark:text-slate-400 text-slate-600 ">
              Reply
            </p>
          </div>
        )} */}
      </Card>
    ))
  ) : (
    <></>
  );
}
