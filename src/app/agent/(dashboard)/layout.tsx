import { redirect } from "next/navigation";
import { Sidebar } from "@/components/agent/Sidebar";
import { Topbar } from "@/components/agent/Topbar";
import { getSessionUser } from "@/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  
  if (!user) {
    redirect("/agent/login");
  }

  return (
    <div className="min-h-screen flex bg-[#F5F5F5] font-sans text-[#1A1A1A]">
      <Sidebar user={user} />
      
      <main className="flex-1 ml-[240px] flex flex-col min-h-screen overflow-x-hidden">
        <Topbar user={user} />
        
        <div className="p-8 flex-1 w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
