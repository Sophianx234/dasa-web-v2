import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wall of Secrets",
  description: "Share your thoughts, confessions, and messages anonymously with the DaSA community on the Wall of Secrets.",
};

export default function AnonymousLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
