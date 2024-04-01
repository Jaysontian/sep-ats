
import React from 'react'
import { api } from '~/trpc/server'
import { currentUser } from "@clerk/nextjs"

import { Card, CardContent } from "~/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"

import CandidateBoxWrapper from '../candidateList/candidateBoxWrapper'
import Image from 'next/image'
// type Props = {}

type uniqAppArray = Array<{
  applicant: {
    profile: {
      id: string;
      name: string;
      email: string;
    };
    uid: string;
  };
  id: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string;
  applicant_id: string;
  content: string;
  vote: number;
}>


export default async function RecentScroller(/*{}: Props*/) {

    const user = await currentUser();
    if (!user) return null;
    const data = await api.post.getRecentByID.query({ID: user.id});


    // This code creates an array of unique applicant posts sorted by latest update time
    const uniqApplicants = new Set();
    const uniqdata : uniqAppArray = data.filter(post => {
        const isDup = uniqApplicants.has(post.applicant.profile.id);
        if (!isDup){uniqApplicants.add(post.applicant.profile.id); return true}
        return false;
    });

    // Another Implementation with each recent person sorted with their post recent thing

    if (uniqdata == undefined || uniqdata.length == 0){
        return (<>
        <h2>History</h2>
        <p className="text-gray-500">No chat history yet. Submit an applicant review!</p>
        </>)
    }

    if (uniqdata == null) return <div>Nothing.</div>
    return (
    <div className="w-full">
        <h2>History</h2>
        <Carousel
            opts={{
                align: "start",
                dragFree: true,
            }}
            className="w-full overflow-x-visible"
        >
            <CarouselContent>
                {uniqdata.map((post, index) => (
                    <CarouselItem key={index} className=" basis-1/3 md:basis-1/4 lg:basis-1/5">
                        <div className="pr-0.2">
                            <CandidateBoxWrapper name={post.applicant.profile.name} candidateID={post.applicant.uid} >
                                <Card className="bg-zinc-700/50 text-white border-zinc-600 cursor-pointer hover:border-zinc-400">
                                    <CardContent className="flex flex-col items-left justify-center py-2 px-2">
                                        <div className="w-full h-[130px] relative rounded-md overflow-hidden mb-4">
                                            <Image src={post.applicant.profile.image} alt="profile" fill className="object-cover"></Image>
                                        </div>
                                        <span className="text-sm font-semibold truncate text-center">{post.applicant.profile?.name}</span>
                                        {/* <span className="text-xs text-zinc-400/80 py-1 truncate">{post.content}</span> */}
                                    </CardContent>
                                </Card>
                            </CandidateBoxWrapper>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden"/>
        </Carousel>
    </div>
    )
}