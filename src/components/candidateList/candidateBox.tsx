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
import { cn } from "~/lib/utils";

type ColumnData = {
  children: ReactNode;
  name: string;
  candidateID: string;
  comments: {content: string; vote: number;}[];
};

type CommentArray = Array<{content: string; vote: number;}>;

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

  const postComment = (vote : number) => {
    if (content == "" || content == null){alert("Empty input"); return;}
    createPost.mutate({
        content: content,
        authorId: user.id,
        authorName: user.fullName!,
        applicant: props.candidateID,
        vote: vote,
    });
  }

  const coms : CommentArray = props.comments ? props.comments : [];

  //console.log("BOX PRINITNG:", coms);

  return (
    <Drawer shouldScaleBackground open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent className="sm:mx-0 md:mx-12 bg-white outline-none">
        <div className="w-full text-left md:w-2/5 mx-auto">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="my-1">{props.name}</DrawerTitle>
            {coms.map((c, i) => (
              <div key={i} className={cn('border-[1.5px] p-1.5 text-[14px] rounded-md bg-blue-200 border-blue-300', {
                  'bg-red-200 border-red-300' : (c.vote == -1), 
                  'bg-green-200 border-green-300' : (c.vote == 1),
                })}>
                {c.content}
              </div>))}
          </DrawerHeader>
          <DrawerFooter className="pt-0">
            <Textarea className="text-[16px] my-4 h-48" value={content} placeholder="Comment about this candidate..." onChange={e => setContent(e.target.value)}>{content}</Textarea>
            <div className="flex gap-2 w-full justify-between">
              <Button className="bg-red-500 text-white hover:bg-red-600 w-3/4" onClick={()=>{postComment(-1)}}><ThumbsDown size={16} /></Button>
              <Button className="bg-blue-500 text-white hover:bg-blue-600 w-3/4" onClick={()=>{postComment(0)}}>Submit</Button>
              <Button className="bg-green-500 text-white hover:bg-green-600 w-3/4" onClick={()=>{postComment(1)}}><ThumbsUp size={16} /></Button>
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
