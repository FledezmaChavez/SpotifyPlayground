export async function getMe(){
    const token = sessionStorage.getItem('spotify_access_token')
    if(!token) throw new Error("No access token in session storage")
    
    const res = await fetch("https://api.spotify.com/v1/me",{
        headers: {Authorization:`Bearer ${token}`},
    });

    if(!res.ok) throw new Error(`GET /me failed: ${res.status}`); 
    return res.json();
}