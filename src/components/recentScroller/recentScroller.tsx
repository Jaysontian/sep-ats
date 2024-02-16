
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
        const isDup = uniqApplicants.has(post.applicant);
        if (!isDup){uniqApplicants.add(post.applicant); return true}
        return false;
    });

    if (uniqdata.length == 0){
        return (<p>No chat history yet. Submit an applicant review!</p>)
    }


    return (
    <>
        <h2>Recents</h2>
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-vw overflow-x-visible"
        >
            <CarouselContent>
                {uniqdata.map((post, index) => (
                <CarouselItem key={index} className=" basis-2/5 md:basis-1/2 lg:basis-1/5">
                    <div className="pr-0.2">
                        <CandidateBox name="John" candidateID={post.applicant}>
                            <Card className="bg-zinc-700/50 text-white border-zinc-600 cursor-pointer hover:border-zinc-400">
                                <CardContent className="flex flex-col items-left justify-center py-4 px-2">
                                    <span className="text-sm font-semibold">{post.applicant}</span>
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
    </>
    )
}