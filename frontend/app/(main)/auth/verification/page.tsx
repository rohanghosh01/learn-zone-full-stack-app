"use client";

import { toast } from "react-hot-toast";
import { VerificationForm } from "@/components/forms/verification-form";
import { setCookie } from "@/lib/cookie";
import { setUser } from "@/lib/nextSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import * as API from "../../../../services/api";

export default function Verification() {
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [token, setToken]: any = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    let verification_token: any = localStorage.getItem("verification_token");
    let forgot_token: any = localStorage.getItem("forgot_token");
    let tokenData = null;
    if (verification_token) {
      tokenData = {
        data: verification_token,
        type: "verify",
      };
    } else if (forgot_token) {
      tokenData = {
        data: forgot_token,
        type: "forgot",
      };
    }

    if (!tokenData) {
      router.push("/auth/login");
    }
    setToken(tokenData);
    setLoading(false);
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (token.type === "verify") {
        let res: any = await API.verification(data, token?.data);
        setCookie("token", JSON.stringify(res.accessToken));
        let user: any = await API.profile();

        dispatch(setUser(user.result));
        localStorage.removeItem("verification_token");
        router.push("/");
      } else if (token.type === "forgot") {
        let res: any = await API.verification(data, token?.data);
        localStorage.removeItem("forgot_token");
        localStorage.setItem("reset_token", JSON.stringify(res.accessToken));
        router.push("/auth/resetPassword");
      }
    } catch (error: any) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      let res: any = await API.resendOtp(token);
      toast.success(res.message);
      localStorage.setItem(
        "verification_token",
        JSON.stringify(res.accessToken)
      );
    } catch (error: any) {
      return false;
    } finally {
      setSeconds(30);
    }
  };

  return (
    <VerificationForm
      onSubmit={onSubmit}
      loading={loading}
      seconds={seconds}
      setSeconds={setSeconds}
      handleResend={handleResend}
    />
  );
}
