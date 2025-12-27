const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = `${window.location.origin}/#callback`;
const SCOPES = ["user-read-email", "user-read-private", "user-library-read"];

const STORAGE_KEYS = {
  verifier: "spotify_code_verifier",
  state: "spotify_state",
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
};

function generateRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return [...array].map(n => chars[n % chars.length]).join("");
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  return crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function saveSessionState(verifier, state) {
  sessionStorage.setItem(STORAGE_KEYS.verifier, verifier);
  sessionStorage.setItem(STORAGE_KEYS.state, state);
}

function readSessionState() {
  return {
    verifier: sessionStorage.getItem(STORAGE_KEYS.verifier),
    expectedState: sessionStorage.getItem(STORAGE_KEYS.state),
  };
}

export async function loginWithSpotify() {
  const verifier = generateRandomString(64);
  const state = generateRandomString(16);
  saveSessionState(verifier, state);

  const challenge = base64UrlEncode(await sha256(verifier));
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

export async function handleSpotifyCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  const error = params.get("error");

  if (!code && !error) return null;
  if (error) throw new Error(`Spotify auth error: ${error}`);

  const { verifier, expectedState } = readSessionState();
  if (!state || state !== expectedState) throw new Error("State mismatch");
  if (!verifier) throw new Error("Missing code verifier");

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
  sessionStorage.setItem(STORAGE_KEYS.accessToken, token.access_token);
  if (token.refresh_token) sessionStorage.setItem(STORAGE_KEYS.refreshToken, token.refresh_token);

  window.history.replaceState({}, document.title, "/");
  return token;
}
