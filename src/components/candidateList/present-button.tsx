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

    const click = () => {
        showModal(!modal);
    }

    if (!isLoaded || !user) return null;

    if (modal) {
        return <PresentCandidate close={click} candidateID={candidateID} name={name} />
    }

    return (
        <Button onClick={click}>Present</Button>
    );
}
