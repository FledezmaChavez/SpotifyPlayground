

export function TrackItemComponent({track}) {
    return (
        <li key={track.id} className="listItem">
            <span className="trackName">{track.name}</span>
            <span className="trackMeta">{track.artists.map(a => a.name).join(", ")}</span>
        </li>
    );
}