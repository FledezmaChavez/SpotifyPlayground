import { useEffect, useState, useRef } from 'react'
import { handleSpotifyCallback } from "./spotifyCallBack";
import {loginWithSpotify} from './spotifyLogin'
import { getMe } from './getMe';
import {refreshAccessToken} from './spotifyRefresh'
import {getTopTrack} from './spotifyAPI'




function App() {

  const[user, setUser]= useState(null);
  const[error, setErr] = useState("")
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);
  const [topTracks, setTopTrack] = useState();

  async function loadTopTracks() {
  try {
    const track = await getTopTrack();
    setTopTrack(track);
  } catch (e) {
    alert(e.message);
  }
}


  
  useEffect(()=>{
      //handleSpotifyCallback();
      //getMe().then(setUser).catch(e => setErr(e.message));
      async function Init(){

        //two stop the double call in dev mode 
        if(didInit.current)return; 
        didInit.current = true;

        await handleSpotifyCallback();

        try{
          const me = await getMe(); 
          setUser(me);
        }catch(e){
          if(e.message.includes("401")){
            await refreshAccessToken(); 
            const me = await getMe();
            setUser(me);
          }else{
            throw e;
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
     <main style={styles.page}>
    <section style={styles.card}>
      <h1 style={styles.title}>
        Welcome{user ? `, ${user.display_name}` : ""}
      </h1>

      <p style={styles.subtitle}>
        {user
          ? "You’re authenticated. Let’s build something fun."
          : "Authenticate to pull your Spotify profile."}
      </p>
      {user && (
  <button style={styles.button} onClick={loadTopTracks}>
    My top song
  </button>
)}

      {!user && (
        <button style={styles.button} onClick={loginWithSpotify}>
          Continue with Spotify
        </button>
      )}
    </section>
    {topTracks && (
      <div>
        <h2>Top tracks</h2>
      <div>
        <strong>{topTracks.name}</strong>
        
      </div>
      </div>
      

    )}
     
  </main>
 
    </>
  )
}



const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background:
      "radial-gradient(1200px circle at 10% 10%, rgba(29,185,84,0.18), transparent 45%)," +
      "radial-gradient(900px circle at 90% 20%, rgba(120,119,198,0.20), transparent 40%)," +
      "linear-gradient(180deg, #0b0f14, #0a0a0a)",
    color: "#e8eef6",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  card: {
    width: "min(520px, 92vw)",
    padding: "28px 26px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: 34,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "12px 0 0",
    opacity: 0.85,
    fontSize: 15,
    lineHeight: 1.5,
  },
  button: {
    marginTop: 18,
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(29,185,84,0.95)",
    color: "#051007",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  },

  
};



export default App
