import { useEffect, useState, useRef } from 'react'
import { handleSpotifyCallback, loginWithSpotify } from "./spotifyAuth";
import { getMe } from './getMe';
import {refreshAccessToken} from './spotifyRefresh'
import {getTopTrack} from './spotifyAPI'




function App() {

  const[user, setUser]= useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);
  const [topTracks, setTopTrack] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  async function loadTopTracks() {
  try {
    const track = await getTopTrack();
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

    {user && (
  <section style={styles.panel}>
    <button
      style={styles.panelHeader}
      onClick={() => setShowSaved(v => !v)}
      aria-expanded={showSaved}
    >
      <span>My saved tracks</span>
      <span style={styles.chevron}>{showSaved ? "▾" : "▸"}</span>
    </button>

    {showSaved && (
      <div style={styles.panelBody}>
        <button style={styles.secondaryBtn} onClick={loadTopTracks}>
          Load latest 20
        </button>

        {topTracks.length > 0 && (
          <ul style={styles.list}>
            {topTracks.map(t => (
              <li key={t.track.id} style={styles.listItem}>
                <span style={styles.trackName}>{t.track.name}</span>
               
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
  panel: {
  marginTop: 18,
  width: "100%",
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
},
panelHeader: {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.03)",
  border: "none",
  color: "inherit",
  cursor: "pointer",
  fontWeight: 700,
},
chevron: { opacity: 0.8 },
panelBody: { padding: 14 },
secondaryBtn: {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "inherit",
  cursor: "pointer",
  fontWeight: 600,
},
list: { listStyle: "none", padding: 0, margin: "12px 0 0" },
listItem: {
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
},
trackName: { display: "block", fontWeight: 700 },
trackMeta: { display: "block", opacity: 0.8, fontSize: 13, marginTop: 2 },


  
};



export default App
