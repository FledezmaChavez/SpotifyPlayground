

export function TrackItemComponent({track}) {
    const {id,name, artists} = track;

    return (
        <li key={id} className="listItem">
            <span className="trackName">{name}</span>
            <span className="trackMeta">{artists.map(a => a.name).join(", ")}</span>
        </li>
    );
}