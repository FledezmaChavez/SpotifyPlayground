import { TrackItemComponent } from "./TrackItemComponent"

export function TrackListComponent({ tracks }) {

    return (
        <div>
            <ul className="list">
            {tracks.map(t => <TrackItemComponent track={t.track}/>)}
            </ul>
        </div>
    )
}