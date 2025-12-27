// spotifyLogin.js
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID; 
const REDIRECT_URI = "http://127.0.0.1:5173/#callback";
const SCOPES = ["user-read-email", "user-read-private","user-library-read"];

function rand(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return [...arr].map(n => chars[n % chars.length]).join("");
}

async function sha256(str) {
  const data = new TextEncoder().encode(str);
  return crypto.subtle.digest("SHA-256", data);
}

function base64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function loginWithSpotify() {
  const verifier = rand(64);
  const state = rand(16);

  sessionStorage.setItem("spotify_code_verifier", verifier);
  sessionStorage.setItem("spotify_state", state);

  const challenge = base64url(await sha256(verifier));

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  window.location.assign(`https://accounts.spotify.com/authorize?${params}`);
}

