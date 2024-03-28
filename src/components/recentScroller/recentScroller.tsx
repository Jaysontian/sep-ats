
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

import CandidateBox from '../candidateList/candidateBox'

// type Props = {}

export default async function RecentScroller(/*{}: Props*/) {

    const user = await currentUser();
    if (!user) return null; 
    const data = await api.post.getRecentByID.query({ID: user.id});


    // This code creates an array of unique applicant posts sorted by latest update time
    const uniqApplicants = new Set();
    const uniqdata = data.filter(post => {
        const isDup = uniqApplicants.has(post.applicant.profile?.id);
        if (!isDup){uniqApplicants.add(post.applicant.profile?.id); return true}
        return false;
    });

    if (uniqdata.length == 0){
        return (<>
        <h2>Recents</h2>
        <p className="text-gray-500">No chat history yet. Submit an applicant review!</p>
        </>)
    }


    return (
    <div className="w-full">
        <h2>Recents</h2>
        <Carousel
            opts={{
                align: "start",
                dragFree: true,
            }}
            className="w-full overflow-x-visible"
        >
            <CarouselContent>
                {uniqdata.map((post, index) => (
                <CarouselItem key={index} className=" basis-1/3 md:basis-1/2 lg:basis-1/3">
                    <div className="pr-0.2">
                        <CandidateBox name={post.applicant.profile?.name as string} candidateID={post.applicant.uid as string}>
                            <Card className="bg-zinc-700/50 text-white border-zinc-600 cursor-pointer hover:border-zinc-400">
                                <CardContent className="flex flex-col items-left justify-center py-4 px-2">
                                    <span className="text-sm font-semibold">{post.applicant.profile?.name}</span>
                                    <span className="text-xs text-zinc-400/80 py-1 truncate">{post.content}</span>
                                </CardContent>
                            </Card>
                        </CandidateBox>
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