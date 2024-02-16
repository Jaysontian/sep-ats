"use client"
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export default function FetchDataButton(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const fetchNewApps = api.candidate.fetchNewApps.useMutation({
        onSuccess: () => {
            router.refresh();
            setLoading(false);
            setMsg("Successfully added new applicants");
        },
    });

    return(
        <>
            <Button onClick={() => {
                setLoading(true);
                fetchNewApps.mutate();
            }}>
                {loading ? "Fetching..." : "Fetch New Data"}
            </Button>
            <p className='py-4'>{msg}</p>
        </>
    )
}