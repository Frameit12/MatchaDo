"use client";

import { useEffect, useState, type RefObject, type DragEvent, type ChangeEvent } from "react";

export function usePhotoDropzone(
  inputRef: RefObject<HTMLInputElement | null>,
  onFileNameChange: (name: string) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function applyFiles(files: FileList | null) {
    const file = files?.[0];
    onFileNameChange(file?.name ?? "");
    if (files && inputRef.current) {
      inputRef.current.files = files;
    }
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  return {
    isDragging,
    previewUrl,
    dropzoneProps: {
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
      },
      onDragLeave: () => setIsDragging(false),
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        applyFiles(e.dataTransfer.files);
      },
    },
    onChange: (e: ChangeEvent<HTMLInputElement>) => applyFiles(e.target.files),
  };
}
