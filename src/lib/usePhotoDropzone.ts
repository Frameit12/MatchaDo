"use client";

import { useState, type RefObject, type DragEvent, type ChangeEvent } from "react";

export function usePhotoDropzone(
  inputRef: RefObject<HTMLInputElement | null>,
  onFileNameChange: (name: string) => void
) {
  const [isDragging, setIsDragging] = useState(false);

  function applyFiles(files: FileList | null) {
    const file = files?.[0];
    onFileNameChange(file?.name ?? "");
    if (files && inputRef.current) {
      inputRef.current.files = files;
    }
  }

  return {
    isDragging,
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
