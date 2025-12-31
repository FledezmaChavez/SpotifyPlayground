import { useState } from "react";
import { TrackListComponent } from "./TrackListComponent";
import useTopTracks from "../hooks/useTopTracks";
import '../App.css'

const TOP_TRACKS_LIMITS = [5, 10, 20, 50, 100];

export function TopTracksComponent() {

    const { topTracks, loadTopTracks, error,loading } = useTopTracks();
    const [limit, setLimit] = useState(TOP_TRACKS_LIMITS[0]);

    return (
        <div className="panelBody">
            <h3>Saved tracks to retrieve:</h3>
            <div className="tracks-controls ">
                <div className="btn-group">
                    {TOP_TRACKS_LIMITS.map(l => (
                        <button key={l}
                            className={`btn-group-item ${limit === l ? "active" : ""}`}
                            onClick={() => setLimit(l)}>
                            {l}
                        </button>
                    ))}
                </div>
                <div>
                    <button className="primary-btn" onClick={() => loadTopTracks(limit)} >
                        Get Tracks!
                    </button>
                    </div>

            </div>

            {error && <div className="errorBox">{error}</div>}

            {loading && <div>Loading Tracks...</div>}
            {!loading && <TrackListComponent tracks={topTracks} />}
        </div>
    );

}

