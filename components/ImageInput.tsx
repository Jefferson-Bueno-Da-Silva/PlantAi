import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './Button';
import { CameraIcon, UploadIcon, XCircleIcon } from './Icon';

interface ImageInputProps {
  onImageSelect: (imageDataUrl: string) => void;
  onClear: () => void;
  currentImage: string | null;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageSelect, onClear, currentImage }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    onClear();
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraActive(false);
    }
  }, [onClear]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    stopCamera();
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if(ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onImageSelect(dataUrl);
      }
      stopCamera();
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleLocalClear = () => {
      stopCamera();
      onClear();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative w-full aspect-video bg-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-600">
        {currentImage ? (
          <>
            <img src={currentImage} alt="Selected" className="w-full h-full object-contain" />
            <button onClick={handleLocalClear} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
              <XCircleIcon className="w-6 h-6" />
            </button>
          </>
        ) : isCameraActive ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400">
            <p className="font-semibold">Sua Imagem Aqui</p>
            <p className="text-sm">Envie um arquivo ou use sua câmera</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isCameraActive ? (
          <>
            <Button onClick={handleCapture} variant="primary">Capturar</Button>
            <Button onClick={stopCamera} variant="secondary">Parar Câmera</Button>
          </>
        ) : (
          <>
            <Button onClick={triggerFileUpload} variant="secondary">
              <UploadIcon className="w-5 h-5 mr-2" />
              Enviar Imagem
            </Button>
            <Button onClick={startCamera} variant="secondary">
              <CameraIcon className="w-5 h-5 mr-2" />
              Usar Câmera
            </Button>
          </>
        )}
      </div>
    </div>
  );
};