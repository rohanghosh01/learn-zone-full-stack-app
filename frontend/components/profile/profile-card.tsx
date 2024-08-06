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
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { UserAvatar } from "../user-avatar";
import * as api from "../../services/api";
import { LogOut } from "lucide-react";
import Link from "next/link";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  userName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
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
    ...data,
    userName: data?.userName || "",
    about: data?.about || "",
  };
  const [isEdit, setIsEdit] = useState(true);
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

  return (
    <Card className="my-2 mx-3 p-6 m-w-[200px] max-w-[800px]">
      <CardHeader>
        <CardTitle className="text-center overflow-hidden">
          My Profile
        </CardTitle>
      </CardHeader>
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
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johnsnow" {...field} disabled={isEdit} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym. You can only change this once every 30 days.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input {...field} disabled />
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym. You can only change this once every 30 days.
                </FormDescription>
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
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                    disabled={isEdit}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-evenly">
            {isEdit ? (
              <Button type="button" onClick={handleEdit}>
                Edit profile
              </Button>
            ) : (
              <Button type="submit">Update profile</Button>
            )}
            <Link href="/pages/logout">
              <Button
                type="button"
                className="ml-auto flex gap-3"
                variant="destructive"
              >
                Logout
                <LogOut className="w-5 h-5 ml-auto" />
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
}
