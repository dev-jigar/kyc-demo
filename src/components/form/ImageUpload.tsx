import React, { useRef, useState } from "react";
import { Button } from "../ui";

const PhotoUpload = ({ handlePhotoUpload, photoError }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Upload Photos</label>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handlePhotoUpload(e.target.files)}
      />

      {/* Custom Button */}
      <Button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Choose Photos
      </Button>

      {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
    </div>
  );
};

export default PhotoUpload;
