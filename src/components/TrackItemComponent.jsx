

export function TrackItemComponent({track}) {
    const {name, artistsText} = track;

    return (
        <li className="listItem">
            <span className="trackName">{name}</span>
            <span className="trackMeta">{artistsText}</span>
        </li>
    );
}