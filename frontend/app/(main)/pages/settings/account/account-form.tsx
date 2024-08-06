"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import DatePicker from "react-multi-date-picker";
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
import Link from "next/link";

const accountFormSchema = z.object({
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
  dob: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm({ data, handleUpdate }: any) {
  const defaultValues: Partial<AccountFormValues> = {
    userName: data?.userName || "",
    email: data?.email || "",
    dob: data?.dob || "",
  };
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });
  function onSubmit(data: AccountFormValues) {
    handleUpdate(data);
  }

  const handleDateChange = (date: any) => {
    if (date.isValid) {
      let dob = date.format().toString();
      form.setValue("dob", dob);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johnsnow" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
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
                Want to change email{" "}
                <Link href="#" className="underline text-cyan-600">
                  Contact us
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <>
                <DatePicker
                  value={field.value || ""}
                  onChange={handleDateChange}
                  format={"DD/MM/YYYY"}
                  maxDate={new Date()}
                  render={<Input />}
                />
              </>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
