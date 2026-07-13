'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, FileImage, ShieldAlert } from 'lucide-react';
import useNotificationStore from '../../stores/notificationStore';

interface PhotoUploadProps {
  onPhotoSelected: (base64String: string | null) => void;
  selectedPhotoUrl: string | null;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelected,
  selectedPhotoUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const addToast = useNotificationStore((state) => state.addToast);

  const validateFile = (file: File): boolean => {
    // 5MB validation
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      addToast('File is too large. Max size is 5MB.', 'error');
      return false;
    }

    // MIME type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Invalid file format. Upload JPG, PNG, or WebP.', 'error');
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onPhotoSelected(e.target.result as string);
        addToast('Photo uploaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoSelected(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('Photo removed.', 'info');
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-zinc-400 text-sm font-medium tracking-wide">
        Profile Photo Upload
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        className={`relative w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-rose-500 bg-rose-500/10'
            : selectedPhotoUrl
            ? 'border-emerald-500/40 bg-zinc-900/40'
            : 'border-white/10 hover:border-rose-500/50 hover:bg-zinc-900/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedPhotoUrl ? (
          <div className="absolute inset-0 p-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhotoUrl}
                alt="Selected preview"
                className="h-full aspect-square object-cover rounded-lg border border-white/10"
              />
              <div className="flex flex-col">
                <span className="text-zinc-200 text-sm font-semibold max-w-[150px] truncate">
                  Custom Portrait
                </span>
                <span className="text-emerald-400 text-xs flex items-center gap-1 mt-0.5">
                  Ready to save
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={removePhoto}
              className="text-zinc-400 hover:text-red-400 p-2 rounded-lg bg-zinc-950/60 hover:bg-zinc-950 border border-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center p-4 select-none">
            <Upload className="w-7 h-7 text-zinc-500 animate-bounce" />
            <div className="text-sm font-semibold text-zinc-300">
              Drag & drop or click to upload
            </div>
            <span className="text-zinc-600 text-xs">
              Supports JPEG, PNG, WebP up to 5MB
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
