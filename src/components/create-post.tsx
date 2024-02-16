"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  
  const router = useRouter();
  const [content, setContent] = useState("");
  const { user, isLoaded } = useUser();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });


  if (!isLoaded || !user) return (<div>Loading...</div>)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({
            content: content,
            authorId: user.id,
            authorName: user.fullName!,
            applicant: "505956202", // for testing assume it's my UID
        });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
