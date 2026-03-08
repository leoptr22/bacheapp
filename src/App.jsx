import { useEffect, useState } from "react";
import supabase from "./services/supabaseClient";
import Login from "./pages/Login";
import Mapa from "./pages/Mapa";
import fondoLogin from "./assets/1.jpg"; 


function App(){

  const [session, setSession] = useState(null);

  useEffect(()=>{

    supabase.auth.getSession().then(({ data })=>{
      setSession(data.session);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session)=>{
        setSession(session);
      });

    return ()=>{
      listener.subscription.unsubscribe();
    }

  },[]);

  async function logout() {
    await supabase.auth.signOut();
  }

  return(

              <div
                className="container-fluid"
              style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${fondoLogin})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            color: "white"
          }}
              >

      {session && (
        <button
          className="btn btn-danger btn-sm position-absolute"
          style={{ top: 20, right: 20, zIndex: 9999 }}
          onClick={logout}
        >
          Cerrar sesión
        </button>
      )}

      <h1 className="text-center pt-3">
        GUALEBACHE 🚧
      </h1>

      {session ? <Mapa/> : <Login/>}

    </div>

  )

}

export default App;