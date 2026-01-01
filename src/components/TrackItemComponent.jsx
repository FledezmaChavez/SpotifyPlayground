import "../App.css";


function formatMS(ms){
    const totalSeconds = Math.floor((ms ?? 0)/1000)
    const minutes = Math.floor(totalSeconds /60)
    const seconds = String(totalSeconds %60).padStart(2, "0")
    return `${minutes}: ${seconds}`
}


export function TrackItemComponent({track}) {
    const {title, artistsText, albumImageUrl, durationMs} = track;

    return (
        <li className="listItem" role="row" aria-label={title}>
            <div className="col artCol">
                {albumImageUrl ? (
                    <img className="albumArt" src={albumImageUrl} alt="" />
                ):(
                    <div className="albumArtFallback" aria-hidden="true"/>
                )}
            </div>

            <div className="col titleCol">
                <span className="trackName" title={title}>
                    {title}
                </span>
            </div>

            <div className="col artistCol">
                <span className="trackMeta" title={artistsText}>
                    {artistsText}
                </span>
            </div>

            <div className="col timeCol">
                <span className="trackTime">{formatMS(durationMs)}</span>
            </div>
        </li>
    );
}