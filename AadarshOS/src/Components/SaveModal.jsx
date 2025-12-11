import React, { useState } from "react";

const SaveModal = ({ onSave, onCancel }) => {
  const [filename, setFilename] = useState("");
  const [shake, setShake] = useState(false);

  const handleSave = () => {
    if (filename.trim() === "") {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }

    onSave(filename);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="w-[320px] bg-[#e8eef7] border border-[#a3b3c5] shadow-xl rounded-sm">

        
        <div className="h-7 bg-linear-to-b from-[#dbe6f5] to-[#c3d2e5] 
                        border-b border-[#8fa3ba] flex items-center px-3">
          <span className="text-sm text-[#1a1a1a]">Save File</span>
        </div>

        
        <div className="p-4">
          <p className="text-sm text-black mb-2">File name:</p>

          <input
            type="text"
            className={`w-full border border-[#7f9db9] px-2 py-1 text-sm 
                       bg-white focus:outline-none ${shake?"animate-[shake_0.4s_ease]" : ""}`}
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>


        <div className="flex justify-end gap-2 p-3 bg-[#dbe5f3] border-t border-[#b7c5d6]">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm bg-[#e8e8e8] border border-[#9e9e9e] 
                       hover:bg-[#f4f4f4]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-[#d1e4ff] border border-[#7fa7dc]
                       hover:bg-[#c7dcff]"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default SaveModal;
