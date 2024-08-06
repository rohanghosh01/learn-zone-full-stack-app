import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Learn zone | Live",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
