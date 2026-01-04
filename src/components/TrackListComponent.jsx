import { TrackItemComponent } from "./TrackItemComponent";

export function TrackListComponent({ tracks }) {

    if(!tracks?.length){
        return <div className="listEmpty">No tracks yet - pick a limit and load</div>
    }

    return (
        <div className="trackList">
            <div className="listScroll">
            <div className="listHeader" role="row">
                <span className="hCol hArt" aria-hidden="true"/>
                <span className="hCol hTitle">Track</span>
                <span className="hCol hArtist">Artist</span>
                <span className="hCol hTime">Time</span>
            </div>
          
            <ul className="list">
                {tracks.map((t) => (
                    <TrackItemComponent key={t.id} track={t} />
                ))}
            </ul>

        </div>
        </div>
    );
}

