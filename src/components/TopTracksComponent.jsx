import { useState } from "react";
import { TrackListComponent } from "./TrackListComponent";
import useTopTracks from "../hooks/useTopTracks";
import "../App.css";

const TOP_TRACKS_LIMITS = [5, 10, 20, 50, 100];

export function TopTracksComponent() {
    const { topTracks, loadTopTracks,refresh, error, loading } = useTopTracks();
    const [limit, setLimit] = useState(TOP_TRACKS_LIMITS[0]);

    return (
        <div className="panelBody">
            <h3>Saved tracks to retrieve:</h3>
            <div className="tracks-controls ">
                <div className="btn-group">
                    {TOP_TRACKS_LIMITS.map((l) => (
                        <button
                            key={l}
                            className={`btn-group-item ${limit === l ? "active" : ""}`}
                            onClick={() => setLimit(l)}
                            disabled={loading}
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <div>
                    <button
                        className="primary-btn"
                        onClick={() => loadTopTracks(limit)}
                        disabled={loading}
                    >
                        {loading ? "Loading Tracks..." : "Get Tracks!"}
                    </button>

                    <button
                        className="refresh-btn"
                        onClick={() => {refresh(limit)}}   
                        disabled={!limit || loading}
                        title="Bypass cache and fetch fresh data"
                    >
                        Refresh
                    </button>

                </div>
            </div>

            {error && <div className="errorBox">{error}</div>}

            {loading && (
                <div role="status" className="loadingMessage">
                    Fetching your top tracks...
                </div>
            )}

            {!loading && <TrackListComponent tracks={topTracks} />}
        </div>
    );
}
