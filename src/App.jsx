import { useEffect, useState, useRef } from 'react'
import { handleSpotifyCallback, loginWithSpotify } from "./spotifyAuth";
import { getMe } from './getMe';
import {refreshAccessToken} from './spotifyRefresh'
import {getTracks} from './spotifyAPI'
import './App.css'




function App() {

  const[user, setUser]= useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);
  const [topTracks, setTopTrack] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  async function loadTopTracks() {
  try {
    const track = await getTracks();
    setTopTrack(track);
  } catch (e) {
    setError(e.message);
  }
}


  
  useEffect(()=>{
      //handleSpotifyCallback();
      //getMe().then(setUser).catch(e => setErr(e.message));
      async function Init(){

        //two stop the double call in dev mode
        if(didInit.current)return;
        didInit.current = true;

        try{
          await handleSpotifyCallback();

          const storedToken = sessionStorage.getItem("spotify_access_token");
          if(!storedToken){
            return;
          }

          const me = await getMe();
          setUser(me);
        }catch(e){
          if(e.message.includes("401")){
            try{
              await refreshAccessToken();
              const me = await getMe();
              setUser(me);
            }catch(refreshError){
              setError(refreshError.message);
            }
          }else{
            setError(e.message);
          }

        }finally{
          setLoading(false)
        }
      }

      Init();
  },[])


  if(error)return <div>Error: {error}</div>; 
    if (loading) {
    return <h2>Loading…</h2>;
  }

  return (
    <>
     <main class="page">
    <section class="card">
      <h1 class="title">
        Welcome{user ? `, ${user.display_name}` : ""}
      </h1>

      <p class="subtitle">
        {user
          ? "You’re authenticated. Let’s build something fun."
          : "Authenticate to pull your Spotify profile."}
      </p>
      {user && (
  <button class="button" onClick={loadTopTracks}>
    My top song
  </button>
)}

      {!user && (
        <button class="button" onClick={loginWithSpotify}>
          Continue with Spotify
        </button>
      )}
    </section>

    {user && (
  <section class="panel">
    <button
      class="panelHeader"
      onClick={() => setShowSaved(v => !v)}
      aria-expanded={showSaved}
    >
      <span>My saved tracks</span>
      <span class="chevron">{showSaved ? "▾" : "▸"}</span>
    </button>

    {showSaved && (
      <div class="panelBody">
        <button class="secondaryBtn" onClick={loadTopTracks}>
          Load latest 20
        </button>

        {topTracks.length > 0 && (
          <ul class="list">
            {topTracks.map(t => (
              <li key={t.track.id} class="listItem">
                <span class="trackName">{t.track.name}</span>
                <span class="trackMeta">{t.track.artists.map(a => a.name).join(", ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </section>
      

    )}
     
  </main>
 
    </>
  )
}


export default App
