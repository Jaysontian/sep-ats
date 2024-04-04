

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
            <div><span className="text-blue-400">Year:</span> {app.data.year}</div>
            <div><span className="text-blue-400">Major(s):</span> {app.data.major}</div>
            {/* <div>Submission Time: {app.data.time}</div> */}
            <div><span className="text-blue-400">Resume:</span> <a href={app.data.portfolio} target="_blank" className="underline text-blue-500">Link</a></div>
            <details>
                <summary className="text-blue-400 cursor-pointer hover:text-blue-500">What inspires or motivates you?</summary>
                <p className="my-2">{app.data.prompt1}</p>
            </details>
            <details>
                <summary className="text-blue-400 cursor-pointer hover:text-blue-500">Outside of professional endeavours and academics, what are you passionate about?</summary>
                <p className="my-2">{app.data.prompt2}</p>
            </details>
            <details>
                <summary className="text-blue-400 cursor-pointer hover:text-blue-500">What has been one of your best ideas and how have you / do you plan to make it happen?</summary>
                <p className="my-2">{app.data.prompt3}</p>
            </details>
            <div><span className="text-blue-400">Files/Portfolios/Decks:</span> {app.data.file1 ? <a href={app.data.file1} target="_blank" className="text-green-500">Click here</a> : <span className="text-red-500">None Submitted</span>}</div>
            <div><span className="text-blue-400">Website / Links:</span> {app.data.link1 ? app.data.link1 : <span className="text-red-500">None Submitted</span>}</div>
            {/* {app.data.link1 != "" && app.data.link1 != undefined ? <div><span className="text-blue-400">Website / More Links:</span> {app.data.link1} </div> : <></>} */}
        </div>
    )
}