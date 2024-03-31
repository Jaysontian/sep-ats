

import {api} from "~/trpc/react"


type AppSectionProps = {
    uid: string
}

export default function ApplicationSection({candidateID} : AppSectionProps){
    const app = api.candidate.getFormApplicationData.useQuery({uid : candidateID}, {
        refetchInterval: false,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });
    
    if (!app.data) return <div>Loading Application Data...</div>
    if (app.data.submitted == false) return <div className='my-2 text-red-400'>Application Not Submitted</div>
    return(
        <div className="text-left">
            <h2>APPLICATION</h2>
            <div>Year: {app.data.year}</div>
            <div>Major(s): {app.data.major}</div>
            <div>Submission Time: {app.data.time}</div>
            <div>Resume: <a href={app.data.portfolio} className="underline text-blue-500">Link</a></div>
            {/* <div>Prompt 1: {app.data.prompt1}</div> */}
        </div>
    )
}