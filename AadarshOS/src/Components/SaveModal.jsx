import React, { useState } from "react";
import { Save, FileText } from "lucide-react";

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[200]">

      <div className="w-[380px] bg-[#ece9d8] border border-[#0054e3] 
                      shadow-[3px_3px_8px_rgba(0,0,0,0.4)] rounded-t-lg overflow-hidden">

        {/* Title Bar - Classic Windows */}
        <div className="h-7 bg-gradient-to-b from-[#0a246a] via-[#0a246a] to-[#0d47a1]
                        flex items-center justify-between px-2 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Save size={14} className="text-white" />
            <span className="text-sm font-normal text-white">Save As</span>
          </div>
          <button
            onClick={onCancel}
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
            <p className="text-sm text-[#333]">File name:</p>
          </div>

          <input
            type="text"
            autoFocus
            className={`w-full px-2 py-1.5 text-sm 
                       bg-white text-[#333]
                       border border-[#7f9db9] rounded-sm
                       focus:outline-none focus:border-[#569de5]
                       transition-all duration-100
                       ${shake ? "animate-[shake_0.4s_ease] border-red-500" : ""}`}
            placeholder="Enter filename..."
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <p className="text-xs text-[#666] mt-2">
            File will be saved to desktop
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-3 bg-[#d4d0c8] border-t border-[#808080]">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm text-[#333] 
                       bg-gradient-to-b from-[#fff] to-[#e0e0e0]
                       border border-[#999] rounded-sm
                       hover:from-[#f5f5f5] hover:to-[#d5d5d5]
                       active:from-[#d0d0d0] active:to-[#c0c0c0]
                       shadow-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-1 text-sm text-[#333] 
                       bg-gradient-to-b from-[#fff] to-[#e0e0e0]
                       border border-[#999] rounded-sm
                       hover:from-[#f5f5f5] hover:to-[#d5d5d5]
                       active:from-[#d0d0d0] active:to-[#c0c0c0]
                       flex items-center gap-1.5
                       shadow-sm"
          >
            <Save size={14} />
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default SaveModal;


