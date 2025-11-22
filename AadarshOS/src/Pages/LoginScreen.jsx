import React, { useState } from 'react'
import winLogo from '/winLogo.png'
import profilePic from '/ProfilePic.jpeg'
import Desktop from './Desktop'
import { useNavigate } from 'react-router-dom'

const LoginScreen = () => {

  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);

  const handleLogin = (e) =>{
    e.preventDefault();
    const pass = password.trim();

    if(pass == "Ronaldo"){
      navigate("/Desktop");
    }
    else{
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="opacity-0 animate-fadeIn font-[inter] text-white h-screen w-screen 
        bg-linear-to-b from-[#0a2a5a] via-[#3a8dde] to-[#0a2a5a]
        flex items-center justify-center">

      {/* Main container */}
      <div className="flex w-[85%] justify-around items-center">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-start pr-10 border-r border-white/30">
          <img 
            src={winLogo} 
            alt="Windows Logo"
            className="h-37 mb-4"
            style={{ animation: "logoGlow 2.4s ease-in-out infinite" }}
          />

          <h1 className="text-6xl font-[Inter] font-bold">
            AadarshOS
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col pl-10 w-[45%]">

          {/* Avatar + Name */}
          <div className="flex items-center mb-5">
            <img 
              src={profilePic} 
              alt="Avatar"
              className="h-24 w-24 rounded-full border-4 border-white/60 object-cover object-center"
            />

            <div className="ml-4">
              <h2 className="text-3xl font-semibold">Aadarsh Verma</h2>
              <p className="text-white/80 text-lg">Enter Password to Log In</p>
            </div>
          </div>

          {/* Password input */}
          <div className="mt-2">
            <form onSubmit={handleLogin}>
              <input 
                type="password"
                className={`w-[380px] h-[50px] rounded-md text-black text-xl px-4
                  outline-none border border-white/40 bg-white
                  ${shake ? "animate-[shake_0.4s_ease]" : ""}`}
                placeholder="••••••••••"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </form>
          </div>

          {/* Password hint */}
          <p className="mt-3 text-white/80 text-lg">
            Password Hint, Who is the GOAT?<br />
            Ronaldo or Messi?
          </p>

          {/* Footer */}
          <div className="absolute bottom-6 right-10 text-white/70">
            <p className="text-sm">Welcome to AadarshOS</p>
            <p className="text-sm">Every detail has been carefully designed</p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default LoginScreen
