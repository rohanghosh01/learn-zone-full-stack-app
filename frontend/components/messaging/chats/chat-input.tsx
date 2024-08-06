import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { ToolTip } from "@/components/tooltip-provider";
import { Paperclip, Send, Reply, File, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Emoji } from "@/components/use-emoji";
import { formatDate } from "@/lib/format-date";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { convertSize } from "@/lib/file-size-convert";

export const ChatInput = ({
  setMessages,
  setInput,
  messages,
  input,
  sendMessage,
  scrollDown,
  isEdit,
  handleSubmit,
  handleInputChange,
  replied,
  setReplied,
  files,
  setFiles,
  uploading,
}: any) => {
  const inputLength = input.trim().length;
  const inputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState(false);

  const insertEmoji = (emoji: string) => {
    setInput((prevInput: any) => prevInput + emoji);
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
  }, [inputRef.current, isEdit, replied]);

  const handleFileUpload = (e: any) => {
    let files = e.target.files || [];
    if (files.length > 10) {
      setWarning(true);
      return;
    }

    if (files.length) {
      Array.from(files).forEach((file: any, index: number) => {
        setFiles((prev: any) => [
          ...prev,
          {
            file: file,
            id: uuidv4(),
            preview: URL.createObjectURL(file),
            type: file.type.split("/")[0],
            name: file.name,
            size: file.size,
          },
        ]);
      });
    } else {
      setFiles([]);
    }
  };

  const handleFileRemove = (data: any) => {
    console.log(">>");
    let filterData = files.filter((file: any) => file.id !== data.id);
    if (filterData.length > 10) {
      setWarning(true);
      return;
    } else {
      setFiles(filterData);
    }
  };

  useEffect(() => {
    if (files.length > 10) {
      setWarning(true);
      return;
    }
  }, [files]);

  return (
    <div className="mt-2 relative flex justify-center">
      {replied?.status && (
        <div className="absolute bottom-16 left-4 w-[95%]  h-auto min-h-[40px] dark:bg-secondary bg-gray-200 p-2 rounded-lg">
          <Reply className="w-5 h-5" />

          <div className="text-sm max-h-[220px] min-h-[70px] chat-scroll flex flex-col gap-2">
            {replied?.file ? (
              replied?.file?.type == "image" ? (
                <div className="w-40 max-h-40 min-h-20">
                  <img
                    src={replied?.file?.url}
                    alt="file"
                    className="w-full h-full object-cover"
                  />
                  <span className="text-xs">
                    {replied?.name}, {formatDate(replied?.time)}
                  </span>
                </div>
              ) : replied?.file?.type == "video" ? (
                <div className="w-60 h-40">
                  <video controls width="100%" height="100%">
                    <source src={replied?.file?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <span className="text-xs">
                    {replied?.name}, {formatDate(replied?.time)}
                  </span>
                </div>
              ) : (
                <div className="dark:bg-gray-900 bg-gray-100 w-40  h-full rounded-sm p-4">
                  <File className="w-10 h-10" />
                  <div className="flex mt-8 text-xs flex-col gap-[2px]">
                    {/* <span className="font-semibold">{file.name}</span> */}
                    <span className="text-muted-foreground max-w-40">
                      {replied?.file?.size} | {replied?.file?.type}
                    </span>
                    <span className="text-xs">
                      {replied?.name}, {formatDate(replied?.time)}
                    </span>
                  </div>
                </div>
              )
            ) : (
              <>
                <span className=" text-muted-foreground">
                  {replied?.message}
                </span>
                <span className="text-xs">
                  {replied?.name}, {formatDate(replied?.time)}
                </span>
              </>
            )}
          </div>
          <button
            className="absolute top-1 right-2 text-gray-500"
            onClick={() => setReplied({ status: false, message: null })}
          >
            ✕
          </button>
        </div>
      )}
      {files.length && !uploading ? (
        <div className="absolute bottom-16 left-4 md:w-[95%] w-100 h-[220px] dark:bg-secondary bg-gray-200 p-2 rounded-lg ">
          <div className="text-sm h-full w-full flex flex-col gap-2">
            <div className="files grid md:grid-cols-5 grid-cols-2  h-[200px] w-full overflow-hidden gap-2 items-center chat-scroll">
              {files.map((file: any, index: any) => (
                <div key={index} className="w-full h-[200px]">
                  <div className="flex w-full h-[200px] flex-col p-1 relative">
                    {file.type == "image" ? (
                      <div className="w-full h-full">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : file.type == "video" ? (
                      <div className="flex w-full h-full">
                        <video controls width="100%" height="100%">
                          <source src={file.preview} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="dark:bg-gray-900 bg-gray-100 w-full h-[200px] rounded-sm p-4">
                        <File className="w-10 h-10" />
                        <div className="flex mt-8 text-xs flex-col gap-[2px]">
                          <span className="font-semibold w-40 truncate">
                            {file.name}
                          </span>
                          <span className="text-muted-foreground">
                            {convertSize(file?.size)} | File
                          </span>
                        </div>
                      </div>
                    )}
                    <button
                      className="absolute top-1 right-1"
                      onClick={() => handleFileRemove(file)}
                    >
                      <CrossCircledIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
              {files.length < 10 && (
                <div className="flex w-[40%] h-[200px] flex-col rounded-lg dark:bg-gray-900 bg-gray-100 relative items-center justify-center overflow-visible">
                  <Plus className="w-10 h-10" />
                  <input
                    type="file"
                    className="absolute opacity-0 w-10 h-5"
                    onChange={handleFileUpload}
                    multiple
                    max={10}
                  />
                </div>
              )}
            </div>
          </div>
          <button
            className="absolute -top-3 -right-1 text-gray-500"
            onClick={() => setFiles([])}
          >
            <CrossCircledIcon className="w-6 h-6" />
          </button>
        </div>
      ) : (
        ""
      )}

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center space-x-2"
        tabIndex={0}
      >
        <Input
          id="message"
          placeholder="Type your message..."
          className="flex-1 relative h-12"
          autoComplete="off"
          value={input}
          onChange={handleInputChange}
          ref={inputRef}
          autoFocus
          tabIndex={0}
        />
        <div className="absolute right-5  flex">
          <ToolTip name="Attach file" side="top">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              type="button"
            >
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
              <input
                type="file"
                className="absolute opacity-0 w-10 h-5"
                onChange={handleFileUpload}
                multiple
              />
            </Button>
          </ToolTip>
          <Button variant="ghost" size="icon" type="button">
            <Emoji
              insertEmoji={insertEmoji}
              className="right-0 top-[-450px] z-10000"
            />
          </Button>

          <ToolTip name="Send" side="top">
            <Button
              type="submit"
              size="icon"
              disabled={inputLength === 0 && !files.length}
              variant="ghost"
              className="ml-auto"
            >
              <Send className="size-5" />
              <span className="sr-only">Send</span>
            </Button>
          </ToolTip>
        </div>
      </form>

      <Dialog open={warning} onOpenChange={setWarning}>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center gap-10">
            <DialogTitle>Too many files selected</DialogTitle>
            <DialogDescription>
              You have picked too may files. Limit is 10.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setFiles([])}
              >
                OK
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
