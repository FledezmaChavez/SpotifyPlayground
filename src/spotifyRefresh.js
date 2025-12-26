// spotifyRefresh.js
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem("spotify_refresh_token");
  if (!refreshToken) throw new Error("No refresh token in sessionStorage.");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Refresh failed: ${res.status} ${await res.text()}`);
  }

  const token = await res.json(); // { access_token, expires_in, token_type, scope, refresh_token? }

  sessionStorage.setItem("spotify_access_token", token.access_token);

  // Sometimes Spotify may rotate refresh tokens; keep it if provided
  if (token.refresh_token) {
    sessionStorage.setItem("spotify_refresh_token", token.refresh_token);
  }

  return token.access_token;
}
