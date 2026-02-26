"use client";

import { Upload } from "lucide-react";

const PhotoUpload = ({ handlePhotoUpload, photoError }) => {
  return (
    <div>
      <label className="block mb-2 font-medium text-black">Upload Photos</label>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 p-6 transition-colors hover:border-primary hover:bg-secondary/50 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100">
        <Upload className="h-6 w-6 text-muted-foreground text-black" />
        <span className="text-sm font-medium text-muted-foreground">
          Click to upload photos
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePhotoUpload(e.target.files)}
        />
      </label>

      {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
    </div>
  );
};

export default PhotoUpload;
