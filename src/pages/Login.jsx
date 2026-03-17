import { useState } from "react";
import supabase from "../services/supabaseClient";

import fondoLogin from "../assets/1.jpg";

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);

  async function handleLogin(e){
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if(error){
      setError(error.message);
    }

    setLoading(false);
  }

  async function handleRegister(){

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if(error){
      setError(error.message);
    }else{
      alert("Usuario creado. Revisa tu correo.");
    }

    setLoading(false);
  }

  async function handleGoogleLogin(){

    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google"
    });

    if(error){
      setError(error.message);
      setLoading(false);
    }
  }


 return (

  <div 
    className="min-vh-100 d-flex align-items-center justify-content-center position-relative px-3"
    style={{
      backgroundImage: `url(${fondoLogin})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
  >

    {/* Capa oscura */}
    <div
      style={{
        position:"absolute",
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        backgroundColor:"rgba(0,0,0,0.65)"
      }}
    />

    {/* Título */}
      <h1
  style={{
    position: "absolute",
    top: "10%",
    color: "#fff",
    fontWeight: "900",
    letterSpacing: "2px",
    zIndex: 2,
    maxWidth: "90%",
    textWrap: "balance",
    textAlign: "center",
    margin: 0,
    left: "50%",
    transform: "translateX(-50%)"
  }}
>
  <span style={{ 
    fontSize: "clamp(30px, 8vw, 50px)", 
    fontFamily: "'Alfa Slab One', cursive" 
  }}>
    GUALE
  </span>
  <span style={{ 
    fontSize: "clamp(45px, 12vw, 80px)", 
    color: "#ffc107",
    
  }}>
    BACHE
  </span>
</h1>
    <div 
      className="container position-relative"
      style={{maxWidth:"420px", width:"100%", zIndex:2}}
    >

      <div className="card bg-light bg-opacity-75 shadow-lg">
        <div className="card-body p-4">

          <h3 className="mb-3 text-center">Acceso</h3>

          <form onSubmit={handleLogin}>

            <input
              className="form-control mb-2"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              className="form-control mb-2"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Login"}
            </button>

          </form>

          <button
            className="btn btn-secondary w-100 mt-2"
            onClick={handleRegister}
          >
            Crear cuenta
          </button>

          <button
            className="btn btn-danger w-100 mt-2"
            onClick={handleGoogleLogin}
          >
            Entrar con Google
          </button>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}

        </div>
      </div>

    </div>

  </div>

 ) 
}