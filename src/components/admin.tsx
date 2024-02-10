
import { currentUser } from "@clerk/nextjs"
import FetchDataButton from "./fetchDataButton";


export async function Admin(){ 
    const user = await currentUser();
    if (!user) return <div>Not logged in</div>;
    const email = user?.emailAddresses[0]?.emailAddress;
    console.log(email);

    if (email == "jaysontian444@gmail.com"){
        return(
            <div className="w-1/2">
                <h2>Admin Area</h2>
                <FetchDataButton />
            </div>
        )
    }
    return null
}