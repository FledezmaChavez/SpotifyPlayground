import { useState, useRef } from "react";
import { getTracks } from "../spotifyAPI";
import { spotifyRawToTrack } from "../../models/trackMapper";


const DEFAULT_LIMIT = 5;


export default function useTopTracks() {
    const [topTracks, setTopTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const cacheTopTracks = useRef(new Map())

    async function loadTopTracks(limit = DEFAULT_LIMIT) {
        setError(null);
        setLoading(true);

        if (cacheTopTracks.current.has(limit)) {
            let cachedTracks = cacheTopTracks.current.get(limit)
            setTopTracks([...cachedTracks])
            setLoading(false);
            return
        }

        try {
            const spotifyTracks = await getTracks(limit);
            const tracks = spotifyTracks.map(st => spotifyRawToTrack(st.track));
            cacheTopTracks.current.set(limit, tracks)
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

