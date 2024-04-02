"use client"
import React, { useState } from 'react'
import { Button } from "../ui/button"
import { api } from "~/trpc/react"
import { useUser } from "@clerk/nextjs";
import PresentCandidate from './presentCandidate';

interface PresentButtonProps {
  candidateID: string
  name: string
}

export default function PresentButton({candidateID, name} : PresentButtonProps){
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
        return <PresentCandidate close={click} candidateID={candidateID} name={name} />
    }

    return (
        <Button onClick={click}>Present</Button>
    );
}
