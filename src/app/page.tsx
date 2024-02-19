import { unstable_noStore as noStore } from "next/cache";

import { UserButton } from "@clerk/nextjs";

import { Admin } from "~/components/admin"
import { api } from "~/trpc/server";
import Image from "next/image";

import logo from "src/styles/logo.png"

import RecentScroller from "~/components/recentScroller/recentScroller";
import CandidateList from "~/components/candidateList/candidateList";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "SEP ATS App" });

  return (
    <main className="flex min-h-screen flex-col bg-black/95 text-white">
      <nav className="w-full p-4 flex justify-between">
        <Image src={logo} alt="SEP Logo" width={55} height={35}/>
        <UserButton afterSignOutUrl="/"/>
      </nav>
      <div className="md:w-2/3 sm:w-full flex flex-col px-4 mx-auto">
          <RecentScroller />
          <CandidateList />
        <Admin/>
        
      </div>
    </main>
  );
}
