import { unstable_noStore as noStore } from "next/cache";

import { UserButton } from "@clerk/nextjs";

import { Admin } from "~/components/admin"
import { api } from "~/trpc/server";

import CandidateList from "~/components/candidateList/candidateList";
import RecentScroller from "~/components/recentScroller/recentScroller";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "SEP ATS App" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black/95 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">

        <UserButton afterSignOutUrl="/"/>

        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>

        <CrudShowcase />

        <Admin/>
        
      </div>
    </main>
  );
}

async function CrudShowcase() {

  return (
    <div className="w-2/3">
        <RecentScroller />
        <CandidateList />
    </div>
  );
}
