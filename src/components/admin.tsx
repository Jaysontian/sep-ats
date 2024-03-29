
import { currentUser } from "@clerk/nextjs"
import FetchDataButton from "./fetchDataButton";

import { CreatePost } from "~/components/create-post";
import { api } from "~/trpc/server";

export async function Admin(){ 
    const latestPost = await api.post.getLatest.query();
    const allPosts = await api.post.getAll.query();


    const user = await currentUser();
    if (!user) return <div>Not logged in</div>;
    const email = user?.emailAddresses[0]?.emailAddress;
    console.log(email);

    if (email == "jaysontian444@gmail.com"){
        return(
            <div className="w-1/2">
                <h2>Admin Area</h2>
                <FetchDataButton />

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