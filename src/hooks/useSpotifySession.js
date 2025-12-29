import { useState,useEffect,useRef } from "react";
import { handleSpotifyCallback, loginWithSpotify } from "../spotifyAuth";
import { refreshAccessToken } from "../spotifyRefresh";
import { getMe } from "../getMe";

  function is401(err){
        return String(err?.message || "").includes("401")
    }

const STATUS = {
    loading:"loading", 
    unauthenticated: "unauthenticated", 
    authenticated:"authenticated",
    error:"error"
}

export function useSpotifySession() {
    const didInit = useRef(false);

    const [user, setUser]= useState(null);
    const [status,setStatus] = useState(STATUS.loading);
    const [error, setError]= useState(); 

    function logout(){
    sessionStorage.clear();
    setUser(null)
    setError(null)
    setStatus(STATUS.unauthenticated)
}

    useEffect(()=>{
        if(didInit.current)return; 
        didInit.current = true; 

        async function init(){
            try{
                const isRedirect = window.location.search.includes("code="); 
                if(isRedirect){
                    await handleSpotifyCallback();
                }

        const hasToken = !!sessionStorage.getItem("spotify_access_token")
        if(!hasToken){
            setStatus(status.unauthenticated)
            return;
        }

        try{
            const me = await getMe()
            setUser(me);
            setStatus(STATUS.authenticated)
        }catch(e){
            if(is401(e)){
                await refreshAccessToken()
                const me = getMe()
                setUser(me)
                setStatus(STATUS.authenticated)
            }else{
                throw e
            }
        } 
            }catch(e){
                setError(e?.message || "Unknown error")
                setStatus("error")
            }
        }

        init()
    },[])

    return {
        user, status,error,isAuthenticated: status === "authenticated", login: loginWithSpotify, logout
    }
    
}

