const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://127.0.0.1:5173/#callback';

export async function handleSpotifyCallback(){
    //Expect: #callback?code=...
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    

    if(!code && !error) return null; //not a spotify callback
    if(error) throw new Error(`Spotify auth error: ${error}`);


    const expectedState = sessionStorage.getItem("spotify_state");
    if(!state || state != expectedState)throw new Error("State mismatch");

    const verifier = sessionStorage.getItem("spotify_code_verifier");
    if(!verifier) throw new Error("Missing code verifier")

    const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);


  const token = await res.json();
  sessionStorage.setItem("spotify_access_token", token.access_token);
  if (token.refresh_token) sessionStorage.setItem("spotify_refresh_token", token.refresh_token);

  // Clean up URL (remove code/state + hash)
  window.history.replaceState({}, document.title, "/");

  return token;

    
}