"use client"
import React from 'react'
import { Button } from "../ui/button"
import { api } from "~/trpc/react"
import { useUser } from "@clerk/nextjs";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ApplicationSection from './applicationSection';

// interface PresentButtonProps {
//   candidateID: string;
// }

interface PresentCandidateProps{
    name: string
    candidateID: string
    close: ()=>void
}

type CommentArray = Array<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    authorName: string;
    applicant_id: string;
    content: string;
    vote: number;
}>

export default function PresentCandidate({close, candidateID, name} : PresentCandidateProps){
    const {user, isLoaded} = useUser();

    const comments = api.post.getAllByApplicant.useQuery({ApplicantID: candidateID}, {
        refetchInterval: false,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });
    

    const pos : CommentArray = [];
    const neg : CommentArray = [];
    const neu : CommentArray = [];

    if (comments.data != undefined) {
        comments.data.forEach(obj => {
            if(obj.vote == -1) neg.push(obj);
            if(obj.vote == 0) neu.push(obj);
            if(obj.vote == 1) pos.push(obj);
        });
    }

    if (!isLoaded || !user) return null;
    const CommentSection = () => {
        return(<>
            <div className="w-1/3">
                {pos.map((c, i) => (
                    <div key={i} className="bg-green-700/10 border-green-600/50 border rounded p-1 my-1"><span className="text-green-500">{c.authorName}:</span> {c.content}</div>
                ))}
            </div>
            <div className="w-1/3">
                {neu.map((c, i) => (
                    <div key={i} className="bg-blue-700/10 border-blue-600/50 border rounded p-1 my-1"><span className="text-blue-500">{c.authorName}:</span> {c.content}</div>
                ))}
            </div>
            <div className="w-1/3">
                {neg.map((c, i) => (
                    <div key={i} className="bg-red-700/10 border-red-600/50 border rounded p-1 my-1"><span className="text-red-500">{c.authorName}:</span> {c.content}</div>
                ))}
            </div>
        </>)
    }

    return (
        <div className="fixed bg-black/75 w-full h-full top-0 left-0 flex justify-center">
            <div className="bg-zinc-900 w-screen m-12 rounded-lg border border-zinc-700 p-4 px-10">
                <div className="mx-auto w-1/2 text-center">
                    <h1 className="text-xl font-bold my-2">{name}</h1>
                    <div>UID: {candidateID}</div>
                    <ApplicationSection candidateID={candidateID} />
                </div>
                <div>
                    <h1 className="text-lg font-semibold py-4">Comments</h1>
                    <div className="w-full flex gap-4">
                        <CommentSection />
                    </div>
                </div>
                <Button onClick={close}>Close</Button>
            </div>
        </div>
    );
}
