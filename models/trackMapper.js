export const spotifyRawToTrack = (track) => {
    const {id, name, artists, album, duration_ms, external_urls} = track;
    const {name: albumName, images} = album;
    const albumImageUrl = images[0]?.url || "";
    const artistsText = artists.map(artist => artist.name).join(", ");

    return {
        id: id,
        title: name,
        artistsText: artistsText,
        albumTitle: albumName,
        albumImageUrl: albumImageUrl,
        durationMs: duration_ms,
        spotifyUrl: external_urls,
    };
};