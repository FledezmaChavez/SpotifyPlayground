import { useState } from 'react'
import { useSpotifySession } from './hooks/useSpotifySession';
import { WelcomeComponent } from './components/WelcomeComponent';
import { TopTracksComponent } from './components/TopTracksComponent';
import { useTheme } from './context/ThemeContext';
import './App.css'


const FEATURES = {
  saved: "saved",
  search: "search",
};


function App() {


  const [showSaved, setShowSaved] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeFeature, setActiveFeature] = useState(FEATURES.saved);


  const { user, status, error, isAuthenticated, login, logout } = useSpotifySession();

  if (status === "loading") return <h2>Loading…</h2>;


  return (
    <>

      <main className="page">
        <div className="app-column">
          <div className="theme-toggle">
            <button
              onClick={() => setTheme("dark")}
              className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            >
              Dark
            </button>

            <button
              onClick={() => setTheme("light")}
              className={`theme-btn ${theme === "light" ? "active" : ""}`}
            >
              Light
            </button>
          </div>

          <section className="card">

            <WelcomeComponent user={user} isAuthenticated={isAuthenticated} />

            <div className='feature-tabs' role='tablist' aria-label="Features">
              <button
                type="button"
                className={`feature-tab ${activeFeature === FEATURES.saved ? "active" : ""}`}
                onClick={() => setActiveFeature(FEATURES.saved)}
                disabled={!isAuthenticated}
                role="tab"
                aria-selected={activeFeature === FEATURES.saved}
              >
                Saved Tracks
              </button>

              <button className={`feature-tab ${activeFeature === FEATURES.search ? "active" : ""}`}
                onClick={() => setActiveFeature(FEATURES.search)}
                disabled={!isAuthenticated}
                role="tab"
                aria-selected={activeFeature === FEATURES.search}
              >
                Search
              </button>
            </div>



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
            <section className="panel" role="tabpanel">
              {activeFeature === FEATURES.saved && (
                <div className='panelTitle'>My saved Tracks
                  <TopTracksComponent />
                </div>
              )}

              {activeFeature === FEATURES.search && (
                <>
                  <div className='panelTitle'>Search</div>
                  <div className='panelBody'>
                    <p className="muted">Search feature coming soon!</p>
                  </div>
                </>

              )}



            </section>


          )}
        </div>
      </main>

    </>
  )
}


export default App
