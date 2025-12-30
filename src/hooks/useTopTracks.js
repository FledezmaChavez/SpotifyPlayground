import {  useState } from "react";
import { getTracks } from "../spotifyAPI";


const DEFAULT_LIMIT = 5;

export default function useTopTracks() {

    const [topTracks, setTopTrack] = useState([]);
    const [error, setError] = useState(null);
    
    const [loading, setLoading] = useState(false);




    async function loadTopTracks(limit=DEFAULT_LIMIT) {
        try {
            setError(null);
            setLoading(true);
            const track = await getTracks(limit);
            setTopTrack(track);
            setLoading(false);
        } catch (e) {
            setError(e.message);
        }
    }



    return { topTracks, loadTopTracks, error,loading }

}