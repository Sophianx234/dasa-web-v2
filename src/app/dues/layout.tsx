import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dues & Donations",
  description: "Support the Dagbon Students Association. Pay your membership dues or make a donation to help fund our community initiatives.",
};

export default function DuesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
