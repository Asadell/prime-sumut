import { LoginClient } from "./LoginClient";
import { getSessionUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Agent Login - Prime Property",
};

export default async function AgentLogin() {
  const user = await getSessionUser();
  if (user) {
    redirect("/agent/dashboard");
  }

  return <LoginClient />;
}
