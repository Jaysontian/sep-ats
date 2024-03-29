
import React from 'react'
import type { ReactNode } from 'react';
import CandidateBox from './candidateBox'
import { api } from "~/trpc/server";
import { currentUser } from "@clerk/nextjs"

type ColumnData = {
  children: ReactNode;
  name: string;
  candidateID: string;
};

type CommentArray = Array<{content: string; vote: number;}>;

export default async function CandidateBoxWrapper(props: ColumnData) {

  const user = await currentUser();
  if (!user) return null;

  //console.log("INFORMATION: ", user, props.candidateID);

  const data = await api.post.getApplicantByID.query({ID: user.id, ApplicantID: props.candidateID}); 
  const comments : CommentArray = [];

  data.forEach((comment)=>{
    comments.push({
      content: comment.content,
      vote: comment.vote,
    })
  });

  return (
    <>
      <CandidateBox name={props.name} candidateID={props.candidateID} comments={comments}>
        {props.children}
      </CandidateBox>
    </>
  )
}