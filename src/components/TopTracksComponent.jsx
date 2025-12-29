import { useState } from "react";
import { getTracks } from "../spotifyAPI";

export function TopTracksComponent() {

    const [error, setError] = useState(null);
    const [topTracks, setTopTrack] = useState([]);

    async function loadTopTracks(limit = 20) {
        try {
            const track = await getTracks(limit);
            setTopTrack(track);
        } catch (e) {
            setError(e.message);
        }
    }


    return (
        <div className="panelBody">
            {/* This to refactor this to get rid of the default value */}
            <button className="secondaryBtn" onClick={()=>loadTopTracks(5)}>
                Load latest 20
            </button>

            {error && <div className="errorBox">{error}</div>}

            {topTracks.length > 0 && (
                <ul className="list">
                    {topTracks.map(t => (
                        <li key={t.track.id} className="listItem">
                            <span className="trackName">{t.track.name}</span>
                            <span className="trackMeta">{t.track.artists.map(a => a.name).join(", ")}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}