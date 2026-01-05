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

        const cached = cacheTopTracks.current.get(limit)

        if (cached && (Date.now() - cached.cachedAt) < TTL) {
            let { tracks } = cached
            setTopTracks(tracks)
            return
        }

        try {
            setLoading(true);
            const spotifyTracks = await getTracks(limit);
            const tracks = spotifyTracks.map(st => spotifyRawToTrack(st.track));
            cacheTopTracks.current.set(limit, { tracks: [...tracks], cachedAt: Date.now() });
            setTopTracks(tracks);
        } catch (e) {
            setTopTracks([]);
            setError(e.message || "Failed to load tracks");
        } finally {
            setLoading(false);
        }
    }

    function refresh(limit) {
        cacheTopTracks.current.delete(limit)
        loadTopTracks(limit)
    }



    return { topTracks, loadTopTracks, refresh, error, loading };
}

