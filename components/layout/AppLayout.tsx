"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64 w-full lg:w-[calc(100%-16rem)]">
        <TopBar />
        <main className="flex-1 pb-20 lg:pb-0 safe-area-inset-bottom">
          <div className="p-4 md:p-6 pb-24 lg:pb-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
