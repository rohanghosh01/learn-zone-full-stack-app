"use_client";
import { getJson } from "@/lib/get-json";

export default function RootPage() {
  let data = getJson();

  return <div>{data}</div>;
}
