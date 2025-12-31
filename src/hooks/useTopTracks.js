import { useState } from "react";
import { getTracks } from "../spotifyAPI";

const DEFAULT_LIMIT = 5;

export default function useTopTracks() {
    const [topTracks, setTopTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function loadTopTracks(limit = DEFAULT_LIMIT) {
        setError(null);
        setLoading(true);

        try {
            const tracks = await getTracks(limit);
            setTopTracks(tracks);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return { topTracks, loadTopTracks, error, loading };
}
