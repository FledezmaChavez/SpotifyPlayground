

export function WelcomeComponent({user,isAuthenticated}){
    
 return (
    <>
    <h1 class="title">
            Welcome{user ? `, ${user.display_name}` : ""}
          </h1>
     <p class="subtitle">
            {isAuthenticated
              ? "You’re authenticated. Let’s build something fun."
              : "Authenticate to pull your Spotify profile."}
          </p>
    </>
 )
    
}