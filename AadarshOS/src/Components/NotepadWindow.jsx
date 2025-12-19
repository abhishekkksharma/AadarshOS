import React, { useEffect, useRef, useState } from "react";
import { Save, X, Minus, Maximize2, Minimize2 } from "lucide-react";
import notepadIcon from '/notepad-icon.png';
import SaveModal from "./SaveModal";

const NotepadWindow = ({ closeNotepad, onSaveFile, openedFile, onUpdateFile }) => {

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [content, setContent] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [position, setPosition] = useState({ x: 150, y: 100 });
    const [previousPosition, setPreviousPosition] = useState({ x: 150, y: 100 });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (openedFile) {
            setContent(openedFile.content);
            setHasUnsavedChanges(false);
        } else {
            setContent("");
            setHasUnsavedChanges(false);
        }
    }, [openedFile]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
        setHasUnsavedChanges(true);
    };

    const handleSave = () => {
        // If editing an existing file, save directly without modal
        if (openedFile) {
            if (onUpdateFile) {
                onUpdateFile(openedFile.id, openedFile.name, content);
            } else {
                onSaveFile(openedFile.name, content);
            }
            setHasUnsavedChanges(false);
        } else {
            // New file - show save modal
            setShowSaveModal(true);
        }
    };

    const startDrag = (e) => {
        if (isFullscreen) return;
        e.preventDefault();
        dragging.current = true;

        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", stopDrag);
    };

    const onDrag = (e) => {
        if (!dragging.current || isFullscreen) return;

        const winWidth = 700;
        const winHeight = 520;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y;

        newX = Math.max(0, Math.min(newX, screenWidth - winWidth));
        newY = Math.max(0, Math.min(newY, screenHeight - winHeight));

        setPosition({
            x: newX,
            y: newY,
        });
    };

    const stopDrag = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", stopDrag);
    };

    const toggleFullscreen = () => {
        if (isFullscreen) {
            setPosition(previousPosition);
            setIsFullscreen(false);
        } else {
            setPreviousPosition(position);
            setPosition({ x: 0, y: 0 });
            setIsFullscreen(true);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    // Calculate stats for status bar
    const lineCount = content.split('\n').length;
    const charCount = content.length;
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    // Keyboard shortcut for save
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [content, openedFile]);

    if (isMinimized) return null;

    const fileName = openedFile ? openedFile.name : "Untitled";
    const displayTitle = hasUnsavedChanges ? `*${fileName} - Notepad` : `${fileName} - Notepad`;

    return (
        <div
            className={`
                ${isFullscreen ? 'w-full h-[calc(100vh-48px)]' : 'w-[700px] h-[520px]'}
                absolute bg-[#f0f0f0]
                rounded-t-lg border border-[#999]
                shadow-[2px_2px_10px_rgba(0,0,0,0.3)]
                flex flex-col
            `}
            style={{
                top: isFullscreen ? 0 : position.y,
                left: isFullscreen ? 0 : position.x,
                zIndex: 100
            }}
        >

            {/* Title Bar - Classic Windows Style */}
            <div
                className={`flex justify-between items-center h-8 px-2
                    bg-gradient-to-b from-[#0a246a] via-[#0a246a] to-[#0d47a1]
                    rounded-t-lg ${!isFullscreen ? 'cursor-move' : ''}`}
                onMouseDown={startDrag}
            >
                {/* Left section - App icon and title */}
                <div className="flex gap-2 items-center">
                    <img src={notepadIcon} alt="notepad" className="h-4 w-4" />
                    <p className="text-sm font-normal text-white select-none">
                        {displayTitle}
                    </p>
                </div>

                {/* Right section - Window controls */}
                <div className="flex items-center gap-0.5">

                    {/* Minimize button */}
                    <button
                        onClick={toggleMinimize}
                        className="w-6 h-6 flex items-center justify-center
                            bg-gradient-to-b from-[#c4d6f7] to-[#7396d8]
                            border border-[#4169b0]
                            rounded-sm
                            hover:from-[#d9e6fc] hover:to-[#89aae8]
                            active:from-[#8aa1d6] active:to-[#5b7ec2]"
                        title="Minimize"
                    >
                        <Minus size={12} className="text-[#0a246a]" strokeWidth={3} />
                    </button>

                    {/* Maximize/Restore button */}
                    <button
                        onClick={toggleFullscreen}
                        className="w-6 h-6 flex items-center justify-center
                            bg-gradient-to-b from-[#c4d6f7] to-[#7396d8]
                            border border-[#4169b0]
                            rounded-sm
                            hover:from-[#d9e6fc] hover:to-[#89aae8]
                            active:from-[#8aa1d6] active:to-[#5b7ec2]"
                        title={isFullscreen ? "Restore Down" : "Maximize"}
                    >
                        {isFullscreen ? (
                            <Minimize2 size={12} className="text-[#0a246a]" strokeWidth={2.5} />
                        ) : (
                            <Maximize2 size={12} className="text-[#0a246a]" strokeWidth={2.5} />
                        )}
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={closeNotepad}
                        className="w-6 h-6 flex items-center justify-center
                            bg-gradient-to-b from-[#f5a9a0] to-[#d85545]
                            border border-[#8a413d]
                            rounded-sm
                            hover:from-[#fcc4bc] hover:to-[#ea6b5c]
                            active:from-[#c44a3c] active:to-[#a53328]"
                        title="Close"
                    >
                        <X size={12} className="text-white" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-2 py-1 bg-[#f5f5f5] border-b border-[#ddd]">
                <button
                    onClick={handleSave}
                    className="p-1.5 hover:bg-[#e0e0e0] rounded border border-transparent 
                        hover:border-[#aaa] flex items-center gap-1"
                    title={openedFile ? "Save (Ctrl+S)" : "Save As... (Ctrl+S)"}
                >
                    <Save size={16} className="text-[#444]" />
                    <span className="text-xs text-[#444]">
                        {openedFile ? "Save" : "Save As"}
                    </span>
                </button>
            </div>

            {/* Text area */}
            <div className="flex-1 p-1 bg-[#f0f0f0] overflow-hidden">
                <textarea
                    className="
                        w-full h-full
                        p-2
                        text-[14px] font-mono
                        leading-5
                        outline-none resize-none
                        bg-white
                        text-[#333]
                        border border-[#7f9db9]
                        focus:border-[#569de5]
                    "
                    placeholder="Start typing..."
                    value={content}
                    onChange={handleContentChange}
                />
            </div>

            {/* Status Bar */}
            <div className="flex justify-between items-center px-2 py-1 bg-[#ece9d8] 
                border-t border-[#ccc]">
                <div className="flex gap-4 text-xs text-[#666]">
                    <span>Ln {lineCount}</span>
                    <span>Col 1</span>
                </div>
                <div className="flex gap-4 text-xs text-[#666]">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                    <span>UTF-8</span>
                </div>
            </div>


            {/* Save Modal - Only shown for new files */}
            {showSaveModal && (
                <SaveModal
                    onSave={(name) => {
                        onSaveFile(name, content);
                        setShowSaveModal(false);
                        setHasUnsavedChanges(false);
                    }}
                    onCancel={() => setShowSaveModal(false)}
                />
            )}

        </div>
    );
};

export default NotepadWindow;

