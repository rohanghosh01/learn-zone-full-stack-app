"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, SmilePlus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import DropZone from "../fileUpload/DropZone";
import { useState, useRef } from "react";
import { LoadingButton } from "../loading-btn";
import * as API from "../../services/api";
import { upload } from "@/services/firebase";
import { ToolTip } from "../tooltip-provider";
import { Emoji } from "../use-emoji";
import { useSelector } from "react-redux";
export function CreateFeed({
  setLoading,
  loading,
  onUpdateFeeds,
  feeds,
  setFeeds,
}: any) {
  const [file, setFile] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const dialogCloseRef = useRef<any>(null);
  const currentUser = useSelector((state: any) => state?.user);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      let data: any = {};
      if (file) {
        let url: any = await upload(file.content, "feeds");

        let type = file.content.type.split("/")[0];

        data.content = [
          {
            type,
            url,
          },
        ];
      }
      if (description) {
        data.description = description;
      }

      let res: any = await API.createFeed(data);
      let newFeed = res.result;
      newFeed.userInfo = currentUser;
      let newFeeds = [newFeed, ...feeds];
      setFeeds(newFeeds);

      setFile(null);
      setDescription("");
      dialogCloseRef.current.click();
    } catch (error) {
      console.log("error on create feed", error);
      return;
    } finally {
      setLoading(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    setDescription((prevInput) => prevInput + emoji);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex" variant="outline">
          <span>New post</span>
          <Plus className="ml-1 h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] max-h-full min-h-[500px]  flex gap-4 flex-col m-0">
        <DialogHeader>
          <DialogTitle className="text-center h-10">Create Post</DialogTitle>
        </DialogHeader>
        <div className="flex gap-8 flex-col h-[450px]">
          <Textarea
            placeholder="Whats on your mind ..."
            onChange={(e) => setDescription(e.target.value)}
            className="relative"
            value={description}
          />
          <div className="absolute right-10 top-[20%] transform -translate-y-1/2 flex space-x-2 z-50">
            <div className="relative">
              <Button variant="outline" size="icon">
                <Emoji
                  insertEmoji={insertEmoji}
                  className="right-2 top-12 z-10000"
                />
              </Button>
            </div>
          </div>
          <div className="flex justify-center h-full">
            <DropZone files={file} setFiles={setFile} />
          </div>
        </div>
        <DialogFooter className="lg:justify-center md:justify-center">
          {loading ? (
            <LoadingButton />
          ) : (
            <Button type="submit" onClick={handleSubmit}>
              Create
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      <DialogClose ref={dialogCloseRef} />
    </Dialog>
  );
}
