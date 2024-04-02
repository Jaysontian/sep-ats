
import { currentUser } from "@clerk/nextjs"
import FetchDataButton from "./fetchDataButton";

import { CreatePost } from "~/components/create-post";
import { api } from "~/trpc/server";




export async function Admin(){ 
    const latestPost = await api.post.getLatest.query();
    const allPosts = await api.post.getAll.query();
    const allCandidates = await api.candidate.getAllApps.query();


    const user = await currentUser();
    if (!user) return <div>Not logged in</div>;
    const email = user?.emailAddresses[0]?.emailAddress;

    if (email == "jaysontian444@gmail.com"){
        return(
            <div className="w-full my-12">
                <h2>Admin Area</h2>
                <FetchDataButton />
                <h2>Posts Backup</h2>
                <div className="w-full h-[200px] bg-white text-black text-xs overflow-scroll rounded-md p-1">{JSON.stringify(allPosts)}</div>
                <h2>Applicants Backup</h2>
                <div className="w-full h-[200px] bg-white text-black text-xs overflow-scroll rounded-md p-1">{JSON.stringify(allCandidates)}</div>

                {/* <h2>Post Testing</h2>
                {latestPost ? (

                <p className="truncate">Most recent update: {latestPost.content}</p>
                ) : (
                <p>You have no posts yet.</p>
                )}
                <div className='bg-red w-full my-6'>
                {[...allPosts]?.map((post)=>(
                    <div key={post.id} className='flex justify-between'>
                    <p>{post.content}</p>
                    <p>{post.authorName}</p>
                    </div>
                ))}
                </div>
                <CreatePost /> */}
            </div>
        )
    }
    return null
}