"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { LoadingButton } from "../loading-btn";
import Loader from "@/components/loading";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import * as API from "../../services/api";
const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function VerificationForm({
  loading,
  onSubmit,
  handleResend,
  seconds,
  setSeconds,
}: any) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds: any) => prevSeconds - 1);
      }, 1000); // Update every second
    }

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [seconds]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen flex justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-zinc-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center mb-2">
              OTP Verification
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password sent to your email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {loading ? (
                  <LoadingButton
                    type="outline"
                    className="w-full dark:hover:bg-slate-500 dark:bg-slate-700 bg-slate-200 hover:bg-slate-300"
                  />
                ) : (
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Submit
                  </button>
                )}

                <div className="flex items-center align-middle justify-center">
                  <Button
                    variant="link"
                    className={cn(
                      "m-0 p-1 font-normal text-base font",
                      seconds == 0
                        ? "text-primary-600 hover:underline dark:text-primary-500"
                        : " text-black dark:text-gray-400"
                    )}
                    onClick={handleResend}
                    disabled={seconds > 0}
                  >
                    Resend OTP {seconds > 0 ? `in ${seconds} second` : ""}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </section>
  );
}
