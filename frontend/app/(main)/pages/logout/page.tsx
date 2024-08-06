"use client";
import { setUser } from "@/lib/nextSlice";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";

export default function Profile() {
  const dispatch = useDispatch();
  document.cookie = `token=; path=/;`;
  dispatch(setUser(null));

  return redirect("/auth/login");
}
