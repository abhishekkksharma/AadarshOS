import React, { useEffect, useRef, useState } from "react";
import notepadIcon from '/notepad-icon.png'
import saveIcon from '/save-icon.ico'
import SaveModal from "./SaveModal";

const NotepadWindow = ({closeNotepad, onSaveFile, openedFile}) => {

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [content, setContent] = useState("");

    const [position, setPosition] = useState({x:150,y:100});
    const dragging = useRef(false);
    const offset = useRef({x:0,y:0});

    useEffect(()=>{
        if(openedFile){
            setContent(openedFile.content);
        }
    },[openedFile]);

    const startDrag = (e) => {
        e.preventDefault();
        dragging.current = true;
        
        offset.current = {
            x : e.clientX - position.x,
            y : e.clientY - position.y, 
        };

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", stopDrag);
    };

    const onDrag = (e) => {
        if(!dragging.current) return;
        
        const winWidth = 640;
        const winHeight = 509;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y;

        newX = Math.max(0, Math.min(newX,screenWidth-winWidth));
        newY = Math.max(0, Math.min(newY,screenHeight-winHeight));

        setPosition({
            x : newX,
            y : newY,
        });
    };

    const stopDrag = () => {
        dragging.current = false;
        document.removeEventListener("mousemove",onDrag);
        document.removeEventListener("mouseup",stopDrag);
    }
    return (
        <div className="w-[640px] h-[460px]
                absolute bg-[rgba(255,255,255,0.25)]
                rounded-xl border border-transparent
                backdrop-blur-lg shadow-[0_0_25px_rgba(0,0,0,0.35)]"
            
            style={{
                top:position.y,
                left:position.x
            }}
        >

            {/* Top area  */}
            <div className="flex justify-between mt-2.5 px-2.5 cursor-move"
                onMouseDown={startDrag}
            >

                {/* top left section  */}
                <div className="flex gap-1 items-center">
                    <img src={notepadIcon} alt="notepadIcon" className="h-5" />
                    <p className="text-sm font-[Inter] text-white/85">
                        {openedFile ? openedFile.name : "Untitled - Notepad"}
                    </p>
                </div>


                {/* closing buttons */}
                <div className="flex items-center gap-2">

                    {/* Save button */}
                    <button 
                        className="hover:scale-107 transition-transform duration-200 ease-in-out"
                        onClick={()=> setShowSaveModal(true)}   
                    >
                        <img src={saveIcon} alt="saveIcon" className="h-5" />
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={closeNotepad}
                        className="
                                group relative
                                w-[48px] h-[19px]
                                border-y border-r border-[#8a413d] border-l-[#8a413d] border-l
                                rounded-[2px] rounded-tl-none rounded-bl-none
                                bg-linear-to-b from-[#eeb4b0] via-[#e08984] to-[#c54e48]
                                hover:from-[#f5cecc] hover:via-[#ea9b96] hover:to-[#d86b66]
                                hover:border-[#b04a44] hover:shadow-[0_0_2px_#e08984]
                                active:bg-[#b0433e]
                                flex items-center justify-center
                                ml-px
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(200,50,50,0.2)]
                            "
                    >
                        <svg
                            viewBox="0 0 10 10"
                            className="w-[10px] h-[10px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                            style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))' }}
                        >
                            <path
                                d="M1 1 L9 9 M9 1 L1 9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            

            {/* text area  */}
            <div className="border-t-0 h-full py-4 px-2.5">
                <textarea
                className="
                    w-full h-[400px]
                    p-3
                    text-[14px] font-mono
                    leading-5
                    outline-none resize-none
                    bg-white
                    rounded-lg
                "
                value={content}                        
                onChange={(e)=> setContent(e.target.value)}   
                />
            </div>


            {/* Save Modal */}
            {showSaveModal && (
                <SaveModal 
                    onSave={(name) => {
                        onSaveFile(name, content);      
                        setShowSaveModal(false);
                    }}
                    onCancel={() => setShowSaveModal(false)}
                />
            )}

        </div>
    );
};

export default NotepadWindow;
