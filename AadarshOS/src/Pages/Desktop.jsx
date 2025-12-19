import React, { useEffect, useRef, useState } from 'react'
import desktopBG from '/desktopBG.webp'
import Taskbar from '../Components/Taskbar'
import NotepadWindow from '../Components/NotepadWindow'
import savedFileIcon from '/saved-file-icon.jpg'
import { FileText, Pencil, Trash2, FolderOpen } from 'lucide-react'

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

  // Rename File Logic and Function
  const [renameModal, setRenameModal] = useState({
    visible: false,
    file: null,
    newName: ""
  });

  const renameFile = (id, newName) => {
    if (!newName.trim()) return;

    setFiles(prev =>
      prev.map(f =>
        f.id === id ? { ...f, name: newName.trim() } : f
      )
    );

    // Update openedFile if it's the one being renamed
    if (openedFile && openedFile.id === id) {
      setOpenedFile(prev => ({ ...prev, name: newName.trim() }));
    }

    setRenameModal({ visible: false, file: null, newName: "" });
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
          onUpdateFile={(id, name, content) => {
            setFiles(prev =>
              prev.map(f =>
                f.id === id ? { ...f, name, content } : f
              )
            );
          }}
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
                className='h-12 group-hover:scale-105'
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
            className="absolute w-48 
               bg-[#f5f5f5]
               border border-[#999]
               rounded-sm
               shadow-[2px_2px_8px_rgba(0,0,0,0.3)]
               text-[13px]
               font-sans
               select-none
               overflow-hidden
               py-1"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 9999,
            }}
          >

            {/* Open */}
            <button
              className="w-full text-left px-3 py-1.5 flex items-center gap-2
                 hover:bg-[#0078d4] hover:text-white
                 text-[#333]"
              onClick={() => {
                showNotepad(true);
                setOpenedFile(contextMenu.file);
              }}
            >
              <FolderOpen size={14} />
              Open
            </button>

            <div className="h-px bg-[#ccc] mx-2 my-1" />

            {/* Rename */}
            <button
              className="w-full text-left px-3 py-1.5 flex items-center gap-2
                 hover:bg-[#0078d4] hover:text-white
                 text-[#333]"
              onClick={() => {
                setRenameModal({
                  visible: true,
                  file: contextMenu.file,
                  newName: contextMenu.file.name
                });
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              <Pencil size={14} />
              Rename
            </button>

            {/* Delete */}
            <button
              className="w-full text-left px-3 py-1.5 flex items-center gap-2
                 hover:bg-[#c42b1c] hover:text-white
                 text-[#333]"
              onClick={() => {
                deleteFile(contextMenu.file.id);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              <Trash2 size={14} />
              Delete
            </button>

          </div>
        )}

        {/* Rename Modal */}
        {renameModal.visible && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[200]">
            <div className="w-[340px] bg-[#f0f0f0] border border-[#999] 
                            shadow-[3px_3px_10px_rgba(0,0,0,0.4)] rounded-t-lg overflow-hidden">

              {/* Title Bar */}
              <div className="h-7 bg-gradient-to-b from-[#0a246a] to-[#0d47a1]
                              flex items-center justify-between px-2 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Pencil size={12} className="text-white" />
                  <span className="text-sm text-white">Rename</span>
                </div>
                <button
                  onClick={() => setRenameModal({ visible: false, file: null, newName: "" })}
                  className="w-5 h-5 flex items-center justify-center
                      bg-gradient-to-b from-[#f5a9a0] to-[#d85545]
                      border border-[#8a413d] rounded-sm text-white text-xs font-bold
                      hover:from-[#fcc4bc] hover:to-[#ea6b5c]"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={16} className="text-[#0a246a]" />
                  <p className="text-sm text-[#333]">New name:</p>
                </div>

                <input
                  type="text"
                  autoFocus
                  className="w-full px-2 py-1.5 text-sm 
                             bg-white text-[#333]
                             border border-[#7f9db9] rounded-sm
                             focus:outline-none focus:border-[#569de5]"
                  value={renameModal.newName}
                  onChange={(e) => setRenameModal(prev => ({ ...prev, newName: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameFile(renameModal.file.id, renameModal.newName);
                    } else if (e.key === "Escape") {
                      setRenameModal({ visible: false, file: null, newName: "" });
                    }
                  }}
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 p-3 bg-[#e0e0e0] border-t border-[#999]">
                <button
                  onClick={() => setRenameModal({ visible: false, file: null, newName: "" })}
                  className="px-4 py-1 text-sm text-[#333] 
                             bg-gradient-to-b from-[#fff] to-[#e0e0e0]
                             border border-[#999] rounded-sm
                             hover:from-[#f5f5f5] hover:to-[#d5d5d5]
                             active:from-[#d0d0d0] active:to-[#c0c0c0]"
                >
                  Cancel
                </button>

                <button
                  onClick={() => renameFile(renameModal.file.id, renameModal.newName)}
                  className="px-4 py-1 text-sm text-[#333] 
                             bg-gradient-to-b from-[#fff] to-[#e0e0e0]
                             border border-[#999] rounded-sm
                             hover:from-[#f5f5f5] hover:to-[#d5d5d5]
                             active:from-[#d0d0d0] active:to-[#c0c0c0]
                             flex items-center gap-1.5"
                >
                  <Pencil size={12} />
                  Rename
                </button>
              </div>

            </div>
          </div>
        )}


      </div>

      <Taskbar
        openNotePad={() => showNotepad(!notepad)} />
    </div>
  )
}

export default Desktop