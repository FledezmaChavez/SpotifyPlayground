import { TrackItemComponent } from "./TrackItemComponent";

export function TrackListComponent({ tracks }) {
    return (
        <div>
            <ul className="list">
                {tracks.map((t) => (
                    <TrackItemComponent key={t.id} track={t} />
                ))}
            </ul>
        </div>
    );
}
