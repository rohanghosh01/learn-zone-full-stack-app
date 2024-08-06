import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Learn zone | Home",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
