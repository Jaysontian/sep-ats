import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { UserButton } from "@clerk/nextjs";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "SEP ATS App" });


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">

        <UserButton afterSignOutUrl="/"/>

        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest.query();
  const allPosts = await api.post.getAll.query();


  return (
    <div className="w-half w-1/2">
      {latestPost ? (
        <p className="truncate">Most recent post: {latestPost.content}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <div className='bg-red w-full'>
        {[...allPosts]?.map((post : any)=>(
          <div key={post.id} className='flex justify-between'>
            <p>{post.content}</p>
            <p>{post.authorName}</p>
          </div>
        ))}
      </div>

      <CreatePost />
    </div>
  );
}
