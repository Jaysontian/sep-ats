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

import { ThumbsDown, ThumbsUp } from "lucide-react";

type ColumnData = {
  children: ReactNode;
  name: string;
  candidateID: string;
};

export default function CandidateBox(props: ColumnData) {
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
      <DrawerContent className="sm:mx-0 md:mx-12 bg-white outline-none">
        <div className="w-full md:w-2/5 mx-auto">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="my-1">{props.name}</DrawerTitle>
            <DrawerDescription className="text-[14px]">
              Submit a comment about this candidate.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-0">
            <Textarea className="text-[16px] my-4 h-48" value={content} onChange={e => setContent(e.target.value)}>{content}</Textarea>
            <div className="flex gap-2 w-full justify-between">
              <Button className="bg-blue-500 text-white hover:bg-blue-600 w-3/4" onClick={()=>{postComment()}}>Submit</Button>
              <Button disabled><ThumbsUp size={16} /></Button>
              <Button disabled><ThumbsDown size={16} /></Button>
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
