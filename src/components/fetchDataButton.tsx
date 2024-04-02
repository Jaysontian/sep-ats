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
            setMsg("Successfully synced data with the Airtable. Please reload to get new information.");
        },
    });

    return(
        <>
            <Button onClick={() => {
                setLoading(true);
                fetchNewApps.mutate();
            }} disabled={loading ? true : false}>
                {loading ? "Syncing with Airtable..." : "Sync Data"}
            </Button>
            <p className='py-4 text-green-400 text-sm'>{msg}</p>
        </>
    )
}