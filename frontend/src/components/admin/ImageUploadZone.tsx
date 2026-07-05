import React, { useState, useRef } from 'react';
import { compressImage } from '../../utils/compressImage';

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

interface ImageUploadZoneProps {
  onFileReady: (file: File | null) => void;
  labelText?: string;
  accept?: string;
  aspectRatio?: string;
}

export default function ImageUploadZone({
  onFileReady,
  labelText = 'Product Photography / Video',
  accept = 'image/*,video/*',
  aspectRatio = '1 / 1',
}: ImageUploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    setError('');
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setError('File is too large. Maximum size is 15MB.');
      return;
    }

    const fileIsVideo = file.type.startsWith('video/');
    const fileIsImage = file.type.startsWith('image/');
    if (!fileIsImage && !fileIsVideo) {
      setError('Only image or video files are allowed.');
      return;
    }

    let processedFile = file;
    if (fileIsImage) {
      try {
        processedFile = await compressImage(file);
      } catch (e) {
        processedFile = file; // fallback
      }
    }

    setIsVideo(fileIsVideo);
    setPreview(URL.createObjectURL(processedFile));
    onFileReady(processedFile);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function removeFile() {
    setPreview(null);
    setIsVideo(false);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    onFileReady(null);
  }

  return (
    <div>
      {labelText && (
        <label className="label-md" style={{ display: 'block', marginBottom: 12, color: 'var(--color-on-surface-variant)' }}>
          {labelText}
        </label>
      )}
      <div
        onClick={() => !preview && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          aspectRatio,
          borderRadius: 'var(--radius-xl)',
          border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
          backgroundColor: isDragging ? 'var(--color-secondary-container)' : 'var(--color-surface-container-low)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: preview ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'all 0.2s',
        }}
      >
        <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={handleInputChange} />

        {!preview ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-primary)', display: 'block', marginBottom: 8 }}>cloud_upload</span>
            <p className="label-md" style={{ color: 'var(--color-primary)' }}>Click to upload or drag and drop</p>
            <p className="label-sm" style={{ color: 'var(--color-secondary)', marginTop: 4 }}>Images or videos up to 15MB</p>
          </div>
        ) : isVideo ? (
          <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay muted loop playsInline />
        ) : (
          <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {preview && (
          <button
            type="button" onClick={removeFile}
            style={{
              position: 'absolute', top: 8, right: 8,
              backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
              border: 'none', borderRadius: 'var(--radius-full)',
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        )}
      </div>
      {error && (
        <p className="label-sm" style={{ color: 'var(--color-error)', marginTop: 8 }}>{error}</p>
      )}
    </div>
  );
}
