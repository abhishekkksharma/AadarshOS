import React, { useEffect } from 'react'
import winLogo from '/winLogo.png'
import LoginScreen from './LoginScreen'
import { useNavigate } from 'react-router-dom'

const BootScreen = () => {

    const navigate = useNavigate();

    useEffect(()=>{
        const timer = setTimeout(() => {
            navigate("/LoginScreen")
        }, 7000);    

        return () => clearTimeout(timer);
    },[]);

    return (
        <div className="bg-black h-screen text-white flex items-center justify-center">
            {/* Center container */}
            <div className="flex flex-col items-center space-y-6">

                {/* Logo */}
                <img
                    src={winLogo}
                    alt="Windows Logo"
                    className="h-60"
                    style={{animation:"logoGlow 1.8s ease-in-out infinite"}}
                />

                {/* Text */}
                <div className="text-center -mt-12">
                    <h1 className="text-7xl font-[Inter] font-semibold tracking-wide">AadarshOS</h1>
                    <h2 className="text-2xl font-[Inter] opacity-80 -mt-1">Professional Edition</h2>
                </div>

                {/* Loader */}
                <div className="w-56 h-3 bg-white/20 rounded-full overflow-hidden border-2 relative mt-6">

                    {/* Dot 1 */}
                    <div
                        className="absolute top-0 h-full w-6 bg-blue-300 rounded-full blur-sm"
                        style={{
                            animation: "win7Loader 1.8s linear infinite"
                        }}
                    ></div>

                    {/* Dot 2 */}
                    <div
                        className="absolute top-0 h-full w-6 bg-blue-400 rounded-full blur-sm"
                        style={{
                            animation: "win7Loader 1.8s linear infinite 0.1s"
                        }}
                    ></div>

                    {/* Dot 3 */}
                    <div
                        className="absolute top-0 h-full w-6 bg-cyan-300 rounded-full blur-sm"
                        style={{
                            animation: "win7Loader 1.8s linear infinite 0.15s"
                        }}
                    ></div>

                    {/* Dot 4 */}
                    <div
                        className="absolute top-0 h-full w-6 bg-blue-500 rounded-full blur-sm"
                        style={{
                            animation: "win7Loader 1.8s linear infinite 0.2s"
                        }}
                    ></div>

                </div>


                {/* Bottom hints */}
                <div>
                    <div className="absolute bottom-6 left-6 text-sm opacity-60">
                        For the best experience <br />
                        Press F11 for full-screen mode
                    </div>

                    <div className="absolute bottom-6 right-6 text-sm opacity-60 text-right">
                        Built with React + Tailwind <br />
                        © Aadarsh Verma
                    </div>
                </div>

            </div>
        </div>

    )
}

export default BootScreen