import { useState } from 'react'
import { getTracks } from './spotifyAPI'
import { useSpotifySession } from './hooks/useSpotifySession';
import './App.css'




function App() {

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

  const { user, status, error, isAuthenticated, login, logout } = useSpotifySession();

  if (status === "loading") return <h2>Loading…</h2>;


  return (
    <>
      <main class="page">
        <section className="card">
          <h1 class="title">
            Welcome{user ? `, ${user.display_name}` : ""}
          </h1>

          <p class="subtitle">
            {isAuthenticated
              ? "You’re authenticated. Let’s build something fun."
              : "Authenticate to pull your Spotify profile."}
          </p>
          {user && (
            <button class="button" onClick={loadTopTracks}>
              My top song
            </button>
          )}

          {!isAuthenticated && (
            <button class="button" onClick={login}>
              Continue with Spotify
            </button>
          )}

          {isAuthenticated && (
            <button
              aria-label="Logout"
              title="Logout"
              onClick={logout}
              className='logout-btn'
            >
              ×
            </button>
          )}


          {error && <div style={styles.errorBox}>{error}</div>}
        </section>

        {isAuthenticated && (
          <section className="panel">
            <button
              class="panelHeader"
              onClick={() => setShowSaved(v => !v)}
              aria-expanded={showSaved}
            >
              <span>My saved tracks</span>
              <span class="chevron">{showSaved ? "▾" : "▸"}</span>
            </button>

            {showSaved && (
              <div className="panelBody">
                <button className="secondaryBtn" onClick={loadTopTracks}>
                  Load latest 20
                </button>

                {topTracks.length > 0 && (
                  <ul className="list">
                    {topTracks.map(t => (
                      <li key={t.track.id} className="listItem">
                        <span className="trackName">{t.track.name}</span>
                        <span className="trackMeta">{t.track.artists.map(a => a.name).join(", ")}</span>
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
