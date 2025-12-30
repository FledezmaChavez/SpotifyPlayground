import { useState } from "react";
import { getTracks } from "../spotifyAPI";
import { TrackListComponent } from "./TrackListComponent";

import '../App.css'


export function TopTracksComponent() {

    const [error, setError] = useState(null);
    const [topTracks, setTopTrack] = useState([]);
    const topTracksLimit = getTopTrackLimits();
    const [limit,setLimit] = useState(5);

    async function loadTopTracks() {
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
            <h3>Select how many saved tracks to retrieve:</h3>
            <div className="tracks-controls ">
          <div className="btn-group">
            {topTracksLimit.map(l => (
                <button key={l} 
                className={`btn-group-item ${limit === l ? "active":""}`}
                onClick={()=> setLimit(l)}>
                    {l}
                </button>
            ))}
          </div>
          <div><button className="primary-btn" onClick={loadTopTracks}>Get Tracks!</button></div>

            </div>

            {error && <div className="errorBox">{error}</div>}

            <TrackListComponent tracks={topTracks}/>
        </div>
    );

}

function getTopTrackLimits(){
    return [5,10,20,50,100];
}