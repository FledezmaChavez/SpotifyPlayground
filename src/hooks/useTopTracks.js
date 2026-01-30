import { useState, useRef } from "react";
import { getTracks } from "../spotifyAPI";
import { spotifyRawToTrack } from "../models/trackMapper";


const DEFAULT_LIMIT = 5;
const TTL = 1000 * 60 * 2; // 2 min


export default function useTopTracks() {
    const [topTracks, setTopTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const cacheTopTracks = useRef(new Map())
    const inflightTopTracks = useRef(new Map());
    const requestIdRef = useRef(0)


    async function loadTopTracks(limit = DEFAULT_LIMIT) {
        const myId = ++requestIdRef.current; 
        setError(null);

        const cached = cacheTopTracks.current.get(limit);

        if (cached && (Date.now() - cached.cachedAt) < TTL) {
            let { tracks } = cached;
            setTopTracks(tracks);
            return;
        }

        const inflight = inflightTopTracks.current.get(limit);
        if(inflight){
            try{
                setLoading(true); 
                const tracks = await inflight; 
                if(myId === requestIdRef.current){
                    setTopTracks(tracks)
                }
            }catch(e){
                if(myId === requestIdRef.current){
                    setTopTracks([])
                    setError(e.message || "Failed to load tracks")
                }
            }finally{
                if(myId === requestIdRef.current){
                    setLoading(false)
                }
            }
            return;
        }

        const promise = (async()=>{
            const spotifyTracks = await getTracks(limit); 
            const tracks = spotifyTracks.map(st => spotifyRawToTrack(st.track)); 
            cacheTopTracks.current.set(limit, {tracks: [...tracks], cachedAt: Date.now()}); 
            return tracks; 
        })()

        inflightTopTracks.current.set(limit, promise)


        try {
            setLoading(true);
            const tracks = await promise;
            if(myId === requestIdRef.current){
                setTopTracks(tracks);
            }
        } catch (e) {
            if(myId === requestIdRef.current){
                setTopTracks([]);
                setError(e.message || "Failed to load tracks");
            }
        } finally {
            inflightTopTracks.current.delete(limit)
            if(myId === requestIdRef.current){
                setLoading(false);
            }
        }
    }

    function refresh(limit) {
        cacheTopTracks.current.delete(limit)
        loadTopTracks(limit)
    }



    return { topTracks, loadTopTracks, refresh, error, loading };
}
