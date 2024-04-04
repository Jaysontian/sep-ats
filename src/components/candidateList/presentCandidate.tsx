"use client"
import React from 'react'
import { Button } from "../ui/button"
import { api } from "~/trpc/react"
import { useUser } from "@clerk/nextjs";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ApplicationSection from './applicationSection';
import Image from 'next/image';
// interface PresentButtonProps {
//   candidateID: string;
// }

interface PresentCandidateProps{
    name: string
    candidateID: string
    image: string
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

export default function PresentCandidate({close, candidateID, name, image} : PresentCandidateProps){
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
            <div className="w-full md:w-1/3">
                {pos.map((c, i) => (
                    <div key={i} className="bg-green-700/10 border-green-600/50 border rounded p-1 my-1"><span className="text-green-500">{c.authorName}:</span> {c.content}</div>
                ))}
            </div>
            <div className="w-full md:w-1/3">
                {neu.map((c, i) => (
                    <div key={i} className="bg-blue-700/10 border-blue-600/50 border rounded p-1 my-1"><span className="text-blue-500">{c.authorName}:</span> {c.content}</div>
                ))}
            </div>
            <div className="w-full md:w-1/3">
                {neg.map((c, i) => (
                    <div key={i} className="bg-red-700/10 border-red-600/50 border rounded p-1 my-1"><span className="text-red-500">{c.authorName}:</span> {c.content}</div>
                ))}
            </div>
        </>)
    }

    return (
        <div className="fixed bg-black/75 w-full h-full top-0 left-0 flex justify-center z-50">
            <div className="bg-zinc-900 w-screen m-2 md:m-6 rounded-lg border border-zinc-700 p-2 md:p-4 px-4 md:px-10 overflow-y-scroll">
                <div className="mx-auto w-full text-center flex gap-4 justify-between">
                    <div className="w-2/3">
                        <h1 className="text-xl font-bold my-2">{name}</h1>
                        <div>UID: {candidateID}</div>
                        <ApplicationSection candidateID={candidateID} />
                    </div>
                    {image != "" && image != undefined ? 
                    <div className="w-1/3 h-[250px] relative rounded-md overflow-hidden mb-4 border border-white/25 cursor-pointer" onClick={()=>{window.open(image);}}>
                        <Image src={image} alt="profile" fill className="object-cover"></Image>
                    </div> : <></>}
                </div>
                <div>
                    <h1 className="text-lg font-semibold py-4">Comments</h1>
                    <div className="w-full flex flex-col md:flex-row gap-4">
                        <CommentSection />
                    </div>
                </div>
                <Button onClick={close} className='px-8 border border-gray-600' >Close</Button>
            </div>
        </div>
    );
}
