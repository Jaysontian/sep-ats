"use client"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

import { type ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type ColumnData = {
  children: ReactNode;
  name: string;
  candidateID: string;
};

export default function CandidateCard(props: ColumnData) {
    const router = useRouter();
    const [content, setContent] = useState("");
    const {user, isLoaded} = useUser();
    const [open, setOpen] = useState(false);
    
    const createPost = api.post.create.useMutation({
      onSuccess: () => {
        router.refresh();
        setContent("");
        console.log("Successfully posted comment");

    
        setOpen(false);
      },
    });
    
    if (!isLoaded || !user) return null;

    const postComment = () => {
      if (content == "" || content == null){alert("Empty input"); return;}
      createPost.mutate({
          content: content,
          authorId: user.id,
          authorName: user.fullName!,
          applicant: props.candidateID,
      });
    }


  return (
    <Drawer shouldScaleBackground open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent className="mx-4 self-center bg-white outline-none">
        <div className="bg-red m-auto max-w-[500px]">
          <DrawerHeader>
            <DrawerTitle>{props.name}</DrawerTitle>
            <DrawerDescription>
              Submit a comment about this candidate.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Textarea value={content} onChange={e => setContent(e.target.value)}>{content}</Textarea>
            <div className="flex justify-between gap-2">
              <Button onClick={()=>{postComment()}}>Submit</Button>
              <Button>Criteria 2</Button>
              <Button>Criteria 3</Button>
            </div>
            <DrawerClose className="my-2">
              <button>Close</button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
