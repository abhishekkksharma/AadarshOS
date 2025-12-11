import React, { useEffect, useRef, useState } from 'react'
import desktopBG from '/desktopBG.webp'
import Taskbar from '../Components/Taskbar'
import NotepadWindow from '../Components/NotepadWindow'
import savedFileIcon from '/saved-file-icon.jpg'

const FILES_KEY = "aadarshOS_files";

const Desktop = () => {
  // States for which file opened and if notepad open
  const [notepad, showNotepad] = useState(false);
  const [openedFile, setOpenedFile] = useState(null);


  // Save file Logic and functions
  const [files, setFiles] = useState([]);
  const firstLoad = useRef(true);

  useEffect(() => {
    const savedFiles = localStorage.getItem("aadarshOS_files");

    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      }
      catch (err) {
        // console.log("Error fetching files....",err);
      }
    }
  }, []);

  // console.log("Loaded files:", files);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  }, [files]);

  const saveNewFile = (name, content) => {

    if (openedFile) {
      setFiles(prev =>
        prev.map(f =>
          f.id === openedFile.id ? { ...f, name, content } : f
        )
      );
      return;
    }

    const newFile = {
      id: Date.now(),
      name,
      content
    };

    setFiles(prev => [...prev, newFile]);
  }



  // Delete File Logic and Function
  const deleteFile = (id) => {
    // if the file being deleted is open in notepad we close the notepad
    if (openedFile && openedFile.id == id) {
      setOpenedFile(null);
      showNotepad(false);
    }

    // Removes it from the files array
    setFiles(prev => prev.filter(f => f.id !== id));
  }


  // Custom Menu for Delete and Rename on Right click

  // This stores if the menu is visible or not 
  // On what cords to open the menu and which file is the right click triggered
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    file: null,
  });

  // Hide the menu if click anywhere else on the desktop
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);




  return (
    <div style={{ backgroundImage: `url(${desktopBG})` }}
      className='h-screen bg-cover bg-center bg-no-repeat flex flex-col
      opacity-0 animate-fadeIn overflow-hidden'
    >

      <div className='relative flex-1 overflow-hidden'>
        {notepad && <NotepadWindow
          closeNotepad={() => {
            showNotepad(false)
            setOpenedFile(null);
          }}
          onSaveFile={saveNewFile}
          openedFile={openedFile}
        />}

        {/* Icon Grid  */}
        <div className='absolute top-4 left-4 grid grid-cols-1 gap-6'>

          {/* NotePad's icons displayed in desktop */}
          {files.map((file) => (
            <div
              key={file.id}
              className='flex flex-col items-center text-white cursor-pointer group'
              onClick={() => {
                setOpenedFile(file);
                showNotepad(true);
              }}

              // onContextMenu is used to handle right click events in our browser
              onContextMenu={(e) => {
                e.preventDefault();

                setContextMenu({ // This makes the menu appear right where we right clicked.
                  visible: true,
                  x: e.pageX,
                  y: e.pageY,
                  file: file,
                })
              }}
            >
              <img src={savedFileIcon} alt="savedFileIcon"
                className='h-12 group-hover:scale-105 transition-transform'
              />
              <span className='text-sm mt-1 max-w-[80px] text-center wrap-break-words drop-shadow'>
                {file.name}
              </span>
            </div>
          ))}
        </div>



        {/* Right Click Menu  */}
        {contextMenu.visible && (
          <div
            className="absolute w-44 
               bg-[#fbfbfb]
               border border-[#b6b6b6]
               rounded-[3px]
               shadow-[2px_2px_6px_rgba(0,0,0,0.35)]
               text-[12px]
               font-sans
               select-none
               overflow-hidden"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 9999,
            }}
          >

            {/* Open */}
            <button
              className="w-full text-left px-3 py-1.5 
                 hover:bg-linear-to-r hover:from-[#cfe4ff] hover:to-[#d9ebff]
                 hover:border-l-[3px] hover:border-l-[#97b5e6]
                 hover:text-black
                 border-l-[3px] border-transparent
                 transition-all duration-75"
              onClick={() => {
                showNotepad(true);
                setOpenedFile(contextMenu.file);
              }}
            >
              Open
            </button>

            {/* Rename */}
            <button
              className="w-full text-left px-3 py-1.5 
                 hover:bg-linear-to-r hover:from-[#cfe4ff] hover:to-[#d9ebff]
                 hover:border-l-[3px] hover:border-l-[#97b5e6]
                 hover:text-black
                 border-l-[3px] border-transparent
                 transition-all duration-75"
              onClick={() => setContextMenu({ ...contextMenu, visible: false })}
            >
              Rename
            </button>

            {/* Delete */}
            <button
              className="w-full text-left px-3 py-1.5 
                 hover:bg-linear-to-r hover:from-[#cfe4ff] hover:to-[#d9ebff]
                 hover:border-l-[3px] hover:border-l-[#97b5e6]
                 hover:text-black
                 border-l-[3px] border-transparent
                 transition-all duration-75"
              onClick={() => {
                deleteFile(contextMenu.file.id);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              Delete
            </button>

          </div>
        )}


      </div>

      <Taskbar
        openNotePad={() => showNotepad(!notepad)} />
    </div>
  )
}

export default Desktop