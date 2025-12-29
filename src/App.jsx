import { useState } from 'react'
import { useSpotifySession } from './hooks/useSpotifySession';
import { WelcomeComponent } from './components/WelcomeComponent';
import { TopTracksComponent } from './components/TopTracksComponent';
import './App.css'




function App() {


  const [showSaved, setShowSaved] = useState(false);



  const { user, status, error, isAuthenticated, login, logout } = useSpotifySession();

  if (status === "loading") return <h2>Loading…</h2>;


  return (
    <>
      <main class="page">
        <div className="app-column">
        <section className="card">

          <WelcomeComponent user={user} isAuthenticated={isAuthenticated} />



          {!isAuthenticated && (
            <button className="button" onClick={login}>
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
              X
            </button>
          )}


          {error && <div className="errorBox">{error}</div>}
        </section>

        {isAuthenticated && (
          <section className="panel">
            <button
              className="panelHeader"
              onClick={() => setShowSaved(v => !v)}
              aria-expanded={showSaved}
            >
              <span>My saved tracks</span>
              <span class="chevron">{showSaved ? "▾" : "▸"}</span>
            </button>

            {showSaved && (

              <TopTracksComponent />
            )}
          </section>


        )}
    </div>
      </main>

    </>
  )
}


export default App
