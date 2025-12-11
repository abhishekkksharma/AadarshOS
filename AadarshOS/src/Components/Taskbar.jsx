import React, { useEffect, useState } from 'react'
import winTaskbarLogo from '/win-taskbar-logo.png'
import notepadIcon from '/notepad-icon.png'
import fileIcon from '/file-icon.png'
import terminalIcon from '/terminal-icon.png'

const Taskbar = ({openNotePad}) => {
    
    const [time, setTime] = useState(new Date());

    useEffect(()=>{
        const timer = setInterval(()=>{
            setTime(new Date());
        },1000);

        return ()=>clearInterval(timer);
    },[])

    const formattedTime = time.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false,
    });

    const formattedDate = time.toLocaleDateString("en-GB").replace(/\./g, "/");

  return (
    <div className='h-12 max-w-screen bg-white/15 backdrop-blur-md border border-white/30
    shadow-[0_0_20px_rgba(0,0,0,0.25)] flex justify-between'>
        {/* right section  */}
        <div className='flex items-center gap-5'>
            <button className='hover:scale-103 transition-transform duration-250 ease-in-out'>
                <img src={winTaskbarLogo} alt="WinTaskbarLogo"
                    className='h-11'
                />
            </button>
            <button className='hover:scale-103 transition-transform duration-250 ease-in-out'
                onClick={openNotePad}
            >
                <img src={notepadIcon} alt="notepadIcon" 
                    className='h-10'    
                />
            </button>
            <button className='hover:scale-103 transition-transform duration-250 ease-in-out'>
                <img src={fileIcon} alt="fileIcon" 
                    className='h-10'    
                />
            </button>
            <button className='hover:scale-103 transition-transform duration-250 ease-in-out'>
                <img src={terminalIcon} alt="terminalIcon" 
                    className='h-8'    
                />
            </button>
        </div>

        {/* left section  */}
        <div className='flex'>

            <div className='flex flex-col text-sm text-white items-center mr-2 opacity-80'>
                <h1>{formattedTime}</h1>
                <h2>{formattedDate}</h2>
            </div>

            <button>
                <div className='h-12 w-4
                    bg-linear-to-b from-white/40 via-white/20 to-white/10
                    border-l border-white/60
                    shadow-[inset_1px_0_3px_rgba(255,255,255,0.5)]
                    hover:bg-white/20
                    transition-all duration-200'>
                </div>
            </button>
        </div>
    </div>
  )
}

export default Taskbar