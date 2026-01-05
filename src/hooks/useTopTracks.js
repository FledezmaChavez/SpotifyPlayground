import { useState, useRef } from "react";
import { getTracks } from "../spotifyAPI";
import { spotifyRawToTrack } from "../../models/trackMapper";


const DEFAULT_LIMIT = 5;
const TTL = 1000 * 60 * 2; // 2 min


export default function useTopTracks() {
    const [topTracks, setTopTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const cacheTopTracks = useRef(new Map())

    async function loadTopTracks(limit = DEFAULT_LIMIT) {
        setError(null);
        
        if (cacheTopTracks.current.has(limit) && (Date.now() - cacheTopTracks.current.get(limit).cachedAt) < TTL) {
            let {tracks} = cacheTopTracks.current.get(limit)
            setTopTracks(tracks)
            return
        }

        try {
            setLoading(true);
            const spotifyTracks = await getTracks(limit);
            const tracks = spotifyTracks.map(st => spotifyRawToTrack(st.track));
            cacheTopTracks.current.set(limit, {tracks:[...tracks], cachedAt: Date.now()});
            setTopTracks(tracks);
        } catch (e) {
            setTopTracks([]);
            setError(e.message || "Failed to load tracks");
        } finally {
            setLoading(false);
        }
    }



return { topTracks, loadTopTracks, error, loading };
}

