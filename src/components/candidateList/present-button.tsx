"use client"
import React, { useState } from 'react'
import { Button } from "../ui/button"
import { api } from "~/trpc/react"
import { useUser } from "@clerk/nextjs";
import PresentCandidate from './presentCandidate';
import { User } from "lucide-react"

interface PresentButtonProps {
  candidateID: string
  name: string
  imgsrc: string
}

export default function PresentButton({candidateID, name, imgsrc} : PresentButtonProps){
    const {user, isLoaded} = useUser();
    const [modal, showModal] = useState(false);

    const permittedEmails = [
        "jaysontian444@gmail.com",
        "jaysontian@g.ucla.edu",
        "allieyyoung@gmail.com",
        "allieyoung@g.ucla.edu"
    ]

    const click = () => {
        showModal(!modal);
    }

    if (!isLoaded || !user) return null;

    // if (!permittedEmails.includes(user?.emailAddresses[0]?.emailAddress)) return <></>

    if (modal) {
        return <PresentCandidate close={click} candidateID={candidateID} name={name} image={imgsrc} />
    }

    return (
        <Button onClick={click} className="px-2 text-[14px] border border-white/15">Profile<User width={20} className="pl-1" /></Button>
    );
}
