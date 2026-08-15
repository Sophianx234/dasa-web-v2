import { redirect } from "next/navigation";
import { getUserAction } from "@/app/actions/apiActions";
import AccountClient from "./AccountClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your personal information and profile.",
};

export default async function AccountPage() {
  const res = await getUserAction("");

  if (res?.status !== "success" || !res.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-50 pt-24 pb-12">
      <AccountClient initialUser={res.user} />
    </main>
  );
}
