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
import { Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import DropZone from "../fileUpload/DropZone";
import { useState, useRef, useEffect } from "react";
import { LoadingButton } from "../loading-btn";
import * as API from "../../services/api";
import { upload } from "@/services/firebase";
export function UpdateFeed({
  setLoading,
  loading,
  onUpdateFeeds,
  open,
  setOpen,
  data,
}: any) {
  const [file, setFile] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [currentFile, setCurrentFile] = useState<any>(null);
  const dialogCloseRef = useRef<any>(null);

  useEffect(() => {
    setDescription(data?.description);
    setCurrentFile(data?.content[0]);
  }, []);

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
      onUpdateFeeds();
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

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="sm:max-w-[825px] max-h-[250px] min-h-[100px]  flex gap-4 flex-col m-0">
        <DialogHeader>
          <DialogTitle className="text-center h-10">Update Post</DialogTitle>
        </DialogHeader>
        <div className="flex gap-8 flex-col h-[450px]">
          <Textarea
            placeholder="Whats on your mind ..."
            onChange={(e) => setDescription(e.target.value)}
            defaultValue={description}
          />
          {/* <div className="flex justify-center h-full">
            {currentFile ? (
              <div className="flex w-full gap-4">
                <DropZone files={file} setFiles={setFile} />
                <div className="flex-grow">
                  {currentFile?.type === "video" ? (
                    <video controls className="h-[300px]  rounded-md w-[300px]">
                      <source src={currentFile?.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={currentFile.url}
                      className="h-[300px]  rounded-md w-[300px]"
                      alt="Preview"
                    />
                  )}
                </div>
              </div>
            ) : (
              <DropZone files={file} setFiles={setFile} />
            )}
          </div> */}
        </div>
        <DialogFooter className="lg:justify-center md:justify-center">
          {loading ? (
            <LoadingButton />
          ) : (
            <Button type="submit" onClick={handleSubmit}>
              Update
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      <DialogClose ref={dialogCloseRef} />
    </Dialog>
  );
}
