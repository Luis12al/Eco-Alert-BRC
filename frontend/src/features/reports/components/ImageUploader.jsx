import React, { useRef, useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { isValidImage } from '../../../utils/validators.js';
import Button from '../../../components/ui/Button.jsx';

const ImageUploader = ({ onImageSelect, onImageRemove, preview, error }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!isValidImage(file)) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, WebP, máximo 5MB)');
      return;
    }
    onImageSelect(file);
  };

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border-2 border-primary-200">
        <img 
          src={preview} 
          alt="Vista previa" 
          className="w-full h-48 object-cover"
        />
        <button
          type="button"
          onClick={onImageRemove}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
        dragActive 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      
      <Camera className="h-10 w-10 text-gray-400 mx-auto mb-3" />
      <p className="text-sm text-gray-600 mb-2">
        Arrastra una foto aquí o{' '}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          selecciona un archivo
        </button>
      </p>
      <p className="text-xs text-gray-400">JPG, PNG o WebP. Máximo 5MB.</p>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-3 gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Subir foto
      </Button>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUploader;