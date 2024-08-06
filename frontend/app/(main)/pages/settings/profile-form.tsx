"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import { UserAvatar } from "../../../../components/user-avatar";
import * as api from "../../../../services/api";
import { LogOut, SmilePlus } from "lucide-react";
import Link from "next/link";
import { Emoji } from "@/components/use-emoji";
import { ToolTip } from "@/components/tooltip-provider";
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  about: z.string().max(160).min(4),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({
  data,
  handleUpload,
  fileUrl,
  uploading,
  refreshUser,
}: any) {
  const defaultValues: Partial<ProfileFormValues> = {
    name: data?.name || "",
    about: data?.about || "",
  };
  const [isEdit, setIsEdit] = useState(true);
  const [openEmoji, setOpenEmoji] = useState(false);
  const emojiContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  async function onSubmit(data: ProfileFormValues) {
    try {
      if (fileUrl) {
        //@ts-ignore
        data.profileImage = fileUrl;
      }
      await api.updateProfile(data);
      refreshUser();
      setIsEdit(true);
    } catch (error) {
      console.log(error);
    }
  }
  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsEdit(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleUpload(selectedFile);
      setIsEdit(false);
    }
  };

  const insertEmoji = (emoji: any) => {
    const { about } = form.getValues();
    let value = about + emoji;
    form.setValue("about", value);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiContainerRef.current &&
        !emojiContainerRef.current.contains(event.target as Node)
      ) {
        setOpenEmoji(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiContainerRef]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <UserAvatar
          size="large"
          handleFileChange={handleFileChange}
          url={fileUrl || data?.profileImage}
          uploading={uploading}
          profile={true}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Snow" {...field} disabled={isEdit} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                    disabled={isEdit}
                  />
                  <div
                    className="w-auto absolute  top-5 right-5 m-0 p-0"
                    ref={emojiContainerRef}
                  >
                    <Button variant="outline" size="icon">
                      <Emoji
                        insertEmoji={insertEmoji}
                        className="right-[-50px] top-[-470px] z-10000"
                      />
                    </Button>
                  </div>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          {isEdit ? (
            <Button type="button" onClick={handleEdit}>
              Edit profile
            </Button>
          ) : (
            <Button type="submit">Update profile</Button>
          )}
        </div>
      </form>
    </Form>
  );
}
