import React from 'react'
import type { ReactNode } from 'react';
import CandidateBox from './candidateBox'
import { api } from "~/trpc/server";

type ColumnData = {
  children: ReactNode;
  name: string;
  candidateID: string;
  userID: string;
};

type CommentArray = Array<{content: string; vote: number;}>;

export default async function CandidateBoxWrapper(props: ColumnData) {

  if (!props.userID) return null;

  const data = await api.post.getApplicantByID.query({ID: props.userID, ApplicantID: props.candidateID}); 
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