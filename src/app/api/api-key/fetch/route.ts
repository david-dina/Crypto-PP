import { cookies } from "next/headers";

export const GET = async (req: Request) => {
    
    const cookieStore = cookies()
    const cookieName = cookieStore.get("auth_session")
    if (cookieName === undefined){
        return new Response("Unauthorized", {status: 401,});
    }else{
        return new Response(
            JSON.stringify({ message: "OK", sessionId: cookieName.value }), 
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );}

};