// spotifyApi.js
export async function getTracks(limit = 20) {
  const token = sessionStorage.getItem("spotify_access_token");
  if (!token) throw new Error("No access token.");

  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks/?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error(`Top tracks failed: ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}
